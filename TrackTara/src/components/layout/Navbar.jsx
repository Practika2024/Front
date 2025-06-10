import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useActions from "../../hooks/useActions";
import { isEmailConfirmed } from "../../store/state/actions/userActions";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { FaSun, FaMoon } from 'react-icons/fa';
import './layout.css';

const Navbar = memo(({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useActions();
  const currentUser = useSelector((store) => store.user.currentUser);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const [emailConfirmed, setEmailConfirmed] = useState(true);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Run on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoutHandler = () => {
    logoutUser();
    navigate("/");
  };

  const toggleNavbar = () => setIsOpen((prev) => !prev);
  const closeNavbar = () => setIsOpen(false);
  const openNavbar = () => setIsOpen(true);
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
      {!isOpen && (
        <button className="navbar-fab" onClick={openNavbar} aria-label="Відкрити меню">
          <MenuIcon fontSize="inherit" />
        </button>
      )}
      {isOpen && (
        <div className={`navbar${theme === 'dark' ? ' navbar-dark' : ''} open`}>
          <button className="navbar-close-btn" onClick={closeNavbar} aria-label="Закрити меню">
            <CloseIcon fontSize="inherit" />
          </button>
          <Link to="/" className="navbar-brand">
            <img src="/image-removebg-preview.png" alt="TrackTara Logo" />
            <h5>TrackTara</h5>
          </Link>
          <div className="navbar-sections-wrapper">
            <nav>
              <div className="navbar-section">
                <div className="navbar-section-title">Основне</div>
                <ul className="navbar-nav">
                  <li className="navbar-item">
                    <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>Головна</Link>
                  </li>
                </ul>
              </div>
              {(userRoles.includes("Operator") || userRoles.includes("Administrator")) && (
                <div className="navbar-section">
                  <div className="navbar-section-title">Управління</div>
                  <ul className="navbar-nav">
                    <li className="navbar-item">
                      <Link to="/tare" className={`navbar-link ${isActive('/tare') ? 'active' : ''}`}>Контейнери</Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/products" className={`navbar-link ${isActive('/products') ? 'active' : ''}`}>Продукти</Link>
                    </li>
                  </ul>
                </div>
              )}
              {userRoles.includes("Administrator") && (
                <div className="navbar-section">
                  <div className="navbar-section-title">Адміністрування</div>
                  <ul className="navbar-nav">
                    <li className="navbar-item">
                      <Link to="/productType" className={`navbar-link ${isActive('/productType') ? 'active' : ''}`}>Типи продуктів</Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/container/containerTypes" className={`navbar-link ${isActive('/container/containerTypes') ? 'active' : ''}`}>Типи контейнерів</Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/reminder-types" className={`navbar-link ${isActive('/reminder-types') ? 'active' : ''}`}>Типи нагадувань</Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/users" className={`navbar-link ${isActive('/users') ? 'active' : ''}`}>Користувачі</Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/approval-requests" className={`navbar-link ${isActive('/approval-requests') ? 'active' : ''}`}>Підтвердження</Link>
                    </li>

                  </ul>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
});

export default Navbar;
