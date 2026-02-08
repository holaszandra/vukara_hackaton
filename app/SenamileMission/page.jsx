"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import "./senamile.css";
// DonationModal import removed — donation now uses full-page flow

export default function SenamileMission() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  // isDonationOpen state removed — donation now uses full-page flow

  // Scroll-triggered entrance for timeline nodes
  useEffect(() => {
    const nodes = document.querySelectorAll(".tl-node");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => nodes.forEach((node) => observer.unobserve(node));
  }, []);

  // Auto-play/pause video when scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="sm-page">
      {/* Back link */}
      <Link href="/#video-section" className="back-link">
        BACK
      </Link>

      {/* ── Hero Profile Header ── */}
      <section className="hero-profile">
        <div className="hero-inner">
          {/* Profile Image */}
          <div className="profile-col">
            <div className="profile-img">
              <div className="profile-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Info + Buttons */}
          <div className="profile-info">
            <p className="hero-tagline">HELP HER MAKE AN IMPACT</p>
            <h1 className="hero-name">Senamile Zungu</h1>
            <p className="hero-quote">
              &ldquo;I am not just a voice — I build a movement.&rdquo;
            </p>
            <p className="hero-desc">
              Creator of <strong>Colour-Full</strong> · Creating space for voices too often overlooked
            </p>

            <div className="hero-actions">
              <Link href="/SenamileMission/donate" className="hero-btn hero-btn--fund">
                <span className="hero-btn-icon">♥</span>
                <div>
                  <span className="hero-btn-label">Fund Her Now</span>
                  <span className="hero-btn-sub">Support the vision financially</span>
                </div>
              </Link>
              <Link href="/SenamileMission/give-skills" className="hero-btn hero-btn--skills">
                <span className="hero-btn-icon">⚡</span>
                <div>
                  <span className="hero-btn-label">Give Your Skills</span>
                  <span className="hero-btn-sub">Contribute your expertise</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline: The Dream (Node 1 — left side) ── */}
      <section className="timeline">
        <div className="tl-node">
          <div className="tl-content">
            <div className="step-num">STEP 01</div>
            <h2>THE DREAM</h2>
            <div className="body-text">
              At the heart of my work is a bold vision: to nurture conversations that build bridges instead of walls, to empower young people to speak their truths, and to redefine what inclusion looks like — not only in South Africa but across the world.
              <br /><br />
              My podcast invites listeners into raw, courageous dialogues that challenge old narratives, dismantle prejudice, and celebrate shared humanity. To make a real change it is important to think outside our borders, and think of rebuilding the system.
            </div>
          </div>
          <div className="tl-dot-col">
            <div className="tl-dot"></div>
          </div>
          <div className="tl-media">
            <div className="recording-video">
              <video
                ref={videoRef}
                className="recording-player"
                src="/videos/SenamileVideoWithSubs.mp4"
                loop
                muted={isMuted}
                playsInline
              />
              <button onClick={toggleMute} className="mute-btn">
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Where I Am Going: Centered Breakout ── */}
      <section className="breakout-section">
        <div className="breakout-inner">
          <div className="step-num" style={{ textAlign: "center" }}>STEP 02</div>
          <h2 className="breakout-title">WHERE I AM GOING</h2>
          <div className="breakout-items">
            <div className="breakout-item">
              <strong>✨ Social Impact Hub</strong>
              <span>Grow into a multi-platform hub with digital content, live events, and workshops.</span>
            </div>
            <div className="breakout-item">
              <strong>✨ Mentorship</strong>
              <span>Develop programs connecting young women and youth of colour with skills and confidence.</span>
            </div>
            <div className="breakout-item">
              <strong>✨ Collaborations</strong>
              <span>Partner with educators and media to embed identity and inclusion into public discourse.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline Part 2: What Do I Need (Node 2 — left side) ── */}
      <section className="timeline timeline--part2">
        <div className="tl-node">
          <div className="tl-content">
            <div className="step-num">STEP 03</div>
            <h2>WHAT DO I NEED</h2>
            <div className="body-text">
              <div className="need-item">
                <div className="need-icon">🎙</div>
                <div>
                  <strong>Production Power</strong>
                  <span>Quality costs money. Studio time, editing, distribution — the backbone of every episode that hits hard.</span>
                </div>
              </div>
              <div className="need-item">
                <div className="need-icon">🧠</div>
                <div>
                  <strong>Bold Voices</strong>
                  <span>Experts who don&apos;t play it safe. Thinkers, builders, and disruptors ready to challenge the narrative on-air.</span>
                </div>
              </div>
              <div className="need-item">
                <div className="need-icon">📡</div>
                <div>
                  <strong>Global Reach</strong>
                  <span>This movement won&apos;t scale itself. Marketing, partnerships, and distribution to break through the noise — worldwide.</span>
                </div>
              </div>
              <div className="need-item">
                <div className="need-icon">🤝</div>
                <div>
                  <strong>Community-Backed Momentum</strong>
                  <span>Not a following — a force. A global network of backers, allies, and co-conspirators building what the system won&apos;t.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="tl-dot-col">
            <div className="tl-dot"></div>
          </div>
          <div className="tl-media">
            <div className="action-buttons">
              <Link href="/SenamileMission/donate" className="action-btn action-btn--primary">FUND HER NOW</Link>
              <Link href="/SenamileMission/give-skills" className="action-btn action-btn--secondary">GIVE YOUR SKILLS</Link>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      <p className="sm-quote">
        &ldquo;This is not a hobby — it is a movement rooted in purpose.&rdquo;
      </p>

      {/* Donation now uses full-page flow at /SenamileMission/donate */}
    </div>
  );
}
