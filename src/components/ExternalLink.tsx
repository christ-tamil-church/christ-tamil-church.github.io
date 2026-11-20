import { useCallback, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useBrowserContext } from "../utils/inAppBrowser";
import { appLabel, CopyButton, InAppSheet, OpenInBrowserButton } from "./InAppBrowser";

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
  const context = useBrowserContext();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const suppliedClick = rest.onClick;
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => { suppliedClick?.(event); if (!event.defaultPrevented) { event.preventDefault(); setOpen(true); } };
  if (context.inApp) return <><a href={href} {...rest} onClick={handleClick}>{children}</a>{open && <InAppSheet title="Open external link" onClose={close}><p className="iab-sheet-note">{appLabel(context)} may block this link. Continue inside the app, open it in your browser, or copy it.</p><div className="iab-sheet-actions"><a className="iab-button iab-button--primary" href={href}>Continue in {appLabel(context)}</a><OpenInBrowserButton context={context} url={href} showCopyFallback={false}/><CopyButton text={href} label="Copy link"/></div></InAppSheet>}</>;
  return (
    <a href={href} target="_blank" rel="noreferrer" {...rest}>
      {children}
      {newTabNote && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
