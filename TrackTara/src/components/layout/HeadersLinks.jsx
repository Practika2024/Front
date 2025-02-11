import React, { memo } from "react";
import { Link } from "react-router-dom";

const HeadersLinks = () => {
  return (
      <div className="collapse navbar-collapse d-flex justify-content-start align-items-center" id="navbarSupportedContent">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
              src="public/image-removebg-preview.png" // Замінити на новий логотип
              height="50"
              alt="TaraTrack Logo"
              loading="lazy"
          />
          <h5 className="navbar-title fs-5 ms-3 mb-0">TaraTrack</h5>
        </a>
        <ul className="navbar-nav ms-5 mb-2 mb-lg-0 gap-3">
          <li className="nav-item">
            <Link className="nav-link fs-5" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link fs-5" to="/tare">Containers</Link>
          </li>
        </ul>
      </div>
  );
};

export default memo(HeadersLinks);
