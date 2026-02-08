"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function MissionVideo() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

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
    <div className="relative w-full" id="video-section">
      <video
        ref={videoRef}
        className="w-full h-[80vh] object-cover"
        src="/videos/SenamileVideoWithSubs.mp4"
        loop
        muted={isMuted}
        playsInline
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Center Overlay Link */}
      <div className="absolute inset-0 flex items-end justify-center pb-20 sm:pb-32">
        <Link
          href="/SenamileMission"
          target="_blank"
          rel="noopener noreferrer"
          className="px-10 py-4 bg-white/80 text-black text-lg sm:text-xl font-semibold
               rounded-full hover:bg-white transition backdrop-blur-sm"
        >
          CHANGE THE WORLD WITH ME
        </Link>
      </div>

      {/* Unmute Button - Right Bottom Corner */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-20 px-4 py-2 bg-black/25 hover:bg-black/80 
                   text-white text-xs uppercase tracking-widest rounded-md 
                   border border-white/5 transition"
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}