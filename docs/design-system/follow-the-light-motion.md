# Follow the Light motion system

Shipping specification for the homepage-only scrollytelling sequence.

## Source of truth

- Component: `src/components/FollowTheLight/FollowTheLight.tsx`
- Scoped styles: `src/components/FollowTheLight/FollowTheLight.module.css`
- Content model: `src/data/ministryPathways.ts` (pathways)
- Integration point: `src/pages/Home.tsx`, which passes the hero in as the
  opening chapter. Homepage snapping and the floating header live in
  `src/pages/Home.css`.

When this document differs from those files, the shipping implementation wins.
Do not copy this system to inner pages.

## Chapters

The whole homepage above the footer is one sequence of chapters, all sharing
the same light reveal:

| # | Chapter | Rail label | Source |
|---|---------|------------|--------|
| 0 | Welcome (the hero) | வணக்கம் · Welcome | `opening` prop from `Home.tsx`, full-bleed |
| 1–4 | Worship, Connect, Grow, Serve | the pathway's Tamil/English labels | `ministryPathways` |

The site footer is **not** a chapter: it is shared by every page, link-dense,
and taller than many screens. It follows the sequence as a normal scroll,
with a `scroll-snap-align: end` stop.

## Structure and progress

The outer section is `100lvh + (chapters − 1) × 30svh` tall (`--ftl-gaps` is
set from the component; `--ftl-cover`/`--ftl-step` hold the units, with `vh`
fallbacks). The pin is `100lvh`; content is centred inside the always-visible
`100svh`, so nothing sits under a mobile toolbar. Its sticky, viewport-height pin holds every chapter
absolutely stacked. On the homepage the header is `position: fixed`, so the
section starts at the very top of the document and the hero fills the first
screen under the floating header.

```ts
progress = clamp(-section.getBoundingClientRect().top /
  (section.offsetHeight - pin.offsetHeight), 0, 1);
position = progress * (chapterCount - 1);   // continuous, 0 … last
active   = round(position);
```

Scroll work runs in `requestAnimationFrame` behind a `ticking` guard. React
never renders per frame: the component writes CSS custom properties,
transforms and opacity, and toggles classes/attributes only when the active
chapter changes. `onActiveChange(index)` fires on those changes only; Home
uses it to show the Sunday FAB once the hero is no longer the active chapter.

## Navigation model: native scrolling, no JS scroll hijacking

The pin does all pinning in CSS. The component attaches only **passive**
`scroll` and `resize` listeners — it never calls `preventDefault()` or
`window.scrollTo()`. The browser owns wheel, trackpad, touch, keyboard and
scrollbar input; snapping is native CSS:

- Scroller / snap container (`Home.css`), never `body` (snap-type is
  ignored there):
  - **Desktop (fine pointer):** the root scroller, `html:has(.ctc-home)`,
    so keyboard scrolling works with nothing focused.
  - **Touch (`pointer: coarse`):** `.app-shell` is a `100svh` scroll
    container and the document does not scroll. Mobile browsers collapse
    their address bar only on document scroll; doing that during hero →
    Worship shifted the visible area ~56px mid-animation and made the hero's
    Tamil text jitter on every such swipe (seen on a Galaxy S20 FE, Chrome).
    The pin is `100svh` here. Trade-offs: the address bar stays visible on
    the homepage and pull-to-refresh is unavailable there.
  - Scroll listeners therefore use a capture-phase `document` listener (it
    hears both the page and the container) and read positions with
    `getBoundingClientRect`, or the active scroller's `scrollTop`.
- Snap points: one invisible `.snapStop` span per chapter, positioned at
  `(section height − pin height) × index / (chapterCount − 1)` — exactly where
  that chapter is fully revealed — plus the footer (`end`).
- Desktop/tablet (>480px wide, >550px tall): `y mandatory` with
  `scroll-snap-stop: always`, so one wheel notch, arrow key, PageDown or hard
  fling moves exactly one chapter.
- Phones (≤480px): `y proximity` on the chapter stops only — never traps
  content, but a scroll that ends near a chapter settles onto it so the light
  never rests half-way.
- The snap media queries are duplicated in `Home.css` and
  `FollowTheLight.module.css` and must stay identical.
- Ancestors of the pin must not be scroll containers: `.ctc-home` uses
  `overflow: clip`, never `hidden`.
- No `scroll-behavior: smooth`: snapping animates natively, and smooth
  behavior would also animate Layout's route-change scroll reset.
- Rail clicks are the only programmatic scroll (`scrollIntoView` on a stop).

An earlier version intercepted wheel/touch with non-passive listeners and
replayed gestures as forced smooth scrolls; it fought compositor scrolling
and felt laggy on trackpads. Prefer deleting that kind of controller over
layering another timeout or lock onto it.

## Visual and motion rules

- **The light reveal is the one authored moment.** Scroll position is the
  clock. Between two chapters a band of warm light rises up the pin: below it
  the incoming chapter is uncovered, above it the outgoing chapter remains
  and is erased as the light passes. Pause and the light pauses; scroll back
  and it reverses. Between the hero and Worship it rises through the photo.
  - Each chapter is masked between two cuts from the bottom:
    `lo = clamp(position − i)` (outgoing) and `hi = clamp(position − i + 1)`
    (incoming).
  - `--edge: 8%` of the pin is the soft dissolve (`EDGE` in the component;
    keep equal). The `.sweep` band rides its centre with an opaque warm-white
    core so the crossover reads as light, not overlapping text. Opacity
    follows `sqrt(sin(π × travel))`; 0 at rest.
  - Outgoing content drifts up and incoming settles up by `--drift: 32px`.
- **Entrance choreography** (the original scene animation, timed, not
  scroll-linked). A chapter gets `.lit` from the first pixel the light
  reveals it until it is fully gone; gaining it plays, losing it resets, so
  it replays on every arrival in either direction:
  - Scene settles from `translate: 0 46px`, `scale: 0.955` over 750ms.
    These use the individual `translate`/`scale` properties so they compose
    with the scroll-driven `transform` drift, which is never transitioned.
    No scene-level opacity fade (the mask controls visibility; a second fade
    left the revealed area empty mid-sweep) and no full-scene blur (blurring
    a whole masked screen every frame was the costliest paint).
  - Marker rises 14px; its gold-to-green rule draws from `scaleX(0.15)`.
  - Headline words rise `0.55em` in a 110ms stagger; introduction fades at
    280ms; ribbon rises at 340ms; ministry names stagger at
    70ms from 420ms.
  - The hero has no element choreography of its own beyond its load
    animations; returning to it plays the scene-level resolve.
- **Chapter rail** (right edge of the pin, hidden ≤620px): one station per
  chapter on a hairline, with a `--light` point gliding continuously
  (`translateY(progress × 100%)`). Passed stations fill green; the active one
  rings. Stations are 44px buttons; labels (Tamil + English) open on hover or
  keyboard focus only. **Hidden while the hero is the active chapter**
  (`.railHidden`: fade + `visibility: hidden`, so its buttons also leave the
  tab order); it appears as you move into Worship and keeps a Welcome
  station for going back.
- Aura scale grows from `0.45` to `1.45`; opacity from `0.35` to `0.85`.
- Headline: `--font-display`, weight 300, `--text-hero`, line-height `0.94`.
  Supporting UI: `--font-body`. Accent `--green-deep`; CTA `--clay-dark`.
- No bounce, spring, looping ornament, or React render loop.

Chapters are centred in the space **below the floating header**: Home.tsx
measures `.site-header` (ResizeObserver) into `--ftl-top-inset`, which the
scene's top padding uses; `justify-content: safe center` keeps the marker and
headline on screen if a chapter ever overflows. At `620px`, vertical rhythm
and the headline (`clamp(36px, min(13vw, 7.2svh), 60px)`) scale with screen
height as well as width, and ministry names stack tightly
— the six-ministry chapters (Connect, Grow) fit down to 360×640 and
375×600. The phone hero is tightened to fit one
screen down to 360×640 (centred column, single-row Sunday card). The Tamil
title uses a display hierarchy on phones: "வாரும்," at ~2× on its own line,
the two phrase lines width-scaled so they never wrap or overflow, and the
lede one step quieter.

## Flat mode (reduced motion and short screens)

If `prefers-reduced-motion: reduce` **or** `(max-height: 550px)` matches
(tracked live, so rotating a phone switches modes), the section gets the
`flat` class: every chapter is visible, `aria-hidden`/`inert` are removed, no
scroll listener is attached, and the pin becomes normal document flow with
chapters stacked — hero first, Serve last. Masks, drift, entrance choreography
offsets, aura, sweep, rail and snap stops are all removed. The FAB uses an
IntersectionObserver on the hero instead.

This mode is required. New motion must preserve complete readability and
navigation when animation is disabled or the screen is too short to pin.

## Performance rules (smooth always)

Measured with GPU-enabled headless Chrome at 4× CPU throttling, scrolling
through every chapter: phone 390×844@3x went from ~40 fps (p95 frame 83ms) to
~58 fps (p95 17ms); desktop 1440×900 from ~10 fps to ~53 fps. Keep it there:

- **Paint only what is visible.** Chapters without `.lit` are
  `visibility: hidden` (fully masked anyway) and carry no `will-change`; at
  most two chapters (outgoing + incoming) are painted and layered at once.
- **Per-frame custom properties never cascade.** `--lo`/`--hi` are
  registered with `@property … inherits: false`. Never write a per-frame
  custom property on an ancestor: the comet rail writes
  `--ctc-rail-progress` on `.ctc-spine` itself, not on `.ctc-light-shell`
  (that one write restyled the entire homepage every frame).
- **No full-screen filters in motion.** No `blur()` on whole chapters, and
  no `backdrop-filter` on anything floating over the sequence (the Sunday FAB
  is a solid surface — a backdrop blur re-blurs the moving scene each frame).
- **No React renders on the scroll path.** `onActiveChange` must not set
  React state: the Sunday FAB is always mounted and toggled with a class.
  Setting state there re-rendered the whole homepage mid-sweep and caused a
  visible 67–83ms hitch on the hero → Worship transition on phones.
- **Static viewport units.** `lvh`/`svh`, never `dvh`, for anything sized or
  positioned while scrolling, including phone type and spacing.
- **No hidden work.** Anything fully covered by the pin (the old particle
  canvas, vignette, grain and cursor glow — removed after a zero-pixel
  screenshot diff) must not keep rendering.
- **Snap step.** 30% of a screen per chapter, so gentle trackpad swipes
  cross the half-way point instead of snapping back.

## Accessibility and implementation constraints

- The section has the accessible label "Our life together".
- The ministry ribbon is a semantic list with a chapter-specific label.
- CTAs are router links with visible focus and 44px+ targets.
- Decorative aura, sweep and rail track are hidden from assistive
  technology. The rail is `<nav aria-label="Homepage chapters">` with an
  ordered list; the active station carries `aria-current="step"`.
- Every inactive chapter gets `aria-hidden="true"` and `inert`; the active
  chapter has both removed.
- Heights use `lvh`/`svh` with `vh` fallbacks; progress always comes from measured
  `offsetHeight`, never `window.innerHeight`.
- Always clean up listeners and observers on unmount.

## Acceptance checklist

- [ ] The hero fills the first screen under the floating header, on desktop,
      tablet, and phones down to 375×667, with nothing clipped.
- [ ] Desktop/tablet: one wheel notch, arrow key, PageDown or hard fling moves
      exactly one stop, Welcome → Worship → Connect → Grow → Serve →
      Footer, in both directions.
- [ ] Phones use `y proximity`; reduced motion has no snapping; short screens
      show the stacked flat document.
- [ ] Mid-scroll the light band covers the seam (including through the hero
      photo); at rest no band is visible.
- [ ] Each chapter replays its entrance choreography (blur resolve, marker,
      word stagger, introduction, ministry names) every time it arrives.
- [ ] No chapter dots are visible or focusable on the hero; they appear from
      Worship on.
- [ ] Clicking a rail station lands on that chapter; hover/focus opens labels.
- [ ] The Sunday FAB is hidden on the hero chapter and shown after it.
- [ ] Wheel, trackpad, touch, keyboard and scrollbar input all scroll
      natively — nothing is intercepted.
- [ ] Inactive chapters are not focusable and are hidden from assistive tech.
- [ ] Scrolling does not trigger React renders per frame.
