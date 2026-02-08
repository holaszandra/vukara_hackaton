"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "My Profile", href: "/dashboard/profile" },
    { label: "My Donations", href: "/dashboard/donations" },
    { label: "My Contributions", href: "/dashboard/contributions" },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="db-page">
      {/* ── Top Navigation ── */}
      <header className="db-header">
        <div className="db-header-inner">
          {/* Left: Logo + Search */}
          <div className="db-header-left">
            <Link href="/" className="db-logo">
              <span className="db-logo-v">V</span>UKARA
            </Link>
            <div className="db-header-divider" />
            <Link href="/SenamileMission" className="db-explore-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Explore Builders
            </Link>
          </div>

          {/* Right: Nav links */}
          <nav className="db-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`db-nav-link ${pathname === item.href ? "db-nav-link--active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <button
              className="db-nav-link db-nav-logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </nav>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="db-main">
        {children}
      </main>
    </div>
  );
}
