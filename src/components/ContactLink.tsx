import type { AnchorHTMLAttributes, ReactNode } from "react";
import { churchInfo } from "../data/site";

type ContactLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  kind: "phone" | "email";
  children: ReactNode;
};

/* Every call/email link goes through here (enforced by tests/unit/inAppBrowser.test.tsx),
   so the number and address come from one place (churchInfo.contact). A plain
   same-window `tel:` / `mailto:` link: never `target="_blank"`, which in-app
   browsers (Facebook, Instagram, …) drop before the phone ever sees the link. */
export default function ContactLink({ kind, children, ...rest }: ContactLinkProps) {
  const { phoneHref, emailHref } = churchInfo.contact;
  return (
    <a href={kind === "phone" ? phoneHref : emailHref} {...rest}>
      {children}
    </a>
  );
}
