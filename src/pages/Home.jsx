import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  Lightbulb,
  Network,
  Rocket,
  UsersRound,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import AnimatedIELogo from '../components/AnimatedIELogo.jsx';
import Marquee from '../components/Marquee.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Testimonials from '../components/Testimonials.jsx';
import { fetchAnnouncements } from '../utils/fetchAnnouncements.js';

const HeroScene = lazy(() => import('../components/HeroScene.jsx'));

const joinCards = [
  {
    title: 'ACE IIC Mentorship',
    text: 'Learn innovation methods from faculty mentors, IIC ambassadors, and experienced startup ecosystem voices.',
    icon: Network,
  },
  {
    title: 'Prototype Culture',
    text: 'Use ACE IIC and iLab energy to move from an idea note into a working proof of concept and pitch deck.',
    icon: Lightbulb,
  },
  {
    title: 'Venture Readiness',
    text: 'IEDC-style guidance helps teams think about costing, funding, market fit, marketing, and company formation.',
    icon: Rocket,
  },
];

const campusBlocks = [
  {
    title: 'ACE IIC',
    text: 'The Innovation Cell recognized by MHRD norms in November 2018, with a mission to nurture innovators and technology-based solutions.',
    icon: BadgeCheck,
  },
  {
    title: 'ACE EMBER',
    text: 'The entrepreneurship cell started in 2008 and grew through NEN association, trained faculty mentors, and E-Week.',
    icon: CalendarDays,
  },
  {
    title: 'IEDC',
    text: 'The Innovation and Entrepreneurship Development Centre established in 2012 to support student product ideas with market value.',
    icon: BookOpenCheck,
  },
];

function getButtonLinkProps(url) {
  if (!url) return { href: '#', target: '_self' };
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('/')) {
    return { href: cleanUrl, target: '_self' };
  }
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return { href: cleanUrl, target: '_blank', rel: 'noreferrer' };
  }
  return { href: `https://${cleanUrl}`, target: '_blank', rel: 'noreferrer' };
}

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAnnouncements().then((data) => {
      setAnnouncements(data);
    });
  }, []);

  const nextSlide = () => {
    if (announcements.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    if (announcements.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-paper pt-24">
        <Suspense fallback={<div className="absolute inset-0 bg-[#07111e]" />}>
          <HeroScene />
        </Suspense>
        <div className="page-shell relative z-10 pb-16 pt-6 sm:pb-20 sm:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-7xl text-center"
          >
            <div className="relative overflow-hidden rounded-lg border border-electric/10 bg-cloud p-0 shadow-soft">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-flare/30 blur-2xl" />
              <div className="absolute -bottom-10 -left-8 size-36 rounded-full bg-electric/20 blur-2xl" />

              <AnimatedIELogo className="relative z-10 block aspect-[2/1] w-full" />

              {/* Overlay Top-Left: Parent Organizations Logos (Theme Matched) */}
              <div className="absolute left-3 top-3 z-20 flex gap-1.5 sm:left-5 sm:top-5 sm:gap-2.5">
                <div className="bg-black p-0.5 sm:p-1.5 rounded border border-electric/20 shadow-[0_4px_12px_rgba(201,160,62,0.12)] h-7 w-auto sm:h-11 md:h-14 lg:h-16 flex items-center justify-center">
                  <img
                    src="/assets/logos/Atharva_University_Logo.webp"
                    alt="Atharva University"
                    width="80"
                    height="80"
                    className="h-full w-auto object-contain rounded"
                  />
                </div>
              </div>

              {/* Overlay Top-Center: College Logo (Theme Matched) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-3 z-20 flex sm:top-5">
                <div className="bg-white p-0.5 sm:p-1.5 rounded border border-electric/20 shadow-[0_4px_12px_rgba(201,160,62,0.12)] h-7 w-auto sm:h-11 md:h-14 lg:h-16 flex items-center justify-center">
                  <img
                    src="/assets/logos/Atharva_college_logo.webp"
                    alt="Atharva College of Engineering"
                    width="80"
                    height="80"
                    className="h-full w-auto object-contain rounded"
                  />
                </div>
              </div>

              {/* Overlay Top-Right: Cell & Council Logos (Theme Matched) */}
              <div className="absolute right-3 top-3 z-20 flex gap-1.5 sm:right-5 sm:top-5 sm:gap-2.5">
                <div className="bg-white p-0.5 sm:p-1.5 rounded border border-electric/20 shadow-[0_4px_12px_rgba(201,160,62,0.12)] h-7 w-auto sm:h-11 md:h-14 lg:h-16 flex items-center justify-center">
                  <img
                    src="/assets/logos/IIC_Logo.webp"
                    alt="Institution's Innovation Council"
                    width="80"
                    height="80"
                    className="h-full w-auto object-contain rounded"
                  />
                </div>
              </div>
            </div>

            {announcements.length > 0 && (
              <div className="relative mx-auto mt-12 w-full max-w-5xl rounded-2xl border border-electric/15 bg-cloud/85 shadow-soft overflow-hidden text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="grid md:grid-cols-[1.25fr_0.75fr] min-h-[360px] w-full items-stretch"
                  >
                    {/* Left: Text & Badges */}
                    <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 md:p-10 bg-gradient-to-r from-cloud via-cloud/95 to-transparent">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-electric border border-electric/25">
                            <Sparkles className="size-3" />
                            {announcements[currentIndex].tag || 'Latest Announcement'}
                          </span>
                        </div>
                        <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl lg:text-4xl tracking-tight leading-tight">
                          {announcements[currentIndex].title}
                        </h3>

                        {/* Metadata Pills */}
                        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-muted">
                          {announcements[currentIndex].date && (
                            <span className="flex items-center gap-1 bg-paper/60 px-2.5 py-1 rounded border border-electric/10">
                              <Calendar className="size-3.5 text-electric" />
                              {announcements[currentIndex].date}
                            </span>
                          )}
                          {announcements[currentIndex].time && announcements[currentIndex].time !== '-' && (
                            <span className="flex items-center gap-1 bg-paper/60 px-2.5 py-1 rounded border border-electric/10">
                              <Clock className="size-3.5 text-electric" />
                              {announcements[currentIndex].time}
                            </span>
                          )}
                          {announcements[currentIndex].venue && announcements[currentIndex].venue !== '-' && (
                            <span className="flex items-center gap-1 bg-paper/60 px-2.5 py-1 rounded border border-electric/10">
                              <MapPin className="size-3.5 text-electric" />
                              {announcements[currentIndex].venue}
                            </span>
                          )}
                        </div>

                        <p className="mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-muted max-w-xl">
                          {announcements[currentIndex].subtext}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
                        {announcements[currentIndex].btnText && (
                          <a
                            {...getButtonLinkProps(announcements[currentIndex].btnUrl)}
                            className="inline-flex items-center gap-2 rounded-full bg-electric px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-neon transition hover:-translate-y-0.5 hover:bg-plasma"
                          >
                            {announcements[currentIndex].btnText}
                            <ArrowUpRight className="size-3.5" />
                          </a>
                        )}

                        {/* Controls */}
                        {announcements.length > 1 && (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={prevSlide}
                              className="grid size-9 place-items-center rounded-full border border-electric/25 bg-paper/50 hover:bg-electric hover:text-white transition cursor-pointer text-ink"
                              aria-label="Previous slide"
                            >
                              <ChevronLeft className="size-5" />
                            </button>
                            <button
                              onClick={nextSlide}
                              className="grid size-9 place-items-center rounded-full border border-electric/25 bg-paper/50 hover:bg-electric hover:text-white transition cursor-pointer text-ink"
                              aria-label="Next slide"
                            >
                              <ChevronRight className="size-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <img
                        src={announcements[currentIndex].image}
                        alt={announcements[currentIndex].title}
                        className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
                      />
                      {/* Fades for smooth blending */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cloud via-transparent to-transparent hidden md:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-cloud via-transparent to-transparent md:hidden" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/initiatives"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-electric px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-neon transition hover:-translate-y-1 hover:bg-plasma"
              >
                Explore Initiatives
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#why-join"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-electric/20 bg-cloud/90 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-ink shadow-soft transition hover:-translate-y-1 hover:border-flare hover:text-electric"
              >
                Why Join
                <ChevronRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="section-pad bg-paper">
        <div className="page-shell">
          <SectionHeading
            eyebrow="The ACE Ecosystem"
            title="One campus, three strong engines for entrepreneurship."
            copy="The ecosystem connects recognized innovation council work, entrepreneurship programming, and venture development support."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {campusBlocks.map((block, index) => (
              <Reveal key={block.title} delay={index * 0.08}>
                <article className="neon-card h-full">
                  <div className="mb-8 grid size-14 place-items-center rounded-lg bg-electric/10 text-electric">
                    <block.icon className="size-7" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-black text-ink">{block.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-muted">{block.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="section-pad relative bg-cloud">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Why Join ACE I&E Cell"
            title="Get the structure to make student ideas real."
            copy="The cell gives students a route from curiosity to prototype, from prototype to validation, and from validation to an entrepreneurial pathway."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {joinCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.08}>
                <article className="neon-card h-full">
                  <div className="mb-9 grid size-12 place-items-center rounded-lg border border-electric/20 bg-electric/10 text-electric shadow-neon">
                    <card.icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-black text-ink">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{card.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Marquee />

      {/* Testimonials / Voices Section */}
      <section className="section-pad border-t border-electric/10 bg-paper">
        <div className="page-shell">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <SectionHeading
              eyebrow="Voices"
              title="Mentors shaping the ACE startup culture."
              copy="Faculty-led mentoring is central to ACE IIC, IEDC, and entrepreneurship development."
            />
            <Reveal className="hidden justify-end lg:flex">
              <div className="grid size-20 place-items-center rounded-lg border border-pulse/20 bg-pulse/10 text-pulse shadow-soft">
                <UsersRound className="size-9" aria-hidden="true" />
              </div>
            </Reveal>
          </div>
          <Testimonials />
        </div>
      </section>
    </>
  );
}
