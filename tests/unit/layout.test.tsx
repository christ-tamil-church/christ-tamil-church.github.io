import { act, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { churchInfo } from "../../src/data/site";
import { canonicalUrl, notFoundMeta, pageMeta } from "../../src/seo";
import { renderApp } from "./renderApp";

const headTags = `
  <meta name="description" content="" />
  <meta property="og:title" content="" />
  <meta property="og:description" content="" />
  <meta property="og:url" content="" />
  <link rel="canonical" href="" />
`;

const attr = (selector: string, name: string) => document.head.querySelector(selector)?.getAttribute(name);
const primaryNav = () => screen.getByRole("navigation", { name: "Primary navigation" });

describe("Layout header and navigation", () => {
  it("links the logo home and offers a skip link", () => {
    const { container } = renderApp("/visit");
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
    const header = container.querySelector(".site-header") as HTMLElement;
    expect(within(header).getAllByRole("link")[0]).toHaveAttribute("href", "/");
  });

  it("shows every section in the primary navigation", () => {
    renderApp("/");
    const hrefs = within(primaryNav()).getAllByRole("link").map((link) => link.getAttribute("href"));
    for (const href of [
      "/visit",
      "/visit#mission",
      "/visit#beliefs",
      "/worship",
      "/connect",
      "/events",
      "/connect#fellowship-hour",
      "/grow",
      "/grow/bible-study-prayer",
      "/grow/sunday-school",
      "/grow/kids-circle",
      "/sermons",
      "/serve",
      "/contact"
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it("only links to pages that exist", () => {
    const { container } = renderApp("/");
    const paths = Object.keys(pageMeta);
    const internal = Array.from(container.querySelectorAll<HTMLAnchorElement>("header a, footer a"))
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/"));
    expect(internal.length).toBeGreaterThan(0);
    for (const href of internal) expect(paths).toContain(href.split("#")[0]);
  });

  it("marks the current section as active", () => {
    renderApp("/grow/sunday-school");
    const links = within(primaryNav()).getAllByRole("link");
    const grow = links.find((link) => link.getAttribute("href") === "/grow");
    const worship = links.find((link) => link.getAttribute("href") === "/worship");
    expect(grow).toHaveClass("active");
    expect(worship).not.toHaveClass("active");
  });

  it("opens and closes the mobile menu with the toggle and Escape", async () => {
    const user = userEvent.setup();
    renderApp("/");
    const toggle = screen.getByRole("button", { name: "Open navigation" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(primaryNav()).not.toHaveClass("is-open");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
    expect(primaryNav()).toHaveClass("is-open");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
    expect(primaryNav()).not.toHaveClass("is-open");
  });

  it("closes the mobile menu after navigating", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const contact = within(primaryNav())
      .getAllByRole("link")
      .find((link) => link.textContent === "Contact")!;
    await user.click(contact);
    expect(screen.getByTestId("location")).toHaveTextContent("/contact");
    expect(primaryNav()).not.toHaveClass("is-open");
  });

  it("expands one mobile submenu at a time", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("button", { name: "Expand Grow menu" }));
    expect(screen.getByRole("button", { name: "Collapse Grow menu" })).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Expand Connect menu" }));
    expect(screen.getByRole("button", { name: "Collapse Connect menu" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Expand Grow menu" })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Layout footer", () => {
  it("shows the church's contact details and service time", () => {
    renderApp("/");
    const footer = within(screen.getByRole("contentinfo"));
    expect(footer.getByRole("link", { name: churchInfo.contact.phone })).toHaveAttribute("href", churchInfo.contact.phoneHref);
    expect(footer.getByRole("link", { name: churchInfo.contact.email })).toHaveAttribute("href", churchInfo.contact.emailHref);
    expect(footer.getByRole("link", { name: churchInfo.worship.schedule })).toHaveAttribute("href", "/worship");
    expect(footer.getByRole("link", { name: new RegExp(churchInfo.address.short) })).toHaveAttribute(
      "href",
      churchInfo.address.directionsUrl
    );
  });

  it("opens social links safely in a new tab", () => {
    renderApp("/");
    const footer = within(screen.getByRole("contentinfo"));
    for (const [name, href] of [
      ["Christ Tamil Church on Facebook", churchInfo.social.facebookUrl],
      ["Christ Tamil Church on Instagram", churchInfo.social.instagramUrl],
      ["Christ Tamil Church on YouTube", churchInfo.social.youtubeUrl]
    ]) {
      const link = footer.getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });
});

describe("Layout head metadata", () => {
  beforeEach(() => {
    document.head.innerHTML = headTags;
  });

  afterEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it.each(Object.keys(pageMeta) as Array<keyof typeof pageMeta>)("syncs title, description and canonical for %s", (path) => {
    renderApp(path);
    const meta = pageMeta[path];
    expect(document.title).toBe(meta.title);
    expect(attr('meta[name="description"]', "content")).toBe(meta.description);
    expect(attr('meta[property="og:title"]', "content")).toBe(meta.title);
    expect(attr('meta[property="og:description"]', "content")).toBe(meta.description);
    expect(attr('meta[property="og:url"]', "content")).toBe(canonicalUrl(path));
    expect(attr('link[rel="canonical"]', "href")).toBe(canonicalUrl(path));
  });

  it("uses the not-found title for unknown pages", () => {
    renderApp("/nope");
    expect(document.title).toBe(notFoundMeta.title);
  });

  it("updates the head on client-side navigation", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(within(screen.getByRole("contentinfo")).getByRole("link", { name: "Events" }));
    await act(async () => {});
    expect(document.title).toBe(pageMeta["/events"].title);
    expect(attr('link[rel="canonical"]', "href")).toBe(canonicalUrl("/events"));
  });
});
