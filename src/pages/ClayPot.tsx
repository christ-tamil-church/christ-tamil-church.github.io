import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  clayPotIssue,
  clayPotLanguageLabel,
  clayPotOpening,
  clayPotWritingPath,
  clayPotWritings,
  formatClayPotDate,
  type ClayPotWriting
} from "../data/clayPot";
import { siteImages } from "../data/images";
import { churchInfo } from "../data/site";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import "./ClayPot.css";

const writings: readonly ClayPotWriting[] = clayPotWritings;
const latest = writings[0];
const firstYear = writings[writings.length - 1].date.slice(0, 4);
const monthYear = (date: string) => formatClayPotDate(date).replace(/ \d+,/, "");

export function IssueNumber({ slug, className = "" }: { slug: string; className?: string }) {
  const issue = String(clayPotIssue(slug)).padStart(2, "0");
  return <span className={`cp-issue ${className}`.trim()}><small>No.</small>{issue}</span>;
}

export function LanguagePill({ language }: { language: ClayPotWriting["language"] }) {
  const label = clayPotLanguageLabel[language];
  return (
    <span className="cp-language">
      <span lang={language} aria-hidden="true">{label.short}</span>
      <span className="sr-only">{label.long}</span>
    </span>
  );
}

/* Closing band shared by the Clay Pot index and every writing: a gentle way
   to reach the church, with Sunday's time and place. */
export function ClayPotClosing() {
  return (
    <section className="cp-closing" aria-labelledby="cp-closing-title">
      <div className="cp-shell cp-closing-grid">
        <div>
          <h2 id="cp-closing-title">Has something here stirred a question?</h2>
          <p>We would be glad to talk it through with you, over the phone, by email, or after worship on Sunday.</p>
          <Link className="cp-primary" to="/contact">Contact us <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <ul className="cp-closing-facts">
          <li><Phone size={18} aria-hidden="true" /><a href={churchInfo.contact.phoneHref}>{churchInfo.contact.phone}</a></li>
          <li><Mail size={18} aria-hidden="true" /><a href={churchInfo.contact.emailHref}>{churchInfo.contact.email}</a></li>
          <li><MapPin size={18} aria-hidden="true" /><span>Sunday worship, {churchInfo.worship.time}<br />{churchInfo.address.short}</span></li>
        </ul>
      </div>
    </section>
  );
}

export default function ClayPot() {
  const contentsRef = useRevealOnScroll<HTMLOListElement>({ staggerChildren: true, staggerStepMs: 110 });
  const opening = clayPotOpening(latest);

  return (
    <div className="cp-page">
      <section className="cp-nameplate" aria-labelledby="cp-title">
        <div className="cp-shell">
          <p className="cp-dateline">
            <span>Christ Tamil Church · Chicago</span>
            <span>Tamil &amp; English · Since {firstYear}</span>
          </p>
          <div className="cp-nameplate-row">
            <h1 id="cp-title" className="cp-nameplate-title">
              <span lang="ta">மண்பாண்டம்</span>
              <span className="cp-nameplate-en">Clay Pot</span>
            </h1>
            <div className="cp-standfirst">
              <p>Letters and reflections from our church family, bringing Scripture to bear on the seasons we live through.</p>
              <a className="cp-text-link" href="#cp-contents">Browse every issue <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <p className="cp-dateline cp-dateline-foot">
            <span>No. 01 – No. {String(writings.length).padStart(2, "0")}</span>
            <span>Latest · {monthYear(latest.date)}</span>
          </p>
        </div>
      </section>

      <section className="cp-lead" aria-labelledby="cp-lead-title">
        <div className="cp-shell cp-lead-grid">
          <article className="cp-lead-feature">
            <p className="cp-lead-mark"><IssueNumber slug={latest.slug} /><span>The latest letter</span></p>
            <h2 id="cp-lead-title" lang={latest.language} className={`cp-title cp-title-${latest.language}`}>
              <Link to={clayPotWritingPath(latest.slug)}>{latest.title}</Link>
            </h2>
            <p className="cp-byline">
              <span>{latest.author}</span>
              <time dateTime={latest.date}>{formatClayPotDate(latest.date)}</time>
              <LanguagePill language={latest.language} />
            </p>
            <div className={`cp-opening cp-prose-${latest.language}`} lang={latest.language}>
              {opening.map((text, index) => <p key={index}>{text}</p>)}
            </div>
            <Link className="cp-primary" to={clayPotWritingPath(latest.slug)}>
              Read the full letter <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>

          <aside className="cp-about" aria-labelledby="cp-about-title">
            <img
              src={siteImages.prayerTamilBible.src}
              alt={siteImages.prayerTamilBible.alt}
              width={1200}
              height={675}
              loading="lazy"
            />
            <div className="cp-about-copy">
              <h2 id="cp-about-title">Why “Clay Pot”?</h2>
              <blockquote>
                <p lang="ta">“இந்த மகத்துவமுள்ள வல்லமை எங்களால் உண்டாயிராமல், தேவனால் உண்டாயிருக்கிறதென்று விளங்கும்படி, இந்தப் பொக்கிஷத்தை மண்பாண்டங்களில் பெற்றிருக்கிறோம்.”</p>
                <cite>2 Corinthians 4:7</cite>
              </blockquote>
              <p>The column takes its name from this verse: the treasure of the gospel, carried in ordinary jars of clay. Here our church family writes about Scripture and life, in Tamil and in English.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="cp-contents" id="cp-contents" aria-labelledby="cp-contents-title">
        <div className="cp-shell">
          <header className="cp-contents-header">
            <h2 id="cp-contents-title">Every issue</h2>
            <p>New writings are added here as they are written, newest first. Each one opens on its own page.</p>
          </header>
          <ol className="cp-contents-list reveal" ref={contentsRef} reversed>
            {writings.map((writing) => (
              <li key={writing.slug} data-reveal-child>
                <Link className="cp-contents-row" to={clayPotWritingPath(writing.slug)}>
                  <IssueNumber slug={writing.slug} />
                  <span className="cp-contents-main">
                    <strong lang={writing.language} className={`cp-contents-title cp-title-${writing.language}`}>{writing.title}</strong>
                    <span className="cp-contents-author">{writing.author}</span>
                  </span>
                  <span className="cp-contents-meta">
                    <time dateTime={writing.date}>{formatClayPotDate(writing.date)}</time>
                    <LanguagePill language={writing.language} />
                  </span>
                  <ArrowRight className="cp-contents-arrow" size={19} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClayPotClosing />
    </div>
  );
}
