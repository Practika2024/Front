import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Система відслідковування тари</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/add-tare")}
            >
                Додати тару
            </button>
        </div>
    );
};

export default HomePage;
