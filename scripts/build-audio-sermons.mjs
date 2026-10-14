// Builds src/data/audioSermons.ts from the old WordPress "Tamil Audio
// Sermons" page and the MP3s downloaded from it. Run once (or again if the
// archive changes):
//
//   node scripts/build-audio-sermons.mjs "C:/Church Website/old-site-archive/audio-sermons"
//
// Reads, from that folder:
//   _audio-sermons-page.html  the old page (Date / Theme / Speaker table)
//   sermons-index.csv         which recordings were downloaded vs. already 404
//   *.mp3                     the recordings (for durations)
//
// Rows on the old page that link to Facebook videos (2020–21) instead of an
// MP3 are left out; this archive is audio only.

import { existsSync, openSync, readSync, closeSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const archiveDir = process.argv[2];
if (!archiveDir) {
  console.error("Usage: node scripts/build-audio-sermons.mjs <audio-sermons folder>");
  process.exit(1);
}

const outFile = resolve("src/data/audioSermons.ts");
const html = readFileSync(join(archiveDir, "_audio-sermons-page.html"), "utf8");
const csv = readFileSync(join(archiveDir, "sermons-index.csv"), "utf8");

const decode = (text) =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

// file name -> CSV status
const statusByFile = new Map();
for (const line of csv.split(/\r?\n/).slice(1)) {
  const cells = [...line.matchAll(/"([^"]*)"/g)].map((match) => match[1]);
  if (cells.length >= 4) statusByFile.set(cells[2], cells[3]);
}

function cell(row, label) {
  const match = row.match(new RegExp(`${label}:&nbsp;</span>([\\s\\S]*?)</td>`));
  return match ? decode(match[1]) : "";
}

function isoDate(text) {
  const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Names the old page typed in a form the rules below can't tidy.
const SPEAKER_FIXES = { "Pastor Tkjames": "Pastor T. K. James" };

// "Rev.Godwin  Kanakaraj" -> "Rev. Godwin Kanakaraj"; "Pastor. X" -> "Pastor X";
// "MR. JOSHUA SAMUEL" -> "Mr. Joshua Samuel"
function cleanSpeaker(text) {
  let name = /[a-z]/.test(text)
    ? text
    : text.toLowerCase().replace(/(^|[\s.])([a-z])/g, (_, before, letter) => before + letter.toUpperCase());
  name = name
    .replace(/\b(Rev|Bro|Sis|Dr|Mr|Mrs|Ms|Evg)\.?\s*(?=[A-Z])/g, "$1. ")
    .replace(/\bPastor\.?\s*/g, "Pastor ")
    .replace(/\s+/g, " ")
    .trim();
  return SPEAKER_FIXES[name] ?? name;
}

// MP3 duration from the first frame: a Xing/Info/VBRI header gives the frame
// count; otherwise the file is constant bitrate and size gives the length.
const BITRATES_V1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const BITRATES_V2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

function mp3Duration(path) {
  const size = statSync(path).size;
  const fd = openSync(path, "r");
  const head = Buffer.alloc(Math.min(size, 256 * 1024));
  readSync(fd, head, 0, head.length, 0);
  closeSync(fd);

  let offset = 0;
  if (head.toString("latin1", 0, 3) === "ID3") {
    offset = 10 + ((head[6] & 0x7f) << 21 | (head[7] & 0x7f) << 14 | (head[8] & 0x7f) << 7 | (head[9] & 0x7f));
  }
  for (; offset < head.length - 4; offset++) {
    if (head[offset] !== 0xff || (head[offset + 1] & 0xe0) !== 0xe0) continue;
    const version = (head[offset + 1] >> 3) & 3; // 3 = MPEG1, 2 = MPEG2, 0 = MPEG2.5
    const layer = (head[offset + 1] >> 1) & 3; // 1 = Layer III
    const bitrateIndex = head[offset + 2] >> 4;
    const rateIndex = (head[offset + 2] >> 2) & 3;
    if (version === 1 || layer !== 1 || bitrateIndex === 0 || bitrateIndex === 15 || rateIndex === 3) continue;
    const sampleRate = RATES[version][rateIndex];
    const kbps = (version === 3 ? BITRATES_V1_L3 : BITRATES_V2_L3)[bitrateIndex];
    const mono = (head[offset + 3] >> 6) === 3;
    const samplesPerFrame = version === 3 ? 1152 : 576;
    const sideInfo = version === 3 ? (mono ? 17 : 32) : (mono ? 9 : 17);
    const xing = offset + 4 + sideInfo;
    const tag = head.toString("latin1", xing, xing + 4);
    if ((tag === "Xing" || tag === "Info") && head[xing + 7] & 1) {
      return Math.round((head.readUInt32BE(xing + 8) * samplesPerFrame) / sampleRate);
    }
    const vbri = offset + 36;
    if (head.toString("latin1", vbri, vbri + 4) === "VBRI") {
      return Math.round((head.readUInt32BE(vbri + 14) * samplesPerFrame) / sampleRate);
    }
    return Math.round(((size - offset) * 8) / (kbps * 1000));
  }
  return undefined;
}

const sermons = [];
let facebookRows = 0;
for (const row of html.split(/<tr[\s>]/).slice(1)) {
  if (!row.includes("Date:&nbsp;")) continue;
  const date = isoDate(cell(row, "Date"));
  // A few rows lost their "Theme:" label; the theme column is still marked.
  const theme = cell(row, "Theme") || decode(row.match(/<td class="theme">([\s\S]*?)<\/td>/)?.[1] ?? "");
  const speaker = cleanSpeaker(cell(row, "Speaker"));
  const files = [...new Set([...row.matchAll(/contentUrl" content="([^"]+\.mp3)"/g)].map((match) => basename(match[1])))];
  if (!files.length) {
    facebookRows++;
    continue;
  }
  if (!date) {
    console.warn("Skipping row without a date:", theme, speaker);
    continue;
  }
  files.forEach((file, index) => {
    // The old page lists a few Sundays twice.
    if (sermons.some((sermon) => sermon.file === file)) return;
    const local = join(archiveDir, file);
    const preserved = existsSync(local);
    if (!preserved && statusByFile.get(file) === "downloaded") console.warn("CSV says downloaded but file missing:", file);
    sermons.push({
      date,
      theme: theme || undefined,
      speaker,
      ...(files.length > 1 ? { part: index + 1 } : {}),
      file,
      ...(preserved ? { durationSec: mp3Duration(local), bytes: statSync(local).size } : {}),
      preserved
    });
  });
}

// Recordings downloaded but not listed on the old page (e.g. extra parts).
const listed = new Set(sermons.map((sermon) => sermon.file));
const unlisted = [...statusByFile].filter(([file, status]) => status === "downloaded" && !listed.has(file)).map(([file]) => file);

sermons.sort((a, b) => b.date.localeCompare(a.date) || (a.part ?? 0) - (b.part ?? 0));

const preservedCount = sermons.filter((sermon) => sermon.preserved).length;
console.log(`${sermons.length} audio rows · ${preservedCount} preserved · ${sermons.length - preservedCount} not preserved · ${facebookRows} Facebook-only rows skipped`);
if (unlisted.length) console.log(`Downloaded but not on the old page (${unlisted.length}):\n  ${unlisted.join("\n  ")}`);

const entries = sermons
  .map((sermon) => `  ${JSON.stringify(sermon, (key, value) => (value === undefined ? undefined : value))}`)
  .join(",\n");

writeFileSync(
  outFile,
  `// GENERATED by scripts/build-audio-sermons.mjs from the old WordPress
// "Tamil Audio Sermons" page. Themes and speakers are kept as the old page
// listed them (speaker spacing tidied). Edit by hand only for corrections;
// re-running the script overwrites this file.
//
// Recordings with preserved: false were already missing on the old site and
// are listed so the record of those Sundays stays complete.

export type AudioSermon = {
  /** Sunday (or service) date, YYYY-MM-DD. */
  date: string;
  theme?: string;
  speaker: string;
  /** Set when one service was recorded in several files. */
  part?: number;
  /** File name on the Internet Archive item. */
  file: string;
  durationSec?: number;
  bytes?: number;
  preserved: boolean;
};

export const audioSermons: AudioSermon[] = [
${entries}
];
`
);
console.log(`Wrote ${outFile}`);
