"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import ProgressBar from "./ProgressBar";
import AuthStep from "./steps/AuthStep";
import ProfileStep from "./steps/ProfileStep";
import ApplicationStep from "./steps/ApplicationStep";
import ConfirmationStep from "./steps/ConfirmationStep";

const INITIAL_FORM_DATA = {
  displayName: "",
  resumeFile: null,
  resumeBase64: "",
  resumeFilename: "",
  resumeMimetype: "",
  linkedinUrl: "",
  portfolioUrl: "",
  skillAreas: [],
  applicationLetter: "",
};

export default function GiveSkillsModal({ isOpen, onClose }) {
  const { data: session, update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset to step 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
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

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  // After Google sign-in, refresh session and advance to step 2
  const handleAuth = async () => {
    await updateSession();
    setFormData((prev) => ({
      ...prev,
      displayName: prev.displayName || session?.user?.name || "",
    }));
    setCurrentStep(2);
  };

  // Submit application to the API
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/skills/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.displayName,
          skillArea: formData.skillAreas.join(", "),
          applicationLetter: formData.applicationLetter,
          resumeBase64: formData.resumeBase64,
          resumeFilename: formData.resumeFilename,
          resumeMimetype: formData.resumeMimetype,
          linkedinUrl: formData.linkedinUrl,
          portfolioUrl: formData.portfolioUrl,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }
      setCurrentStep(4);
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
      setFormData(INITIAL_FORM_DATA);
      setError("");
    }, 300);
  };

  if (!isOpen) return null;

  const totalSteps = 3;
  const progressStep = currentStep <= 3 ? currentStep : 3;

  return (
    <div className="skills-modal-overlay" onClick={handleClose}>
      <div
        className="skills-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="skills-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Header with progress (not on confirmation) */}
        {currentStep < 4 && (
          <div className="skills-modal-header">
            <span className="skills-modal-tag">Join the movement</span>
            <h3 className="skills-modal-heading">I Offer my Skills</h3>
            <p className="skills-modal-subheading">Tell us about yourself</p>
            <ProgressBar current={progressStep} total={totalSteps} />
          </div>
        )}

        {/* Step content */}
        <div
          className={
            currentStep === 4 ? "skills-modal-body--flush" : "skills-modal-body"
          }
        >
          {currentStep === 1 && <AuthStep onAuth={handleAuth} />}
          {currentStep === 2 && (
            <ProfileStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(3)}
              userName={session?.user?.name || ""}
            />
          )}
          {currentStep === 3 && (
            <ApplicationStep
              formData={formData}
              updateFormData={updateFormData}
              onBack={() => setCurrentStep(2)}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
              creatorName="Senamile Zungu"
            />
          )}
          {currentStep === 4 && (
            <ConfirmationStep
              name={formData.displayName}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
