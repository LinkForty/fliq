import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AppStoreBadges } from '../components/AppStoreBadges';
import { APP_SCHEME } from '../constants';

export function ShareFallback() {
  const [searchParams] = useSearchParams();
  const m = searchParams.get('m');
  const e = searchParams.get('e');
  const n = searchParams.get('n');

  function handleOpenInApp() {
    // Preserve the URL fragment (#key) — it contains the decryption key
    const fragment = window.location.hash || '';

    if (e && n) {
      // Encrypted format
      window.location.href = `${APP_SCHEME}s?e=${e}&n=${n}${fragment}`;
    } else if (m) {
      // Legacy format
      window.location.href = `${APP_SCHEME}s?m=${m}${fragment}`;
    }
  }

  const hasMessage = !!(m || e);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="size-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
            <span className="material-symbols-outlined text-primary text-3xl">vibration</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            You've received a secret!
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Someone sent you an encrypted message on Fliq. Download the app to decrypt and reveal it.
          </p>
          <div className="flex justify-center">
            <AppStoreBadges />
          </div>
          {hasMessage && (
            <button
              onClick={handleOpenInApp}
              className="mt-8 text-primary hover:brightness-110 font-semibold text-sm transition-all"
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
