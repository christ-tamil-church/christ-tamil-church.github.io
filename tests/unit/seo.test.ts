import { describe, expect, it } from "vitest";
import { siteImages } from "../../src/data/images";
import { sermonVideos } from "../../src/data/sermonVideos";
import { churchInfo } from "../../src/data/site";
import {
  absoluteUrl,
  canonicalUrl,
  getPageMeta,
  legacyRedirects,
  normalizePath,
  notFoundMeta,
  pageMeta,
  siteUrl,
  structuredData
} from "../../src/seo";

const paths = Object.keys(pageMeta) as Array<keyof typeof pageMeta>;

type Graph = { "@context": string; "@graph": Array<Record<string, unknown>> };
const nodeOfType = (data: Graph, type: string) => data["@graph"].find((node) => node["@type"] === type);

describe("normalizePath", () => {
  it.each([
    ["/", "/"],
    ["", "/"],
    ["/visit", "/visit"],
    ["/visit/", "/visit"],
    ["/grow/sunday-school//", "/grow/sunday-school"]
  ])("%j → %j", (input, expected) => {
    expect(normalizePath(input)).toBe(expected);
  });
});

describe("canonicalUrl", () => {
  it("uses the site root for the homepage", () => {
    expect(canonicalUrl("/")).toBe(`${siteUrl}/`);
  });

  it("adds exactly one trailing slash to inner pages", () => {
    expect(canonicalUrl("/visit")).toBe(`${siteUrl}/visit/`);
    expect(canonicalUrl("/visit/")).toBe(`${siteUrl}/visit/`);
    expect(canonicalUrl("/grow/kids-circle")).toBe(`${siteUrl}/grow/kids-circle/`);
  });
});

describe("absoluteUrl", () => {
  it("leaves absolute URLs alone", () => {
    expect(absoluteUrl("https://example.com/a.jpg")).toBe("https://example.com/a.jpg");
    expect(absoluteUrl("http://example.com/a.jpg")).toBe("http://example.com/a.jpg");
  });

  it("prefixes root-relative and bare paths with the site URL", () => {
    expect(absoluteUrl("/assets/a.jpg")).toBe(`${siteUrl}/assets/a.jpg`);
    expect(absoluteUrl("assets/a.jpg")).toBe(`${siteUrl}/assets/a.jpg`);
  });
});

describe("getPageMeta", () => {
  it("returns each page's metadata, with or without a trailing slash", () => {
    for (const path of paths) {
      expect(getPageMeta(path)).toBe(pageMeta[path]);
      if (path !== "/") expect(getPageMeta(`${path}/`)).toBe(pageMeta[path]);
    }
  });

  it("falls back to the not-found metadata for unknown paths", () => {
    expect(getPageMeta("/does-not-exist")).toBe(notFoundMeta);
  });
});

describe("pageMeta", () => {
  it("includes every public page", () => {
    expect(paths.sort()).toEqual(
      [
        "/",
        "/connect",
        "/contact",
        "/events",
        "/grow",
        "/grow/bible-study-prayer",
        "/grow/clay-pot",
        "/grow/clay-pot/marumalarchi-aani-adippoma",
        "/grow/clay-pot/pentecostal-paradoxes",
        "/grow/clay-pot/theermanangalum-thadumaatrangalum",
        "/grow/kids-circle",
        "/grow/sunday-school",
        "/sermons",
        "/serve",
        "/visit",
        "/worship"
      ].sort()
    );
  });

  it.each(paths)("%s has a usable title, description and breadcrumb label", (path) => {
    const meta = pageMeta[path] as { title: string; description: string; label?: string };
    expect(meta.title.trim()).not.toBe("");
    expect(meta.description.trim()).not.toBe("");
    // Search engines truncate past roughly these lengths (see the note in src/seo.ts).
    expect(meta.title.length).toBeLessThanOrEqual(70);
    expect(meta.description.length).toBeLessThanOrEqual(170);
    if (path === "/") expect(meta.label).toBeUndefined();
    else expect(meta.label?.trim()).toBeTruthy();
  });

  it("has unique titles and descriptions", () => {
    const titles = paths.map((path) => pageMeta[path].title);
    const descriptions = paths.map((path) => pageMeta[path].description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps the worship time and address in step with churchInfo", () => {
    expect(pageMeta["/"].description).toContain(churchInfo.worship.time);
    expect(pageMeta["/"].description).toContain(churchInfo.address.short);
    expect(pageMeta["/contact"].description).toContain(churchInfo.contact.phone);
  });
});

describe("structuredData", () => {
  it("describes the church and website on every page", () => {
    const data = structuredData("/") as Graph;
    expect(data["@context"]).toBe("https://schema.org");
    const church = nodeOfType(data, "Church");
    expect(church).toMatchObject({
      "@id": `${siteUrl}/#church`,
      url: `${siteUrl}/`,
      telephone: churchInfo.contact.phoneHref.replace("tel:", ""),
      email: churchInfo.contact.email,
      logo: absoluteUrl(siteImages.logo.src),
      address: {
        streetAddress: churchInfo.address.street,
        addressLocality: churchInfo.address.city,
        addressRegion: churchInfo.address.state,
        postalCode: churchInfo.address.zip,
        addressCountry: "US"
      }
    });
    expect(church?.sameAs).toContain(churchInfo.social.facebookUrl);
    expect((church?.sameAs as string[]).every((url) => !url.endsWith("/videos"))).toBe(true);
    expect(nodeOfType(data, "WebSite")).toMatchObject({ url: `${siteUrl}/` });
  });

  it("has no breadcrumbs on the homepage or unknown pages", () => {
    expect(nodeOfType(structuredData("/") as Graph, "BreadcrumbList")).toBeUndefined();
    expect(nodeOfType(structuredData("/nope") as Graph, "BreadcrumbList")).toBeUndefined();
  });

  it("describes the embedded latest video on the Sermons page only", () => {
    const [first] = sermonVideos;
    expect(nodeOfType(structuredData("/sermons/") as Graph, "VideoObject")).toMatchObject({
      "@id": `${siteUrl}/sermons/#latest-video`,
      name: first.title,
      thumbnailUrl: [`https://i.ytimg.com/vi/${first.youtubeId}/hqdefault.jpg`],
      uploadDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}/),
      embedUrl: `https://www.youtube-nocookie.com/embed/${first.youtubeId}`,
      publisher: { "@id": `${siteUrl}/#church` }
    });
    expect(nodeOfType(structuredData("/") as Graph, "VideoObject")).toBeUndefined();
    expect(nodeOfType(structuredData("/worship") as Graph, "VideoObject")).toBeUndefined();
  });

  it("builds nested breadcrumbs from page labels", () => {
    const crumbs = nodeOfType(structuredData("/grow/sunday-school/") as Graph, "BreadcrumbList");
    expect(crumbs?.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Grow", item: `${siteUrl}/grow/` },
      { "@type": "ListItem", position: 3, name: "Sunday School", item: `${siteUrl}/grow/sunday-school/` }
    ]);
  });

  it("serialises to JSON for every page", () => {
    for (const path of paths) expect(() => JSON.stringify(structuredData(path))).not.toThrow();
  });
});

describe("legacyRedirects", () => {
  it.each(Object.entries(legacyRedirects))("%s → %s points at a real page", (from, to) => {
    // Old Clay Pot blog URLs are nested and keep their Tamil slugs.
    expect(from).toMatch(/^(\/[a-z0-9\p{Script=Tamil}-]+)+$/u);
    expect(paths).not.toContain(from);
    expect(paths).toContain(to.split("#")[0]);
  });
});
