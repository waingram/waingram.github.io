import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  flattenJsonLd,
  parseSitemapLocations,
  validateJsonEndpoint,
  validateJsonLdNode,
  validatePageHtml,
  validateSitemap,
} from "./site-evals.mjs";

describe("site eval helpers", () => {
  it("parses sitemap locations and requires absolute canonical URLs", () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://waingram.github.io/</loc></url>
  <url><loc>https://waingram.github.io/publications/</loc></url>
</urlset>`;

    assert.deepEqual(parseSitemapLocations(sitemap), [
      "https://waingram.github.io/",
      "https://waingram.github.io/publications/",
    ]);
    assert.deepEqual(validateSitemap(sitemap, ["https://waingram.github.io/"]), []);
    assert.match(validateSitemap("<urlset><url><loc>/relative</loc></url></urlset>", [])[0], /absolute URL/);
  });

  it("validates generated JSON endpoints by collection contract", () => {
    const errors = validateJsonEndpoint("publications.json", {
      id: "https://waingram.github.io/publications.json",
      type: "publication_collection",
      is_complete_publication_list: true,
      publications: [
        {
          id: "https://waingram.github.io/publications/example/",
          type: "ScholarlyArticle",
          bibtex_key: "example",
          title: "Example article",
          authors: ["Ingram, William A."],
          year: "2026",
        },
      ],
    });

    assert.deepEqual(errors, []);
    assert.match(validateJsonEndpoint("projects.json", { type: "project_collection", projects: [] })[0], /id/);
  });

  it("flattens @graph JSON-LD and validates schema-specific required fields", () => {
    const nodes = flattenJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": "https://waingram.github.io/#waingram",
          name: "William A. Ingram",
        },
        {
          "@type": "Event",
          name: "Research talk",
          startDate: "2026-10-01T13:00:00-04:00",
          location: {
            "@type": "Place",
            name: "Library",
            address: {
              "@type": "PostalAddress",
              streetAddress: "560 Drillfield Dr",
              addressLocality: "Blacksburg",
              addressRegion: "VA",
              postalCode: "24061",
              addressCountry: "US",
            },
          },
        },
      ],
    });

    assert.equal(nodes.length, 2);
    assert.deepEqual(validateJsonLdNode(nodes[0], "fixture"), []);
    assert.deepEqual(validateJsonLdNode(nodes[1], "fixture"), []);
    assert.match(validateJsonLdNode({ "@type": "Event", name: "Broken" }, "fixture")[0], /startDate/);
  });

  it("extracts and validates embedded JSON-LD plus core HTML contracts", () => {
    const html = `<!doctype html>
<html lang="en">
<head>
  <title>William A. Ingram</title>
  <link rel="alternate" type="application/ld+json" href="/knowledge-graph.jsonld">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ProfilePage","mainEntity":{"@type":"Person","name":"William A. Ingram"}}
  </script>
</head>
<body>
  <a href="#content">Skip</a>
  <main id="content"><h1>William A. Ingram</h1><a href="/research/">Research</a></main>
</body>
</html>`;

    assert.deepEqual(validatePageHtml("index.html", html, new Set(["/research/", "/knowledge-graph.jsonld"])), []);
    assert.match(
      validatePageHtml("broken.html", html.replace('id="content"', ""), new Set())[0],
      /main id="content"/,
    );
  });
});
