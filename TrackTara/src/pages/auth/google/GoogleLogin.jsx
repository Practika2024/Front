import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import useActions from "../../../hooks/useActions";

const GoogleLogin = () => {

    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);
    const { externalLoginUser } = useActions();

      useEffect(() => {
        if (isAuthenticated) {
          navigate("/");
        }
      }, [isAuthenticated, navigate]);
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

  const handleLoginSuccess = async (res) => {
    console.log("Login google result", res);
    const { credential } = res;

    try {
      console.log("request", {
        token: credential,
        provider: "Google",
      });
      const response =  await externalLoginUser({
        token: credential,
        provider: "Google",
      })
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success("Успішний вхід!");
        navigate("/");
      }
      console.log("JWT Token:", credential);
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const loadGoogleApi = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client?hl=uk";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleApiLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadGoogleApi();
  }, []);

  useEffect(() => {
    if (googleApiLoaded) {
      const clientId =
        "386281927653-0gb0qgp2jid305ra217ekq1166oqu5ln.apps.googleusercontent.com";

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleLoginSuccess,
        locale: "uk",
        ux_mode: "popup",
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("loginGoogleBtn"),
        {
          theme: document.body.classList.contains('theme-dark') ? 'filled_black' : 'outline',
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 280,
        }
      );
    }
  }, [googleApiLoaded]);

  return (
    <div id="loginGoogleBtn" style={{ display: 'flex', justifyContent: 'center' }}></div>
  );
};

export default GoogleLogin;