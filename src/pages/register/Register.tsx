import { useState } from "react";
import type { FormEvent } from "react";
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

import zepLogo from "../../assets/icons/zep.jpg";
import "./Register.scss";

interface StudentRegistration {
  name: string;
  email: string;
  level: "primary" | "secondary" | "tertiary" | "skills";
}

interface RegisterResponse {
  message?: string | string[];
  emailSent?: boolean;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    level?: string;
  };
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !trimmedName ||
      !normalizedEmail ||
      !level ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    const validLevels = [
      "primary",
      "secondary",
      "tertiary",
      "skills",
    ];

    if (!validLevels.includes(level)) {
      setError("Please select a valid learning level.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: trimmedName,
          email: normalizedEmail,
          level,
          password,
          confirmPassword,
        }),
      });

      let data: RegisterResponse | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const backendMessage = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;

        throw new Error(
          backendMessage || "Registration failed. Please try again.",
        );
      }

      // Save only the basic student profile; never store the password.
      const student: StudentRegistration = {
        name: trimmedName,
        email: normalizedEmail,
        level: level as StudentRegistration["level"],
      };

      localStorage.setItem(
        "gracia_student",
        JSON.stringify(student),
      );

      localStorage.setItem(
        "gracia_registered_email",
        normalizedEmail,
      );

      const emailSent = data?.emailSent !== false;

      // Registration succeeded. Continue to email verification.
      setSuccess(
        emailSent
          ? "Account created successfully. Taking you to email verification..."
          : "Your account was created, but the verification email could not be sent. Taking you to verification so you can request another code...",
      );

      navigate(
        `/verify-email?email=${encodeURIComponent(normalizedEmail)}`,
        {
          replace: true,
          state: {
            emailSent,
            message: data?.message,
            email: normalizedEmail,
          },
        },
      );
    } catch (registrationError) {
      console.error("Registration error:", registrationError);

      if (registrationError instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please check your connection and make sure the Gracia backend is running.",
        );
      } else {
        setError(
          registrationError instanceof Error
            ? registrationError.message
            : "Registration failed. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gracia-register">
      <div className="register-decoration register-decoration-one" />
      <div className="register-decoration register-decoration-two" />

      <section className="gracia-register-area">
        <div className="register-container">
          <div className="register-card">
            <div className="register-card-content">
              <Link
                to="/"
                className="register-card-logo"
                aria-label="Go to home"
              >
                <img src={zepLogo} alt="Gracia" />
              </Link>

              <div className="register-header">
                <h2>Create Account</h2>
                <p>Create your account and start learning.</p>
              </div>

              {error && (
                <div className="register-error" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="register-success" role="status">
                  <CheckCircle2 size={17} />
                  <span>{success}</span>
                </div>
              )}

              <form
                className="gracia-register-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="register-field">
                  <label htmlFor="name">Full name</label>

                  <div className="register-input">
                    <div className="input-icon">
                      <User size={19} />
                    </div>

                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="register-field">
                  <label htmlFor="email">Email address</label>

                  <div className="register-input">
                    <div className="input-icon">
                      <Mail size={19} />
                    </div>

                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="register-field">
                  <label htmlFor="level">Learning level</label>

                  <div className="register-input">
                    <div className="input-icon">
                      <GraduationCap size={19} />
                    </div>

                    <select
                      id="level"
                      value={level}
                      onChange={(event) => setLevel(event.target.value)}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Select your learning level</option>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="tertiary">Tertiary</option>
                      <option value="skills">Practical Skills</option>
                    </select>
                  </div>
                </div>

                {level && (
                  <div className="learning-level-info">
                    <GraduationCap size={15} />

                    <span>
                      {level === "primary" &&
                        "Your dashboard will show subjects designed for primary learners, with their teachers."}

                      {level === "secondary" &&
                        "Your dashboard will show subjects designed for secondary learners, with their teachers."}

                      {level === "tertiary" &&
                        "Your dashboard will show tertiary courses and their tutors."}

                      {level === "skills" &&
                        "Your dashboard will show practical and career-focused skills courses and their tutors."}
                    </span>
                  </div>
                )}

                <div className="register-field">
                  <div className="password-heading">
                    <label htmlFor="password">Password</label>
                  </div>

                  <div className="register-input">
                    <div className="input-icon">
                      <Lock size={19} />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      required
                    />

                    <button
                      type="button"
                      className="password-button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      required
                    />

                    <button
                      type="button"
                      className="password-button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
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

                <label className="terms-option">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(event) =>
                      setAgreeTerms(event.target.checked)
                    }
                    disabled={isSubmitting}
                  />

                  <span className="custom-checkbox">
                    <CheckCircle2 size={12} />
                  </span>

                  <span>
                    I agree to the{" "}
                    <Link to="/terms">Terms &amp; Conditions</Link>
                    {" "}and{" "}
                    <Link to="/privacy">Privacy Policy</Link>.
                  </span>
                </label>

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
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="create-account">
                <span>Already have an account?</span>
                <Link to="/login">Sign in</Link>
              </div>
            </div>
          </div>

          <p className="register-copyright">
            © {new Date().getFullYear()} Gracia Education Hub
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;