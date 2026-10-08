import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Coffee,
  HeartHandshake,
  MapPin,
  Music,
  Sparkles,
  Sun,
  Wheat
} from "lucide-react";
import InnerHero from "../components/InnerHero";
import { pathwayLabels } from "../data/ministryPathways";
import { siteImages, type SiteImage } from "../data/images";
import { churchInfo } from "../data/site";
import { useRevealGroup } from "../hooks/useRevealGroup";
import "./Connect.css";

type ConnectTradition = {
  number: string;
  title: string;
  text: string;
  icon: typeof Sun;
  photo?: { image: SiteImage; width: number; height: number };
};

/* The hero carries words only; each tradition shows its own photo instead. */
const connectTraditions: ConnectTradition[] = [
  {
    number: "01",
    title: "Summer Picnic",
    text: "An easygoing day outdoors with shared food, games, conversation, and time for every generation to enjoy being together.",
    icon: Sun,
    photo: { image: siteImages.fellowshipPicnic, width: 1100, height: 846 }
  },
  {
    number: "02",
    title: "Family Visits",
    text: "Fellowship travels beyond the church building as families visit, encourage, pray with, and care for one another.",
    icon: HeartHandshake
  },
  {
    number: "03",
    title: "Summer Carnival",
    text: "A joyful community celebration where children, parents, friends, and neighbors can share activities, laughter, and hospitality.",
    icon: Sparkles,
    photo: { image: siteImages.fellowshipCarnival, width: 800, height: 1000 }
  },
  {
    number: "04",
    title: "Harvest Festival",
    text: "A seasonal gathering to give thanks for God’s goodness and celebrate with food, family activities, and fellowship.",
    icon: Wheat,
    photo: { image: siteImages.fellowshipHarvest, width: 1100, height: 825 }
  },
  {
    number: "05",
    title: "Carol Rounds",
    text: "At Christmas, we carry songs of hope from home to home and share the joy of Christ’s birth with our church family.",
    icon: Music,
    photo: { image: siteImages.fellowshipChristmas, width: 1100, height: 825 }
  }
];

export default function Connect() {
  const pageRef = useRevealGroup<HTMLDivElement>(".connect-reveal");

  return (
    <div className="connect-page" ref={pageRef}>
      <InnerHero
        titleId="connect-title"
        kicker={pathwayLabels.connect}
        title={["Come as a guest.", <>Leave as <em>family.</em></>]}
        lede="Faith grows in shared life. Around the table, through every season, and in one another’s homes, there is a place for you to belong."
        action={{ label: "Plan your first Sunday", to: "/visit" }}
        card={{
          ariaLabel: "Sunday fellowship details",
          icon: Coffee,
          label: "Every Sunday",
          title: "Fellowship after worship",
          details: [
            { icon: Clock, text: `After ${churchInfo.worship.time} worship` },
            { icon: MapPin, text: <>Fellowship auditorium<br />{churchInfo.address.short}</> }
          ],
          link: { label: "Get directions", href: churchInfo.address.directionsUrl }
        }}
      />

      <section className="connect-band connect-fellowship connect-reveal" id="fellowship-hour" aria-labelledby="fellowship-title">
        <div className="connect-shell connect-fellowship-grid">
          <figure className="connect-fellowship-photo">
            <img
              src={siteImages.fellowshipTable.src}
              alt={siteImages.fellowshipTable.alt}
              width="1070"
              height="716"
              loading="lazy"
            />
            <figcaption>Food, friendship, and time to be known.</figcaption>
          </figure>

          <div className="connect-fellowship-copy">
            <p className="connect-eyebrow">Friendly fellowship hour</p>
            <h2 id="fellowship-title">The table is part of our Sunday rhythm.</h2>
            <p>
              After worship and children’s Sunday school, we gather in the auditorium
              to share a meal and spend unhurried time together. It is a simple, welcoming
              way to meet people, exchange stories, and begin building friendships.
            </p>
            <blockquote>
              Our fellowship is rooted in the unity we share through Christ—supporting
              one another and growing together in faith.
            </blockquote>
            <Link className="connect-text-link" to="/visit">
              Plan your first Sunday <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="connect-band connect-traditions connect-reveal" aria-labelledby="traditions-title">
        <div className="connect-shell connect-traditions-grid">
          <header className="connect-heading">
            <p className="connect-eyebrow">Through the year</p>
            <h2 id="traditions-title">Traditions that turn moments into memories.</h2>
            <p>Our calendar makes room for celebration, care, and the kind of friendship that continues beyond Sundays.</p>
          </header>

          <div className="connect-tradition-list">
            {connectTraditions.map((tradition) => {
              const Icon = tradition.icon;
              return (
                <article key={tradition.title} className={tradition.photo ? "has-photo" : undefined}>
                  <span className="connect-tradition-number">{tradition.number}</span>
                  <Icon size={21} aria-hidden="true" />
                  <div>
                    <h3>{tradition.title}</h3>
                    <p>{tradition.text}</p>
                  </div>
                  {tradition.photo && (
                    <img
                      className="connect-tradition-photo"
                      src={tradition.photo.image.src}
                      alt={tradition.photo.image.alt}
                      width={tradition.photo.width}
                      height={tradition.photo.height}
                      loading="lazy"
                      style={{ objectPosition: tradition.photo.image.objectPosition }}
                    />
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="connect-band connect-care connect-reveal" aria-labelledby="care-title">
        <div className="connect-shell connect-care-grid">
          <div className="connect-care-intro">
            <img
              className="connect-care-photo"
              src={siteImages.fellowshipCampfire.src}
              alt={siteImages.fellowshipCampfire.alt}
              width="1100"
              height="660"
              loading="lazy"
            />
            <p className="connect-eyebrow">Life together</p>
            <h2 id="care-title">Connection that continues beyond an event.</h2>
            <p>
              Fellowship means showing up for one another—in celebration, in prayer,
              and in seasons when a family could use encouragement. You do not need
              to know anyone before you come; we would be glad to introduce you.
            </p>
          </div>

          <aside className="connect-care-invitation" aria-labelledby="seat-title">
            <p className="connect-eyebrow">Your seat is waiting</p>
            <h3 id="seat-title">Stay after worship. Share a meal. Start a friendship.</h3>
            <p>Join us Sunday at {churchInfo.worship.time} in Downers Grove, or reach out and we will help you feel at home.</p>
            <Link className="connect-text-link" to="/events">
              Explore gatherings <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
