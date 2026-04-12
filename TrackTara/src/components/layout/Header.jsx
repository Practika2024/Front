import React, { memo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import useActions from "../../hooks/useActions";
import userImage from "../../hooks/userImage";
import { useNavigate } from "react-router-dom";
import SectorsManagement from "./SectorsManagement";
import useAppRoles from "../../hooks/useAppRoles";
import { getHomePath } from "./warehouseNav";

const Header = memo(({ onOpenMenu, isAuthenticated }) => {
  const currentUser = useSelector((store) => store.user.currentUser);
  const logoutUser = useActions().logoutUser;
  const navigate = useNavigate();

  const logoutHandler = () => {
    logoutUser();
    navigate("/login");
  };

  const [showSectorsModal, setShowSectorsModal] = useState(false);
  const userRoles = useAppRoles();
  const isAdministrator = userRoles.includes("Administrator");
  const homePath = getHomePath(userRoles);

  return (
    <header className="app-topbar">
      <nav className="navbar navbar-expand-lg navbar-dark app-topbar-inner px-2 px-sm-3">
        <div className="container-fluid app-topbar-container">
          {isAuthenticated ? (
            <button
              type="button"
              className="btn btn-link text-white d-lg-none p-2 app-topbar-icon-btn"
              onClick={onOpenMenu}
              aria-label="Відкрити меню"
            >
              <Menu size={26} />
            </button>
          ) : null}

          <NavLink
            to={isAuthenticated ? homePath : "/"}
            className="navbar-brand d-flex align-items-center gap-2 me-auto me-lg-0"
          >
            <img
              src="/image-removebg-preview.png"
              height={isAuthenticated ? 38 : 44}
              alt=""
              className="d-none d-lg-inline-flex"
            />
            <img
              src="/image-removebg-preview.png"
              height={40}
              alt="TaraTrack"
              className="d-lg-none"
            />
            <span className="d-none d-sm-inline fw-semibold app-topbar-title">
              TaraTrack
            </span>
          </NavLink>

          <div className="d-flex align-items-center gap-1 gap-sm-2 ms-auto app-topbar-actions">
            {isAuthenticated ? (
              <>
                {isAdministrator && (
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-light btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Склад
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => setShowSectorsModal(true)}
                        >
                          Сектори та ряди
                        </button>
                      </li>
                    </ul>
                  </div>
                )}

                {currentUser?.email ? (
                  <div
                    className="app-topbar-email-wrap d-none d-sm-flex flex-column align-items-end justify-content-center text-end me-1"
                    title={currentUser.email}
                  >
                    <span className="app-topbar-email text-truncate">
                      {currentUser.email}
                    </span>
                  </div>
                ) : null}

                <div className="dropdown">
                  <a
                    className="dropdown-toggle d-flex align-items-center text-white text-decoration-none p-1"
                    href="#"
                    id="userMenu"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={userImage(currentUser?.image)}
                      className="rounded-circle"
                      height={32}
                      width={32}
                      alt=""
                    />
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userMenu"
                  >
                    <li className="px-3 py-2 border-bottom small">
                      <div className="fw-semibold text-truncate" title={currentUser?.name}>
                        {currentUser?.name?.trim() || "Користувач"}
                      </div>
                      <div className="text-muted text-truncate" title={currentUser?.email}>
                        {currentUser?.email}
                      </div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Профіль
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" type="button" onClick={logoutHandler}>
                        Вихід
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-light btn-sm">
                Вхід
              </Link>
            )}
          </div>
        </div>
      </nav>
      <SectorsManagement
        show={showSectorsModal}
        onHide={() => setShowSectorsModal(false)}
      />
    </header>
  );
});

export default Header;
