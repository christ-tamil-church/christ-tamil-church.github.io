import {
  CalendarDays,
  HandHeart,
  Package,
  Utensils
} from "lucide-react";
import InnerHero from "../components/InnerHero";
import { siteImages } from "../data/images";
import { pathwayLabels } from "../data/ministryPathways";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import "./Serve.css";

const outreachActivities = [
  {
    number: "01",
    title: "Pack food",
    text: "Help prepare food packages for children and families facing hunger.",
    icon: Package
  },
  {
    number: "02",
    title: "Serve meals",
    text: "Offer a meal, a warm welcome, and practical care to neighbors in need.",
    icon: Utensils
  },
  {
    number: "03",
    title: "Give through donation drives",
    text: "Support verified collections that care for people experiencing hardship.",
    icon: HandHeart
  }
];

export default function Serve() {
  const storyRef = useRevealOnScroll<HTMLDivElement>();
  const waysRef = useRevealOnScroll<HTMLDivElement>({
    staggerChildren: true,
    staggerStepMs: 110
  });

  return (
    <div className="ctc-serve-page">
      <InnerHero
        titleId="serve-title"
        kicker={pathwayLabels.serve}
        title={<>Love your neighbor in <em>practical ways.</em></>}
        lede="Grow in Christ as you care for our neighbors through food, generosity, prayer, and a willing heart."
        action={{ label: "Ask about serving", to: "/contact" }}
        card={{
          ariaLabel: "Next community outreach",
          icon: CalendarDays,
          label: "Community outreach",
          title: "Saturday before Communion Sunday",
          details: [
            { icon: Package, text: "Food packing, meals, and donation drives" }
          ]
        }}
      />

      <section className="ctc-serve-story" aria-labelledby="serve-story-title">
        <div className="ctc-serve-shell ctc-serve-story-grid ctc-serve-reveal" ref={storyRef}>
          <header>
            <p className="ctc-serve-eyebrow">Serving to grow in Christ</p>
            <h2 id="serve-story-title">Compassion becomes visible when we serve.</h2>
            <img
              className="ctc-serve-story-photo"
              src={siteImages.outreachHeroPacking.src}
              alt={siteImages.outreachHeroPacking.alt}
              width={960}
              height={720}
              loading="lazy"
            />
          </header>
          <div className="ctc-serve-story-copy">
            <p>
              Community outreach is one of the practical ways you can participate,
              grow, and serve with Christ Tamil Church. Together, we help pack food
              for children, serve meals to people in need, and organize donation
              drives for disadvantaged neighbors.
            </p>
            <p className="ctc-serve-partner">
              Our outreach has included serving with{" "}
              <a href="https://www.fmsc.org/" target="_blank" rel="noreferrer">
                Feed My Starving Children
              </a>
              , packing nutritious meals for children in need, and volunteering with{" "}
              <a href="https://www.samaritanspurse.org/" target="_blank" rel="noreferrer">
                Samaritan&apos;s Purse
              </a>
              .
            </p>
            <blockquote>
              <p lang="ta">“கருணைக்கண்ணன் ஆசீர்வதிக்கப்படுவான்; அவன் தன் ஆகாரத்தில் தரித்திரனுக்குக் கொடுக்கிறான்.”</p>
              <cite>Proverbs 22:9</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="ctc-serve-ways" aria-labelledby="serve-ways-title">
        <div className="ctc-serve-shell">
          <header className="ctc-serve-section-heading">
            <p className="ctc-serve-eyebrow">Ways to take part · சேவை</p>
            <h2 id="serve-ways-title">Bring what you have. Serve where you are.</h2>
            <p>Every act of care can help a neighbor feel seen, valued, and loved.</p>
          </header>

          <div className="ctc-serve-way-list ctc-serve-reveal" ref={waysRef}>
            {outreachActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <article className="ctc-serve-way" data-reveal-child key={activity.title}>
                  <span className="ctc-serve-way-number">{activity.number}</span>
                  <span className="ctc-serve-way-icon" aria-hidden="true">
                    <Icon size={23} />
                  </span>
                  <div>
                    <h3>{activity.title}</h3>
                    <p>{activity.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
