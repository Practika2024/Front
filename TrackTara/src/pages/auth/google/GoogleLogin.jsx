import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

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
      console.log("JWT Token:", token);
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
        "219955824362-0rhvb42q1827djp1m7ao56921c6ivn9o.apps.googleusercontent.com";

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleLoginSuccess,
        locale: "en",
        ux_mode: "popup",
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("loginGoogleBtn"),
        {

            theme: "outline",
            size: "large", 
            shape: "pill",    
            text: "continue_with",
        }
      );
    }
  }, [googleApiLoaded]);

  return (
    <div className="d-flex justify-center align-items-center my-3 mx-3">
        {googleApiLoaded ? (
          <div id="loginGoogleBtn">Google</div>
        ) : (
          <div>Loading...</div>
        )}
    </div>
  );
};

export default GoogleLogin;