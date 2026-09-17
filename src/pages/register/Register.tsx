import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  User,
  LoaderCircle,
} from "lucide-react";

import zepLogo from "../../assets/icons/zep.jpeg";

import "./Register.scss";

interface StudentRegistration {
  name: string;
  email: string;
  level: "primary" | "secondary" | "tertiary" | "skills";
}

interface RegisterResponse {
  message?: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
  };
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Register = () => {
  const navigate = useNavigate();

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =========================================================
     SUBMIT REGISTRATION
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

    if (
      !name.trim() ||
      !email.trim() ||
      !level ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please complete all required fields."
      );

      return;
    }

    /* =======================================================
       NAME VALIDATION
    ======================================================= */

    if (name.trim().length < 2) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    /* =======================================================
       EMAIL VALIDATION
    ======================================================= */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    /* =======================================================
       PASSWORD VALIDATION
    ======================================================= */

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    /* =======================================================
       TERMS VALIDATION
    ======================================================= */

    if (!agreeTerms) {
      setError(
        "Please accept the terms and conditions."
      );

      return;
    }

    /* =======================================================
       VALIDATE LEARNING LEVEL
    ======================================================= */

    if (
      level !== "primary" &&
      level !== "secondary" &&
      level !== "tertiary" &&
      level !== "skills"
    ) {
      setError(
        "Please select a valid learning level."
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
         BACKEND REGISTRATION

         The NestJS authentication endpoint receives:
         - username
         - email
         - password

         The learning level remains a Gracia frontend
         profile field for dashboard personalization.
      ===================================================== */

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      /* =====================================================
         READ RESPONSE SAFELY
      ===================================================== */

      let data: RegisterResponse | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      /* =====================================================
         BACKEND ERROR
      ===================================================== */

      if (!response.ok) {
        let backendMessage =
          data?.message;

        if (Array.isArray(backendMessage)) {
          backendMessage =
            backendMessage.join(", ");
        }

        throw new Error(
          backendMessage ||
            "Registration failed. Please try again."
        );
      }

      /* =====================================================
         CREATE FRONTEND STUDENT PROFILE

         Only save this after the backend registration
         succeeds.
      ===================================================== */

      const student: StudentRegistration = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        level: level as StudentRegistration["level"],
      };

      localStorage.setItem(
        "gracia_student",
        JSON.stringify(student)
      );

      localStorage.setItem(
        "gracia_registered_email",
        email.trim().toLowerCase()
      );

      /* =====================================================
         SUCCESS MESSAGE
      ===================================================== */

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      /* =====================================================
         REDIRECT TO LOGIN

         A short delay allows the user to see the success
         message before being redirected.
      ===================================================== */

      setTimeout(() => {
        navigate("/login", {
          state: {
            registered: true,
            email: email.trim().toLowerCase(),
            message:
              "Your account has been created successfully. Please sign in.",
          },
        });
      }, 900);
    } catch (registrationError) {
      console.error(
        "Registration error:",
        registrationError
      );

      if (
        registrationError instanceof TypeError
      ) {
        setError(
          "Unable to connect to the server. Please make sure the Gracia backend is running."
        );
      } else {
        setError(
          registrationError instanceof Error
            ? registrationError.message
            : "Registration failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gracia-register">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="register-decoration register-decoration-one" />
      <div className="register-decoration register-decoration-two" />

      {/* =====================================================
          REGISTER AREA
      ===================================================== */}

      <section className="gracia-register-area">

        <div className="register-container">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="mobile-register-brand">

            <Link
              to="/"
              className="gracia-register-logo"
            >

              <div className="logo-image-wrapper">

                <img
                  src={zepLogo}
                  alt="Gracia Education Hub"
                  className="gracia-logo-image"
                />

              </div>

              <div className="gracia-logo-text">

                <strong>
                  GRACIA
                </strong>

                <span>
                  EDUCATION HUB
                </span>

              </div>

            </Link>

          </div>

          {/* =================================================
              REGISTER CARD
          ================================================= */}

          <div className="register-card">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="register-header">

              <span className="register-eyebrow">
                CREATE ACCOUNT
              </span>

              <h2>
                Join Gracia
              </h2>

              <p>
                Create your account and start learning.
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="register-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (
              <div
                className="register-success"
                role="status"
              >
                <CheckCircle2 size={17} />
                <span>
                  {success}
                </span>
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="gracia-register-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div className="register-field">

                <label htmlFor="name">
                  Full name
                </label>

                <div className="register-input">

                  <div className="input-icon">
                    <User size={19} />
                  </div>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    autoComplete="name"
                    disabled={isSubmitting}
                  />

                </div>

              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="register-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="register-input">

                  <div className="input-icon">
                    <Mail size={19} />
                  </div>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                    disabled={isSubmitting}
                  />

                </div>

              </div>

              {/* =================================================
                  LEARNING LEVEL
              ================================================= */}

              <div className="register-field">

                <label htmlFor="level">
                  Learning level
                </label>

                <div className="register-input">

                  <div className="input-icon">
                    <GraduationCap size={19} />
                  </div>

                  <select
                    id="level"
                    value={level}
                    onChange={(event) =>
                      setLevel(
                        event.target.value
                      )
                    }
                    disabled={isSubmitting}
                  >

                    <option value="">
                      Select your learning level
                    </option>

                    <option value="primary">
                      Primary
                    </option>

                    <option value="secondary">
                      Secondary
                    </option>

                    <option value="tertiary">
                      Tertiary
                    </option>

                    <option value="skills">
                      Practical Skills
                    </option>

                  </select>

                </div>

              </div>

              {/* =================================================
                  LEVEL INFORMATION
              ================================================= */}

              {level && (
                <div className="learning-level-info">

                  <GraduationCap size={15} />

                  <span>

                    {level === "primary" &&
                      "Your dashboard will show courses designed for primary learners."}

                    {level === "secondary" &&
                      "Your dashboard will show courses designed for secondary learners."}

                    {level === "tertiary" &&
                      "Your dashboard will show courses designed for tertiary learners."}

                    {level === "skills" &&
                      "Your dashboard will show practical and career-focused skills courses."}

                  </span>

                </div>
              )}

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="register-field">

                <div className="password-heading">

                  <label htmlFor="password">
                    Password
                  </label>

                </div>

                <div className="register-input">

                  <div className="input-icon">
                    <Lock size={19} />
                  </div>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
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
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

                <span className="password-hint">
                  Use at least 6 characters.
                </span>

              </div>

              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="register-field">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="register-input">

                  <div className="input-icon">
                    <Lock size={19} />
                  </div>

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="password-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    disabled={isSubmitting}
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>

              {/* =================================================
                  TERMS
              ================================================= */}

              <label className="terms-option">

                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) =>
                    setAgreeTerms(
                      event.target.checked
                    )
                  }
                  disabled={isSubmitting}
                />

                <span className="custom-checkbox">

                  <CheckCircle2 size={12} />

                </span>

                <span>

                  I agree to the{" "}

                  <Link to="/terms">
                    Terms & Conditions
                  </Link>

                  {" "}and{" "}

                  <Link to="/privacy">
                    Privacy Policy
                  </Link>

                  .

                </span>

              </label>

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                className="register-submit"
                disabled={isSubmitting}
              >

                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="register-spinner"
                    />

                    <span>
                      Creating account...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Create account
                    </span>

                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* =================================================
                LOGIN LINK
            ================================================= */}

            <div className="create-account">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>

            </div>

          </div>

          {/* =================================================
              COPYRIGHT
          ================================================= */}

          <p className="register-copyright">
            © {new Date().getFullYear()} Gracia Education Hub
          </p>

        </div>

      </section>

    </div>
  );
};

export default Register;