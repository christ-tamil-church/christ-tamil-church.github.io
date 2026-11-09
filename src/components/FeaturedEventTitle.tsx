import type { FeaturedEvent } from "../data/site";

/** The event title as plain text, for labels: "Worship Theme: Being vigilant". */
export function featuredEventTitleText(event: FeaturedEvent) {
  return event.titleLead ? `${event.titleLead} ${event.title}` : event.title;
}

/** The lead-in as a small-label word ("Worship Theme"), or null without one. */
export function featuredEventLeadLabel(event: FeaturedEvent) {
  return event.titleLead ? event.titleLead.replace(/:\s*$/, "") : null;
}

/**
 * The event title, with the title itself in italics after a `titleLead`.
 * The hero cards are too narrow for both on one line, so they move the lead
 * into their small label (see featuredEventLeadLabel) and pass
 * `showLead={false}` to keep the italic title alone.
 */
export default function FeaturedEventTitle({
  event,
  showLead = true
}: {
  event: FeaturedEvent;
  showLead?: boolean;
}) {
  if (!event.titleLead) return <>{event.title}</>;
  const theme = <em className="featured-event-title-theme">{event.title}</em>;
  if (!showLead) return theme;
  return (
    <>
      {event.titleLead} {theme}
    </>
  );
}
