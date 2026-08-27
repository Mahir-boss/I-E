import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AnimatedIELogo from './AnimatedIELogo.jsx';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
];

function NavItems({ onSelect, isBoardroom }) {
  return (
    <>
      {navLinks.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === '/'}
          onClick={onSelect}
          className={({ isActive }) =>
            [
              'group relative rounded-full px-4 py-2 text-sm font-black transition',
              isBoardroom
                ? isActive
                  ? 'bg-[#e5c06a] text-[#1c120c] shadow-lg font-black'
                  : 'text-[#fcf8f0]/80 hover:bg-[#4a2e1b] hover:text-[#e5c06a]'
                : isActive
                ? 'bg-electric text-white shadow-neon hover:bg-electric hover:text-white'
                : 'text-ink/70 hover:bg-electric/10 hover:text-electric',
            ].join(' ')
          }
        >
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const isBoardroom = location.pathname === '/boardroom-billionaires';

  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 12);
    if (isBoardroom) {
      setHidden(latest > 40 && !menuOpen);
    }
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <motion.header
      animate={{
        y: isBoardroom && hidden ? '-100%' : '0%',
        backgroundColor: isBoardroom
          ? scrolled || menuOpen ? 'rgba(44, 25, 14, 0.95)' : 'rgba(59, 35, 19, 0.85)'
          : scrolled || menuOpen ? 'rgba(13, 27, 42, 0.90)' : 'rgba(13, 27, 42, 0.60)',
        borderColor: isBoardroom
          ? 'rgba(140, 109, 59, 0.6)'
          : scrolled || menuOpen ? 'rgba(201, 160, 62, 0.18)' : 'rgba(201, 160, 62, 0)',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
    >
      <nav className="page-shell flex h-20 items-center justify-between">
        <NavLink to="/" className="group flex items-center gap-2.5 sm:gap-3.5 w-[285px] sm:w-[385px]" onClick={() => setMenuOpen(false)}>
          <img
            src="/assets/logos/I_E_CELL.ico"
            alt="I&E Cell Logo"
            width="44"
            height="44"
            className="h-8 w-8 sm:h-11 sm:w-11 rounded-full object-contain flex-shrink-0"
          />
          <AnimatedIELogo compact className="h-auto w-full flex-grow" />
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
          <NavItems isBoardroom={isBoardroom} />
        </div>

        <button
          type="button"
          className={
            isBoardroom
              ? "grid size-11 place-items-center rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-[#e5c06a] shadow-md md:hidden"
              : "grid size-11 place-items-center rounded-lg border border-electric/20 bg-cloud/90 text-ink shadow-soft md:hidden"
          }
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="page-shell pb-5 md:hidden"
          >
            <div className={isBoardroom ? "grid gap-1 rounded-lg p-2 bg-[#3b2313] border-2 border-[#8c6d3b]" : "glass-panel grid gap-1 rounded-lg p-2"}>
              <NavItems isBoardroom={isBoardroom} onSelect={() => setMenuOpen(false)} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
