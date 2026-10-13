import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { audioSermonUrl, formatClock, formatDuration, preservedSermons, speakerGroup } from "../../src/data/audioArchive";
import { audioSermons } from "../../src/data/audioSermons";
import { renderApp } from "./renderApp";

const PLAY = /^Play: /;

describe("audio sermon data", () => {
  it("lists each recording file once, newest first", () => {
    expect(new Set(audioSermons.map((sermon) => sermon.file)).size).toBe(audioSermons.length);
    const dates = audioSermons.map((sermon) => sermon.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("gives every preserved recording a duration", () => {
    for (const sermon of preservedSermons) expect(sermon.durationSec).toBeGreaterThan(60);
  });

  it("formats lengths and clock times", () => {
    expect(formatDuration(2028)).toBe("34 min");
    expect(formatDuration(4199)).toBe("1 hr 10 min");
    expect(formatClock(65)).toBe("1:05");
    expect(formatClock(3725)).toBe("1:02:05");
  });
});

describe("Audio archive page", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  });

  it("shows only surviving recordings by default, and every Sunday on request", async () => {
    const user = userEvent.setup();
    renderApp("/sermons/audio-archive");
    const recordedOnly = screen.getByRole("checkbox", { name: "Only show recordings" });
    expect(recordedOnly).toBeChecked();
    expect(screen.getAllByRole("button", { name: PLAY })).toHaveLength(preservedSermons.length);
    expect(screen.queryByText("Not preserved")).not.toBeInTheDocument();

    await user.click(recordedOnly);
    expect(screen.getAllByRole("button", { name: PLAY })).toHaveLength(preservedSermons.length);
    expect(screen.getAllByText("Not preserved")).toHaveLength(audioSermons.length - preservedSermons.length);
  });

  it("filters by speaker", async () => {
    const user = userEvent.setup();
    renderApp("/sermons/audio-archive");
    await user.click(screen.getByRole("button", { name: "Guest speakers" }));
    const guests = audioSermons.filter((sermon) => speakerGroup(sermon.speaker) === "guests");
    expect(screen.getAllByRole("button", { name: PLAY })).toHaveLength(guests.filter((sermon) => sermon.preserved).length);
  });

  it("shows a way back when a search finds nothing", async () => {
    const user = userEvent.setup();
    renderApp("/sermons/audio-archive");
    await user.type(screen.getByRole("searchbox", { name: "Search the archive" }), "zzzz");
    expect(screen.getByRole("heading", { name: "Nothing matches that search." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search and filters" }));
    expect(screen.getAllByRole("button", { name: PLAY })).toHaveLength(preservedSermons.length);
  });

  it("opens the player on the chosen recording from archive.org", async () => {
    const user = userEvent.setup();
    const { container } = renderApp("/sermons/audio-archive");
    const latest = preservedSermons[0];
    await user.click(screen.getByRole("button", { name: "Play the most recent recording" }));
    const player = within(screen.getByRole("region", { name: "Audio player" }));
    expect(player.getByText(latest.speaker, { exact: false })).toBeInTheDocument();
    expect(container.querySelector("audio")).toHaveAttribute("src", audioSermonUrl(latest));
    expect(player.getByRole("link", { name: /^Download / })).toHaveAttribute("href", audioSermonUrl(latest));
    await user.click(player.getByRole("button", { name: "Close player" }));
    expect(screen.queryByRole("region", { name: "Audio player" })).not.toBeInTheDocument();
  });
});
