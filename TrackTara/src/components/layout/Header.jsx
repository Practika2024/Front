import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useActions from "../../hooks/useActions";
import { isEmailConfirmed } from "../../store/state/actions/userActions";
import { IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { FaSun, FaMoon } from 'react-icons/fa';
import './layout.css';

const Navbar = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useActions();
  const currentUser = useSelector((store) => store.user.currentUser);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const [emailConfirmed, setEmailConfirmed] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const userRoles = currentUser ? (Array.isArray(currentUser.role) ? currentUser.role : [currentUser.role]) : [];

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button className="navbar-toggle" onClick={toggleNavbar}>
        <MenuIcon />
      </button>
      <div className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-theme-toggle" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 24px 12px 24px'}}>
          <IconButton aria-label="Змінити тему" onClick={toggleTheme} size="small">
            {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
          </IconButton>
        </div>
        <Link to="/" className="navbar-brand">
          <img src="/image-removebg-preview.png" alt="TrackTara Logo" />
          <h5>TrackTara</h5>
        </Link>
        <nav>
          <div className="navbar-section">
            <div className="navbar-section-title">Основне</div>
            <ul className="navbar-nav">
              <li className="navbar-item">
                <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
                  Головна
                </Link>
              </li>
            </ul>
          </div>
          {(userRoles.includes("Operator") || userRoles.includes("Administrator")) && (
            <div className="navbar-section">
              <div className="navbar-section-title">Управління</div>
              <ul className="navbar-nav">
                <li className="navbar-item">
                  <Link to="/tare" className={`navbar-link ${isActive('/tare') ? 'active' : ''}`}>
                    Контейнери
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/products" className={`navbar-link ${isActive('/products') ? 'active' : ''}`}>
                    Продукти
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {userRoles.includes("Administrator") && (
            <div className="navbar-section">
              <div className="navbar-section-title">Адміністрування</div>
              <ul className="navbar-nav">
                <li className="navbar-item">
                  <Link to="/productType" className={`navbar-link ${isActive('/productType') ? 'active' : ''}`}>
                    Типи продуктів
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/container/containerTypes" className={`navbar-link ${isActive('/container/containerTypes') ? 'active' : ''}`}>
                    Типи контейнерів
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/users" className={`navbar-link ${isActive('/users') ? 'active' : ''}`}>
                    Користувачі
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/approval-requests" className={`navbar-link ${isActive('/approval-requests') ? 'active' : ''}`}>
                    Підтвердження
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
        <div className="navbar-footer">
          <div className="user-section">
            <span className="user-email">{currentUser.email}</span>
            {!emailConfirmed && (
              <button 
                className="navbar-link" 
                onClick={() => navigate("/email-confirmation")}
                style={{ color: '#dc3545' }}
              >
                <i className="fas fa-envelope"></i>
                Підтвердити Email
              </button>
            )}
            <button className="logout-btn" onClick={logoutHandler}>
              <i className="fas fa-sign-out-alt"></i>
              Вихід
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

export default Navbar;
