import { ArrowRight, Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import InnerHero from "../components/InnerHero";
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
            { icon: Phone, text: <a href={churchInfo.contact.phoneHref}>Call {churchInfo.contact.phone}</a> },
            { icon: Mail, text: <a href={churchInfo.contact.emailHref}>{churchInfo.contact.email}</a> }
          ],
          link: { label: "Get directions", href: churchInfo.address.directionsUrl }
        }}
      />

      <section className="contact-band contact-closing contact-reveal" aria-labelledby="contact-closing-title">
        <div className="contact-shell contact-closing-grid">
          <a className="contact-social-card" href={churchInfo.social.facebookUrl} target="_blank" rel="noreferrer">
            <span className="contact-icon"><Facebook size={22} aria-hidden="true" /></span>
            <span><strong>Follow along on Facebook</strong>Updates, photos, and announcements from church life.</span>
            <span className="contact-social-link">Open Facebook page <ArrowRight size={17} aria-hidden="true" /></span>
          </a>
          <a className="contact-social-card" href={churchInfo.social.instagramUrl} target="_blank" rel="noreferrer">
            <span className="contact-icon"><Instagram size={22} aria-hidden="true" /></span>
            <span><strong>See us on Instagram</strong>Snapshots of Sundays, fellowship, and family life together.</span>
            <span className="contact-social-link">Open Instagram <ArrowRight size={17} aria-hidden="true" /></span>
          </a>
          <a className="contact-social-card" href={churchInfo.social.youtubeUrl} target="_blank" rel="noreferrer">
            <span className="contact-icon"><Youtube size={22} aria-hidden="true" /></span>
            <span><strong id="contact-closing-title">Watch on YouTube</strong>Worship, messages, and moments from Christ Tamil Church.</span>
            <span className="contact-social-link">Open YouTube channel <ArrowRight size={17} aria-hidden="true" /></span>
          </a>
        </div>
      </section>
    </main>
  );
}
