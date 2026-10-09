import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { legacyRedirects, pageMeta } from "../../src/seo";
import { renderApp } from "./renderApp";

// The h1 on each page. A change here is a visible content change, so update
// this list on purpose when a headline is rewritten. Whitespace is ignored
// because headlines are split across deliberate line breaks.
const pageHeadings: Record<keyof typeof pageMeta, string> = {
  "/": "வாரும், நாம் எல்லோரும் கூடி, மகிழ் கொண்டாடுவோம்",
  "/visit": "A church home where you can belong.",
  "/worship": "Come as you are. Worship with us.",
  "/grow": "Rooted in Christ. Growing together.",
  "/grow/bible-study-prayer": "Know God through Word and prayer.",
  "/grow/sunday-school": "Helping children grow strong in God’s Word.",
  "/grow/kids-circle": "A little space for faith to bud and bloom.",
  "/serve": "Love your neighbor in practical ways.",
  "/sermons": "Faith shared. Moments remembered.",
  "/connect": "Come as a guest. Leave as family.",
  "/events": "There is a place for you here.",
  "/contact": "Let’s start a conversation."
};

const squash = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, "");

describe("routes", () => {
  it.each(Object.keys(pageMeta) as Array<keyof typeof pageMeta>)("%s renders inside the site layout", (path) => {
    const { container } = renderApp(path);

    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(squash(h1s[0].textContent)).toBe(squash(pageHeadings[path]));

    expect(container.querySelector("#main-content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent(path);
  });

  it("accepts a trailing slash", () => {
    renderApp("/visit/");
    expect(screen.queryByText("We couldn't find that page.")).not.toBeInTheDocument();
  });

  it("shows the not-found page for unknown paths", () => {
    renderApp("/no-such-page");
    expect(screen.getByRole("heading", { level: 1, name: "We couldn't find that page." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return Home" })).toHaveAttribute("href", "/");
  });

  it.each(Object.entries(legacyRedirects))("redirects legacy %s to %s", (from, to) => {
    const { container } = renderApp(from);
    expect(screen.getByTestId("location")).toHaveTextContent(to);
    const hash = to.split("#")[1];
    if (hash) expect(container.querySelector(`#${hash}`)).toBeInTheDocument();
  });
});

describe("in-page anchors used by navigation", () => {
  it.each([
    ["/visit", "mission"],
    ["/visit", "beliefs"],
    ["/connect", "fellowship-hour"],
    ["/events", "upcoming-events"]
  ])("%s has #%s", (path, id) => {
    const { container } = renderApp(path);
    expect(container.querySelector(`#${id}`)).toBeInTheDocument();
  });
});

describe("homepage first-visitor essentials", () => {
  it("shows Sunday worship time, address and the key links", () => {
    const { container } = renderApp("/");
    const main = within(container.querySelector("#main-content") as HTMLElement);
    expect(main.getAllByText(/10:30 AM/).length).toBeGreaterThan(0);
    const hrefs = Array.from(container.querySelectorAll("#main-content a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/visit");
  });
});
