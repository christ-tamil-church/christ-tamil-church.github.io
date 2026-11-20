import { act, fireEvent, screen, within } from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { churchInfo } from "../../src/data/site";
import { detectBrowserContext, systemBrowserUrl } from "../../src/utils/inAppBrowser";
import { renderApp } from "./renderApp";

// Representative user-agent strings, one per app family.
const UA = {
  facebookIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/490.0.0.40.107;FBBV/123;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/18.1;FBSS/3;FBCR/;FBID/phone;FBLC/en_US;FBOP/80]",
  facebookAndroid:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP1A.240505.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.53 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/466.0.0.53.109;]",
  messengerIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/460.0.0.36.109;FBBV/1;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.5]",
  instagramIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0.0 (iPhone15,3; iOS 18_0; en_US; en; scale=3.00; 1290x2796; 123456789)",
  instagramAndroid:
    "Mozilla/5.0 (Linux; Android 13; SM-S911B Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.82 Mobile Safari/537.36 Instagram 330.0.0.40.92 Android",
  threadsIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Barcelona 330.0.0.0 (iPhone14,2; iOS 17_4; en_US)",
  tiktokAndroid:
    "Mozilla/5.0 (Linux; Android 12; SM-A525F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.43 Mobile Safari/537.36 trill_330003 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/33.0.3 ByteLocale/en BytedanceWebview/d8a21c6",
  snapchatIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Snapchat/12.70.0.37 (like Safari/8617.1.17.10.6, panda)",
  linkedinIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.29.6",
  unknownIosWebView:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  unknownAndroidWebView:
    "Mozilla/5.0 (Linux; Android 14; Pixel 7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.0.0 Mobile Safari/537.36",
  // Opened via the system browser view or the real browser: not in-app.
  safariIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  chromeIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.6723.90 Mobile/15E148 Safari/604.1",
  chromeAndroid:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  chromeDesktop:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
};

describe("detectBrowserContext", () => {
  it.each([
    ["facebookIos", "facebook", "ios"],
    ["facebookAndroid", "facebook", "android"],
    ["messengerIos", "messenger", "ios"],
    ["instagramIos", "instagram", "ios"],
    ["instagramAndroid", "instagram", "android"],
    ["threadsIos", "threads", "ios"],
    ["tiktokAndroid", "tiktok", "android"],
    ["snapchatIos", "snapchat", "ios"],
    ["linkedinIos", "linkedin", "ios"],
    ["unknownIosWebView", "other", "ios"],
    ["unknownAndroidWebView", "other", "android"]
  ] as const)("flags %s as an in-app browser", (key, app, os) => {
    expect(detectBrowserContext(UA[key])).toEqual({ inApp: true, app, os });
  });

  it.each(["safariIos", "chromeIos", "chromeAndroid", "chromeDesktop"] as const)("leaves %s alone", (key) => {
    expect(detectBrowserContext(UA[key]).inApp).toBe(false);
  });

  it("treats a home-screen web app as a normal browser", () => {
    expect(detectBrowserContext(UA.unknownIosWebView, true).inApp).toBe(false);
  });
});

describe("systemBrowserUrl", () => {
  const url = "https://christtamilchurch.org/contact?x=1";

  it("uses a Chrome intent on Android", () => {
    expect(systemBrowserUrl(url, { inApp: true, app: "facebook", os: "android" })).toBe(
      `intent://christtamilchurch.org/contact?x=1#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`
    );
  });

  it("uses the Safari scheme on iOS, and Instagram's own escape there", () => {
    expect(systemBrowserUrl(url, { inApp: true, app: "facebook", os: "ios" })).toBe(
      "x-safari-https://christtamilchurch.org/contact?x=1"
    );
    expect(systemBrowserUrl(url, { inApp: true, app: "instagram", os: "ios" })).toBe(
      `instagram://extbrowser/?url=${encodeURIComponent(url)}`
    );
  });
});

describe("links inside an in-app browser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  const asFacebook = () => vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(UA.facebookIos);

  it("opens external links in place instead of a new tab", () => {
    asFacebook();
    renderApp("/contact");
    const footer = within(screen.getByRole("contentinfo"));
    const facebook = footer.getByRole("link", { name: "Christ Tamil Church on Facebook" });
    expect(facebook).toHaveAttribute("href", churchInfo.social.facebookUrl);
    expect(facebook).not.toHaveAttribute("target");
    expect(document.querySelectorAll('a[target="_blank"]')).toHaveLength(0);
  });

  it("turns a tap on Call into a sheet that can call, copy or open the browser", async () => {
    asFacebook();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", { value: { writeText }, configurable: true });
    renderApp("/");
    const footer = within(screen.getByRole("contentinfo"));
    fireEvent.click(footer.getByRole("link", { name: churchInfo.contact.phone }));

    const sheet = within(screen.getByRole("dialog", { name: "Call the church" }));
    expect(sheet.getByRole("link", { name: `Call ${churchInfo.contact.phone}` })).toHaveAttribute(
      "href",
      churchInfo.contact.phoneHref
    );
    await act(async () => {
      fireEvent.click(sheet.getByRole("button", { name: "Copy number" }));
    });
    expect(writeText).toHaveBeenCalledWith(churchInfo.contact.phone);
    expect(sheet.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(sheet.getByRole("button", { name: "Open in your browser" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("offers the open-in-browser bar, and remembers when it is dismissed", () => {
    asFacebook();
    const { unmount } = renderApp("/");
    const bar = within(screen.getByRole("complementary", { name: "Open in your browser" }));
    expect(bar.getByText(/Viewing in Facebook/)).toBeInTheDocument();
    fireEvent.click(bar.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("complementary", { name: "Open in your browser" })).not.toBeInTheDocument();
    unmount();
    renderApp("/");
    expect(screen.queryByRole("complementary", { name: "Open in your browser" })).not.toBeInTheDocument();
  });

  it("changes nothing in a normal browser", () => {
    renderApp("/");
    const footer = within(screen.getByRole("contentinfo"));
    expect(footer.getByRole("link", { name: "Christ Tamil Church on Facebook" })).toHaveAttribute("target", "_blank");
    fireEvent.click(footer.getByRole("link", { name: churchInfo.contact.phone }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "Open in your browser" })).not.toBeInTheDocument();
  });
});

// Guardrail: off-site, call and email links must go through ExternalLink /
// ContactLink, which know how to behave inside Facebook-style in-app browsers.
describe("link policy", () => {
  const root = join(__dirname, "../../src");
  const allowed = new Set(["components/ExternalLink.tsx", "components/ContactLink.tsx"]);
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return files(path);
      return path.endsWith(".tsx") ? [path] : [];
    });

  it.each(files(root).map((path) => relative(root, path).replace(/\\/g, "/")).filter((path) => !allowed.has(path)))(
    "%s uses ExternalLink / ContactLink for off-site, call and email links",
    (path) => {
      const source = readFileSync(join(root, path), "utf8");
      expect(source, "use ExternalLink instead of target=\"_blank\"").not.toMatch(/target=["{]/);
      expect(source, "use ContactLink instead of a raw tel:/mailto: href").not.toMatch(
        /href=\{[^}]*(phoneHref|emailHref)\}|href=["'`](tel|mailto):/
      );
    }
  );
});
