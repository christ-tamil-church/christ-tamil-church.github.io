import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBrowserContext } from "../utils/inAppBrowser";
import { appLabel, OpenInBrowserButton } from "./InAppBrowser";

const DISMISS_KEY = "ctc-iab-banner-dismissed";

function wasDismissed() {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/* Shown only inside in-app browsers (Facebook, Instagram, TikTok, …): a slim
   bar pinned to the bottom of the screen, offering to reopen the page in the
   real browser, where calling, email, maps and downloads all work. Pinned
   rather than in the flow so it never shifts the homepage's Follow the Light
   chapters. Dismissal lasts for the visit. */
export default function InAppBrowserBanner() {
  const context = useBrowserContext();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (context.inApp) setDismissed(wasDismissed());
  }, [context.inApp]);

  if (!context.inApp || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // storage blocked: the bar just comes back on the next page load
    }
  };

  return (
    <aside className="iab-banner" aria-label="Open in your browser">
      <p>
        <strong>Viewing in {appLabel(context)}?</strong> Calls, email and maps work best in your browser.
      </p>
      <div className="iab-banner-actions">
        <OpenInBrowserButton context={context} className="iab-button iab-button--primary iab-button--small" />
        <button type="button" className="iab-sheet-close" onClick={dismiss} aria-label="Dismiss">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
