import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ministryPathways } from "../../data/ministryPathways";
import styles from "./FollowTheLight.module.css";

// Height of the soft dissolve edge, as a fraction of the pin. Must match
// `--edge` on .scene in FollowTheLight.module.css.
const EDGE = 0.08;

// Below this height a full-screen pin cannot hold a scene, so the whole
// sequence falls back to the stacked "flat" document (same as reduced motion).
const SHORT_SCREEN = "(max-height: 550px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

type Chapter = {
  key: string;
  labelTa: string;
  labelEn: string;
  /** Full-bleed chapters (the hero) bring their own layout. */
  bleed?: boolean;
  render: () => ReactNode;
};

type FollowTheLightProps = {
  /** First chapter, rendered full-bleed (the homepage hero). */
  opening?: { labelTa: string; labelEn: string; content: ReactNode };
  /** Called when the active chapter changes (0 = opening). Not per frame. */
  onActiveChange?: (index: number) => void;
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    // false while prerendering at build time; the client re-reads it on mount.
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function FollowTheLight({ opening, onActiveChange }: FollowTheLightProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stopRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const railStopRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const railRef = useRef<HTMLElement | null>(null);
  const railLightRef = useRef<HTMLSpanElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  const shortScreen = useMediaQuery(SHORT_SCREEN);
  const flat = reduceMotion || shortScreen;

  const chapters: Chapter[] = [
    ...(opening
      ? [{
          key: "opening",
          labelTa: opening.labelTa,
          labelEn: opening.labelEn,
          bleed: true,
          render: () => opening.content,
        }]
      : []),
    ...ministryPathways.map((scene) => ({
      key: scene.id,
      labelTa: scene.labelTa,
      labelEn: scene.labelEn,
      render: () => (
        <>
          <div className={styles.marker}>
            <div className={styles.markerCopy}>
              <span className={styles.markerTamil} lang="ta">{scene.labelTa}</span>
            </div>
            <span className={styles.markerRule} aria-hidden="true" />
          </div>
          <h2 className={styles.headline}>
            {scene.words.map((word, wordIndex) => (
              <span
                key={`${scene.id}-${word}-${wordIndex}`}
                className={wordIndex === scene.accentWord ? `${styles.w} ${styles.accent}` : styles.w}
              >
                {word}
                {wordIndex < scene.words.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          <p className={styles.sub}>{scene.introduction}</p>

          <div className={styles.ribbon}>
            <ul className={styles.ribbonList} aria-label={`${scene.labelEn} ministries`}>
              {scene.ministries.map((ministry) => (
                <li key={ministry.name}>
                  <span>{ministry.name}</span>
                </li>
              ))}
            </ul>
            <Link className={styles.pathwayCta} to={scene.cta.href}>
              {scene.cta.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </>
      ),
    })),
  ];
  const last = chapters.length - 1;
  const hasOpening = Boolean(opening);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    if (flat) {
      section.classList.add(styles.flat);
      sceneRefs.current.forEach((scene) => {
        scene?.classList.add(styles.on);
        scene?.removeAttribute("aria-hidden");
        scene?.removeAttribute("inert");
      });
      // Stacked document: "past the opening" is simply "opening scrolled away".
      const opener = sceneRefs.current[0];
      if (!opener) return () => section.classList.remove(styles.flat);
      const observer = new IntersectionObserver(([entry]) =>
        onActiveChangeRef.current?.(entry.isIntersecting ? 0 : 1),
      );
      observer.observe(opener);
      return () => {
        observer.disconnect();
        section.classList.remove(styles.flat);
      };
    }

    // Passive scroll observation only: the browser drives scrolling, the
    // sticky pin and the CSS snap stops natively. This just reads scroll
    // position and paints scene state — it never blocks or redirects input.
    let ticking = false;
    let lastActive = -1;
    const lastMask = chapters.map(() => "");
    // Seed from the DOM, not from the initial render: a previous run of this
    // effect (StrictMode remount, or a pass made while the old route's scroll
    // offset was still applied) may already have moved `lit` to another scene.
    const lastLit = chapters.map(
      (_, index) => sceneRefs.current[index]?.classList.contains(styles.lit) ?? false
    );

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const pinHeight = pin.offsetHeight;
      const total = section.offsetHeight - pinHeight;
      const progress = total > 0 ? clamp01(-rect.top / total) : 0;

      // Continuous chapter position: 0 = first chapter … last. The
      // fractional part is how far the light has travelled between two.
      const position = progress * last;
      const activeIndex = Math.round(position);
      const travel = position - Math.floor(position);

      // The light reveal. Each scene is visible between two horizontal cuts
      // measured from the bottom of the pin:
      //   --lo: the light passing upward through it, erasing it (outgoing)
      //   --hi: the light passing upward, uncovering it (incoming)
      // lo = clamp(position − i), hi = clamp(position − i + 1), so exactly one
      // pair of scenes shares the seam at any moment.
      sceneRefs.current.forEach((scene, index) => {
        if (!scene) return;
        const loValue = clamp01(position - index);
        const hiValue = clamp01(position - index + 1);

        // "Lit" from the first pixel the light reveals until the scene is
        // fully gone. Gaining it plays the entrance choreography (timed CSS
        // transitions); losing it resets the scene so it replays next time.
        const lit = hiValue > 0 && loValue < 1;
        if (lit !== lastLit[index]) {
          lastLit[index] = lit;
          scene.classList.toggle(styles.lit, lit);
        }

        const lo = loValue.toFixed(4);
        const hi = hiValue.toFixed(4);
        const mask = `${lo}|${hi}`;
        if (mask === lastMask[index]) return;
        lastMask[index] = mask;
        scene.style.setProperty("--lo", lo);
        scene.style.setProperty("--hi", hi);
      });

      // The band of light riding the seam: its centre sits at the middle of
      // the soft edge, and it only glows while a transition is under way.
      if (sweepRef.current) {
        const seamFromTop = pinHeight * (1 + EDGE / 2 - travel * (1 + EDGE));
        const glow = travel > 0 ? Math.sqrt(Math.sin(Math.PI * travel)) : 0;
        sweepRef.current.style.transform = `translate3d(0, ${seamFromTop.toFixed(1)}px, 0)`;
        sweepRef.current.style.opacity = glow.toFixed(3);
      }

      // Chapter rail: the point of light glides continuously between stops.
      if (railLightRef.current) {
        railLightRef.current.style.transform = `translate3d(0, ${(progress * 100).toFixed(3)}%, 0)`;
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate(-50%, -50%) scale(${(0.45 + progress).toFixed(3)})`;
        auraRef.current.style.opacity = (0.35 + progress * 0.5).toFixed(3);
      }

      if (activeIndex === lastActive) return;
      lastActive = activeIndex;
      onActiveChangeRef.current?.(activeIndex);

      sceneRefs.current.forEach((scene, index) => {
        if (!scene) return;
        const isActive = index === activeIndex;
        scene.classList.toggle(styles.on, isActive);
        scene.setAttribute("aria-hidden", String(!isActive));
        if (isActive) scene.removeAttribute("inert");
        else scene.setAttribute("inert", "");
      });

      // No chapter dots over the hero: the rail appears once the visitor
      // moves into the pathways (it keeps a Welcome station to go back).
      railRef.current?.classList.toggle(styles.railHidden, hasOpening && activeIndex === 0);

      railStopRefs.current.forEach((stop, index) => {
        if (!stop) return;
        stop.classList.toggle(styles.railStopActive, index === activeIndex);
        stop.classList.toggle(styles.railStopPassed, index < activeIndex);
        if (index === activeIndex) stop.setAttribute("aria-current", "step");
        else stop.removeAttribute("aria-current");
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    // Capture-phase listener on the document hears the page scrolling AND the
    // touch-device `.app-shell` scroll container (scroll events don't bubble).
    // Progress comes from getBoundingClientRect, so either scroller works.
    const scrollOptions = { passive: true, capture: true } as const;
    document.addEventListener("scroll", onScroll, scrollOptions);
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      document.removeEventListener("scroll", onScroll, scrollOptions);
      window.removeEventListener("resize", onScroll);
    };
    // `chapters` is rebuilt each render, but its length and order are fixed.
  }, [flat, last, hasOpening]);

  // Rail click: bring that chapter's snap stop to the top of the viewport.
  // The light sweeps through every chapter in between on the way.
  const goToChapter = (index: number) => {
    stopRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section}${flat ? ` ${styles.flat}` : ""}`}
      style={{ "--ftl-gaps": last } as CSSProperties}
      aria-label="Our life together"
    >
      {/* Invisible CSS scroll-snap targets, one per chapter. Each sits at the
          exact scroll offset where update() resolves that chapter as fully
          revealed (position = index), so native snapping always comes to
          rest on a whole chapter rather than mid-sweep. See .snapStop. */}
      {chapters.map((chapter, index) => (
        <span
          key={`stop-${chapter.key}`}
          ref={(element) => {
            stopRefs.current[index] = element;
          }}
          className={styles.snapStop}
          style={{ "--ftl-stop": index / Math.max(1, last) } as CSSProperties}
          aria-hidden="true"
        />
      ))}

      <div ref={pinRef} className={styles.pin}>
        <div ref={auraRef} className={styles.aura} aria-hidden="true" />

        {chapters.map((chapter, index) => (
          <div
            key={chapter.key}
            id={chapter.key === "opening" ? undefined : `pathway-${chapter.key}`}
            ref={(element) => {
              sceneRefs.current[index] = element;
            }}
            aria-hidden={index !== 0}
            className={[
              styles.scene,
              chapter.bleed ? styles.sceneBleed : "",
              index === 0 ? `${styles.on} ${styles.lit}` : "",
            ].filter(Boolean).join(" ")}
            style={index === 0 ? undefined : ({ "--hi": 0 } as CSSProperties)}
          >
            {chapter.render()}
          </div>
        ))}

        {/* The light itself: a warm band that rides the seam between the
            outgoing and incoming chapter while you scroll. */}
        <div ref={sweepRef} className={styles.sweep} aria-hidden="true" />

        <nav
          ref={railRef}
          className={`${styles.rail} ${opening ? styles.railHidden : ""}`}
          aria-label="Homepage chapters"
        >
          <span className={styles.railTrack} aria-hidden="true">
            <span ref={railLightRef} className={styles.railLight} />
          </span>
          <ol className={styles.railList}>
            {chapters.map((chapter, index) => (
              <li key={`rail-${chapter.key}`}>
                <button
                  ref={(element) => {
                    railStopRefs.current[index] = element;
                  }}
                  type="button"
                  className={`${styles.railStop}${index === 0 ? ` ${styles.railStopActive}` : ""}`}
                  aria-current={index === 0 ? "step" : undefined}
                  onClick={() => goToChapter(index)}
                >
                  <span className={styles.railLabel}>
                    <span lang="ta">{chapter.labelTa}</span>
                    <small>{chapter.labelEn}</small>
                  </span>
                  <span className={styles.railDot} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
