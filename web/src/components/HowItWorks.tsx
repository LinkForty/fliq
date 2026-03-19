const FEATURES = [
  {
    emoji: '🫰',
    title: 'Flick to Reveal',
    description:
      'Give your phone a quick flick to reveal messages — that\'s the Fliq way!',
  },
  {
    emoji: '🔔',
    title: 'Push to Phone',
    description:
      'Send secrets directly to a phone number via push notification. No links, no chat history, no trace.',
  },
  {
    emoji: '🔒',
    title: 'Ephemeral by Design',
    description:
      'Messages vanish after reading. Push messages are deleted from the server the moment they\'re opened.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-navy mb-14">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-10">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="text-5xl mb-4">{feature.emoji}</div>
              <h3 className="text-lg font-bold text-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
