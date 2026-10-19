# SEO Audit & Plan — christtamilchurch.com

_Audited 2026-10-16. Canonical domain: **https://christtamilchurch.com** (no `www`). `christtamilchurch.us` is retired and must never appear as the site's address._

Related: [competitor-matrix.md](competitor-matrix.md) · [content-pillars.md](content-pillars.md) · [feature-registry.json](feature-registry.json)

**Target queries:** Chicago Tamil Church · Tamil Church Chicago · Tamil churches in Chicago · Tamil Christian Church Chicago · Tamil worship Chicago · Tamil church near me

---

## 1. Summary

The technical base is already strong. Every page is prerendered to static HTML with its own title, description, canonical URL, Open Graph tags and JSON-LD. The `.com` domain serves the new build, and `www`, `http` and the github.io address all 301 to `https://christtamilchurch.com/`. Old WordPress URLs redirect to their new pages.

What holds rankings back is mostly **off-site and content**, not code:

1. **Google Business Profile.** The church account manages only a duplicate Wheaton listing, and nobody on the team has access to the real Downers Grove listing. For "Tamil church near me" and the map pack, this matters more than anything on the website.
2. **The name collision.** Another congregation is literally called *Chicago Tamil Church* (chicagotamil.church, Westchester). Google treats "chicago tamil church" partly as a search for that church by name, so **#1 for that exact phrase can't be promised**. The other five queries are winnable.
3. **Thin location content.** The homepage has about 350 words, and until this change its H1 was only the weekly Tamil headline. No page yet answers "Tamil churches in Chicago" in depth.
4. **`.us` loose ends.** Deep links on `.us` return 404, and `www.christtamilchurch.us` points at GitHub Pages with no site behind it, which is a domain-takeover risk.

---

## 2. Verified findings

Status key: ✅ verified working · ⚠️ verified problem · 🔧 fixed in this change · ❓ needs access I don't have

### 2.1 Domain, redirects, canonical

| Check | Result | Status |
|---|---|---|
| `https://christtamilchurch.com/` | 200 | ✅ |
| `http://christtamilchurch.com/` | 301 → `https://christtamilchurch.com/` | ✅ |
| `https://www.christtamilchurch.com/` and `http://www.…` | 301 → `https://christtamilchurch.com/` (1 hop) | ✅ |
| `https://christ-tamil-church.github.io/` | 301 → `https://christtamilchurch.com/` | ✅ |
| `/visit` (no slash) | 301 → `/visit/` | ✅ |
| Unknown path `/nope/` | real HTTP 404, `noindex` | ✅ |
| Old WordPress URLs (`/about/`, `/mission/`, `/contact-us/`, `/clay-pot/…`; 21 in all) | instant redirect + canonical to the new page | ✅ |
| Canonical, `og:url`, sitemap, robots, JSON-LD | all `https://christtamilchurch.com/…`; no `.us` anywhere in code | ✅ |
| `christtamilchurch.us/` (apex root) | 301 → `http://www.christtamilchurch.com` (GoDaddy forwarding), then → https apex. Works, but takes 3 hops | ⚠️ minor |
| `christtamilchurch.us/visit/` (any deep path) | **404** from GoDaddy's forwarder (`awselb`); the path is not passed on | ⚠️ |
| `www.christtamilchurch.us` | CNAME → GitHub Pages, **"Site not found"** (dangling record) | ⚠️ security + SEO |
| `old.christtamilchurch.com` | 302 → `www.christtamilchurch.com` → new site; WordPress content is not publicly duplicated. HTTPS on `old.` has a certificate name mismatch (not an SEO issue, since nothing links there) | ✅ |
| WordPress conflict | WordPress is still on GoDaddy (107.180.4.82) but no public hostname serves it; reachable only through the hosts-file override | ✅ |

### 2.2 On-page (all 17 indexable pages, from the built HTML)

| Check | Result |
|---|---|
| Unique `<title>` per page | ✅ 51–66 characters, each leads with its topic and ends with the church name |
| Meta descriptions | ✅ 120–155 characters (🔧 `/worship` was 166 and is now trimmed) |
| Exactly one H1 per page | ✅ |
| Homepage H1 | ⚠️ was only this week's Tamil headline, with no English "who/where" → 🔧 now begins with "Tamil Church in Chicago" |
| Image alt text | ✅ every `<img>` has `alt`; the empty ones are decorative or video thumbnails next to a visible title |
| Content rendered without JavaScript | ✅ prerendered body HTML on every route |
| `lang` attributes | ✅ `lang="en"` page, `lang="ta"` on Tamil runs |
| Word count | ⚠️ Home ~350, Contact ~210: thin for competitive local queries |

### 2.3 Structured data

| Check | Result |
|---|---|
| JSON-LD parses on every page | ✅ |
| Church entity | 🔧 now typed `["Church", "Organization"]`. As plain `Church` (a *Place* in schema.org), `email`, `foundingDate`, `knowsLanguage` and `areaServed` weren't valid properties |
| schema.org validator (validator.schema.org), `/` and `/sermons/` | ✅ 0 errors, 0 warnings after the change |
| WebSite, BreadcrumbList (inner pages), VideoObject (`/sermons`), AudioObject list (audio archive) | ✅ present |
| `geo` coordinates | ❓ left out: I couldn't verify coordinates, and Google takes the map pin from the Business Profile anyway |
| FAQPage | Not added. Since 2023 Google shows FAQ rich results only for government and health sites, so it would be markup with no visible payoff |

### 2.4 Sitemap and robots

| Check | Result |
|---|---|
| `robots.txt` | ✅ `Allow: /` + `Sitemap: https://christtamilchurch.com/sitemap.xml` |
| `sitemap.xml` | ✅ 17 URLs, all canonical `.com` with trailing slash, matching the canonical tags |
| `<lastmod>` | ⚠️ every URL got the build date, so Google learns to ignore it → 🔧 removed |
| Search Console | ✅ property verified, sitemap status "Success" (2026-10-12, per project notes) |

### 2.5 Mobile and layout

Hero checked at 1440×900, 1024×768, 768×1024, 390×844, 360×640 and 375×560 (iPhone SE with toolbars): no horizontal scroll, and the hero (including the verse) fits one screen at every size.

### 2.6 Not verified (needs access or tools I don't have)

- Live Google rankings and the local pack for each query: results vary by searcher location, and I can't see Google's results page directly.
- Core Web Vitals field data (Search Console → Experience, or PageSpeed Insights).
- Search Console coverage: which pages are indexed, and whether any `.us` URLs are still indexed.
- The real Downers Grove Google Business Profile: categories, hours, reviews, photos.
- Whether `christtamilchurch.com` is a *verified domain* in the GitHub organization's settings.

---

## 3. Competitor analysis

| | **Christ Tamil Church (us)** | **Chicago Tamil Church** | CSI Redeemer Tamil Church | Calvary Indian Church |
|---|---|---|---|---|
| Website | christtamilchurch.com: prerendered, full metadata, Church schema, 17 pages | chicagotamil.church: WordPress, title just "Chicago Tamil Church", **no meta description, no structured data** | Facebook only | Subpage of calvarynaperville.org |
| Exact-match name for "Chicago Tamil Church" | No | **Yes** (brand) | No | No |
| Location / Sunday | Downers Grove, **10:30 AM**, Tamil + English | Westchester, 12:30 PM | Elmhurst | Naperville, 11:00 AM |
| Third-party listings seen | YouTube, Facebook, psalmlog, bibletimes.app | Facebook, YouTube | Sulekha | — |

**Changed since 2026-10-06:** `tamilchurchchicago.com` now redirects to an unrelated gambling site, so the other congregation's only exact-match domain left is chicagotamil.church.

**What this means:**

- **Our technical SEO is clearly better** than any Tamil church in the area. The competitor's advantage is its name, and links built up since 1997.
- **"Chicago Tamil Church"** will stay partly navigational for the other church. A realistic target is a strong #2 organic result plus our knowledge panel, not reliably #1. Never use "Chicago Tamil Church" as our name or in a way that could confuse the two churches.
- **"Tamil church Chicago", "Tamil churches in Chicago", "Tamil Christian church Chicago", "Tamil worship Chicago"** are winnable for #1 organic: no competitor has a page built for them.
- **"Tamil church near me"** is decided almost entirely by the Google Business Profile: distance, the right category, reviews, and activity.

---

## 4. Changes made in this commit

| File | Change |
|---|---|
| `src/data/site.ts`, `src/pages/Home.tsx`, `src/pages/Home.css` | Homepage H1 now opens with a small bronze eyebrow, **"Tamil Church in Chicago"**, inside the H1. It's the hero kicker the design template already describes; it uses `--clay-dark` for AA contrast. The weekly Tamil headline is unchanged |
| `src/seo.ts` | Church entity typed `["Church", "Organization"]`; `/worship` description trimmed to 155 characters; domain comment updated |
| `scripts/prerender.mjs` | Removed the build-date `<lastmod>` from the sitemap |
| `tests/unit/*.ts(x)` | Updated for the new H1 text and the dual schema type |
| `docs/…`, `seo/…` | Removed out-of-date "move to .com later" notes; recorded the kicker in the design template |

Validation: `npm run build` ✅ · `npm test` 302/302 ✅ · `npm run test:types` ✅ · schema.org validator 0 errors ✅ · screenshots at 6 viewports ✅.

---

## 5. Prioritized improvement plan

| # | Priority | Action | Who | Effect |
|---|---|---|---|---|
| 1 | **P0** | Get owner/manager access to the **real Downers Grove Google Business Profile** (probably through Israel Rajkumar). Then report the Wheaton duplicate as a duplicate | Leadership | Map pack, "near me" |
| 2 | **P0** | Fix `www.christtamilchurch.us`: delete the dangling CNAME to GitHub, or forward it like the apex | DNS (GoDaddy) | Security, crawl hygiene |
| 3 | **P0** | Verify `christtamilchurch.com` (and `.us`, while it exists) under GitHub org → Settings → Pages → Verified domains | GitHub org owner | Blocks domain takeover |
| 4 | P1 | Make `.us` forward deep paths (see §7.3), or confirm in Search Console that no `.us` URLs are indexed and leave root-only forwarding | DNS | Passes any `.us` link value |
| 5 | P1 | Build a **"Tamil Church in Chicago" hub page** (`/tamil-church-chicago`, already planned in content-pillars.md): who we are, why a Tamil and English church, Sunday details, drive times from Chicago and the western suburbs, a map, and real Q&A. Link to it from the homepage and footer | Code + leadership review of facts | The main page for "Tamil churches in Chicago" |
| 6 | P1 | Make NAP identical everywhere: Facebook, YouTube About, psalmlog, bibletimes.app, Sulekha, Yelp, Apple, Bing. Name "Christ Tamil Church Chicago", 1330 63rd St, Downers Grove, IL 60516, (773) 936-3097, Sunday 10:30 AM, https://christtamilchurch.com/ | Volunteer | Local ranking |
| 7 | P2 | Expand the Contact page (~210 words): parking, entrance, accessibility, what time to arrive. Facts from leadership only | Code | Local relevance |
| 8 | P2 | Ask members for **honest** Google reviews (a QR card in the bulletin). Don't script the wording or offer anything in return; Google's review policy forbids both | Leadership | Map pack |
| 9 | P2 | Weekly Google Business Profile posts (this Sunday's sermon or event) plus real photos | Media team | Freshness, engagement |
| 10 | P3 | Regular Clay Pot writing (1–2 posts/month) on useful topics, e.g. "What to expect at a Tamil church service in Chicago" | Writers | Long-tail, links |

---

## 6. 30 / 60 / 90 days

**Days 1–30 (by 2026-11-15)**
- Deploy this change; in Search Console, request indexing for `/`.
- Fix the `www.christtamilchurch.us` record; verify domains in GitHub.
- Get access to the real Business Profile and complete it (§7.2). Report the Wheaton duplicate.
- Update NAP on Facebook, YouTube, psalmlog, bibletimes.app.
- Early November: check Search Console → Videos for `/sermons` (see project notes).
- Record a baseline: Search Console → Performance, filter queries containing "tamil", note impressions and average position.

**Days 31–60**
- Build and publish the `/tamil-church-chicago` hub page (one page per commit, following the design template).
- Submit to Bing Places, Apple Business Connect and Yelp; claim the existing listings on psalmlog and bibletimes.app.
- Start the reviews drive and weekly Business Profile posts.
- Ask Chicago-area Tamil community organizations that keep community-resource pages to list the church (§7.4).

**Days 61–90**
- Expand the Contact page; add one or two Clay Pot posts.
- Compare Search Console queries against the baseline. Pages showing for "tamil church chicago" at position 4–10 need more content and internal links.
- Recheck the competitor matrix (quarterly).

Realistic outcome by day 90 (not a guarantee): top 3 for "tamil church chicago" and "tamil christian church chicago"; in the map pack for "tamil church near me" in DuPage County; strong #2 for "chicago tamil church".

---

## 7. Manual action checklist

### 7.1 Google Search Console
- [ ] Property `https://christtamilchurch.com` (or the domain property `christtamilchurch.com`): **Sitemaps** → enter `sitemap.xml` → Submit. It's already submitted; resubmit after this deploy so Google re-reads it.
- [ ] **URL Inspection** → `https://christtamilchurch.com/` → *Request indexing*.
- [ ] **Pages** report: confirm the 17 sitemap URLs are indexed; look into any "Discovered – not indexed".
- [ ] If a `.us` property exists: check whether any `.us` URLs are still indexed. If so, use the **Change of Address** tool from the `.us` property to `.com` (it requires the `.us` root to 301 to `.com`, which it does).
- [ ] **Performance**: save a filter for queries containing `tamil`.

### 7.2 Google Business Profile (the real Downers Grove listing)
- [ ] Get owner/manager access; never edit or verify the Wheaton duplicate.
- [ ] Name exactly **Christ Tamil Church Chicago**. Don't add keywords to the name; Google suspends listings for that.
- [ ] Primary category **Church**; add more if offered (e.g. Christian church, Protestant church).
- [ ] Website `https://christtamilchurch.com/`, phone (773) 936-3097, Sunday hours 10:30 AM.
- [ ] Description: a Tamil and English church in Downers Grove serving Chicagoland since 2015; kids' ministry; weekly Bible study and prayer.
- [ ] 20+ real photos (exterior, entrance, worship, kids, fellowship).
- [ ] Report the Wheaton listing as a duplicate once you manage the real one.

### 7.3 DNS / hosting (GoDaddy, GitHub)
- [ ] `www.christtamilchurch.us`: delete the CNAME → github.io, or forward it to `https://christtamilchurch.com`.
- [ ] Change the `.us` forwarding target from `http://www.christtamilchurch.com` to **`https://christtamilchurch.com`** (one hop instead of three).
- [ ] Path-preserving `.us` redirects, if Search Console shows `.us` deep URLs indexed: GoDaddy's forwarding returns 404 for deep paths. Options: (a) a small redirect-only GitHub Pages site on the old `anand-adalarasan/ctc` repo for `.us` that sends every path to the same path on `.com`; (b) move `.us` DNS to Cloudflare (free) and use a Redirect Rule that keeps the path, giving true 301s. Only worth doing if `.us` URLs are indexed or linked.
- [ ] GitHub org → Settings → Pages → **Verified domains**: add `christtamilchurch.com`.
- [ ] (Already planned) Raise the apex and `www` TTL back to 1 hour.

### 7.4 Directories and legitimate links
Use identical NAP on all of them. Claim existing listings before creating new ones.
- [ ] Bing Places (import from Google), Apple Business Connect, Yelp
- [ ] Facebook page: About → website and hours; YouTube About (already has the website)
- [ ] psalmlog.com and bibletimes.app (both already list the church; claim them and fix any details)
- [ ] Sulekha (Chicago), thokalath.com Illinois Indian churches list
- [ ] Chicago-area Tamil organizations (e.g. Chicago Tamil Sangam), if they keep a community-resources page; ask, don't pay
- [ ] Downers Grove community or chamber directories that list places of worship
- Avoid paid link schemes, link exchanges, and bulk directory submission services.

---

## 8. Validation report

| Test | Method | Result |
|---|---|---|
| Domain variants and redirects | `curl` against 15 URL variants (http/https, www/apex, .com/.us, github.io, legacy paths) | §2.1 |
| Canonical = sitemap URL on every page | Script over built `dist/` | 17/17 match |
| Titles, descriptions, H1 count, alt attributes | Same script | §2.2 |
| No `.us` in the app | `grep` over `src/`, `public/`, `scripts/`, `index.html` | none |
| JSON-LD syntax | `JSON.parse` on every page | 17/17 |
| JSON-LD semantics | validator.schema.org (`/`, `/sermons/`) | 0 errors, 0 warnings |
| Existing behaviour | `npm test` (302 tests), `npm run test:types`, `npm run build` | all pass |
| Responsive hero | Headless Chromium at 6 viewports; measured overflow and hero fit | no overflow; fits one screen |

**Still unverified:** live Google rankings and local pack, Core Web Vitals field data, Search Console coverage, Business Profile contents, and Google's Rich Results Test on the deployed page (run it at https://search.google.com/test/rich-results after deploying).
