// @vitest-environment node
//
// Mirrors scripts/prerender.mjs: every route must render to HTML on the server
// without touching browser-only globals, or `npm run build` fails.
import { describe, expect, it } from "vitest";
import { pageMeta, render } from "../../src/entry-server";

describe("server rendering", () => {
  it.each(Object.keys(pageMeta))("renders %s to HTML", (path) => {
    const html = render(path);
    expect(html).toContain("<h1");
    expect(html).toContain('id="main-content"');
    expect(html).toContain('class="site-header"');
  });

  it("renders the not-found page for unknown paths", () => {
    expect(render("/does-not-exist")).toContain("We couldn&#x27;t find that page.");
  });
});
