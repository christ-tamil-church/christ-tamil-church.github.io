# Keyword & Content Pillar Map

_Generated 2026-10-06. Facts must come from `feature-registry.json`; our distinctives come from `search-landscape.md`._

## Primary goal

Be the first result for **Tamil church Chicago**, **Indian church Illinois**, and *Tamil / Indian church + Chicago-suburb* searches. Win both the organic results and the Google map pack.

## Ground rules

- **R1. One primary keyword per URL.** Never let two pages target the same term.
- **R2. Facts from the registry only.** No invented ministries, times or statistics. Mark anything unverified and ask leadership.
- **R3. Answer first.** Every page opens with a 40–60 word direct answer (who, what, when, where) so AI overviews and featured snippets can quote it.
- **R4. No doorway pages.** Do not create 20 near-identical "Tamil church in [town]" pages. Build one strong area hub with genuinely useful drive-time and directions content per region, as shown below.
- **R5. Bilingual signals.** Use the Tamil terms naturally (தமிழ் சபை, தமிழ் கிறிஸ்தவ ஆலயம், ஆராதனை) in headings and body text. Tamil-script searches have almost no competition.
- **R6. Follow the design template.** New pages follow the inner-page blueprint in `docs/design-system/ctc-design-template.md`.

## Hub-and-spoke architecture

```
                                 HOME  /
               "Tamil church in Chicago — Christ Tamil Church, Downers Grove"
                                    │
   ┌──────────────┬─────────────────┼──────────────────┬────────────────────┐
 PILLAR 1       PILLAR 2          PILLAR 3            PILLAR 4             PILLAR 5
 Visit          Tamil Christians  Families & Kids     Grow (weekday)       Watch
 /visit         in Chicagoland    /grow/sunday-school /grow/bible-study-   /sermons
 /worship       /tamil-church-    /grow/kids-circle   prayer
 /contact       chicago (NEW)                         /events
```

### Pillar 1 — Visit (money pages: plan a visit, get directions)

| URL | Primary keyword | Secondary | Title tag (≤60 chars) |
| --- | --- | --- | --- |
| `/` | tamil church chicago | tamil church in chicago, tamil christian church chicago | Christ Tamil Church – Tamil Church in Chicago (Downers Grove) |
| `/visit` | tamil church near me | first visit tamil church, what to expect | Plan Your Visit – Tamil & English Church, Downers Grove IL |
| `/worship` | tamil worship service chicago | tamil english church service, sunday service 10:30 | Sunday Tamil & English Worship, 10:30 AM – Christ Tamil Church |
| `/contact` | christ tamil church downers grove | directions, phone | Contact & Directions – Christ Tamil Church, Downers Grove |

### Pillar 2 — Tamil and Indian Christians in Chicagoland (NEW hub, the main ranking page)

| URL | Primary keyword | Purpose |
| --- | --- | --- |
| **`/tamil-church-chicago`** (hub) | tamil church in chicago | Long-form guide: who we are, why a Tamil church, service times, drive times from Chicago and each suburb, map, FAQ. This is the page that should rank for the P0 terms. |
| `/indian-church-illinois` | indian church illinois / chicago | For South Indian (Tamil, Telugu, Malayali) and Indian-American families looking for a Bible-based church with English. Links back to the hub. |
| `/tamil-church-chicago/western-suburbs` | tamil church naperville / lisle / woodridge / wheaton / aurora / bolingbrook | One page covering DuPage and Will County towns, with a drive-time table and parking. |
| `/tamil-church-chicago/near-downtown` | tamil church near chicago loop / northwest suburbs | Commute routes from the city, Schaumburg and Oak Brook (I-290/I-88/I-355). |
| `/new-to-chicago` | new to chicago tamil family / tamil students chicago | For newcomers and students: housing areas, Tamil groceries, how the church helps. Strong E-E-A-T, very easy to share. |

### Pillar 3 — Families and kids

| URL | Primary keyword |
| --- | --- |
| `/grow/sunday-school` | tamil church sunday school chicago |
| `/grow/kids-circle` | church for kids tamil family chicago |
| `/events#vbs` → later `/vbs` | vacation bible school downers grove / tamil vbs chicago |
| `/youth` (when confirmed) | tamil christian youth chicago |

### Pillar 4 — Grow in the week

| URL | Primary keyword |
| --- | --- |
| `/grow/bible-study-prayer` | tamil bible study chicago |
| `/events` | tamil christian events chicago, tamil christmas program chicago, family camp |
| `/serve` | church community outreach downers grove |

### Pillar 5 — Watch (AI citations + Tamil long-tail)

| URL | Primary keyword |
| --- | --- |
| `/sermons` | tamil sermons online / tamil christian messages |
| `/sermons/<slug>` (future) | One page per sermon with a transcript summary and `VideoObject` schema. Target Tamil-script titles. |

## Blog / Clay Pot spokes (optional, start after the technical fixes)

The old site had a "Clay Pot" blog. Revive it only if someone can publish 1–2 posts a month. Good topics that link back to hubs:

1. What to expect at a Tamil church service in Chicago (→ /visit)
2. Tamil churches in Chicagoland: how to choose one for your family (→ hub). Write it generously: describe what to look for, never name or rank other churches.
3. Raising bilingual Tamil Christian kids in America (→ /grow/sunday-school)
4. Tamil Christmas carol rounds: a Chicago tradition (→ /events)
5. Moving to Chicago from Chennai, Bangalore, Singapore or Sri Lanka: a faith-family checklist (→ /new-to-chicago)

## Required on every page

- A unique `<title>`, meta description, canonical URL and `og:` tags, all in the static HTML.
- One H1 containing the primary keyword, then a logical H2/H3 hierarchy.
- An answer-first opening paragraph that states **Sunday 10:30 AM · 1330 63rd St, Downers Grove**.
- Alt text that describes the scene and includes the place, e.g. "Children singing at Christ Tamil Church VBS in Downers Grove". No keyword stuffing.
- An FAQ section of 3–6 questions with `FAQPage` JSON-LD. Seed questions:
  - Is the service in Tamil or English? → Both.
  - Do I need to speak Tamil to attend? → No.
  - Is there a program for my kids? → Kids Circle + B.L.A.S.T.
  - Where do I park? (leadership to confirm)
  - How far is it from Naperville / Chicago? → drive-time table
  - Can I watch online? → YouTube
- Internal links: every spoke links to its hub, and to **/visit** (the primary CTA) and **/worship**. The hub links to all spokes. Use descriptive anchor text such as "Tamil and English Sunday worship", never "click here".
- Site-wide `Church` JSON-LD in the layout.

## Measurement

- Google Search Console: verify the canonical domain and submit the sitemap. Track impressions and position for each P0/P1 query every month.
- Google Business Profile insights: calls, direction requests, searches for "tamil church".
- Goal for the first 90 days after the technical fixes: inner pages indexed, local pack for "tamil church near me" within DuPage, top 3 for "tamil church chicago".
