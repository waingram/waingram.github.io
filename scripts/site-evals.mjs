import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const SITE_URL = "https://waingram.github.io";

const STRUCTURED_ENDPOINTS = [
  "/research.json",
  "/projects.json",
  "/grants.json",
  "/publications.json",
  "/knowledge-graph.jsonld",
];

const CORE_HTML_PATHS = ["/", "/research/", "/publications/", "/experience/", "/blog/"];

const BANNED_COPY = [
  "proof surface",
  "worshop",
  "Contratulations",
  "program informaion",
  "Grant awared",
];

function toArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function compact(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasText(value) {
  return compact(value).length > 0;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isCanonicalSiteUrl(value) {
  try {
    const url = new URL(value);
    return url.origin === SITE_URL;
  } catch {
    return false;
  }
}

function addRequired(errors, object, property, source) {
  const value = object?.[property];
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && !hasText(value)) ||
    (Array.isArray(value) && value.length === 0)
  ) {
    errors.push(`${source}: missing required ${property}`);
  }
}

function getTypes(node) {
  return toArray(node?.["@type"]).map(String);
}

function hasType(node, type) {
  return getTypes(node).includes(type);
}

function decodeXmlEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

export function parseSitemapLocations(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => decodeXmlEntities(match[1]));
}

export function validateSitemap(xml, expectedUrls = []) {
  const errors = [];
  if (!xml.includes("<urlset")) errors.push("sitemap.xml: missing <urlset>");

  const locations = parseSitemapLocations(xml);
  if (locations.length === 0) errors.push("sitemap.xml: no <loc> entries found");

  const seen = new Set();
  for (const location of locations) {
    if (!isAbsoluteUrl(location)) {
      errors.push(`sitemap.xml: ${location} is not a fully qualified absolute URL`);
      continue;
    }
    if (!isCanonicalSiteUrl(location)) {
      errors.push(`sitemap.xml: ${location} is not on the canonical site origin ${SITE_URL}`);
    }
    if (seen.has(location)) errors.push(`sitemap.xml: duplicate URL ${location}`);
    seen.add(location);
  }

  for (const expectedUrl of expectedUrls) {
    if (!seen.has(expectedUrl)) errors.push(`sitemap.xml: missing expected URL ${expectedUrl}`);
  }

  for (const match of xml.matchAll(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/g)) {
    const value = match[1].trim();
    if (Number.isNaN(Date.parse(value))) {
      errors.push(`sitemap.xml: invalid lastmod value ${value}`);
    }
  }

  return errors;
}

export function flattenJsonLd(value) {
  if (Array.isArray(value)) return value.flatMap((item) => flattenJsonLd(item));
  if (!isObject(value)) return [];
  if (Array.isArray(value["@graph"])) return value["@graph"].flatMap((item) => flattenJsonLd(item));
  return [value];
}

function validateEventNode(node, source) {
  const errors = [];
  addRequired(errors, node, "name", source);
  addRequired(errors, node, "startDate", source);

  if (hasText(node.startDate) && Number.isNaN(Date.parse(node.startDate))) {
    errors.push(`${source}: Event startDate must be ISO-parseable`);
  }

  if (!isObject(node.location)) {
    errors.push(`${source}: Event missing required location object`);
    return errors;
  }

  const locationTypes = getTypes(node.location);
  const online = String(node.eventAttendanceMode || "").includes("OnlineEventAttendanceMode");
  if (online) {
    if (!locationTypes.includes("VirtualLocation")) {
      errors.push(`${source}: online Event location should be a VirtualLocation`);
    }
    addRequired(errors, node.location, "url", `${source}: Event location`);
    return errors;
  }

  if (!locationTypes.includes("Place")) {
    errors.push(`${source}: Event location should be a Place`);
  }
  addRequired(errors, node.location, "name", `${source}: Event location`);
  if (!isObject(node.location.address)) {
    errors.push(`${source}: Event location missing required PostalAddress`);
  } else {
    const address = node.location.address;
    if (!getTypes(address).includes("PostalAddress")) {
      errors.push(`${source}: Event location.address should be a PostalAddress`);
    }
    for (const property of ["streetAddress", "addressLocality", "addressCountry"]) {
      addRequired(errors, address, property, `${source}: Event location.address`);
    }
  }
  return errors;
}

export function validateJsonLdNode(node, source) {
  const errors = [];
  if (!isObject(node)) return [`${source}: JSON-LD node is not an object`];

  const types = getTypes(node);
  if (types.length === 0) errors.push(`${source}: JSON-LD node missing @type`);

  if (hasText(node["@id"]) && !isAbsoluteUrl(node["@id"]) && !String(node["@id"]).startsWith("#")) {
    errors.push(`${source}: @id must be an absolute URL or local fragment`);
  }

  if (node["@context"] && node["@context"] !== "https://schema.org") {
    errors.push(`${source}: @context should be https://schema.org`);
  }

  if (hasType(node, "ProfilePage")) {
    if (!isObject(node.mainEntity)) {
      errors.push(`${source}: ProfilePage missing required mainEntity`);
    } else if (!hasText(node.mainEntity.name) && !hasText(node.mainEntity.alternateName)) {
      errors.push(`${source}: ProfilePage mainEntity missing required name or alternateName`);
    }
  }

  if (["Person", "Organization", "CollegeOrUniversity", "LibrarySystem", "ResearchOrganization"].some((type) => hasType(node, type))) {
    addRequired(errors, node, "name", source);
  }

  if (hasType(node, "BlogPosting")) {
    if (!hasText(node.headline) && !hasText(node.name)) errors.push(`${source}: BlogPosting missing headline or name`);
    addRequired(errors, node, "author", source);
    addRequired(errors, node, "datePublished", source);
  }

  if (hasType(node, "ScholarlyArticle")) {
    if (!hasText(node.headline) && !hasText(node.name)) errors.push(`${source}: ScholarlyArticle missing headline or name`);
    addRequired(errors, node, "author", source);
    addRequired(errors, node, "datePublished", source);
  }

  if (hasType(node, "Event")) {
    errors.push(...validateEventNode(node, source));
  }

  if (hasType(node, "Grant")) {
    addRequired(errors, node, "name", source);
    addRequired(errors, node, "funder", source);
  }

  if (hasType(node, "ResearchProject")) {
    addRequired(errors, node, "name", source);
    addRequired(errors, node, "description", source);
  }

  if (["WebPage", "AboutPage", "CollectionPage", "CreativeWork"].some((type) => hasType(node, type))) {
    addRequired(errors, node, "name", source);
  }

  return errors;
}

export function validateJsonEndpoint(name, data, options = {}) {
  const errors = [];
  const sitemapLocations = options.sitemapLocations || new Set();

  if (!isObject(data)) return [`${name}: endpoint did not parse to an object`];
  if (!hasText(data.id) && !hasText(data["@id"])) errors.push(`${name}: missing id`);

  const id = data.id || data["@id"];
  if (hasText(id) && !isCanonicalSiteUrl(id)) errors.push(`${name}: id is not a canonical site URL`);

  if (name === "research.json") {
    if (data.type !== "researcher_profile") errors.push(`${name}: expected type researcher_profile`);
    if (!isObject(data.identity)) errors.push(`${name}: missing identity object`);
    if (!hasText(data.identity?.name)) errors.push(`${name}: identity missing name`);
    if (!Array.isArray(data.identity?.same_as) || data.identity.same_as.length === 0) {
      errors.push(`${name}: identity.same_as should list scholarly profiles`);
    }
    if (!hasText(data.research_identity?.research_program)) {
      errors.push(`${name}: missing research_identity.research_program`);
    }
    if (!Array.isArray(data.research_identity?.research_layers) || data.research_identity.research_layers.length === 0) {
      errors.push(`${name}: missing research layers`);
    }
  }

  if (name === "projects.json") {
    if (data.type !== "project_collection") errors.push(`${name}: expected type project_collection`);
    if (!Array.isArray(data.projects) || data.projects.length === 0) errors.push(`${name}: projects must be non-empty`);
    for (const [index, project] of toArray(data.projects).entries()) {
      for (const property of ["id", "name", "status", "description"]) {
        addRequired(errors, project, property, `${name}: projects[${index}]`);
      }
    }
  }

  if (name === "grants.json") {
    if (data.type !== "grant_collection") errors.push(`${name}: expected type grant_collection`);
    if (!Array.isArray(data.grants) || data.grants.length === 0) errors.push(`${name}: grants must be non-empty`);
    for (const [index, grant] of toArray(data.grants).entries()) {
      for (const property of ["id", "name", "identifier", "role", "funder", "year", "url"]) {
        addRequired(errors, grant, property, `${name}: grants[${index}]`);
      }
      if (grant?.url && !isAbsoluteUrl(grant.url)) errors.push(`${name}: grants[${index}].url must be absolute`);
    }
  }

  if (name === "publications.json") {
    if (data.type !== "publication_collection") errors.push(`${name}: expected type publication_collection`);
    if (data.is_complete_publication_list !== true) errors.push(`${name}: is_complete_publication_list should be true`);
    if (!Array.isArray(data.publications) || data.publications.length === 0) {
      errors.push(`${name}: publications must be non-empty`);
    }
    for (const [index, publication] of toArray(data.publications).entries()) {
      for (const property of ["id", "type", "bibtex_key", "title", "authors", "year"]) {
        addRequired(errors, publication, property, `${name}: publications[${index}]`);
      }
      if (!Array.isArray(publication?.authors) || publication.authors.length === 0) {
        errors.push(`${name}: publications[${index}].authors must be non-empty`);
      }
      if (hasText(publication?.bibtex_key) && publication.id !== `${SITE_URL}/publications/${publication.bibtex_key}/`) {
        errors.push(`${name}: publications[${index}].id must resolve to the generated pretty publication URL`);
      }
      if (sitemapLocations.size > 0 && hasText(publication?.id) && !sitemapLocations.has(publication.id)) {
        errors.push(`${name}: publications[${index}].id is not present in sitemap.xml`);
      }
      if (publication?.doi_url && !String(publication.doi_url).startsWith("https://doi.org/")) {
        errors.push(`${name}: publications[${index}].doi_url should use https://doi.org/`);
      }
    }
  }

  return errors;
}

function extractJsonLdScripts(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => match[1].trim(),
  );
}

function findIds(html) {
  return new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
}

function extractAttributes(tag) {
  const body = tag.replace(/^<\s*\/?\s*[^\s>]+/i, "").replace(/\/?\s*>$/i, "");
  const attributes = [];
  const regex = /([^\s"'=<>`]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  for (const match of body.matchAll(regex)) attributes.push(match[1].toLowerCase());
  return attributes;
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i"));
  return match ? match[1] || match[2] || match[3] || "" : "";
}

function validateDuplicateAttributes(filePath, html) {
  const errors = [];
  for (const tagMatch of html.matchAll(/<\s*[a-z][^>]*>/gi)) {
    const tag = tagMatch[0];
    const attributes = extractAttributes(tag);
    const seen = new Set();
    for (const attribute of attributes) {
      if (seen.has(attribute)) {
        errors.push(`${filePath}: duplicate ${attribute} attribute in ${tag.slice(0, 120)}`);
      }
      seen.add(attribute);
    }
  }
  return errors;
}

function validateMicrodata(filePath, html) {
  const errors = [];
  for (const tagMatch of html.matchAll(/<\s*[a-z][^>]*>/gi)) {
    const tag = tagMatch[0];
    if (/\bitemscope\b/i.test(tag)) {
      const itemtype = getAttribute(tag, "itemtype");
      if (!itemtype) {
        errors.push(`${filePath}: itemscope element missing itemtype`);
      } else if (!itemtype.startsWith("https://schema.org/")) {
        errors.push(`${filePath}: itemtype should use https://schema.org/: ${itemtype}`);
      }
    }
    if (/\bitemprop\s*=/i.test(tag) && !hasText(getAttribute(tag, "itemprop"))) {
      errors.push(`${filePath}: itemprop attribute is empty`);
    }
    const itemid = getAttribute(tag, "itemid");
    if (itemid && !itemid.startsWith("#") && !isAbsoluteUrl(itemid)) {
      errors.push(`${filePath}: itemid should be a fragment or absolute URL: ${itemid}`);
    }
  }
  return errors;
}

function normalizeInternalPath(href) {
  if (!href || href.startsWith("#") || href.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null;
  if (!href.startsWith("/")) return null;
  const url = new URL(href, SITE_URL);
  return {
    pathname: url.pathname,
    hash: url.hash ? url.hash.slice(1) : "",
    href,
  };
}

export function validatePageHtml(filePath, html, sitePaths = new Set(), options = {}) {
  const errors = [];
  const siteDir = options.siteDir || "_site";
  if (!/<html\b[^>]*\blang=["']en["']/i.test(html)) errors.push(`${filePath}: <html> should set lang="en"`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${filePath}: missing non-empty <title>`);

  const mainMatch = html.match(/<main\b[^>]*\bid=["']content["'][^>]*>([\s\S]*?)<\/main>/i);
  const mainHtml = mainMatch ? mainMatch[1] : "";
  if (!mainMatch) errors.push(`${filePath}: missing <main id="content">`);
  const h1Count = [...mainHtml.matchAll(/<h1\b/gi)].length;
  if (h1Count !== 1) errors.push(`${filePath}: expected exactly one h1, found ${h1Count}`);

  errors.push(...validateDuplicateAttributes(filePath, html));
  errors.push(...validateMicrodata(filePath, html));

  const ids = findIds(html);
  for (const linkMatch of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const tag = linkMatch[0];
    const href = linkMatch[1].trim();
    const target = getAttribute(tag, "target");
    const rel = getAttribute(tag, "rel").split(/\s+/).filter(Boolean);

    if (target === "_blank" && (!rel.includes("noopener") || !rel.includes("noreferrer"))) {
      errors.push(`${filePath}: target="_blank" link missing rel="noopener noreferrer": ${href}`);
    }

    if (href.startsWith("#") && href.length > 1 && !ids.has(href.slice(1))) {
      errors.push(`${filePath}: fragment link ${href} has no matching id`);
    }

    const internal = normalizeInternalPath(href);
    if (internal && sitePaths.size > 0) {
      if (!sitePaths.has(internal.pathname)) {
        errors.push(`${filePath}: internal link target not generated: ${href}`);
      } else if (internal.hash) {
        const linkedHtmlPath = path.join(siteDir, internal.pathname, "index.html");
        if (fs.existsSync(linkedHtmlPath)) {
          const linkedHtml = fs.readFileSync(linkedHtmlPath, "utf8");
          if (!findIds(linkedHtml).has(internal.hash)) {
            errors.push(`${filePath}: linked fragment ${href} has no matching id in target page`);
          }
        }
      }
    }
  }

  for (const linkMatch of html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*>/gi)) {
    const href = getAttribute(linkMatch[0], "href");
    const internal = normalizeInternalPath(href);
    if (internal && sitePaths.size > 0 && !sitePaths.has(internal.pathname)) {
      errors.push(`${filePath}: alternate structured-data link target not generated: ${href}`);
    }
  }

  const jsonLdScripts = extractJsonLdScripts(html);
  if (jsonLdScripts.length === 0) errors.push(`${filePath}: missing embedded application/ld+json structured data`);
  for (const [index, script] of jsonLdScripts.entries()) {
    try {
      const parsed = JSON.parse(script);
      const nodes = flattenJsonLd(parsed);
      if (nodes.length === 0) errors.push(`${filePath}: JSON-LD script ${index + 1} contains no nodes`);
      for (const node of nodes) errors.push(...validateJsonLdNode(node, `${filePath}: JSON-LD script ${index + 1}`));
    } catch (error) {
      errors.push(`${filePath}: JSON-LD script ${index + 1} is invalid JSON: ${error.message}`);
    }
  }

  return errors;
}

function pathToSitePath(siteDir, filePath) {
  const relative = path.relative(siteDir, filePath).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

function walkFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function runSiteEvals(siteDir = "_site") {
  const errors = [];
  if (!fs.existsSync(siteDir)) return [`${siteDir}: generated site directory does not exist; run jekyll build first`];

  const files = walkFiles(siteDir);
  const sitePaths = new Set(files.map((filePath) => pathToSitePath(siteDir, filePath)));
  const expectedSitemapUrls = [...CORE_HTML_PATHS, ...STRUCTURED_ENDPOINTS].map((sitePath) => `${SITE_URL}${sitePath}`);

  const sitemapPath = path.join(siteDir, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    errors.push("sitemap.xml: generated sitemap is missing");
  }

  let sitemapLocations = new Set();
  if (fs.existsSync(sitemapPath)) {
    const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
    errors.push(...validateSitemap(sitemapXml, expectedSitemapUrls));
    sitemapLocations = new Set(parseSitemapLocations(sitemapXml));
    for (const location of sitemapLocations) {
      try {
        const { pathname } = new URL(location);
        if (!sitePaths.has(pathname)) errors.push(`sitemap.xml: URL does not map to a generated artifact: ${location}`);
      } catch {
        // validateSitemap already reports invalid URLs.
      }
    }
  }

  for (const endpoint of STRUCTURED_ENDPOINTS) {
    const filePath = path.join(siteDir, endpoint);
    if (!fs.existsSync(filePath)) {
      errors.push(`${endpoint}: structured endpoint is missing`);
      continue;
    }
    try {
      const data = readJsonFile(filePath);
      if (endpoint.endsWith(".json")) {
        errors.push(...validateJsonEndpoint(path.basename(endpoint), data, { sitemapLocations }));
      } else {
        errors.push(...validateKnowledgeGraph(data, endpoint));
      }
    } catch (error) {
      errors.push(`${endpoint}: invalid JSON: ${error.message}`);
    }
  }

  for (const filePath of files.filter((file) => file.endsWith(".html"))) {
    const sitePath = pathToSitePath(siteDir, filePath);
    const html = fs.readFileSync(filePath, "utf8");
    errors.push(...validatePageHtml(sitePath, html, sitePaths, { siteDir }));
    for (const phrase of BANNED_COPY) {
      if (html.includes(phrase)) errors.push(`${sitePath}: banned regression copy found: ${phrase}`);
    }
  }

  return errors;
}

export function validateKnowledgeGraph(data, source = "knowledge-graph.jsonld") {
  const errors = [];
  if (!isObject(data)) return [`${source}: JSON-LD endpoint did not parse to an object`];
  if (data["@context"] !== "https://schema.org") errors.push(`${source}: @context should be https://schema.org`);
  if (!Array.isArray(data["@graph"]) || data["@graph"].length === 0) {
    errors.push(`${source}: @graph must be a non-empty array`);
    return errors;
  }

  const ids = new Set();
  const types = new Set();
  for (const [index, node] of data["@graph"].entries()) {
    const nodeSource = `${source}: @graph[${index}]`;
    for (const type of getTypes(node)) types.add(type);
    if (hasText(node["@id"])) {
      if (ids.has(node["@id"])) errors.push(`${nodeSource}: duplicate @id ${node["@id"]}`);
      ids.add(node["@id"]);
    }
    errors.push(...validateJsonLdNode(node, nodeSource));
  }

  for (const requiredType of ["Person", "ProfilePage", "AboutPage", "ResearchProject", "Grant", "ScholarlyArticle"]) {
    if (!types.has(requiredType)) errors.push(`${source}: missing ${requiredType} node`);
  }

  return errors;
}

const invokedUrl = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";

if (import.meta.url === invokedUrl) {
  const siteDir = process.argv[2] || "_site";
  const errors = runSiteEvals(siteDir);
  if (errors.length > 0) {
    console.error(`Site evals failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Site evals passed for ${siteDir}`);
}
