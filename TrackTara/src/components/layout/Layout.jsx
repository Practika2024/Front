import React, { memo, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import AppSidebar from "./AppSidebar";
import NavDrawer from "./NavDrawer";
import MobileDock from "./MobileDock";
import useAppRoles from "../../hooks/useAppRoles";
import "./layout.css";
import AppSettingsHandler from "./AppSettingsHandler";

const Layout = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const roles = useAppRoles();

  return (
    <>
      <AppSettingsHandler />
      <div className="app-shell">
        <Header
          onOpenMenu={() => setMenuOpen(true)}
          isAuthenticated={isAuthenticated}
        />
        <div className="app-shell-body">
          {isAuthenticated ? <AppSidebar roles={roles} /> : null}
          <main className="app-main">
            <div className="app-main-inner">
              <Outlet />
            </div>
          </main>
        </div>
        {isAuthenticated ? (
          <>
            <MobileDock roles={roles} onOpenMenu={() => setMenuOpen(true)} />
            <NavDrawer
              show={menuOpen}
              onHide={() => setMenuOpen(false)}
              roles={roles}
            />
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
});

export default Layout;
