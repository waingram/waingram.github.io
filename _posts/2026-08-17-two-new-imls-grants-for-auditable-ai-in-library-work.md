---
layout: default
title: 'Two New IMLS Grants: When AI Changes What We Find and What Counts as Evidence'
date: 2026-08-17 12:00 -0400
categories: AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS
tags: [AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS]
---
On August 16, the Institute of Museum and Library Services awarded Virginia Tech University Libraries two 2026 National Leadership Grants totaling $652,397.
I am delighted to be a co-Principal Investigator on both projects.
One project studies when machine-generated metadata can support collection-scale discovery, while the other studies whether AI-assisted relevance screening can meet the methodological requirements of evidence synthesis.
In each project, a model output begins to carry institutional authority because a library system or service relies upon it.
What evidence should be required before that happens?

## Generated metadata as infrastructure

Machine-generated metadata changes status when a library uses it to reconcile entities, construct relationships, or create new forms of navigation.
A name extracted from an image may begin as a provisional inference, yet a knowledge graph can later treat that name as the basis for connecting records across several collections.
The extracted name now functions as an organizing fact within the system even though it remains a probabilistic inference.
How should a library represent that difference?

Our $473,403 project, ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), will study how machine-generated metadata behaves across digital collections.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
The project will compare generated metadata across collections to identify fields and relationships that remain consistent enough to support discovery.
It will also examine semantic similarity, error patterns, provenance, and the need for human review before using the results to build and evaluate cross-collection navigation.

Evaluating an isolated record cannot reveal whether the same entity has been named consistently across thousands of objects or whether an error recurs systematically within a collection.
The unit of evaluation must therefore expand from the record to the corpus, where consistency, contradiction, and accumulated error can be measured.
At the same time, each generated assertion needs to retain its own provenance so that a librarian can inspect the source material, model, prompt, and human corrections associated with it.

Treating generated metadata as a first-class structural component creates a longer-term stewardship problem.
Models, prompts, and commercial services will change while the descriptions and relationships produced by them remain embedded in library systems.
A future librarian should be able to distinguish source metadata from model inference, reconsider an earlier decision, and regenerate or remove the derived structure without reconstructing its history from scratch.

## AI-assisted screening as research method

Evidence synthesis depends on a documented chain of decisions that begins with the research question and search strategy and continues through screening, appraisal, and synthesis.
Relevance screening determines which studies can contribute evidence to the final result, so an AI recommendation at this stage becomes part of the research method.
A false exclusion removes a relevant study before the review team examines its evidence and may leave no visible indication that anything is missing.

Language-model recommendations may vary with the model version, prompt, parameter settings, input format, or repeated execution of the same workflow.
What does it mean to reproduce the selection process if the same record can receive a different answer on the next run?
A final include-or-exclude label offers no way to investigate that difference because it omits the conditions under which the judgment was produced.

[PRISMA 2020](https://doi.org/10.1136/bmj.n71) asks systematic reviewers to report how studies moved through the selection process, including any automation tools used along the way.
The Royal Society and the Academy of Medical Sciences also include transparent study selection among their [principles of good evidence synthesis](https://royalsociety.org/-/media/policy/projects/evidence-synthesis/principles-for-good-evidence-synthesis-for-policy.pdf).
An AI screening decision belongs in the account of how the research was conducted because another researcher needs to understand how each study entered or left the evidence base.

The international [Responsible use of AI in evidence SynthEsis initiative](https://doi.org/10.17605/OSF.IO/FWAUD), known as RAISE, divides responsibility for AI-assisted evidence synthesis across developers, users, and institutions.
Its [guidance for developers](https://osf.io/fwaud/files/d6phz) calls for representative evaluation data, careful measurement of recall, documented prompts and settings, repeated tests of variable outputs, and public reporting of limitations.
The companion [guidance for users and institutions](https://osf.io/fwaud/files/y5aqg) asks whether a tool fits a particular review, whether its validation can be reproduced, and whether its performance may change.
Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence endorsed the RAISE framework in a 2025 [joint position statement](https://doi.org/10.1186/s13750-025-00374-5) that retains human responsibility for AI-assisted judgments and calls for transparent reporting.

Our $178,994 project, ["Auditable AI Workflows for Evidence Synthesis Library Services"](https://www.imls.gov/grants/awarded/lg-259841-ols-26), will develop and evaluate an AI-assisted workflow for title-and-abstract screening.
Bipasha Banerjee is the Principal Investigator, and C. Cozette Comer and I are co-Principal Investigators.
We will work with evidence-synthesis library professionals to study model behavior, develop a prototype and instruction manual, and test the workflow in the context of the services librarians provide to research teams.

Controlled experiments will measure how often relevant studies survive screening and how recommendations change across models, prompts, and repeated runs.
Those results will inform a prototype that retains the model input, instructions, version, settings, output, and subsequent human decision for each record.
Evidence-synthesis professionals from services such as [Evidence Synthesis Services at Virginia Tech](https://guides.lib.vt.edu/SRMA/home) will use the prototype and evaluate whether its audit trail supports an actual review.

A workflow may fit comfortably into an existing service while repeatedly excluding relevant studies, or it may perform well against a benchmark while leaving librarians unable to explain its decisions to a research team.
An adoption recommendation must account for both methodological performance and the professional setting in which the workflow will be used.

## Verification in national AI policy

The White House report [*Science: A New Golden Age*](https://www.whitehouse.gov/wp-content/uploads/2026/07/Science-A-New-Golden-Age.pdf) warns that AI can increase the production of plausible scientific claims faster than the research system can verify them.
The report calls for documented methods, interoperable systems, open interfaces, and machine-auditable replication packages so that verification capacity grows alongside generation capacity.

[America's AI Action Plan](https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf) calls for mission-specific measures, realistic testbeds, stronger evaluation science, and collaboration between technical researchers and practitioners who understand the work being automated.
It also supports open-weight models for rigorous academic experiments in which researchers need direct access to the model and control over its deployment to explain a result.

Our proposals predate *Science: A New Golden Age*, so the report did not shape their design, but both projects study forms of verification that the report places alongside increased generation capacity.
Generated descriptions and relationships must remain traceable to their sources, and model judgments must be open to inspection before they alter the evidence available to a review.

## My role in the projects

I will be working mostly on research design, evaluation, auditability, reproducibility, and ways other library systems might reuse what we learn.
The evidence-synthesis project also extends my research on [how disagreement among language models changes relevance judgments and retrieval outcomes](https://arxiv.org/abs/2507.02139), since disagreement may reveal where a single relevance label conceals uncertainty that a reviewer ought to see.

Models can already generate descriptions and relevance labels.
Under what conditions should those outputs be allowed to govern what researchers can discover and what an evidence synthesis can claim?

The IMLS award records provide additional information about [the machine-generated metadata project](https://www.imls.gov/grants/awarded/lg-259840-ols-26) and [the evidence-synthesis project](https://www.imls.gov/grants/awarded/lg-259841-ols-26).
