import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";

const GoogleCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Extract hash or search parameters sent by Google
    const hash = window.location.hash;
    const search = window.location.search;

    const params = new URLSearchParams(hash ? hash.replace("#", "?") : search);
    const idToken = params.get("id_token") || params.get("credential");
    const error = params.get("error");

    if (error) {
      console.error("Google Auth Error:", error);
      if (window.opener) {
        window.close();
      } else {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (idToken) {
      // CASE A: Opened in a new tab -> Send token back to parent tab & close this tab
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_SUCCESS", idToken },
          window.location.origin,
        );
        window.close();
        return;
      }

      // CASE B: Standard redirect in the same tab -> Process token and navigate
      // TODO: Replace this with your actual auth login handler / API call
      console.log("Received ID Token:", idToken);

      // Redirect user after processing
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <LoadingScreen label="Completing Google Sign In..." />;
};

export default GoogleCallbackPage;
