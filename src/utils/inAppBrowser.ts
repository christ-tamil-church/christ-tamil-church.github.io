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

/** Copies text; falls back to a hidden textarea where the Clipboard API is missing (older web views). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the textarea route
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  } catch {
    return false;
  }
}

/** The URL that asks the OS to reopen `url` in the real browser, or null where none exists. */
export function systemBrowserUrl(url: string, context: BrowserContext): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const rest = `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
  if (context.os === "android") {
    // Chrome intent; falls back to the same URL if Chrome isn't installed.
    return `intent://${rest}#Intent;scheme=${parsed.protocol.replace(":", "")};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  }
  if (context.os === "ios") {
    // Undocumented but honoured by iOS 17+; Instagram has its own escape hatch.
    if (context.app === "instagram") return `instagram://extbrowser/?url=${encodeURIComponent(url)}`;
    return `x-safari-${parsed.protocol}//${rest}`;
  }
  return null;
}

/**
 * Tries to reopen `url` in the system browser. Resolves true if the page was
 * hidden (the hand-off happened), false if we're still here after `waitMs`, in
 * which case the caller shows the manual "••• → Open in browser" steps.
 */
export function openInSystemBrowser(url: string, context: BrowserContext, waitMs = 1500): Promise<boolean> {
  const target = systemBrowserUrl(url, context);
  if (!target) return Promise.resolve(false);
  return new Promise((resolve) => {
    let left = false;
    const onHide = (event: Event) => {
      if (event.type === "pagehide" || document.visibilityState === "hidden") left = true;
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    window.location.href = target;
    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      resolve(left);
    }, waitMs);
  });
}
