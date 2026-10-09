import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom leaves out the browser APIs the site leans on for motion and layout.
// These stand-ins do nothing on their own; tests that care about a specific
// behaviour (e.g. reduced motion) override them.

export function mockMatchMedia(matches: (query: string) => boolean = () => false) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false)
  })) as unknown as typeof window.matchMedia;
}

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function installBrowserStubs() {
  mockMatchMedia();
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
}

// The SSR test runs in a plain Node environment, with no window to patch.
if (typeof window !== "undefined") {
  installBrowserStubs();

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    installBrowserStubs();
  });
}
