import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { AuthByToken } from "./store/state/actions/userActions";
import { ToastContainer } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css";

if (localStorage.accessToken && localStorage.refreshToken) {
  AuthByToken({
    accessToken: localStorage.accessToken,
    refreshToken: localStorage.refreshToken,
  })(store.dispatch);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="light"
    />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
