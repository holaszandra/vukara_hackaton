export default function HowItWorks() {
  const founderSteps = [
    {
      id: 1,
      title: "STARTUP",
      text: "You started a company 2-5 years ago to change the world. You have a dedicated team and need funds/expertise to grow.",
    },
    {
      id: 2,
      title: "PITCH",
      text: "Share your bold vision with Vukara and submit your business model to prove your solution is a breakthrough.",
    },
    {
      id: 3,
      title: "GET FUNDED",
      text: "We match you to backers and experts who can provide support in cash, expertise, or both.",
    },
  ];

  const funderSteps = [
    {
      id: 1,
      title: "SELECT",
      text: "Browse through Vukara's vetted group of ambitious women entrepreneurs changing the world.",
    },
    {
      id: 2,
      title: "CONNECT",
      text: "Join our global community to learn more about these big bold visions firsthand.",
    },
    {
      id: 3,
      title: "FUND",
      text: "Back them in cash (loan/grant) or in time (sharing your skills, experience, and network).",
    },
  ];

  const handleButtonClick = (e) => {
    e.preventDefault();
    // Logic for waitlist can go here later
  };

  return (
    <section id="how-it-works" className="py-24 px-6 sm:px-16 bg-black text-zinc-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
    How We Work
  </h2>
  <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
    VUKARA selects the boldest women entrepreneurs from the{" "}
    <span className="relative group cursor-help border-b border-dotted border-zinc-500 pb-0.5 text-zinc-200">
      global majority*
      {/* Tooltip Box */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-zinc-800 text-sm text-zinc-300 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-zinc-700 font-normal normal-case tracking-normal">
        Global Majority refers to people who make up approximately 85% of the
        world’s population and are indigenous to the global south, and or, have
        been routinely racialised as ‘ethnic-minorities’ (Rosemary
        Campbell-Stephens).
        {/* Little Arrow under the tooltip */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800"></span>
      </span>
    </span>{" "}
    for anyone to back from anywhere in the world.
  </p>
</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* FOR FOUNDERS */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-8 text-[#800020] border-l-4 border-[#800020] pl-4 uppercase tracking-widest">
              For Builders
            </h3>
            <div className="space-y-6 flex-grow">
              {founderSteps.map((step) => (
                <div
                  key={step.id}
                  className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-[#800020] transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-4xl font-black text-zinc-800 group-hover:text-[#800020] transition-colors">
                      0{step.id}
                    </span>
                    <div>
                      <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{step.title}</h4>
                      <p className="text-zinc-400 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Founder Button */}
            <button
              onClick={handleButtonClick}
              className="mt-10 w-full py-6 bg-[#800020] text-white text-xl font-black rounded-full 
                           hover:bg-[#a00028] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#800020]/20 uppercase"
            >
              Join as Builder
            </button>
          </div>

          {/* FOR FUNDERS */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-8 text-[#800020] border-l-4 border-[#800020] pl-4 uppercase tracking-widest">
              For Backers
            </h3>
            <div className="space-y-6 flex-grow">
              {funderSteps.map((step) => (
                <div
                  key={step.id}
                  className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-[#800020] transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-4xl font-black text-zinc-800 group-hover:text-[#800020] transition-colors">
                      0{step.id}
                    </span>
                    <div>
                      <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{step.title}</h4>
                      <p className="text-zinc-400 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Funder Button */}
            <button
              onClick={handleButtonClick}
              className="mt-10 w-full py-6 bg-[#800020] text-white text-xl font-black rounded-full 
                           hover:bg-[#a00028] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#800020]/20 uppercase"
            >
              Join as Backer
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}