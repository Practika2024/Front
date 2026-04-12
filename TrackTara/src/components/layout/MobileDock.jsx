import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  LayoutDashboard,
  Package,
  Box,
  Truck,
  Plus,
  Home,
  Menu,
} from "lucide-react";
import { getMobileDockItems } from "./warehouseNav";

const icons = {
  clipboard: ClipboardList,
  layout: LayoutDashboard,
  package: Package,
  box: Box,
  truck: Truck,
  plus: Plus,
  home: Home,
};

/**
 * Нижня панель: 3 швидкі пункти + «Меню» (повний список у drawer).
 */
export default function MobileDock({ roles, onOpenMenu }) {
  const items = getMobileDockItems(roles);
  if (!items.length) return null;

  const pillClass = ({ isActive }) =>
    `app-dock-item${isActive ? " app-dock-item--active" : ""}`;

  return (
    <nav className="app-mobile-dock d-lg-none" aria-label="Швидка навігація">
      {items.map((item) => {
        const Icon = icons[item.icon] || Home;
        return (
          <NavLink
            key={item.to + String(item.end)}
            to={item.to}
            end={item.end}
            className={pillClass}
          >
            <Icon className="app-dock-icon" aria-hidden />
            <span className="app-dock-label">{item.label}</span>
          </NavLink>
        );
      })}
      <button
        type="button"
        className="app-dock-item app-dock-item--btn"
        onClick={onOpenMenu}
        aria-label="Відкрити повне меню"
      >
        <Menu className="app-dock-icon" aria-hidden />
        <span className="app-dock-label">Меню</span>
      </button>
    </nav>
  );
}
