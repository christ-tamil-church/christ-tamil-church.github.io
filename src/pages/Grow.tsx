import { ArrowRight, BookOpen, CalendarDays, Headphones, School, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import InnerHero from "../components/InnerHero";
import SectionHeader from "../components/SectionHeader";
import { siteImages } from "../data/images";
import { pathwayLabels } from "../data/ministryPathways";
import { churchEvents } from "../data/site";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { formatStep } from "../utils/format";
import "./Grow.css";

const pathways = [
  { title: "Bible Study & Prayer", meta: "Adults & families · Throughout the week", text: "Study Scripture, pray with others, and build a steady rhythm of discipleship.", href: "/grow/bible-study-prayer", icon: BookOpen },
  { title: "Sunday School · B.L.A.S.T.", meta: "Children · Every Sunday", text: "Bible Learning And Spiritual Training designed to help children know and follow Jesus.", href: "/grow/sunday-school", icon: School },
  { title: "Kids Circle", meta: "Children · During worship", text: "A brief, joyful space for children to learn God’s Word, ask questions, and belong.", href: "/grow/kids-circle", icon: Sprout },
  { title: "Messages & Moments", meta: "Watch anytime", text: "Watch worship, teaching, celebrations, and stories from Christ Tamil Church.", href: "/sermons", icon: Headphones }
];

const bibleStudy = churchEvents.find((event) => event.title === "Bible Study & Prayer");

export default function Grow() {
  const pathwaysRef = useRevealOnScroll<HTMLElement>({ staggerChildren: true });
  const familyRef = useRevealOnScroll<HTMLElement>();

  return <>
    <InnerHero
      titleId="grow-title"
      kicker={pathwayLabels.grow}
      title={["Rooted in Christ.", <em key="em">Growing together.</em>]}
      lede="Faith grows through God’s Word, prayer, and life with His people. Wherever you are starting, there is a place for you and your family to take a next step."
      action={{ label: "Find your next step", to: "#grow-pathways" }}
      card={{
        ariaLabel: "Where to start growing",
        icon: BookOpen,
        label: "Start here",
        title: "Bible Study & Prayer",
        details: bibleStudy ? [{ icon: CalendarDays, text: `${bibleStudy.frequency} · ${bibleStudy.time}` }] : undefined,
        link: { label: "Explore this pathway", to: "/grow/bible-study-prayer" }
      }}
    />

    <section className="grow-pathways reveal" ref={pathwaysRef} id="grow-pathways" aria-labelledby="grow-pathways-title">
      <SectionHeader eyebrow="One church · Every generation" title="Choose a place to grow" text="Each pathway is designed to help you know Christ more deeply and follow Him in everyday life." />
      <div className="grow-pathway-list" id="grow-pathways-title">
        {pathways.map((pathway, index) => { const Icon = pathway.icon; return <Link className="grow-pathway-row" to={pathway.href} key={pathway.title} data-reveal-child>
          <span className="grow-pathway-number">{formatStep(index)}</span><span className="grow-pathway-icon"><Icon size={21} /></span>
          <div><h3>{pathway.title}</h3><span>{pathway.meta}</span></div><p>{pathway.text}</p><ArrowRight className="grow-pathway-arrow" size={18} />
        </Link>; })}
      </div>
    </section>

    <section className="grow-family-band reveal" ref={familyRef} aria-labelledby="grow-family-title">
      <div className="grow-family-copy">
        <span className="eyebrow">Children & families</span>
        <h2 id="grow-family-title">A place for young faith to take root.</h2>
        <p>Children are welcomed as gifts from God. Kids Circle offers a brief teaching moment during worship, while B.L.A.S.T. provides a fuller Sunday School experience with structured Bible learning.</p>
      </div>
      <div className="grow-family-choices">
        <Link to="/grow/kids-circle"><span>During worship</span><strong>Kids Circle</strong><ArrowRight size={16} /></Link>
        <Link to="/grow/sunday-school"><span>Sunday School</span><strong>B.L.A.S.T.</strong><ArrowRight size={16} /></Link>
      </div>
    </section>

    <section className="grow-word-band verse-band" aria-labelledby="grow-word-title">
      <div className="verse-visual"><img src={siteImages.growTower.src} alt={siteImages.growTower.alt} width={1200} height={1500} loading="lazy" style={{ aspectRatio: "1 / 1", objectPosition: "center 14%" }} /><blockquote><p>“Grow in the grace and knowledge of our Lord and Savior Jesus Christ.”</p><cite>2 Peter 3:18</cite></blockquote></div>
      <div><span className="eyebrow">Grow through the Word</span><h2 id="grow-word-title">Take Scripture with you.</h2><p>Watch biblical messages wherever your week takes you.</p><Link to="/sermons">Watch messages <ArrowRight size={15} /></Link></div>
    </section>

  </>;
}
