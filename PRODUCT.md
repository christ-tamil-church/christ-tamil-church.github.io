# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Four audiences, all of whom the site must serve well:

- **Tamil families new to Chicago.** Often relocating for work or study, they are looking for a Tamil-speaking church home in the Chicago suburbs and want to know if they will belong before they visit.
- **Second-generation / English-first youth.** Kids, teens and young adults who grew up here and are more comfortable in English. They need to see that worship, teaching and community are for them too.
- **Current members.** They return for schedules, events, sermons, the verse of the week and contact details.
- **Non-Tamil neighbors.** Local people of any background who are curious about the church or its outreach. Nothing should assume Tamil fluency to understand the basics.

## Product Purpose

The public website of Christ Tamil Church, a Tamil and English Christian church family in Downers Grove, IL, serving Chicago and the western suburbs since 2015.

**Primary success: a visitor gets in touch.** Most people call, email or message before their first visit. Contact routes (phone, email, Contact page, "Ask about joining" style links) must be easy to find from every page. Knowing the Sunday time and location is the step right before that, so it stays prominent everywhere.

Secondary outcomes: attending Sunday worship, joining a ministry (Bible study, Sunday School, Kids Circle, fellowship, outreach), and watching sermons online.

## Positioning

A bilingual Tamil and English congregation: Tamil identity named with pride, and a welcome extended equally to English-first and non-Tamil visitors. It is a family church across generations, from the B.L.A.S.T. Sunday School and Kids Circle to youth, men's and women's fellowships and the yearly family camp.

## Operating Context

- **Sunday worship:** 10:30 AM at 1330 63rd St, Downers Grove, IL 60516. Tamil and English songs, testimony, prayer, sermon, Holy Communion on first Sundays, then fellowship in the hall.
- **Weekly and seasonal rhythm:**
  - Friday 7:30 PM Bible study and prayer
  - weeknight prayer conference
  - monthly fasting prayer
  - outreach on the Saturday before Communion Sunday
  - VBS every summer
  - church picnic every June
  - Labor Day family camp
  - Harvest Festival
  - Christmas carol rounds
- **Contact:**
  - phone (773) 936-3097
  - email info@christtamilchurch.com
  - Facebook (ChristTamilChurchChicago)
  - YouTube channel with 10+ years of worship and sermons

## Capabilities and Constraints

- **Stack:** React + Vite SPA with SSR prerendering to static pages, and React Router routes.
- **Content lives in code:** `src/data/site.ts` (church info, events, verse of the week) and `src/data/images.ts` (the image registry every image must go through).
- **Maintained by a volunteer developer** who edits code directly. Content updates should stay simple, single-place edits in the data files. A non-technical CMS is not a current requirement.
- **Existing routes and content must be preserved.** Changes are incremental, one page at a time, and committed only when the maintainer says so.
- **Terminology:** B.L.A.S.T. (Bible Learning And Spiritual Training) Sunday School, Kids Circle, Fellowship Hour, Plan Your Visit, "I'm New".

## Brand Commitments

- **Name:** "Christ Tamil Church", with "Chicago" in the logo lockup.
- **Voice:** warm, gentle, pastoral, sincere about faith without being preachy, with hospitality leading. Use second person to the visitor and first-person plural for the church.
- **Tamil first:** where Scripture or a section title leads, the Tamil phrase leads and the English sits beside it as a reference.
- **The visual direction is already leader-approved and documented.** The authority is `docs/design-system/ctc-design-template.md`, with `src/pages/Home.tsx` as the reference implementation. Design decisions belong there, not in this file.

## Evidence on Hand

- **Real congregation photos** in `C:\Church Website\church pictures\<topic>`, organised by ministry (worship, fellowship, outreach, Sunday School, VBS, Bible study, family camp, men's and women's fellowship, and more). They replace stock photos page by page and all get one shared colour grade.
- **Sermon and worship video archive** on YouTube, 10+ years.
- **Real schedules, address and contact details** in `src/data/site.ts`.
- **Not on hand:** member testimonials, quotes, attendance figures or statistics. Never fabricate them.

## Product Principles

1. **Contact is one tap away.** Every page offers an obvious, low-pressure way to reach a person before visiting.
2. **Sunday time and place are never hidden.** A first-time guest finds when and where without hunting.
3. **Two languages, one family.** Tamil is honoured, English-first and non-Tamil visitors are fully welcome, and no core information is Tamil-only.
4. **Real people, real moments.** Show the actual congregation and not stock photos, and never invent social proof.
5. **Simple to keep current.** Content changes are single, obvious edits a volunteer developer can make safely.

## Accessibility & Inclusion

- **Contrast:** body text must reach 4.5:1 against its band.
- **Motion:** every animation respects `prefers-reduced-motion`.
- **Markup:** semantic HTML throughout.
- **Tamil script** must render legibly. It uses the Noto Serif Tamil and Catamaran faces and is marked with `lang="ta"`.
- **Audience range:** the site serves elders as well as youth, so text size, tap targets and plain language matter on mobile.
