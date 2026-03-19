import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';
import { DownloadCTA } from '../components/DownloadCTA';
import { Footer } from '../components/Footer';

export function Landing() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}
