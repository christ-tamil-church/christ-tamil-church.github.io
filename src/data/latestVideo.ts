import { sermonVideos } from "./sermonVideos";

export type LatestVideo = {
  youtubeId: string;
  title: string;
  /** ISO timestamp from YouTube; absent for the fallback. */
  publishedAt?: string;
  description?: string;
};

// The video featured at the top of the Sermons page: the channel's newest
// regular upload, read from YouTube at build time (vite.config.js). When the
// feed was unavailable, the first video in sermonVideos.ts stands in.
export const latestVideo: LatestVideo | undefined =
  __LATEST_VIDEO__ ??
  (sermonVideos[0] ? { youtubeId: sermonVideos[0].youtubeId, title: sermonVideos[0].title } : undefined);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const titleDatePattern = new RegExp(`\\b(${MONTHS.join("|")})\\s+(\\d{1,2}),\\s+(\\d{4})\\b`, "i");
// Emoji, plus the invisible variation selector that often trails them.
const emojiPattern = new RegExp("\\p{Extended_Pictographic}|\\uFE0F", "gu");

/** "Christ Tamil Church Chicago – Praise & Worship | October 4, 2026" → name "Praise & Worship", date "October 4, 2026". */
export function splitVideoTitle(title: string) {
  const [head, ...rest] = title.split(" | ");
  const name = head.replace(/^Christ Tamil Church Chicago\s*[–—|:-]\s*/i, "").trim();
  const date = title.match(titleDatePattern)?.[0];
  const detail = rest.join(" | ").replace(titleDatePattern, "").replace(/^[\s|·,–—-]+|[\s|·,–—-]+$/g, "");
  return { name: name || title, date, detail: detail || undefined };
}

/** The date a video was published, as an ISO string: YouTube's timestamp, else the date in its title. */
export function videoUploadDate(video: LatestVideo) {
  if (video.publishedAt) return video.publishedAt;
  const match = video.title.match(titleDatePattern);
  if (!match) return undefined;
  const month = MONTHS.findIndex((name) => name.toLowerCase() === match[1].toLowerCase()) + 1;
  return `${match[3]}-${String(month).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

/** Opening of the YouTube description, without emoji or hashtags, trimmed at a word near maxLength. */
export function videoSummary(video: LatestVideo, maxLength = 240) {
  const text = (video.description ?? "")
    .split(/\n\s*\n/)
    .map((part) => part.replace(emojiPattern, "").replace(/(^|\s)#\S+/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
  if (!text) return undefined;
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:–—-]+$/, "")}…`;
}
