import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import AppRouter from "./router/AppRouter";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`flex h-screen ${isSidebarOpen ? "sidebar-open" : ""}`}>
            {/* Сайдбар */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar} // Функція для зміни стану
            />

            {/* Основний контент */}
            <div
                className={`flex-1 p-4 transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-0"
                }`} // Зсув основного контенту при відкритому сайдбарі
            >
                <AppRouter />
            </div>
        </div>
    );
}

export default App;
