import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRevealGroup } from "../../src/hooks/useRevealGroup";
import { useRevealOnScroll } from "../../src/hooks/useRevealOnScroll";
import { prefersReducedMotion, REDUCED_MOTION_QUERY } from "../../src/utils/motion";
import { mockMatchMedia } from "./setup";

type Callback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

// Captures every IntersectionObserver so a test can fire entries by hand.
function installObserverSpy() {
  const observers: Array<{ callback: Callback; targets: Element[]; disconnect: ReturnType<typeof vi.fn> }> = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      callback: Callback;
      targets: Element[] = [];
      disconnect = vi.fn();
      constructor(callback: Callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe(target: Element) {
        this.targets.push(target);
      }
      unobserve(target: Element) {
        this.targets = this.targets.filter((item) => item !== target);
      }
    }
  );
  return observers;
}

const entry = (target: Element, isIntersecting: boolean, bottom = 100) =>
  ({ target, isIntersecting, boundingClientRect: { bottom } as DOMRect });

function Single(props: Parameters<typeof useRevealOnScroll>[0]) {
  const ref = useRevealOnScroll<HTMLDivElement>(props);
  return (
    <div data-testid="target" ref={ref}>
      <span data-reveal-child>a</span>
      <span data-reveal-child>b</span>
      <span data-reveal-child>c</span>
    </div>
  );
}

function Group() {
  const ref = useRevealGroup<HTMLDivElement>(".band");
  return (
    <div ref={ref}>
      <section className="band" data-testid="one" />
      <section className="band" data-testid="two" />
      <section data-testid="other" />
    </div>
  );
}

describe("prefersReducedMotion", () => {
  it("reads the reduced-motion media query", () => {
    mockMatchMedia((query) => query === REDUCED_MOTION_QUERY);
    expect(prefersReducedMotion()).toBe(true);
    mockMatchMedia(() => false);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("useRevealOnScroll", () => {
  it("reveals immediately when the user prefers reduced motion", () => {
    mockMatchMedia((query) => query === REDUCED_MOTION_QUERY);
    const { getByTestId } = render(<Single />);
    expect(getByTestId("target")).toHaveClass("is-visible");
  });

  it("reveals immediately when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    // `"IntersectionObserver" in window` must be false, so remove the key outright.
    delete (window as unknown as Record<string, unknown>).IntersectionObserver;
    const { getByTestId } = render(<Single />);
    expect(getByTestId("target")).toHaveClass("is-visible");
  });

  it("staggers children with --reveal-delay", () => {
    const { getByTestId } = render(<Single staggerChildren staggerStepMs={50} />);
    const delays = Array.from(getByTestId("target").querySelectorAll<HTMLElement>("[data-reveal-child]")).map((child) =>
      child.style.getPropertyValue("--reveal-delay")
    );
    expect(delays).toEqual(["0ms", "50ms", "100ms"]);
  });

  it("waits for the element to enter the viewport, then stops observing", () => {
    const observers = installObserverSpy();
    const { getByTestId } = render(<Single />);
    const target = getByTestId("target");
    expect(target).not.toHaveClass("is-visible");

    observers[0].callback([entry(target, false)]);
    expect(target).not.toHaveClass("is-visible");

    observers[0].callback([entry(target, true)]);
    expect(target).toHaveClass("is-visible");
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it("reveals elements already scrolled past", () => {
    const observers = installObserverSpy();
    const { getByTestId } = render(<Single />);
    observers[0].callback([entry(getByTestId("target"), false, -10)]);
    expect(getByTestId("target")).toHaveClass("is-visible");
  });

  it("hides again on exit when runOnce is false", () => {
    const observers = installObserverSpy();
    const { getByTestId } = render(<Single runOnce={false} visibleClassName="shown" />);
    const target = getByTestId("target");
    observers[0].callback([entry(target, true)]);
    expect(target).toHaveClass("shown");
    observers[0].callback([entry(target, false)]);
    expect(target).not.toHaveClass("shown");
  });

  it("disconnects on unmount", () => {
    const observers = installObserverSpy();
    const { unmount } = render(<Single />);
    unmount();
    expect(observers[0].disconnect).toHaveBeenCalled();
  });
});

describe("useRevealGroup", () => {
  it("reveals all matching elements when the user prefers reduced motion", () => {
    mockMatchMedia((query) => query === REDUCED_MOTION_QUERY);
    const { getByTestId } = render(<Group />);
    expect(getByTestId("one")).toHaveClass("is-visible");
    expect(getByTestId("two")).toHaveClass("is-visible");
    expect(getByTestId("other")).not.toHaveClass("is-visible");
  });

  it("reveals each matching element independently", () => {
    const observers = installObserverSpy();
    const { getByTestId } = render(<Group />);
    expect(observers[0].targets).toEqual([getByTestId("one"), getByTestId("two")]);

    observers[0].callback([entry(getByTestId("two"), true)]);
    expect(getByTestId("one")).not.toHaveClass("is-visible");
    expect(getByTestId("two")).toHaveClass("is-visible");
    expect(observers[0].targets).toEqual([getByTestId("one")]);
  });
});
