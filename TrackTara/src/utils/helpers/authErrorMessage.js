/**
 * Текст помилки для toast/форми з відповіді axios або мок-об’єкта.
 */
export function getAuthErrorMessage(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (!error?.response) {
    if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
      return "Час очікування відповіді вичерпано. Перевірте з’єднання або спробуйте пізніше.";
    }
    if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
      return "Немає зв’язку з сервером. Переконайтеся, що бекенд запущений (наприклад localhost:5081), або увімкніть моки (VITE_USE_MOCK_API=true).";
    }
    return "Помилка входу. Спробуйте ще раз.";
  }

  if (typeof data === "string") {
    return mapEnglishAuthMessage(data);
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      return mapEnglishAuthMessage(data.message);
    }
    if (typeof data.detail === "string") {
      return data.detail;
    }
    if (data.title && typeof data.title === "string") {
      return data.title;
    }
    if (data.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0];
      const val = firstKey ? data.errors[firstKey] : null;
      if (Array.isArray(val) && val[0]) return String(val[0]);
      if (typeof val === "string") return val;
    }
  }

  if (status === 401 || status === 403) {
    return "Невірний email або пароль.";
  }
  return "Не вдалося увійти. Спробуйте ще раз.";
}

function mapEnglishAuthMessage(text) {
  const t = String(text).trim();
  const map = {
    "Invalid email or password": "Невірний email або пароль.",
    "Invalid email or password.": "Невірний email або пароль.",
    "Invalid credentials": "Невірний email або пароль.",
    "User already exists": "Користувач з таким email вже зареєстрований.",
  };
  return map[t] || t;
}

export function getAuthFieldErrors(error) {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return {};
  const code = data.code;
  const msg = typeof data.message === "string" ? data.message : "";

  if (code === "EMAIL_NOT_FOUND") {
    return { email: msg || "Користувача з таким email не знайдено." };
  }
  if (code === "WRONG_PASSWORD") {
    return { password: msg || "Невірний пароль." };
  }
  return {};
}
