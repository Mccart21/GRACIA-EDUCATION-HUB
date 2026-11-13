
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";

import "./Payments.scss";

import airtelLogo from "../../assets/airtel.webp";
import mpambaLogo from "../../assets/mpamba.webp";
import nbmLogo from "../../assets/nbm.png";
import nbsLogo from "../../assets/nbs.png";

type PaymentMethod = "airtel" | "mpamba" | "nbm" | "nbs";

interface SubscriptionPlan {
  id: number;
  code?: string;
  name: string;
  duration: string;
  billingPeriod?: string;
  price: number;
  isActive?: number;
}

interface BackendPayment {
  id: number;
  planId: number;
  subscriptionId: number;
  courseId: number | null;
  subjectId: number | null;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  createdAt?: string;
}

interface CreatePaymentResponse {
  message?: string;
  payment?: BackendPayment;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const providerNames: Record<PaymentMethod, string> = {
  airtel: "Airtel Money",
  mpamba: "TNM Mpamba",
  nbm: "National Bank of Malawi",
  nbs: "NBS Bank",
};

const Payments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planIdFromUrl = searchParams.get("plan");
  const courseId = searchParams.get("courseId");
  const subjectId = searchParams.get("subjectId");

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan | null>(null);

  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("airtel");

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [createdPayment, setCreatedPayment] =
    useState<BackendPayment | null>(null);

  /*
   * Load real plans from the backend.
   * The price shown here comes from the server response,
   * and the backend independently determines the amount
   * when a payment request is created.
   */
  useEffect(() => {
    let mounted = true;

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/subscriptions/plans`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data: unknown = await response.json();

        if (!response.ok) {
          const result = data as { message?: string };
          throw new Error(
            result.message || "Unable to load subscription plans."
          );
        }

        let backendPlans: SubscriptionPlan[] = [];

        if (Array.isArray(data)) {
          backendPlans = data as SubscriptionPlan[];
        } else if (data && typeof data === "object") {
          const result = data as {
            data?: unknown;
            plans?: unknown;
          };

          if (Array.isArray(result.data)) {
            backendPlans = result.data as SubscriptionPlan[];
          } else if (Array.isArray(result.plans)) {
            backendPlans = result.plans as SubscriptionPlan[];
          }
        }

        const availablePlans = backendPlans.filter(
          (plan) =>
            Number.isInteger(Number(plan.id)) &&
            Number(plan.id) > 0 &&
            Number.isFinite(Number(plan.price)) &&
            Number(plan.price) >= 0 &&
            plan.name
        );

        if (!mounted) return;

        if (availablePlans.length === 0) {
          throw new Error(
            "No valid subscription plans are currently available."
          );
        }

        setPlans(availablePlans);

        let desiredPlanId = Number(planIdFromUrl);

        if (!planIdFromUrl) {
          try {
            const storedPlan = localStorage.getItem(
              "gracia_selected_plan"
            );

            if (storedPlan) {
              const parsed = JSON.parse(storedPlan);
              desiredPlanId = Number(parsed.id);
            }
          } catch {
            localStorage.removeItem("gracia_selected_plan");
          }
        }

        const matchedPlan = availablePlans.find(
          (plan) => Number(plan.id) === desiredPlanId
        );

        if (planIdFromUrl && !matchedPlan) {
          setSelectedPlan(null);
          setError(
            "The selected subscription plan could not be found. Please return to the subscriptions page and choose an available plan."
          );
          return;
        }

        if (matchedPlan) {
          setSelectedPlan(matchedPlan);
        } else {
          setSelectedPlan(null);
          setError("Please select a subscription plan before continuing.");
        }
      } catch (err) {
        console.error("Failed to load subscription plans:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load subscription plans. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoadingPlans(false);
        }
      }
    };

    loadPlans();

    return () => {
      mounted = false;
    };
  }, [planIdFromUrl]);

  const paymentMethods = [
    {
      id: "airtel" as PaymentMethod,
      name: "Airtel Money",
      description: "Mobile money",
      logo: airtelLogo,
      alt: "Airtel Money",
    },
    {
      id: "mpamba" as PaymentMethod,
      name: "TNM Mpamba",
      description: "Mobile money",
      logo: mpambaLogo,
      alt: "TNM Mpamba",
    },
    {
      id: "nbm" as PaymentMethod,
      name: "National Bank",
      description: "Bank account",
      logo: nbmLogo,
      alt: "National Bank of Malawi",
    },
    {
      id: "nbs" as PaymentMethod,
      name: "NBS Bank",
      description: "Bank account",
      logo: nbsLogo,
      alt: "NBS Bank",
    },
  ];

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setError("");
    setRequestMessage("");
    setCreatedPayment(null);
  };

  /*
   * Submit an authenticated payment request.
   *
   * The API accepts the plan, provider, and optional
   * course/subject IDs. It does not currently initiate
   * a real transaction with the selected provider.
   */
  const handlePayNow = async () => {
    setError("");
    setRequestMessage("");
    setCreatedPayment(null);

    if (!selectedPlan) {
      setError("Please select a valid subscription plan.");
      return;
    }

    if (courseId && subjectId) {
      setError("Please select either a course or a subject, not both.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          message: "Please sign in before creating a payment request.",
        },
      });
      return;
    }

    if (processing) return;

    setProcessing(true);

    try {
      const payload: {
        planId: number;
        provider: string;
        courseId?: number;
        subjectId?: number;
      } = {
        planId: Number(selectedPlan.id),
        provider: providerNames[selectedMethod],
      };

      if (courseId) {
        const numericCourseId = Number(courseId);

        if (!Number.isInteger(numericCourseId) || numericCourseId <= 0) {
          throw new Error("The selected course ID is invalid.");
        }

        payload.courseId = numericCourseId;
      }

      if (subjectId) {
        const numericSubjectId = Number(subjectId);

        if (!Number.isInteger(numericSubjectId) || numericSubjectId <= 0) {
          throw new Error("The selected subject ID is invalid.");
        }

        payload.subjectId = numericSubjectId;
      }

      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let result: CreatePaymentResponse | null = null;

      try {
        result = (await response.json()) as CreatePaymentResponse;
      } catch {
        result = null;
      }

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");

        throw new Error(
          "Your session may have expired. Please sign in again."
        );
      }

      if (!response.ok) {
        const backendMessage = result?.message;

        throw new Error(
          backendMessage ||
            "The payment request could not be created. Please try again."
        );
      }

      if (!result?.payment) {
        throw new Error(
          "The server did not return a payment record. Please check your payment history before retrying."
        );
      }

      setCreatedPayment(result.payment);

      setRequestMessage(
        result.message ||
          "Your payment request was created and is awaiting confirmation."
      );
    } catch (err) {
      console.error("Payment request error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the payment request. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const getPlanName = () => selectedPlan?.name || "No plan selected";

  const getPlanDuration = () =>
    selectedPlan?.duration || "Duration unavailable";

  const getPlanPrice = () => {
    if (!selectedPlan) return "MWK 0";

    return `MWK ${Number(selectedPlan.price).toLocaleString()}`;
  };

  const formatAmount = (amount: number, currency: string) =>
    `${currency} ${Number(amount).toLocaleString()}`;

  const returnToPlans = () => {
    if (courseId) {
      navigate(`/subscriptions?courseId=${encodeURIComponent(courseId)}`);
      return;
    }

    if (subjectId) {
      navigate(`/subscriptions?subjectId=${encodeURIComponent(subjectId)}`);
      return;
    }

    navigate("/subscriptions");
  };

  return (
    <div className="payments-page">
      <Navbar />

      <main>
        <section className="payments-section">
          <Container>
            <div className="payments-page-heading">
              <span>SECURE CHECKOUT</span>

              <h1>Complete Your Payment</h1>

              <p>
                Choose your preferred payment provider to create your
                subscription payment request.
              </p>
            </div>

            <div className="payments-card">
              {/* SELECTED PLAN */}
              <div className="selected-subscription">
                <div className="subscription-heading">
                  <span>ORDER</span>

                  <h2>Selected Subscription</h2>
                </div>

                {loadingPlans ? (
                  <p>Loading your selected subscription...</p>
                ) : (
                  <div className="subscription-info">
                    <div className="subscription-main">
                      <span className="info-label">Plan</span>
                      <strong>{getPlanName()}</strong>
                    </div>

                    <div className="subscription-detail">
                      <span className="info-label">Duration</span>
                      <strong>{getPlanDuration()}</strong>
                    </div>

                    <div className="subscription-detail">
                      <span className="info-label">Total</span>
                      <strong className="subscription-price">
                        {getPlanPrice()}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* PLAN SELECTION ERROR */}
              {!loadingPlans && plans.length > 0 && !selectedPlan && (
                <div className="payment-details">
                  <p className="payment-error" role="alert">
                    {error || "Please select a subscription plan."}
                  </p>

                  <button
                    type="button"
                    className="pay-button"
                    onClick={returnToPlans}
                  >
                    Choose a Plan
                  </button>
                </div>
              )}

              {loadingPlans && (
                <p className="activation-note" role="status">
                  Retrieving the latest subscription plans from the server.
                </p>
              )}

              {/* PAYMENT METHOD */}
              {selectedPlan && !createdPayment && (
                <div className="payment-section">
                  <div className="section-heading">
                    <span>PAYMENT</span>

                    <h2>Choose Payment Method</h2>

                    <p>Select your preferred payment provider.</p>
                  </div>

                  <div className="payment-methods">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        className={`payment-method ${
                          selectedMethod === method.id ? "selected" : ""
                        }`}
                        onClick={() => handleMethodChange(method.id)}
                        aria-pressed={selectedMethod === method.id}
                      >
                        <div className="method-icon">
                          <img src={method.logo} alt={method.alt} />
                        </div>

                        <div className="method-content">
                          <strong>{method.name}</strong>
                          <span>{method.description}</span>
                        </div>

                        <span
                          className={`radio ${
                            selectedMethod === method.id ? "selected" : ""
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT INTEGRATION NOTICE */}
              {selectedPlan && !createdPayment && (
                <div className="payment-details">
                  <p className="input-hint">
                    Selected provider: <strong>{providerNames[selectedMethod]}</strong>
                  </p>

                  <p className="activation-note">
                    This step creates a pending payment record in Gracia
                    Education Hub. The live payment connection for the selected
                    provider has not yet been configured. Do not send money or
                    share your mobile money PIN or banking password through
                    this page.
                  </p>
                </div>
              )}

              {/* ERRORS */}
              {error && selectedPlan && (
                <div className="payment-error" role="alert">
                  {error}
                </div>
              )}

              {/* CREATE REQUEST */}
              {selectedPlan && !createdPayment && (
                <button
                  type="button"
                  className="pay-button"
                  onClick={handlePayNow}
                  disabled={processing || loadingPlans}
                >
                  {processing
                    ? "Creating Payment Request..."
                    : `Create Payment Request — ${getPlanPrice()}`}
                </button>
              )}

              {/* SERVER CONFIRMATION */}
              {createdPayment && (
                <div className="payment-details" role="status">
                  <div className="subscription-heading">
                    <span>PAYMENT REQUEST</span>
                    <h2>Request Recorded</h2>
                  </div>

                  <p className="activation-note">
                    {requestMessage}
                  </p>

                  <div className="subscription-info">
                    <div className="subscription-main">
                      <span className="info-label">Reference</span>
                      <strong>#{createdPayment.id}</strong>
                    </div>

                    <div className="subscription-detail">
                      <span className="info-label">Amount</span>
                      <strong>
                        {formatAmount(
                          createdPayment.amount,
                          createdPayment.currency
                        )}
                      </strong>
                    </div>

                    <div className="subscription-detail">
                      <span className="info-label">Status</span>
                      <strong>
                        {(createdPayment.status || "pending").toUpperCase()}
                      </strong>
                    </div>
                  </div>

                  <p className="activation-note">
                    Your subscription and learning access have not been
                    activated by this request. The payment must be confirmed
                    by the payment provider before access is granted.
                  </p>

                  <button
                    type="button"
                    className="pay-button"
                    onClick={() => navigate("/student")}
                  >
                    Return to Student Dashboard
                  </button>
                </div>
              )}

              {!loadingPlans && !selectedPlan && plans.length > 0 && !error && (
                <button
                  type="button"
                  className="pay-button"
                  onClick={returnToPlans}
                >
                  Choose a Subscription Plan
                </button>
              )}

              <p className="activation-note">
                For your security, the amount and authenticated student
                identity are determined by the backend. A pending request
                is not proof of payment.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Payments;
