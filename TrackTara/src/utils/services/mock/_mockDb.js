// Спільне сховище мок-даних: один JSON у localStorage, реактивні Proxy-об’єкти,
// автоматичне збереження після будь-якої мутації, синхронізація між вкладками
// через подію `storage`. Ціль — стабільна робота демо без бекенду на Vercel.

const STORAGE_KEY = 'tt:mockdb:v1';

const proxies = new Map(); // table name -> { proxy, target }
const wrapped = new WeakMap(); // raw -> proxy
const targets = new WeakMap(); // proxy -> raw

let pendingSave = false;
let suppressSave = false;
const subscribers = new Set();

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function safeClone(value) {
  try {
    if (typeof structuredClone === 'function') return structuredClone(value);
  } catch {
    /* noop */
  }
  return JSON.parse(JSON.stringify(value));
}

function isPlainContainer(value) {
  if (value == null || typeof value !== 'object') return false;
  if (value instanceof Date) return false;
  if (Array.isArray(value)) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function readSnapshot() {
  if (!isBrowser) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persistNow() {
  if (!isBrowser || suppressSave) return;
  const snapshot = {};
  for (const [name, entry] of proxies) snapshot[name] = entry.target;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    if (typeof console !== 'undefined') console.warn('[mockDb] persist failed:', error);
  }
  notify();
}

function notify() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      /* noop */
    }
  });
}

function scheduleSave() {
  if (pendingSave) return;
  pendingSave = true;
  const flush = () => {
    pendingSave = false;
    persistNow();
  };
  if (typeof queueMicrotask === 'function') queueMicrotask(flush);
  else Promise.resolve().then(flush);
}

function reactive(target) {
  if (!isPlainContainer(target)) return target;
  if (wrapped.has(target)) return wrapped.get(target);

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (isPlainContainer(target[i])) target[i] = reactive(target[i]);
    }
  } else {
    for (const key of Object.keys(target)) {
      if (isPlainContainer(target[key])) target[key] = reactive(target[key]);
    }
  }

  const proxy = new Proxy(target, {
    set(obj, prop, value, receiver) {
      const next = isPlainContainer(value) ? reactive(value) : value;
      const ok = Reflect.set(obj, prop, next, receiver);
      if (ok) scheduleSave();
      return ok;
    },
    deleteProperty(obj, prop) {
      const had = prop in obj;
      const ok = Reflect.deleteProperty(obj, prop);
      if (ok && had) scheduleSave();
      return ok;
    },
  });

  wrapped.set(target, proxy);
  targets.set(proxy, target);
  return proxy;
}

function rawOf(proxy) {
  return targets.get(proxy) ?? proxy;
}

function applyExternalSnapshot(parsed) {
  suppressSave = true;
  try {
    for (const [name, entry] of proxies) {
      if (!Object.prototype.hasOwnProperty.call(parsed, name)) continue;
      const next = parsed[name];
      const target = entry.target;
      if (Array.isArray(target)) {
        const list = Array.isArray(next) ? next : [];
        target.splice(
          0,
          target.length,
          ...list.map((v) => (isPlainContainer(v) ? reactive(safeClone(v)) : v)),
        );
      } else if (target && typeof target === 'object') {
        for (const key of Object.keys(target)) delete target[key];
        if (next && typeof next === 'object') {
          for (const [k, v] of Object.entries(next)) {
            target[k] = isPlainContainer(v) ? reactive(safeClone(v)) : v;
          }
        }
      }
    }
  } finally {
    suppressSave = false;
  }
  notify();
}

if (isBrowser) {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || event.newValue == null) return;
    let parsed;
    try {
      parsed = JSON.parse(event.newValue);
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== 'object') return;
    applyExternalSnapshot(parsed);
  });
}

/**
 * Створює реактивну таблицю-масив або реактивний обʼєкт зі стартовим seed.
 * При першому виклику відновлює дані з localStorage; будь-яка наступна мутація
 * автоматично зберігається; зміни з інших вкладок відображаються тут одразу.
 */
export function defineTable(name, seed) {
  if (proxies.has(name)) return proxies.get(name).proxy;

  const stored = readSnapshot();
  const initial = Object.prototype.hasOwnProperty.call(stored, name)
    ? stored[name]
    : safeClone(seed);

  const proxy = reactive(initial);
  proxies.set(name, { proxy, target: initial });

  if (!Object.prototype.hasOwnProperty.call(stored, name)) {
    scheduleSave();
  }

  return proxy;
}

/**
 * Замінити вміст таблиці-масиву inplace — використовується там, де раніше було
 * `let mockX = mockX.filter(...)` (reassign), бо проксі реагує лише на mutate.
 */
export function replaceArray(proxy, newArr) {
  const target = rawOf(proxy);
  if (!Array.isArray(target)) {
    throw new Error('replaceArray: target is not an array');
  }
  target.splice(
    0,
    target.length,
    ...newArr.map((v) => (isPlainContainer(v) ? reactive(safeClone(v)) : v)),
  );
}

/** Скинути всі мок-таблиці до стартових seed-значень (наступне завантаження). */
export function resetAllMocks() {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEY);
  if (typeof location !== 'undefined') location.reload();
}

/** Підписка на будь-яку зміну (своя або з іншої вкладки). */
export function subscribeMockDb(cb) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

/**
 * Глибока копія значення (без проксі, без посилань). Використовуйте у мок-сервісах
 * при поверненні даних назовні: інакше Redux/Immer заморозить внутрішній target
 * і наступні мутації проксі-сховища впадуть з TypeError.
 */
export function clone(value) {
  if (value == null) return value;
  return safeClone(value);
}
