import { Check, Copy, ExternalLink as ExternalLinkIcon, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  copyText,
  openInSystemBrowser,
  systemBrowserUrl,
  type BrowserContext,
  type InAppName
} from "../utils/inAppBrowser";
import "./InAppBrowser.css";

const APP_LABELS: Record<InAppName, string> = {
  facebook: "Facebook",
  messenger: "Messenger",
  instagram: "Instagram",
  threads: "Threads",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
  line: "LINE",
  wechat: "WeChat",
  other: "this app"
};

export function appLabel(context: BrowserContext) {
  return APP_LABELS[context.app ?? "other"];
}

/** Manual fallback, shown when the automatic hand-off to the real browser doesn't happen. */
export function manualBrowserSteps(context: BrowserContext) {
  if (context.os === "android") return "Tap ⋮ in the top corner, then choose “Open in Chrome” or “Open in browser”.";
  return "Tap ••• (or the share icon) at the top or bottom of the screen, then choose “Open in Safari” or “Open in browser”.";
}

/** A button that copies `text`, confirming with a short "Copied" state. */
export function CopyButton({ text, label, className = "iab-button" }: { text: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return (
    <button type="button" className={className} onClick={async () => setCopied(await copyText(text))}>
      {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/**
 * Reopens the current page in Safari/Chrome. If the hand-off doesn't happen
 * (the app blocks it, or the platform has no escape URL), it shows the manual
 * steps and a Copy link button instead.
 */
export function OpenInBrowserButton({ context, className = "iab-button" }: { context: BrowserContext; className?: string }) {
  const [showSteps, setShowSteps] = useState(false);
  const pageUrl = typeof window === "undefined" ? "" : window.location.href;

  const handleClick = async () => {
    if (!systemBrowserUrl(pageUrl, context)) {
      setShowSteps(true);
      return;
    }
    const left = await openInSystemBrowser(pageUrl, context);
    if (!left) setShowSteps(true);
  };

  return (
    <>
      <button type="button" className={className} onClick={handleClick}>
        <ExternalLinkIcon size={17} aria-hidden="true" />
        <span>Open in your browser</span>
      </button>
      {showSteps && (
        <div className="iab-steps" role="status">
          <p>{manualBrowserSteps(context)}</p>
          <CopyButton text={pageUrl} label="Copy page link" className="iab-text-button" />
        </div>
      )}
    </>
  );
}

type SheetProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Small modal sheet: bottom-anchored on phones, centred card on wider screens. */
export function InAppSheet({ title, onClose, children }: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    // Focus the sheet itself (announced via its title) rather than lighting up a button.
    panelRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="iab-sheet-backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="iab-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} tabIndex={-1}>
        <div className="iab-sheet-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="iab-sheet-close" onClick={onClose} aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
