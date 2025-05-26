import React, { memo, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./layout.css";
import AppSettingsHandler from "./AppSettingsHandler";
import Header from "./Header";

const Layout = memo(() => {
  const [isOpen, setIsOpen] = useState(true);

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

  return (
    <>
      <AppSettingsHandler />
      <div className="navbar-container">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        {isOpen && typeof window !== 'undefined' && window.innerWidth <= 992 && (
          <div className="navbar-backdrop" onClick={() => setIsOpen(false)} />
        )}
        <main className={`main-content${isOpen ? ' menu-open' : ''}`}>
          <Header />
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
});

export default Layout;
