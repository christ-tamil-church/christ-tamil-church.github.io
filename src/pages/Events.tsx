import { ArrowRight, CalendarDays, Clock, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import InnerHero from "../components/InnerHero";
import { churchEvents, churchInfo, type ChurchEvent } from "../data/site";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import "./Events.css";

function EventRow({ event }: { event: ChurchEvent }) {
  return (
    <article className="ctc-events-row" data-reveal-child>
      <div className="ctc-events-row-media">
        {event.image ? (
          <img src={event.image} alt="" width="640" height="360" loading="lazy" />
        ) : (
          <span className="ctc-events-row-fallback" aria-hidden="true">
            <CalendarDays size={40} />
          </span>
        )}
      </div>

      <div className="ctc-events-row-copy">
        <p className="ctc-events-row-category">{event.category}</p>
        <h3>{event.title}</h3>
        <div className="ctc-events-row-schedule">
          <span><CalendarDays size={15} aria-hidden="true" /> {event.date}</span>
          {event.time ? <span><Clock size={15} aria-hidden="true" /> {event.time}</span> : null}
          {event.location ? <span><MapPin size={15} aria-hidden="true" /> {event.location}</span> : null}
        </div>
        <p className="ctc-events-row-description">{event.description}</p>
      </div>
    </article>
  );
}

export default function Events() {
  const listRef = useRevealOnScroll<HTMLDivElement>({
    staggerChildren: true,
    staggerStepMs: 85
  });

  return (
    <div className="ctc-events-page">
      <InnerHero
        titleId="events-title"
        kicker={{ ta: "ஒன்றுகூடுவோம்", en: "Events" }}
        title={["There is a place", <>for you <em>here.</em></>]}
        lede="Worship, learn, pray, and share life with our Tamil Christian church family. Explore the rhythms and gatherings that bring us together."
        action={{ label: "See what’s coming up", to: "#upcoming-events" }}
        card={{
          ariaLabel: "Sunday worship invitation",
          icon: CalendarDays,
          label: "Planning your first visit?",
          title: "Start with Sunday worship.",
          details: [
            { icon: Clock, text: `Each Sunday at ${churchInfo.worship.time}` },
            { icon: MapPin, text: churchInfo.address.short },
            { icon: Heart, text: "Children are warmly welcomed" }
          ],
          link: { label: "Plan your visit", to: "/visit" }
        }}
      />

      <section className="ctc-events-upcoming" id="upcoming-events" aria-labelledby="upcoming-title">
        <div className="ctc-events-shell">
          <header className="ctc-events-list-heading">
            <p>Church life · சபை வாழ்க்கை</p>
            <h2 id="upcoming-title">Upcoming at CTC.</h2>
          </header>

          {churchEvents.length ? (
            <div className="ctc-events-list ctc-events-reveal" ref={listRef}>
              {churchEvents.map((event) => <EventRow event={event} key={event.title} />)}
            </div>
          ) : (
            <div className="ctc-events-empty" role="status">
              <CalendarDays size={30} aria-hidden="true" />
              <h3>No gatherings are listed right now.</h3>
              <p>Please contact us for the latest church schedule.</p>
              <Link className="ctc-events-row-link" to="/contact">
                Contact the church <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
