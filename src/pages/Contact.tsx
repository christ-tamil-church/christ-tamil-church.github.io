import { ArrowRight, Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import InnerHero from "../components/InnerHero";
import ContactLink from "../components/ContactLink";
import ExternalLink from "../components/ExternalLink";
import { churchInfo } from "../data/site";
import { useRevealGroup } from "../hooks/useRevealGroup";
import "./Contact.css";

export default function Contact() {
  const pageRef = useRevealGroup<HTMLElement>(".contact-reveal");

  return (
    <main className="contact-page" ref={pageRef}>
      <InnerHero
        titleId="contact-title"
        kicker={{ ta: "தொடர்பு", en: "Contact" }}
        title={["Let’s start a", <em key="em">conversation.</em>]}
        lede="Questions, prayer requests, or help planning your first Sunday—we would love to hear from you."
        action={{ label: "Email the church", href: churchInfo.contact.emailHref }}
        card={{
          ariaLabel: "Reach us directly",
          icon: Mail,
          label: "Reach us directly",
          title: "We’re here to help.",
          details: [
            { icon: Phone, text: <ContactLink kind="phone">Call {churchInfo.contact.phone}</ContactLink> },
            { icon: Mail, text: <ContactLink kind="email">{churchInfo.contact.email}</ContactLink> }
          ],
          link: { label: "Get directions", href: churchInfo.address.directionsUrl }
        }}
      />

      <section className="contact-band contact-closing contact-reveal" aria-labelledby="contact-closing-title">
        <div className="contact-shell contact-closing-grid">
          <ExternalLink className="contact-social-card" href={churchInfo.social.facebookUrl} appHref={churchInfo.social.apps.facebook}>
            <span className="contact-icon"><Facebook size={22} aria-hidden="true" /></span>
            <span><strong>Follow along on Facebook</strong>Updates, photos, and announcements from church life.</span>
            <span className="contact-social-link">Open Facebook page <ArrowRight size={17} aria-hidden="true" /></span>
          </ExternalLink>
          <ExternalLink className="contact-social-card" href={churchInfo.social.instagramUrl} appHref={churchInfo.social.apps.instagram}>
            <span className="contact-icon"><Instagram size={22} aria-hidden="true" /></span>
            <span><strong>See us on Instagram</strong>Snapshots of Sundays, fellowship, and family life together.</span>
            <span className="contact-social-link">Open Instagram <ArrowRight size={17} aria-hidden="true" /></span>
          </ExternalLink>
          <ExternalLink className="contact-social-card" href={churchInfo.social.youtubeUrl} appHref={churchInfo.social.apps.youtube}>
            <span className="contact-icon"><Youtube size={22} aria-hidden="true" /></span>
            <span><strong id="contact-closing-title">Watch on YouTube</strong>Worship, messages, and moments from Christ Tamil Church.</span>
            <span className="contact-social-link">Open YouTube channel <ArrowRight size={17} aria-hidden="true" /></span>
          </ExternalLink>
        </div>
      </section>
    </main>
  );
}
