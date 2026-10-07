// Writes static HTML for every route after `vite build`, plus sitemap.xml,
// robots.txt, legacy-URL redirect pages, and a real 404.html.
//
// GitHub Pages serves dist/<route>/index.html with HTTP 200, so search engines
// get each page's own title, description, canonical URL, Open Graph tags,
// structured data, and body content without running JavaScript.
//
// Run by `npm run build`; needs the SSR bundle from
// `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

process.env.NODE_ENV ??= "production";
const server = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
const { render, pageMeta, notFoundMeta, legacyRedirects, canonicalUrl, absoluteUrl, shareImage, siteName, siteUrl, structuredData } = server;

const template = readFileSync(join(dist, "index.html"), "utf8");
const headPattern = /<!--seo-head-->[\s\S]*?<!--\/seo-head-->/;
if (!headPattern.test(template) || !template.includes("<!--app-html-->")) {
  throw new Error("dist/index.html is missing the <!--seo-head--> or <!--app-html--> markers.");
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeText = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Keep "</script>" inside JSON from closing the tag early.
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

function headFor(path, meta, { indexable }) {
  const url = canonicalUrl(path);
  const image = absoluteUrl(shareImage.src);
  const tags = [
    `<title>${escapeText(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    indexable ? `<link rel="canonical" href="${url}" />` : `<meta name="robots" content="noindex" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(siteName)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(shareImage.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`
  ];
  if (indexable) tags.push(`<script type="application/ld+json">${jsonLd(structuredData(path))}</script>`);
  return tags.join("\n    ");
}

function write(file, html) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function pageHtml(path, meta, options) {
  return template
    .replace(headPattern, headFor(path, meta, options))
    .replace("<!--app-html-->", render(path));
}

const routes = Object.keys(pageMeta);
for (const path of routes) {
  const file = path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
  write(file, pageHtml(path, pageMeta[path], { indexable: true }));
}

// GitHub Pages serves this with HTTP 404 for any path without a file.
write(join(dist, "404.html"), pageHtml("/404", notFoundMeta, { indexable: false }));

// Old URLs (many from the previous christtamilchurch.com site). Static hosting
// cannot send a 301, so an instant meta refresh plus a canonical to the new
// page is the closest equivalent search engines honor.
for (const [from, to] of Object.entries(legacyRedirects)) {
  const [targetPath, hash] = to.split("#");
  // Relative, so the redirect also works on local previews and the old domain.
  const target = `${targetPath}/` + (hash ? `#${hash}` : "");
  write(
    join(dist, from, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting… | ${escapeText(siteName)}</title>
    <link rel="canonical" href="${canonicalUrl(targetPath)}" />
    <meta http-equiv="refresh" content="0; url=${escapeAttr(target)}" />
    <script>location.replace(${JSON.stringify(target)});</script>
  </head>
  <body>
    <p>This page has moved to <a href="${escapeAttr(target)}">${escapeText(target)}</a>.</p>
  </body>
</html>
`
  );
}

const today = new Date().toISOString().slice(0, 10);
write(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((path) => `  <url><loc>${canonicalUrl(path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
);

write(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${routes.length} pages, ${Object.keys(legacyRedirects).length} redirects, 404.html, sitemap.xml, robots.txt`);
