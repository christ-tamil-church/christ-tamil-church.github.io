/// <reference types="vite/client" />

/** Build day in Chicago (YYYY-MM-DD), injected by vite.config.js. */
declare const __BUILD_DATE__: string;

/** Newest regular upload on the church YouTube channel, or null when the feed was unavailable (see vite.config.js). */
declare const __LATEST_VIDEO__: {
  youtubeId: string;
  title: string;
  publishedAt: string;
  description: string;
} | null;
