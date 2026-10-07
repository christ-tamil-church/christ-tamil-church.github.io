import { ChevronDown, Clock, Facebook, Mail, MapPin, Menu, Phone, X, Youtube } from "lucide-react";
import { MouseEvent, ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { siteImages } from "../data/images";
import { churchInfo } from "../data/site";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { canonicalUrl, getPageMeta } from "../seo";
import { prefersReducedMotion } from "../utils/motion";

type LayoutProps = {
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

const primaryNavItems: NavItem[] = [
  {
    label: "I'm New",
    href: "/visit",
    children: [
      { label: "Who We Are", href: "/visit#mission" },
      { label: "What We Believe", href: "/visit#beliefs" },
      { label: "Stay In Touch", href: "/contact" }
    ]
  },
  { label: "Worship", href: "/worship" },
  {
    label: "Connect",
    href: "/connect",
    children: [
      { label: "Events", href: "/events" },
      { label: "Fellowship", href: "/connect#fellowship-hour" }
    ]
  },
  {
    label: "Grow",
    href: "/grow",
    children: [
      { label: "Bible Study & Prayer", href: "/grow/bible-study-prayer" },
      { label: "Sunday School – B.L.A.S.T.", href: "/grow/sunday-school" },
      { label: "Kids Circle", href: "/grow/kids-circle" },
      { label: "Messages & Moments", href: "/sermons" }
    ]
  },
  {
    label: "Serve",
    href: "/serve",
    children: [{ label: "Community Outreach", href: "/serve" }]
  },
  { label: "Contact", href: "/contact" }
];

function hashOf(href: string) {
  const index = href.indexOf("#");
  return index < 0 ? "" : href.slice(index);
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const location = useLocation();
  const footerRef = useRevealOnScroll<HTMLElement>({ staggerChildren: true });

  useEffect(() => {
    setOpen(false);
    setOpenMobileGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    // The static head is baked per route at build time (scripts/prerender.mjs);
    // this keeps it in sync during client-side navigation.
    const meta = getPageMeta(location.pathname);
    const url = canonicalUrl(location.pathname);
    document.title = meta.title;
    const setContent = (selector: string, value: string) =>
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", value);
    setContent('meta[name="description"]', meta.description);
    setContent('meta[property="og:title"]', meta.title);
    setContent('meta[property="og:description"]', meta.description);
    setContent('meta[property="og:url"]', url);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", url);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Linking to "/" while already on "/" changes no route, so the route-change
  // scroll reset never runs. Scroll back to the hero ourselves — both the
  // document and `.app-shell`, which is the homepage's scroller on touch
  // devices (Home.css, "Touch scroll container").
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    setOpenMobileGroup(null);

    if (location.pathname !== "/" || location.hash) {
      return;
    }

    event.preventDefault();
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    window.scrollTo({ top: 0, left: 0, behavior });
    document.querySelector<HTMLElement>(".app-shell")?.scrollTo({ top: 0, left: 0, behavior });
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <Link className="brand brand-logo-link" to="/" onClick={handleLogoClick}>
          <img
            className="brand-logo"
            src={siteImages.logo.src}
            alt={siteImages.logo.alt}
            width="200"
            height="47"
          />
          <span>
            <strong>Christ Tamil Church</strong>
            <small><span lang="ta">வணக்கம்</span> Chicago</small>
          </span>
        </Link>

        <button
          className="icon-button mobile-only"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() =>
            setOpen((value) => {
              if (value) {
                setOpenMobileGroup(null);
              }
              return !value;
            })
          }
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav
          id="primary-navigation"
          className={`site-nav ${open ? "is-open" : ""}`}
          aria-label="Primary navigation"
        >
          {primaryNavItems.map((item) => {
            const groupIsActive =
              location.pathname === item.href ||
              item.children?.some((child) => child.href.split("#")[0] === location.pathname);

            if (!item.children) {
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </NavLink>
              );
            }

            return (
              <div
                className={`nav-dropdown ${openMobileGroup === item.href ? "is-mobile-open" : ""}`}
                key={item.href}
              >
                <div className="nav-dropdown-heading">
                  <NavLink
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`nav-link ${groupIsActive ? "active" : ""}`}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className="nav-dropdown-chevron nav-dropdown-chevron-desktop"
                      size={14}
                      aria-hidden="true"
                    />
                  </NavLink>
                  <button
                    className="nav-dropdown-toggle"
                    type="button"
                    aria-label={`${openMobileGroup === item.href ? "Collapse" : "Expand"} ${item.label} menu`}
                    aria-expanded={openMobileGroup === item.href}
                    aria-controls={`nav-group-${item.href.slice(1)}`}
                    onClick={() =>
                      setOpenMobileGroup((current) => (current === item.href ? null : item.href))
                    }
                  >
                    <ChevronDown
                      className="nav-dropdown-chevron nav-dropdown-chevron-mobile"
                      size={14}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div
                  id={`nav-group-${item.href.slice(1)}`}
                  className="nav-dropdown-menu"
                  aria-label={`${item.label} navigation`}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.href}
                      to={child.href}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        isActive && location.hash === hashOf(child.href)
                          ? "active"
                          : ""
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

      </header>

      <main id="main-content">{children}</main>

      <footer className="footer footer-flow reveal" ref={footerRef}>
        <div className="footer-grid">
          <div className="footer-brand-column" data-reveal-child>
            <Link className="footer-brand" to="/">
              <img
                className="footer-logo"
                src={siteImages.logo.src}
                alt={siteImages.logo.alt}
                width="200"
                height="45"
                loading="lazy"
              />
            </Link>
            <p className="footer-greeting">
              <span lang="ta">வணக்கம்,</span>
              <strong>Chicago.</strong>
            </p>
            <span className="footer-greeting-rule" aria-hidden="true" />
            <p className="footer-tagline">
              A Tamil church family worshiping Christ, growing together, and serving Chicagoland.
            </p>
            <div className="footer-social">
              <a
                href={churchInfo.social.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Christ Tamil Church on Facebook"
              >
                <Facebook size={18} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={churchInfo.social.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Christ Tamil Church on YouTube"
              >
                <Youtube size={18} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <section data-reveal-child aria-labelledby="footer-visit-heading">
            <h3 id="footer-visit-heading">Visit Us</h3>
            <p>
              <MapPin size={15} aria-hidden="true" />
              <a href={churchInfo.address.directionsUrl} target="_blank" rel="noreferrer">
                {churchInfo.address.short}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <p>
              <Clock size={15} aria-hidden="true" />
              <Link to="/worship">{churchInfo.worship.schedule}</Link>
            </p>
            <p>
              <Phone size={15} aria-hidden="true" />
              <a href={churchInfo.contact.phoneHref}>{churchInfo.contact.phone}</a>
            </p>
            <p>
              <Mail size={15} aria-hidden="true" />
              <a href={churchInfo.contact.emailHref}>{churchInfo.contact.email}</a>
            </p>
          </section>

          <section data-reveal-child aria-labelledby="footer-explore-heading">
            <h3 id="footer-explore-heading">Explore</h3>
            <p><Link to="/visit">I&apos;m New</Link></p>
            <p><Link to="/worship">Worship</Link></p>
            <p><Link to="/connect">Connect</Link></p>
            <p><Link to="/grow">Grow</Link></p>
            <p><Link to="/serve">Serve</Link></p>
          </section>

          <section data-reveal-child aria-labelledby="footer-resources-heading">
            <h3 id="footer-resources-heading">Resources</h3>
            <p><Link to="/events">Events</Link></p>
            <p><Link to="/sermons">Messages &amp; Moments</Link></p>
            <p><Link to="/grow/sunday-school">Sunday School</Link></p>
            <p><Link to="/grow/kids-circle">Kids Circle</Link></p>
            <p><Link to="/contact">Prayer &amp; Contact</Link></p>
          </section>
        </div>

        <div className="footer-bottom" data-reveal-child>
          <span>&copy; 2026 Christ Tamil Church Chicago. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
