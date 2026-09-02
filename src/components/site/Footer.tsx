import { Link } from "@tanstack/react-router";
import { cursorProps } from "@/components/experience/Cursor";
import { SERVICES } from "@/lib/site-data";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/contact", label: "Contact" },
] as const;

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Behance", href: "https://www.behance.net" },
] as const;

/**
 * Minimal, premium site footer. Sits above the 3D world with a soft paper
 * surface so text stays perfectly legible.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="pointer-events-auto relative z-20 border-t border-border bg-card/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-11 md:grid-cols-12 md:gap-12 md:px-10 md:py-20">
        <div className="md:col-span-4">
          <Link to="/" {...cursorProps("Home")} className="font-display text-4xl uppercase leading-none tracking-[-0.05em] text-foreground">
            239
          </Link>
          <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            239 The Business Developer LLP — a business development and design studio
            building brands, partnerships and digital experiences that move business forward.
          </p>
        </div>

        <nav className="md:col-span-2" aria-label="Footer navigation">
          <h2 className="label">Navigate</h2>
          <ul className="mt-5 space-y-3">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  {...cursorProps()}
                  className="link-underline text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="label">Services</h2>
          <ul className="mt-5 space-y-3">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link
                  to="/services"
                  {...cursorProps()}
                  className="link-underline text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="label">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:hello@239.studio"
                {...cursorProps("Mail")}
                className="link-underline transition-colors duration-500 hover:text-foreground"
              >
                hello@239.studio
              </a>
            </li>
            <li>
              <a
                href="tel:+919000002390"
                {...cursorProps("Call")}
                className="link-underline transition-colors duration-500 hover:text-foreground"
              >
                +91 90000 02390
              </a>
            </li>
            <li className="pt-1 leading-relaxed">Studio 239, Bengaluru, India</li>
          </ul>

          <h2 className="label mt-8">Social</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                {...cursorProps("Open")}
                className="link-underline text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <span className="label">© {year} 239 The Business Developer LLP</span>
          <span className="label">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
