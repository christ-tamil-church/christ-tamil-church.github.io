import { useCallback, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { churchInfo } from "../data/site";
import { useBrowserContext } from "../utils/inAppBrowser";
import { appLabel, CopyButton, InAppSheet, OpenInBrowserButton } from "./InAppBrowser";

type ContactLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  kind: "phone" | "email";
  children: ReactNode;
};

/* Every call/email link goes through here (enforced by tests/unit/inAppBrowser.test.tsx),
   so the number and address come from one place (churchInfo.contact). A plain
   same-window `tel:` / `mailto:` link: never `target="_blank"`, which in-app
   browsers (Facebook, Instagram, …) drop before the phone ever sees the link. */
export default function ContactLink({ kind, children, onClick, ...rest }: ContactLinkProps) {
  const context = useBrowserContext();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { phone, phoneHref, email, emailHref } = churchInfo.contact;
  const href = kind === "phone" ? phoneHref : emailHref;
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    // Android's Facebook webview hands tel:/mailto: links to the native apps.
    // iOS webviews commonly block that handoff, so only they need the fallback.
    if (context.inApp && context.os === "ios" && !event.defaultPrevented) {
      event.preventDefault();
      setOpen(true);
    }
  };
  return (
    <><a href={href} onClick={handleClick} {...rest}>{children}</a>{open && <InAppSheet title={kind === "phone" ? "Church phone number" : "Church email address"} onClose={close}>
      <p className="iab-sheet-value">{kind === "phone" ? phone : email}</p><p className="iab-sheet-note">{appLabel(context)} cannot reliably open the {kind === "phone" ? "Phone" : "Mail"} app. Copy the {kind === "phone" ? "number" : "email address"}, then use it in your preferred app.</p>
      <div className="iab-sheet-actions"><CopyButton className="iab-button iab-button--primary" text={kind === "phone" ? phone : email} label={kind === "phone" ? "Copy phone number" : "Copy email address"}/><OpenInBrowserButton context={context} showCopyFallback={false}/></div>
    </InAppSheet>}</>
  );
}
