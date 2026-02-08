"use client";

import Link from "next/link";
import Image from "next/image";

// Creator data map (will come from DB later)
const CREATORS = {
  "senamile-zungu": {
    name: "Senamile Dlamini",
    role: "EcoStitch",
    location: "Nairobi",
    photo: "/images/senamile-profile.png",
    href: "/SenamileMission",
  },
};

// Hardcoded demo data for prototype
const DEMO_DONATIONS = [
  {
    id: 1,
    amount: 100,
    currency: "EUR",
    frequency: "one-time",
    isPublic: false,
    status: "completed",
    createdAt: new Date().toISOString(),
    creatorSlug: "senamile-zungu",
  },
];

const DEMO_STATS = {
  totalBacked: 100,
  thisMonth: 100,
  activeRecurring: 0,
  buildersSupported: 1,
  subscriptionCount: 0,
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyDonationsPage() {
  const donations = DEMO_DONATIONS;
  const stats = DEMO_STATS;

  const currentMonthLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="db-donations-page">
      {/* ── Page Header ── */}
      <h1 className="db-page-title">My Donations</h1>
      <p className="db-page-subtitle">
        Track every euro you&apos;ve put behind a builder.
      </p>

      {/* ── Stats Cards ── */}
      <div className="db-stats-grid">
        {/* Total Backed */}
        <div className="db-stat-card db-stat-card--primary">
          <p className="db-stat-label">Total Backed</p>
          <p className="db-stat-value">
            &euro;{Math.round(stats.totalBacked)}
          </p>
          <p className="db-stat-meta">
            {stats.buildersSupported} builder{stats.buildersSupported !== 1 ? "s" : ""} supported
          </p>
        </div>

        {/* This Month */}
        <div className="db-stat-card">
          <p className="db-stat-label">This Month</p>
          <p className="db-stat-value">
            &euro;{Math.round(stats.thisMonth)}
          </p>
          <p className="db-stat-meta">{currentMonthLabel}</p>
        </div>

        {/* Active Recurring */}
        <div className="db-stat-card">
          <p className="db-stat-label">Active Recurring</p>
          <p className="db-stat-value">
            &euro;{Math.round(stats.activeRecurring)}
          </p>
          <p className="db-stat-meta">
            {stats.subscriptionCount > 0
              ? `${stats.subscriptionCount} subscription${stats.subscriptionCount !== 1 ? "s" : ""}`
              : "No subscriptions"}
          </p>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <h2 className="db-section-label">Recent Activity</h2>
      <div className="db-activity-list">
        {donations.map((donation) => {
          const creator = CREATORS[donation.creatorSlug] || {
            name: "Builder",
            role: "",
            location: "",
            photo: null,
            href: "/",
          };

          return (
            <div key={donation.id} className="db-activity-card">
              {/* Heart Icon */}
              <div className="db-activity-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Details */}
              <div className="db-activity-details">
                <div className="db-activity-top">
                  <span className="db-activity-amount">
                    &euro;{Math.round(donation.amount)}
                  </span>
                  <span className="db-activity-badge">
                    {donation.frequency === "monthly"
                      ? "Monthly"
                      : "One-Time"}
                  </span>
                </div>
                <p className="db-activity-date">
                  {formatDate(donation.createdAt)}
                </p>

                {/* Entrepreneur */}
                <div className="db-activity-entrepreneur">
                  {creator.photo && (
                    <div className="db-activity-avatar">
                      <Image
                        src={creator.photo}
                        alt={creator.name}
                        width={32}
                        height={32}
                      />
                    </div>
                  )}
                  <div className="db-activity-entrepreneur-info">
                    <span className="db-activity-entrepreneur-name">
                      {creator.name}
                    </span>
                    <span className="db-activity-entrepreneur-role">
                      {creator.role} &mdash; {creator.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Button */}
              <Link href={creator.href} className="db-activity-view" title="View builder">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
