import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import HeadersLinks from "./HeadersLinks";
import useActions from "../../hooks/useActions";
import { isEmailConfirmed } from "../../store/state/actions/userActions";

const Header = memo(() => {
  const navigate = useNavigate();
  const { logoutUser } = useActions();

  const currentUser = useSelector((store) => store.user.currentUser);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const userId = currentUser?.id;

  const [emailConfirmed, setEmailConfirmed] = useState(true);

  useEffect(() => {
    const checkEmailConfirmation = async () => {
      try {
        const confirmed = await isEmailConfirmed(currentUser.id)();
        setEmailConfirmed(confirmed);
      } catch (error) {
        console.error("Error checking email confirmation:", error);
      }
    };

    if (currentUser?.id) {
      checkEmailConfirmation();
    }
  }, [currentUser]);




  const logoutHandler = () => {
    logoutUser();
    navigate("/");
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div
            className="container-fluid d-flex justify-content-between align-items-center"
            style={{ minHeight: "80px" }}
        >
          <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <HeadersLinks />
          </div>

          <div className="icon-block d-flex align-items-center">
            {isAuthenticated ? (
                <div className="dropdown">
                  <a
                      className="dropdown-toggle d-flex align-items-center hidden-arrow"
                      href="#"
                      id="navbarDropdownMenuAvatar"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        marginLeft: "5%",
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                        borderBottom: "2px solid black",
                      }}
                  >
                    {currentUser.email}
                  </a>
                  <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="navbarDropdownMenuAvatar"
                      style={{ zIndex: 1050 }}
                  >
                    {!emailConfirmed && (
                        <li>
                          <button
                              className="dropdown-item"
                              onClick={() => navigate("/email-confirmation")}
                          >
                            Підтвердити Email
                          </button>
                        </li>
                    )}
                    <li>
                      <button className="dropdown-item" onClick={logoutHandler}>
                        Вихід
                      </button>
                    </li>
                  </ul>
                </div>
            ) : (
                <div className="d-flex gap-3">
                  <Link to="/login" className="btn btn-outline-primary">
                    Вхід/Реєстрація
                  </Link>
                </div>
            )}
          </div>
        </div>
      </nav>
  );
});

export default Header;
