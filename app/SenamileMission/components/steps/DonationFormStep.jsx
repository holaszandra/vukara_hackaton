"use client";

import { useState } from "react";

const ONE_TIME_PRESETS = [50, 100, 250, 500];
const MONTHLY_PRESETS = [10, 15, 50];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DonationFormStep({
  donationData,
  updateDonationData,
  session,
  isGuest,
  onSubmit,
  onBack,
  submitting,
  error,
}) {
  const [isCustom, setIsCustom] = useState(false);
  const [validationError, setValidationError] = useState("");

  const presets =
    donationData.frequency === "monthly" ? MONTHLY_PRESETS : ONE_TIME_PRESETS;

  const handleFrequencyChange = (freq) => {
    const defaults = freq === "monthly" ? MONTHLY_PRESETS : ONE_TIME_PRESETS;
    updateDonationData({
      frequency: freq,
      amount: defaults[1],
      customAmount: "",
    });
    setIsCustom(false);
    setValidationError("");
  };

  const handlePresetClick = (value) => {
    updateDonationData({ amount: value, customAmount: "" });
    setIsCustom(false);
    setValidationError("");
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    updateDonationData({ amount: 0, customAmount: "" });
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    updateDonationData({ customAmount: val, amount: parseFloat(val) || 0 });
    if (parseFloat(val) >= 1) {
      setValidationError("");
    }
  };

  const activeAmount = isCustom
    ? parseFloat(donationData.customAmount) || 0
    : donationData.amount;

  const handleSubmit = () => {
    if (activeAmount < 1) {
      setValidationError("Please enter a valid amount (min \u20AC1).");
      return;
    }
    setValidationError("");
    onSubmit();
  };

  const ctaText = submitting
    ? "Processing..."
    : donationData.frequency === "monthly"
      ? `Donate \u20AC${activeAmount} / month`
      : `Donate \u20AC${activeAmount}`;

  return (
    <div className="donate-form-step">
      {/* Frequency toggle */}
      <div className="donate-frequency-toggle">
        <button
          className={`donate-frequency-btn ${donationData.frequency === "one-time" ? "donate-frequency-btn--active" : ""}`}
          onClick={() => handleFrequencyChange("one-time")}
        >
          One-Time
        </button>
        <button
          className={`donate-frequency-btn ${donationData.frequency === "monthly" ? "donate-frequency-btn--active" : ""}`}
          onClick={() => handleFrequencyChange("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* Amount selection */}
      <p className="donate-amount-label">Select Amount</p>
      <div className="donate-amount-grid">
        {presets.map((value) => (
          <button
            key={value}
            className={`donate-amount-btn ${!isCustom && donationData.amount === value ? "donate-amount-btn--active" : ""}`}
            onClick={() => handlePresetClick(value)}
          >
            &euro;{value}
          </button>
        ))}

        {/* Custom amount */}
        {isCustom ? (
          <div className="donate-amount-custom-input">
            <span className="donate-amount-custom-prefix">&euro;</span>
            <input
              type="number"
              min="1"
              className="donate-amount-custom-field"
              placeholder="Amount"
              value={donationData.customAmount}
              onChange={handleCustomChange}
              autoFocus
            />
          </div>
        ) : (
          <button
            className="donate-amount-btn donate-amount-btn--custom"
            onClick={handleCustomToggle}
          >
            &euro; Custom
          </button>
        )}
      </div>

      {validationError && (
        <span className="donate-error">{validationError}</span>
      )}

      <div className="donate-divider" />

      {/* User info card (signed-in only) */}
      {!isGuest && session?.user && (
        <div className="donate-user-card">
          <div className="donate-user-initials">
            {getInitials(session.user.name)}
          </div>
          <div className="donate-user-info">
            <span className="donate-user-name">{session.user.name}</span>
            <span className="donate-user-email">{session.user.email}</span>
          </div>
          <span className="donate-user-verified">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Verified
          </span>
        </div>
      )}

      {/* Public donation checkbox */}
      <label className="donate-public-checkbox">
        <input
          type="checkbox"
          checked={donationData.isPublic}
          onChange={(e) => updateDonationData({ isPublic: e.target.checked })}
          className="donate-public-input"
        />
        <span className="donate-public-box">
          {donationData.isPublic && (
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 5L4.5 8.5L11 1" />
            </svg>
          )}
        </span>
        <div className="donate-public-text">
          <span className="donate-public-label">Make my donation public</span>
          <span className="donate-public-desc">
            Your name will appear in the supporters list
          </span>
        </div>
      </label>

      {error && <span className="donate-error">{error}</span>}

      {/* CTA button */}
      <button
        className="donate-cta-btn"
        onClick={handleSubmit}
        disabled={submitting || activeAmount < 1}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: 8 }}
        >
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        {ctaText}
      </button>

      {/* Back link */}
      <button
        className="donate-back-link"
        onClick={onBack}
        disabled={submitting}
      >
        Back to options
      </button>
    </div>
  );
}
