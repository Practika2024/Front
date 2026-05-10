/** Мінімальний JWT для тестів (jwt-decode читає payload без перевірки підпису). */
export function makeAccessToken(payload) {
  const enc = (obj) => btoa(JSON.stringify(obj));
  return `${enc({ alg: "none", typ: "JWT" })}.${enc(payload)}.x`;
}
