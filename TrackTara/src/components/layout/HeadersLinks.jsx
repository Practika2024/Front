import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HeadersLinks = () => {
    const user = useSelector((state) => state.user.currentUser);
    const userRoles = user ? (Array.isArray(user.role) ? user.role : [user.role]) : [];

    return (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <a className="navbar-brand d-flex align-items-center" href="#">
                <img
                    src="/image-removebg-preview.png"
                    height="50"
                    alt="TaraTrack Logo"
                    loading="lazy"
                />
                <h5 className="navbar-title fs-5 ms-3 mb-0">TaraTrack</h5>
            </a>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-3">
                <li className="nav-item">
                    <Link className="nav-link fs-5" to="/">Головна</Link>
                </li>
                {userRoles.includes("Operator") || userRoles.includes("Administrator") ? (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link fs-5" to="/tare">Контейнери</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link fs-5" to="/products">Продукти</Link>
                        </li>
                    </>
                ) : null}
                {userRoles.includes("Administrator") ? (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link fs-5" to="/productType">Типи продуктів</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fs-5" to="/container/containerTypes">Типи контейнерів</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fs-5" to="/users">Користувачі</Link>
                        </li>
                    </>
                ) : null}
            </ul>
        </div>
    );
};

export default memo(HeadersLinks);