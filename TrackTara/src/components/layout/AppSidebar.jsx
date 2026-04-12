import { memo } from "react";
import { NavLink } from "react-router-dom";
import { getNavSections, getHomePath } from "./warehouseNav";
import { SidebarNavIcon } from "./sidebarNavIcons";

const linkClass = ({ isActive }) =>
  `app-sidebar-link${isActive ? " app-sidebar-link--active" : ""}`;

const AppSidebar = memo(({ roles }) => {
  const sections = getNavSections(roles);
  const homePath = getHomePath(roles);

  if (!sections.length) return null;

  return (
    <aside className="app-sidebar d-none d-lg-flex" aria-label="Головне меню складу">
      <div className="app-sidebar-brand">
        <NavLink to={homePath} className="app-sidebar-brand-link">
          <div className="app-sidebar-logo-wrap">
            <img
              src="/image-removebg-preview.png"
              height={42}
              width="auto"
              alt=""
              className="app-sidebar-logo"
            />
          </div>
          <div className="app-sidebar-brand-text">
            <div className="app-sidebar-brand-title">TaraTrack</div>
            <div className="app-sidebar-brand-sub">Облік складу</div>
          </div>
        </NavLink>
      </div>

      <nav className="app-sidebar-nav">
        {sections.map((section) => (
          <div key={section.id} className="app-sidebar-section-card">
            <div className="app-sidebar-section-head">
              <span className="app-sidebar-section-title">{section.title}</span>
              {section.subtitle ? (
                <span className="app-sidebar-section-sub">{section.subtitle}</span>
              ) : null}
            </div>
            <ul className="app-sidebar-list list-unstyled mb-0">
              {section.items.map((item) => (
                <li key={`${section.id}-${item.to}`}>
                  <NavLink to={item.to} end={item.end} className={linkClass}>
                    <span className="app-sidebar-link-icon" aria-hidden>
                      <SidebarNavIcon to={item.to} />
                    </span>
                    <span className="app-sidebar-link-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
});

export default AppSidebar;
