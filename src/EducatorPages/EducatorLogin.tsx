
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
} from "lucide-react";

import zepLogo from "../assets/icons/zep.jpg";
import "../pages/login/Login.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

type EducatorRole = "teacher" | "tutor";

interface AuthenticatedUser {
  id?: number;
  username?: string;
  name?: string;
  email?: string;
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

interface ProfileResponse {
  user?: AuthenticatedUser;
  data?: {
    user?: AuthenticatedUser;
  };
}

const getErrorMessage = (message?: string | string[]) => {
  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message;
};

const EducatorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem(
      "gracia_educator_login_email"
    );

    const savedRemember = localStorage.getItem(
      "gracia_educator_remember_me"
    );

    if (savedRemember === "true" && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const identifier = email.trim();

    if (!identifier || !password) {
      setError("Please enter your email/username and password.");
      return;
    }

    if (password.length < 6) {
      setError("Please enter a valid password.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Authenticate with the existing Gracia API.
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

      let data: LoginResponse | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data?.message) ||
            "Invalid username/email or password."
        );
      }

      const token =
        data?.access_token ||
        data?.accessToken ||
        data?.token;

      if (!token) {
        throw new Error(
          "The server did not return an authentication token."
        );
      }

      // Step 2: Get the authenticated user's role.
      // If login did not include a user, retrieve it from /auth/me.
      let user = data?.user;

      if (!user?.role) {
        const profileResponse = await fetch(
          `${API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error(
            "We could not verify your account role. Please try again."
          );
        }

        const profileData =
          (await profileResponse.json()) as
            | ProfileResponse
            | AuthenticatedUser;

        const wrappedData =
          profileData as ProfileResponse;

        user =
          wrappedData.user ??
          wrappedData.data?.user ??
          (profileData as AuthenticatedUser);
      }

      // Step 3: Allow teachers and tutors only.
      const role = String(user?.role || "")
        .toLowerCase()
        .trim();

      if (role !== "teacher" && role !== "tutor") {
        if (role === "student") {
          throw new Error(
            "This is the Educator Portal. Please sign in through the Student Portal."
          );
        }

        if (role === "admin" || role === "ict") {
          throw new Error(
            "Your account uses a different portal. Please use the portal assigned to your role."
          );
        }

        throw new Error(
          "Your account does not have an authorized educator role. Please contact the Gracia administrator."
        );
      }

      const educatorRole = role as EducatorRole;

      // Step 4: Save the authenticated session only after role validation.
      localStorage.setItem("token", token);
      localStorage.setItem(
        "gracia_current_user",
        JSON.stringify({
          ...user,
          role: educatorRole,
        })
      );

      localStorage.setItem(
        "gracia_authenticated_email",
        identifier.toLowerCase()
      );

      if (rememberMe) {
        localStorage.setItem(
          "gracia_educator_remember_me",
          "true"
        );

        localStorage.setItem(
          "gracia_educator_login_email",
          identifier.toLowerCase()
        );
      } else {
        localStorage.removeItem(
          "gracia_educator_remember_me"
        );

        localStorage.removeItem(
          "gracia_educator_login_email"
        );
      }

      window.dispatchEvent(new Event("gracia:auth-changed"));

      // Step 5: Open the educator workspace.
      navigate("/educator", {
        replace: true,
      });
    } catch (loginError) {
      console.error("Educator login error:", loginError);

      if (loginError instanceof TypeError) {
        setError(
          "Unable to connect to Gracia. Please make sure the backend is running."
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

  return (
    <div className="gracia-login">
      <section className="gracia-login-visual">
        <div className="visual-decoration visual-decoration-one" />
        <div className="visual-decoration visual-decoration-two" />
      </section>

      <section className="gracia-login-area">
        <div className="login-container">
          <div className="login-card">
            <Link
              to="/"
              className="login-card-logo"
              aria-label="Go to Gracia home"
            >
              <img src={zepLogo} alt="Gracia Education Hub" />
            </Link>

            <div className="login-header">
              <h2>Educator Portal</h2>
              <p>
                Sign in to manage your teaching and learning activities.
              </p>
            </div>

            {success && (
              <div className="login-success" role="status">
                <CheckCircle2 size={17} />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <form
              className="gracia-login-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="login-field">
                <label htmlFor="educator-email">
                  Email or username
                </label>

                <div className="login-input">
                  <div className="input-icon">
                    <Mail size={18} />
                  </div>

                  <input
                    id="educator-email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="username"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="password-heading">
                  <label htmlFor="educator-password">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className={
                      isSubmitting ? "disabled-link" : ""
                    }
                    onClick={(event) => {
                      if (isSubmitting) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="login-input">
                  <div className="input-icon">
                    <Lock size={18} />
                  </div>

                  <input
                    id="educator-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="password-button"
                    onClick={() =>
                      setShowPassword((visible) => !visible)
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

              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  disabled={isSubmitting}
                />

                <span className="custom-checkbox">
                  <CheckCircle2 size={12} />
                </span>

                <span>Remember me</span>
              </label>

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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="create-account">
              <span>Need educator access?</span>
              <Link to="/contact">
                Contact Gracia
              </Link>
            </div>
          </div>

          <p className="login-copyright">
            © {new Date().getFullYear()} Gracia Education Hub
          </p>
        </div>
      </section>
    </div>
  );
};

export default EducatorLogin;
