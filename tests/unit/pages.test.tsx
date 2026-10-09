import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { beliefs, churchEvents, churchInfo } from "../../src/data/site";
import { renderApp } from "./renderApp";

const main = (container: HTMLElement) => within(container.querySelector("#main-content") as HTMLElement);

describe("Events page", () => {
  it("lists every church event in data order", () => {
    renderApp("/events");
    const list = screen.getByRole("region", { name: "Upcoming events" });
    const titles = within(list).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
    expect(titles).toEqual(churchEvents.map((event) => event.title));
  });

  it("shows each event's schedule details", () => {
    renderApp("/events");
    for (const event of churchEvents) {
      const row = screen.getByRole("heading", { name: event.title, level: 3 }).closest("article") as HTMLElement;
      const scoped = within(row);
      expect(scoped.getByText(event.category)).toBeInTheDocument();
      expect(scoped.getByText(event.description)).toBeInTheDocument();
      if ("time" in event) expect(row).toHaveTextContent(event.time);
      if ("location" in event) expect(row).toHaveTextContent(event.location);
    }
  });
});

describe("Bible Study & Prayer page", () => {
  it("reads each gathering's schedule from churchEvents", () => {
    renderApp("/grow/bible-study-prayer");
    for (const title of ["Bible Study & Prayer", "Prayer Conference", "Fasting Prayer"]) {
      const event = churchEvents.find((item) => item.title === title)!;
      const row = screen.getByRole("heading", { name: title, level: 3 }).closest("article") as HTMLElement;
      expect(row).toHaveTextContent(`${event.frequency} · ${"time" in event ? event.time : ""}`);
    }
  });
});

describe("Visit page", () => {
  it("lists every belief", () => {
    const { container } = renderApp("/visit");
    const page = main(container);
    for (const belief of beliefs) expect(page.getByText(belief.title)).toBeInTheDocument();
  });

  it("shows the worship time and address", () => {
    const { container } = renderApp("/visit");
    const text = container.querySelector("#main-content")?.textContent ?? "";
    expect(text).toContain(churchInfo.worship.time);
    expect(text).toContain(churchInfo.address.street);
  });
});

describe("Contact page", () => {
  it("offers phone, email and directions", () => {
    const { container } = renderApp("/contact");
    const page = main(container);
    expect(page.getByRole("link", { name: `Call ${churchInfo.contact.phone}` })).toHaveAttribute("href", churchInfo.contact.phoneHref);
    expect(page.getAllByRole("link", { name: churchInfo.contact.email })[0]).toHaveAttribute("href", churchInfo.contact.emailHref);
    expect(page.getByRole("link", { name: /Get directions/ })).toHaveAttribute("href", churchInfo.address.directionsUrl);
  });
});

describe("external links", () => {
  it.each(["/", "/visit", "/worship", "/grow", "/serve", "/sermons", "/connect", "/events", "/contact"])(
    "%s opens new-tab links with rel=noreferrer",
    (path) => {
      const { container } = renderApp(path);
      for (const link of Array.from(container.querySelectorAll('a[target="_blank"]'))) {
        expect(link.getAttribute("rel") ?? "", link.getAttribute("href") ?? "").toContain("noreferrer");
      }
    }
  );

  it.each(["/", "/visit", "/worship", "/grow", "/serve", "/connect", "/events", "/contact"])(
    "%s gives every image an alt attribute",
    (path) => {
      renderApp(path);
      for (const image of Array.from(document.body.querySelectorAll("img"))) {
        expect(image.hasAttribute("alt"), image.getAttribute("src") ?? "").toBe(true);
      }
    }
  );
});
