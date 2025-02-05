import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Package, Users, LogOut } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div>
            {/* Кнопка для відкриття сайдбару */}
            <button
                className="sidebar-toggle-button"
                onClick={toggleSidebar} // Викликає функцію, щоб змінити стан
            >
                <img src="/pngwing.com.png" alt="Меню" />
            </button>

            {/* Бокова панель */}
            <div
                className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
            >
                <h1 className="text-xl font-bold mb-6">TrackTara</h1>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <Link
                                to="/"
                                className="flex items-center p-2 hover:bg-gray-700 rounded"
                            >
                                <Home className="w-5 h-5 mr-2" /> Головна
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="/tara"
                                className="flex items-center p-2 hover:bg-gray-700 rounded"
                            >
                                <Package className="w-5 h-5 mr-2" /> Тара
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="/users"
                                className="flex items-center p-2 hover:bg-gray-700 rounded"
                            >
                                <Users className="w-5 h-5 mr-2" /> Користувачі
                            </Link>
                        </li>
                    </ul>
                </nav>
                <button className="mt-auto flex items-center p-2 hover:bg-red-600 rounded">
                    <LogOut className="w-5 h-5 mr-2" /> Вийти
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
