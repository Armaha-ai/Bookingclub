import { useState, useCallback } from 'react';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { WineShowcase } from './sections/WineShowcase';
import { WineryCarousel } from './sections/WineryCarousel';
import { Museum } from './sections/Museum';
import { News } from './sections/News';
import { Events } from './sections/Events';
import { Projects } from './sections/Projects';
import { Collections } from './sections/Collections';
import { ContactForm } from './sections/ContactForm';
import { Footer } from './sections/Footer';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-[#FAF3E0] ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
        <Navigation />

        <main>
          <Hero isReady={!isLoading} />
          <WineShowcase />
          <WineryCarousel />
          <Museum />
          <News />
          <Events />
          <Projects />
          <Collections />
          <ContactForm />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;