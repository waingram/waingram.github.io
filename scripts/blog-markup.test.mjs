import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

const blogInclude = fs.readFileSync(new URL("../_includes/blog.html", import.meta.url), "utf8");
const postInclude = fs.readFileSync(new URL("../_includes/post.html", import.meta.url), "utf8");
const layout = fs.readFileSync(new URL("../_layouts/default.html", import.meta.url), "utf8");

describe("blog source markup", () => {
  it("renders the blog index as a scholarly article list with metadata", () => {
    assert.match(blogInclude, /class="blog-hero"/);
    assert.match(blogInclude, /itemtype="https:\/\/schema\.org\/BlogPosting"/);
    assert.match(blogInclude, /itemprop="datePublished"/);
    assert.match(blogInclude, /post_reading_minutes/);
    assert.match(blogInclude, /min read/);
    assert.match(blogInclude, /class="post-tags"/);
    assert.match(blogInclude, /aria-label="Post topics"/);
    assert.match(blogInclude, /rel="alternate"/);
  });

  it("renders individual post headers with machine-readable date, tags, and reading time", () => {
    assert.match(postInclude, /class="post-header"/);
    assert.match(postInclude, /itemprop="datePublished"/);
    assert.match(postInclude, /post_reading_minutes/);
    assert.match(postInclude, /min read/);
    assert.match(postInclude, /itemprop="keywords"/);
    assert.match(postInclude, /aria-label="Post topics"/);
  });

  it("advertises the RSS feed from the blog page head", () => {
    assert.match(layout, /page\.url == "\/blog\/"/);
    assert.match(layout, /type="application\/rss\+xml"/);
    assert.match(layout, /href="{{ '\/feed\.xml' \| relative_url }}"/);
  });
});
