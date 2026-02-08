"use client";

export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="skills-progress-bar">
      <div className="skills-progress-track">
        <div
          className="skills-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="skills-progress-label">
        Step {current} of {total}
      </span>
    </div>
  );
}
