---
layout: default
title: 'Two New IMLS Grants: When AI Changes What We Find and What Counts as Evidence'
date: 2026-08-17 12:00 -0400
categories: AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS
tags: [AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS]
---
On August 16, the Institute of Museum and Library Services awarded Virginia Tech University Libraries two 2026 National Leadership Grants totaling $652,397.
I am delighted to be a co-Principal Investigator on both projects.
One grant concerns metadata for digital collections, and the other concerns relevance screening for evidence synthesis, but both ask what happens after an AI-generated description or judgment enters real library work.

## A name that appears in three collections

Suppose you search a digital collection for a person whose letters, photographs, and oral history recordings are scattered across several collections.
The name appears in the materials, but not consistently in the catalog records, so the search results never bring the pieces together.
A language model could recover the name from the documents and images, recognize that the records refer to the same person, and create a new path through the collection.

Now suppose the model gets the identity wrong.
Perhaps it writes the person's name differently in each collection, or perhaps it merges two people who happen to share a name.
Would the new relationship appear in the interface as an established fact?
Could a librarian follow it back to the photograph, document, model, and prompt that produced it?

Our $473,403 project, ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), will study how machine-generated metadata behaves across digital collections.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
We will compare generated metadata across collections, identify fields and relationships that remain consistent enough to support discovery, and examine how much human review different kinds of metadata require.
Those findings will guide the development of a prototype for navigating across collections.

A single generated description may be correct when inspected on its own while the same process creates hundreds of inconsistent names elsewhere in the collection.
Collection-scale evaluation lets us see those patterns, while provenance records let a librarian return to the source of a particular inference.
Years later, after the original model or service has changed, that history would still show what was generated, what evidence supported it, and what a person subsequently corrected.

## The paper no one reads

A systematic review often begins with thousands of titles and abstracts retrieved from several databases.
Reviewers compare each record with the review's eligibility criteria, and only the studies that survive screening move forward for full-text review and analysis.
If an AI model confidently excludes a relevant paper at this stage, the researchers may never discover what was lost.

What would another researcher need in order to challenge that exclusion?
The final include-or-exclude label would not reveal which model version was used, how the criteria were expressed in the prompt, or whether the same record received a different answer on another run.
Without those details, rerunning the review may produce a different evidence base without explaining why.

[PRISMA 2020](https://doi.org/10.1136/bmj.n71) asks systematic reviewers to report how studies moved through the selection process, including any automation tools used along the way.
The Royal Society and the Academy of Medical Sciences also include transparent study selection among their [principles of good evidence synthesis](https://royalsociety.org/-/media/policy/projects/evidence-synthesis/principles-for-good-evidence-synthesis-for-policy.pdf).
An AI screening decision therefore belongs in the account of how the research was conducted, alongside the search strategy and eligibility criteria.

The international [Responsible use of AI in evidence SynthEsis initiative](https://doi.org/10.17605/OSF.IO/FWAUD), known as RAISE, gives developers and evidence synthesists more specific guidance.
Its [guidance for developers](https://osf.io/fwaud/files/d6phz) calls for representative evaluation data, careful measurement of recall, documented prompts and settings, repeated tests of variable outputs, and public reporting of limitations.
The companion [guidance for users and institutions](https://osf.io/fwaud/files/y5aqg) asks whether a tool fits a particular review, whether its validation can be reproduced, and whether its performance may change.
Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence endorsed the RAISE framework in a 2025 [joint position statement](https://doi.org/10.1186/s13750-025-00374-5) that retains human responsibility for AI-assisted judgments and calls for transparent reporting.

Our $178,994 project, ["Auditable AI Workflows for Evidence Synthesis Library Services"](https://www.imls.gov/grants/awarded/lg-259841-ols-26), will develop and evaluate an AI-assisted workflow for title-and-abstract screening.
Bipasha Banerjee is the Principal Investigator, and C. Cozette Comer and I are co-Principal Investigators.
We will work with evidence-synthesis library professionals to study model behavior, develop a prototype and instruction manual, and test the workflow in the context of the services librarians provide to research teams.

The experiments will measure how often relevant studies survive screening and how much the recommendations change across models, prompts, and repeated runs.
The prototype will retain the model input, instructions, version, settings, output, and subsequent human decision for each record.
Professionals from services such as [Evidence Synthesis Services at Virginia Tech](https://guides.lib.vt.edu/SRMA/home) will then use the prototype and show us where the audit trail helps, where it interrupts the review, and where human judgment arrives too late.

A benchmark can reveal poor recall or unstable decisions, but it cannot show whether a librarian can explain the workflow to a research team or incorporate it into a review.
A focus group can expose those practical problems, but it cannot tell us whether the model repeatedly excludes relevant studies.
Would either result, by itself, justify recommending that another library adopt the workflow?

## A wider push for verifiable AI

The White House report [*Science: A New Golden Age*](https://www.whitehouse.gov/wp-content/uploads/2026/07/Science-A-New-Golden-Age.pdf) warns that AI can increase the production of plausible scientific claims faster than the research system can verify them.
The report calls for documented methods, interoperable systems, open interfaces, and machine-auditable replication packages so that verification capacity grows alongside generation capacity.

[America's AI Action Plan](https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf) calls for mission-specific measures, realistic testbeds, stronger evaluation science, and collaboration between technical researchers and practitioners who understand the work being automated.
It also supports open-weight models for rigorous academic experiments in which researchers need direct access to the model and control over its deployment to explain a result.

Our proposals predate *Science: A New Golden Age*, so the report did not shape their design.
Can generated descriptions and relationships be traced back to their sources, and can model judgments be inspected before they alter the evidence available to a review?

## What I will be working on

I will be working mostly on research design, evaluation, auditability, reproducibility, and ways other library systems might reuse what we learn.
The evidence-synthesis project also extends my research on [how disagreement among language models changes relevance judgments and retrieval outcomes](https://arxiv.org/abs/2507.02139), since disagreement may reveal where a single relevance label conceals uncertainty that a reviewer ought to see.

When AI changes a description or removes a study, will the people who rely on the result be able to see what changed, why it changed, and whether it should stand?

The IMLS award records provide additional information about [the machine-generated metadata project](https://www.imls.gov/grants/awarded/lg-259840-ols-26) and [the evidence-synthesis project](https://www.imls.gov/grants/awarded/lg-259841-ols-26).
