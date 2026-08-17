---
layout: default
title: 'What an Autonomous Lab Needs to Know: Two New IMLS Grants'
date: 2026-08-17 12:00 -0400
categories: AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS
tags: [AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS]
---
Imagine that an AI system is ready to propose the next experiment in a laboratory.
It has searched the literature, compared earlier results, selected a procedure, and identified the measurement that will determine what happens next.
Could the scientists receiving that plan trace the supporting evidence, see what had been excluded, and distinguish relationships found in the sources from relationships inferred by another model?

An autonomous laboratory depends on a long chain of information decisions made before any instrument begins to run.
Some decisions determine what the system can find in the scientific record, while others determine which findings enter the evidence base from which it reasons.
When those decisions are made by AI, the laboratory may act on an error that no one can locate or even see.

On August 16, I learned that the Institute of Museum and Library Services had awarded Virginia Tech University Libraries two 2026 National Leadership Grants.
The awards total $652,397, and I am delighted to serve as a co-Principal Investigator on both projects.
Neither project builds an autonomous laboratory, but each investigates part of the knowledge infrastructure that an autonomous scientific system would have to trust.

## What can the system find?

A language model can recover a person's name from a handwritten document even when the catalog record lists only a title and date.
Across a collection, it may also recognize that two records describe the same event or place, creating a connection that was previously unavailable to search.
Once these generated descriptions become part of a search system or knowledge graph, the model is no longer helping with a temporary task.
Its output begins to organize what people and machines can find.

Suppose a model writes the same person's name differently in several collections.
A search system may divide one person into multiple identities and scatter the relevant records among them.
If the model instead merges two people who share a name, it can invent a relationship that the source material does not support.
How would a researcher know which kind of error had occurred after the generated names and relationships had passed through several systems?

Answering that question requires more than checking whether an individual description sounds plausible.
The generated metadata must be studied across whole collections, where repeated errors and inconsistencies become visible.
Each inferred name or relationship also needs a traceable connection to the source material, model, prompt, and human decisions that produced it.
A future librarian can then correct the inference, regenerate it with a new model, or remove it without having to guess how the collection acquired it.

Our $473,403 project, ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), will study these questions across digital collections.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
We will evaluate which forms of machine-generated metadata remain consistent enough to support discovery, examine whether derived relationships can be traced to the collection materials that support them, and use the results to build and test new forms of cross-collection navigation.

The cross-collection navigation prototype gives us an immediate setting in which to test the generated metadata.
That provenance becomes necessary whenever an AI system reasons over a library's descriptions and relationships, since the system needs to know whether a connection came from the source record, a model inference, or a later human correction.
Otherwise, the system cannot distinguish evidence from the history of automated decisions layered over that evidence.

## What disappeared before the system could reason?

Before researchers can synthesize the findings of a systematic review, they may have to screen thousands of titles and abstracts against a defined set of eligibility criteria.
Each exclusion removes a study from further analysis, which means that the screening process helps determine the evidence from which the review can draw a conclusion.

AI could reduce the time spent on this repetitive work, but consider what happens when a model confidently excludes a relevant study.
The paper may never reach the researchers who read the full texts, assess study quality, or compare the results.
A later AI system trained on or retrieving from that synthesis will inherit the omission without knowing that another model made it upstream.

The risk of an invisible exclusion helps explain why transparency and reproducibility are defining features of evidence synthesis rather than documentation added after the research is complete.
[PRISMA 2020](https://doi.org/10.1136/bmj.n71) asks systematic reviewers to report how studies moved through the selection process, including the use of automation tools.
The Royal Society and the Academy of Medical Sciences likewise include transparent study selection among their [principles of good evidence synthesis](https://royalsociety.org/-/media/policy/projects/evidence-synthesis/principles-for-good-evidence-synthesis-for-policy.pdf).
If an AI model participates in screening, its decisions become part of the method that a reader should be able to inspect.

The international [Responsible use of AI in evidence SynthEsis initiative](https://doi.org/10.17605/OSF.IO/FWAUD), known as RAISE, treats AI-assisted screening as part of the evidence-synthesis method and sets out what developers, users, and institutions should evaluate and report.
Its [guidance for developers](https://osf.io/fwaud/files/d6phz) calls for validation on representative tasks, careful measurement of recall, documented prompts and settings, repeated tests of variable outputs, and public reporting of limitations.
The companion [guidance for users and institutions](https://osf.io/fwaud/files/y5aqg) asks whether the validation can be reproduced, whether performance may change, and whether the tool fits the review in which it will be used.
Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence endorsed the RAISE framework in a 2025 [joint position statement](https://doi.org/10.1186/s13750-025-00374-5) that retains human responsibility for AI-assisted judgments and calls for transparent reporting.

Our $178,994 project, ["Auditable AI Workflows for Evidence Synthesis Library Services"](https://www.imls.gov/grants/awarded/lg-259841-ols-26), will develop and evaluate an AI-assisted workflow for title-and-abstract screening.
Bipasha Banerjee is the Principal Investigator, and C. Cozette Comer and I are co-Principal Investigators.
We will work with evidence-synthesis library professionals to study model behavior, develop a prototype and instruction manual, and test how the workflow fits the services librarians provide to research teams.

The methodological analysis will tell us how often relevant studies survive screening and how the recommendations change across models, prompts, and repeated runs.
Building the prototype forces us to decide what must be recorded for each judgment, including the model input, instructions, version, settings, output, and subsequent human decision.
When professionals from services such as [Evidence Synthesis Services at Virginia Tech](https://guides.lib.vt.edu/SRMA/home) use the prototype, they can identify where it interrupts a real review, asks for human judgment too late, or fails to provide what a research team needs to explain its method.

A workflow can perform well on a benchmark and still be unusable in an evidence-synthesis service.
It can also fit comfortably into a service while concealing poor recall or unstable decisions.
The experiments, prototype, and practitioner evaluation expose different failures, giving libraries evidence about where AI can reduce work and where it should defer to a human reviewer.

## Why the national agenda pairs autonomy with verification

The White House report [*Science: A New Golden Age*](https://www.whitehouse.gov/wp-content/uploads/2026/07/Science-A-New-Golden-Age.pdf) places closed-loop autonomous experimentation within the same scientific agenda as verification infrastructure.
The report argues that AI can increase the production of hypotheses, analyses, and scientific claims faster than the research system can check them.
It therefore calls for comparable investment in verification through documented methods, interoperable systems, open interfaces, and machine-auditable replication packages.

The challenge is easy to overlook when autonomy is pictured only as a robot operating an instrument.
An autonomous laboratory can run more experiments, but each completed loop also adds new claims, data, procedures, and model decisions to the scientific record.
If the evidence entering and leaving that loop cannot be traced and evaluated, greater autonomy increases the volume of results without increasing our ability to decide which results should guide the next experiment.

[America's AI Action Plan](https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf) calls for mission-specific measures, realistic testbeds, stronger evaluation science, and collaboration between technical researchers and practitioners who understand the work being automated.
It also supports open-weight models for rigorous academic experiments in which researchers need direct access to the model and control over its deployment to explain a result.

Our proposals predate *Science: A New Golden Age*, so the report did not shape their design.
Both projects nevertheless investigate parts of the evidence layer needed to make that kind of verification possible.
The metadata project studies how model-generated descriptions and relationships can remain connected to their sources, while the screening project studies how model judgments can be inspected before they remove a source from the evidence base.

## Two places to test a larger idea

My broader research asks how scientific documents, data, software, procedures, and expert judgments can be connected so that machine-generated claims remain interpretable and verifiable.
These grants give us two concrete places to test that idea inside library systems where provenance, access, and long-term stewardship are already professional responsibilities.

My role in both projects will focus on research design, evaluation, auditability, reproducibility, and the reuse of the resulting methods in other systems.
The evidence-synthesis work also extends my research on [how disagreement among language models changes relevance judgments and retrieval outcomes](https://arxiv.org/abs/2507.02139), since disagreement can reveal cases in which a single relevance label hides uncertainty that should remain visible.

Eventually, an autonomous system may propose an experiment and provide a detailed account of why it should be run.
A scientist should be able to follow that account backward through the studies selected for synthesis, the relationships extracted from research collections, the models that transformed each source, and the human judgments that corrected them.
These two grants allow us to build and test parts of that path now.

The IMLS award records provide additional information about [the machine-generated metadata project](https://www.imls.gov/grants/awarded/lg-259840-ols-26) and [the evidence-synthesis project](https://www.imls.gov/grants/awarded/lg-259841-ols-26).
