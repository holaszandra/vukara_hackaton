"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import DonationMethodStep from "./steps/DonationMethodStep";
import DonationFormStep from "./steps/DonationFormStep";
import DonationConfirmStep from "./steps/DonationConfirmStep";

const INITIAL_DONATION_DATA = {
  method: null, // 'signin' | 'guest'
  frequency: "one-time", // 'one-time' | 'monthly'
  amount: 100, // default selected amount in EUR
  customAmount: "",
  isPublic: false,
};

export default function DonationModal({ isOpen, onClose }) {
  const { data: session, update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [donationData, setDonationData] = useState(INITIAL_DONATION_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset to step 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setDonationData(INITIAL_DONATION_DATA);
      setError("");
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const updateDonationData = useCallback((updates) => {
    setDonationData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Sign In & Donate — trigger Google auth then advance
  const handleSignIn = async () => {
    const result = await signIn("google", { redirect: false });
    if (result && !result.error) {
      await updateSession();
      setDonationData((prev) => ({ ...prev, method: "signin" }));
      setCurrentStep(2);
    }
  };

  // Donate as Guest — advance directly
  const handleGuest = () => {
    setDonationData((prev) => ({ ...prev, method: "guest" }));
    setCurrentStep(2);
  };

  // Submit donation
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const amount = donationData.customAmount
        ? parseFloat(donationData.customAmount)
        : donationData.amount;

      const res = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "EUR",
          frequency: donationData.frequency,
          isPublic: donationData.isPublic,
          isGuest: donationData.method === "guest",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process donation");
      }

      setCurrentStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
      setDonationData(INITIAL_DONATION_DATA);
      setError("");
    }, 300);
  };

  if (!isOpen) return null;

  const activeAmount = donationData.customAmount
    ? parseFloat(donationData.customAmount) || 0
    : donationData.amount;

  return (
    <div className="donate-modal-overlay" onClick={handleClose}>
      <div
        className="donate-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="donate-modal-header">
          <div className="donate-header-left">
            <span className="donate-header-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <span className="donate-header-text">Invest in the Future</span>
          </div>
          <button
            className="donate-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Gradient accent line */}
        <div className="donate-modal-accent" />

        {/* Step content */}
        <div className="donate-modal-body">
          {currentStep === 1 && (
            <DonationMethodStep
              onSignIn={handleSignIn}
              onGuest={handleGuest}
            />
          )}
          {currentStep === 2 && (
            <DonationFormStep
              donationData={donationData}
              updateDonationData={updateDonationData}
              session={session}
              isGuest={donationData.method === "guest"}
              onSubmit={handleSubmit}
              onBack={() => setCurrentStep(1)}
              submitting={submitting}
              error={error}
            />
          )}
          {currentStep === 3 && (
            <DonationConfirmStep
              amount={activeAmount}
              frequency={donationData.frequency}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
