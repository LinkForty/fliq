const STEPS = [
  {
    icon: 'edit_note',
    title: 'Write your secret',
    description: 'Compose your message — it\'s encrypted on your device before it ever leaves your phone.',
  },
  {
    icon: 'share',
    title: 'Share the link',
    description: 'Generate a one-time link and send it via any platform.',
  },
  {
    icon: 'vibration',
    title: 'They flick to reveal',
    description: 'Recipient unlocks the secret with a physical gesture.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-white text-center mb-20">How It Works</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 -z-0" />

          {STEPS.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center max-w-[240px] z-10">
              <div className="size-16 rounded-full bg-background-dark border-2 border-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined text-primary text-3xl font-bold">{step.icon}</span>
              </div>
              <h5 className="text-lg font-bold text-white mb-2">{step.title}</h5>
              <p className="text-slate-400 text-sm font-light">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
