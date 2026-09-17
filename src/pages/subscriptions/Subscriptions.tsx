import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock,
  Crown,
  HelpCircle,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";

import "./Subscriptions.scss";

type BillingPeriod = "day" | "week" | "month";

interface SubscriptionPlan {
  id: BillingPeriod;
  name: string;
  duration: string;
  price: number;
  description: string;
  popular?: boolean;
  icon: "zap" | "sparkles" | "crown";
  features: string[];
}

interface BackendSubscriptionPlan {
  id?: number | string;
  code?: string;
  name?: string;
  duration?: string;
  period?: string;
  billingPeriod?: string;
  price?: number | string;
  description?: string;
  popular?: boolean;
  features?: string[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/*
|--------------------------------------------------------------------------
| Frontend fallback plans
|--------------------------------------------------------------------------
| These keep the page working while the backend subscription endpoint
| is being completed.
*/

const fallbackPlans: SubscriptionPlan[] = [
  {
    id: "day",
    name: "Day Pass",
    duration: "24 hours",
    price: 500,
    description:
      "Perfect for learners who want quick access to a course or study materials.",
    icon: "zap",
    features: [
      "Access courses for 24 hours",
      "Watch available lessons",
      "Access learning materials",
      "Track your learning progress",
      "Learn from any device",
    ],
  },
  {
    id: "week",
    name: "Weekly Pass",
    duration: "7 days",
    price: 2000,
    description:
      "Get a full week of uninterrupted learning at an affordable price.",
    icon: "sparkles",
    popular: true,
    features: [
      "Access courses for 7 days",
      "Watch all available lessons",
      "Access learning materials",
      "Track your learning progress",
      "Learn from any device",
      "Priority learning support",
    ],
  },
  {
    id: "month",
    name: "Monthly Pass",
    duration: "30 days",
    price: 5000,
    description:
      "Our best value option for learners committed to consistent learning.",
    icon: "crown",
    features: [
      "Access courses for 30 days",
      "Watch all available lessons",
      "Access learning materials",
      "Track your learning progress",
      "Learn from any device",
      "Priority learning support",
      "Access new courses during subscription",
    ],
  },
];

const normalizeBillingPeriod = (
  value?: string
): BillingPeriod | null => {
  const normalized = value?.toLowerCase().trim();

  if (!normalized) {
    return null;
  }

  if (
    normalized === "day" ||
    normalized === "daily" ||
    normalized === "24hours" ||
    normalized === "24-hours"
  ) {
    return "day";
  }

  if (
    normalized === "week" ||
    normalized === "weekly" ||
    normalized === "7days" ||
    normalized === "7-days"
  ) {
    return "week";
  }

  if (
    normalized === "month" ||
    normalized === "monthly" ||
    normalized === "30days" ||
    normalized === "30-days"
  ) {
    return "month";
  }

  return null;
};

const getPlanIcon = (
  period: BillingPeriod
): SubscriptionPlan["icon"] => {
  switch (period) {
    case "day":
      return "zap";

    case "week":
      return "sparkles";

    case "month":
      return "crown";

    default:
      return "sparkles";
  }
};

const normalizePlan = (
  plan: BackendSubscriptionPlan,
  index: number
): SubscriptionPlan | null => {
  const billingPeriod = normalizeBillingPeriod(
    plan.billingPeriod || plan.period || plan.code || plan.name
  );

  if (!billingPeriod) {
    return null;
  }

  const fallbackPlan =
    fallbackPlans.find(
      (item) => item.id === billingPeriod
    ) || fallbackPlans[index];

  const numericPrice = Number(plan.price);

  return {
    id: billingPeriod,

    name:
      plan.name ||
      fallbackPlan?.name ||
      `${billingPeriod} Pass`,

    duration:
      plan.duration ||
      fallbackPlan?.duration ||
      "",

    price:
      Number.isFinite(numericPrice)
        ? numericPrice
        : fallbackPlan?.price || 0,

    description:
      plan.description ||
      fallbackPlan?.description ||
      "",

    popular:
      typeof plan.popular === "boolean"
        ? plan.popular
        : fallbackPlan?.popular,

    icon:
      fallbackPlan?.icon ||
      getPlanIcon(billingPeriod),

    features:
      Array.isArray(plan.features) &&
      plan.features.length > 0
        ? plan.features
        : fallbackPlan?.features || [],
  };
};

const Subscriptions = () => {
  const [subscriptionPlans, setSubscriptionPlans] =
    useState<SubscriptionPlan[]>(fallbackPlans);

  const [selectedPlan, setSelectedPlan] =
    useState<BillingPeriod>("month");

  const [loading, setLoading] = useState(true);

  const [backendConnected, setBackendConnected] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSubscriptionPlans = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("gracia_token");

        const response = await fetch(
          `${API_BASE_URL}/subscriptions/plans`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",

              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

        /*
         * If the endpoint does not exist yet, the fallback
         * plans remain available.
         */
        if (!response.ok) {
          throw new Error(
            `Subscription plans request failed: ${response.status}`
          );
        }

        const result: unknown =
          await response.json();

        let backendPlans: BackendSubscriptionPlan[] = [];

        if (Array.isArray(result)) {
          backendPlans =
            result as BackendSubscriptionPlan[];
        } else if (
          result &&
          typeof result === "object"
        ) {
          const data = result as {
            data?: unknown;
            plans?: unknown;
          };

          if (Array.isArray(data.data)) {
            backendPlans =
              data.data as BackendSubscriptionPlan[];
          } else if (Array.isArray(data.plans)) {
            backendPlans =
              data.plans as BackendSubscriptionPlan[];
          }
        }

        const normalizedPlans =
          backendPlans
            .map((plan, index) =>
              normalizePlan(plan, index)
            )
            .filter(
              (
                plan
              ): plan is SubscriptionPlan =>
                plan !== null
            );

        if (
          mounted &&
          normalizedPlans.length > 0
        ) {
          setSubscriptionPlans(
            normalizedPlans
          );
          setBackendConnected(true);

          /*
           * If the selected plan does not exist in the
           * backend response, select the first available plan.
           */
          setSelectedPlan((current) => {
            const exists =
              normalizedPlans.some(
                (plan) =>
                  plan.id === current
              );

            return exists
              ? current
              : normalizedPlans[0].id;
          });
        }
      } catch (error) {
        console.warn(
          "Subscription plans could not be loaded from the backend. Using fallback plans.",
          error
        );

        if (mounted) {
          setSubscriptionPlans(
            fallbackPlans
          );
          setBackendConnected(false);
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

  const selectedSubscription =
    useMemo(() => {
      return (
        subscriptionPlans.find(
          (plan) =>
            plan.id === selectedPlan
        ) ||
        subscriptionPlans.find(
          (plan) =>
            plan.id === "month"
        ) ||
        subscriptionPlans[0]
      );
    }, [
      selectedPlan,
      subscriptionPlans,
    ]);

  const getIcon = (
    icon: SubscriptionPlan["icon"]
  ) => {
    switch (icon) {
      case "zap":
        return <Zap size={26} />;

      case "sparkles":
        return <Sparkles size={26} />;

      case "crown":
        return <Crown size={26} />;

      default:
        return <Sparkles size={26} />;
    }
  };

  /*
   * Store the selected plan before sending the learner
   * to registration.
   */
  const handlePlanSelection = (
    plan: SubscriptionPlan
  ) => {
    setSelectedPlan(plan.id);

    localStorage.setItem(
      "gracia_selected_plan",
      JSON.stringify({
        id: plan.id,
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
      })
    );
  };

  const selectedPlanQuery =
    selectedSubscription?.id || "month";

  return (
    <div className="subscriptions-page">
      <Navbar />

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section className="subscriptions-hero">
          <Container>
            <div className="subscriptions-hero-content">
              <span className="subscriptions-eyebrow">
                AFFORDABLE LEARNING
              </span>

              <h1>
                Learn More.
                <span>Spend Less.</span>
              </h1>

              <p>
                Choose a subscription that works for
                you. Get affordable access to quality
                digital learning whenever you need it.
              </p>

              <div className="subscription-trust">
                <div>
                  <ShieldCheck size={18} />

                  <span>
                    Secure Learning
                  </span>
                </div>

                <div>
                  <Clock size={18} />

                  <span>
                    Flexible Access
                  </span>
                </div>

                <div>
                  <Check size={18} />

                  <span>
                    Affordable Prices
                  </span>
                </div>
              </div>

              <div className="subscription-hero-note">
                <Sparkles size={16} />

                <span>
                  Flexible day, weekly and monthly
                  learning access
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* =================================================
            PLANS
        ================================================= */}

        <section className="subscription-plans-section">
          <Container>
            <div className="section-heading">
              <span>
                CHOOSE YOUR PLAN
              </span>

              <h2>
                Learning That Fits Your Budget
              </h2>

              <p>
                Start small or commit to a full month.
                You choose how long you want to learn.
              </p>

              <div className="plans-status">
                {loading ? (
                  <>
                    <LoaderCircle
                      size={15}
                      className="spin"
                    />

                    Loading available plans...
                  </>
                ) : backendConnected ? (
                  <>
                    <Check size={15} />

                    Plans loaded from Gracia
                    Education Hub
                  </>
                ) : (
                  <>
                    <Check size={15} />

                    Affordable plans available
                  </>
                )}
              </div>
            </div>

            <div className="subscription-plans">
              {subscriptionPlans.map(
                (plan) => (
                  <article
                    key={plan.id}
                    className={`subscription-card ${
                      plan.popular
                        ? "popular"
                        : ""
                    } ${
                      selectedPlan === plan.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handlePlanSelection(plan)
                    }
                  >
                    {plan.popular && (
                      <div className="popular-badge">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="subscription-card-icon">
                      {getIcon(plan.icon)}
                    </div>

                    <h3>
                      {plan.name}
                    </h3>

                    <p className="subscription-duration">
                      {plan.duration}
                    </p>

                    <div className="subscription-price">
                      <span>
                        MWK
                      </span>

                      <strong>
                        {plan.price.toLocaleString()}
                      </strong>
                    </div>

                    <p className="subscription-description">
                      {plan.description}
                    </p>

                    <div className="subscription-divider" />

                    <ul>
                      {plan.features.map(
                        (feature) => (
                          <li key={feature}>
                            <span className="feature-check">
                              <Check size={14} />
                            </span>

                            {feature}
                          </li>
                        )
                      )}
                    </ul>

                    <Link
                      to={`/register?plan=${plan.id}`}
                      className={
                        plan.popular
                          ? "subscription-button primary"
                          : "subscription-button"
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePlanSelection(
                          plan
                        );
                      }}
                    >
                      Choose {plan.name}

                      <ArrowRight size={17} />
                    </Link>
                  </article>
                )
              )}
            </div>
          </Container>
        </section>

        {/* =================================================
            QUICK SELECTION
        ================================================= */}

        {selectedSubscription && (
          <section className="quick-subscription-section">
            <Container>
              <div className="quick-subscription">
                <div className="quick-subscription-text">
                  <span>
                    GET STARTED
                  </span>

                  <h2>
                    Ready to start learning?
                  </h2>

                  <p>
                    Select your preferred
                    subscription and begin exploring
                    the courses available on Gracia
                    Education Hub.
                  </p>
                </div>

                <div className="quick-subscription-action">
                  <div className="selected-plan">
                    <small>
                      Selected plan
                    </small>

                    <strong>
                      {selectedSubscription.name}
                    </strong>

                    <span>
                      MWK{" "}
                      {selectedSubscription.price.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/register?plan=${selectedPlanQuery}`}
                    className="quick-subscription-button"
                    onClick={() =>
                      handlePlanSelection(
                        selectedSubscription
                      )
                    }
                  >
                    Get Started

                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section className="how-subscriptions-work">
          <Container>
            <div className="section-heading">
              <span>
                HOW IT WORKS
              </span>

              <h2>
                Start Learning in Three Steps
              </h2>

              <p>
                Getting started with Gracia Education
                Hub is simple.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">
                  01
                </div>

                <h3>
                  Choose a Plan
                </h3>

                <p>
                  Select the subscription period
                  that works best for your learning
                  needs and budget.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">
                  02
                </div>

                <h3>
                  Create Your Account
                </h3>

                <p>
                  Register for a Gracia Education Hub
                  account and prepare to begin
                  learning.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">
                  03
                </div>

                <h3>
                  Start Learning
                </h3>

                <p>
                  Complete your payment and get
                  access to the learning content
                  included in your active subscription.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* =================================================
            FAQ
        ================================================= */}

        <section className="subscription-faq">
          <Container>
            <div className="faq-container">
              <div className="faq-introduction">
                <HelpCircle size={34} />

                <span>
                  HAVE QUESTIONS?
                </span>

                <h2>
                  Frequently Asked Questions
                </h2>

                <p>
                  Here are some answers to common
                  questions about our subscriptions.
                </p>
              </div>

              <div className="faq-list">
                <details>
                  <summary>
                    What does my subscription give me?
                  </summary>

                  <p>
                    Your subscription gives you access
                    to the courses and learning materials
                    available under your selected plan
                    for the duration of your subscription.
                  </p>
                </details>

                <details>
                  <summary>
                    Can I use my subscription on my
                    phone?
                  </summary>

                  <p>
                    Yes. Gracia Education Hub is designed
                    to work across phones, tablets and
                    computers so you can learn wherever
                    you are.
                  </p>
                </details>

                <details>
                  <summary>
                    Can I choose different courses?
                  </summary>

                  <p>
                    Yes. Your active subscription can
                    provide access to the available
                    courses included in the platform.
                  </p>
                </details>

                <details>
                  <summary>
                    What happens when my subscription
                    ends?
                  </summary>

                  <p>
                    Your learning access will expire when
                    the subscription period ends. You can
                    renew your subscription whenever you
                    are ready to continue learning.
                  </p>
                </details>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Subscriptions;