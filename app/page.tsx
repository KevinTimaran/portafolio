import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhatIDo from '@/components/WhatIDo';
import About from '@/components/About';
import Stack from '@/components/Stack';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/lib/i18n';

export default function Home() {
  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <WhatIDo />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
