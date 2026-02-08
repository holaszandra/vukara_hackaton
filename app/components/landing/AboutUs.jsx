export default function AboutUs() {
  return (
    <section className="py-24 px-6 sm:px-16 bg-zinc-50 text-black font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Title & Origin Story */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 text-center lg:text-left">
            About <span className="text-[#800020]">us</span>
          </h2>
          
          <div className="max-w-4xl">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-800">
              VUKARA is rooted in the word <span className="italic font-bold">VUKA</span>. 
              In Zulu and Xhosa, it means to <span className="text-[#800020]">“wake up”</span> and <span className="text-[#800020]">“arise”</span>. 
              In Swahili, it is the act of <span className="text-[#800020]">“crossing over”</span>.
            </p>
            <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
              Together, they define the most critical stage of the founder’s journey: the transition. 
              Founders are often left to cross this 2–5 year threshold without sufficient resources to build. 
              We see this period as an opportunity for builders and backers to redefine the future together.
            </p>
          </div>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 border-b border-zinc-200 pb-16">
          <div className="space-y-4">
            <h3 className="text-[#800020] font-black uppercase tracking-widest text-sm">Vision</h3>
            <p className="text-4xl font-bold tracking-tighter leading-tight">
              Equal chances for <br />
              <span className="text-[#800020]">equal humans.</span>
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              A global community that backs women with funding, skills and network to realise the change we want to see in the world.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#800020] font-black uppercase tracking-widest text-sm">Mission</h3>
            <p className="text-4xl font-bold tracking-tighter leading-tight">
              We create pathways <br />
              <span className="text-[#800020]">where there are none.</span>
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Through access to the funding, skills and network needed in the most critical stage of startup failure.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky Photo Column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-10">
              <div className="aspect-[4/5] bg-zinc-200 rounded-3xl overflow-hidden shadow-2xl relative group">
                <img
                  src="/images/Vukara_team.JPG"
                  alt="Vukara team"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mt-4 text-center text-zinc-500 font-medium uppercase tracking-widest text-[10px] sm:text-xs leading-relaxed">
                Anna, Katty, Simra, Britt, Dumebi — The Vukara team
              </p>
            </div>
          </div>

          {/* Detailed Text Column */}
          <div className="lg:col-span-7 space-y-12">
            {/* WHO WE ARE */}
            <div>
              <h3 className="text-3xl font-black mb-6 uppercase italic tracking-tight">WHO WE ARE</h3>
              <p className="text-[#800020] font-bold text-xl mb-6 leading-tight">
                Rebels. Explorers. Connectors. Global Citizens. System Shapers.
              </p>
              <p className="text-zinc-600 leading-relaxed text-lg">
                We are building the change we want to see in the world. With diverse backgrounds as explorers by heart, we are global citizens, eager to make a difference in the world.
              </p>
            </div>

            {/* We've Got Your Back */}
            <div className="space-y-6">
              <h3 className="text-3xl font-black uppercase italic tracking-tight">We've Got Your Back</h3>

              <div className="space-y-6 text-zinc-600 text-lg leading-relaxed">
                <p>
                  We (Anna and Katty) founded VUKARA based on decades of experience in supporting thousands of entrepreneurs and innovators through our corporate/research careers at global institutions. Although we have different lived experiences 
                  (I, Katty, grew up in South Africa as a Taiwanese immigrant & I, Anna, was born and raised in Amsterdam but a seasoned traveler who has lived in 6 countries and worked with numerous local communities), we noticed the same patterns.
                  The current system doesn’t work for everyone. It was once designed by and for the dominant group, historically privileged men. And while we all (including men) see that change is needed, it is still ingrained in many systems.
                  <span className="text-black font-semibold"> We want to change that system - together.</span>
                </p>

                <p>
                  Over course of our lives we have met so many amazing, inspiring, resilient, bold and beautiful people, who are not structurally supported in their ambitions.
                  This narrative was developed by the construct of systems from the past. Women (and other underrepresented founders) don’t need permission; they need access to funding, skills and network.
                </p>

                <p className="bg-zinc-100 p-4 rounded-lg border-zinc-200 border">
                  Women (and other underrepresented) founders are structurally and systemically left behind when it comes to building their ventures.
                </p>

                <p className="text-black font-bold text-xl leading-snug">
                  If we want to move the needle, we don’t need to fix the women - we need to fix the system.
                </p>

                <p>
                  That’s why we are rewriting the rules with <span className="font-bold text-[#800020]">Vukara</span>. Backing the boldest, biggest ideas and entrepreneurs, all over the world. Unlocking opportunities overlooked by others.
                </p>

                <div className="pt-8 border-t border-zinc-200">
                  <p className="text-2xl font-black uppercase tracking-tighter text-black">
                    The time is now. <br />
                    Will you build with us?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}