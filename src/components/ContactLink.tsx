import { Mail, Phone } from "lucide-react";
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
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => { onClick?.(event); if (context.inApp && !event.defaultPrevented) { event.preventDefault(); setOpen(true); } };
  return (
    <><a href={href} onClick={handleClick} {...rest}>{children}</a>{open && <InAppSheet title={kind === "phone" ? "Call the church" : "Email the church"} onClose={close}>
      <p className="iab-sheet-value">{kind === "phone" ? phone : email}</p><p className="iab-sheet-note">{appLabel(context)} may block {kind === "phone" ? "calls" : "email"}. You can try it, copy the {kind === "phone" ? "number" : "address"}, or reopen this page in your browser.</p>
      <div className="iab-sheet-actions"><a className="iab-button iab-button--primary" href={href}>{kind === "phone" ? <Phone size={17} aria-hidden="true"/> : <Mail size={17} aria-hidden="true"/>}<span>{kind === "phone" ? `Call ${phone}` : "Write an email"}</span></a><CopyButton text={kind === "phone" ? phone : email} label={kind === "phone" ? "Copy number" : "Copy email address"}/><OpenInBrowserButton context={context}/></div>
    </InAppSheet>}</>
  );
}
