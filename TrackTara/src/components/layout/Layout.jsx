import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./layout.css";
import AppSettingsHandler from "./AppSettingsHandler";

const Layout = memo(() => {
  return (
    <>
      <AppSettingsHandler />
      <div className="wrapper">
        <Header />
        <div className="containerLayout">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
});

export default Layout;
