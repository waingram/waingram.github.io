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

Scale also changes what it means to care for the resulting records.
A generated description may remain in a collection long after the model, prompt, or commercial service that produced it has changed or disappeared.
Future librarians must be able to tell which information came from the collection, which information was inferred by a model, and what evidence supported the inference.
They also need a practical way to correct a mistake, rerun a process, migrate the records, or decide that a particular kind of generated metadata should no longer be used.

That is why reliability, transparency, and long-term stewardship belong in the same conversation.
A field is reliable only if it behaves consistently across an entire collection rather than looking plausible on one carefully chosen object.
Its origin must remain visible so that a person can trace a generated name, subject, or relationship back to the source material and the process that created it.
Long-term stewardship is the practical test of both qualities.
Can the library still understand and govern that information after the original experiment is over?

That problem is at the center of ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), which received $473,403.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
The project will evaluate machine-generated metadata across digital collections and determine which types of metadata remain consistent enough to support discovery.
It will also examine whether relationships derived from that metadata can be traced back to the collection materials that support them.
We will use that analysis to build and evaluate new forms of cross-collection navigation.
The goal is not simply to generate more fields or to produce an impressive demonstration.
We want evidence about when those fields can become part of the structure people rely on, where human review belongs, and what a library must preserve so that the structure remains accountable over time.

## When screening decides what counts as evidence

Evidence synthesis has a different bottleneck.
Before a systematic review can compare findings, reviewers must decide which studies meet the review's inclusion criteria.
A database search may return thousands of titles and abstracts, and each record must be screened before the reviewers can begin analyzing the evidence.
The work is repetitive, but the judgment is consequential.

That chain of judgment is also part of what makes an evidence synthesis different from an ordinary literature summary.
Reviewers document where they searched, what they searched for, which eligibility criteria they applied, and why studies were included or excluded.
Those records allow another person to inspect the method, challenge a decision, and understand how the final body of evidence was assembled.
[PRISMA 2020](https://doi.org/10.1136/bmj.n71) formalizes much of this reporting for systematic reviews, while the Royal Society and the Academy of Medical Sciences describe transparency and rigor as [principles of good evidence synthesis](https://royalsociety.org/-/media/policy/projects/evidence-synthesis/principles-for-good-evidence-synthesis-for-policy.pdf).
Transparency and reproducibility are therefore not optional virtues added after the review is complete.
They are part of the method by which the review earns trust.

This makes relevance screening an attractive place to use AI.
A model can read an abstract and recommend whether to include or exclude the study.
However, if the model excludes a relevant paper, that paper does not merely fall lower in a list of search results.
It disappears from the body of evidence that the review will analyze.
The final synthesis may then rest on an incomplete account of the research.

Putting AI into this workflow does not make those methodological obligations disappear.
It makes them harder to satisfy.
A model's recommendation may depend on its version, the wording of a prompt, the order and format of the input, its parameter settings, or ordinary variation between repeated runs.
If the workflow records only a final include-or-exclude label, no one can reconstruct how that decision was made or tell whether a relevant study vanished because the model was unstable.

The international [Responsible use of AI in evidence SynthEsis initiative](https://doi.org/10.17605/OSF.IO/FWAUD), or RAISE, names this as a professional standards problem.
[RAISE 2](https://osf.io/fwaud/files/d6phz) provides guidance for building and evaluating AI evidence-synthesis tools.
For relevance screening, it calls for representative evaluation data, strong protection of recall, detailed prompt documentation, repeated testing of variable outputs, and public reporting of results and limitations.
[RAISE 3](https://osf.io/fwaud/files/y5aqg) approaches the same problem from the user and institution side.
It asks whether a tool is fit for the particular review, whether its validation can be reproduced, whether its performance may change, and whether people have enough information to justify and report its use.

RAISE is not the position of a single research group.
In 2025, Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence issued a [joint position statement](https://doi.org/10.1186/s13750-025-00374-5) supporting RAISE.
The statement holds evidence synthesists responsible for their work, requires human oversight, and says that AI-generated judgments should be reported transparently.

The second project, ["Auditable AI Workflows for Evidence Synthesis Library Services"](https://www.imls.gov/grants/awarded/lg-259841-ols-26), received $178,994.
Bipasha Banerjee is the Principal Investigator, and C. Cozette Comer and I are co-Principal Investigators.
We will develop and evaluate an AI-assisted workflow for title-and-abstract screening with evidence-synthesis library professionals.
A reviewer should be able to see what the model received, how it was instructed, which version and settings were used, and what recommendation it returned for each record.
The audit trail should retain changes made by a human reviewer and the reason for the final decision.
The workflow should also reveal when a decision changes across models, prompts, or repeated runs so that unstable cases can receive human attention.

This matters especially in a library-supported evidence-synthesis service such as [Evidence Synthesis Services at Virginia Tech](https://guides.lib.vt.edu/SRMA/home).
The library is not merely helping someone operate a convenient tool.
It is helping a research team use and report a defensible method.
An auditable workflow can expose selection errors, support updates when models change, document the use of AI in a methods section, and keep an opaque model decision from becoming an unacknowledged source of bias.

No single metric can tell us whether the workflow belongs in practice, so the project turns the RAISE recommendations into three connected forms of work.
The analysis lets us measure how accuracy, recall, disagreement, prompt sensitivity, and repeated-run variation affect the validity and reproducibility of screening.
The prototype makes those concerns tangible as records, interfaces, and review steps that people can actually use.
Then practitioners can tell us what a benchmark cannot.
Does the workflow fit the service they provide, put professional judgment in the right places, and produce enough guidance for another library to use it responsibly?

The point is not to treat the model as another reviewer whose answer is accepted without question.
Nor is faster screening, by itself, a sufficient result.
We want a defensible way to learn where AI can reduce screening work without hiding uncertainty or lowering the standards that make an evidence synthesis credible.

## From professional standards to national policy

Neither proposal was written in response to the federal documents.
The alignment is substantive rather than causal.
RAISE is the closer point of reference for the evidence-synthesis project because it defines the responsibilities and evaluation questions for this specific research method.
The federal documents place the same verification problem within a broader national agenda for science and AI.

The White House report [*Science: A New Golden Age*](https://www.whitehouse.gov/wp-content/uploads/2026/07/Science-A-New-Golden-Age.pdf) makes the problem unusually clear.
AI can accelerate scientific production, but that acceleration has little value if the underlying findings cannot be checked.
The report argues that new capacity for generation must be matched by verification at comparable scale, supported by reproducible methods, methodological documentation, open interfaces, interoperability standards, and machine-auditable replication packages.

[America's AI Action Plan](https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf) approaches the problem from the perspective of adoption.
It calls for mission-specific evaluation, realistic testbeds, better measurement of reliability and performance, and teams that bring technical developers together with people who understand the domain of use.
It also recognizes the value of open-weight models for rigorous academic experiments, where access to the model and control over its deployment can make closer inspection possible.

The two IMLS projects bring those ambitions into library practice, where the word *infrastructure* becomes concrete.
For a digital collection, it means AI-derived information that remains traceable, interoperable, correctable, and intelligible for years.
For evidence synthesis, it means being able to inspect, replay, challenge, and correct an AI recommendation before it changes the evidence available to support a scientific conclusion.
Real library work provides the testbed, and the professionals responsible for that work help define what the system must do.

This is the alignment I find most compelling.
National policy describes the need for verification infrastructure, while our projects ask what that infrastructure looks like in two places where libraries already carry responsibility for the integrity of the scholarly and cultural record.

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
This work extends my broader research on machine-usable scientific knowledge, including [how disagreement among language models changes relevance judgments and retrieval outcomes](https://arxiv.org/abs/2507.02139), into a practical question.
What must we know about an AI-generated description or judgment before we allow it to shape what someone else can know?

The IMLS award records provide additional information about [the machine-generated metadata project](https://www.imls.gov/grants/awarded/lg-259840-ols-26) and [the evidence-synthesis project](https://www.imls.gov/grants/awarded/lg-259841-ols-26).
