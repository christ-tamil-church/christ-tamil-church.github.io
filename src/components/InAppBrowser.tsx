import { Check, Copy, ExternalLink as ExternalLinkIcon, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { copyText, openInSystemBrowser, type BrowserContext, type InAppName } from "../utils/inAppBrowser";
import "./InAppBrowser.css";

const APP_LABELS: Record<InAppName, string> = {
  facebook: "Facebook", messenger: "Messenger", instagram: "Instagram", threads: "Threads",
  tiktok: "TikTok", snapchat: "Snapchat", linkedin: "LinkedIn", pinterest: "Pinterest",
  line: "LINE", wechat: "WeChat", other: "this app"
};

export function appLabel(context: BrowserContext) {
  return APP_LABELS[context.app ?? "other"];
}

export function manualBrowserSteps(context: BrowserContext) {
  return context.os === "android"
    ? "Tap ⋮ in the top corner, then choose “Open in Chrome” or “Open in browser”."
    : "Tap ••• (or the share icon), then choose “Open in Safari” or “Open in browser”.";
}

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

export function OpenInBrowserButton({ context, url, className = "iab-button", showCopyFallback = true }: { context: BrowserContext; url?: string; className?: string; showCopyFallback?: boolean }) {
  const [showSteps, setShowSteps] = useState(false);
  const targetUrl = url ?? (typeof window === "undefined" ? "" : window.location.href);
  const canAttemptHandoff = context.os === "android" || (context.os === "ios" && context.app === "instagram");
  const label = canAttemptHandoff
    ? context.os === "android" ? "Open in Chrome" : "Open in Safari"
    : context.os === "ios" ? "How to open in Safari" : "How to open in your browser";
  const handleClick = async () => {
    if (!canAttemptHandoff) {
      setShowSteps(true);
      return;
    }
    const left = await openInSystemBrowser(targetUrl, context);
    if (!left) setShowSteps(true);
  };
  return (
    <>
      <button type="button" className={className} onClick={handleClick}>
        <ExternalLinkIcon size={17} aria-hidden="true" />
        <span>{label}</span>
      </button>
      {showSteps && (
        <div className="iab-steps" role="status">
          <p>{manualBrowserSteps(context)}</p>
          {showCopyFallback && <CopyButton text={targetUrl} label="Copy link" className="iab-text-button" />}
        </div>
      )}
    </>
  );
}

export function InAppSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previous?.focus?.(); };
  }, [onClose]);
  return createPortal(
    <div className="iab-sheet-backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="iab-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} tabIndex={-1}>
        <div className="iab-sheet-head"><h2 id={titleId}>{title}</h2><button type="button" className="iab-sheet-close" onClick={onClose} aria-label="Close"><X size={20} aria-hidden="true" /></button></div>
        {children}
      </div>
    </div>, document.body
  );
}
