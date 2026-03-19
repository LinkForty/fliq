import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AppStoreBadges } from '../components/AppStoreBadges';
import { APP_SCHEME } from '../constants';

export function ShareFallback() {
  const [searchParams] = useSearchParams();
  const m = searchParams.get('m');

  function handleOpenInApp() {
    if (m) {
      window.location.href = `${APP_SCHEME}s?m=${m}`;
    }
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="text-7xl mb-6">🤫</div>
          <h1 className="text-3xl font-bold text-navy mb-3">
            You've received a secret!
          </h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Someone sent you a secret message on Fliq. Download the app to reveal it.
          </p>
          <AppStoreBadges />
          {m && (
            <button
              onClick={handleOpenInApp}
              className="mt-8 text-brand-500 hover:text-brand-600 font-semibold text-sm transition-colors"
            >
              I already have Fliq — open it
            </button>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
