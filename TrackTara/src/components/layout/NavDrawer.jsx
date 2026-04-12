import { NavLink } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { getNavSections, getHomePath } from "./warehouseNav";
import { SidebarNavIcon } from "./sidebarNavIcons";
export default function NavDrawer({ show, onHide, roles }) {
  const sections = getNavSections(roles);
  const homePath = getHomePath(roles);

  const linkClass = ({ isActive }) =>
    `app-drawer-link${isActive ? " app-drawer-link--active" : ""}`;

  return (
    <Offcanvas show={show} onHide={onHide} placement="start" className="app-drawer">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <NavLink
            to={homePath}
            className="d-flex align-items-center gap-2 text-decoration-none text-dark"
            onClick={onHide}
          >
            <img src="/image-removebg-preview.png" height={36} alt="" />
            <span>TaraTrack</span>
          </NavLink>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="pt-0 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <div className="app-drawer-section-title">{section.title}</div>
            <ul className="list-unstyled mb-0">
              {section.items.map((item) => (
                <li key={`${section.id}-${item.to}`}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={(p) =>
                      `${linkClass(p)} app-drawer-link-inner`
                    }
                    onClick={onHide}
                  >
                    <span className="app-drawer-link-icon">
                      <SidebarNavIcon to={item.to} />
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
