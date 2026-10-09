import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import "../pages/PageHeroTypography.css";
import "./InnerHero.css";

type HeroLink = {
  label: string;
  /** Internal route or in-page hash (rendered as a router Link / plain anchor). */
  to?: string;
  /** External URL, opened in a new tab (mailto:/tel: links stay in place). */
  href?: string;
};

type InnerHeroProps = {
  /** id of the h1; the section is labelled by it. */
  titleId: string;
  /** Tamil-first kicker with its English reference badge. */
  kicker: { ta: string; en: string };
  /** One entry per deliberate line, or a single node that wraps naturally. */
  title: ReactNode | ReactNode[];
  lede: ReactNode;
  action?: HeroLink;
  card: {
    ariaLabel: string;
    icon: LucideIcon;
    label: string;
    title: ReactNode;
    details?: { icon: LucideIcon; text: ReactNode }[];
    link?: HeroLink;
  };
};

function HeroAnchor({ link, className, size }: { link: HeroLink; className: string; size: number }) {
  const content = <>{link.label} <ArrowRight size={size} aria-hidden="true" /></>;
  if (link.href && /^(mailto|tel):/.test(link.href)) return <a className={className} href={link.href}>{content}</a>;
  if (link.href) {
    return (
      <a className={className} href={link.href} target="_blank" rel="noreferrer">
        {content}<span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (link.to?.startsWith("#")) return <a className={className} href={link.to}>{content}</a>;
  return <Link className={className} to={link.to ?? "/"}>{content}</Link>;
}

/* Inner-page hero (template 6.1, light variant): words only on the left, the
   page's key-facts card beside them on desktop and below them on smaller
   screens. Photos belong to the bands further down each page. */
export default function InnerHero({ titleId, kicker, title, lede, action, card }: InnerHeroProps) {
  const CardIcon = card.icon;
  const lines = Array.isArray(title);

  return (
    <section className="inner-hero" aria-labelledby={titleId}>
      <div className="inner-hero-copy">
        <div className="inner-hero-kicker pathway-marker">
          <div className="pathway-marker-copy">
            <span lang="ta">{kicker.ta}</span>
            <small>{kicker.en}</small>
          </div>
          <span className="pathway-marker-rule" aria-hidden="true" />
        </div>

        <h1 id={titleId} className={lines ? "inner-hero-title is-lined" : "inner-hero-title"}>
          {lines ? title.map((line, index) => <span key={index}>{line}{index < title.length - 1 ? " " : null}</span>) : title}
        </h1>

        <div className="inner-hero-row">
          <div className="inner-hero-intro">
            <p className="inner-hero-lede">{lede}</p>
            {action && <HeroAnchor link={action} className="inner-hero-primary" size={17} />}
          </div>

          <aside className="inner-hero-card" aria-label={card.ariaLabel}>
            <span className="inner-hero-card-icon" aria-hidden="true"><CardIcon size={22} /></span>
            <div>
              <p className="inner-hero-card-label">{card.label}</p>
              <p className="inner-hero-card-title">{card.title}</p>
              {card.details && card.details.length > 0 && (
                <ul className="inner-hero-card-details">
                  {card.details.map(({ icon: Icon, text }, index) => (
                    <li key={index}><Icon size={16} aria-hidden="true" /><span>{text}</span></li>
                  ))}
                </ul>
              )}
              {card.link && <HeroAnchor link={card.link} className="inner-hero-card-link" size={16} />}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
