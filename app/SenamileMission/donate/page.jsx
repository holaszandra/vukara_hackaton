"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../senamile.css";

// ── Confetti Engine ──

function useConfetti() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = [
      "#C42847", "#8B1A2B", "#F2EDE8", "#FFD700",
      "#FF6B6B", "#4ECDC4", "#FF9F43", "#EE5A24",
      "#A55EEA", "#FD79A8",
    ];

    const pieces = [];
    const PIECE_COUNT = 150;

    for (let i = 0; i < PIECE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 12;
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4,
        y: canvas.height * 0.35,
        vx: Math.cos(angle) * velocity * (0.5 + Math.random()),
        vy: Math.sin(angle) * velocity * -1 - Math.random() * 6,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.18 + Math.random() * 0.08,
        drag: 0.98 + Math.random() * 0.015,
        opacity: 1,
        fadeDelay: 60 + Math.floor(Math.random() * 60),
        tick: 0,
        shape: Math.random() < 0.3 ? "circle" : Math.random() < 0.6 ? "strip" : "rect",
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      for (const p of pieces) {
        p.tick++;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.tick > p.fadeDelay) {
          p.opacity -= 0.012;
        }
        if (p.opacity <= 0) continue;
        alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "strip") {
          ctx.fillRect(-p.w / 2, -1, p.w, 2.5);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (alive > 0) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, []);

  const cleanup = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  return { canvasRef, fire, cleanup };
}

const ONE_TIME_PRESETS = [50, 100, 250, 500];
const MONTHLY_PRESETS = [10, 15, 50];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DonatePage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { canvasRef, fire: fireConfetti, cleanup: cleanupConfetti } = useConfetti();

  // Step: 1 = auth/method, "loading" = auth loader, 2 = donation form, "payment" = card auth loader, "success" = confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Fire confetti when success step is reached
  useEffect(() => {
    if (currentStep === "success") {
      // Small delay so the DOM has painted the success screen first
      const t = setTimeout(() => fireConfetti(), 150);
      return () => {
        clearTimeout(t);
        cleanupConfetti();
      };
    }
  }, [currentStep, fireConfetti, cleanupConfetti]);
  const [authTab, setAuthTab] = useState("signin");
  const [guestEmail, setGuestEmail] = useState("");
  const [loaderMessage, setLoaderMessage] = useState("");

  // Donation form state
  const [method, setMethod] = useState(null); // 'signin' | 'register' | 'guest'
  const [frequency, setFrequency] = useState("one-time");
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  // ── Step 1 handlers ──

  const showLoaderThenAdvance = (authMethod, message) => {
    setMethod(authMethod);
    setLoaderMessage(message);
    setCurrentStep("loading");
    setTimeout(() => {
      setCurrentStep(2);
    }, 2200);
  };

  const handleGoogleSignIn = () => {
    showLoaderThenAdvance("signin", "Signing you in...");
  };

  const handleGoogleSignUp = () => {
    showLoaderThenAdvance("register", "Creating your account...");
  };

  const handleGuestDonate = () => {
    if (!guestEmail.trim()) return;
    setMethod("guest");
    setCurrentStep(2);
  };

  // ── Step 2 handlers ──

  const presets = frequency === "monthly" ? MONTHLY_PRESETS : ONE_TIME_PRESETS;

  const handleFrequencyChange = (freq) => {
    const defaults = freq === "monthly" ? MONTHLY_PRESETS : ONE_TIME_PRESETS;
    setFrequency(freq);
    setAmount(defaults[1]);
    setCustomAmount("");
    setIsCustom(false);
    setValidationError("");
  };

  const handlePresetClick = (value) => {
    setAmount(value);
    setCustomAmount("");
    setIsCustom(false);
    setValidationError("");
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setAmount(0);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(parseFloat(val) || 0);
    const num = parseFloat(val);
    if (num >= 15) {
      setValidationError("");
    } else if (val !== "" && num < 15) {
      setValidationError("The minimum donation amount is \u20AC15.");
    }
  };

  const activeAmount = isCustom ? (parseFloat(customAmount) || 0) : amount;
  const isAmountValid = isCustom ? activeAmount >= 15 : activeAmount >= 1;

  const handleSubmit = () => {
    if (isCustom && activeAmount < 15) {
      setValidationError("The minimum donation amount is \u20AC15.");
      return;
    }
    if (activeAmount < 1) {
      setValidationError("Please select a donation amount.");
      return;
    }
    setValidationError("");
    setSubmitting(true);
    setCurrentStep("payment");

    // Simulate card authorisation, then show success
    setTimeout(() => {
      setSubmitting(false);
      setCurrentStep("success");
    }, 2800);
  };

  const ctaText = submitting
    ? "Processing..."
    : frequency === "monthly"
      ? `Donate \u20AC${activeAmount} / month`
      : `Donate \u20AC${activeAmount}`;

  // ── Success screen content (4 scenarios) ──

  const isGuest = method === "guest";
  const isMonthly = frequency === "monthly";

  // Entrepreneur data (will come from DB later)
  const entrepreneur = {
    name: "Senamile Dlamini",
    role: "Founder, EcoStitch",
    location: "Nairobi",
    photo: "/images/senamile-profile.png",
    instagram: "https://www.instagram.com/senamile.dlamini",
    quoteOneOff: "Thank you for believing in me before the world did. Your backing isn't just money \u2014 it's proof that someone out there sees what I'm building. That changes everything.",
    quoteMonthly: "Knowing someone shows up for me every month? That's not just funding \u2014 that's someone who's got my back for real. I won't let you down.",
  };

  const donorEmail = isGuest ? guestEmail : (session?.user?.email || "user@example.com");
  const yearlyAmount = activeAmount * 12;

  // Next charge date (1 month from today)
  const nextChargeDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" });
  })();

  const successContent = (() => {
    if (isGuest && !isMonthly) {
      // Scenario 1: Guest + One-off
      return {
        title: "You did it.",
        subtitle: `\u20AC${activeAmount} just moved the needle.`,
        quote: entrepreneur.quoteOneOff,
        vukaraMessage: "You just backed a builder scaling her breakthrough. That\u2019s a power move for a more equal world.",
        vukaraAccent: "Be proud. Not everyone acts. You did.",
        showSignUpCTA: true,
        signUpHeading: null,
        signUpText: `Create an account to track how your \u20AC${activeAmount} scales her business. Get updates. Fund more builders.`,
        primaryAction: { label: "Back to Entrepreneur", route: "/SenamileMission" },
        secondaryAction: null,
      };
    }

    if (isGuest && isMonthly) {
      // Scenario 2: Guest + Monthly recurring
      return {
        title: "You're in. Monthly.",
        subtitle: `\u20AC${activeAmount}/month \u2014 steady backing that compounds.`,
        quote: entrepreneur.quoteMonthly,
        vukaraMessage: `\u20AC${activeAmount} a month. \u20AC${yearlyAmount} a year. That's not spare change \u2014 that's a runway for a woman building something the world told her she couldn't.`,
        vukaraAccent: "You just became her monthly co-builder. Own that.",
        showSignUpCTA: true,
        signUpHeading: "Your backing runs monthly now.",
        signUpText: `Create an account to track your impact, manage payments, pause or cancel \u2014 and get updates straight from her.`,
        primaryAction: { label: "Back to Entrepreneur", route: "/SenamileMission" },
        secondaryAction: null,
      };
    }

    if (!isGuest && !isMonthly) {
      // Scenario 3: Signed-in user + One-off
      return {
        title: "You did it.",
        subtitle: `\u20AC${activeAmount} just moved the needle.`,
        quote: entrepreneur.quoteOneOff,
        vukaraMessage: "You just backed a builder scaling her breakthrough. That\u2019s a power move for a more equal world.",
        vukaraAccent: "Be proud. Not everyone acts. You did.",
        showSignUpCTA: false,
        signUpHeading: null,
        signUpText: "",
        primaryAction: { label: "Go to My Donations", route: "/dashboard/donations" },
        secondaryAction: null,
      };
    }

    // Scenario 4: Signed-in user + Monthly recurring
    return {
      title: "You're in. Monthly.",
      subtitle: `\u20AC${activeAmount}/month \u2014 steady backing that compounds.`,
      quote: entrepreneur.quoteMonthly,
      vukaraMessage: `\u20AC${activeAmount} a month. \u20AC${yearlyAmount} a year. That's not spare change \u2014 that's a runway for a woman building something the world told her she couldn't.`,
      vukaraAccent: "You just became her monthly co-builder. Own that.",
      showSignUpCTA: false,
      signUpHeading: null,
      signUpText: "",
      primaryAction: { label: "Go to My Donations", route: "/dashboard/donations" },
      secondaryAction: null,
    };
  })();

  // ── Render ──

  return (
    <div className="dn-page">
      {/* Confetti canvas overlay */}
      <canvas ref={canvasRef} className="dn-confetti-canvas" />

      {currentStep !== "success" && (
        <Link href="/SenamileMission" className="dn-back-link">
          &larr; BACK
        </Link>
      )}

      <div className="dn-container">
        {/* ══════════════ STEP 1: Auth / Method ══════════════ */}
        {currentStep === 1 && (
          <>
            {/* Branding */}
            <div className="dn-brand">
              <h1 className="dn-logo">VUKARA</h1>
              <p className="dn-tagline">Fund bold moves. Break the system.</p>
            </div>

            {/* Auth Card with Tabs */}
            <div className="dn-auth-card">
              <div className="dn-tabs">
                <button
                  className={`dn-tab ${authTab === "signin" ? "dn-tab--active" : ""}`}
                  onClick={() => setAuthTab("signin")}
                >
                  SIGN IN
                </button>
                <button
                  className={`dn-tab ${authTab === "register" ? "dn-tab--active" : ""}`}
                  onClick={() => setAuthTab("register")}
                >
                  JOIN THE MOVEMENT
                </button>
              </div>

              <div className="dn-tab-body">
                {authTab === "signin" && (
                  <>
                    <p className="dn-tab-desc">
                      Welcome back. Your builders are waiting.
                    </p>
                    <button className="dn-google-btn" onClick={handleGoogleSignIn}>
                      <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </>
                )}

                {authTab === "register" && (
                  <>
                    <p className="dn-tab-desc">
                      Ready to back the global majority? Let&apos;s go.
                    </p>
                    <button className="dn-google-btn" onClick={handleGoogleSignUp}>
                      <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>Sign up with Google</span>
                    </button>
                    <p className="dn-terms">
                      By signing up, you agree to our{" "}
                      <span className="dn-terms-link">Terms</span> &amp;{" "}
                      <span className="dn-terms-link">Privacy Policy</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="dn-divider-row">
              <div className="dn-divider-line" />
              <span className="dn-divider-text">OR GIVE WITHOUT AN ACCOUNT</span>
              <div className="dn-divider-line" />
            </div>

            {/* Guest Card */}
            <div className="dn-guest-card">
              <div className="dn-guest-header">
                <span className="dn-guest-heart">&#x2764;</span>
                <span className="dn-guest-title">Donate as Guest</span>
              </div>
              <p className="dn-guest-desc">
                No account needed. Just your email for a receipt.
              </p>
              <div className="dn-guest-form">
                <input
                  type="email"
                  className="dn-guest-input"
                  placeholder="your@email.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGuestDonate()}
                />
                <button
                  className="dn-guest-btn"
                  onClick={handleGuestDonate}
                  disabled={!guestEmail.trim()}
                >
                  Fund Her &nbsp;&rarr;
                </button>
              </div>
            </div>

            <p className="dn-footer-quote">
              We create pathways where there are none.
            </p>
          </>
        )}

        {/* ══════════════ LOADING: Auth Loader ══════════════ */}
        {currentStep === "loading" && (
          <div className="dn-loader-screen">
            <div className="dn-loader-spinner" />
            <p className="dn-loader-message">{loaderMessage}</p>
            <p className="dn-loader-sub">Connecting with Google</p>
          </div>
        )}

        {/* ══════════════ STEP 2: Donation Form ══════════════ */}
        {currentStep === 2 && (
          <div className="dn-form-step">
            {/* Header */}
            <div className="dn-form-header">
              <div className="dn-form-header-left">
                <span className="dn-form-header-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </span>
                <span className="dn-form-header-text">Invest in the Future</span>
              </div>
              <button
                className="dn-form-close"
                onClick={() => router.push("/SenamileMission")}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Accent line */}
            <div className="dn-form-accent" />

            {/* Form body */}
            <div className="dn-form-body">
              {/* Frequency toggle */}
              <div className="dn-freq-toggle">
                <button
                  className={`dn-freq-btn ${frequency === "one-time" ? "dn-freq-btn--active" : ""}`}
                  onClick={() => handleFrequencyChange("one-time")}
                >
                  One-Time
                </button>
                <button
                  className={`dn-freq-btn ${frequency === "monthly" ? "dn-freq-btn--active" : ""}`}
                  onClick={() => handleFrequencyChange("monthly")}
                >
                  Monthly
                </button>
              </div>

              {/* Amount selection */}
              <p className="dn-amount-label">Select Amount</p>
              <div className="dn-amount-grid">
                {presets.map((value) => (
                  <button
                    key={value}
                    className={`dn-amount-btn ${!isCustom && amount === value ? "dn-amount-btn--active" : ""}`}
                    onClick={() => handlePresetClick(value)}
                  >
                    &euro;{value}
                  </button>
                ))}

                {isCustom ? (
                  <div className="dn-amount-custom-input">
                    <span className="dn-amount-custom-prefix">&euro;</span>
                    <input
                      type="number"
                      min="1"
                      className="dn-amount-custom-field"
                      placeholder="Amount"
                      value={customAmount}
                      onChange={handleCustomChange}
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    className="dn-amount-btn dn-amount-btn--custom"
                    onClick={handleCustomToggle}
                  >
                    &euro; Custom
                  </button>
                )}
              </div>

              {validationError && (
                <span className="dn-error">{validationError}</span>
              )}

              <div className="dn-form-divider" />

              {/* User card (signed-in users) */}
              {method !== "guest" && (
                <div className="dn-user-card">
                  <div className="dn-user-initials">
                    {session?.user ? getInitials(session.user.name) : "U"}
                  </div>
                  <div className="dn-user-info">
                    <span className="dn-user-name">
                      {session?.user?.name || "Signed-in User"}
                    </span>
                    <span className="dn-user-email">
                      {session?.user?.email || "user@example.com"}
                    </span>
                  </div>
                  <span className="dn-user-verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    Verified
                  </span>
                </div>
              )}

              {/* Guest email display */}
              {method === "guest" && guestEmail && (
                <div className="dn-user-card">
                  <div className="dn-user-initials dn-user-initials--guest">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="dn-user-info">
                    <span className="dn-user-name">Guest Donor</span>
                    <span className="dn-user-email">{guestEmail}</span>
                  </div>
                </div>
              )}

              {error && <span className="dn-error">{error}</span>}

              {/* CTA button */}
              <button
                className="dn-cta-btn"
                onClick={handleSubmit}
                disabled={submitting || !isAmountValid}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                {ctaText}
              </button>

              {/* Back link */}
              <button
                className="dn-back-to-options"
                onClick={() => setCurrentStep(1)}
                disabled={submitting}
              >
                Back to options
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ PAYMENT: Card Authorisation Loader ══════════════ */}
        {currentStep === "payment" && (
          <div className="dn-loader-screen">
            <div className="dn-payment-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="dn-loader-spinner" />
            <p className="dn-loader-message">Authorising Payment...</p>
            <p className="dn-loader-sub">
              Processing &euro;{activeAmount}{frequency === "monthly" ? " / month" : ""}
            </p>
            <p className="dn-loader-dev-note">
              At this stage we redirect users for the card authorisation page
            </p>
          </div>
        )}

        {/* ══════════════ SUCCESS: Payment Confirmation ══════════════ */}
        {currentStep === "success" && (
          <div className="dn-success-screen">
            {/* ── Checkmark + Title ── */}
            <div className="dn-success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="dn-success-title">{successContent.title}</h2>
            <p className="dn-success-subtitle">{successContent.subtitle}</p>

            {/* ── Monthly Backer Badge (monthly only) ── */}
            {isMonthly && (
              <div className="dn-success-monthly-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
                MONTHLY BACKER
              </div>
            )}

            {/* ── Entrepreneur Quote Card ── */}
            <div className="dn-success-quote-card">
              <p className="dn-success-quote">
                &ldquo;{successContent.quote}&rdquo;
              </p>
            </div>

            {/* ── Entrepreneur Identity ── */}
            <div className="dn-success-entrepreneur">
              <div className="dn-success-avatar">
                <Image
                  src={entrepreneur.photo}
                  alt={entrepreneur.name}
                  width={48}
                  height={48}
                  className="dn-success-avatar-img"
                />
              </div>
              <div className="dn-success-entrepreneur-info">
                <span className="dn-success-entrepreneur-name">{entrepreneur.name}</span>
                <span className="dn-success-entrepreneur-role">
                  {entrepreneur.role} &mdash; {entrepreneur.location}
                </span>
              </div>
            </div>

            {/* ── Vukara Message Card ── */}
            <div className="dn-success-vukara-card">
              <p className="dn-success-vukara-msg">{successContent.vukaraMessage}</p>
              <p className="dn-success-vukara-accent">{successContent.vukaraAccent}</p>
            </div>

            {/* ── Follow on Instagram (card style) ── */}
            <a
              href={entrepreneur.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="dn-success-instagram-card"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Follow {entrepreneur.name.split(" ")[0]}&apos;s progress on Instagram
            </a>

            {/* ── Signed-in User CTA ── */}
            {!successContent.showSignUpCTA && (
              <button
                className="dn-cta-btn dn-cta-btn--donations"
                onClick={() => router.push(successContent.primaryAction.route)}
              >
                {successContent.primaryAction.label} &nbsp;&rarr;
              </button>
            )}

            {/* ── Receipt confirmation ── */}
            {!isMonthly && (
              <div className="dn-success-receipt-simple">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Receipt sent to {donorEmail}</span>
              </div>
            )}

            {/* ── Monthly: Subscription Details Card ── */}
            {isMonthly && (
              <>
                <div className="dn-success-sub-card">
                  <div className="dn-success-sub-row">
                    <span className="dn-success-sub-label">Amount</span>
                    <span className="dn-success-sub-value dn-success-sub-value--highlight">
                      &euro;{activeAmount.toFixed(2)} / month
                    </span>
                  </div>
                  <div className="dn-success-sub-row">
                    <span className="dn-success-sub-label">Next charge</span>
                    <span className="dn-success-sub-value">{nextChargeDate}</span>
                  </div>
                  <div className="dn-success-sub-row">
                    <span className="dn-success-sub-label">Receipt sent to</span>
                    <span className="dn-success-sub-value">{donorEmail}</span>
                  </div>
                  <div className="dn-success-sub-row">
                    <span className="dn-success-sub-label">Status</span>
                    <span className="dn-success-sub-status">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Active
                    </span>
                  </div>
                </div>

                <p className="dn-success-manage-text">
                  You can cancel or adjust anytime.{" "}
                  <button className="dn-success-manage-link">
                    Manage subscription via email
                  </button>
                </p>
              </>
            )}

            {/* ── Guest Sign-Up CTA ── */}
            {successContent.showSignUpCTA && (
              <>
                {!isMonthly && (
                  <div className="dn-success-divider-row">
                    <div className="dn-divider-line" />
                    <span className="dn-success-divider-text">WANT TO SEE HER GROW?</span>
                    <div className="dn-divider-line" />
                  </div>
                )}

                <div className={`dn-success-signup-card ${isMonthly ? "dn-success-signup-card--monthly" : ""}`}>
                  {successContent.signUpHeading && (
                    <h3 className="dn-success-signup-heading">{successContent.signUpHeading}</h3>
                  )}
                  <p className="dn-success-signup-desc">{successContent.signUpText}</p>
                  <button className="dn-google-btn" onClick={handleGoogleSignUp}>
                    <svg width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Sign up with Google</span>
                  </button>
                  <button
                    className="dn-success-maybe-later"
                    onClick={() => router.push("/SenamileMission")}
                  >
                    Maybe later
                  </button>
                </div>
              </>
            )}

            {/* ── Footer ── */}
            <p className="dn-footer-quote">
              We create pathways where there are none.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
