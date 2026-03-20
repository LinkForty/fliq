import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { Features } from '../components/Features';
import { WhyChooseFliq } from '../components/WhyChooseFliq';
import { HowItWorks } from '../components/HowItWorks';
import { Footer } from '../components/Footer';

export function Landing() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Features />
        <WhyChooseFliq />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
