"use client";

import { useState } from "react";

const SKILL_AREAS = [
  "Accounting",
  "Artificial intelligence",
  "Branding",
  "Business development",
  "Coaching",
  "Communications",
  "Data analysis",
  "Database administration",
  "Digital advertising",
  "Digital marketing",
  "Engineering",
  "Entrepreneurship",
  "Event planning",
  "Executive leadership",
  "Finance",
  "Fundraising",
  "Graphic design",
  "Human resources",
  "Information technology",
  "Management",
  "Marketing",
  "Organizational design",
  "Photography & video",
  "Project management",
  "Public relations",
  "Research",
  "Sales",
  "Search engine marketing",
  "Social media",
  "Sound editing",
  "Strategy consulting",
  "Talent recruitment",
  "Training",
  "UX/UI design",
  "Web design",
  "Web development",
  "Writing",
];

export default function ProfileStep({
  formData,
  updateFormData,
  onNext,
  userName,
}) {
  const [errors, setErrors] = useState({});
  const [skillSearch, setSkillSearch] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        resume: "Please upload a PDF, JPG, PNG, or SVG file.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File must be under 5MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      updateFormData({
        resumeFile: file,
        resumeBase64: base64,
        resumeFilename: file.name,
        resumeMimetype: file.type,
      });
      setErrors((prev) => ({ ...prev, resume: null }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.displayName.trim())
      newErrors.displayName = "Name is required.";
    if (!formData.resumeBase64)
      newErrors.resume = "Please upload your CV/Resume.";
    if (!formData.skillAreas || formData.skillAreas.length === 0)
      newErrors.skillAreas = "Please select at least one skill area.";
    if (
      formData.linkedinUrl &&
      formData.linkedinUrl.trim() &&
      !formData.linkedinUrl.includes("linkedin.com")
    ) {
      newErrors.linkedinUrl = "Please enter a valid LinkedIn URL.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="skills-step skills-step--profile">
      <h2 className="skills-step-title">TELL US ABOUT YOURSELF</h2>
      <p className="skills-step-subtitle">
        Your skills could change everything.
      </p>

      <div className="skills-form">
        {/* Name */}
        <div className="skills-field">
          <label className="skills-label">Full Name *</label>
          <input
            type="text"
            className="skills-input"
            value={formData.displayName}
            onChange={(e) => updateFormData({ displayName: e.target.value })}
            placeholder={userName || "Your name"}
          />
          {errors.displayName && (
            <span className="skills-error">{errors.displayName}</span>
          )}
        </div>

        {/* Resume upload */}
        <div className="skills-field">
          <label className="skills-label">CV / Resume *</label>
          <div className="skills-file-upload">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.svg"
              onChange={handleFileChange}
              id="resume-upload"
              className="skills-file-input"
            />
            <label htmlFor="resume-upload" className="skills-file-label">
              {formData.resumeFilename ? (
                <span className="skills-file-selected">
                  {formData.resumeFilename}
                </span>
              ) : (
                <>
                  <span className="skills-file-icon">&#8679;</span>
                  <span>
                    Drag your file or <strong>browse</strong>
                  </span>
                  <span className="skills-file-hint">
                    PDF, JPG, PNG, or SVG
                  </span>
                </>
              )}
            </label>
          </div>
          {errors.resume && (
            <span className="skills-error">{errors.resume}</span>
          )}
        </div>

        {/* LinkedIn */}
        <div className="skills-field">
          <label className="skills-label">
            LinkedIn <span className="skills-optional">(optional)</span>
          </label>
          <input
            type="url"
            className="skills-input"
            value={formData.linkedinUrl}
            onChange={(e) => updateFormData({ linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/yourname"
          />
          {errors.linkedinUrl && (
            <span className="skills-error">{errors.linkedinUrl}</span>
          )}
        </div>

        {/* Portfolio */}
        <div className="skills-field">
          <label className="skills-label">
            Portfolio Link <span className="skills-optional">(optional)</span>
          </label>
          <input
            type="url"
            className="skills-input"
            value={formData.portfolioUrl}
            onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
            placeholder="https://yourportfolio.com"
          />
        </div>

        {/* Skill Areas — searchable checkbox grid */}
        <div className="skills-field">
          <label className="skills-label">
            What type of skill do you offer? *
            {(formData.skillAreas || []).length > 0 && (
              <span className="skills-selected-count">
                {" "}({formData.skillAreas.length} selected)
              </span>
            )}
          </label>

          {/* Search filter */}
          <input
            type="text"
            className="skills-input skills-search-input"
            placeholder="Search skills..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
          />

          {/* Selected chips */}
          {(formData.skillAreas || []).length > 0 && (
            <div className="skills-chips">
              {formData.skillAreas.map((skill) => (
                <span key={skill} className="skills-chip">
                  {skill}
                  <button
                    type="button"
                    className="skills-chip-x"
                    onClick={() => {
                      const updated = formData.skillAreas.filter((s) => s !== skill);
                      updateFormData({ skillAreas: updated });
                    }}
                    aria-label={`Remove ${skill}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Checkbox grid */}
          <div className="skills-checkbox-grid">
            {SKILL_AREAS
              .filter((area) =>
                area.toLowerCase().includes(skillSearch.toLowerCase())
              )
              .map((area) => {
                const selected = (formData.skillAreas || []).includes(area);
                return (
                  <label key={area} className="skills-checkbox-item">
                    <input
                      type="checkbox"
                      className="skills-checkbox-input"
                      checked={selected}
                      onChange={() => {
                        const current = formData.skillAreas || [];
                        const updated = selected
                          ? current.filter((s) => s !== area)
                          : [...current, area];
                        updateFormData({ skillAreas: updated });
                        if (updated.length > 0) {
                          setErrors((prev) => ({ ...prev, skillAreas: null }));
                        }
                      }}
                    />
                    <span className="skills-checkbox-box">
                      {selected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="skills-checkbox-label">{area}</span>
                  </label>
                );
              })}
          </div>
          {errors.skillAreas && (
            <span className="skills-error">{errors.skillAreas}</span>
          )}
        </div>
      </div>

      <button className="skills-next-btn" onClick={handleNext}>
        NEXT STEP
      </button>
    </div>
  );
}
