import { ArrowRight, BookOpen, CalendarDays, HeartHandshake, MessageCircleQuestion, MoonStar, Sparkles, UsersRound, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import RelatedLinks, { type RelatedLink } from "../components/RelatedLinks";
import SectionHeader from "../components/SectionHeader";
import { siteImages } from "../data/images";
import { churchEvents, type ChurchEvent, type ChurchEventTitle } from "../data/site";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { formatStep } from "../utils/format";
import "./BibleStudyPrayer.css";

const events: readonly ChurchEvent[] = churchEvents;

type Gathering = {
  title: string;
  /** Must name an entry in churchEvents; its schedule fills the row meta. */
  event: ChurchEventTitle;
  text: string;
  icon: LucideIcon;
};

const gatherings = ([
  { title: "Bible Study & Prayer", event: "Bible Study & Prayer", text: "Open Scripture together, ask honest questions, and discover how God’s Word shapes everyday life.", icon: BookOpen },
  { title: "Prayer Conference", event: "Prayer Conference", text: "Pray for families, the church, and our community while encouraging one another in faith.", icon: HeartHandshake },
  { title: "Fasting Prayer", event: "Fasting Prayer", text: "Set aside focused time each month for worship, fasting, prayer, and seeking God together.", icon: MoonStar }
] satisfies Gathering[]).map((item) => ({ ...item, details: events.find((event) => event.title === item.event) }));

const bibleStudy = gatherings[0].details;

const related: RelatedLink[] = [
  { title: "Sunday School · B.L.A.S.T.", meta: "Children · Sundays", href: "/grow/sunday-school", icon: Sparkles },
  { title: "Kids Circle", meta: "Children · During worship", href: "/grow/kids-circle", icon: UsersRound },
  { title: "Messages & Moments", meta: "Watch anytime", href: "/sermons", icon: BookOpen }
];

export default function BibleStudyPrayer() {
  const gatheringRef = useRevealOnScroll<HTMLElement>({ staggerChildren: true });
  const expectRef = useRevealOnScroll<HTMLElement>();

  return <>
    <section className="study-hero" aria-labelledby="study-title">
      <div className="study-hero-copy">
        <span className="study-hero-kicker"><span lang="ta">வேதமும் ஜெபமும்</span><small>Grow</small></span>
        <h1 id="study-title">Know God through <em>Word and prayer.</em></h1>
        <p>Come as you are and grow alongside a Tamil church family through Scripture, honest questions, prayer, and encouragement.</p>
        <Link className="study-primary" to="/contact">Ask about joining <ArrowRight size={17} /></Link>
      </div>
      <div className="study-hero-visual">
        <img src={siteImages.bibleStudy.src} alt={siteImages.bibleStudy.alt} width="1200" height="900" style={{ objectPosition: siteImages.bibleStudy.objectPosition }} />
        <aside className="study-hero-card" aria-label="Next Bible study gathering">
          <span>Weekly gathering</span><strong>{bibleStudy?.frequency} · {bibleStudy?.time}</strong>
          <ul><li><CalendarDays size={16}/> Bible study & prayer</li><li><UsersRound size={16}/> Adults and families welcome</li></ul>
          <Link to="/contact">Get gathering details <ArrowRight size={14}/></Link>
        </aside>
      </div>
    </section>

    <section className="study-gatherings reveal" ref={gatheringRef} aria-labelledby="study-gatherings-title">
      <SectionHeader eyebrow="A steady rhythm" title="Ways we seek God together" text="You do not need advanced Bible knowledge—just come ready to listen, ask, pray, and be encouraged." />
      <div className="study-gathering-list" id="study-gatherings-title">
        {gatherings.map((item, index) => { const Icon = item.icon; return <article className="study-gathering-row" key={item.title} data-reveal-child>
          <span className="study-row-number">{formatStep(index)}</span><span className="study-row-icon"><Icon size={21}/></span>
          <div><h3>{item.title}</h3><span>{item.details?.frequency} · {item.details?.time}</span></div><p>{item.text}</p>
        </article>; })}
      </div>
    </section>

    <section className="study-expect-band reveal" ref={expectRef} aria-labelledby="study-expect-title">
      <div className="study-expect-image"><img src={siteImages.prayer.src} alt={siteImages.prayer.alt} loading="lazy" width="1200" height="900" style={{ objectPosition: siteImages.prayer.objectPosition }} /></div>
      <div className="study-expect-copy"><span className="eyebrow">What to expect</span><h2 id="study-expect-title">A welcoming room. An open Bible. Space to pray.</h2><p>We read Scripture carefully, make room for questions, and pray for the needs people carry into the week. You can participate aloud or simply listen while you get comfortable.</p>
        <ul><li><MessageCircleQuestion size={18}/><span>Honest questions are welcome</span></li><li><BookOpen size={18}/><span>Teaching rooted in Scripture</span></li><li><HeartHandshake size={18}/><span>Prayer shared with care</span></li></ul>
      </div>
    </section>

    <section className="study-verse-band" aria-labelledby="study-verse-title">
      <blockquote><p>“Your word is a lamp for my feet, a light on my path.”</p><cite>Psalm 119:105</cite></blockquote>
      <div><span className="eyebrow">Faith for everyday life</span><h2 id="study-verse-title">Carry the Word into your week.</h2><p>Spiritual growth is more than gathering. It is learning to hear Christ and follow Him at home, at work, and in our relationships.</p><Link to="/sermons">Watch a message <ArrowRight size={15}/></Link></div>
    </section>

    <section className="study-related" aria-labelledby="study-related-title"><SectionHeader eyebrow="Continue growing" title="More ways to take a next step" /><RelatedLinks items={related} className="study-related-list" id="study-related-title" /></section>

  </>;
}
