
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
} from "lucide-react";

import zepLogo from "../../assets/icons/zep.jpg";

import "./Login.scss";


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";


/* =========================================================
   TYPES
========================================================= */

interface AuthenticatedUser {
  id?: number;
  username?: string;
  name?: string;
  email: string;
  level?: string;
  role?: string;
  accountStatus?: string;
  emailVerified?: number | boolean;
}

interface LoginResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;

  user?: AuthenticatedUser;

  message?: string | string[];
}

interface LocationState {
  registered?: boolean;
  email?: string;
  message?: string;
}


/* =========================================================
   LOGIN COMPONENT
========================================================= */

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const registrationState =
    location.state as LocationState | null;


  /* =========================================================
     FORM STATE
  ========================================================= */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  /* =========================================================
     LOAD SAVED LOGIN INFORMATION
  ========================================================= */

  useEffect(() => {
    const savedEmail =
      localStorage.getItem(
        "gracia_login_email"
      );

    const savedRemember =
      localStorage.getItem(
        "gracia_remember_me"
      );

    if (
      savedRemember === "true" &&
      savedEmail
    ) {
      setEmail(savedEmail);
      setRememberMe(true);
    } else if (
      registrationState?.email
    ) {
      setEmail(
        registrationState.email
      );
    }


    /* =======================================================
       REGISTRATION SUCCESS MESSAGE
    ======================================================= */

    if (
      registrationState?.registered ||
      registrationState?.message
    ) {
      setSuccess(
        registrationState.message ||
          "Your account has been created successfully. Please sign in."
      );
    }


    /* =======================================================
       CLEAR NAVIGATION STATE
    ======================================================= */

    if (location.state) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [
    location.state,
    registrationState?.email,
    registrationState?.message,
    registrationState?.registered,
  ]);


  /* =========================================================
     LOGIN SUBMIT
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    /* =======================================================
       REQUIRED FIELDS
    ======================================================= */

    if (!email.trim() || !password) {
      setError(
        "Please enter your email/username and password."
      );

      return;
    }


    /* =======================================================
       PASSWORD VALIDATION
    ======================================================= */

    if (password.length < 6) {
      setError(
        "Please enter a valid password."
      );

      return;
    }


    /* =======================================================
       PREVENT DOUBLE SUBMISSION
    ======================================================= */

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);


    try {
      /* =====================================================
         BACKEND LOGIN

         POST /api/auth/login

         The identifier can be either:
         - email
         - username
      ===================================================== */

      const identifier =
        email.trim();

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );


      /* =====================================================
         READ RESPONSE
      ===================================================== */

      let data: LoginResponse | null =
        null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }


      /* =====================================================
         HANDLE BACKEND ERROR
      ===================================================== */

      if (!response.ok) {
        let backendMessage =
          data?.message;

        if (
          Array.isArray(
            backendMessage
          )
        ) {
          backendMessage =
            backendMessage.join(", ");
        }

        throw new Error(
          backendMessage ||
            "Invalid username/email or password."
        );
      }


      /* =====================================================
         GET JWT TOKEN
      ===================================================== */

      const token =
        data?.access_token ||
        data?.accessToken ||
        data?.token;

      if (!token) {
        throw new Error(
          "Login succeeded, but the server did not return an authentication token."
        );
      }


      /* =====================================================
         SAVE AUTH TOKEN
      ===================================================== */

      localStorage.setItem(
        "token",
        token
      );


      /* =====================================================
         SAVE AUTHENTICATED USER
      ===================================================== */

      if (data?.user) {
        localStorage.setItem(
          "gracia_current_user",
          JSON.stringify(data.user)
        );
      }


      /* =====================================================
         KEEP GRACIA STUDENT PROFILE
      ===================================================== */

      const storedStudent =
        localStorage.getItem(
          "gracia_student"
        );

      if (storedStudent) {
        try {
          const parsedStudent =
            JSON.parse(storedStudent);

          if (
            parsedStudent?.email &&
            parsedStudent.email.toLowerCase() !==
              identifier.toLowerCase()
          ) {
            localStorage.removeItem(
              "gracia_student"
            );
          }
        } catch {
          localStorage.removeItem(
            "gracia_student"
          );
        }
      }


      /* =====================================================
         REMEMBER ME
      ===================================================== */

      if (rememberMe) {
        localStorage.setItem(
          "gracia_remember_me",
          "true"
        );

        localStorage.setItem(
          "gracia_login_email",
          identifier.toLowerCase()
        );
      } else {
        localStorage.removeItem(
          "gracia_remember_me"
        );

        localStorage.removeItem(
          "gracia_login_email"
        );
      }


      /* =====================================================
         SAVE LAST AUTHENTICATED IDENTIFIER
      ===================================================== */

      localStorage.setItem(
        "gracia_authenticated_email",
        identifier.toLowerCase()
      );


      /* =====================================================
         REDIRECT TO STUDENT DASHBOARD
      ===================================================== */

      navigate("/student", {
        replace: true,
      });

    } catch (loginError) {
      console.error(
        "Login error:",
        loginError
      );


      /* =====================================================
         NETWORK / SERVER CONNECTION ERROR
      ===================================================== */

      if (
        loginError instanceof TypeError
      ) {
        setError(
          "Unable to connect to the server. Please make sure the Gracia backend is running."
        );
      } else {
        setError(
          loginError instanceof Error
            ? loginError.message
            : "Login failed. Please try again."
        );
      }

    } finally {
      setIsSubmitting(false);
    }
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="gracia-login">

      {/* =====================================================
          OLD VISUAL AREA
      ===================================================== */}

      <section className="gracia-login-visual">
        <div className="visual-decoration visual-decoration-one" />
        <div className="visual-decoration visual-decoration-two" />
      </section>


      {/* =====================================================
          LOGIN AREA
      ===================================================== */}

      <section className="gracia-login-area">

        <div className="login-container">

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="login-card">

            {/* =================================================
                LOGO INSIDE CARD
            ================================================= */}

            <Link
              to="/"
              className="login-card-logo"
              aria-label="Go to home"
            >
              <img
                src={zepLogo}
                alt="Gracia"
              />
            </Link>


            {/* =================================================
                LOGIN HEADER
            ================================================= */}

            <div className="login-header">

              <h2>
                Student Portal
              </h2>

              <p>
                Sign in to continue your learning.
              </p>

            </div>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (
              <div
                className="login-success"
                role="status"
              >
                <CheckCircle2 size={17} />

                <span>
                  {success}
                </span>
              </div>
            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div
                className="login-error"
                role="alert"
              >
                {error}
              </div>
            )}


            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form
              className="gracia-login-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* =================================================
                  EMAIL / USERNAME
              ================================================= */}

              <div className="login-field">

                <label htmlFor="email">
                  Email or username
                </label>

                <div className="login-input">

                  <div className="input-icon">
                    <Mail size={18} />
                  </div>

                  <input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="username"
                    disabled={isSubmitting}
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="login-field">

                <div className="password-heading">

                  <label htmlFor="password">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className={
                      isSubmitting
                        ? "disabled-link"
                        : ""
                    }
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="login-input">

                  <div className="input-icon">
                    <Lock size={18} />
                  </div>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="password-button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* =================================================
                  REMEMBER ME
              ================================================= */}

              <label className="remember-option">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  disabled={isSubmitting}
                />

                <span className="custom-checkbox">
                  <CheckCircle2 size={12} />
                </span>

                <span>
                  Remember me
                </span>

              </label>


              {/* =================================================
                  SUBMIT BUTTON
              ================================================= */}

              <button
                type="submit"
                className="login-submit"
                disabled={isSubmitting}
              >

                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="login-spinner"
                    />

                    <span>
                      Signing in...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Sign in
                    </span>

                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>


            {/* =================================================
                CREATE ACCOUNT
            ================================================= */}

            <div className="create-account">

              <span>
                New to Gracia?
              </span>

              <Link to="/register">
                Create an account
              </Link>

            </div>

          </div>


          {/* =================================================
              COPYRIGHT
          ================================================= */}

          <p className="login-copyright">
            © {new Date().getFullYear()} Gracia Education Hub
          </p>

        </div>

      </section>

    </div>
  );
};

export default Login;
