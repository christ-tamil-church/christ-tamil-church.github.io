# Page design: Messages & Moments (`/sermons`)

## Shipping files

- Page: `src/pages/Sermons.tsx`, styles in `src/pages/Sermons.css` (`sermons-*`)
- Video library: `src/data/sermonVideos.ts`. Add new videos at the top of their
  playlist group.
- Latest video: `src/data/latestVideo.ts`, filled at build time by
  `vite.config.js`.

## Visitor journey

1. Hero: Tamil kicker, headline, lede, and the one bronze CTA (the YouTube
   channel).
2. Sage "Latest video" band: an embedded player beside the eyebrow, the video's
   name and date (one h2), the opening of its YouTube description, and an
   "Open on YouTube" arrow link. Stacked, player first, at 900px and below.
3. Video library: search, category filters, and each playlist with three cards
   until expanded.

## Latest video

The band shows the channel's newest regular upload (Shorts are skipped), read
from YouTube's public channel feed when the site is built. The feed needs no
API key, and the daily deploy rebuild picks up new uploads within a day. If
the feed can't be reached, the first video in `sermonVideos.ts` stands in, so
a build never fails on it. Tests never fetch; set `LATEST_VIDEO=off` to skip
the fetch locally.

The player is a real `youtube-nocookie.com` iframe (lazy-loaded), not a
click-to-play thumbnail, because search engines only list a page in video
results when the video is playable on it. `src/seo.ts` adds a matching
`VideoObject` to the page's structured data.
