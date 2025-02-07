import React, { memo } from "react";
import { Link } from "react-router-dom";

const HeadersLinks = () => {
  return (
    <div>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <a className="navbar-brand mt-2 mt-lg-0" href="#">
          <img
            src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
            height="15"
            alt="MDB Logo"
            loading="lazy"
          />
        </a>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/electronicItem">Electronic Item</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default memo(HeadersLinks);
