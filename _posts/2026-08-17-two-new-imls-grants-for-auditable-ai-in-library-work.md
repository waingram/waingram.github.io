---
layout: default
title: 'Two New IMLS Grants and One Shared Question About AI'
date: 2026-08-17 12:00 -0400
categories: AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS
tags: [AI, Digital Libraries, Evidence Synthesis, Metadata, IMLS]
---
I was delighted to learn yesterday that Virginia Tech University Libraries had received two 2026 National Leadership Grants from the Institute of Museum and Library Services.
The awards total $652,397, and I am a co-Principal Investigator on both projects.

One grant concerns metadata for digital collections, while the other concerns relevance screening for evidence synthesis.
The daily work behind them is quite different, yet both projects grew from a question that I keep returning to in my research: what should a library preserve about an AI-generated description or judgment before allowing it to influence what a patron can discover or what a researcher counts as evidence?

## Metadata that has to last

Every digital collection is partly shaped by what its metadata allows us to see.
A title, date, subject heading, or place name can give someone a path into a photograph, newspaper page, map, or manuscript, but a large collection will almost always contain more material than its staff can describe in detail.
A person mentioned in a handwritten document may never appear in the catalog record, and a relationship between two collections may remain hidden because no one had the time to record it.

Language models could help libraries fill some of those gaps by identifying names and places, suggesting subjects, describing images, or finding relationships across collections.
The possibility is genuinely exciting because richer description can open material that is presently difficult to find, although the same scale that makes this possible also allows an error to travel through many records and services.

Suppose a model writes the same person's name differently in several collections.
A search system may then divide one person into multiple identities, leaving a patron with fragments of a story that should have been connected.
If the model instead merges two people who share a name, it can create a relationship that the source material never supported.
Once generated metadata supplies the links in a knowledge graph or the paths through a discovery interface, an error can shape a user's understanding of the collection rather than remaining confined to a single record.

The records may also outlive the particular model, prompt, or commercial service that produced them.
A librarian working with the collection five years later will need to distinguish information taken directly from an object from information inferred by a model, trace that inference to its supporting material, and understand enough of the process to correct or regenerate it.
Without that history, even useful metadata becomes difficult to maintain because no one can tell which changes will repair the collection and which will introduce new inconsistencies.

Our $473,403 project, ["Library-wide, Machine-Generated Metadata as First-Class Structural Components"](https://www.imls.gov/grants/awarded/lg-259840-ols-26), begins with this maintenance problem.
Bipasha Banerjee is the Principal Investigator, and Jennifer L. Goyne and I are co-Principal Investigators.
We will evaluate machine-generated metadata across digital collections to learn which forms remain consistent enough to support discovery and whether relationships derived from them can be traced to the collection materials that support them.
We will then use that evidence to build and evaluate new ways of navigating across collections.

A convincing example tells us very little about how a generated field will behave across thousands of varied objects.
We need to learn where errors accumulate, which inferences require review, and what provenance a library must retain if the resulting descriptions and relationships are going to become durable parts of its systems.
The project treats maintenance as part of the research from the beginning, when we can still design the records and workflows around the people who will eventually have to understand and repair them.

## Screening that has to be explained

Before reviewers can compare findings in a systematic review, they may have to screen thousands of titles and abstracts against a carefully defined set of eligibility criteria.
Each decision determines whether a study moves forward for closer examination, and the record of those decisions helps another researcher understand how the final body of evidence was assembled.
[PRISMA 2020](https://doi.org/10.1136/bmj.n71) asks systematic reviewers to report this selection process, including the use of automation tools, while the Royal Society and the Academy of Medical Sciences include transparent study selection among their [principles of good evidence synthesis](https://royalsociety.org/-/media/policy/projects/evidence-synthesis/principles-for-good-evidence-synthesis-for-policy.pdf).
The documentation is part of the research method because it allows someone else to inspect the review, question an exclusion, and repeat the process when the evidence changes.

Title-and-abstract screening looks like a natural place for AI assistance because much of the work is repetitive and a model can assign an include-or-exclude recommendation within seconds.
The difficult case is the relevant paper that receives a confident exclusion.
That paper may never reach the researchers who analyze the evidence, which means that one unexamined model judgment can alter the findings available to the review.

Reconstructing such a judgment requires more than saving the final label.
The recommendation may change with the model version, the wording of the instructions, the format of the record, or ordinary variation between repeated runs.
If the workflow discards those details, a reviewer cannot tell whether the exclusion followed the stated criteria or resulted from a model behavior that would not recur.
Updates become difficult for the same reason, since a research team has no stable account of the earlier process against which to compare a new model or prompt.

The international [Responsible use of AI in evidence SynthEsis initiative](https://doi.org/10.17605/OSF.IO/FWAUD), known as RAISE, gives this project its closest professional framework.
Its [guidance for developers](https://osf.io/fwaud/files/d6phz) asks them to validate an AI tool on representative tasks, protect recall when missing a study would damage the synthesis, document prompts and settings, test variable outputs repeatedly, and report limitations publicly.
The companion [guidance for users and institutions](https://osf.io/fwaud/files/y5aqg) asks whether that validation can be reproduced, whether performance is likely to change, and whether the tool fits the review and the workflow in which people will use it.
Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence endorsed this framework in a 2025 [joint position statement](https://doi.org/10.1186/s13750-025-00374-5) that retains human responsibility for AI-assisted judgments and calls for their transparent reporting.

Our $178,994 project, ["Auditable AI Workflows for Evidence Synthesis Library Services"](https://www.imls.gov/grants/awarded/lg-259841-ols-26), will examine how those responsibilities can be carried into title-and-abstract screening.
Bipasha Banerjee is the Principal Investigator, and C. Cozette Comer and I are co-Principal Investigators.
Working with evidence-synthesis library professionals, we will study model behavior, develop a prototype workflow, and evaluate how that workflow fits the service that librarians provide to research teams.

The methodological analysis will measure how often the workflow retains relevant studies and how its recommendations change across models, prompts, and repeated runs.
The prototype will preserve what the model received, how it was instructed, which version and settings produced the recommendation, and how a human reviewer changed or resolved it.
With those records, a reviewer could retrace an exclusion while screening, compare the old process with a new one when updating the review, and describe the use of AI precisely in the methods section.

When professionals who support services such as [Evidence Synthesis Services at Virginia Tech](https://guides.lib.vt.edu/SRMA/home) use the prototype, they can show us where it interrupts a real review, where it asks for human judgment too late, and which parts of the audit trail help a research team explain its decisions.
Their experience will also help us write guidance that another library can adapt rather than leaving the prototype as a tool that only makes sense to its developers.
Together, the analysis, prototype, and practitioner evaluation will tell us how much screening work AI can safely reduce and what a library must do when the model's recommendation is uncertain or wrong.

## The broader verification challenge

RAISE is the most direct standard for the evidence-synthesis project because it was written for this research method.
The two proposals predate the White House report [*Science: A New Golden Age*](https://www.whitehouse.gov/wp-content/uploads/2026/07/Science-A-New-Golden-Age.pdf), so the report did not shape their design, but it describes a closely related challenge for science.
As AI increases the speed at which researchers can generate claims and analyses, the report argues, scientific institutions need comparable capacity to verify them.
The report connects that capacity to documented methods, interoperable systems, open interfaces, and replication packages that machines and people can audit.

[America's AI Action Plan](https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf) calls for mission-specific measures, realistic testbeds, stronger evaluation science, and collaboration between technical researchers and practitioners who understand the domain.
It also supports open-weight models for rigorous academic experiments, where researchers may need direct access to the model and control over its deployment in order to explain a result.

Our projects address those verification needs in two forms of library work where an AI output can become part of the record that other people rely on.
For digital collections, verification requires enough provenance to trace and correct a generated description years after its creation, along with collection-scale tests that reveal patterns a polished demonstration would miss.
For evidence synthesis, it requires a reviewable history of each recommendation and tests that show how often relevant studies are retained when the model, prompt, or run changes.
In both cases, the librarians responsible for the service help define the conditions under which an output can be used and the evidence needed to support that decision.

## What I will be working on

In both projects, I will focus on research design and on methods for finding failures that a good-looking output can conceal.
That work includes the evaluation frameworks, the records needed for auditability and reproducibility, and the practical question of how another library could reuse the resulting methods in its own systems.
This extends my research on machine-usable scientific knowledge, including [how disagreement among language models changes relevance judgments and retrieval outcomes](https://arxiv.org/abs/2507.02139), into services where those disagreements have immediate consequences for discovery and evidence selection.

I am especially glad that both grants give us time to work through the less glamorous questions that arrive after an AI system begins producing plausible results.
Someone still has to investigate the failures, decide what should be reviewed, preserve enough context to revisit a decision, and make the workflow understandable to people who did not build it.
The projects will produce methods, software, and guidance that other libraries can inspect, test, correct, and adapt as they decide where AI belongs in their own work.

The IMLS award records provide additional information about [the machine-generated metadata project](https://www.imls.gov/grants/awarded/lg-259840-ols-26) and [the evidence-synthesis project](https://www.imls.gov/grants/awarded/lg-259841-ols-26).
