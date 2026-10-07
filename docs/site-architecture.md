# Christ Tamil Church website implementation status

Updated July 21, 2026. This document records the shipping architecture after
the redesign and design-system consolidation. Current design decisions live in
`docs/design-system/ctc-design-template.md`.

## Platform

- React 18, TypeScript, Vite, and React Router 6.
- Lucide React is the only icon system.
- Shared church facts live in `src/data/site.ts`.
- Registered imagery lives in `src/data/images.ts`.
- Sermon metadata lives in `src/data/sermonVideos.ts`.
- Ministry-pathway content lives in `src/data/ministryPathways.ts`.
- Scroll reveals use `src/hooks/useRevealOnScroll.ts`.

There is no CMS, server API, form processor, test runner, or configured linter.
The production base path is `/`.

## Prerendering and SEO

`npm run build` also builds `src/entry-server.tsx` as an SSR bundle and runs
`scripts/prerender.mjs`, which writes `dist/<route>/index.html` for every route
in `src/seo.ts` (`pageMeta`) with that page's title, description, canonical URL,
Open Graph tags, JSON-LD, and rendered body. It also writes `sitemap.xml`,
`robots.txt`, a `noindex` `404.html`, and meta-refresh pages for
`legacyRedirects`. The browser still mounts the app with `createRoot`.

- Add a new route to both `src/App.tsx` and `pageMeta`, or it will not be
  prerendered or listed in the sitemap.
- Code that runs during render must not touch `window` or `document` (do it in
  effects), because pages are rendered in Node at build time.
- The public domain is `siteUrl` in `src/seo.ts`; change it with
  `public/CNAME` when the site moves to christtamilchurch.com.
- SEO strategy, keyword targets, and verified church facts live in `seo/`.

## Stylesheet architecture

- `src/styles.css`: canonical tokens, reset, typography, shared foundations.
- `src/styles/layout.css`: navigation and footer.
- `src/pages/Home.css`: homepage-only hero, atmosphere, and teaser sections.
- `src/pages/<Page>.css`: route-owned inner-page styles.
- `src/components/**/**.module.css`: component-scoped visual systems.

The historical global CSS layers and the `josh-*` namespace have been removed.
The active namespace is `ctc-*`. The optional audit command is:

```powershell
node scripts/prune-global-css.mjs --all
```

Use `--write` only after reviewing the report, then rebuild and run visual
regression checks across every route and breakpoint.

## Shipping routes

| Route | Purpose |
| --- | --- |
| `/` | Visitor-first homepage |
| `/visit` | First visit, directions, mission, beliefs, and pastor |
| `/worship` | Sunday worship experience |
| `/grow` | Discipleship and ministry pathways |
| `/grow/bible-study-prayer` | Bible Study & Prayer |
| `/grow/sunday-school` | B.L.A.S.T. Sunday School |
| `/grow/kids-circle` | Kids Circle |
| `/serve` | Community outreach and service |
| `/sermons` | Searchable video sermon library |
| `/connect` | Fellowship and community life |
| `/events` | Current recurring gatherings |
| `/contact` | Phone, email, directions, prayer, and social links |

`src/App.tsx` also preserves redirects for former public URLs including About,
Faith, Pastors, Contact Us, Bible Study, Sunday School, Kids Circle, Audio
Sermons, Community Outreach, Fellowship Hour, and Annual Church Retreat.
Unknown paths render `NotFound`.

## Current design system

- Green leads; brass/bronze is restrained to labels and the primary CTA.
- Fraunces is the display face, Space Grotesk the body/UI face, and Catamaran
  the Tamil face.
- White, sage, and warm cream bands create page rhythm.
- Buttons are pills; one bronze primary action leads each view.
- Images are warm, human, registered, and supplied with appropriate alt text.
- Canonical layout breakpoints are `1120px`, `900px`, and `620px`.
- Inner pages use restrained reveal motion only.
- The homepage alone owns the light rail, canvas atmosphere, comet, cursor
  glow, and Follow the Light scrollytelling sequence.
- All motion must honor `prefers-reduced-motion`.

## Shared components and systems

- `Layout`: grouped responsive navigation, route shell, and footer.
- `SectionHeader`: eyebrow, heading, and optional supporting text.
- `FollowTheLight`: homepage-only pinned ministry-pathway narrative.
- `useRevealOnScroll`: intersection-based class toggling with optional child
  stagger and reduced-motion handling.

## Content rules

- Shared schedules, address, phone, email, and map destinations must come from
  `churchInfo`; pages must not introduce independent factual copies.
- Homepage content remains a concise front door. Full ministry, sermon, and
  event inventories belong on their routes.
- Events currently describe recurring cadence rather than dated instances.
- Sermon records must link to verified videos or playlists.
- Contact actions link to external phone, email, map, and social destinations;
  the site does not imply that it processes submissions.

## Validation standard

Before considering UI work complete:

1. Run `npm run build` for TypeScript and production bundling.
2. Exercise every route and preserved redirect.
3. Check desktop, tablet, 487px, and 380px layouts.
4. Verify navigation disclosure, keyboard focus, and touch targets.
5. Verify homepage motion plus `prefers-reduced-motion` flat behavior.
6. Check browser console and network errors.
7. Compare screenshots when changing shared or homepage CSS.
8. Confirm no undefined tokens, broken imports, or unregistered local images.

## Remaining operational work

- Leadership should continue verifying schedules, leadership biography, event
  dates, and contact details in the shared data files.
- Add linting or automated browser tests only as a separately approved tooling
  change; neither is currently part of the repository scripts.
- Keep each page design note in `docs/design-system/pages/` synchronized when
  its structure, responsive behavior, or content source changes.
