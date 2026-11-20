import { useEffect, useState } from "react";

/* In-app browsers (Facebook, Instagram, TikTok, …) open shared links inside a
   bare web view instead of Safari/Chrome. Links that must LEAVE the web view
   — `tel:`, `mailto:`, new-tab requests, downloads, hand-offs to the Facebook
   or Maps app — work only if the host app forwards them, and many don't.
   The host app names itself in the user-agent, so the site can detect it and
   offer routes that always work (see ExternalLink and ContactLink). */

export type InAppName =
  | "facebook"
  | "messenger"
  | "instagram"
  | "threads"
  | "tiktok"
  | "snapchat"
  | "linkedin"
  | "pinterest"
  | "line"
  | "wechat"
  | "other";

export type BrowserContext = {
  inApp: boolean;
  app: InAppName | null;
  os: "ios" | "android" | "other";
};

const NOT_IN_APP: BrowserContext = { inApp: false, app: null, os: "other" };

// Order matters: Messenger and Instagram builds also carry the FBAN/FBAV tokens.
const KNOWN_APPS: Array<[InAppName, RegExp]> = [
  ["instagram", /Instagram/i],
  ["threads", /Barcelona/i],
  ["messenger", /Messenger|FB_IAB\/MESSENGER|FBAN\/MessengerForiOS/i],
  ["facebook", /FBAN|FBAV|FB_IAB|FBIOS|FB4A|FBSN/i],
  ["tiktok", /musical_ly|BytedanceWebview|TikTok|trill_/i],
  ["snapchat", /Snapchat/i],
  ["linkedin", /LinkedInApp/i],
  ["pinterest", /Pinterest/i],
  ["line", /\bLine\//],
  ["wechat", /MicroMessenger/i]
];

function detectOs(ua: string): BrowserContext["os"] {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

/** Pure user-agent check, exported for tests. `standalone` = launched from the home screen. */
export function detectBrowserContext(ua: string, standalone = false): BrowserContext {
  const os = detectOs(ua);
  for (const [app, pattern] of KNOWN_APPS) {
    if (pattern.test(ua)) return { inApp: true, app, os };
  }
  // Unknown wrappers: Android marks its WebView with "; wv)"; an iOS WKWebView
  // reports WebKit but leaves out the "Safari/" token that Safari, Chrome,
  // Firefox and SFSafariViewController (WhatsApp, X, Telegram) all send.
  // A home-screen web app also lacks it, but handles tel:/mailto: fine.
  if (os === "android" && /; wv\)/.test(ua)) return { inApp: true, app: "other", os };
  if (os === "ios" && /AppleWebKit/i.test(ua) && !/Safari\//i.test(ua) && !standalone) {
    return { inApp: true, app: "other", os };
  }
  return { inApp: false, app: null, os };
}

export function getBrowserContext(): BrowserContext {
  if (typeof navigator === "undefined") return NOT_IN_APP;
  const standalone = Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return detectBrowserContext(navigator.userAgent ?? "", standalone);
}

/** Starts as "not in-app" so prerendered HTML and the first client render match; re-checks after mount. */
export function useBrowserContext(): BrowserContext {
  const [context, setContext] = useState<BrowserContext>(NOT_IN_APP);
  useEffect(() => {
    const detected = getBrowserContext();
    if (detected.inApp) setContext(detected);
  }, []);
  return context;
}

/** Page navigation, kept on an object so tests can observe it. */
export const navigation = {
  go(url: string) {
    window.location.href = url;
  }
};

/**
 * Opens a native app through its link (`fb://…`, `instagram://…`), then, if
 * the page is still in front after `waitMs` (app not installed, or the host
 * app refused the hand-off), loads the web page instead.
 */
export function openAppOrFallback(appUrl: string, webUrl: string, waitMs = 1500) {
  let left = false;
  const markLeft = (event: Event) => {
    if (event.type !== "visibilitychange" || document.visibilityState === "hidden") left = true;
  };
  document.addEventListener("visibilitychange", markLeft);
  window.addEventListener("pagehide", markLeft);
  window.addEventListener("blur", markLeft);
  navigation.go(appUrl);
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", markLeft);
    window.removeEventListener("pagehide", markLeft);
    window.removeEventListener("blur", markLeft);
    if (!left) navigation.go(webUrl);
  }, waitMs);
}
