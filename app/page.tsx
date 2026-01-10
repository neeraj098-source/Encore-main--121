import Hero from '@/components/home/Hero';
import Flashback from '@/components/home/Flashback';
import About from '@/components/home/About';
import Stats from '@/components/home/Stats';
import FAQ from '@/components/home/FAQ';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <Flashback />
      <About />
      <Stats />
      <FAQ />
    </main>
  );
}
