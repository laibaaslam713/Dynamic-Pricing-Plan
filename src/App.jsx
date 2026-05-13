import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css"

const PRICING_DATA = {
  monthly: [
    {
      id: 1,
      plan_name: "Starter",
      price: 9,
      billing_cycle: "monthly",
      popular: false,
      color: "#6ee7b7",
      description: "Perfect for individuals and small projects",
      features: [
        { text: "5 Projects", included: true },
        { text: "10 GB Storage", included: true },
        { text: "Basic Analytics", included: true },
        { text: "Email Support", included: true },
        { text: "API Access", included: false },
        { text: "Custom Domain", included: false },
        { text: "Priority Support", included: false },
        { text: "White Labeling", included: false },
      ],
      cta: "Get Started",
    },
    {
      id: 2,
      plan_name: "Pro",
      price: 29,
      billing_cycle: "monthly",
      popular: true,
      color: "#a78bfa",
      description: "Ideal for growing teams and businesses",
      features: [
        { text: "25 Projects", included: true },
        { text: "100 GB Storage", included: true },
        { text: "Advanced Analytics", included: true },
        { text: "Priority Email Support", included: true },
        { text: "API Access", included: true },
        { text: "Custom Domain", included: true },
        { text: "Priority Support", included: false },
        { text: "White Labeling", included: false },
      ],
      cta: "Start Free Trial",
    },
    {
      id: 3,
      plan_name: "Business",
      price: 79,
      billing_cycle: "monthly",
      popular: false,
      color: "#fb923c",
      description: "For scaling companies with advanced needs",
      features: [
        { text: "Unlimited Projects", included: true },
        { text: "1 TB Storage", included: true },
        { text: "Enterprise Analytics", included: true },
        { text: "24/7 Live Support", included: true },
        { text: "Full API Access", included: true },
        { text: "Custom Domain", included: true },
        { text: "Priority Support", included: true },
        { text: "White Labeling", included: false },
      ],
      cta: "Contact Sales",
    },
    {
      id: 4,
      plan_name: "Enterprise",
      price: 199,
      billing_cycle: "monthly",
      popular: false,
      color: "#f472b6",
      description: "Tailored solutions for large organizations",
      features: [
        { text: "Unlimited Projects", included: true },
        { text: "Unlimited Storage", included: true },
        { text: "Custom Analytics", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Full API Access", included: true },
        { text: "Custom Domain", included: true },
        { text: "Priority Support", included: true },
        { text: "White Labeling", included: true },
      ],
      cta: "Talk to Us",
    },
  ],
};

PRICING_DATA.yearly = PRICING_DATA.monthly.map((plan) => ({
  ...plan,
  price: Math.round(plan.price * 12 * 0.8),
  billing_cycle: "yearly",
  cta: plan.cta,
}));

async function fetchPricingPlans(cycle) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.02) {
        reject(new Error("Network error. Please try again."));
      } else {
        resolve(PRICING_DATA[cycle]);
      }
    }, 900);
  });
}

const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "PKR", symbol: "₨", rate: 278 },
  { code: "INR", symbol: "₹", rate: 83 },
];



export default function PricingPlans() {
  const [cycle, setCycle] = useState("monthly");
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cache = useRef({});

  const loadPlans = useCallback(async (selectedCycle) => {
    if (cache.current[selectedCycle]) {
      setPlans(cache.current[selectedCycle]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPricingPlans(selectedCycle);
      cache.current[selectedCycle] = data;  // line 136 fixed
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); 

useEffect(() => { loadPlans(cycle); }, [cycle, loadPlans]);  

  const handleCycle = (c) => { setCycle(c); };
  const handleCurrency = (e) => {
    const found = CURRENCIES.find((cur) => cur.code === e.target.value);
    if (found) setCurrency(found);
  };

  const formatPrice = (price) => {
    const converted = Math.round(price * currency.rate);
    return converted.toLocaleString();
  };

  return (
    <>
      <div className="pricing-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="content">
          <header className="header">
            <div className="eyebrow">✦ Pricing Plans</div>
            <h1>
              One plan for every <br />
              <span className="gradient-text">stage of growth</span>
            </h1>
            <p className="subtitle">
              No hidden fees. No surprises. Choose the plan that fits your team
              and scale freely as you grow.
            </p>
          </header>
          <div className="controls">
            <div className="toggle-wrap">
              <button
                className={`toggle-btn ${cycle === "monthly" ? "active" : ""}`}
                onClick={() => handleCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`toggle-btn ${cycle === "yearly" ? "active" : ""}`}
                onClick={() => handleCycle("yearly")}
              >
                Yearly
                {cycle !== "yearly" && (
                  <span className="save-badge" style={{ marginLeft: 6 }}>Save 20%</span>
                )}
              </button>
            </div>

            <select
              className="currency-select"
              value={currency.code}
              onChange={handleCurrency}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
              <p className="loading-text">Fetching pricing plans…</p>
            </div>
          ) : error ? (
            <div className="error-wrap">
              <div className="error-icon">⚠️</div>
              <p className="error-msg">{error}</p>
              <button className="retry-btn" onClick={() => loadPlans(cycle)}>
                Retry
              </button>
            </div>
          ) : (
            <div className="grid">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  cycle={cycle}
                  currencySymbol={currency.symbol}
                  formattedPrice={formatPrice(plan.price)}
                />
              ))}
            </div>
          )}

          <p className="footer-note">
            All plans include a <strong>14-day free trial</strong>. No credit
            card required.&nbsp;&nbsp;·&nbsp;&nbsp;
            <a href="#">Compare all features →</a>
          </p>
        </div>
      </div>
    </>
  );
}

function PlanCard({ plan, cycle, currencySymbol, formattedPrice }) {
  const monthlyEquivalent =
    cycle === "yearly"
      ? `${currencySymbol}${Math.round((plan.price / 12)).toLocaleString()}/mo`
      : null;

  return (
    <div className={`card ${plan.popular ? "popular" : ""}`}>
      
      <div
        className="card-glow"
        style={{ background: `linear-gradient(90deg, ${plan.color}aa, ${plan.color}44)` }}
      />

      {plan.popular && (
        <div className="badge">
          <span className="badge-dot" />
          Most Popular
        </div>
      )}

      <div className="plan-name">{plan.plan_name}</div>
      <div className="plan-desc">{plan.description}</div>

      <div className="price-row">
        <span className="currency-sym">{currencySymbol}</span>
        <span
          className="price-num"
          style={{
            background: `linear-gradient(135deg, ${plan.color}, white)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {formattedPrice}
        </span>
        <span className="price-period">/{cycle === "monthly" ? "mo" : "yr"}</span>
      </div>

      <div className="yearly-note">
        {monthlyEquivalent ? `≈ ${monthlyEquivalent} — billed annually` : ""}
      </div>

      <div className="divider" />

      <ul className="feature-list">
        {plan.features.map((f, i) => (
          <li key={i} className={`feature-item ${f.included ? "" : "excluded"}`}>
            <span className={`feat-icon ${f.included ? "yes" : "no"}`}>
              {f.included ? "✓" : "×"}
            </span>
            {f.text}
          </li>
        ))}
      </ul>

      <button className={`cta-btn ${plan.popular ? "primary" : "secondary"}`}>
        {plan.cta}
      </button>
    </div>
  );
}