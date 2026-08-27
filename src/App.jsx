import { useState, useEffect, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import IntroPreloader from './components/IntroPreloader.jsx';

// 48 hours in milliseconds
const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

// Helper to determine if we should skip the intro
function shouldSkipIntro() {
  try {
    const lastSeen = localStorage.getItem('intro_last_seen');
    if (lastSeen) {
      const timePassed = Date.now() - parseInt(lastSeen, 10);
      return timePassed < FORTY_EIGHT_HOURS;
    }
  } catch (error) {
    console.warn('localStorage is not accessible:', error);
  }
  return false;
}

// Lazy load page components to improve initial page load performance
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Initiatives = lazy(() => import('./pages/Initiatives.jsx'));
const EventArchive = lazy(() => import('./pages/EventArchive.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));
const BoardroomBillionaires = lazy(() => import('./pages/BoardroomBillionaires/BoardroomBillionairesPage.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center text-muted">
      <div className="flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-electric border-r-transparent" />
        <p className="mt-4 text-sm font-bold uppercase tracking-wider text-muted/80">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [showWebsite, setShowWebsite] = useState(() => shouldSkipIntro());
  const [introComplete, setIntroComplete] = useState(() => shouldSkipIntro());

  const handleIntroComplete = () => {
    try {
      localStorage.setItem('intro_last_seen', Date.now().toString());
    } catch (error) {
      console.warn('Could not save intro timestamp:', error);
    }
    setIntroComplete(true);
  };

  return (
    <div className="min-h-screen bg-paper text-ink antialiased selection:bg-flare/40 selection:text-ink">
      {!introComplete && (
        <IntroPreloader
          onFadeStart={() => setShowWebsite(true)}
          onComplete={handleIntroComplete}
        />
      )}

      {showWebsite ? (
        <>
          <ScrollToTop />
          <Navbar />
          <main id="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/initiatives" element={<Initiatives />} />
                <Route path="/initiatives/:eventId" element={<EventArchive />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<Team />} />
                <Route path="/boardroom-billionaires" element={<BoardroomBillionaires />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </>
      ) : (
        /* Render visually hidden main landmark so one is always present on initial DOM load */
        <main className="sr-only" aria-live="polite">
          <h1>ACE I&E Cell</h1>
          <p>Loading introduction preloader...</p>
        </main>
      )}
    </div>
  );
}
