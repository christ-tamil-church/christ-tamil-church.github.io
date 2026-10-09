import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The church's calendar date when the site is built (YYYY-MM-DD). Prerendered
// pages decide whether the featured event is still current from this; the
// browser then re-checks against the real date (src/hooks/useFeaturedEvent.ts).
const buildDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());

export default defineConfig({
  base: "/",
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate)
  }
});
