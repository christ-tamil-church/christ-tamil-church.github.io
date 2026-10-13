import {
  ArrowRight,
  Download,
  Headphones,
  Loader2,
  Mail,
  MapPin,
  Pause,
  Phone,
  Play,
  RotateCcw,
  RotateCw,
  Search,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  audioArchiveFirstYear,
  audioArchiveItemUrl,
  audioArchiveLastYear,
  audioSermonUrl,
  formatClock,
  formatDuration,
  isTamil,
  preservedSermons,
  speakerGroup,
  type SpeakerGroup
} from "../data/audioArchive";
import { audioSermons, type AudioSermon } from "../data/audioSermons";
import { churchInfo } from "../data/site";
import "./AudioSermons.css";

type SpeakerFilter = "all" | SpeakerGroup;

const SPEAKER_FILTERS: { id: SpeakerFilter; label: string }[] = [
  { id: "all", label: "All speakers" },
  { id: "godwin", label: "Rev. Godwin Kanakaraj" },
  { id: "jagan", label: "Rev. Jagan Sathiya Seelan" },
  { id: "guests", label: "Guest speakers" }
];

const SPEEDS = [1, 1.25, 1.5, 0.75] as const;
const SKIP_SECONDS = 15;

// Dates are calendar days, so format them in UTC to keep them from shifting.
const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const asDate = (iso: string) => new Date(`${iso}T12:00:00Z`);

function sermonTitle(sermon: AudioSermon) {
  const theme = sermon.theme ?? "Sunday message";
  return sermon.part ? `${theme} (part ${sermon.part})` : theme;
}

function Theme({ sermon }: { sermon: AudioSermon }) {
  const theme = sermon.theme ?? "Sunday message";
  return (
    <span className="as-row-theme">
      <span lang={isTamil(theme) ? "ta" : undefined}>{theme}</span>
      {sermon.part ? <span className="as-row-part">Part {sermon.part}</span> : null}
    </span>
  );
}

function SermonRow({
  sermon,
  isCurrent,
  isPlaying,
  onPlay
}: {
  sermon: AudioSermon;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: (sermon: AudioSermon) => void;
}) {
  const date = asDate(sermon.date);
  const label = `${isCurrent && isPlaying ? "Pause" : "Play"}: ${sermonTitle(sermon)}, ${sermon.speaker}, ${fullDate.format(date)}`;

  return (
    <li className={`as-row${sermon.preserved ? "" : " is-lost"}${isCurrent ? " is-current" : ""}`}>
      <time className="as-row-date" dateTime={sermon.date}>
        <span>{monthDay.format(date)}</span>
        <small>{weekday.format(date)}</small>
      </time>
      <span className="as-row-main">
        <Theme sermon={sermon} />
        <span className="as-row-speaker">{sermon.speaker}</span>
      </span>
      {sermon.preserved ? (
        <>
          <span className="as-row-length">{sermon.durationSec ? formatDuration(sermon.durationSec) : null}</span>
          <button type="button" className="as-row-play" aria-label={label} title={isCurrent && isPlaying ? "Pause" : "Play"} onClick={() => onPlay(sermon)}>
            {isCurrent && isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
        </>
      ) : (
        <span className="as-row-lost">Not preserved</span>
      )}
    </li>
  );
}

type PlayerState = {
  sermon: AudioSermon | null;
  playing: boolean;
  loading: boolean;
  error: boolean;
  time: number;
  duration: number;
  speed: (typeof SPEEDS)[number];
};

// play() rejects when the browser blocks autoplay or the file fails; the
// element's own error and pause events update the player instead.
function startPlayback(audio: HTMLAudioElement) {
  audio.play()?.catch(() => undefined);
}

const idlePlayer: PlayerState = { sermon: null, playing: false, loading: false, error: false, time: 0, duration: 0, speed: 1 };

function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(idlePlayer);
  // The latest state for event callbacks, so they never act on a stale copy.
  const stateRef = useRef(state);
  stateRef.current = state;
  const update = (patch: Partial<PlayerState>) => setState((prev) => ({ ...prev, ...patch }));

  const play = useCallback((sermon: AudioSermon) => {
    const audio = audioRef.current;
    if (!audio) return;
    const current = stateRef.current;
    if (current.sermon?.file === sermon.file && !current.error) {
      if (audio.paused) startPlayback(audio);
      else audio.pause();
      return;
    }
    audio.src = audioSermonUrl(sermon);
    audio.playbackRate = current.speed;
    startPlayback(audio);
    update({ sermon, playing: false, loading: true, error: false, time: 0, duration: sermon.durationSec ?? 0 });
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) startPlayback(audio);
    else audio.pause();
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    const end = Number.isFinite(audio.duration) ? audio.duration : Infinity;
    audio.currentTime = Math.min(Math.max(0, seconds), end);
    update({ time: audio.currentTime });
  }, []);

  const cycleSpeed = useCallback(() => {
    const speed = SPEEDS[(SPEEDS.indexOf(stateRef.current.speed) + 1) % SPEEDS.length];
    if (audioRef.current) audioRef.current.playbackRate = speed;
    update({ speed });
  }, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setState((prev) => ({ ...idlePlayer, speed: prev.speed }));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlers: [keyof HTMLMediaElementEventMap, () => void][] = [
      ["play", () => update({ playing: true, error: false })],
      ["playing", () => update({ playing: true, loading: false })],
      ["pause", () => update({ playing: false })],
      ["waiting", () => update({ loading: true })],
      ["canplay", () => update({ loading: false })],
      ["timeupdate", () => update({ time: audio.currentTime })],
      ["loadedmetadata", () => { if (Number.isFinite(audio.duration)) update({ duration: audio.duration }); }],
      ["ended", () => update({ playing: false, time: 0 })],
      ["error", () => { if (audio.getAttribute("src")) update({ error: true, loading: false, playing: false }); }]
    ];
    handlers.forEach(([event, handler]) => audio.addEventListener(event, handler));
    return () => handlers.forEach(([event, handler]) => audio.removeEventListener(event, handler));
  }, []);

  // Lock-screen and headphone controls on phones.
  useEffect(() => {
    const session = typeof navigator !== "undefined" ? navigator.mediaSession : undefined;
    if (!session || !state.sermon || typeof MediaMetadata === "undefined") return;
    session.metadata = new MediaMetadata({
      title: sermonTitle(state.sermon),
      artist: state.sermon.speaker,
      album: `Christ Tamil Church · ${fullDate.format(asDate(state.sermon.date))}`
    });
    const audio = audioRef.current;
    session.setActionHandler("play", () => audio && startPlayback(audio));
    session.setActionHandler("pause", () => audio?.pause());
    session.setActionHandler("seekbackward", () => audio && seek(audio.currentTime - SKIP_SECONDS));
    session.setActionHandler("seekforward", () => audio && seek(audio.currentTime + SKIP_SECONDS));
  }, [state.sermon, seek]);

  return { audioRef, state, play, toggle, seek, cycleSpeed, close };
}

function Player({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const { state, toggle, seek, cycleSpeed, close } = player;
  const { sermon } = state;
  if (!sermon) return null;
  const duration = state.duration || sermon.durationSec || 0;
  const progress = duration ? Math.min(100, (state.time / duration) * 100) : 0;
  const title = sermonTitle(sermon);

  return (
    <div className="as-player" role="region" aria-label="Audio player">
      <div className="as-player-inner">
        <button
          type="button"
          className="as-player-toggle"
          onClick={state.error ? () => player.play(sermon) : toggle}
          aria-label={state.error ? `Try again: ${title}` : state.playing ? `Pause ${title}` : `Play ${title}`}
        >
          {state.loading ? <Loader2 className="as-spin" size={22} aria-hidden="true" />
            : state.error ? <RotateCw size={22} aria-hidden="true" />
            : state.playing ? <Pause size={22} aria-hidden="true" />
            : <Play size={22} aria-hidden="true" />}
        </button>

        <div className="as-player-now">
          <p className="as-player-title" lang={isTamil(title) ? "ta" : undefined}>{title}</p>
          <p className="as-player-meta" aria-live="polite">
            {state.error
              ? "This recording couldn't load. Check your connection and try again."
              : `${sermon.speaker} · ${monthDay.format(asDate(sermon.date))}, ${sermon.date.slice(0, 4)}`}
          </p>
        </div>

        <div className="as-player-track">
          <span className="as-player-clock">{formatClock(state.time)}</span>
          <input
            type="range"
            min={0}
            max={Math.max(1, Math.floor(duration))}
            step={1}
            value={Math.floor(state.time)}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label="Position in recording"
            aria-valuetext={`${formatClock(state.time)} of ${formatClock(duration)}`}
            style={{ "--as-progress": `${progress}%` } as CSSProperties}
          />
          <span className="as-player-clock">{formatClock(duration)}</span>
        </div>

        <div className="as-player-actions">
          <button type="button" onClick={() => seek(state.time - SKIP_SECONDS)} aria-label={`Back ${SKIP_SECONDS} seconds`} title={`Back ${SKIP_SECONDS} seconds`}>
            <RotateCcw size={18} aria-hidden="true" /><span aria-hidden="true">{SKIP_SECONDS}</span>
          </button>
          <button type="button" onClick={() => seek(state.time + SKIP_SECONDS)} aria-label={`Forward ${SKIP_SECONDS} seconds`} title={`Forward ${SKIP_SECONDS} seconds`}>
            <RotateCw size={18} aria-hidden="true" /><span aria-hidden="true">{SKIP_SECONDS}</span>
          </button>
          <button type="button" className="as-player-speed" onClick={cycleSpeed} aria-label={`Playback speed ${state.speed}×. Change speed`} title="Playback speed">
            {state.speed}×
          </button>
          <a href={audioSermonUrl(sermon)} download aria-label={`Download ${title} (MP3)`} title="Download MP3">
            <Download size={18} aria-hidden="true" />
          </a>
          <button type="button" onClick={close} aria-label="Close player" title="Close player">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AudioSermons() {
  const player = useAudioPlayer();
  const [query, setQuery] = useState("");
  const [speaker, setSpeaker] = useState<SpeakerFilter>("all");
  const [recordedOnly, setRecordedOnly] = useState(true);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const visible = useMemo(
    () =>
      audioSermons.filter((sermon) => {
        if (recordedOnly && !sermon.preserved) return false;
        if (speaker !== "all" && speakerGroup(sermon.speaker) !== speaker) return false;
        if (!normalizedQuery) return true;
        return [sermon.theme ?? "", sermon.speaker, sermon.date, fullDate.format(asDate(sermon.date))]
          .some((field) => field.toLocaleLowerCase().includes(normalizedQuery));
      }),
    [normalizedQuery, recordedOnly, speaker]
  );

  const years = useMemo(() => {
    const groups = new Map<string, AudioSermon[]>();
    visible.forEach((sermon) => {
      const year = sermon.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), sermon]);
    });
    return [...groups];
  }, [visible]);

  const allYears = useMemo(() => [...new Set(audioSermons.map((sermon) => sermon.date.slice(0, 4)))], []);
  const latest = preservedSermons[0];
  const filtered = Boolean(normalizedQuery) || speaker !== "all";
  const visibleRecordings = visible.filter((sermon) => sermon.preserved).length;

  return (
    <div className={`as-page${player.state.sermon ? " has-player" : ""}`}>
      <section className="as-hero" aria-labelledby="as-title">
        <div className="as-shell as-hero-copy">
          <span className="as-hero-kicker">
            <span lang="ta">ஒலிப் பிரசங்கங்கள்</span>
            <small>Audio archive</small>
          </span>
          <h1 id="as-title">Sermons from our <em>first years.</em></h1>
          <p>
            Sunday messages recorded between {audioArchiveFirstYear} and {audioArchiveLastYear}, most of them in Tamil.
            Press play on any recording to listen here, or download it for the drive to work.
          </p>
          {latest ? (
            <button type="button" className="as-primary" onClick={() => player.play(latest)}>
              <Headphones size={18} aria-hidden="true" /> Play the most recent recording
            </button>
          ) : null}
          <p className="as-dateline">
            <span>Christ Tamil Church · Chicago</span>
            <span>{audioArchiveFirstYear}–{audioArchiveLastYear} · Tamil &amp; English</span>
          </p>
        </div>
      </section>

      <section className="as-library" aria-labelledby="as-library-title">
        <div className="as-shell">
          <div className="as-controls">
            <div className="as-controls-head">
              <h2 id="as-library-title">Every Sunday, by year</h2>
              <p>
                Some recordings were lost before this archive was gathered. Untick “Only show recordings” to see those
                Sundays too, so the record of our church family stays whole.
              </p>
            </div>
            <div className="as-search">
              <label htmlFor="as-search">Search the archive</label>
              <Search size={19} aria-hidden="true" />
              <input
                id="as-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Theme, speaker, or date"
              />
            </div>
          </div>

          <div className="as-filters">
            <div className="as-filter-pills" role="group" aria-label="Filter by speaker">
              {SPEAKER_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={speaker === filter.id ? "is-active" : undefined}
                  aria-pressed={speaker === filter.id}
                  onClick={() => setSpeaker(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="as-recorded-only">
              <input type="checkbox" checked={recordedOnly} onChange={(event) => setRecordedOnly(event.target.checked)} />
              <span>Only show recordings</span>
            </label>
          </div>

          <nav className="as-year-jump" aria-label="Jump to year">
            {allYears.map((year) => {
              const present = years.some(([shown]) => shown === year);
              return present
                ? <a key={year} href={`#as-year-${year}`}>{year}</a>
                : <span key={year} aria-disabled="true">{year}</span>;
            })}
          </nav>

          <p className="as-count" aria-live="polite">
            {filtered
              ? recordedOnly
                ? `${visible.length} ${visible.length === 1 ? "recording" : "recordings"} found`
                : `${visible.length} ${visible.length === 1 ? "Sunday" : "Sundays"} found · ${visibleRecordings} with a recording`
              : recordedOnly
                ? `${preservedSermons.length} recordings`
                : `${audioSermons.length} Sundays listed · ${preservedSermons.length} recordings`}
          </p>

          {years.length ? (
            <div className="as-years">
              {years.map(([year, sermons]) => {
                const recorded = sermons.filter((sermon) => sermon.preserved).length;
                return (
                  <section className="as-year" key={year} id={`as-year-${year}`} aria-labelledby={`as-year-title-${year}`}>
                    <header className="as-year-head">
                      <h3 id={`as-year-title-${year}`}>{year}</h3>
                      <p>
                        {recorded} {recorded === 1 ? "recording" : "recordings"}
                        {sermons.length > recorded ? <span className="as-year-lost">{sermons.length - recorded} not preserved</span> : null}
                      </p>
                    </header>
                    <ol className="as-rows">
                      {sermons.map((sermon) => (
                        <SermonRow
                          key={sermon.file}
                          sermon={sermon}
                          isCurrent={player.state.sermon?.file === sermon.file}
                          isPlaying={player.state.sermon?.file === sermon.file && player.state.playing}
                          onPlay={player.play}
                        />
                      ))}
                    </ol>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="as-empty" role="status">
              <h3>Nothing matches that search.</h3>
              <p>Try a different word, or clear the filters to see every Sunday.</p>
              <button type="button" onClick={() => { setQuery(""); setSpeaker("all"); setRecordedOnly(true); }}>Clear search and filters</button>
            </div>
          )}

          <p className="as-onward">
            From 2020 our services moved online. Newer worship and sermons are in{" "}
            <Link to="/sermons">Messages &amp; Moments <ArrowRight size={15} aria-hidden="true" /></Link>
            <span className="as-onward-sep" aria-hidden="true"> · </span>
            <a href={audioArchiveItemUrl} target="_blank" rel="noreferrer">The full collection on archive.org</a>
          </p>
        </div>
      </section>

      <section className="as-closing" aria-labelledby="as-closing-title">
        <div className="as-shell as-closing-grid">
          <div>
            <h2 id="as-closing-title">Hear this Sunday's message in person.</h2>
            <p>Our pastors still preach every week, in Tamil and English. Come worship with us, or reach out with a question first.</p>
            <Link className="as-text-link" to="/visit">Plan your visit <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <ul className="as-closing-facts">
            <li><MapPin size={18} aria-hidden="true" /><span>Sunday worship, {churchInfo.worship.time}<br />{churchInfo.address.short}</span></li>
            <li><Phone size={18} aria-hidden="true" /><a href={churchInfo.contact.phoneHref}>{churchInfo.contact.phone}</a></li>
            <li><Mail size={18} aria-hidden="true" /><a href={churchInfo.contact.emailHref}>{churchInfo.contact.email}</a></li>
          </ul>
        </div>
      </section>

      {/* One shared element; nothing downloads until a recording is played. */}
      <audio ref={player.audioRef} preload="none" />
      <Player player={player} />
    </div>
  );
}
