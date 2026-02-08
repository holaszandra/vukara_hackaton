"use client";

export default function DonationMethodStep({ onSignIn, onGuest }) {
  return (
    <div className="donate-method-step">
      <h2 className="donate-method-title">How would you like to donate?</h2>
      <p className="donate-method-subtitle">
        Choose how you want to support Senamile&apos;s vision.
      </p>

      <div className="donate-method-cards">
        {/* Sign In & Donate */}
        <button className="donate-method-card" onClick={onSignIn}>
          <div className="donate-method-card-icon donate-method-card-icon--teal">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="donate-method-card-text">
            <span className="donate-method-card-label">Sign In &amp; Donate</span>
            <span className="donate-method-card-desc">
              Track your history and access dashboard
            </span>
          </div>
          <span className="donate-method-card-arrow">&rarr;</span>
        </button>

        {/* Donate as Guest */}
        <button className="donate-method-card" onClick={onGuest}>
          <div className="donate-method-card-icon donate-method-card-icon--gray">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="donate-method-card-text">
            <span className="donate-method-card-label">Donate as Guest</span>
            <span className="donate-method-card-desc">
              One-time donation without registering
            </span>
          </div>
          <span className="donate-method-card-arrow">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
