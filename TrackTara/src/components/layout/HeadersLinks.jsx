import React, { memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isEmailConfirmed } from "../../store/state/actions/userActions";

const HeadersLinks = ({ hideLinksOnMobile, isSidebar }) => {
    const user = useSelector((state) => state.user.currentUser);
    const userRoles = user ? (Array.isArray(user.role) ? user.role : [user.role]) : [];
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector((store) => store.user.currentUser);
    const userId = currentUser?.id;
    const location = useLocation();

    useEffect(() => {
        const checkEmailStatus = async () => {
            if (userId) {
                const confirmed = await isEmailConfirmed(userId);
                setEmailConfirmed(confirmed);
            }
        };
        checkEmailStatus();
    }, [userId]);

    // Функція для визначення активної вкладки
    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const navClass = isSidebar ? 'sidebar-nav' : `header-nav${hideLinksOnMobile ? ' hide-on-mobile' : ''}`;
    const linkClass = (path) => {
        let base = isSidebar ? 'sidebar-nav-link' : 'header-nav-link';
        if (isActive(path)) base += ' active';
        return base;
    };

    return (
        <nav className="header-links-nav">
            <Link className="navbar-brand d-flex align-items-center" to="/">
                <img
                    src="/image-removebg-preview.png"
                    height="50"
                    alt="TaraTrack Logo"
                    loading="lazy"
                />
                <h5 className="navbar-title fs-5 ms-3 mb-0">TaraTrack</h5>
            </Link>
            <ul className={navClass}>
                <li>
                    <Link className={linkClass("/")} to="/">Головна</Link>
                </li>
                {(userRoles.includes("Operator") || userRoles.includes("Administrator")) && (
                    <>
                        <li>
                            <Link className={linkClass("/tare")} to="/tare">Контейнери</Link>
                        </li>
                        <li>
                            <Link className={linkClass("/products")} to="/products">Продукти</Link>
                        </li>
                    </>
                )}
                {userRoles.includes("Administrator") && (
                    <>
                        <li>
                            <Link className={linkClass("/productType")} to="/productType">Типи продуктів</Link>
                        </li>
                        <li>
                            <Link className={linkClass("/container/containerTypes")} to="/container/containerTypes">Типи контейнерів</Link>
                        </li>
                        <li>
                            <Link className={linkClass("/users")} to="/users">Користувачі</Link>
                        </li>
                        <li>
                            <Link className={linkClass("/approval-requests")} to="/approval-requests">Підтвердження</Link>
                        </li>
                        <li>
                            <Link className={linkClass("/reminder-types")} to="/reminder-types">Типи нагадувань</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default memo(HeadersLinks);