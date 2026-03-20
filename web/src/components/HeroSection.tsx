import { AppStoreBadges } from './AppStoreBadges';

export function HeroSection() {
  return (
    <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-glow -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            End-to-End Encrypted
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
            Your secrets. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">Delivered.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
            Send encrypted messages that vanish after being read. No trace, no logs, just pure privacy. Just flick to reveal the truth.
          </p>
          <div className="mt-4">
            <AppStoreBadges />
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-[300px] h-[600px] rounded-[3rem] border-8 border-slate-800 bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden glass">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl" />
            <div className="flex flex-col h-full p-6 pt-12">
              <div className="mt-auto mb-10 space-y-4">
                <div className="glass p-4 rounded-2xl border-primary/20">
                  <div className="w-8 h-1 bg-primary/40 rounded-full mb-2" />
                  <div className="w-20 h-1 bg-primary/20 rounded-full" />
                </div>
                <div className="w-full aspect-square glass rounded-3xl flex flex-col items-center justify-center border-primary/30 shadow-inner">
                  <span className="material-symbols-outlined text-primary text-5xl mb-4 animate-pulse">vibration</span>
                  <p className="text-xs text-white font-bold tracking-widest uppercase opacity-60">Flick to view</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
