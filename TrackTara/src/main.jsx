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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './i18n';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

if (localStorage.accessToken && localStorage.refreshToken) {
  AuthByToken({
    accessToken: localStorage.accessToken,
    refreshToken: localStorage.refreshToken,
  })(store.dispatch);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  </StrictMode>
);
