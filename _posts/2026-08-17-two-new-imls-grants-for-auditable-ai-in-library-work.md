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

## Library-wide, Machine-Generated Metadata as First-Class Structural Components

A digital library contains digital objects, such as documents, photographs, recordings, and videos, together with metadata records that describe those objects. The platform uses fields from those records to build search indexes, browse categories, filters, and links among materials.

In this sense, metadata functions as infrastructure. If a person’s name appears in a metadata field, the system can retrieve everything associated with that person. If an item has a subject heading, the interface can place it among other items assigned the same subject. The metadata does not merely tell a reader about the object; it determines how the software organizes and retrieves the object.

Human-authored metadata is incomplete and sometimes inconsistent, but libraries have procedures for creating, reviewing, and correcting it. The person who supplies a field usually works within a known schema, and the institution can distinguish an authoritative record from a tentative note or an unreviewed suggestion.

Suppose the library runs several AI models across a set of collections. The models extract names, places, organizations, events, dates, subjects, and descriptions from the objects themselves. At first, these are candidate metadata values. They are proposed assertions about the materials, not yet part of the library’s maintained data. 

The library could stop there. It could display the suggestions to a cataloger, use them temporarily to improve a search experiment, or evaluate them against existing records. That would continue a familiar line of research into automated metadata generation. Our work goes further.

Our $473,403 project, ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), will study how machine-generated metadata behaves across digital collections.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
The project will compare generated metadata across collections to identify fields and relationships that remain consistent enough to support discovery.
It will also examine semantic similarity, error patterns, provenance, and the need for human review before using the results to build and evaluate cross-collection navigation.

```text
digital objects
      ↓
candidate fields and extracted entities
      ↓
accepted corpus-level metadata
      ↓
reconciled entities and relationships
      ↓
knowledge graph
      ↓
cross-collection navigation and interpretation
```

In Phase 1, the project generates candidate metadata and asks which fields are accurate, consistent, and traceable across heterogeneous collections and repeated model runs. In Phase 2, it uses the entities and relationships to construct graph-based representations across collections. In Phase 3, it builds navigation and discovery functions that leverage those representations.

Each phase consumes the results of the preceding phase. An extracted name becomes a candidate entity, entity-resolution decisions determine which references belong together, those entities become nodes in a graph, and the graph determines which objects a user encounters as related.

This dependency is what “first-class structural component” is trying to convey. A first-class metadata element is stored, indexed, queried, linked to other elements, maintained over time, and consumed by other services. Machine-generated metadata becomes first-class when the digital library begins to rely on it, rather than merely displaying it as an unverified suggestion.

None of the individual techniques is new. Metadata extraction, named-entity recognition, entity linking, knowledge graphs, and automated classification all have substantial research histories. Large collections and inconsistent metadata are not new either.

The proposal’s contribution is to connect three levels of evaluation that are usually studied separately:

1. **Generation:** Can a model produce a particular metadata field for an object?
2. **Composition:** What happens when those fields are reconciled and combined across collections?
3. **Use:** What happens when discovery and navigation services are built from the combined structure?

A metadata generator can perform well at the first level and still fail at the second or third. Evaluating an entity extractor against a labeled test set does not tell us whether its outputs will produce a coherent representation of twenty-three heterogeneous collections. Evaluating a knowledge graph does not necessarily tell us how errors in that graph will affect what users find.

### New problems when the outputs are combined
Some failures become visible only after individually generated values begin interacting.

A model may extract “William A. Ingram,” “W. A. Ingram,” and “Bill Ingram” correctly from three documents. The extraction task has succeeded in each document, but the digital library still has to determine whether the names identify one person or several people. If it keeps one person as three entities, the collection becomes fragmented. If it merges three people into one entity, it creates relationships that the source materials never asserted.

The consequences increase when later services rely on that decision. A mistaken merge can connect a person with the wrong organization, location, event, photographs, and oral histories. The error is no longer one incorrect field. It has altered a section of the graph and, consequently, the paths available through the collection.

Several related problems follow.

**Local accuracy does not establish corpus coherence.**  
An AI model can generate mostly plausible fields while using names, dates, classifications, or levels of specificity inconsistently across collections. These differences may have little effect when records are inspected separately, yet prevent the records from composing into a usable shared structure.

**Repeated generation can change the maintained structure.**  
Language-model output depends on the model version, prompt, parameters, and supplied context. If a later run produces different entities or relationships, the library must decide whether the new output corrects the previous structure, introduces a competing interpretation, or merely reflects model variability.

**Every derived assertion needs an evidential status.**  
A name transcribed from a document, an identity inferred from contextual clues, a match retrieved from an authority file, and a relationship proposed by a language model are not equivalent kinds of evidence. A conventional metadata record may not have been designed to preserve those distinctions.

**Corrections create downstream maintenance problems.**  
When a reviewer separates two incorrectly merged people, the system must identify every graph edge, search index entry, interface link, and generated narrative that depended on the merge. Correcting the original assertion without updating its dependents leaves the library internally inconsistent.

**Existing metadata is an imperfect reference point.**  
Agreement with human-authored fields can be measured where those fields exist, but absence from an existing record does not prove that a generated entity is wrong. Conversely, semantic similarity between two generated descriptions does not establish that either description is factually supported. So the project needs several forms of evaluation rather than a single accuracy score.

**Human review cannot simply reproduce manual cataloging at a larger scale.**  
If every generated assertion requires individual review, the pipeline has not solved the bottleneck problem that motivated it. The system needs evidence for deciding which outputs can be accepted automatically, which require sampling, and which kinds of ambiguity must always be reviewed.

### Research question
The project asks:

> Which model-generated assertions can a digital library safely reuse as inputs to later computational processes, and what controls are required when those later processes depend on them?

The important word is **reuse**. Generating a description is one operation. Allowing that description to determine entity identity, graph structure, retrieval, and navigation creates a chain of dependency. The grant studies that chain across a production collection environment, from generation through structural integration to patron-facing use.

That is the emerging problem:  a new possibility of producing so much derived metadata that libraries may begin constructing services from it before they know whether the outputs are dependable when combined, updated, and maintained over time. 

Evaluating an isolated record cannot reveal whether the same entity has been named consistently across thousands of objects or whether an error recurs systematically within a collection.
The unit of evaluation must therefore expand from the record to the corpus, where consistency, contradiction, and accumulated error can be measured.
At the same time, each generated assertion needs to retain its own provenance so that a librarian can inspect the source material, model, prompt, and human corrections associated with it.

Treating generated metadata as a first-class structural component creates a longer-term stewardship problem.
Models, prompts, and commercial services will change while the descriptions and relationships produced by them remain embedded in library systems.
A future librarian should be able to distinguish source metadata from model inference, reconsider an earlier decision, and regenerate or remove the derived structure without reconstructing its history from scratch.

## Auditable AI Workflows for Evidence Synthesis Library Services

Evidence synthesis is research that draws conclusions from existing studies rather than collecting new experimental or observational data. It asks: given everything already studied about a question, what does the combined evidence support?

For example, suppose researchers want to know whether a particular treatment reduces depression. Many clinical studies may have examined that question, but they may involve different patient populations, treatment durations, outcome measures, and sample sizes. Looking at one study cannot tell researchers what the entire body of evidence shows.

A systematic review provides a structured method for finding and evaluating that evidence. Before examining the results, the researchers define:

- The question being investigated.
- Which populations, interventions, comparisons, and outcomes are relevant.
- Which study designs are eligible.
- Where and how they will search.
- How studies will be selected and evaluated.

They then search multiple databases, screen every retrieved record against the eligibility criteria, assess the quality or risk of bias of the included studies, extract the relevant findings, and synthesize what the studies collectively show. The process is documented so that readers can understand how the evidence base was constructed and judge whether relevant research may have been missed.

A meta-analysis is a statistical technique that may be performed within a systematic review. When the included studies are sufficiently comparable, researchers convert their results into a common effect measure and calculate a combined estimate. Larger or more precise studies usually contribute more weight to that estimate.

For example, ten clinical trials might each estimate how much a treatment changes depression scores. A meta-analysis combines those estimates to calculate an overall effect and quantify how much the results differ across studies.

The terms are related but not interchangeable:

- **Evidence synthesis** is the broad category.
- **Systematic review** is a rigorous process for finding, selecting, evaluating, and synthesizing studies.
- **Meta-analysis** is an optional statistical method for combining compatible study results.

A systematic review may conclude that the studies are too different or too poorly reported to combine statistically. It would still be a systematic review, but it would not contain a meta-analysis.

Systematic reviewers seek the complete body of research that satisfies predefined criteria rather than a representative sample, so they must search broadly enough that a relevant study is unlikely to be missed. The synthesis can analyze only studies that survive search and screening; if a relevant study is missed or incorrectly excluded, both the narrative conclusions and any pooled statistical estimate may rest on incomplete or distorted evidence.

That emphasis on completeness produces a large screening burden. Relevant studies may use different terminology, appear in different disciplines, or be indexed inconsistently across databases. Search strategies therefore favor sensitivity over precision: they retrieve many potentially relevant records so that reviewers can determine relevance themselves. Most retrieved records will eventually be excluded, but each must first be examined.

Screening usually occurs in two stages. Reviewers begin with titles and abstracts, applying criteria defined by the review protocol. Records that appear eligible or remain ambiguous proceed to full-text screening, where reviewers decide whether each study actually qualifies and document the reason for every exclusion.

These decisions are rarely mechanical. An abstract may omit the population, study design, intervention, outcome, or other information needed to apply the criteria. Terminology may not match the protocol exactly. Reviewers must interpret whether a study is genuinely relevant, and uncertain records generally move forward because excluding them prematurely could remove evidence from the review.

Many review methods also require two people to screen records independently. Their decisions are compared, disagreements are reconciled, and the resulting inclusion and exclusion history is documented. This reduces the influence of individual error or interpretation, but it effectively multiplies the labor.

The scale makes even quick judgments expensive. If a search retrieves 5,000 records and one reviewer spends only one minute on each title and abstract, that initial pass requires more than 83 hours. Independent double screening requires another pass, followed by conflict resolution, full-text retrieval, full-text screening, and documentation.

Research libraries support this work because the screening burden begins with information retrieval. Librarians help formulate searchable concepts, translate them across databases, construct reproducible search strategies, manage duplicate records, select review software, and document the selection process. In many evidence-synthesis services, librarians are methodological collaborators rather than people who merely provide access to databases.

AI-assisted screening is attractive because much of this work consists of repeatedly comparing records with the same eligibility criteria. A model could prioritize likely inclusions, identify obvious exclusions, or provide a preliminary recommendation for each record.

A false inclusion creates more work because someone reviews an irrelevant paper later, but a false exclusion can remove a relevant study from the evidence base before anyone examines it. If the omitted study would have changed the estimated effect, revealed a harmful outcome, or represented a population absent from the remaining literature, the screening error can alter the conclusions of the review or meta-analysis.

That is why the project focuses on auditable workflows rather than screening speed alone. Researchers need to know which model evaluated each record, what criteria and prompt it received, whether repeated runs produced the same recommendation, how a human reviewer responded, and why the final decision was made. Without that information, AI may reduce the visible screening workload by making consequential exclusions that cannot later be reconstructed or challenged.

PRISMA stands for **Preferred Reporting Items for Systematic Reviews and Meta-Analyses**. It is a reporting guideline: it tells authors what information they should disclose when publishing a systematic review.

PRISMA is not the method used to conduct the review, and compliance does not prove that the review was well designed. Its purpose is to make the completed review inspectable.

Suppose a review reports that 42 studies were included. A reader needs to know how the researchers arrived at those 42 studies:

- Which databases and other sources were searched?
- What search strategies were used?
- What made a study eligible?
- How were titles, abstracts, and full texts screened?
- Were automation tools involved?
- How many records were excluded at each stage?
- Why were apparently relevant full-text studies excluded?

PRISMA 2020 provides a 27-item checklist covering the review’s rationale, methods, results, and interpretation. It also provides a flow diagram showing how many records were identified, screened, excluded, and included, together with reasons for full-text exclusions. [The official PRISMA materials](https://www.prisma-statement.org/prisma-2020) include the checklist, expanded guidance, and flow-diagram templates.

This is important because the conclusions of a systematic review depend on how its evidence base was constructed. If authors report only the final studies and conclusions, readers cannot determine whether important literature was missed, whether the eligibility criteria were applied consistently, or whether the selection process introduced bias. Complete reporting allows readers to examine those decisions and gives future researchers enough information to update or attempt to reproduce the review.

For the IMLS project, the key point is that AI-assisted screening becomes part of the selection process that PRISMA expects authors to report. Saying “we used AI to help screen abstracts” would be insufficient for understanding what happened. Researchers would need to identify the tool and explain how it was used.

PRISMA matters because it makes study selection visible as part of the research method rather than treating it as preliminary clerical work. [PRISMA’s flow diagram](https://www.prisma-statement.org/prisma-2020-flow-diagram) makes that idea concrete by showing how the initial search results were progressively transformed into the final evidence base.

[PRISMA 2020](https://doi.org/10.1136/bmj.n71) asks systematic reviewers to report how studies moved through the selection process, including any automation tools used along the way.
The Royal Society and the Academy of Medical Sciences also include transparent study selection among their [principles of good evidence synthesis](https://royalsociety.org/-/media/policy/projects/evidence-synthesis/principles-for-good-evidence-synthesis-for-policy.pdf).
An AI screening decision belongs in the account of how the research was conducted because another researcher needs to understand how each study entered or left the evidence base.

The international [Responsible use of AI in evidence SynthEsis initiative](https://doi.org/10.17605/OSF.IO/FWAUD), known as RAISE, divides responsibility for AI-assisted evidence synthesis across developers, users, and institutions.
Its [guidance for developers](https://osf.io/fwaud/files/d6phz) calls for representative evaluation data, careful measurement of recall, documented prompts and settings, repeated tests of variable outputs, and public reporting of limitations.
The companion [guidance for users and institutions](https://osf.io/fwaud/files/y5aqg) asks whether a tool fits a particular review, whether its validation can be reproduced, and whether its performance may change.
Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence endorsed the RAISE framework in a 2025 [joint position statement](https://doi.org/10.1186/s13750-025-00374-5) that retains human responsibility for AI-assisted judgments and calls for transparent reporting.

PRISMA establishes the reporting obligation, but it does not by itself specify the complete technical record needed for an auditable language-model workflow. It does not fully answer questions such as which model version evaluated each record, what prompt it received, whether repeated runs agreed, or how a human resolved a disagreement. RAISE and the proposed project address that additional layer.

So the relationship is:

- **PRISMA:** Report how the evidence-selection process was conducted.
- **RAISE:** Evaluate and report AI use responsibly within that process.
- **The proposed workflow:** Preserve the record-level information needed to inspect and reconstruct AI-assisted screening.

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
