const REASONS = [
  {
    icon: 'lock',
    title: 'End-to-End Privacy',
    description: 'Messages are encrypted on your device with AES-256-GCM before anything leaves your phone. Not even Fliq can read them.',
  },
  {
    icon: 'cloud_off',
    title: 'Zero-Knowledge Servers',
    description: 'Our servers only ever see encrypted data they cannot read. The decryption key never touches our infrastructure — it stays with you.',
  },
  {
    icon: 'code',
    title: 'Open-Source Transparency',
    description: 'Our encryption protocols are open for audit. We have nothing to hide because we see nothing.',
  },
  {
    icon: 'no_accounts',
    title: 'No Account Needed',
    description: "No sign-ups, no emails, no passwords. Share secrets instantly via a link — or add your phone number to receive them via push.",
  },
];

export function WhyChooseFliq() {
  return (
    <section className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4">The Standard</h2>
          <h3 className="text-4xl font-bold text-white">Why choose Fliq?</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((reason) => (
            <div key={reason.title} className="flex flex-col gap-4">
              <span className="material-symbols-outlined text-primary text-4xl">{reason.icon}</span>
              <h5 className="text-lg font-bold text-white">{reason.title}</h5>
              <p className="text-slate-400 text-sm font-light">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
