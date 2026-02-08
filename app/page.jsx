"use client";
import Hero from "./components/landing/Hero";
import Waitlist from "./components/landing/Waitlist";
import HowItWorks from "./components/landing/HowItWorks";
import VideoCarousel from "./components/landing/VideoCarousel";
import AboutUs from "./components/landing/AboutUs.jsx";
// import MissionVideo from "./components/landing/MissionVideo"; // Imported here

export default function Home() {
  return (
    <div className="dark:bg-black font-sans">
      <Hero />

      {/* Commented out for now as per your request */}
      {/* <MissionVideo /> */}

      <VideoCarousel />
      <HowItWorks />
      <AboutUs />
      <Waitlist />

      <footer className="py-12 px-6 sm:px-16 text-center text-zinc-500 dark:text-zinc-400">
        <p>&copy; {new Date().getFullYear()} Vukara. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}