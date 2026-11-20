import { Mail, Phone } from "lucide-react";
import { useCallback, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { churchInfo } from "../data/site";
import { useBrowserContext } from "../utils/inAppBrowser";
import { appLabel, CopyButton, InAppSheet, OpenInBrowserButton } from "./InAppBrowser";

type ContactLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  kind: "phone" | "email";
  children: ReactNode;
};

/* Every call/email link goes through here (enforced by tests/unit/linkPolicy.test.ts).
   In a normal browser it is a plain `tel:` / `mailto:` link. Inside an in-app
   browser those often do nothing — the host app has to pass them to the phone
   and many don't — so a tap opens a small sheet instead: try the call/email
   again, copy the number/address, or reopen the page in the real browser. */
export default function ContactLink({ kind, children, onClick, ...rest }: ContactLinkProps) {
  const context = useBrowserContext();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { phone, phoneHref, email, emailHref } = churchInfo.contact;
  const href = kind === "phone" ? phoneHref : emailHref;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!context.inApp || event.defaultPrevented) return;
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
      {open && (
        <InAppSheet title={kind === "phone" ? "Call the church" : "Email the church"} onClose={close}>
          <p className="iab-sheet-value">{kind === "phone" ? phone : email}</p>
          <p className="iab-sheet-note">
            {appLabel(context)}’s built-in browser sometimes blocks {kind === "phone" ? "calls" : "email"}. If
            nothing happens, copy the {kind === "phone" ? "number" : "address"} or open this page in your browser.
          </p>
          <div className="iab-sheet-actions">
            <a className="iab-button iab-button--primary" href={href}>
              {kind === "phone" ? <Phone size={17} aria-hidden="true" /> : <Mail size={17} aria-hidden="true" />}
              <span>{kind === "phone" ? `Call ${phone}` : "Write an email"}</span>
            </a>
            <CopyButton text={kind === "phone" ? phone : email} label={kind === "phone" ? "Copy number" : "Copy email address"} />
            <OpenInBrowserButton context={context} />
          </div>
        </InAppSheet>
      )}
    </>
  );
}
