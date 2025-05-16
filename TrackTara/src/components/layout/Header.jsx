import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HeadersLinks from "./HeadersLinks";
import useActions from "../../hooks/useActions";
import { isEmailConfirmed } from "../../store/state/actions/userActions";
import { Avatar, IconButton, Drawer } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import './layout.css';

const Header = memo(() => {
  const navigate = useNavigate();
  const { logoutUser } = useActions();
  const currentUser = useSelector((store) => store.user.currentUser);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const [emailConfirmed, setEmailConfirmed] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Відкриття/закриття сайдбару
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <header className="custom-header shadow-sm">
      <div className="header-left">
        {/* Бургер-іконка для мобільного меню */}
        <div className="burger-menu">
          <IconButton onClick={handleDrawerOpen} className="burger-btn" size="large">
            <MenuIcon fontSize="inherit" />
          </IconButton>
        </div>
        <HeadersLinks hideLinksOnMobile />
      </div>
      <div className="header-right">
        {isAuthenticated ? (
          <div className="dropdown">
            <button
              className="dropdown-toggle user-btn"
              id="navbarDropdownMenuAvatar"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', marginRight: 1 }}>
                {currentUser.email?.[0]?.toUpperCase() || '?'}
              </Avatar>
              <span className="user-email">{currentUser.email}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
              {!emailConfirmed && (
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/email-confirmation")}>Підтвердити Email</button>
                </li>
              )}
              <li>
                <button className="dropdown-item" onClick={logoutHandler}>Вихід</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline-primary">Вхід/Реєстрація</Link>
        )}
      </div>
      {/* Drawer для мобільного меню */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <div style={{ width: 260, padding: 16 }} onClick={handleDrawerClose}>
          <HeadersLinks isSidebar />
        </div>
      </Drawer>
    </header>
  );
});

export default Header;
