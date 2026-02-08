"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const videos = [
  { id: 1, src: "/videos/KattyVideo.mp4", title: "Gender parity in entrepreneurship", description: "We live in a polarized world, in which marginalized communities don't have access to the opportunities they deserve." },
  { id: 2, src: "/videos/SenamileVideoWithSubs.mp4", title: "Access to opportunities for women", description: "Women don't need to be empowered, we need access to resources." },
  { id: 3, src: "/videos/SenamileVideoWithSubs.mp4", title: "Unlocking more potential", description: "Women don't need to be empowered, we need access to resources." },
];

export default function VideoCarousel() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      // Using a slight offset (width * 0.5) ensures the dot updates 
      // when the next slide is halfway across the screen
      const index = Math.round(scrollLeft / width);
      setActiveDot(index);
    }
  };

  const scrollToSlide = (index) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-black text-center px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-16 text-zinc-900 dark:text-zinc-100 text-4xl sm:text-6xl font-bold tracking-tight">
          Meet Our Builders:
        </h2>

        {/* Main Scroll Container 
          - Increased width to max-w-5xl for a "hero" feel
          - Added padding-right to show the 'peek' of the next slide
        */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 px-[5vw] sm:px-[10vw]"
        >
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="snap-center shrink-0 w-[85vw] lg:w-[800px] flex flex-col"
            >
              {/* Video Box - Made taller and wider */}
              <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <video
                  src={video.src}
                  muted={isMuted}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover scale-105" /* subtle zoom for impact */
                />
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-8 right-8 z-30 px-5 py-2.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-2xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              </div>

              {/* Text Content - Aligned for a premium look */}
              <div className="mt-10 text-left">
                <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                  {video.title}
                </h3>
                <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  {video.description}
                </p>
                <div className="mt-8">
                  <Link
                    href="/SenamileMission"
                    className="group inline-flex items-center text-[#800020] font-bold text-base uppercase tracking-widest"
                  >
                    Change the world with me 
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Dots Indicator */}
<div className="flex justify-center gap-4 mt-12"> {/* Increased margin-top slightly */}
  {videos.map((_, i) => (
    <button
      key={i}
      onClick={() => scrollToSlide(i)}
      className={`group relative h-4 items-center flex transition-all duration-300 cursor-pointer`}
      aria-label={`Go to slide ${i + 1}`}
    >
      {/* This inner div is the actual visual bar */}
      <div 
        className={`h-2 rounded-full transition-all duration-500 ease-out ${
          activeDot === i 
            ? "w-20 bg-[#800020]" 
            : "w-6 bg-zinc-200 dark:bg-zinc-800 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-600"
        }`} 
      />
    </button>
  ))}
</div>
      </div>
    </section>
  );
}