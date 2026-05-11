function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-3xl"></div>

      <div className="relative z-10 text-center px-6">

        <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">

          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            AI Powered
          </span>

          <br />

          Luxury Hotel

        </h1>

        <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-10">
          Enterprise-grade smart hotel ecosystem powered by
          React, ServiceNow, AI and cloud automation.
        </p>

        <div className="flex flex-wrap justify-center gap-6">

          <button className="bg-cyan-500 hover:bg-cyan-400 transition px-10 py-5 rounded-2xl text-black font-bold text-lg shadow-2xl shadow-cyan-500/30">
            Explore Rooms
          </button>

          <button className="border border-white/20 hover:border-cyan-400 transition px-10 py-5 rounded-2xl text-lg">
            Watch Demo
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;