# Audio Sermon Archive (`/sermons/audio-archive`)

Sunday recordings from 2015–2020, rescued from the old WordPress "Tamil Audio
Sermons" page. Linked from a sage teaser band at the end of `/sermons` and from
Grow → "Audio Sermons 2015–2020". The old `/audio-sermons` URL redirects here.

## Files

- `src/pages/AudioSermons.tsx` / `.css`: the page and its docked player
- `src/data/audioSermons.ts`: one entry per Sunday (GENERATED, see below)
- `src/data/audioArchive.ts`: archive.org identifier, URL and format helpers
- `scripts/build-audio-sermons.mjs`: regenerates the data file

## Design

A ledger, not a podcast app. Cream hero (Tamil kicker, one bronze "Play the
most recent recording"), then a white library band: search, speaker pills,
"Only show recordings", a year jump list, and one section per year. The
Fraunces year numeral stays in view beside its rows on desktop. Rows are
hairline-separated: mono date and weekday, theme (Noto Serif Tamil when it is
written in Tamil), speaker, length, and a round sage play button.

Sundays whose recording was already gone on the old site are still listed:
the row is quieter, with "Not preserved" and no button.

The player is one shared `<audio preload="none">` docked at the bottom in deep
green: play/pause, ±15 s, scrubber, speed (1×, 1.25×, 1.5×, 0.75×), download,
close. Lock-screen controls come from the Media Session API. Nothing downloads
until someone presses play.

## Where the audio lives

The MP3s (about 1 GB, too large for the GitHub Pages repo) are on the Internet
Archive as item `ctc-audio-sermons-2015-2020`:
https://archive.org/details/ctc-audio-sermons-2015-2020

### One-time upload

The item belongs to the church's archive.org account ("Christ Tamil Church -
Chicago"). Signed in as that account, copy the two keys from
https://archive.org/account/s3.php, then from the ctc-app folder run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\upload-audio-archive.ps1
```

Paste the keys when asked. The script (curl only, no Python) creates the item
with its title, description and subjects, uploads every MP3, and skips files
already there, so re-running it resumes an interrupted upload.

During `npm run dev`, the page plays the MP3s from the local download folder
instead (see `localAudioArchive` in `vite.config.js`).

If the identifier is taken or changed, update `audioArchiveIdentifier` in
`src/data/audioArchive.ts`. Until the upload finishes, the play buttons show
"This recording couldn't load".

## Updating the list

Edit `src/data/audioSermons.ts` by hand for small corrections (a theme's
spelling, a speaker's title). To rebuild it from the archive folder:

```sh
node scripts/build-audio-sermons.mjs "C:/Church Website/old-site-archive/audio-sermons"
```

That overwrites hand edits. Rows from 2020–21 that linked to Facebook videos
are left out on purpose.
