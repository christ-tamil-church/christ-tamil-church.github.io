# Page design: Clay Pot — மண்பாண்டம் (`/grow/clay-pot` and `/grow/clay-pot/<slug>`)

## Shipping files

- Index: `src/pages/ClayPot.tsx` (also exports `IssueNumber`, `LanguagePill`,
  and the shared `ClayPotClosing` band)
- Writing page: `src/pages/ClayPotArticle.tsx`
- Page-owned styles for both: `src/pages/ClayPot.css` (`cp-*` namespace)
- Writings: `src/data/clayPot.ts`. To publish a new one, add an entry at the
  top. Its route, metadata, prerendered page, sitemap entry, and issue number
  follow automatically.
- Routes and metadata are generated in `src/App.tsx` and `src/seo.ts`. The old
  WordPress URLs (`/clay-pot/...`) redirect through `legacyRedirects`.

## Concept

The church's writings column is set as a small monthly. A cream nameplate band
carries மண்பாண்டம் at display scale in Noto Serif Tamil, with a masthead double
rule (3px over 1px in `--primary`) and mono datelines. The newest writing is the
lead feature. Every writing carries a Fraunces issue number ("No. 03") in
`--clay-dark`. The name comes from 2 Corinthians 4:7 (Tamil O.V., copied from
tamilbiblesearch.com), quoted in the "Why Clay Pot?" panel.

## Visitor journey

1. Index: nameplate (h1), then the lead letter with its own opening lines and the
   one bronze CTA, beside the sage "Why Clay Pot?" panel (registered Tamil Bible
   photo + verse).
2. Sage "Every issue" contents list, newest first: issue number, title in its own
   language, author, date, and a language pill.
3. Writing page: cream masthead strip that links back, an issue opener (h1,
   byline, language pill), a 44rem reading column (Fraunces 300 for English with
   a drop cap, Noto Serif Tamil for Tamil), an author sign-off, numbered notes
   with back-links, and earlier/later issue navigation.
4. Both end on the cream closing band: Contact (bronze), phone, email, and
   Sunday 10:30 AM with the address.

Text is kept exactly as written. Tamil writings are not translated or
summarised; the language pill (with "Written in Tamil" for screen readers)
tells English readers what to expect.

## Responsive behavior

- `1120px`: the lead becomes one column; the about panel sits photo-left,
  copy-right.
- `900px`: the nameplate stacks; contents rows move the meta under the title.
- `620px`: gutters tighten, contents rows stack (issue, title, meta), the
  byline wraps without its dash, and issue navigation stacks.

## Motion and accessibility

The nameplate rules draw in (`cpRuleDraw`) and the name and standfirst rise in
(`cpRise`). That is the page's one entrance moment. Contents rows stagger
through `useRevealOnScroll`. `prefers-reduced-motion` removes all of it. Tamil
is marked with `lang="ta"` throughout. Small labels use `--primary`, not gold,
to meet 4.5:1.
