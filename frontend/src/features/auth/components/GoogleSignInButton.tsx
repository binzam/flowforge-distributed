import { useEffect, useRef } from "react";

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback?: (response: GoogleCredentialResponse) => void;
    ux_mode?: "popup" | "redirect";
    login_uri?: string;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      width?: number;
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    },
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;
const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleScriptPromise: Promise<void> | null = null;

const loadGoogleScript = (): Promise<void> => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SCRIPT_SRC}"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google script")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Failed to load Google script")),
    );
    document.head.appendChild(script);
  }).catch((error) => {
    googleScriptPromise = null;
    throw error;
  });

  return googleScriptPromise;
};

export type GoogleUxMode = "popup" | "redirect" | "new_tab";

interface GoogleSignInButtonProps {
  // Required when uxMode="popup"
  onCredential?: (idToken: string) => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  uxMode?: GoogleUxMode;
  /** Required when uxMode is "redirect" (endpoint that handles post-redirect[backend:- not implemented]) */
  loginUri?: string;
  /** Required when uxMode is "new_tab" (the OAuth callback URL[frontend]) */
  redirectUri?: string;
  scope?: string;
}

const GoogleSignInButton = ({
  onCredential,
  text = "continue_with",
  uxMode = "popup",
  loginUri,
  redirectUri,
  scope = "openid email profile",
}: GoogleSignInButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleCustomNewTabClick = () => {
    if (!GOOGLE_CLIENT_ID) return;
    const targetRedirect = redirectUri || window.location.origin;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: targetRedirect,
      response_type: "id_token token",
      scope: scope,
      nonce: Math.random().toString(36).substring(2),
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.open(authUrl, "_blank");
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error(
        "VITE_GOOGLE_CLIENT_ID is not set : Google sign-in cannot render.",
      );
      return;
    }

    // If using 'new_tab' mode, rendered via standard button click
    if (uxMode === "new_tab") return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          ux_mode: uxMode,
          login_uri: loginUri,
          callback:
            uxMode === "popup" && onCredential
              ? (response) => onCredential(response.credential)
              : undefined,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: 360,
          text,
        });
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [onCredential, text, uxMode, loginUri]);

  if (uxMode === "new_tab") {
    return (
      <button
        type="button"
        onClick={handleCustomNewTabClick}
        className="flex items-center justify-center gap-3 w-90 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>
          {text === "signin_with" && "Sign in with Google"}
          {text === "signup_with" && "Sign up with Google"}
          {text === "continue_with" && "Continue with Google"}
          {text === "signin" && "Sign in"}
        </span>
      </button>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
};

export default GoogleSignInButton;
