
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

import zepLogo from "../../assets/icons/zep.jpg";

import "./VerifyEmail.scss";

interface ApiResponse {
  message?: string | string[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    searchParams.get("email") || ""
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(code)) {
      setError("Please enter your complete six-digit verification code.");
      return;
    }

    if (isVerifying) return;

    setIsVerifying(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        const backendMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;

        throw new Error(
          backendMessage || "Verification failed. Please try again."
        );
      }

      setIsVerified(true);
      setSuccess(
        (Array.isArray(data.message) ? data.message.join(" ") : data.message) ||
  "Email verified successfully. You can now log in."
      );
    } catch (verificationError) {
      setError(
        verificationError instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : verificationError instanceof Error
            ? verificationError.message
            : "Verification failed. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isResending) return;

    setIsResending(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        const backendMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;

        throw new Error(
          backendMessage || "Unable to request another code."
        );
      }

      setSuccess(
        (Array.isArray(data.message) ? data.message.join(" ") : data.message) ||
  "If an unverified account exists, a new code will be sent."
      );
      setCode("");
    } catch (resendError) {
      setError(
        resendError instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : resendError instanceof Error
            ? resendError.message
            : "Unable to request another code."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="gracia-verify">
      <section className="gracia-verify-area">
        <div className="verify-container">
          <div className="verify-card">
            <div className="verify-card-content">
              <Link
                to="/"
                className="verify-card-logo"
                aria-label="Go to home"
              >
                <img src={zepLogo} alt="Gracia" />
              </Link>

              <div className="verify-header">
                <div className="verify-heading-icon">
                  {isVerified ? (
                    <ShieldCheck size={23} />
                  ) : (
                    <Mail size={23} />
                  )}
                </div>

                <h2>
                  {isVerified ? "Email Verified" : "Verify Your Email"}
                </h2>

                <p>
                  {isVerified
                    ? "Your email address has been verified successfully."
                    : "Enter the six-digit code sent to your email to activate your account."}
                </p>
              </div>

              {error && (
                <div className="verify-error" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="verify-success" role="status">
                  <CheckCircle2 size={17} />
                  <span>{success}</span>
                </div>
              )}

              {!isVerified ? (
                <>
                  <form
                    className="gracia-verify-form"
                    onSubmit={handleVerify}
                    noValidate
                  >
                    <div className="verify-field">
                      <label htmlFor="verification-code">
                        Verification code
                      </label>

                      <div className="verify-input verify-code-input">
                        <input
                          id="verification-code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="000000"
                          value={code}
                          onChange={(event) =>
                            setCode(
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6)
                            )
                          }
                          maxLength={6}
                          disabled={isVerifying}
                          aria-describedby="verification-hint"
                          required
                        />
                      </div>

                      <span
                        className="verify-hint"
                        id="verification-hint"
                      >
                        The code expires after 30 minutes.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="verify-submit"
                      disabled={isVerifying || code.length !== 6}
                    >
                      {isVerifying ? (
                        <>
                          <LoaderCircle
                            size={18}
                            className="verify-spinner"
                          />
                          <span>Verifying code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify email</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="verify-divider">
                    <span>Didn't receive your code?</span>
                  </div>

                  <div className="verify-field verify-email-field">
                    <label htmlFor="verification-email">
                      Email address
                    </label>

                    <div className="verify-input">
                      <div className="verify-input-icon">
                        <Mail size={18} />
                      </div>

                      <input
                        id="verification-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        disabled={isResending}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="verify-resend"
                    onClick={handleResend}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <LoaderCircle
                        size={17}
                        className="verify-spinner"
                      />
                    ) : (
                      <RefreshCw size={17} />
                    )}

                    <span>
                      {isResending
                        ? "Requesting code..."
                        : "Send a new code"}
                    </span>
                  </button>

                  <div className="verify-login-link">
                    <span>Already verified?</span>
                    <Link to="/login">Sign in</Link>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="verify-submit"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  <span>Continue to login</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          <p className="verify-copyright">
            © {new Date().getFullYear()} Gracia Education Hub
          </p>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;