import { useEffect, useState } from "react";
import { featuredEvent, type FeaturedEvent } from "../data/site";
import { isFeaturedEventActive, todayInChicago } from "../utils/featuredEvent";

/**
 * The featured event while it is current, otherwise null.
 *
 * Pages are prerendered at build time, so the first render judges the event
 * against the build date (the same answer the static HTML gave, which keeps
 * hydration clean). After mount it re-checks against the visitor's real date,
 * so an event drops off the day after it ends even before the next rebuild.
 */
export function useFeaturedEvent(event: FeaturedEvent | null = featuredEvent) {
  const [active, setActive] = useState(() => isFeaturedEventActive(event, __BUILD_DATE__));

  useEffect(() => {
    setActive(isFeaturedEventActive(event, todayInChicago()));
  }, [event]);

  return active ? event : null;
}
