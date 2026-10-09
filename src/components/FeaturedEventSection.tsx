import { ArrowRight, ArrowUpRight, CalendarDays, Clock, Mail, MapPin, Phone } from "lucide-react";
import { churchInfo, type FeaturedEvent } from "../data/site";
import { eventDateParts, formatEventDateLong } from "../utils/featuredEvent";
import "./FeaturedEventSection.css";

// Flyers arrive in any shape. Wide banners (like a 3:1 header graphic) run
// the full width with the details beneath; portrait and square flyers sit
// beside the details instead, so they never balloon to a screen-tall image.
const WIDE_FLYER_RATIO = 1.6;

function Flyer({ event }: { event: FeaturedEvent }) {
  const flyer = event.flyer!;
  return (
    <figure className="ctc-featured-flyer">
      <a
        className="ctc-featured-flyer-frame"
        href={flyer.src}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open the full-size flyer for ${event.title} in a new tab`}
      >
        <img
          src={flyer.src}
          srcSet={flyer.srcSet}
          sizes="(max-width: 1248px) calc(100vw - 48px), 1200px"
          width={flyer.width}
          height={flyer.height}
          alt={event.flyerAlt}
          decoding="async"
        />
      </a>
      <figcaption>
        <a href={flyer.src} target="_blank" rel="noreferrer">
          View full-size flyer
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

// Stands in for the flyer when none was supplied: the event lettered in the
// site's own type on deep green. Purely visual; the same facts follow as text.
function PlaceholderPoster({ event }: { event: FeaturedEvent }) {
  const { weekday, month, day } = eventDateParts(event);
  return (
    <div className="ctc-featured-poster" aria-hidden="true">
      <div className="ctc-featured-poster-date">
        <span>{month}</span>
        <strong>{day}</strong>
        <span>{weekday}</span>
      </div>
      <div className="ctc-featured-poster-copy">
        <p>{event.title}</p>
        <span>{event.time} · Christ Tamil Church</span>
      </div>
    </div>
  );
}

export default function FeaturedEventSection({ event }: { event: FeaturedEvent }) {
  const { flyer } = event;
  // Full class names (not built from parts) so scripts/prune-global-css.mjs
  // can see they are used.
  const layout = !flyer
    ? "ctc-featured--poster"
    : (flyer.width ?? 16) / (flyer.height ?? 9) >= WIDE_FLYER_RATIO
      ? "ctc-featured--wide"
      : "ctc-featured--tall";

  return (
    <section
      className={`ctc-featured ${layout}`}
      id="featured"
      aria-labelledby="featured-title"
    >
      <div className="ctc-featured-inner">
        {flyer ? <Flyer event={event} /> : <PlaceholderPoster event={event} />}

        <div className="ctc-featured-details">
          <div className="ctc-featured-heading">
            <h2 id="featured-title">{event.title}</h2>
            <ul className="ctc-featured-facts">
              <li>
                <CalendarDays size={17} aria-hidden="true" />
                <time dateTime={event.startsOn}>{formatEventDateLong(event)}</time>
              </li>
              <li>
                <Clock size={17} aria-hidden="true" />
                {event.time}
              </li>
              <li>
                <MapPin size={17} aria-hidden="true" />
                {event.location}
              </li>
            </ul>
          </div>

          <div className="ctc-featured-body">
            <p>{event.summary}</p>
            <a className="ctc-featured-directions" href={event.directionsUrl} target="_blank" rel="noreferrer">
              Get directions
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <p className="ctc-featured-ask">
              <span>Questions? We’d love to hear from you.</span>
              <a href={churchInfo.contact.phoneHref}>
                <Phone size={15} aria-hidden="true" />
                {churchInfo.contact.phone}
              </a>
              <a href={churchInfo.contact.emailHref}>
                <Mail size={15} aria-hidden="true" />
                Email us
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
