import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GSI_SCRIPT_PREFIX = "https://accounts.google.com/gsi/client";

/** Потрібен VITE_GOOGLE_CLIENT_ID (.env / Vercel). У GCP: Authorized JavaScript origins — ваш dev і продакшен origin (без шляху).
 * Під час Testing у OAuth consent screen логін лише для email із списку Test users. */

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

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  useEffect(() => {
    if (!googleApiLoaded || !window.google?.accounts?.id) return;

    if (!clientId) {
      return;
    }

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
  }, [googleApiLoaded, handleLoginSuccess, clientId]);

  return (
    <div className="d-flex flex-column align-items-center my-3 mx-3">
      {!googleApiLoaded ? (
        <div className="text-muted small">Завантаження Google…</div>
      ) : !clientId ? (
        <p className="text-muted small text-center mb-0" style={{ maxWidth: "22rem" }}>
          Вхід через Google вимкнено: задайте <code className="small">VITE_GOOGLE_CLIENT_ID</code> у{" "}
          <code className="small">.env</code> або у змінних середовища деплою (наприклад Vercel).
        </p>
      ) : (
        <div id="loginGoogleBtn" />
      )}
    </div>
  );
};

export default GoogleLogin;
