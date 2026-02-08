"use client";

export default function ConfirmationStep({ name, onClose }) {
  return (
    <div className="skills-confirm-modal">
      {/* Header bar */}
      <div className="skills-confirm-modal-header">
        <div className="skills-confirm-modal-header-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 7V5a4 4 0 00-8 0v2" />
          </svg>
          <span>Offer Your Skills</span>
        </div>
        <button className="skills-confirm-modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="skills-confirm-modal-body">
        {/* Green checkmark */}
        <div className="skills-confirm-modal-check">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 className="skills-confirm-modal-title">Application Sent!</h2>
        <p className="skills-confirm-modal-desc">
          Thank you for offering your skills. Senamile will review your
          application and get back to you shortly.
        </p>

        <button className="skills-confirm-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
