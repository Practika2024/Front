import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "@mui/material";
import { ShoppingCart, Favorite } from "@mui/icons-material";
import HeadersLinks from "./HeadersLinks";
import useActions from "../../hooks/useActions";
import userImage from "../../hooks/userImage";
import { useNavigate } from "react-router-dom";

const Header = memo(() => {
  const currentUser = useSelector((store) => store.user.currentUser);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const logoutUser = useActions().logoutUser;
  const navigate = useNavigate();
  const favoriteProducts = useSelector((state) => state.user.favoriteProducts);
  const cartItems = useSelector((state) => state.cartItem.cartItemList);

  const logoutHandler = () => {
    logoutUser();
    navigate("/");
  };

  const userId = currentUser?.id;
  const userCartItems = cartItems.filter((item) => item.userId === userId);

  return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid d-flex justify-content-between align-items-center" style={{ minHeight: "80px" }}>
          <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Навігаційні посилання */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <HeadersLinks />
          </div>

          {/* Блок іконок, який буде адаптивним */}
          <div className="icon-block d-flex align-items-center">
            <Link to="/favoriteProducts" className="text-reset me-3">
              <Badge color="error" badgeContent={favoriteProducts.length}>
                <Favorite />
              </Badge>
            </Link>

            <Link to="/cartItems" className="text-reset me-3">
              <Badge color="error" badgeContent={userCartItems.length}>
                <ShoppingCart />
              </Badge>
            </Link>

            {isAuthenticated ? (
                <div className="dropdown">
                  <a
                      className="dropdown-toggle d-flex align-items-center hidden-arrow"
                      href="#"
                      id="navbarDropdownMenuAvatar"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                  >
                    <img
                        src={userImage(currentUser?.image)}
                        className="rounded-circle"
                        height="25"
                        width="25"
                        alt="User Avatar"
                        loading="lazy"
                    />
                  </a>
                  <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="navbarDropdownMenuAvatar"
                      style={{ zIndex: 1050 }}
                  >
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
