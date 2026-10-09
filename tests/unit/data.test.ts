import { describe, expect, it } from "vitest";
import { siteImages, type SiteImage } from "../../src/data/images";
import { ministryPathways, pathwayLabels } from "../../src/data/ministryPathways";
import { churchYoutubeChannelUrl, sermonPlaylists, sermonVideos } from "../../src/data/sermonVideos";
import { beliefs, churchEvents, churchInfo, verseOfTheWeek } from "../../src/data/site";
import { pageMeta } from "../../src/seo";
import { formatStep } from "../../src/utils/format";

const pagePaths = Object.keys(pageMeta);

describe("churchInfo", () => {
  it("keeps tel: and mailto: links in step with the displayed values", () => {
    const digits = churchInfo.contact.phone.replace(/\D/g, "");
    expect(churchInfo.contact.phoneHref).toBe(`tel:+1${digits}`);
    expect(churchInfo.contact.emailHref).toBe(`mailto:${churchInfo.contact.email}`);
  });

  it("keeps the short address and worship schedule consistent", () => {
    const { street, city, state } = churchInfo.address;
    expect(churchInfo.address.short).toBe(`${street}, ${city}, ${state}`);
    expect(churchInfo.worship.schedule).toContain(churchInfo.worship.time);
    expect(churchInfo.address.directionsUrl).toMatch(/^https:\/\/www\.google\.com\/maps\//);
  });

  it("links to the church's social accounts over https", () => {
    for (const url of Object.values(churchInfo.social)) expect(url).toMatch(/^https:\/\//);
    expect(churchInfo.social.youtubeUrl).toBe(churchYoutubeChannelUrl);
  });
});

describe("verseOfTheWeek and beliefs", () => {
  it("has a verse with a reference", () => {
    expect(verseOfTheWeek.text.trim()).not.toBe("");
    expect(verseOfTheWeek.reference).toMatch(/\d+:\d+/);
  });

  it("lists beliefs with unique titles and text", () => {
    expect(beliefs.length).toBeGreaterThan(0);
    expect(new Set(beliefs.map((belief) => belief.title)).size).toBe(beliefs.length);
    for (const belief of beliefs) expect(belief.text.trim()).not.toBe("");
  });
});

describe("churchEvents", () => {
  it("has unique titles (they are React keys and lookup keys)", () => {
    const titles = churchEvents.map((event) => event.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(churchEvents.map((event) => [event.title, event] as const))("%s is complete", (_, event) => {
    expect(event.frequency.trim()).not.toBe("");
    expect(event.category.trim()).not.toBe("");
    expect(event.description.trim()).not.toBe("");
    expect(event.date.trim()).not.toBe("");
    // An image is optional by type, but a missing registry entry shows up as undefined.
    expect(event.image).not.toBeUndefined();
  });

  it("includes the events other pages look up by title", () => {
    const titles = churchEvents.map((event) => event.title);
    for (const title of ["Sunday Worship Service", "Bible Study & Prayer", "Prayer Conference", "Fasting Prayer"]) {
      expect(titles).toContain(title);
    }
  });

  it("lists Sunday worship at the church's worship time", () => {
    const sunday = churchEvents.find((event) => event.title === "Sunday Worship Service");
    expect(sunday && "time" in sunday ? sunday.time : undefined).toBe(churchInfo.worship.time);
  });
});

describe("sermon videos", () => {
  const playlistIds = sermonPlaylists.map((playlist) => playlist.id);

  it("has unique playlist ids and titles", () => {
    expect(new Set(playlistIds).size).toBe(playlistIds.length);
    expect(new Set(sermonPlaylists.map((playlist) => playlist.title)).size).toBe(sermonPlaylists.length);
  });

  it("puts at least one video in every playlist", () => {
    for (const id of playlistIds) {
      expect(sermonVideos.some((video) => video.playlistId === id), id).toBe(true);
    }
  });

  it("uses well-formed YouTube ids and non-empty titles", () => {
    for (const video of sermonVideos) {
      expect(video.youtubeId, video.title).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(video.title.trim()).not.toBe("");
      expect(playlistIds).toContain(video.playlistId);
    }
  });

  it("never lists the same video twice in one playlist (cards are keyed by playlist + id)", () => {
    const keys = sermonVideos.map((video) => `${video.playlistId}-${video.youtubeId}`);
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
    expect(duplicates).toEqual([]);
  });

  it("has no mojibake from copy-pasted titles", () => {
    for (const video of sermonVideos) expect(video.title).not.toMatch(/â€|Ã/);
  });
});

describe("siteImages", () => {
  const entries = Object.entries(siteImages) as Array<[string, SiteImage]>;

  it("has unique ids", () => {
    const ids = entries.map(([, image]) => image.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(entries)("%s resolves to a file and is described", (_, image) => {
    expect(typeof image.src).toBe("string");
    expect(image.src).not.toBe("");
    expect(typeof image.alt).toBe("string");
    expect(image.usage.trim()).not.toBe("");
  });

  it("gives the logo and the share image meaningful alt text", () => {
    expect(siteImages.logo.alt.trim()).not.toBe("");
    expect(siteImages.hero.alt.trim()).not.toBe("");
  });
});

describe("ministryPathways", () => {
  it("covers the four pathways in order", () => {
    expect(ministryPathways.map((pathway) => pathway.id)).toEqual(["worship", "connect", "grow", "serve"]);
  });

  it.each(ministryPathways.map((pathway) => [pathway.id, pathway] as const))("%s is well-formed", (id, pathway) => {
    expect(pathway.labelTa).toBe(pathwayLabels[id].ta);
    expect(pathway.labelEn).toBe(pathwayLabels[id].en);
    expect(pathway.words.length).toBeGreaterThan(0);
    expect(pathway.accentWord).toBeGreaterThanOrEqual(0);
    expect(pathway.accentWord).toBeLessThan(pathway.words.length);
    expect(pathway.ministries.length).toBeGreaterThan(0);
    expect(pagePaths).toContain(pathway.cta.href);
  });
});

describe("formatStep", () => {
  it.each([
    [0, "01"],
    [8, "09"],
    [9, "10"],
    [99, "100"]
  ])("%i → %s", (index, expected) => {
    expect(formatStep(index)).toBe(expected);
  });
});
