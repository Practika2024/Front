import "./layout.css";
import { Link, useNavigate } from "react-router-dom";
import useActions from "../../hooks/useActions";
import { useSelector } from "react-redux";
import userImage from "../../hooks/userImage";
import { memo } from "react";
import HeadersLinks from "./HeadersLinks";
import { Badge } from "@mui/material";
import {ShoppingCart, Favorite} from "@mui/icons-material";

const adminPages = [
  { title: "Categories", path: "/categories" },
  { title: "Manufacturers", path: "/manufacturers" },
  { title: "Users", path: "/users" },
  { title: "Products", path: "/products" },
];

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
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
        <div className="container header-container">
          <button
            data-mdb-collapse-init
            className="navbar-toggler"
            type="button"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <HeadersLinks />

          <div className="d-flex align-items-center">
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

            <a className="text-reset me-2" href="#">
              <i className="fas fa-bell"></i>
            </a>

            {(Array.isArray(currentUser?.role)
              ? currentUser?.role.includes("Administrator")
              : currentUser?.role === "Administrator") && (
              <div className="dropdown mx-2">
                <a
                  className="text-reset dropdown-toggle hidden-arrow"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="badge rounded-pill badge-notification bg-danger">
                    Admin
                  </span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {adminPages.map((page) => (
                    <li key={page.path}>
                      <Link className="dropdown-item" to={page.path}>
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                >
                  {(Array.isArray(currentUser?.role)
                    ? currentUser?.role.includes("User")
                    : currentUser?.role === "User") && (
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        My Profile
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link className="dropdown-item" to="/settings">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logoutHandler}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-3">
                <Link to="/login" className="btn btn-outline-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
});

export default Header;
