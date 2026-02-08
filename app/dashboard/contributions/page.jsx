"use client";

import Link from "next/link";
import Image from "next/image";

const CREATORS = {
  "senamile-zungu": {
    name: "Senamile Dlamini",
    role: "EcoStitch",
    location: "Nairobi",
    photo: "/images/senamile-profile.png",
    href: "/SenamileMission",
  },
};

export default function MyContributionsPage() {
  // Hardcoded demo data (matches the fake skills flow)
  const application = {
    id: 1,
    status: "pending",
    createdAt: new Date().toISOString(),
    creatorSlug: "senamile-zungu",
    skills: "Web Development, UX/UI Design",
  };

  const creator = CREATORS[application.creatorSlug];

  return (
    <div className="db-donations-page">
      {/* ── Page Header ── */}
      <h1 className="db-page-title">My Contributions</h1>
      <p className="db-page-subtitle">
        Skills you&apos;ve offered to builders on the platform.
      </p>

      {/* ── Activity ── */}
      <h2 className="db-section-label">Applications</h2>
      <div className="db-activity-list">
        <div className="db-activity-card">
          {/* Briefcase Icon */}
          <div className="db-activity-icon db-activity-icon--amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a4 4 0 00-8 0v2" />
            </svg>
          </div>

          {/* Details */}
          <div className="db-activity-details">
            <div className="db-activity-top">
              <span className="db-activity-amount" style={{ fontSize: 16 }}>
                Skills Application
              </span>
              <span className="db-activity-badge db-activity-badge--pending">
                Pending Review
              </span>
            </div>
            <p className="db-activity-date">
              {new Date(application.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
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
      </div>
    </div>
  );
}
