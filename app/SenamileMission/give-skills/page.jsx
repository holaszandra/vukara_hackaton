"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../senamile.css";
import ProgressBar from "../components/ProgressBar";
import AuthStep from "../components/steps/AuthStep";
import ProfileStep from "../components/steps/ProfileStep";
import ApplicationStep from "../components/steps/ApplicationStep";
import ConfirmationStep from "../components/steps/ConfirmationStep";

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

export default function GiveSkillsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fake Google sign-in — show loader then advance
  const handleAuth = () => {
    setCurrentStep("loading");
    setTimeout(() => {
      setCurrentStep(2);
    }, 2200);
  };

  // Simulate submitting the application
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setTimeout(() => {
      setSubmitting(false);
      setCurrentStep(4);
    }, 1500);
  };

  const handleDone = () => {
    router.push("/SenamileMission");
  };

  const totalSteps = 3;
  const isNumberStep = typeof currentStep === "number";
  const progressStep = isNumberStep && currentStep <= 3 ? currentStep : 3;

  return (
    <div className="gs-page">
      {/* Back link */}
      <Link href="/SenamileMission" className="gs-back-link">
        &larr; BACK
      </Link>

      <div className="gs-container">
        {/* Header with progress (not on confirmation or loading) */}
        {isNumberStep && currentStep < 4 && (
          <div className="gs-header">
            <span className="gs-tag">Join the movement</span>
            <h1 className="gs-heading">I Offer my Skills</h1>
            <p className="gs-subheading">Tell us about yourself</p>
            <ProgressBar current={progressStep} total={totalSteps} />
          </div>
        )}

        {/* Step content */}
        <div className={currentStep === 4 ? "gs-body gs-body--flush" : "gs-body"}>
          {currentStep === 1 && <AuthStep onAuth={handleAuth} />}

          {currentStep === "loading" && (
            <div className="dn-loader-screen">
              <div className="dn-loader-spinner" />
              <p className="dn-loader-message">Signing you in...</p>
              <p className="dn-loader-sub">Connecting with Google</p>
            </div>
          )}

          {currentStep === 2 && (
            <ProfileStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(3)}
              userName=""
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
              onClose={handleDone}
            />
          )}
        </div>
      </div>
    </div>
  );
}
