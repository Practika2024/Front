import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GSI_SCRIPT_PREFIX = "https://accounts.google.com/gsi/client";

/** Якщо в консолі 403 / «origin is not allowed» — у Google Cloud Console для цього client_id
 *  додайте поточний origin (напр. http://localhost:5173) у Authorized JavaScript origins. */

/** Один раз на сесію — повторний initialize() дає попередження GSI_LOGGER */
let gsiInitialized = false;

function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      `script[src^="${GSI_SCRIPT_PREFIX}"]`
    );
    if (existing) {
      const done = () => {
        if (window.google?.accounts?.id) resolve();
        else reject(new Error("GSI not available after script load"));
      };
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", done);
      existing.addEventListener("error", () =>
        reject(new Error("GSI script failed"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = `${GSI_SCRIPT_PREFIX}?hl=uk`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("GSI script failed"));
    document.body.appendChild(script);
  });
}

const GoogleLogin = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { externalLoginUser } = useActions();

  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

  const handleLoginSuccess = useCallback(
    async (res) => {
      const { credential } = res;
      if (!credential) return;
      try {
        const response = await externalLoginUser({
          token: credential,
          provider: "Google",
        });
        if (!response.success) {
          toast.error(response.message);
        } else {
          toast.success("Успішний вхід!");
          navigate("/");
        }
      } catch (error) {
        console.error(
          "Error during login:",
          error.response?.data || error.message
        );
      }
    },
    [externalLoginUser, navigate]
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let cancelled = false;
    loadGsiScript()
      .then(() => {
        if (!cancelled) setGoogleApiLoaded(true);
      })
      .catch((e) => console.warn("[GoogleLogin] GSI script:", e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!googleApiLoaded || !window.google?.accounts?.id) return;

    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      "219955824362-0rhvb42q1827djp1m7ao56921c6ivn9o.apps.googleusercontent.com";

    if (!gsiInitialized) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleLoginSuccess,
          locale: "uk",
          ux_mode: "popup",
          auto_select: false,
        });
        gsiInitialized = true;
      } catch (e) {
        console.warn("[GoogleLogin] initialize:", e);
      }
    }

    const el = document.getElementById("loginGoogleBtn");
    if (!el) return;
    el.replaceChildren();
    try {
      window.google.accounts.id.renderButton(el, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
      });
    } catch (e) {
      console.warn("[GoogleLogin] renderButton:", e);
    }
  }, [googleApiLoaded, handleLoginSuccess]);

  return (
    <div className="d-flex flex-column align-items-center my-3 mx-3">
      {googleApiLoaded ? (
        <div id="loginGoogleBtn" />
      ) : (
        <div className="text-muted small">Завантаження Google…</div>
      )}
    </div>
  );
};

export default GoogleLogin;
