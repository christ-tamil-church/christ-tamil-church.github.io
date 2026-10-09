import { ArrowRight, BookOpen, CalendarDays, Heart, Lightbulb, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import InnerHero from "../components/InnerHero";
import RelatedLinks, { type RelatedLink } from "../components/RelatedLinks";
import SectionHeader from "../components/SectionHeader";
import { siteImages } from "../data/images";
import { churchInfo } from "../data/site";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { formatStep } from "../utils/format";
import "./SundaySchool.css";

const blast = [
  { letter: "B", word: "Bible", text: "Children discover the truth and story of God’s Word." },
  { letter: "L", word: "Learning", text: "Memorable lessons meet children at their level." },
  { letter: "A", word: "And", text: "Questions, friendships, and encouragement happen together." },
  { letter: "S", word: "Spiritual", text: "Young faith is nurtured with prayer, worship, and care." },
  { letter: "T", word: "Training", text: "Children practice following Jesus in everyday life." }
];

const related: RelatedLink[] = [
  { title: "Kids Circle", meta: "During Sunday worship", href: "/grow/kids-circle", icon: Sparkles },
  { title: "Bible Study & Prayer", meta: "Adults & families", href: "/grow/bible-study-prayer", icon: BookOpen },
  { title: "Worship", meta: "What to expect this Sunday", href: "/worship", icon: Heart }
];

export default function SundaySchool() {
  const blastRef = useRevealOnScroll<HTMLElement>({ staggerChildren: true });
  const parentRef = useRevealOnScroll<HTMLElement>();

  return <>
    <InnerHero
      titleId="ss-title"
      kicker={{ ta: "ஞாயிறு பள்ளி", en: "Grow" }}
      title={<>Helping children grow strong in <em>God’s Word.</em></>}
      lede="B.L.A.S.T.—Bible Learning And Spiritual Training—helps children experience the gospel in a joyful, memorable, and age-appropriate way."
      action={{ label: "Plan a family visit", to: "/visit" }}
      card={{
        ariaLabel: "Sunday School details",
        icon: Sparkles,
        label: "Every Sunday",
        title: "B.L.A.S.T. Sunday School",
        details: [
          { icon: CalendarDays, text: "During the sermon" },
          { icon: UsersRound, text: "Kids of all ages welcome" }
        ],
        link: { label: "Ask a parent question", to: "/contact" }
      }}
    />

    <section className="ss-blast reveal" ref={blastRef} aria-labelledby="ss-blast-title">
      <SectionHeader eyebrow="Join in · Team up · Get strong" title="What B.L.A.S.T. means" text="Five simple ideas shape a Sunday School experience children can understand and remember." />
      <div className="ss-blast-list" id="ss-blast-title">{blast.map((item,index)=><article className="ss-blast-row" key={item.letter} data-reveal-child><span className="ss-row-number">{formatStep(index)}</span><strong>{item.letter}</strong><div><h3>{item.word}</h3><p>{item.text}</p></div></article>)}</div>
    </section>

    <section className="ss-parent-band reveal" ref={parentRef} aria-labelledby="ss-parent-title">
      <div className="ss-parent-image"><img src={siteImages.sundaySchoolBibleTable.src} alt={siteImages.sundaySchoolBibleTable.alt} loading="lazy" width="2048" height="1536" style={{objectPosition:siteImages.sundaySchoolBibleTable.objectPosition}} /></div>
      <div className="ss-parent-copy"><span className="eyebrow">For parents</span><h2 id="ss-parent-title">A Sunday School experience built on trust.</h2><p>Experienced leaders use strong Bible resources to present the gospel with warmth, clarity, and care. Our hope is that every child knows the love of God and the love of God’s family.</p><ul><li><ShieldCheck size={18}/><span>Caring, experienced leaders</span></li><li><Lightbulb size={18}/><span>Age-appropriate Bible learning</span></li><li><Heart size={18}/><span>A welcoming church family</span></li></ul></div>
    </section>

    <section className="ss-difference" aria-labelledby="ss-difference-title"><div><span className="eyebrow">Two moments · One purpose</span><h2 id="ss-difference-title">Kids Circle and Sunday School are different.</h2><p>Both help children know God’s love, but each has a distinct place in the Sunday experience.</p></div><div className="ss-difference-rows"><Link to="/grow/kids-circle"><span>During worship</span><strong>Kids Circle</strong><p>A brief, child-friendly teaching moment as part of the service.</p><ArrowRight size={17}/></Link><article><span>During the sermon</span><strong>B.L.A.S.T. Sunday School</strong><p>A fuller, structured time of Bible learning and spiritual formation.</p><BookOpen size={19}/></article></div></section>

    <section className="ss-verse verse-band" aria-labelledby="ss-verse-title"><div className="verse-visual"><img src={siteImages.sundaySchoolColoring.src} alt={siteImages.sundaySchoolColoring.alt} width="1440" height="1796" loading="lazy" style={{ objectPosition: siteImages.sundaySchoolColoring.objectPosition }} /><blockquote><p lang="ta">“சிறு பிள்ளைகள் என்னிடத்தில் வருகிறதற்கு இடங்கொடுங்கள்.”</p><cite>Matthew 19:14</cite></blockquote></div><div><span className="eyebrow">Children belong here</span><h2 id="ss-verse-title">Faith can take root at every age.</h2><p>Children are not an interruption to church life. They are a treasured part of our church family, learning to worship and follow Jesus alongside us.</p></div></section>

    <section className="ss-related" aria-labelledby="ss-related-title"><SectionHeader eyebrow="Continue growing" title="More for your family"/><RelatedLinks items={related} className="ss-related-list" id="ss-related-title" /><p className="ss-sunday-note">Join us {churchInfo.worship.schedule}. We’ll help your family know where to go when you arrive.</p></section>
  </>;
}
