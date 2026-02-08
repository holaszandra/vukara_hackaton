"use client";

export default function ConfirmationStep({ name, onClose }) {
  return (
    <div className="skills-step skills-step--confirmation">
      {/* Crimson gradient header */}
      <div className="skills-confirm-header">
        <span className="skills-confirm-badge">LET&apos;S BUILD</span>
        <h2 className="skills-confirm-title">You&apos;re In.</h2>
        <p className="skills-confirm-subtitle">
          We&apos;ll hit you back within 3 days
        </p>
      </div>

      {/* Dark body */}
      <div className="skills-confirm-body">
        <div className="skills-confirm-check">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="skills-confirm-welcome">
          Welcome aboard, {name || "friend"}.
        </p>
        <p className="skills-confirm-desc">
          Your application&apos;s locked in. We don&apos;t ghost &mdash; expect
          a reply within <strong>3 business days</strong>.
        </p>
        <button className="skills-gotit-btn" onClick={onClose}>
          GOT IT!
        </button>
      </div>
    </div>
  );
}
