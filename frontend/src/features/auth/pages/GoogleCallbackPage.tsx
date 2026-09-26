import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useGoogleLogin } from "@/features/auth/hooks/auth-hook";

type CallbackStage = "processing" | "closing" | "manual-close";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { mutate: loginWithGoogle } = useGoogleLogin();
  const hasHandled = useRef(false);
  const [stage, setStage] = useState<CallbackStage>(() =>
    window.opener ? "closing" : "processing",
  );

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const hash = window.location.hash;
    const search = window.location.search;
    const params = new URLSearchParams(hash ? hash.replace("#", "?") : search);
    const idToken = params.get("id_token") || params.get("credential");
    const authError = params.get("error");
    if (window.opener) {
      if (authError) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_ERROR", error: authError },
          window.location.origin,
        );
      } else if (idToken) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_SUCCESS", idToken },
          window.location.origin,
        );
      }
      window.close();
      return;
    }

    if (authError || !idToken) {
      navigate("/login", { replace: true });
      return;
    }

    loginWithGoogle(idToken, {
      onError: () => navigate("/login", { replace: true }),
    });
  }, [navigate, loginWithGoogle]);

  useEffect(() => {
    if (stage !== "closing") return;
    const timer = window.setTimeout(() => setStage("manual-close"), 1500);
    return () => window.clearTimeout(timer);
  }, [stage]);

  if (stage === "manual-close") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 text-center">
        <p className="text-sm text-neutral-400">
          Sign-in complete : you can close this tab now.
        </p>
      </div>
    );
  }

  return (
    <LoadingScreen
      label={
        stage === "closing"
          ? "Signing you in..."
          : "Completing Google sign-in..."
      }
    />
  );
};

export default GoogleCallbackPage;
