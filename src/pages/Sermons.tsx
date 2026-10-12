import { ArrowUpRight, ChevronDown, ChevronUp, ExternalLink, Play, Search, VideoOff } from "lucide-react";
import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { latestVideo, splitVideoTitle, videoSummary, videoUploadDate, type LatestVideo } from "../data/latestVideo";
import {
  churchYoutubeChannelUrl,
  sermonPlaylists,
  sermonVideos,
  type SermonPlaylistId,
  type SermonVideo
} from "../data/sermonVideos";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import "./Sermons.css";

type VideoCategory = { id: string; label: string; playlists: readonly SermonPlaylistId[] };

const VIDEO_CATEGORIES = [
  { id: "all", label: "All", playlists: [] },
  { id: "worship", label: "Worship", playlists: ["praise-worship"] },
  { id: "sermons", label: "Sermons", playlists: ["sermons-guest-messages", "morning-devotionals"] },
  { id: "children", label: "Children", playlists: ["vbs", "kids-at-ctc"] },
  { id: "celebrations", label: "Celebrations", playlists: ["women-of-ctc", "church-anniversary", "christmas-programs"] }
] as const satisfies readonly VideoCategory[];

type VideoCategoryId = (typeof VIDEO_CATEGORIES)[number]["id"];

const playlistTitles = new Map<SermonPlaylistId, string>(
  sermonPlaylists.map((playlist) => [playlist.id, playlist.title])
);

function getDateLabel(title: string) {
  const fullDate = title.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/i);
  if (fullDate) return fullDate[0];
  const compactDate = title.match(/\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*\d{1,2}\s+\d{4}\b/i);
  return compactDate ? compactDate[0] : undefined;
}

function VideoCard({ video, playlistName }: { video: SermonVideo; playlistName: string }) {
  const dateLabel = getDateLabel(video.title);

  return (
    <a
      className="sermons-video-card"
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Watch ${video.title} on YouTube`}
      data-reveal-child
    >
      <span className="sermons-thumbnail">
        <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} loading="lazy" width="480" height="360" alt="" />
        <span className="sermons-play-icon" aria-hidden="true"><Play size={22} fill="currentColor" /></span>
      </span>
      <span className="sermons-card-copy">
        <span className="sermons-card-meta">
          <small>{playlistName}</small>
          {dateLabel ? <time>{dateLabel}</time> : null}
        </span>
        <span className="sermons-video-title">{video.title}</span>
      </span>
    </a>
  );
}

function VideoGrid({ videos }: { videos: SermonVideo[] }) {
  const gridRef = useRevealOnScroll<HTMLDivElement>({ staggerChildren: true, staggerStepMs: 65 });
  return (
    <div className="card-grid sermons-video-grid" ref={gridRef}>
      {videos.map((video) => (
        <VideoCard
          key={`${video.playlistId}-${video.youtubeId}`}
          video={video}
          playlistName={playlistTitles.get(video.playlistId) ?? "CTC video"}
        />
      ))}
    </div>
  );
}

const publishedFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" });

// The channel's newest upload, playable in place. A real embedded player (not
// a click-to-load thumbnail) so search engines can see the video on the page.
function LatestVideoBand({ video }: { video: LatestVideo }) {
  const revealRef = useRevealOnScroll<HTMLDivElement>();
  const { name, date, detail } = splitVideoTitle(video.title);
  const uploadDate = videoUploadDate(video);
  const dateText = date ?? (video.publishedAt ? publishedFormat.format(new Date(video.publishedAt)) : undefined);
  const summary = videoSummary(video);

  return (
    <section className="sermons-latest" aria-labelledby="sermons-latest-title">
      <div className="sermons-latest-inner" ref={revealRef}>
        <div className="sermons-latest-player">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={`${video.title} (YouTube video player)`}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="sermons-latest-copy">
          <span className="eyebrow">Latest video</span>
          {/* The date sits inside the heading so it never reads as a second
              "Praise & Worship" heading next to the playlist below. */}
          <h2 id="sermons-latest-title">
            {name}
            {detail ? <span className="sermons-latest-detail">{detail}</span> : null}
            {dateText ? <time dateTime={uploadDate}><span className="sr-only">, </span>{dateText}</time> : null}
          </h2>
          {summary ? <p>{summary}</p> : null}
          <a className="sermons-latest-link" href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer">
            Open on YouTube <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Sermons() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<VideoCategoryId>("all");
  const [expandedPlaylists, setExpandedPlaylists] = useState<Partial<Record<SermonPlaylistId, boolean>>>({});
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const activePlaylistIds = useMemo<readonly SermonPlaylistId[]>(
    () => VIDEO_CATEGORIES.find((category) => category.id === activeCategory)?.playlists ?? [],
    [activeCategory]
  );
  const visiblePlaylists = activeCategory === "all"
    ? sermonPlaylists
    : sermonPlaylists.filter((playlist) => activePlaylistIds.includes(playlist.id));
  const matches = useMemo(() => {
    const categoryVideos = activeCategory === "all"
      ? sermonVideos
      : sermonVideos.filter((video) => activePlaylistIds.includes(video.playlistId));
    if (!normalizedQuery) return categoryVideos;
    return categoryVideos.filter((video) => {
      const playlistTitle = playlistTitles.get(video.playlistId) ?? "";
      return video.title.toLocaleLowerCase().includes(normalizedQuery)
        || playlistTitle.toLocaleLowerCase().includes(normalizedQuery);
    });
  }, [activeCategory, activePlaylistIds, normalizedQuery]);

  return (
    <>
      <section className="sermons-hero" aria-labelledby="messages-moments-title">
        <div className="sermons-hero-copy">
          <span className="sermons-hero-kicker">
            <span lang="ta">செய்திகளும் தருணங்களும்</span>
            <small>Messages &amp; Moments</small>
          </span>
          <h1 id="messages-moments-title">Faith shared. <em>Moments remembered.</em></h1>
          <p>Watch worship, teaching, celebrations, and stories from our Tamil church family in Chicago.</p>
          <a className="sermons-channel-link" href={churchYoutubeChannelUrl} target="_blank" rel="noreferrer">
            Browse our YouTube channel <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      {latestVideo ? <LatestVideoBand video={latestVideo} /> : null}

      <section className="section sermons-library" aria-labelledby="sermons-library-title">
        <div className="sermons-library-heading">
          <div id="sermons-library-title"><SectionHeader eyebrow="Video library" title="Explore by collection" /></div>
          <div className="sermons-search-wrap">
            <label htmlFor="sermon-search">Search videos</label>
            <Search size={19} aria-hidden="true" />
            <input id="sermon-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles and collections" />
          </div>
        </div>

        <div className="sermons-category-filters" aria-label="Filter videos by category">
          {VIDEO_CATEGORIES.map((category) => (
            <button className={activeCategory === category.id ? "is-active" : undefined} type="button" key={category.id} aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>
              {category.label}
            </button>
          ))}
        </div>

        {normalizedQuery ? (
          <div className="sermons-results">
            <div aria-live="polite" className="sermons-result-count">Search results ({matches.length})</div>
            {matches.length ? <VideoGrid videos={matches} /> : (
              <div className="ctc-sermons-empty" role="status">
                <VideoOff size={30} aria-hidden="true" />
                <h3>No videos match your search.</h3>
                <p>Try another title or category, or browse every playlist on our YouTube channel.</p>
                <a href={churchYoutubeChannelUrl} target="_blank" rel="noreferrer">Browse YouTube <ExternalLink size={15} aria-hidden="true" /></a>
              </div>
            )}
          </div>
        ) : (
          <div className="sermons-playlists">
            {visiblePlaylists.map((playlist) => {
              const videos = sermonVideos.filter((video) => video.playlistId === playlist.id);
              const isExpanded = Boolean(expandedPlaylists[playlist.id]);
              return videos.length ? (
                <section className="sermons-playlist" key={playlist.id} aria-labelledby={`playlist-${playlist.id}`}>
                  <div className="sermons-playlist-heading" id={`playlist-${playlist.id}`}>
                    <SectionHeader title={playlist.title} />
                    {videos.length > 3 ? (
                      <button
                        type="button"
                        onClick={() => setExpandedPlaylists((prev) => ({ ...prev, [playlist.id]: !isExpanded }))}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Show fewer" : `View all ${videos.length}`}
                        {isExpanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
                      </button>
                    ) : null}
                  </div>
                  <VideoGrid videos={isExpanded ? videos : videos.slice(0, 3)} />
                </section>
              ) : null;
            })}
          </div>
        )}
      </section>
    </>
  );
}
