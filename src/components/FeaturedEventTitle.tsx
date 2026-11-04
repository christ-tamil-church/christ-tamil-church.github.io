import type { FeaturedEvent } from "../data/site";

/** The event title as plain text, for labels: "Worship Theme: Being vigilant". */
export function featuredEventTitleText(event: FeaturedEvent) {
  return event.titleLead ? `${event.titleLead} ${event.title}` : event.title;
}

/** The event title, with the title itself in italics after a `titleLead`. */
export default function FeaturedEventTitle({ event }: { event: FeaturedEvent }) {
  if (!event.titleLead) return <>{event.title}</>;
  return (
    <>
      {event.titleLead} <em className="featured-event-title-theme">{event.title}</em>
    </>
  );
}
