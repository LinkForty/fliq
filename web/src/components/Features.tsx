const FEATURES = [
  {
    icon: 'swipe_right',
    title: 'Flick to Reveal',
    description:
      'Recipients physically flick their phone to unveil your secret message, ensuring eyes are only on the content when ready.',
  },
  {
    icon: 'auto_delete',
    title: 'Self-Destructing',
    description:
      'Messages disappear after being read, leaving no trace. Our servers only ever hold encrypted data they can\'t read — and delete it the moment it\'s delivered.',
  },
  {
    icon: 'person_off',
    title: 'No Account Needed',
    description:
      'Share secrets instantly via a unique link. No sign-up, no email required. Start sending within seconds of landing.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 mb-16 max-w-2xl">
          <h2 className="text-primary font-bold tracking-widest text-sm uppercase">Unrivaled Privacy</h2>
          <h3 className="text-4xl font-bold text-white leading-tight">Secure. Private. Vanishing.</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="glass glass-glow p-8 rounded-3xl flex flex-col gap-6 group">
              <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-white">{feature.title}</h4>
                <p className="text-slate-400 font-light leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
