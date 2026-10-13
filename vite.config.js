import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The church's calendar date when the site is built (YYYY-MM-DD). Prerendered
// pages decide whether the featured event is still current from this; the
// browser then re-checks against the real date (src/hooks/useFeaturedEvent.ts).
const buildDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());

// Newest regular upload (not a Short) on the church's YouTube channel, read at
// build time from YouTube's public feed, which needs no API key. The Sermons
// page features it, and the daily deploy rebuild keeps it current. When the
// feed can't be reached the page falls back to the first video in
// src/data/sermonVideos.ts (src/data/latestVideo.ts). Tests never fetch.
const youtubeChannelId = "UC3X9JlecBpz9w2njytsGEEw";
const latestVideoCache = "node_modules/.cache/ctc-latest-video.json";

const decodeXml = (text) =>
  text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

async function fetchLatestVideo() {
  if (process.env.VITEST || process.env.LATEST_VIDEO === "off") return null;

  // The client and SSR builds each load this config; reuse one fetch so both
  // halves of a build feature the same video.
  try {
    if (Date.now() - statSync(latestVideoCache).mtimeMs < 15 * 60 * 1000) {
      return JSON.parse(readFileSync(latestVideoCache, "utf8"));
    }
  } catch {
    // No recent cache: fetch below.
  }

  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    for (const entry of xml.split("<entry>").slice(1)) {
      const field = (tag) => entry.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1];
      const link = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? "";
      if (link.includes("/shorts/")) continue;
      const youtubeId = field("yt:videoId");
      const title = field("title");
      if (!youtubeId || !title) continue;
      const video = {
        youtubeId,
        title: decodeXml(title),
        publishedAt: field("published") ?? "",
        description: decodeXml(field("media:description") ?? "").slice(0, 2000)
      };
      mkdirSync("node_modules/.cache", { recursive: true });
      writeFileSync(latestVideoCache, JSON.stringify(video));
      return video;
    }
    throw new Error("no regular uploads in the feed");
  } catch (error) {
    console.warn(`Latest YouTube video unavailable (${error.message}); using src/data/sermonVideos.ts.`);
    return null;
  }
}

const latestVideo = await fetchLatestVideo();

// The 2015–2020 audio sermons are hosted on archive.org (src/data/audioArchive.ts).
// When running `npm run dev` with the downloaded MP3s on this computer, play
// them from disk instead, so the archive page works before or without the
// upload. Set AUDIO_ARCHIVE_DIR to use a different folder. Builds and tests
// always use archive.org.
function localAudioArchive() {
  const dir = resolve(process.env.AUDIO_ARCHIVE_DIR ?? "../old-site-archive/audio-sermons");
  const prefix = "/__audio-archive/";
  let enabled = false;
  return {
    name: "ctc-local-audio-archive",
    config(_, { command, isPreview }) {
      enabled = command === "serve" && !isPreview && !process.env.VITEST && existsSync(dir);
      return { define: { __LOCAL_AUDIO_BASE__: JSON.stringify(enabled ? prefix : null) } };
    },
    configureServer(server) {
      if (!enabled) return;
      server.config.logger.info(`  Audio archive: playing MP3s from ${dir}`);
      server.middlewares.use(prefix, (req, res) => {
        const name = basename(decodeURIComponent((req.url ?? "").split("?")[0]));
        const file = join(dir, name);
        if (!name.endsWith(".mp3") || !existsSync(file)) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        // Range requests let the browser seek without downloading the whole file.
        const size = statSync(file).size;
        const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Accept-Ranges", "bytes");
        if (range) {
          const start = range[1] ? Number(range[1]) : size - Number(range[2]);
          const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
          res.statusCode = 206;
          res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
          res.setHeader("Content-Length", end - start + 1);
          createReadStream(file, { start, end }).pipe(res);
        } else {
          res.setHeader("Content-Length", size);
          createReadStream(file).pipe(res);
        }
      });
    }
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), localAudioArchive()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
    __LATEST_VIDEO__: JSON.stringify(latestVideo)
  }
});
