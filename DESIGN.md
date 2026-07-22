---
name: William A. Ingram — Academic Portfolio
description: "The Reading Room: a quiet scholarly interface in cool paper, iron-gall ink, and bookbinder copper."
colors:
  printers-blue: "#165c7d"
  printers-blue-deep: "#0e3f59"
  bookbinder-copper: "#9b5c22"
  amber-bookmark: "#c17a2d"
  marginalia-berry: "#8a2558"
  iron-gall-ink: "#192633"
  lede-ink: "#263847"
  faded-ink: "#4f6070"
  pencil: "#6f7d89"
  cool-paper: "#f7f9fb"
  page-white: "#ffffff"
  paper-wash: "#eef4f7"
  paper-wash-deep: "#e2edf2"
  ruled-line: "#d7e0e7"
  masthead-ink: "#16202a"
  selection-wash: "#c7deee"
typography:
  display:
    fontFamily: "Avenir Next, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "2.35rem"
    fontWeight: 680
    lineHeight: 1.15
    letterSpacing: "0"
  headline:
    fontSize: "1.75rem"
    fontWeight: 680
    lineHeight: 1.15
  title:
    fontSize: "1.35rem"
    fontWeight: 680
    lineHeight: 1.15
  lede:
    fontSize: "1.14rem"
    fontWeight: 500
    lineHeight: 1.65
  body:
    fontFamily: "Avenir Next, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontSize: "0.98rem"
    fontWeight: 760
    letterSpacing: "0"
rounded:
  sm: "0.25rem"
  md: "0.3rem"
  pill: "999px"
spacing:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.printers-blue}"
    textColor: "{colors.page-white}"
    rounded: "{rounded.md}"
    padding: "0.62rem 0.95rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.printers-blue-deep}"
    textColor: "{colors.page-white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.printers-blue}"
    rounded: "{rounded.md}"
    padding: "0.62rem 0.95rem"
    height: "2.75rem"
  button-outline-hover:
    backgroundColor: "{colors.printers-blue}"
    textColor: "{colors.page-white}"
  masthead:
    backgroundColor: "{colors.masthead-ink}"
    height: "4.2rem"
  nav-card:
    backgroundColor: "{colors.paper-wash}"
    textColor: "{colors.printers-blue-deep}"
    rounded: "{rounded.md}"
    padding: "0.85rem 0.95rem"
  nav-card-hover:
    backgroundColor: "{colors.paper-wash-deep}"
  tag-chip:
    backgroundColor: "{colors.paper-wash}"
    textColor: "{colors.printers-blue-deep}"
    rounded: "{rounded.sm}"
    padding: "0.18rem 0.42rem"
  page-hero:
    backgroundColor: "{colors.page-white}"
    padding: "1.5rem 1.35rem"
---

# Design System: William A. Ingram — Academic Portfolio

## Overview

**Creative North Star: "The Reading Room"**

The site is a quiet library reading room: cool paper light, dark iron-gall ink, and one warm note of bookbinder copper, like brass lamp fittings against blue-grey walls. Nothing performs. The room's credibility comes from how well it is kept — hairline rules where structure is needed, tabular numerals where figures align, generous margins where reading happens. It is the natural habitat of both halves of the record this site carries: the scholar's publications and the library leader's institutional trust.

The working mood is **quiet rigor**: composed, exacting, unhurried, quietly warm. Restraint is the credibility — nothing decorative that isn't also informative. Hierarchy, spacing, and notation do the persuading; color arrives in small, deliberate doses. The one theatrical gesture the system allows itself is the scholarly notation itself: bracketed citation numerals, ruled section openings, a 4px blue bar over every hero — the marks of a well-kept record used as interface.

The system explicitly rejects its two failure modes (confirmed anti-references): generic Bootstrap blandness — Bootstrap is the chassis here, never the visible skin — and flashy startup-AI styling, whose gradients and glow would spend the trust this site exists to earn.

**Key Characteristics:**

- Cool paper surfaces with iron-gall ink text, every color a first-class light/dark pair
- Structure drawn with hairline rules and tonal surface steps — lines, not boxes or shadows
- Native humanist sans (Avenir Next stack) at precise demibold weights; tabular numerals for every figure
- One warm note: bookbinder copper kickers in a cool blue system; amber reserved for focus rings
- Citation brackets as interface — the scholarly record's own notation, load-bearing
- Sturdy, legible controls: 44px targets, firm fills, small radii

## Colors

A cool, papery blue system warmed by copper in small doses; every token is defined in `css/main.css` as a `--wai-*` custom property with a paired dark-theme value, switched by `prefers-color-scheme` plus a persisted `data-theme` override.

### Primary

- **Printer's Blue** (#165c7d): the working accent — text links, primary button fills, the 4px hero top bar, title-link underlines. Deep enough to hold white button text at AA contrast. Dark theme: a pale sky #76c7ef.
- **Deep Printer's Blue** (#0e3f59): the pressed state of the system — link and button hover, and the resting color of H3 subheadings and nav-card titles. In dark theme the relationship inverts to a lighter #a7dcf6, since "deeper" on dark means brighter.

### Secondary

- **Bookbinder Copper** (#9b5c22): the room's single warm material. Page kickers and nav-card eyebrow labels only — small type, never fills or large surfaces. Dark theme: #d6a05d.
- **Amber Bookmark** (#c17a2d): focus color exclusively — the 3px outline (3px offset) on every focusable element, like the ribbon marking your place. Dark theme: #f1b86d.

### Tertiary

- **Marginalia Berry** (#8a2558): inline `code` and the Bootstrap code bridge — a muted berry that marks technical annotation without shouting. Dark theme: #f0a7cd.

### Neutral

- **Iron Gall Ink** (#192633): primary text and headings — the manuscript ink of the system. Dark theme: #edf4f8.
- **Lede Ink** (#263847): standfirst/lede paragraphs and blog summaries — a half-step quieter than full ink. Dark: #d6e2ea.
- **Faded Ink** (#4f6070): secondary text — captions, meta rows, muted links, quiet outline buttons. Dark: #b8c8d5.
- **Pencil** (#6f7d89): the librarian's annotation grey — citation-bracket markers, dates, evidence labels, separators. Dark: #8ea4b5.
- **Cool Paper** (#f7f9fb): the page background. Dark: #0d151d.
- **Page White** (#ffffff): raised surfaces — heroes, post headers, the theme menu, the mobile profile strip. Dark: #131f2a.
- **Paper Wash** (#eef4f7): the tinted third surface — chips, nav cards, table headers, hover fills. Dark: #1a2a37.
- **Deep Paper Wash** (#e2edf2): hover state of washed surfaces (nav cards, publication chips). Dark: #203242.
- **Ruled Line** (#d7e0e7): every hairline — section rules, list separators, card borders, table grid. Dark: #2b4152.
- **Masthead Ink** (#16202a): the navbar band, identical in both themes, with white-alpha overlays for its contents.
- **Selection Wash** (#c7deee): text-selection highlight with near-black selection ink. Dark: #294b63.

### Named Rules

**The Masthead Rule.** The masthead stays Masthead Ink (#16202a) in light and dark themes alike — a constant institutional band across the top of every page. Only its contents (white-alpha text, borders, and pills) are tuned; the band itself never lightens, tints, or themes.

## Typography

**Display Font:** Avenir Next (with Segoe UI, Roboto, Helvetica, Arial fallbacks)
**Body Font:** the same native humanist stack — one family for everything
**Label/Mono Font:** none distinct; inline code inherits the mono default and is colored Marginalia Berry

**Character:** A native humanist sans keeps the room quiet and fast — no webfont flash, no borrowed personality; the scholarship supplies the character. Weights are tuned per role with unusual precision (650, 680, 760), snapping to the nearest installed face per platform — demibold-anchored emphasis rather than heavy black bolds. There is no uppercase styling anywhere: kickers and labels persuade at sentence case.

### Hierarchy

- **Display** (680, 2.35rem → 1.82rem mobile, 1.15): page titles; `text-wrap: balance`. Post titles cap at 24ch.
- **Headline** (680, 1.75rem → 1.45rem mobile, 1.15): section openers, each ruled with a 1px Ruled Line top border and 1.35rem of padding above — sections begin with a drawn line, not floating type.
- **Title** (680, 1.35rem → 1.18rem mobile, 1.15): subsections, set in Deep Printer's Blue; `scroll-margin-top: 5rem` for anchor comfort.
- **Lede** (500, 1.14rem, 1.65): standfirst paragraphs in Lede Ink, max 68ch.
- **Body** (400, 1rem, 1.65 → 1.58 mobile): max 72ch with `text-wrap: pretty`; list items breathe at 0.45rem apart.
- **Label** (760, 0.98rem, letter-spacing 0): the copper page kicker. Smaller cousins: evidence labels and nav-card eyebrows (680, 0.86–0.88rem).

Links are underlined in the accent with tuned metrics — 0.08em thickness, 0.16em offset — and darken on hover. Dates, counters, and citation markers always set `font-variant-numeric: tabular-nums`. A `.drop-cap` helper (335% floated first letter) exists for editorial openings.

## Layout

Bootstrap 5 is the chassis: `container-xxl`, a two-column grid pairing the **profile sidebar** (portrait, name, meta, icon links) with a **content column** whose inner measure is 78ch. Prose narrows further — 72ch body, 68ch ledes and publication listings. Density is comfortable-scholarly: reading distances, not dashboard compression.

One breakpoint carries the whole responsive story, Bootstrap's `md` (768px). Below it: the navbar collapses behind a toggler with a white-alpha divider; the sidebar becomes a full-width Page White strip with a centered 4.25rem portrait (13.25rem on desktop), two-column icon-link grid, and hidden postal address; heroes bleed slightly (-0.15rem) and their action buttons stack full-width; the evidence strip drops from three hairline-divided columns to a stacked, hairline-separated list; nav-card rows go single-column.

Vertical rhythm comes from the ruled sections: H2 blocks open with 2.5rem of top margin (2rem mobile) and a hairline rule; recurring steps are 0.75rem gaps, 1rem card padding, 1.5rem hero padding. These are observed rhythm values, not enforced tokens — match them rather than inventing new steps.

## Elevation & Depth

The system is flat by doctrine. Depth is conveyed by hairline rules and three tonal surface steps — Cool Paper page, Page White panels, Paper Wash tints — never by floating layers. State changes are instant color swaps; there are no transitions and no motion vocabulary, and hovers answer with a fill or border shift, not a lift.

### Shadow Vocabulary

- **Portrait shadow** (`box-shadow: 0 6px 14px rgba(25, 38, 51, 0.12)`; dark theme rgba(0, 0, 0, 0.28)): under the framed profile portrait only.

### Named Rules

**The Portrait Exception.** Surfaces never cast shadows. The one shadow in the system sits under the profile portrait — a square-cornered photograph in a 3px white frame, hung like a print on the wall. It marks the person, and nothing else, as the object with physical presence.

## Shapes

Small, workmanlike radii: 0.3rem on buttons, cards, and menus; 0.25rem on chips and nav links; 999px only on the theme menu's radio dots. Two deliberate sharp exceptions carry identity: the WAI monogram in the masthead is a perfectly square 2.15rem box with a 1px white-alpha border, and the portrait is a square-cornered framed photograph. Form language elsewhere is line-drawn — 1px Ruled Line hairlines for separation, a 4px Printer's Blue top bar opening every hero and post header, and bracket glyphs `[ ]` as the system's recurring ornament, set around citation numerals and footnote marks.

## Components

Component character: **sturdy and legible** — generous 44px touch targets, demibold labels, firm fills, small radii. Dependable furniture for reading and finding, not showpieces.

### Buttons

- **Shape:** gently rounded (0.3rem), min-height 2.75rem, weight 680, padding 0.62rem 0.95rem.
- **Primary:** Printer's Blue fill, Page White text; hover/focus deepen to Deep Printer's Blue. Used for hero actions; stacks full-width on mobile.
- **Outline-primary:** Printer's Blue border and text on transparent; hover fills solid.
- **Outline-secondary:** the quiet utility variant — Faded Ink border and text; hover washes Paper Wash under Iron Gall ink; active fills Faded Ink.
- **Focus:** every button (and link, and summary) gets the 3px Amber Bookmark outline at 3px offset.

### Chips

- **Post tags:** Paper Wash fill, 1px Ruled Line border, 0.25rem radius, Deep Printer's Blue text at 650/0.86rem, padding 0.18rem 0.42rem.
- **Publication nav chips:** same recipe at link scale (680, 0.45rem 0.65rem padding); hover deepens to Deep Paper Wash with a darker border.

### Cards / Containers

- **Page hero / post header:** Page White panel, 4px Printer's Blue top bar, hairline bottom rule, 1.5rem padding; carries copper kicker → display title → lede.
- **Nav cards** (research overview): Paper Wash, hairline border, 0.3rem radius, copper eyebrow over a demibold Deep Printer's Blue title; hover moves one wash step deeper. No shadow at rest or on hover.
- **Evidence strip:** a three-column grid ruled top and bottom, columns split by hairlines; Pencil label over demibold value. Facts presented as a table of record, not stat cards.
- **Paper figure / paper table:** figure and table blocks ruled top and bottom like journal floats, with Faded Ink captions; tables scroll horizontally in a focusable region, Paper Wash header row, full hairline grid.
- **Footer colophon:** hairline-ruled footer with the WAI mark, copyright and last-updated lines in Faded Ink, and a proper colophon crediting licenses — the site signs its work.

### Navigation

- **Masthead:** the constant Masthead Ink band (min-height 4.2rem): square WAI monogram + name at 700, links at 650 in 72%-white, brightening to full white on hover; the active page sits in a 10%-white pill. Collapses at md behind a bordered toggler.
- **Theme switcher:** in-masthead toggle (System/Light/Dark) opening a Page White menu of radio items — hairline-bordered dots that fill Printer's Blue when checked; choice persists in localStorage.
- **Sidebar profile links:** icon + label rows (0.92rem, 2.08rem min-height) that wash Paper Wash on hover; on mobile they become a two-column grid of pre-washed cells.

### The Bibliography (signature)

Publication lists are the site's signature furniture. Each entry is a flex row: a right-aligned `[n]` marker in Pencil with tabular numerals in a fixed 2.6rem gutter, then the citation set in the listing stack — demibold title, Iron-Gall-adjacent authors, Faded Ink venue — separated by hairlines. The same notation runs the publication-highlights list, and footnote references wrap themselves in brackets. Per-entry detail pages drop the marker but keep the ruled record styling.

### Named Rules

**The Citation Bracket Rule.** Scholarly numbering is set in brackets with tabular figures — `[1]`, `[2]` — right-aligned in a fixed gutter, in Pencil. Bibliographies, highlight lists, and footnote marks all speak this notation. It is the mark of the scholarly record and is load-bearing identity: never replace it with bullets, cards, or bare numerals.

## Do's and Don'ts

### Do:

- **Do** define every color as a paired light/dark `--wai-*` custom property in `css/main.css`; both themes are first-class, and the System/Light/Dark switcher must keep working.
- **Do** draw structure with hairline rules (1px Ruled Line, #d7e0e7) and tonal surface steps (Cool Paper → Page White → Paper Wash) — lines over boxes.
- **Do** keep `font-variant-numeric: tabular-nums` on dates, counters, and citation markers.
- **Do** keep interactive targets at least 2.75rem tall and give every focusable element the 3px Amber Bookmark outline at 3px offset.
- **Do** hold the reading measures: 78ch content column, 72ch body, 68ch ledes and listings.
- **Do** route Bootstrap through the token bridges (`--bs-border-color`, `--bs-code-color`) so the chassis never shows stock colors.

### Don't:

- **Don't** lighten, tint, or theme the masthead; it stays Masthead Ink (#16202a) in both themes (The Masthead Rule).
- **Don't** remove the bracketed `[n]` tabular counters from bibliographies and highlight lists, or the bracketed footnote marks (The Citation Bracket Rule).
- **Don't** add shadows to surfaces; the portrait's soft shadow is the single exception (The Portrait Exception).
- **Don't** load hosted webfonts for text; type stays on the native Avenir Next / Segoe UI stack.
- **Don't** reach for startup-AI styling — gradient meshes, glassmorphism, glow effects, novelty motion; credibility here is typographic, not atmospheric.
- **Don't** let Bootstrap defaults show through (stock blue links, default focus rings, unthemed borders); generic Bootstrap blandness is a confirmed anti-reference.
