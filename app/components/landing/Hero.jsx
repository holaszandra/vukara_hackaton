export default function Hero() {
  const scrollToHow = (e) => {
    e.preventDefault();
    const element = document.getElementById("how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#800020] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-16 flex flex-col items-center">
        {/* Main Title */}
        <h1 className="text-center text-5xl sm:text-6xl md:text-8xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white text-balance">
          AMBITION IS EVERYWHERE. <br /> ACCESS IS NOT.
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-center text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl font-medium leading-relaxed text-balance">
          VUKARA is the place for <strong>builders</strong> & <strong>backers</strong> to grow breakthrough businesses through crowdsourcing.
        </p>
      </div>

      {/* Subtle Scroll Indicator */}
      <a 
        href="#how-it-works"
        onClick={scrollToHow}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/90 transition-all group"
      >
        <span className="text-xs uppercase tracking-[0.3em] font-bold">Rewrite the rules with us</span>
        <svg 
          className="w-5 h-5 animate-bounce group-hover:translate-y-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  );
}