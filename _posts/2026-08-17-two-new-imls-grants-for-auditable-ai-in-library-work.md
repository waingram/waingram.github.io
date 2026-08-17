---
layout: default
title: 'What Happens When Library Work Depends on AI? Two New IMLS Grants'
date: 2026-08-17 12:00 -0400
categories: AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS
tags: [AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS]
---
Virginia Tech University Libraries has received two 2026 National Leadership Grants from the Institute of Museum and Library Services, and I am a co-Principal Investigator on both projects.
The awards total $652,397.

On paper, one project is about metadata and the other is about evidence synthesis.
In practice, they meet at the same problem.
AI systems can produce descriptions and judgments quickly, but library users live with the consequences when those outputs are incomplete, inconsistent, or wrong.
Before we build them into library services, we need to know what makes those outputs dependable and how a person can inspect them.

## When generated metadata becomes part of the collection

Much of what a user can find in a digital collection depends on the metadata someone had time to create.
A title, date, subject heading, or place name gives a user a path into a photograph, newspaper page, map, or manuscript.
A collection with hundreds of thousands of objects forces a library to choose which objects and fields receive detailed description.
A useful name may be buried in an image, and a relationship between two collections may remain invisible because no one had time to describe it.

Language models offer a way to create additional metadata across thousands of digital objects.
The appeal is that a model can identify people and places, suggest subject terms, describe images, and propose relationships that make more of the collection available to search.

The risk also changes with scale.
If a model writes the same person's name differently across several collections, a search system may split one person into several identities.
If the model merges two people who share a name, the system can present a relationship that does not exist.
Once generated metadata drives a knowledge graph or a navigation interface, these are no longer isolated cataloging errors.
They shape what a patron can find and how the collection appears to fit together.

That problem is at the center of ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), which received $473,403.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
The project will evaluate machine-generated metadata across digital collections and determine which types of metadata remain consistent enough to support discovery.
It will also examine whether relationships derived from that metadata can be traced back to the collection materials that support them.
The goal is not simply to generate more fields.
We want to know when those fields can become part of the structure people rely on to explore a digital library.

## When screening decides what counts as evidence

Evidence synthesis has a different bottleneck.
Before a systematic review can compare findings, reviewers must decide which studies meet the review's inclusion criteria.
A database search may return thousands of titles and abstracts, and each record must be screened before the reviewers can begin analyzing the evidence.
The work is repetitive, but the judgment is consequential.

This makes relevance screening an attractive place to use AI.
A model can read an abstract and recommend whether to include or exclude the study.
However, if the model excludes a relevant paper, that paper does not merely fall lower in a list of search results.
It disappears from the body of evidence that the review will analyze.
The final synthesis may then rest on an incomplete account of the research.

The second project, ["Auditable AI Workflows for Evidence Synthesis Library Services"](https://www.imls.gov/grants/awarded/lg-259841-ols-26), received $178,994.
Bipasha Banerjee is the Principal Investigator, and C. Cozette Comer and I are co-Principal Investigators.
We will develop and evaluate an AI-assisted workflow for title-and-abstract screening with evidence-synthesis library professionals.
A reviewer should be able to see what the model received, how it was instructed, and how it produced an inclusion or exclusion decision.
The workflow should also reveal when a decision changes across models or repeated runs so that unstable cases can receive human attention.

The point is not to treat the model as another reviewer whose answer is accepted without question.
The point is to learn where AI can reduce screening work without hiding uncertainty or lowering the standards that make an evidence synthesis credible.

## The work begins after the demo

What interests me about both projects is that they begin where most AI demonstrations end.
A demonstration can end once the model produces a plausible output.
A library service cannot.
We already know that a language model can generate a description or assign a relevance label.
The harder question is whether that output deserves authority inside a service that people use to discover cultural materials or assemble scientific evidence.

An unreliable output can change which objects a patron finds or which studies enter an evidence synthesis.
Accuracy matters in both cases, but so do provenance, consistency, disagreement, and the ability to review a decision.

My role in both projects centers on research design and on methods for evaluating these kinds of failure.
I will also work on auditability, reproducibility, and the reuse of the resulting methods in other library systems.
This work extends my broader research on machine-usable scientific knowledge into a practical question.
What must we know about an AI-generated description or judgment before we allow it to shape what someone else can know?

The IMLS award records provide additional information about [the machine-generated metadata project](https://www.imls.gov/grants/awarded/lg-259840-ols-26) and [the evidence-synthesis project](https://www.imls.gov/grants/awarded/lg-259841-ols-26).
