/**
 * Єдине джерело пунктів меню в стилі WMS: групи «Склад / Продажі / Адмін».
 */
export function getNavSections(roles) {
  const has = (r) => roles.includes(r);
  const isAdmin = has("Administrator");
  const isOp = has("Operator") || isAdmin;
  const isSales = has("SalesManager") || isAdmin;
  const onlySales =
    has("SalesManager") && !has("Operator") && !has("Administrator");

  const sections = [];

  if (isOp) {
    sections.push({
      id: "warehouse",
      title: "Склад",
      subtitle: "Збір, пакування, тара",
      items: [
        { to: "/", label: "Стартова панель", end: true },
        { to: "/warehouse/pick", label: "Збір замовлень", end: true },
        { to: "/packing", label: "Пакування в коробки", end: true },
        { to: "/tare", label: "Контейнери", end: false },
        { to: "/products", label: "Товари (SKU)", end: true },
      ],
    });
  }

  if (isSales) {
    const salesItems = [
      { to: "/sales", label: "Панель продажів", end: true },
      { to: "/sales/clients", label: "Клієнти та траси", end: true },
      { to: "/orders/create", label: "Нове замовлення", end: true },
    ];
    if (onlySales) {
      salesItems.push({ to: "/products", label: "Каталог товарів", end: true });
    }
    sections.push({
      id: "sales",
      title: "Продажі",
      subtitle: "Замовлення та маршрути",
      items: salesItems,
    });
  }

  if (isAdmin) {
    sections.push({
      id: "admin",
      title: "Адміністрування",
      subtitle: "Довідники та облік",
      items: [
        { to: "/users", label: "Користувачі", end: true },
        { to: "/productType", label: "Типи продуктів", end: true },
        { to: "/container/containerTypes", label: "Типи контейнерів", end: true },
        { to: "/carts/registry", label: "Реєстр візків", end: true },
        { to: "/brakimag", label: "Реєстр нестач", end: true },
      ],
    });
  }

  return sections;
}

/** До 3 кнопок у нижньому доку; решта розділів — у offcanvas «Меню». */
export function getMobileDockItems(roles) {
  const has = (r) => roles.includes(r);
  const isAdmin = has("Administrator");
  const isOp = has("Operator") || isAdmin;
  const onlySales =
    has("SalesManager") && !has("Operator") && !has("Administrator");

  if (onlySales) {
    return [
      { to: "/sales", label: "Панель", icon: "layout", end: true },
      { to: "/sales/clients", label: "Клієнти", icon: "truck", end: true },
      { to: "/orders/create", label: "Замовл.", icon: "plus", end: true },
    ];
  }

  if (isOp) {
    return [
      { to: "/", label: "Старт", icon: "home", end: true },
      { to: "/warehouse/pick", label: "Збір", icon: "clipboard", end: true },
      { to: "/packing", label: "Коробки", icon: "package", end: true },
    ];
  }

  return [{ to: "/", label: "Головна", icon: "home", end: true }];
}

export function getHomePath(roles) {
  const onlySales =
    roles.includes("SalesManager") &&
    !roles.includes("Operator") &&
    !roles.includes("Administrator");
  return onlySales ? "/sales" : "/";
}
