import { ArrowRight, BookOpen, CalendarDays, Heart, MessageCircleQuestion, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import InnerHero from "../components/InnerHero";
import RelatedLinks, { type RelatedLink } from "../components/RelatedLinks";
import SectionHeader from "../components/SectionHeader";
import { siteImages } from "../data/images";
import { churchInfo } from "../data/site";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { formatStep } from "../utils/format";
import "./KidsCircle.css";

const experiences = [
  { title: "Learn", text: "Hear God’s Word in a simple, memorable way.", icon: BookOpen },
  { title: "Discover", text: "Explore God’s love and biblical values.", icon: Search },
  { title: "Ask", text: "Wonder, question, and grow in understanding.", icon: MessageCircleQuestion },
  { title: "Belong", text: "Make friends and be loved by God’s family.", icon: UsersRound }
];

const related: RelatedLink[] = [
  { title: "Sunday School · B.L.A.S.T.", meta: "Structured Bible learning", href: "/grow/sunday-school", icon: Sparkles },
  { title: "Bible Study & Prayer", meta: "For adults & families", href: "/grow/bible-study-prayer", icon: BookOpen },
  { title: "Worship", meta: "See the full Sunday experience", href: "/worship", icon: Heart }
];

export default function KidsCircle() {
  const experienceRef = useRevealOnScroll<HTMLElement>({ staggerChildren: true });
  const parentRef = useRevealOnScroll<HTMLElement>();

  return <>
    <InnerHero
      titleId="kc-title"
      kicker={{ ta: "குழந்தைகள் வட்டம்", en: "Grow" }}
      title={<>A little space for faith to <em>bud and bloom.</em></>}
      lede="During Sunday worship, Kids Circle gives children a brief, joyful place to hear God’s Word, ask questions, make friends, and know they are loved."
      action={{ label: "Plan a family visit", to: "/visit" }}
      card={{
        ariaLabel: "Kids Circle details",
        icon: UsersRound,
        label: "During Sunday worship",
        title: "Kids Circle",
        details: [
          { icon: CalendarDays, text: "Every Sunday" },
          { icon: ShieldCheck, text: "Warm and child-friendly" }
        ],
        link: { label: "Ask a parent question", to: "/contact" }
      }}
    />

    <section className="kc-experience reveal" ref={experienceRef} aria-labelledby="kc-experience-title">
      <SectionHeader eyebrow="A joyful moment in worship" title="What children experience" text="Kids Circle is intentionally brief, accessible, and full of opportunities for children to participate." />
      <div className="kc-experience-body"><div className="kc-experience-list" id="kc-experience-title">{experiences.map((item,index)=>{const Icon=item.icon;return <article className="kc-experience-row" key={item.title} data-reveal-child><span className="kc-row-number">{formatStep(index)}</span><span className="kc-row-icon"><Icon size={21}/></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>;})}</div><img className="kc-experience-photo" src={siteImages.kidsCircleNameOrnaments.src} alt={siteImages.kidsCircleNameOrnaments.alt} width="1400" height="1050" loading="lazy" style={{objectPosition:siteImages.kidsCircleNameOrnaments.objectPosition}} /></div></section>

    <section className="kc-parent-band reveal" ref={parentRef} aria-labelledby="kc-parent-title">
      <div className="kc-parent-copy"><span className="eyebrow">For parents</span><h2 id="kc-parent-title">Brief, meaningful, and part of worship.</h2><p>Kids Circle is not a separate children’s service. It is a welcoming moment within Sunday worship where children receive concise Bible teaching before continuing through the service with their family.</p><ul><li><Sparkles size={18}/><span>Designed for children’s attention</span></li><li><BookOpen size={18}/><span>Rooted in God’s Word</span></li><li><ShieldCheck size={18}/><span>Led with warmth and care</span></li></ul></div>
      <div className="kc-parent-image"><img src={siteImages.kidsCircleNameEggs.src} alt={siteImages.kidsCircleNameEggs.alt} loading="lazy" width="1152" height="1439" style={{objectPosition:siteImages.kidsCircleNameEggs.objectPosition}} /></div>
    </section>

    <section className="kc-blast" aria-labelledby="kc-blast-title"><div><span className="eyebrow">The next step for children</span><h2 id="kc-blast-title">Kids Circle opens the door. B.L.A.S.T. goes deeper.</h2><p>Both are part of our children’s ministry. Kids Circle is the brief teaching moment during worship; B.L.A.S.T. Sunday School offers structured Bible Learning And Spiritual Training during the sermon.</p><Link to="/grow/sunday-school">Explore B.L.A.S.T. Sunday School <ArrowRight size={15}/></Link></div><div className="kc-blast-words" aria-label="B.L.A.S.T. means Bible Learning And Spiritual Training"><span><strong>B</strong>Bible</span><span><strong>L</strong>Learning</span><span><strong>A</strong>And</span><span><strong>S</strong>Spiritual</span><span><strong>T</strong>Training</span></div></section>

    <section className="kc-verse" aria-labelledby="kc-verse-title"><div className="kc-verse-visual"><img src={siteImages.kidsCircleHeroBlessings.src} alt={siteImages.kidsCircleHeroBlessings.alt} loading="lazy" width="1695" height="848" /><blockquote><p lang="ta">“இதோ, பிள்ளைகள் கர்த்தரால் வரும் சுதந்தரம்.”</p><cite>Psalm 127:4</cite></blockquote></div><div><span className="eyebrow">Bud & bloom</span><h2 id="kc-verse-title">Every child is a unique gift from God.</h2><p>We want children to know God’s love and experience the love of His people in a church family where they can learn, grow, discover, and belong.</p></div></section>

    <section className="kc-related" aria-labelledby="kc-related-title"><SectionHeader eyebrow="Continue growing" title="More for your family"/><RelatedLinks items={related} className="kc-related-list" id="kc-related-title" /><p className="kc-sunday-note">Join us {churchInfo.worship.schedule}. We’ll help your family know what to expect when you arrive.</p></section>
  </>;
}
