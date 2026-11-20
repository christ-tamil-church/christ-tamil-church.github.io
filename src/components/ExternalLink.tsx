import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { openAppOrFallback, useBrowserContext } from "../utils/inAppBrowser";

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel" | "href"> & {
  href: string;
  children: ReactNode;
  /** Appends a screen-reader "(opens in a new tab)" note — only when it really does. */
  newTabNote?: boolean;
  /** Native-app link (e.g. `instagram://user?username=…`) tried first inside iPhone in-app browsers. */
  appHref?: string;
};

/* Every off-site link goes through here (enforced by tests/unit/inAppBrowser.test.tsx).
   In a normal browser it opens a new tab. Inside an in-app browser (Facebook,
   Instagram, TikTok, …) it navigates in place instead: those web views have no
   tabs and drop new-window requests.
   On iPhone, those web views also load facebook.com / instagram.com /
   youtube.com without the visitor's app login (a blank page or login wall),
   so links with an `appHref` open the native app first and fall back to the
   web page only if the app doesn't open. */
export default function ExternalLink({ href, children, newTabNote = false, appHref, onClick, ...rest }: ExternalLinkProps) {
  const { inApp, os } = useBrowserContext();

  if (inApp) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (!appHref || os !== "ios" || event.defaultPrevented) return;
      event.preventDefault();
      openAppOrFallback(appHref, href);
    };
    return (
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" onClick={onClick} {...rest}>
      {children}
      {newTabNote && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
