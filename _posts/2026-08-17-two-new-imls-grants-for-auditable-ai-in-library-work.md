---
layout: default
title: 'Two New IMLS Grants: When AI Changes What We Find and What Counts as Evidence'
date: 2026-08-17 12:00 -0400
categories: AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS
tags: [AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS]
---
On August 16, the Institute of Museum and Library Services awarded Virginia Tech University Libraries two 2026 National Leadership Grants totaling $652,397.
I am delighted to be a co-Principal Investigator on both projects.
Both projects examine model outputs that another process uses.
The metadata project tests outputs used to organize and connect digital collections.
The evidence-synthesis project tests outputs used to decide which studies enter a systematic review.
What evidence should a library require before its systems and services rely on those outputs?

## Library-wide, Machine-Generated Metadata as First-Class Structural Components

A digital library contains objects such as documents, photographs, recordings, and videos, together with metadata records that describe them.
Digital library software uses metadata fields to build search indexes, browse categories, filters, and links among materials.
Those operations make metadata part of the system infrastructure.

A name in a metadata field allows the system to retrieve the objects associated with that person.
A subject heading allows the interface to group objects assigned the same subject.
Metadata therefore affects how the software organizes and retrieves an object, in addition to describing it for a reader.

Human-authored metadata is incomplete and sometimes inconsistent.
Libraries nevertheless create it within schemas and review procedures that support correction and maintenance.
Those procedures can distinguish an authoritative record from a tentative note or an unreviewed suggestion.

AI models can extract names, places, organizations, events, dates, subjects, and descriptions from collection objects.
Each output initially constitutes a candidate assertion about the object.
A controlled workflow must determine whether that assertion should enter the library's maintained metadata.

The library could instead display candidate assertions to a cataloger, use them temporarily in a search experiment, or compare them with existing records.
The proposed project studies the case in which generated assertions supply data to later digital-library processes.

Our $473,403 project, ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), will evaluate machine-generated metadata across digital collections.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
The project will compare generated metadata across collections to identify fields and relationships that are consistent enough to support discovery.
It will also examine semantic similarity, error patterns, provenance, and the need for human review.

The proposed workflow first extracts candidate metadata fields and named entities from collection objects.
Evaluation identifies which candidate assertions are accurate, consistent across collections, and traceable to their source objects.
Entity resolution compares references to determine which ones identify the same person, place, organization, or event.
The retained entities form nodes in a knowledge graph.
Relationships supported by the collection objects form its edges.
A navigation prototype will query the graph to connect materials across collections and formats.

```text
digital objects
      ↓
candidate fields and extracted entities
      ↓
retained corpus-level metadata
      ↓
reconciled entities and relationships
      ↓
knowledge graph
      ↓
cross-collection navigation
```

Phase 1 evaluates candidate metadata across heterogeneous collections and repeated model runs.
Phase 2 uses the retained entities and relationships to construct a knowledge graph across collections.
Phase 3 tests navigation and discovery functions that query the graph.
Phase 2 therefore depends on the Phase 1 evaluation, and Phase 3 depends on the resulting graph.

In the project title, a “first-class structural component” is a metadata element that the digital library stores, indexes, queries, links, maintains, and supplies to other services.
An unreviewed suggestion does not meet that definition.
A generated assertion used to determine entity identity, graph structure, retrieval, or navigation does.

The proposal does not treat metadata extraction, named-entity recognition, entity linking, knowledge graphs, or automated classification as new techniques.
Its research design evaluates the connected system at three points:

1. Can a model produce an accurate and traceable metadata field for an object?
2. Do the retained fields form a consistent representation across collections?
3. How do errors in that representation affect discovery and navigation?

Accurate fields for individual objects do not establish corpus consistency or reliable discovery.
An entity extractor evaluated against a labeled test set may still produce inconsistent references across heterogeneous collections.
A graph evaluation may also miss the effect of an incorrect relationship on what users find.

### Why record-level accuracy is insufficient

Three documents may contain the names “William A. Ingram,” “W. A. Ingram,” and “Bill Ingram.”
An extraction model can identify all three name strings correctly without determining whether they denote one person or several people.
Entity resolution supplies that identity decision.

Representing one person as three entities divides that person's documents among three sets of search results and graph relationships.
Merging three people into one entity creates links that the source materials do not support.
A mistaken merge can associate a person with the wrong organization, location, event, photographs, or oral histories.

**Corpus consistency.** An AI model can produce plausible fields for individual objects but use names, dates, classifications, or levels of specificity inconsistently across collections.
The resulting metadata cannot supply a coherent shared representation.

**Repeated generation.** Model version, prompt, parameters, and supplied context can change the entities or relationships produced for the same object.
The library must determine whether a new output corrects an earlier assertion or records another unsupported alternative.

**Provenance.** A name transcribed from a document, an identity inferred from context, a match retrieved from an authority file, and a relationship proposed by a language model have different evidential bases.
The metadata record must preserve those distinctions.

**Correction.** Separating two incorrectly merged people requires updates to every graph edge, search index entry, interface link, and generated narrative that used the merge.
Correcting only the original assertion leaves the digital library internally inconsistent.

**Reference data.** Existing human-authored fields can serve as reference data when they describe the same property as the generated field.
The absence of an entity from an existing record does not prove that a generated entity is wrong, and semantic similarity between descriptions does not establish factual support.

**Human review.** Reviewing every generated assertion individually would reproduce the labor bottleneck that motivated automated metadata generation.
The evaluation must identify assertions suitable for automatic acceptance, assertions that can be checked through sampling, and ambiguities that always require review.

### Research question

> Which model-generated assertions can a digital library safely reuse as inputs to later computational processes, and what controls are required when those later processes depend on them?

Reuse creates the dependency at the center of the project.
A generated assertion used only as a suggestion has limited effect on the digital library.
The same assertion can determine entity identity, graph structure, retrieval, and navigation after other services consume it.

Record-level evaluation cannot detect inconsistent entity names or recurring errors across thousands of objects.
Corpus-level evaluation must measure consistency, contradiction, and accumulated error.
Each assertion also requires provenance that identifies its source material, model, prompt, and human corrections.

Long-term stewardship adds a maintenance requirement.
Libraries may retain generated descriptions and relationships after the underlying models, prompts, or commercial services have changed.
A librarian must be able to distinguish source metadata from model inference, reconsider an earlier decision, and regenerate or remove derived structures without reconstructing their history from scratch.

## Auditable AI Workflows for Evidence Synthesis Library Services

Evidence synthesis analyzes existing studies to determine what their combined evidence supports.
It does not collect new experimental or observational data.

Suppose researchers want to know whether a particular treatment reduces depression.
Many clinical studies may have examined that question using different patient populations, treatment durations, outcome measures, and sample sizes.
No individual study represents the entire body of evidence.

A systematic review provides a structured method for finding and evaluating the relevant studies.
Before conducting the review, the researchers define:

- The question being investigated.
- Which populations, interventions, comparisons, and outcomes are relevant.
- Which study designs are eligible.
- Where and how they will search.
- How studies will be selected and evaluated.

The researchers search multiple databases and remove duplicate records.
They screen each remaining record against the eligibility criteria.
They assess the risk of bias in the included studies and extract the findings needed for the synthesis.
The documentation allows readers to reconstruct how the researchers selected the evidence and judge whether relevant studies may have been missed.

A systematic review may also contain a meta-analysis.
A meta-analysis converts compatible study results to a common effect measure and calculates a combined estimate.
Studies with more precise estimates usually receive more weight in that calculation.

Ten clinical trials might each estimate how much a treatment changes depression scores.
A meta-analysis combines those estimates to calculate an overall effect and quantify the variation among the study results.

The terms are related but not interchangeable:

- **Evidence synthesis** is the broad category.
- **Systematic review** is a rigorous process for finding, selecting, evaluating, and synthesizing studies.
- **Meta-analysis** is an optional statistical method for combining compatible study results.

A systematic review may conclude that the studies are too different or too poorly reported to combine statistically.
It would still be a systematic review, but it would not contain a meta-analysis.

The synthesis can analyze only the studies included after search and screening.
A missed or incorrectly excluded study is absent from both the narrative conclusions and any pooled statistical estimate.

A systematic review aims to identify every study that satisfies its predefined criteria, not a representative sample of papers.
Relevant studies may use different terminology, appear in different disciplines, or have inconsistent database indexing.
Reviewers describe a search as sensitive when it retrieves most of the relevant studies.
Systematic-review searches generally prioritize sensitivity and therefore retrieve many irrelevant records that reviewers must examine.

Screening usually occurs in two stages.
Reviewers first apply the protocol's eligibility criteria to titles and abstracts.
Records that appear eligible or lack enough information for a decision proceed to full-text screening.
Reviewers document the reason for each full-text exclusion.

These decisions require interpretation.
An abstract may omit the population, study design, intervention, outcome, or other information required by the protocol.
Its terminology may also differ from the protocol's wording.
Reviewers generally retain an uncertain record for full-text screening because an early exclusion would remove its evidence from the review.

Many review protocols assign each record to two independent screeners.
The review team compares their decisions, resolves disagreements, and documents the final inclusion or exclusion.
This procedure reduces the influence of one reviewer's error or interpretation, but it requires a second screening pass and conflict resolution.

The number of records makes even quick judgments expensive.
A search that retrieves 5,000 records requires more than 83 hours if one reviewer spends one minute on each title and abstract.
Independent double screening adds another pass, conflict resolution, full-text retrieval, full-text screening, and documentation.

Research libraries support the information-retrieval work that produces the records for screening.
Librarians formulate searchable concepts, translate searches across databases, construct reproducible search strategies, manage duplicate records, select review software, and document the selection process.
At Virginia Tech, [Evidence Synthesis Services](https://guides.lib.vt.edu/SRMA/home) includes librarians as methodological collaborators on review teams.

Title-and-abstract screening repeatedly compares records with the same eligibility criteria.
An AI model could prioritize likely inclusions, identify apparent exclusions, or provide a preliminary recommendation for each record.

The two errors have different consequences.
A false inclusion creates more work because a reviewer examines an irrelevant paper later.
A false exclusion removes a relevant study from the evidence base before anyone examines it.
The omitted study could change the estimated effect, reveal a harmful outcome, or represent a population absent from the remaining literature.

Screening speed cannot establish whether an AI-assisted workflow is methodologically acceptable.
The record for each screening recommendation must identify the model, eligibility criteria, prompt, input, settings, and output.
It must also preserve repeated recommendations, the human reviewer's response, and the final decision.
Without that record, a research team cannot reconstruct or challenge an AI-assisted exclusion.

PRISMA stands for **Preferred Reporting Items for Systematic Reviews and Meta-Analyses**.
It is a reporting guideline that identifies the information authors should disclose when publishing a systematic review.

PRISMA does not prescribe the review method, and compliance does not prove that the review was well designed.
Its reporting requirements make the completed review inspectable.

A review that reports 42 included studies must also account for how the researchers selected them.
The report should answer questions such as these:

- Which databases and other sources were searched?
- What search strategies were used?
- What made a study eligible?
- How were titles, abstracts, and full texts screened?
- Were automation tools involved?
- How many records were excluded at each stage?
- Why were apparently relevant full-text studies excluded?

[PRISMA 2020](https://doi.org/10.1136/bmj.n71) provides a 27-item checklist covering the review's rationale, methods, results, and interpretation.
Its [flow diagram](https://www.prisma-statement.org/prisma-2020-flow-diagram) records how many records were identified, screened, excluded, and included, together with the reasons for full-text exclusions.
The [official PRISMA materials](https://www.prisma-statement.org/prisma-2020) include the checklist, expanded guidance, and flow-diagram templates.

The conclusions of a systematic review depend on the studies admitted to its evidence base.
Reporting only the included studies and conclusions does not reveal whether the search missed relevant literature, the eligibility criteria were applied consistently, or the selection process introduced bias.
Complete reporting allows another researcher to inspect those decisions and attempt to reproduce or update the review.

PRISMA 2020 asks reviewers to identify any automation tools used in study selection.
The Royal Society and the Academy of Medical Sciences also include transparent study selection among their [principles of good evidence synthesis](https://royalsociety.org/-/media/policy/projects/evidence-synthesis/principles-for-good-evidence-synthesis-for-policy.pdf).
An AI screening recommendation is therefore part of the reported research method.

The international [Responsible use of AI in evidence SynthEsis initiative](https://doi.org/10.17605/OSF.IO/FWAUD), known as RAISE, divides responsibility for AI-assisted evidence synthesis across developers, users, and institutions.
Its [guidance for developers](https://osf.io/fwaud/files/d6phz) calls for representative evaluation data, careful measurement of recall, documented prompts and settings, repeated tests of variable outputs, and public reporting of limitations.
The companion [guidance for users and institutions](https://osf.io/fwaud/files/y5aqg) asks whether a tool fits a particular review, whether its validation can be reproduced, and whether its performance may change.
Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence endorsed the RAISE framework in a 2025 [joint position statement](https://doi.org/10.1186/s13750-025-00374-5) that retains human responsibility for AI-assisted judgments and calls for transparent reporting.

PRISMA establishes the reporting obligation for the review as a whole.
It does not specify the complete technical record required to audit every language-model recommendation.
RAISE provides guidance for evaluating and reporting the responsible use of AI within the review.
The proposed workflow will preserve the record-level inputs, outputs, settings, and human decisions needed to reconstruct AI-assisted screening.

Our $178,994 project, ["Auditable AI Workflows for Evidence Synthesis Library Services"](https://www.imls.gov/grants/awarded/lg-259841-ols-26), will develop and evaluate an AI-assisted workflow for title-and-abstract screening.
Bipasha Banerjee is the Principal Investigator, and C. Cozette Comer and I are co-Principal Investigators.
We will work with evidence-synthesis library professionals to study model behavior, develop a prototype and instruction manual, and test the workflow in the context of the services librarians provide to research teams.

Controlled experiments will measure recall, the proportion of known relevant studies retained after screening.
The experiments will also measure variation across models, prompts, and repeated runs.
Those results will inform a prototype that retains the model input, instructions, version, settings, output, and subsequent human decision for each record.
Evidence-synthesis professionals, including colleagues in Virginia Tech's service, will use the prototype in the context of an actual review.

The adoption analysis will combine recall and stability measurements with practitioner evaluation of the audit trail and its fit within a library service.

## Verification in national AI policy

The White House report [*Science: A New Golden Age*](https://www.whitehouse.gov/wp-content/uploads/2026/07/Science-A-New-Golden-Age.pdf) warns that AI can increase the production of plausible scientific claims faster than the research system can verify them.
The report calls for documented methods, interoperable systems, open interfaces, and machine-auditable replication packages.

[America's AI Action Plan](https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf) calls for mission-specific measures, realistic testbeds, stronger evaluation science, and collaboration between technical researchers and practitioners who understand the work being automated.
It also supports open-weight models for rigorous academic experiments in which researchers need direct access to the model and control over its deployment to explain a result.

Our proposals predate *Science: A New Golden Age*, so the report did not shape their design.
The metadata project will preserve links between generated assertions and their source objects.
The evidence-synthesis project will preserve the conditions and human review associated with each model recommendation.
Both projects test concrete forms of verification described in the report.

## My role in the projects

I will be working mostly on research design, evaluation, auditability, reproducibility, and ways other library systems might reuse what we learn.
The evidence-synthesis project also extends my research on [how disagreement among language models changes relevance judgments and retrieval outcomes](https://arxiv.org/abs/2507.02139), since disagreement may reveal where a single relevance label conceals uncertainty that a reviewer ought to see.

Models can already generate descriptions and relevance labels.
Under what conditions should those outputs be allowed to govern what researchers can discover and what an evidence synthesis can claim?

The IMLS award records provide additional information about [the machine-generated metadata project](https://www.imls.gov/grants/awarded/lg-259840-ols-26) and [the evidence-synthesis project](https://www.imls.gov/grants/awarded/lg-259841-ols-26).
