// Build-time entry used by scripts/prerender.mjs to write static HTML for each
// route, so search engines and link previews see real content and metadata.
// The browser still starts from src/main.tsx and renders the app afresh.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

export {
  absoluteUrl,
  canonicalUrl,
  getPageMeta,
  legacyRedirects,
  notFoundMeta,
  pageMeta,
  shareImage,
  siteName,
  siteUrl,
  structuredData
} from "./seo";
