import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import { type RefObject, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import FollowTheLight from "../components/FollowTheLight/FollowTheLight";
import { siteImages } from "../data/images";
import { churchInfo, verseOfTheWeek } from "../data/site";
import { useFeaturedEvent } from "../hooks/useFeaturedEvent";
import type { FeaturedEvent } from "../data/site";
import { eventDateParts, formatEventDateLong, formatEventDateMedium } from "../utils/featuredEvent";

function ImNewLink() {
  return (
    <Link className="go" to="/visit">
      I'm New
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

// "Every Sunday · time" with a map-pin button for directions (as on the
// floating Sunday bar); the button is named "Get directions" for screen
// readers and shows it as a tooltip. On phones it is the twin of the event
// card: tile · label over value · round action (the clock tile is
// phone-only).
function SundayCard() {
  return (
    <aside className="ctc-hero-card" aria-label="Sunday worship details">
      <span className="ctc-hero-card-tile" aria-hidden="true">
        <Clock size={20} />
      </span>
      <div className="ctc-hero-card-info">
        <span>Every Sunday</span>
        <strong>{churchInfo.worship.time}</strong>
      </div>
      <a
        className="ctc-hero-card-directions"
        href={churchInfo.address.directionsUrl}
        target="_blank"
        rel="noreferrer"
        title="Get directions"
      >
        <MapPin size={18} aria-hidden="true" />
        <span className="sr-only">Get directions</span>
      </a>
    </aside>
  );
}

// The current featured event (`featuredEvent` in src/data/site.ts) appears in
// the hero as its own card, separate from the "This Sunday" card: this one in
// the copy column on tablets and desktops, and FeaturedEventCardRow under the
// Sunday card on phones. CSS shows one at a time.
function FeaturedEventNotice({ event }: { event: FeaturedEvent }) {
  return (
    <Link className="ctc-hero-notice" to="/events#featured">
      <span className="ctc-hero-notice-icon" aria-hidden="true">
        <CalendarDays size={18} />
      </span>
      <span className="ctc-hero-notice-text">
        <span className="ctc-hero-notice-label">
          {formatEventDateMedium(event)} <i aria-hidden="true">·</i> {event.time}
        </span>
        <span className="ctc-hero-notice-title">{event.title}</span>
      </span>
      <span className="sr-only"> (event details)</span>
      <ArrowRight className="ctc-hero-notice-arrow" size={16} aria-hidden="true" />
    </Link>
  );
}

// Phone version, the Sunday card's twin: calendar leaf (month over day),
// "SUNDAY · 10:30 AM" over the title, and a round arrow.
function FeaturedEventCardRow({ event }: { event: FeaturedEvent }) {
  const { weekday, month, day } = eventDateParts(event);
  return (
    <Link className="ctc-hero-card-event" to="/events#featured">
      <span className="ctc-hero-card-event-leaf" aria-hidden="true">
        <span>{month}</span>
        <strong>{day}</strong>
      </span>
      <span className="ctc-hero-card-event-text">
        <span className="ctc-hero-card-event-label" aria-hidden="true">
          {weekday} <i>·</i> {event.time}
        </span>
        <span className="ctc-hero-card-event-title">{event.title}</span>
      </span>
      <span className="sr-only">, {formatEventDateLong(event)}, {event.time} (event details)</span>
      <span className="ctc-hero-card-event-go" aria-hidden="true">
        <ArrowRight size={18} />
      </span>
    </Link>
  );
}

// Verses longer than this (in characters) are set smaller on tablets and
// phones so they don't crowd the hero. Philippians 4:13 is ~80 characters.
const LONG_VERSE = 100;

function WeeklyVerse({ className = "" }: { className?: string }) {
  const long = verseOfTheWeek.text.length > LONG_VERSE ? "ctc-hero-weekly-verse--long" : "";
  return (
    <blockquote
      className={`ctc-hero-weekly-verse ${long} ${className}`.replace(/\s+/g, " ").trim()}
      aria-label={`${verseOfTheWeek.label}: ${verseOfTheWeek.text} — ${verseOfTheWeek.reference}`}
    >
      <span>{verseOfTheWeek.label}</span>
      <i aria-hidden="true">·</i>
      {/* The reference sits inside the verse so it follows the last word on
          wide screens; phones set it on its own line underneath. */}
      <p lang="ta">
        “{verseOfTheWeek.text}”{" "}
        <cite lang="en">{verseOfTheWeek.reference}</cite>
      </p>
    </blockquote>
  );
}

// Always mounted (hidden until shown) and revealed by toggling `.is-visible`
// directly, never through React state: showing it used to re-render the
// whole homepage mid-way through the hero → Worship light sweep, which was
// the one visible hitch in the sequence on phones.
function StickySundayBar({ fabRef }: { fabRef: RefObject<HTMLDivElement> }) {
  // No document.body while prerendering at build time.
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="ctc-sunday-fab" ref={fabRef}>
      <div className="ctc-sunday-fab-time">
        <span>Sun</span>
        <strong>{churchInfo.worship.time}</strong>
      </div>
      <a
        className="ctc-sunday-fab-directions"
        href={churchInfo.address.directionsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Get directions — Sunday service at ${churchInfo.worship.time}`}
      >
        <MapPin size={18} aria-hidden="true" />
      </a>
    </div>,
    document.body
  );
}

export default function Home() {
  const spineRef = useRef<HTMLDivElement | null>(null);
  const cometRef = useRef<HTMLDivElement | null>(null);
  // The hero is Follow the Light's opening chapter; the Sunday FAB appears
  // once any later chapter (or the footer) is the one in view.
  const fabRef = useRef<HTMLDivElement>(null);
  const onActiveChange = useCallback((index: number) => {
    fabRef.current?.classList.toggle("is-visible", index > 0);
  }, []);
  const homeRef = useRef<HTMLDivElement | null>(null);
  const featured = useFeaturedEvent();

  // The homepage header floats over Follow the Light; publish its real
  // height so every chapter is centred in the space below it.
  useEffect(() => {
    const home = homeRef.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!home || !header) return;

    const apply = () => home.style.setProperty("--ftl-top-inset", `${header.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Comet + light-rail fill track overall page scroll. Writes go to the rail
  // elements themselves (never an ancestor), so a scroll frame restyles
  // nothing else on the page.
  useEffect(() => {
    const spine = spineRef.current;
    const comet = cometRef.current;
    const shell = homeRef.current?.closest<HTMLElement>(".app-shell") ?? null;
    if (!spine || !comet) return;

    // On touch devices the homepage scrolls inside `.app-shell` (Home.css,
    // "Touch scroll container"); on desktop the document scrolls. Start the
    // container at the top, since it can keep an offset from a past visit.
    const shellScrolls = () => !!shell && getComputedStyle(shell).overflowY !== "visible";
    if (shell && shellScrolls()) shell.scrollTop = 0;

    let ticking = false;
    const update = () => {
      ticking = false;
      const scroller = shell && shellScrolls() ? shell : document.documentElement;
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      const progress = maxScroll > 0 ? Math.min(1, scroller.scrollTop / maxScroll) : 0;
      comet.style.transform = `translate3d(0, ${(progress * window.innerHeight).toFixed(1)}px, 0)`;
      spine.style.setProperty("--ctc-rail-progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    // Capture phase so container scrolls (which don't bubble) are heard too.
    const scrollOptions = { passive: true, capture: true } as const;
    update();
    document.addEventListener("scroll", onScroll, scrollOptions);
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll, scrollOptions);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const hero = (
      <section
        className="ctc-stage ctc-stage-open ctc-hero is-lit"
        id="open"
        aria-labelledby="home-title"
      >
        <picture>
          <source media="(max-width: 620px)" srcSet={siteImages.heroBackgroundMobile.src} />
          <img
            className="ctc-hero-bg"
            src={siteImages.heroBackground.src}
            alt=""
            aria-hidden="true"
            width="1672"
            height="941"
            style={{ objectPosition: siteImages.heroBackground.objectPosition }}
          />
        </picture>
        <div className="ctc-hero-bg-wash" aria-hidden="true" />
        <div className="ctc-hero-copy">
          <h1 className="ctc-hero-title" id="home-title" lang="ta">
            <span className="ctc-hero-title-accent">பதறாத வாழ்வும், சிதறாத மனமும்</span>
            <span>பரிசாக தேவன் அருள்வார்.</span>
          </h1>
          <p className="ctc-hero-lede">
            <span>Join us this Sunday.</span>{" "}
            <span>We’d love to welcome you and your family.</span>
          </p>
          {/* On desktop "I'm New" moves to the photo's lower-right corner,
              under the Sunday card (the --corner copy below); CSS shows one
              copy, and display: none hides the other from screen readers. */}
          <div className="ctc-hero-actions">
            <ImNewLink />
          </div>
          {featured ? <FeaturedEventNotice event={featured} /> : null}
        </div>

        <div className="ctc-hero-visual">
          <SundayCard />
          {featured ? <FeaturedEventCardRow event={featured} /> : null}
          <div className="ctc-hero-actions ctc-hero-actions--corner">
            <ImNewLink />
          </div>
        </div>
        <WeeklyVerse className="ctc-hero-weekly-verse-ribbon" />
      </section>
  );

  return (
    <>
      <StickySundayBar fabRef={fabRef} />
      <div className="ctc-light-shell">
      <div className="ctc-spine" ref={spineRef} aria-hidden="true" />
      <div className="ctc-comet" ref={cometRef} aria-hidden="true" />

      <div className="ctc-home" ref={homeRef}>
        <FollowTheLight
          opening={{ labelTa: "வணக்கம்", labelEn: "Welcome", content: hero }}
          onActiveChange={onActiveChange}
        />
      </div>
      </div>
    </>
  );
}
