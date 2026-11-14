# Page design: Sunday School — B.L.A.S.T. (`/grow/sunday-school`)

## Shipping files

- Component: `src/pages/SundaySchool.tsx`
- Page-owned styles: `src/pages/SundaySchool.css`
- Shared section heading: `src/components/SectionHeader.tsx`
- Images: `src/data/images.ts`
- Worship schedule: `src/data/site.ts`
- Reveal behavior: `src/hooks/useRevealOnScroll.ts`

The page uses an isolated `ss-*` namespace and canonical tokens. It does not
depend on the former global `.page-hero`, `.section`, or `.button` recipes.

## Visitor journey

1. Tamil-first split hero with the B.L.A.S.T. promise, one bronze family-visit
   CTA, registered Sunday School image, and floating weekly details card.
2. Five editorial B.L.A.S.T. rows: Bible, Learning, And, Spiritual, Training.
3. Sage parent-trust band with registered children’s-ministry photography and
   three reassurance points.
4. Side-by-side explanation of Kids Circle versus structured Sunday School.
5. Cream Scripture band quoting Matthew 19:14.
6. Related family pathways followed by the live shared worship schedule.

## Responsive behavior

- `1120px`: hero becomes one column and the detail card moves inward.
- `900px`: parent, comparison, and Scripture bands become one column.
- `620px`: content gutters tighten, hero imagery becomes 450px tall, the
  detail card spans the image width, B.L.A.S.T. rows compact, and related rows
  retain all labels and actions.

## Motion and accessibility

The hero uses the local `ss-rise` entrance. B.L.A.S.T. and parent sections use
`useRevealOnScroll`; acronym rows stagger through `data-reveal-child`.
`prefers-reduced-motion` removes animations and transforms and shows all
content immediately. Sections use one page `h1`, labeled headings, semantic
lists/articles, registered alt text, Lucide icons, and accessible link targets.

## Content guardrails

- B.L.A.S.T. expands to Bible Learning And Spiritual Training.
- Kids Circle is a brief moment during worship; Sunday School occurs during
  the sermon and provides structured Bible formation.
- Schedule copy comes from shared church data rather than page-local times.
- New imagery must be registered in `src/data/images.ts`.
