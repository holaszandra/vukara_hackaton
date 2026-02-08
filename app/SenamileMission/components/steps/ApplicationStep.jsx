"use client";

import { useState } from "react";

export default function ApplicationStep({
  formData,
  updateFormData,
  onBack,
  onSubmit,
  submitting,
  error,
  creatorName,
}) {
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!formData.applicationLetter.trim()) {
      setValidationError("Please write your application letter.");
      return;
    }
    if (formData.applicationLetter.trim().length < 50) {
      setValidationError("Please write at least 50 characters.");
      return;
    }
    setValidationError("");
    onSubmit();
  };

  return (
    <div className="skills-step skills-step--application">
      <h2 className="skills-step-title">SEND AN APPLICATION</h2>
      <p className="skills-step-subtitle">For {creatorName}</p>

      <div className="skills-form">
        <div className="skills-field">
          <label className="skills-label">
            Why would you like to join her as a volunteer, and in what you&apos;d
            like to support her?
          </label>
          <textarea
            className="skills-textarea"
            rows={6}
            value={formData.applicationLetter}
            onChange={(e) =>
              updateFormData({ applicationLetter: e.target.value })
            }
            placeholder="Tell us why you want to contribute and how your skills can help..."
          />
          <div className="skills-char-count">
            {formData.applicationLetter.length} characters
          </div>
          {validationError && (
            <span className="skills-error">{validationError}</span>
          )}
          {error && <span className="skills-error">{error}</span>}
        </div>
      </div>

      <div className="skills-btn-row">
        <button
          className="skills-back-btn"
          onClick={onBack}
          disabled={submitting}
        >
          BACK
        </button>
        <button
          className="skills-submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "SENDING..." : "SEND APPLICATION"}
        </button>
      </div>
    </div>
  );
}
