import { AppStoreBadges } from './AppStoreBadges';

export function HeroSection() {
  return (
    <section className="bg-navy text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-7xl mb-6">🤫</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Send secrets with a flick
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
          Secret messages that only the recipient can reveal.
          Flick your phone to uncover.
        </p>
        <AppStoreBadges />
      </div>
    </section>
  );
}
