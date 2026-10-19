# Competitor Matrix — Christ Tamil Church Chicago

_Generated 2026-10-06. Competitor facts come from public listings and websites, so recheck them every quarter._

## Target queries

| Priority | Query | Intent | Who ranks today (observed) |
| --- | --- | --- | --- |
| P0 | `chicago tamil church` / `tamil church chicago` | Navigational + local | **Chicago Tamil Church** (exact-match domains `chicagotamil.church`, `tamilchurchchicago.com`), Facebook pages, Sulekha |
| P0 | `tamil church near me` (Chicagoland) | Local pack | Decided by the Google Business Profile, not by the website |
| P1 | `indian church illinois` / `indian church chicago` | Commercial / local | Calvary Indian Church (Naperville), directory sites (thokalath, courtesyindia, garamchai) |
| P1 | `tamil church naperville` / `downers grove` / `<suburb>` | Local | Directories, Facebook |
| P2 | `tamil christian church chicago suburbs`, `south indian church chicago` | Local | Mixed |

## The competitors

| | **Christ Tamil Church (us)** | **Chicago Tamil Church** | **CSI Redeemer Tamil Church** | **Calvary Indian Church** |
| --- | --- | --- | --- | --- |
| Location | Downers Grove (DuPage, I-355/I-55) | Westchester (1840 Westchester Blvd); a listing also places it in Hickory Hills | Elmhurst (116 E Church St) | Naperville (inside Calvary Church) |
| Sunday time | **10:30 AM** | 12:30 PM, or 2:30 PM at Hickory Hills | — | 11:00 AM |
| Language | Tamil + English | Tamil | Tamil (CSI liturgy) | Mixed Indian languages, English message |
| Tradition | Bible-based, Protestant | Non-denominational | Church of South India | Evangelical (inside a megachurch) |
| Founded | **2015** | 1997 (states its history) | 2013 | — |
| Domain advantage | `christtamilchurch.com` (old site's history; `.us` retired) | **Exact-match domain for the P0 query** | Facebook only | Subpage of calvarynaperville.org (strong domain) |
| Kids ministry | Kids Circle + B.L.A.S.T. + VBS | Mentions youth | — | — |
| Weekday gatherings | Wed Bible study, Mon–Thu prayer, monthly fasting | — | — | — |
| Video archive | 160+ videos, 8 playlists | — | — | — |
| Abbreviation | CTC | **CTC (collision)** | — | — |

Other Indian-language churches compete for `indian church illinois`, but they are not Tamil: Bethel Prayer House (Telugu, Naperville), Cornerstone New Covenant (Telugu/Hindi/Tamil), Telugu Church of Naperville, and St. Thomas Orthodox and Syro-Malabar parishes (Malayalam).

_Update 2026-10-16: `tamilchurchchicago.com` now redirects to an unrelated gambling site, so Chicago Tamil Church's only website is chicagotamil.church._

Sources: [chicagotamil.church](https://chicagotamil.church/), [tamilchurchchicago.com](https://www.tamilchurchchicago.com/), [Sulekha – CSI Redeemer](https://us.sulekha.com/elmhurst-il/religious-service/csi-redeemer-chicago-tamil-church-1176224), [Calvary Indian Church](https://calvarynaperville.org/indian), [psalmlog – Christ Tamil Church](https://psalmlog.com/churches/illinois/downers-grove/christ-tamil-church-chicago-downers-grove-t1OTYCPU), [thokalath Illinois directory](https://www.thokalath.com/indian-churches-usa/illinois.php).

## The honest picture for "chicago tamil church"

Another congregation is literally named **Chicago Tamil Church** and owns the exact-match domains. Google reads "chicago tamil church" partly as a search for that church by name. That means:

- Ranking **#1 organically for that exact phrase every time is not something any SEO work can guarantee.** Google may keep showing the church with the matching name for navigational searches.
- What we *can* win: the **local pack (map results)** for "tamil church chicago" / "tamil church near me" from the western suburbs, **#1 for "tamil church chicago"** and every suburb variant, **#1 for "indian church" + DuPage towns**, and a strong second result plus the knowledge panel for the exact phrase.
- Never use "Chicago Tamil Church" as our name or try to confuse the two churches. It harms visitors and risks trademark and spam penalties. Use the phrase *Tamil church in Chicago* in natural language instead.

## Differentiation angles (use these in content)

1. **Morning service with English included.** Our 10:30 AM bilingual service fits families who don't want a 12:30 or 2:30 start, and it suits spouses and kids who prefer English.
2. **The best children's program among Tamil churches.** Kids Circle, B.L.A.S.T. Sunday School and VBS, with 40 kids' and VBS videos as proof.
3. **A church you can join every week, not just on Sunday.** Friday Bible study, Mon–Thu prayer and monthly fasting prayer.
4. **Raising the next generation in Tamil faith and culture.** This is stated in the mission, and no competitor says it this clearly.
5. **You can see us before you visit.** 160+ videos let a newcomer watch a real service first.
6. **DuPage location.** Closer than Westchester or Hickory Hills for Naperville, Lisle, Woodridge, Bolingbrook, Aurora and Wheaton.

## Technical issues (blockers ahead of any content)

| ID | Issue | Impact | Fix |
| --- | --- | --- | --- |
| **T1** | Two live domains (`.com` old site, `.us` new site) | Ranking signals split; duplicate content; conflicting service times | **Done 2026-10-10:** the new build serves at christtamilchurch.com with legacy-URL redirects. Remaining: `.us` forwarding drops paths (deep links 404) and `www.christtamilchurch.us` still points at GitHub Pages with no site behind it. See `seo-audit-2026-10.md`. |
| **T2** | Deep links served through the GitHub Pages `404.html` trick | Google receives **HTTP 404** for `/visit`, `/worship`, etc., so inner pages are probably not indexed | Prerender every route to `dist/<route>/index.html` at build time |
| **T3** | Client-only rendering + JS-injected titles | Crawlers and AI tools see one generic title and an empty body | Same fix as T2 (static HTML per route, with title, description and canonical baked in) |
| **T4** | No structured data | No rich results, weak entity signals for AI overviews | `Church` JSON-LD (NAP, geo, `openingHoursSpecification`/`Event` for services, `sameAs`), plus `FAQPage`, `Event`, `VideoObject` and `BreadcrumbList` |
| **T5** | No sitemap.xml or robots.txt | Slower discovery | Generate both at build time |
| **T6** | Inconsistent NAP across the web (time, phone) | Hurts local-pack ranking | Fix Google Business Profile, Facebook, Sulekha, psalmlog and Yelp to match `site.ts` exactly |
| **T7** | No Open Graph tags | Weak WhatsApp/Facebook sharing, which is how Tamil families spread the word | Per-route `og:` tags plus an image |

## Off-site levers (as important as the website for local queries)

- **Google Business Profile.** Claim or verify it. Primary category "Church", secondary "Christian church" and "Protestant church". Description should include "Tamil and English"; add Sunday hours, 20+ real photos, and weekly posts. **Ask members for honest Google reviews.** Review count and recency are strong local-pack factors, but never script the wording or offer anything in return (both break Google review policy).
- **Citations.** Add the church to thokalath.com, courtesyindia.com, garamchai.com, Sulekha, Apple Maps, Bing Places, churchfinder.com and Yelp, all with identical details.
- **Community links.** Chicago Tamil Sangam, Illinois Tamil associations, university Indian student associations (UIC, IIT, NIU, Northwestern), and nearby Indian grocery bulletin boards.
- **YouTube.** Put "Tamil Church Chicago" and the website URL in the channel description and every video description.
