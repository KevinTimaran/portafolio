import CodexExperience from '@/components/CodexExperience';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/lib/i18n';

/**
 * La portada es el paisaje 3D. El portafolio completo vive dentro del libro:
 * aparece cuando el visitante lo toma y lo abre. Todo el contenido está en español e inglés.
 */
export default function Home() {
  return (
    <LanguageProvider>
      <CodexExperience>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Testimonials />
          <Experience />
          <Contact />
          <Skills />
        </main>
        <Footer />
      </CodexExperience>
    </LanguageProvider>
  );
}
