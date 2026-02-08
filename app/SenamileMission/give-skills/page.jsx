"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session, update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleDone = () => {
    router.push("/SenamileMission");
  };

  const totalSteps = 3;
  const progressStep = currentStep <= 3 ? currentStep : 3;

  return (
    <div className="gs-page">
      {/* Back link */}
      <Link href="/SenamileMission" className="gs-back-link">
        &larr; BACK
      </Link>

      <div className="gs-container">
        {/* Header with progress (not on confirmation) */}
        {currentStep < 4 && (
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
              onClose={handleDone}
            />
          )}
        </div>
      </div>
    </div>
  );
}
