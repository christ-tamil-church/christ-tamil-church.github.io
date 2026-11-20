import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useBrowserContext } from "../utils/inAppBrowser";

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel" | "href"> & {
  href: string;
  children: ReactNode;
  /** Appends a screen-reader "(opens in a new tab)" note — only when it really does. */
  newTabNote?: boolean;
};

/* Every off-site link goes through here (enforced by tests/unit/inAppBrowser.test.tsx).
   In a normal browser it opens a new tab. Inside an in-app browser (Facebook,
   Instagram, TikTok, …) it navigates in place instead: those web views have no
   tabs and often drop new-window requests, and a same-window visit is what
   lets the host app hand facebook.com, Maps or YouTube to their native apps. */
export default function ExternalLink({ href, children, newTabNote = false, ...rest }: ExternalLinkProps) {
  const { inApp } = useBrowserContext();
  if (inApp) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" {...rest}>
      {children}
      {newTabNote && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
