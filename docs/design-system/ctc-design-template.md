# CTC Design Template

The single source of truth for the Christ Tamil Church website design system.
Every page — new or migrated — follows this template. It codifies the
leader-approved homepage direction (`src/pages/Home.tsx`, the `ctc-*` class
system) so the rest of the site can match it.

**When this document and the code disagree, the live homepage wins.** Update
this document, don't fork the design.

Companion documents:

- `docs/design-system/follow-the-light-motion.md` — spec for the homepage's
  pinned "Follow the Light" scroll animation (homepage-exclusive).

Stylesheet ownership:

- `src/styles.css` — canonical tokens, reset, global typography, and shared foundations.
- `src/styles/layout.css` — shipping navigation and footer.
- `src/pages/Home.css` — homepage-only hero, atmosphere, motion, and teaser sections.
- `src/pages/<Page>.css` — route-owned inner-page styling.
- `src/components/**/**.module.css` — component-scoped animation systems.

Run `node scripts/prune-global-css.mjs --all` to audit unreachable class
selectors. Review its report before using `--write`; visual regression checks
remain mandatory after removal.

---

## 1. Design intent

Warm editorial reverence — natural-light photography, generous whitespace,
serif authority, deep greens and brass gold on white and warm cream. Bright,
welcoming, spiritual, family-focused. Tamil identity named with pride.
Visitor-first: a first-time guest should find Sunday time, location, and
"I'm New" without scrolling on any landing surface.

Avoid:

- Corporate SaaS or dashboard aesthetics (dense card grids, cold greys).
- Old church-bulletin clutter (cramped layouts, competing CTAs).
- Dark page themes, neon effects, large saturated color blocks.
- Trend-chasing decoration that outshines the message.

## 2. Tokens

The canonical token block lives at the top of `src/styles.css` (`:root`,
lines ~3–85, labeled as the Christ Tamil Church design system). **That block is the code
source of truth** — never hardcode a hex that has a token, and never invent a
parallel palette. The working set:

| Token | Value | Role |
|---|---|---|
| `--ink` | `#10251b` | Headings, strongest text |
| `--primary` | `#153d2b` | Deep forest green — primary surfaces, footer accents |
| `--muted` | `#59635c` | Body copy (muted green-grey) |
| `--faint` | `#8a9183` | Meta, captions |
| `--green-deep` | `#6ba52c` | Accent green — accent words, icons, citations |
| `--light` | `#8dc63f` | Bright leaf green — dots, glints, rail accents |
| `--gold` / `--clay` | `#b99045` | Brass gold — eyebrows, small labels. A spice, never a flood |
| `--clay-dark` | `#96702f` | Bronze — primary CTA fill (white text) |
| `--sage` / `--bg-sage` | `#edf3ea` | Sage band / inset panels |
| `--canvas` / `--bg-sand` | `#faf6ea` | Warm cream band |
| `--line` | `rgba(16,37,27,0.10)` | Hairlines, card borders |
| `--shadow-card` | `0 16px 34px rgba(16,37,27,0.06)` | Card shadow — always green-tinted, never grey |
| `--radius-md` | `8px` | Cards, images |
| `--radius-pill` | `999px` | Buttons, badges, icon circles |
| `--ease-out` / `--ease-premium` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Signature easing, all motion |
| `--motion-fast/base/slow` | `160ms / 260ms / 520ms` | Transition durations |
| `--container` | `1200px` | Content width (narrow prose ~980px) |

Legacy aliases such as `--warm-band` remain only while old global page rules
are migrated. **Never extend them or use them in new code.** The homepage's
former `--ql-*` palette has been replaced by the canonical tokens above.

## 3. Color usage

- **Green leads.** Ink-green headings, deep-green primary surfaces, green
  accents. Shadows are green-tinted (`rgba(16,37,27,…)`).
- **Gold is a spice.** Eyebrows, tiny labels, thin rules, and the one bronze
  primary CTA per view. Never large gold fills or gold body text.
- **White is the stage.** White/warm-white dominate; sage (`#edf3ea`) and
  cream (`#faf6ea`) full-bleed bands break up long pages — content stays
  centered in the container inside each band.
- **Imagery is warm** — golden natural light, real congregation photos.
  Slight saturation bump on hover (`saturate(1.03–1.06)`); never cold or B&W.
- **Contrast is non-negotiable.** Body text ≥ 4.5:1 against its band. Small
  colored labels use the deep variants (`--primary`, `--clay-dark`), not the
  bright accents (`--light`, `--green-deep` are for large/decorative use).

## 4. Typography

| Role | Font | Recipe |
|---|---|---|
| Display / hero headline | Fraunces 300–600 | `clamp(3.8rem, 7.4vw, 7.65rem)` desktop, `clamp(3.2rem, 15vw, 5rem)` ≤620px; tight leading 0.94–1.05, `letter-spacing: -0.02…-0.035em` |
| Section headline (h2) | Fraunces 300–500 | `clamp(30px, 4.4vw, 56px)`, line-height ~1.04 |
| Body / UI / buttons | Space Grotesk 300–600 | 16–17px body, line-height 1.6; buttons use the stronger available weights |
| Eyebrow / kicker / cite | Space Grotesk or the `--font-mono` fallback stack | 11–12px, uppercase, `letter-spacing: .16–.24em`, color `--gold` (eyebrows) or `--green-deep` (citations) |
| Tamil display & Scripture | Noto Serif Tamil 300/400, italic 400 | Always `lang="ta"`, `letter-spacing: 0`, line-height ≥1.28 (vowel signs sit above and below). Size ~0.85× the Latin display size it replaces, since Tamil reads larger. **Upright = welcome/headline voice; italic = Scripture voice** (plus the one accent word). |
| Tamil UI labels | Catamaran 300–800 | Sentence case, minimal tracking; pair with an English small-caps reference badge (see hero kicker) |

Patterns:

- **Accent word:** the final/subject word of a display headline may be colored
  `--green-deep` (optionally italic Fraunces).
- **Tamil first:** where scripture leads a page, the Tamil phrase leads and the
  reference sits in a small pill badge (see `.ctc-hero-kicker`). Scripture
  quotes are Tamil (Noto Serif Tamil italic) with the English reference in
  the mono cite.
- Sentence case for body and headings; Title Case for ministry names.
  Uppercase only for mono eyebrows/labels.

## 5. Layout & rhythm

- Container `1200px`; narrow reading measure ~`980px` / `46ch` for prose.
- Section vertical rhythm `clamp(46px, 6vw, 82px)` padding inside bands;
  4px-based spacing scale.
- Long pages alternate: white → sage or cream band → white. One idea per band.
- One strong image per major section, registered in `src/data/images.ts`.
- Breakpoints in use (match them, don't invent new ones):
  - `1120px` — hero/two-column layouts collapse to one column.
  - `900px` — tablet adjustments, rail/decoration hides.
  - `620px` — phone layout; hero switches to the portrait crop image via
    `<picture><source media="(max-width: 620px)">`.

## 6. Component recipes

Concrete, shipping implementations to copy from. Homepage `ctc-*` recipes live
in `src/pages/Home.css`; shared foundations live in `src/styles.css`.

### 6.1 Page hero (`.ctc-hero-*`)

The homepage hero is the master pattern (see `src/pages/Home.tsx`):

1. **Kicker** (`.ctc-hero-kicker`): Tamil phrase in Catamaran/Fraunces green
   + small uppercase reference badge in a white pill.
2. **Display headline** (`.ctc-hero-title`): on the homepage, Tamil-first in
   Noto Serif Tamil. The invitation word "வாரும்," leads in green italic at
   ~1.4× and the phrase lines follow in light 300 ink. Inner pages use
   Fraunces, ink.
3. **Lede** (`.ctc-hero-lede`): 1–2 sentences of visitor-focused copy.
4. **One primary CTA** — never a pair of competing buttons in a hero.
5. Optional full-bleed photo with a white wash gradient
   (`.ctc-hero-bg` + `.ctc-hero-bg-wash`) so text sits on calm space; on
   mobile the wash flips to top-down and a portrait crop serves via `<picture>`.
6. Optional info card (see 6.3) anchored over the photo.

Inner pages use a lighter variant: kicker + headline + lede + one CTA on a
white or cream band; the photo and info card are optional, the structure is not.

### 6.2 Buttons

Rounded **pill** is the sitewide button shape (`border-radius: var(--radius-pill)`).

- **Primary — bronze pill** (shipping as `.ctc-hero-actions a.go`):
  fill/border `--clay-dark` `#96702f`, text `#fff`, warm shadow
  `0 16px 38px rgba(150,112,47,0.38)`; hover deepens to `#7d5c26` with a
  `-2px` lift and a subtle white shimmer sweep (`a.go::before`).
  One bronze primary per view.
- **Secondary — quiet pill** (shipping as `.ctc-hero-actions a`):
  `rgba(255,255,255,0.86)` fill, `--line` hairline border, ink text;
  hover: lime-wash fill, green text, `-2px` lift.
- **Tertiary — arrow text link** (shipping as `.ctc-hero-card a`):
  strong-weight Space Grotesk in `--clay-dark`, trailing `ArrowRight` (lucide) that
  slides `3px` on hover.

Buttons are `min-height: 52px` (44px+ touch target), Space Grotesk 500–600,
transitions 160–180ms with the signature easing.

### 6.3 Card (the "This Sunday" look, `.ctc-hero-card`)

- Solid warm white `rgba(255, 254, 250, 0.97)` (+ `backdrop-filter: blur(16px)`
  when floating over photos).
- Hairline border `rgba(16, 37, 27, 0.08)` — visible edge, never white-on-white.
- Green-tinted shadow `0 28px 80px rgba(16, 37, 27, 0.24)` when floating over
  imagery; the softer `--shadow-card` when resting on a flat band.
- Radius `18px` for feature cards; `--radius-md` (8px) for in-flow cards.
- Anatomy: mono uppercase label in `--primary` → large Fraunces value in ink →
  tertiary arrow link.
- Hover (linked cards only): `-3px` lift, border warms toward
  `rgba(21,61,43,0.22)`.

### 6.4 Section header

Eyebrow + headline + optional one-sentence support text (component:
`src/components/SectionHeader.tsx`). Eyebrow is mono uppercase gold; bilingual
eyebrows use "English · தமிழ்" separated by a middot.

### 6.5 Row list (editorial ministry list, `.home-teaser-ministry-*`)

For "ways to belong"-style indexes: hairline-separated rows of
`index (mono gold) · lucide icon (green) · Fraunces title · muted meta`;
hover indents the row 12px and turns the title italic green. Prefer this over
card grids for lists of links.

### 6.6 Verse / pull-quote block (`.home-teaser-verse`)

Sage panel, italic Fraunces quote in ink `clamp(22px, 3vw, 30px)`, mono
uppercase citation in `--green-deep`. Scripture is quoted directly and cited
inline (e.g. `Matthew 11:28`).

### 6.7 Iconography

Lucide only (`lucide-react`), 2px stroke, 14–22px inline or 20–28px inside
42–52px green pill circles. No filled icons, no emoji, no unicode glyphs.

## 7. Motion

Gentle and reverent — light revealing the page, not decoration moving on it.

**Sitewide (every page):**

- Entrances: fade-up — opacity 0→1 + `translateY(14–28px)` → 0, 650–800ms,
  easing `cubic-bezier(0.2, 0.7, 0.2, 1)`, small stagger (~150ms) between
  siblings (see `heroFadeUp` / `heroImageIn` keyframes).
- Scroll reveals via `IntersectionObserver`, class-toggle only — never
  re-render React per scroll frame.
- Hovers: 160–260ms; lifts of `-2…-4px`; image scale ≤1.025 with a slight
  warm-up. No bounce, no springs, no infinite loops.
- `prefers-reduced-motion: reduce` is mandatory: kill transforms/reveals and
  show content immediately (pattern: the `.flat` mode in
  `FollowTheLight.module.css` and the global reduced-motion block in
  `styles.css`).

**Homepage-exclusive atmosphere — do NOT copy to inner pages:**

- The left light-rail spine and scroll comet. (The particle canvas, cursor
  glow, vignette and grain were removed: Follow the Light's opaque pin
  covers them completely, so they only cost frame time.)
- The pinned "Follow the Light" scrollytelling
  (`src/components/FollowTheLight/`) — spec in
  `docs/design-system/follow-the-light-motion.md`.

Inner pages get the restrained sitewide subset only. If a future page earns a
signature moment, it must be planned deliberately, not pasted.

## 8. Imagery

- Every image is registered in `src/data/images.ts` (`SiteImage` type: src,
  alt, credit, usage, optional `objectPosition`). No ad-hoc `<img src>`.
- Warm, natural-light, human photography — congregation, families, welcome
  moments. Tamil community represented authentically.
- Decorative images: empty `alt=""` + `aria-hidden="true"` (see hero
  background). Content images: specific, human alt text.
- Lazy-load below-the-fold images (`loading="lazy"`); hero images load eagerly
  with explicit `width`/`height` to prevent layout shift.
- Responsive art direction via `<picture>` + `<source media>` matched to the
  CSS breakpoints (the hero's 620px portrait crop is the pattern).
- Unsplash images keep credit fields and the UTM referral params (see
  existing registry entries).

## 9. Voice & copy

- Second person to the visitor ("you and your family"); first-person plural
  for the church ("we'd love to welcome you").
- Warm, gentle, pastoral. Sincere about faith without being preachy;
  hospitality leads.
- Scripture quoted directly, cited inline with abbreviated book names.
- CTAs are gentle imperatives: "Plan your visit", "Get directions",
  "Ask for prayer".
- No emoji, no hype. Expand acronyms warmly (B.L.A.S.T. = Bible Learning And
  Spiritual Training). Name Tamil identity with pride.

## 10. Inner-page blueprint

Every inner page (Visit, Worship, Connect, Grow, Serve, Contact, …) follows
this skeleton:

```
<PageHero>        kicker · headline · lede · one primary CTA   (§6.1 light variant)
<Band × 2–4>      alternating white / sage / cream bands, each:
                  SectionHeader (§6.4) + ONE content pattern
                  (row list §6.5, cards §6.3, verse block §6.6, prose + image)
<ClosingBand>     visit/next-step CTA: address or relevant action,
                  bronze primary + tertiary links
```

Rules:

- Semantic HTML: one `h1` per page, sections labeled via
  `aria-labelledby`, landmarks intact. Keyboard focus visible.
- Sunday worship time, address, and a path to "I'm New"/Contact reachable
  from every page (hero CTA or closing band).
- Verify at desktop (1900), tablet (~900), and phone (487/380 wide) before
  calling a page done. Use browser screenshots and production builds; no
  Playwright test suite is currently configured in the repository.
- Keep page changes isolated and remove obsolete selectors only after source
  reachability and visual-regression checks.
- Each migrated page gets its own stylesheet (`src/pages/<Page>.css`) and a
  short design note in `docs/design-system/pages/`. Worked example:
  [Sunday School](pages/sunday-school.md).
