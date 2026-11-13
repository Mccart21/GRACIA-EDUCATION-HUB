import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  HelpCircle,
  LoaderCircle,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";
import "./Subscriptions.scss";

type BillingPeriod = "day" | "week" | "month";

interface SubscriptionPlan {
  id: number;
  code: string;
  name: string;
  duration: string;
  billingPeriod: BillingPeriod;
  price: number;
  description: string;
  popular: boolean;
  features: string[];
}

interface BackendSubscriptionPlan {
  id: number | string;
  code: string;
  name: string;
  duration: string;
  billingPeriod: string;
  price: number | string;
  description?: string;
  popular?: boolean | number | string;
  features?: string[] | string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const normalizeBillingPeriod = (
  value: string
): BillingPeriod | null => {
  const normalized = value.toLowerCase().trim();

  if (
    ["day", "daily", "24hours", "24-hours", "24 hours"].includes(
      normalized
    )
  ) {
    return "day";
  }

  if (
    ["week", "weekly", "7days", "7-days", "7 days"].includes(
      normalized
    )
  ) {
    return "week";
  }

  if (
    ["month", "monthly", "30days", "30-days", "30 days"].includes(
      normalized
    )
  ) {
    return "month";
  }

  return null;
};

const normalizeFeatures = (
  features: BackendSubscriptionPlan["features"]
): string[] => {
  if (Array.isArray(features)) {
    return features.filter(
      (feature): feature is string => typeof feature === "string"
    );
  }

  if (typeof features === "string" && features.trim()) {
    try {
      const parsed: unknown = JSON.parse(features);

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (feature): feature is string =>
            typeof feature === "string"
        );
      }
    } catch {
      return features
        .split(/\r?\n|;/)
        .map((feature) => feature.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const normalizePlan = (
  plan: BackendSubscriptionPlan
): SubscriptionPlan | null => {
  const billingPeriod = normalizeBillingPeriod(
    String(plan.billingPeriod ?? "")
  );

  const id = Number(plan.id);
  const price = Number(plan.price);

  if (
    !billingPeriod ||
    !Number.isInteger(id) ||
    id <= 0 ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return null;
  }

  const popularValue = plan.popular;

  return {
    id,
    code: String(plan.code ?? ""),
    name: String(plan.name ?? "Subscription plan"),
    duration: String(plan.duration ?? ""),
    billingPeriod,
    price,
    description: String(plan.description ?? ""),
    popular:
      popularValue === true ||
      popularValue === 1 ||
      popularValue === "1" ||
      popularValue === "true",
    features: normalizeFeatures(plan.features),
  };
};

const Subscriptions = () => {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");
  const subjectId = searchParams.get("subjectId");

  // A checkout must never contain both a course and a subject.
  const hasConflictingItems = Boolean(courseId && subjectId);

  const validCourseId =
    courseId && /^\d+$/.test(courseId) && Number(courseId) > 0
      ? courseId
      : null;

  const validSubjectId =
    subjectId && /^\d+$/.test(subjectId) && Number(subjectId) > 0
      ? subjectId
      : null;

  const hasInvalidItem =
    (courseId !== null && !validCourseId) ||
    (subjectId !== null && !validSubjectId);

  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);

  const [selectedPlan, setSelectedPlan] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSubscriptionPlans = async () => {
      try {
        setLoading(true);
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

        if (!response.ok) {
          throw new Error(
            `Subscription plans request failed: ${response.status}`
          );
        }

        const result: unknown = await response.json();

        let backendPlans: BackendSubscriptionPlan[] = [];

        if (Array.isArray(result)) {
          backendPlans = result as BackendSubscriptionPlan[];
        } else if (result && typeof result === "object") {
          const data = result as {
            data?: unknown;
            plans?: unknown;
          };

          if (Array.isArray(data.data)) {
            backendPlans = data.data as BackendSubscriptionPlan[];
          } else if (Array.isArray(data.plans)) {
            backendPlans = data.plans as BackendSubscriptionPlan[];
          }
        }

        const normalizedPlans = backendPlans
          .map(normalizePlan)
          .filter(
            (plan): plan is SubscriptionPlan => plan !== null
          );

        if (!mounted) return;

        setSubscriptionPlans(normalizedPlans);

        if (normalizedPlans.length === 0) {
          setError(
            "No valid subscription plans are currently available. Please check the plans configured on the server."
          );
          return;
        }

        const storedPlan = localStorage.getItem(
          "gracia_selected_plan"
        );

        if (storedPlan) {
          try {
            const parsed = JSON.parse(storedPlan);
            const storedPlanId = Number(parsed.id);

            const storedPlanExists = normalizedPlans.some(
              (plan) => plan.id === storedPlanId
            );

            if (storedPlanExists) {
              setSelectedPlan(storedPlanId);
              return;
            }
          } catch {
            localStorage.removeItem("gracia_selected_plan");
          }
        }

        const monthlyPlan = normalizedPlans.find(
          (plan) => plan.billingPeriod === "month"
        );

        setSelectedPlan(
          monthlyPlan?.id ?? normalizedPlans[0].id
        );
      } catch (err) {
        console.error("Failed to load subscription plans:", err);

        if (mounted) {
          setError(
            "We could not load the subscription plans. Please make sure the Gracia Education Hub server is running and try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSubscriptionPlans();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePlanSelection = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.id);

    localStorage.setItem(
      "gracia_selected_plan",
      JSON.stringify({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        duration: plan.duration,
        billingPeriod: plan.billingPeriod,
        price: plan.price,
      })
    );

    // Clear old selections first to prevent stale IDs from
    // a previous checkout being reused accidentally.
    localStorage.removeItem("gracia_pending_course");
    localStorage.removeItem("gracia_pending_subject");
    localStorage.removeItem("gracia_paid_course");

    if (validCourseId) {
      localStorage.setItem(
        "gracia_pending_course",
        JSON.stringify({
          courseId: Number(validCourseId),
        })
      );
    } else if (validSubjectId) {
      localStorage.setItem(
        "gracia_pending_subject",
        JSON.stringify({
          subjectId: Number(validSubjectId),
        })
      );
    }
  };

  const getPlanDestination = (plan: SubscriptionPlan): string => {
    if (validCourseId) {
      return `/payments?courseId=${encodeURIComponent(
        validCourseId
      )}&plan=${plan.id}`;
    }

    if (validSubjectId) {
      return `/payments?subjectId=${encodeURIComponent(
        validSubjectId
      )}&plan=${plan.id}`;
    }

    return `/payments?plan=${plan.id}`;
  };

  const faqs = [
    {
      question: "What is a subscription plan?",
      answer:
        "A subscription plan gives you access to learning resources on Gracia Education Hub for a selected period, according to the plan you choose.",
    },
    {
      question: "How do I choose a subscription plan?",
      answer:
        "Browse the available plans, compare their prices and durations, then select the plan that suits your learning needs.",
    },
    {
      question: "How can I pay for my subscription?",
      answer:
        "After selecting a plan, continue to the Payments page and follow the available payment instructions.",
    },
    {
      question: "Can I access my course after subscribing?",
      answer:
        "Once your payment and enrollment have been confirmed, you can access your registered learning through your account.",
    },
    {
      question: "Can I change my subscription plan?",
      answer:
        "Available options for changing a plan may depend on your current subscription. Contact the platform's support team for assistance.",
    },
    {
      question: "What should I do if my payment is not confirmed?",
      answer:
        "Check your payment status. If the issue continues, contact the platform's support team for help.",
    },
  ];

  return (
    <div className="subscriptions-page">
      <Navbar />

      <main>
        {/* SUBSCRIPTION PLANS */}
        <section className="subscription-plans-section">
          <Container>
            <div className="subscription-page-heading">
              <span>SUBSCRIPTION PLANS</span>
              <h1>Choose Your Plan</h1>
              <p>
                Select a subscription period that suits your learning
                needs and budget.
              </p>
            </div>

            {hasConflictingItems && (
              <div className="subscription-message error">
                <HelpCircle size={25} />
                <h2>Invalid registration selection</h2>
                <p>
                  The checkout contains both a course and a subject.
                  Please return to the catalogue and select one
                  learning item at a time.
                </p>
                <Link to="/student">Go to dashboard</Link>
              </div>
            )}

            {hasInvalidItem && !hasConflictingItems && (
              <div className="subscription-message error">
                <HelpCircle size={25} />
                <h2>Invalid learning item</h2>
                <p>
                  The selected course or subject ID is invalid.
                  Please return to the relevant catalogue and try
                  again.
                </p>
                <Link to="/subjects">Browse subjects</Link>
              </div>
            )}

            {!hasConflictingItems &&
              !hasInvalidItem &&
              (validCourseId || validSubjectId) && (
                <p className="course-selection-note">
                  Choose a plan to continue registering for your
                  selected{" "}
                  {validSubjectId ? "subject" : "course"}.
                </p>
              )}

            {loading && (
              <div className="subscription-message">
                <LoaderCircle
                  size={25}
                  className="subscription-spinner"
                />
                <p>Loading available plans...</p>
              </div>
            )}

            {!loading && error && (
              <div className="subscription-message error">
                <HelpCircle size={25} />
                <h2>Plans unavailable</h2>
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              !hasConflictingItems &&
              !hasInvalidItem &&
              subscriptionPlans.length > 0 && (
                <div className="subscription-list">
                  {subscriptionPlans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;

                    return (
                      <article
                        key={plan.id}
                        className={`subscription-row ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="plan-select"
                          onClick={() => handlePlanSelection(plan)}
                          aria-pressed={isSelected}
                        >
                          <span className="plan-radio">
                            {isSelected && <span />}
                          </span>

                          <span className="plan-main">
                            <strong>{plan.name}</strong>
                            <small>{plan.duration}</small>
                          </span>
                        </button>

                        <div className="plan-information">
                          {plan.description && (
                            <p>{plan.description}</p>
                          )}

                          {plan.features.length > 0 && (
                            <ul>
                              {plan.features.map((feature) => (
                                <li key={feature}>
                                  <Check size={15} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="plan-price">
                          <span>MWK</span>
                          <strong>
                            {plan.price.toLocaleString()}
                          </strong>
                        </div>

                        <Link
                          to={getPlanDestination(plan)}
                          className="choose-plan-button"
                          onClick={(event) => {
                            if (
                              hasConflictingItems ||
                              hasInvalidItem
                            ) {
                              event.preventDefault();
                              return;
                            }

                            handlePlanSelection(plan);
                          }}
                          aria-label={`Choose ${plan.name}`}
                        >
                          Choose Plan
                          <ArrowRight size={16} />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              )}
          </Container>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-subscriptions-work">
          <Container>
            <div className="how-it-works-heading">
              <span>HOW IT WORKS</span>
              <h2>Start Learning in Three Steps</h2>
              <p>
                Getting started with Gracia Education Hub is simple.
              </p>
            </div>

            <div className="steps-list">
              <article className="step-row">
                <span className="step-number">01</span>
                <div>
                  <h3>Choose a Plan</h3>
                  <p>
                    Select the subscription period that works best
                    for your learning needs and budget.
                  </p>
                </div>
              </article>

              <article className="step-row">
                <span className="step-number">02</span>
                <div>
                  <h3>Complete Payment</h3>
                  <p>
                    Continue to the payment page and follow the
                    instructions for the available payment method.
                  </p>
                </div>
              </article>

              <article className="step-row">
                <span className="step-number">03</span>
                <div>
                  <h3>Start Learning</h3>
                  <p>
                    Once payment and registration have been
                    confirmed, access your registered learning
                    through your student dashboard.
                  </p>
                </div>
              </article>
            </div>
          </Container>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="faq-section">
          <Container>
            <div className="faq-heading">
              <span className="section-label">NEED HELP?</span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Find answers to common questions about our
                subscription plans and getting started with Gracia
                Education Hub.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div className="faq-item" key={index}>
                    <button
                      type="button"
                      className={`faq-question ${
                        isOpen ? "active" : ""
                      }`}
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span>{faq.question}</span>
                      <span
                        className="faq-toggle"
                        aria-hidden="true"
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        className="faq-answer"
                        id={`faq-answer-${index}`}
                      >
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Subscriptions;