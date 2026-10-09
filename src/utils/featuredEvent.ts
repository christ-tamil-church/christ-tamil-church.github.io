import type { FeaturedEvent } from "../data/site";

const CHURCH_TIME_ZONE = "America/Chicago";

/** Today's calendar date at the church, as YYYY-MM-DD. */
export function todayInChicago(now = new Date()) {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CHURCH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}

/** An event stays featured through the whole of its last day. */
export function isFeaturedEventActive(event: FeaturedEvent | null, todayIso: string): event is FeaturedEvent {
  return event !== null && event.endsOn >= todayIso;
}

// Event dates are plain calendar days, so they are read and written in UTC
// to stop the visitor's own time zone shifting them by a day.
function format(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

/** "Sunday, October 11", or "Saturday, October 10 – Sunday, October 11". */
export function formatEventDateLong({ startsOn, endsOn }: FeaturedEvent) {
  const long = { weekday: "long", month: "long", day: "numeric" } as const;
  return startsOn === endsOn ? format(startsOn, long) : `${format(startsOn, long)} – ${format(endsOn, long)}`;
}

/** "Sun, Oct 11", or "Oct 10 – 11" / "Oct 31 – Nov 2" for several days. */
export function formatEventDateShort({ startsOn, endsOn }: FeaturedEvent) {
  if (startsOn === endsOn) return format(startsOn, { weekday: "short", month: "short", day: "numeric" });
  const sameMonth = startsOn.slice(0, 7) === endsOn.slice(0, 7);
  const end = sameMonth ? format(endsOn, { day: "numeric" }) : format(endsOn, { month: "short", day: "numeric" });
  return `${format(startsOn, { month: "short", day: "numeric" })} – ${end}`;
}

/** The pieces of the start date, for the lettered placeholder poster. */
export function eventDateParts({ startsOn }: FeaturedEvent) {
  return {
    weekday: format(startsOn, { weekday: "long" }),
    month: format(startsOn, { month: "short" }),
    day: format(startsOn, { day: "numeric" })
  };
}
