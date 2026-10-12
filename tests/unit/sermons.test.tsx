import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { splitVideoTitle, videoSummary, videoUploadDate } from "../../src/data/latestVideo";
import { churchYoutubeChannelUrl, sermonPlaylists, sermonVideos } from "../../src/data/sermonVideos";
import { renderApp } from "./renderApp";

const WATCH = /^Watch .* on YouTube$/;
const videoCards = () => screen.queryAllByRole("link", { name: WATCH });
const countIn = (id: string) => sermonVideos.filter((video) => video.playlistId === id).length;
const playlistSection = (title: string) =>
  screen.getByRole("heading", { name: title }).closest("section.sermons-playlist") as HTMLElement;
const visiblePlaylistTitles = () =>
  screen
    .getAllByRole("heading")
    .map((heading) => heading.textContent)
    .filter((text) => sermonPlaylists.some((playlist) => playlist.title === text));

describe("Sermons page", () => {
  it("shows every playlist with up to three videos each", () => {
    renderApp("/sermons");
    expect(visiblePlaylistTitles()).toEqual(sermonPlaylists.map((playlist) => playlist.title));
    for (const playlist of sermonPlaylists) {
      const total = countIn(playlist.id);
      const section = within(playlistSection(playlist.title));
      expect(section.getAllByRole("link", { name: WATCH })).toHaveLength(Math.min(3, total));
      if (total > 3) expect(section.getByRole("button", { name: `View all ${total}` })).toBeInTheDocument();
      else expect(section.queryByRole("button")).not.toBeInTheDocument();
    }
  });

  it("links each card to its YouTube video in a new tab", () => {
    renderApp("/sermons");
    const first = sermonVideos.find((video) => video.playlistId === sermonPlaylists[0].id)!;
    const card = screen.getAllByRole("link", { name: `Watch ${first.title} on YouTube` })[0];
    expect(card).toHaveAttribute("href", `https://www.youtube.com/watch?v=${first.youtubeId}`);
    expect(card).toHaveAttribute("target", "_blank");
  });

  it("expands and collapses a playlist", async () => {
    const user = userEvent.setup();
    renderApp("/sermons");
    const playlist = sermonPlaylists.find((item) => countIn(item.id) > 3)!;
    const total = countIn(playlist.id);
    const section = within(playlistSection(playlist.title));

    const toggle = section.getByRole("button", { name: `View all ${total}` });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(section.getAllByRole("link", { name: WATCH })).toHaveLength(total);

    await user.click(section.getByRole("button", { name: "Show fewer" }));
    expect(section.getAllByRole("link", { name: WATCH })).toHaveLength(3);
  });

  it.each([
    ["Worship", ["praise-worship"]],
    ["Sermons", ["sermons-guest-messages", "morning-devotionals"]],
    ["Children", ["vbs", "kids-at-ctc"]],
    ["Celebrations", ["women-of-ctc", "church-anniversary", "christmas-programs"]]
  ])("filters to the %s category", async (category, playlistIds) => {
    const user = userEvent.setup();
    renderApp("/sermons");
    const button = screen.getByRole("button", { name: category });
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");

    const expected = sermonPlaylists
      .filter((playlist) => playlistIds.includes(playlist.id) && countIn(playlist.id) > 0)
      .map((playlist) => playlist.title);
    expect(visiblePlaylistTitles()).toEqual(expected);
  });

  it("searches titles and collection names, ignoring case and outer spaces", async () => {
    const user = userEvent.setup();
    renderApp("/sermons");
    await user.type(screen.getByRole("searchbox", { name: "Search videos" }), "  vbs 2026 ");
    const expected = sermonVideos.filter((video) => {
      const collection = sermonPlaylists.find((playlist) => playlist.id === video.playlistId)!.title;
      return video.title.toLowerCase().includes("vbs 2026") || collection.toLowerCase().includes("vbs 2026");
    });
    expect(expected.length).toBeGreaterThan(0);
    expect(screen.getByText(`Search results (${expected.length})`)).toBeInTheDocument();
    expect(videoCards()).toHaveLength(expected.length);
  });

  it("combines search with the active category", async () => {
    const user = userEvent.setup();
    renderApp("/sermons");
    await user.click(screen.getByRole("button", { name: "Celebrations" }));
    await user.type(screen.getByRole("searchbox"), "anniversary");
    const expected = sermonVideos.filter(
      (video) =>
        ["women-of-ctc", "church-anniversary", "christmas-programs"].includes(video.playlistId) &&
        (/anniversary/i.test(video.title) || video.playlistId === "church-anniversary")
    );
    expect(screen.getByText(`Search results (${expected.length})`)).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderApp("/sermons");
    await user.type(screen.getByRole("searchbox"), "zzzz-no-such-video");
    expect(screen.getByText("Search results (0)")).toBeInTheDocument();
    const empty = screen.getByRole("status");
    expect(within(empty).getByText("No videos match your search.")).toBeInTheDocument();
    expect(within(empty).getByRole("link", { name: /Browse YouTube/ })).toHaveAttribute("href", churchYoutubeChannelUrl);
    expect(videoCards()).toHaveLength(0);
  });

  it("returns to the playlists when the search is cleared", async () => {
    const user = userEvent.setup();
    renderApp("/sermons");
    const search = screen.getByRole("searchbox");
    await user.type(search, "christmas");
    await user.clear(search);
    expect(screen.queryByText(/Search results/)).not.toBeInTheDocument();
    expect(visiblePlaylistTitles()).toEqual(sermonPlaylists.map((playlist) => playlist.title));
  });

  it("shows the date from a video title on its card", () => {
    renderApp("/sermons");
    // Any card showing on first load whose title carries a full date; the
    // newest videos change, so don't pin a specific one.
    const card = videoCards().find((link) => splitVideoTitle(link.getAttribute("aria-label")!).date)!;
    const { date } = splitVideoTitle(card.getAttribute("aria-label")!);
    expect(within(card).getByText(date!).tagName).toBe("TIME");
  });

  it("features the latest video with an embedded player", () => {
    // Tests never fetch YouTube's feed, so the first listed video stands in.
    renderApp("/sermons");
    const [first] = sermonVideos;
    const { name, date } = splitVideoTitle(first.title);
    const band = document.querySelector<HTMLElement>("section.sermons-latest")!;
    const heading = within(band).getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(name);
    expect(band).toHaveAttribute("aria-labelledby", heading.id);
    const player = band.querySelector("iframe")!;
    expect(player).toHaveAttribute("src", `https://www.youtube-nocookie.com/embed/${first.youtubeId}`);
    expect(player).toHaveAttribute("title", `${first.title} (YouTube video player)`);
    if (date) expect(within(band).getByText(date)).toHaveAttribute("datetime", videoUploadDate(first));
    const link = within(band).getByRole("link", { name: "Open on YouTube" });
    expect(link).toHaveAttribute("href", `https://www.youtube.com/watch?v=${first.youtubeId}`);
    expect(link).toHaveAttribute("target", "_blank");
  });
});

describe("latest video helpers", () => {
  it("splits a church video title into name, detail and date", () => {
    expect(splitVideoTitle("Christ Tamil Church Chicago – Praise & Worship | October 4, 2026")).toEqual({
      name: "Praise & Worship",
      date: "October 4, 2026",
      detail: undefined
    });
    expect(splitVideoTitle("Christ Tamil Church Chicago – Praise & Worship | September 6, 2026 (Family Camp)")).toMatchObject({
      name: "Praise & Worship",
      date: "September 6, 2026",
      detail: "(Family Camp)"
    });
    expect(splitVideoTitle("Christmas Program")).toEqual({ name: "Christmas Program", date: undefined, detail: undefined });
  });

  it("prefers YouTube's publish time and falls back to the date in the title", () => {
    expect(videoUploadDate({ youtubeId: "x", title: "Worship | March 9, 2025", publishedAt: "2025-03-10T05:00:00+00:00" })).toBe("2025-03-10T05:00:00+00:00");
    expect(videoUploadDate({ youtubeId: "x", title: "Worship | March 9, 2025" })).toBe("2025-03-09");
    expect(videoUploadDate({ youtubeId: "x", title: "Worship" })).toBeUndefined();
  });

  it("summarizes the description without emoji or hashtags", () => {
    const description = "Join us this Sunday ✨ for worship #CTC #shorts\n\nSecond paragraph.";
    expect(videoSummary({ youtubeId: "x", title: "t", description })).toBe("Join us this Sunday for worship Second paragraph.");
    expect(videoSummary({ youtubeId: "x", title: "t", description: "word ".repeat(80) }, 40)).toMatch(/^(word ){6,}word…$/);
    expect(videoSummary({ youtubeId: "x", title: "t" })).toBeUndefined();
  });
});
