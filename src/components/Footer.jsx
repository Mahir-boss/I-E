import { useLocation } from 'react-router-dom';
import { Instagram, Linkedin, Mail, MapPin, Youtube } from 'lucide-react';

const socialLinks = [
  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/iandecell_ace/' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/atharva-college-of-engineering-s-innovation-entrepreneurship-cell/' },
  { label: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@ace_eeutopia' },
  { label: 'Mail', icon: Mail, href: 'mailto:aceicell@atharvacoe.ac.in' },
];

export default function Footer() {
  const location = useLocation();
  const isBoardroom = location.pathname === '/boardroom-billionaires';

  return (
    <footer className={isBoardroom ? "relative z-10 border-t-2 border-[#8c6d3b] bg-[#2c190e] text-[#fcf8f0]" : "relative z-10 border-t border-electric/10 bg-cloud text-ink"}>
      <div className="page-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className={isBoardroom ? "text-xs font-bold uppercase tracking-widest text-[#e5c06a]" : "eyebrow"}>
              Atharva Educational Trust
            </p>
            <p className={isBoardroom ? "mt-4 max-w-2xl text-lg font-semibold leading-8 text-[#d3caad]" : "mt-4 max-w-2xl text-lg font-semibold leading-8 text-muted"}>
              Atharva Educational Trust believes in producing well-disciplined, practical-oriented,
              highly knowledgeable engineers who serve society and the nation.
            </p>
          </div>

          <address className={isBoardroom ? "not-italic text-sm leading-7 text-[#d3caad]" : "not-italic text-sm leading-7 text-muted"}>
            <div className={isBoardroom ? "mb-3 flex items-center gap-2 font-semibold text-[#fcf8f0]" : "mb-3 flex items-center gap-2 font-semibold text-ink"}>
              <MapPin className={isBoardroom ? "size-4 text-[#e5c06a]" : "size-4 text-flare"} aria-hidden="true" />
              Campus Address
            </div>
            Atharva College Campus, Malad Marve Road,
            <br />
            Charkop Naka, Malad West,
            <br />
            Mumbai, Maharashtra 400095
          </address>

          <div>
            <p className={isBoardroom ? "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#e5c06a]" : "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ink"}>Social</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={
                    isBoardroom
                      ? "grid size-11 place-items-center rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-[#e5c06a] transition hover:bg-[#e5c06a] hover:text-[#1c120c] hover:shadow-lg"
                      : "grid size-11 place-items-center rounded-lg border border-electric/10 bg-mist text-electric transition hover:border-flare/70 hover:bg-flare hover:text-ink hover:shadow-dropglow"
                  }
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={isBoardroom ? "mt-10 flex flex-col gap-3 border-t border-[#8c6d3b]/40 pt-6 text-xs text-[#d3caad] sm:flex-row sm:items-center sm:justify-between" : "mt-10 flex flex-col gap-3 border-t border-electric/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"}>
          <p>&copy; 2026 ACE I&E Cell. Built for innovators, makers, and founders.</p>
          <p>Innovation. Incubation. Entrepreneurship.</p>
        </div>
      </div>
    </footer>
  );
}
