# Search Landscape — Christ Tamil Church Chicago

_Generated 2026-10-06, revised 2026-11-14. Recheck search results every quarter._

We describe our own church here and nobody else's. Every Tamil congregation in Chicagoland is a sister church; we never compare ourselves to them by name.

## Target queries

| Priority | Query | Intent | Notes |
| --- | --- | --- | --- |
| P0 | `tamil church chicago` / `tamil church in chicago` | Local | Win with the homepage and the `/tamil-church-chicago` hub |
| P0 | `tamil church near me` (Chicagoland) | Local pack | Decided by the Google Business Profile, not by the website |
| P1 | `indian church illinois` / `indian church chicago` | Local | `/indian-church-illinois` |
| P1 | `tamil church naperville` / `downers grove` / `<suburb>` | Local | Western-suburbs area page |
| P2 | `tamil christian church chicago suburbs`, `south indian church chicago` | Local | Hub + FAQ |

## Our name

- Always use the full name **Christ Tamil Church**, paired with **Downers Grove** in titles, schema and listings. Avoid the bare "CTC" in public, since other churches share the abbreviation.
- Never use another congregation's name as a keyword, in ads, or in page copy.

## What makes us distinctive (use these in content)

1. **Morning service with English included.** 10:30 AM bilingual worship suits families with kids and spouses who prefer English.
2. **A strong children's program.** Kids Circle, B.L.A.S.T. Sunday School and VBS, with 40 kids' and VBS videos.
3. **A church you can join every week, not just on Sunday.** Friday Bible study, Mon–Thu prayer and monthly fasting prayer.
4. **Raising the next generation in Tamil faith and culture.** It is stated in our mission.
5. **You can see us before you visit.** 160+ videos let a newcomer watch a real service first.
6. **DuPage location.** Easy to reach from Naperville, Lisle, Woodridge, Bolingbrook, Aurora and Wheaton.

## Technical issues (blockers ahead of any content)

| ID | Issue | Impact | Fix |
| --- | --- | --- | --- |
| **T1** | Two live domains (`.com` old site, `.us` new site) | Ranking signals split; duplicate content; conflicting service times | **Decided: christtamilchurch.com.** When the new build moves there, update `public/CNAME`, keep the old-URL redirects in `App.tsx`, and 301 `.us` → `.com`. Until then, do not point canonical URLs at `.com` (it still serves the old site). |
| **T2** | Deep links served through the GitHub Pages `404.html` trick | Google receives **HTTP 404** for `/visit`, `/worship`, etc., so inner pages are probably not indexed | Prerender every route to `dist/<route>/index.html` at build time |
| **T3** | Client-only rendering + JS-injected titles | Crawlers and AI tools see one generic title and an empty body | Same fix as T2 (static HTML per route, with title, description and canonical baked in) |
| **T4** | No structured data | No rich results, weak entity signals for AI overviews | `Church` JSON-LD (NAP, geo, `openingHoursSpecification`/`Event` for services, `sameAs`), plus `FAQPage`, `Event`, `VideoObject` and `BreadcrumbList` |
| **T5** | No sitemap.xml or robots.txt | Slower discovery | Generate both at build time |
| **T6** | Inconsistent NAP across the web (time, phone) | Hurts local-pack ranking | Fix Google Business Profile, Facebook, Sulekha, psalmlog and Yelp to match `site.ts` exactly |
| **T7** | No Open Graph tags | Weak WhatsApp/Facebook sharing, which is how Tamil families spread the word | Per-route `og:` tags plus an image |

## Off-site levers (as important as the website for local queries)

- **Google Business Profile.** Claim or verify it. Primary category "Church", secondary "Christian church" and "Protestant church". Description should include "Tamil and English"; add Sunday hours, 20+ real photos, and weekly posts. Invite members to leave honest Google reviews.
- **Citations.** List the church on thokalath.com, courtesyindia.com, garamchai.com, Sulekha, Apple Maps, Bing Places, churchfinder.com and Yelp, all with identical details.
- **Community links.** Chicago Tamil Sangam, Illinois Tamil associations, university Indian student associations (UIC, IIT, NIU, Northwestern), and nearby Indian grocery bulletin boards.
- **YouTube.** Put "Christ Tamil Church, Downers Grove" and the website URL in the channel description and every video description.
