---
layout: default
title: 'Learning from LLM Disagreement in Retrieval Evaluation'
date: 2026-07-02 12:00 -0400
categories: AI, Digital Libraries, Information Retrieval, SDGs, JCDL
---
Our JCDL 2025 paper with Bipasha Banerjee and Edward A. Fox asks a question that keeps showing up as large language models move into digital library workflows: what should we do when two capable models disagree about relevance? "Learning from LLM Disagreement in Retrieval Evaluation" argues that disagreement is not just noise to be smoothed away. In thematic retrieval tasks, especially ones involving Sustainable Development Goals (SDGs), disagreement can expose the boundary cases where relevance is ambiguous, model-specific, and consequential.[^1]

### Why Disagreement Matters

Institutions increasingly use bibliographic databases and digital library systems to understand how research contributes to strategic priorities. SDG mapping is a good example. A university may want to know which publications support affordable clean energy, good health and well-being, or poverty reduction. Existing workflows often begin with large Boolean search queries, such as the SDG query sets used in Scopus and related bibliometric tools.

Those queries are useful, but they also have a familiar limitation: they retrieve documents that contain the right words, not necessarily documents that make a substantive contribution to the goal. A paper may mention "energy," "poverty," or "health" without meaningfully advancing an SDG target. That makes LLMs tempting as post-retrieval filters. They can read an abstract and make a semantic judgment about whether it is actually relevant.

The difficulty is that semantic judgment is not a stable measuring instrument. In our study, we asked two locally hosted open-weight models, LLaMA 3.1-8B and Qwen 2.5-7B, to label the same abstract-SDG pairs as either relevant or non-relevant using the same structured prompt. The models often agreed, but the disagreements were the interesting part. They tended to occur in the ambiguous middle, where the connection between a publication and an SDG was plausible but not obvious.

### The Study

We built a corpus from Elsevier's 2023 SDG-aligned Boolean queries, retrieving up to 20,000 Scopus records for each of the 17 SDGs and cleaning the resulting metadata. For the experiments in this paper, we focused on three goals that occupy different parts of the SDG space: SDG 1 (No Poverty), SDG 3 (Good Health and Well-Being), and SDG 7 (Affordable and Clean Energy). After deduplication and cleaning, the working set for those three goals contained 46,755 labeled rows representing 46,573 unique abstracts.

Each model evaluated whether an abstract made a substantive contribution to the indicated SDG. We then isolated four kinds of cases: documents both models labeled relevant, documents both labeled non-relevant, documents only LLaMA labeled relevant, and documents only Qwen labeled relevant. That gave us a way to study disagreement directly rather than treating it as an error term.

The analysis looked at disagreement from several angles. We measured agreement and Cohen's kappa, compared lexical patterns in the disagreement subsets with TF-IDF and permutation tests, simulated ranked retrieval over the ambiguous cases, and trained logistic regression classifiers to see whether one model's relevance choices could be predicted from lexical features.

### What We Found

Across the three SDGs, the models agreed on 83.6% of cases, but Cohen's kappa was only 0.467. That distinction matters. Raw agreement looked high partly because both models labeled many abstracts as relevant. Kappa showed that reliability was weaker once chance agreement and class imbalance were taken into account. The disagreement region, roughly 15-20% of decisions per SDG, was not a random residue. It was a structured set of borderline cases.

The lexical patterns made the model-specific behavior visible. For SDG 1, LLaMA tended to include documents using healthcare access language, such as health, care, insurance, and coverage, while Qwen more often included documents about structural inequality, wealth, income, and taxation. For SDG 3, LLaMA favored clinical and procedural terms, while Qwen surfaced more molecular and cellular language. For SDG 7, LLaMA leaned toward systems and infrastructure, while Qwen emphasized electrochemistry and battery-related terms. These patterns were statistically significant after false discovery rate correction.

The retrieval experiments showed why this matters operationally. Even when we used the same scoring function over the same disagreement pool, the top-ranked documents changed depending on which model had filtered the candidate set. In SDG 7, for example, LLaMA contributed 19 of the top 20 centroid-ranked disagreement documents, while Qwen contributed only one. The ranking logic was held constant; the difference came from the earlier relevance filter.

Finally, disagreement was learnable. Logistic regression classifiers trained on TF-IDF features could predict which model labeled a disagreement document as relevant with AUC scores above chance for all three goals: 0.739 for SDG 1, 0.753 for SDG 3, and 0.703 for SDG 7. That does not mean either model was "right." It means their differences were systematic enough to model.

### The Practical Lesson

The paper deliberately avoids treating LLM labels as ground truth. For subjective retrieval tasks, especially policy-relevant ones like SDG assessment, there may not be a single definitive label. A publication can contribute to a goal directly, indirectly, methodologically, or only under a particular interpretation of the target. In that setting, asking which model is correct is often less informative than asking what each model's choices do to the corpus.

That shift changes how we should evaluate LLM-assisted retrieval. If a model is used as a filter before ranking, summarization, dashboarding, or retrieval-augmented generation, its borderline decisions silently determine which evidence remains visible. A single-model pipeline may look clean from the outside while excluding alternative interpretations of relevance. Disagreement analysis gives us a way to surface those hidden choices.

For digital libraries, this suggests a more diagnostic approach to LLM evaluation. Instead of only measuring aggregate agreement or accepting consensus as sufficient, we can inspect the disagreement set: What topics does each model admit or exclude? Which disciplines are emphasized? Which terms mark the edge of relevance? Which documents disappear before ranking even begins?

### What Comes Next

This work points toward retrieval systems that treat disagreement as a design signal. Multi-model filtering, targeted human review of disagreement cases, and explanation-aware audits could help make LLM-mediated retrieval more transparent. Future work should also examine the justifications models produce, compare disagreement patterns across additional domains, and trace how filtering variability affects downstream outputs such as policy briefs or RAG-generated summaries.

The broader point is simple: when LLMs disagree, they may be telling us where the retrieval task itself is hardest. For digital libraries, those hard cases are worth studying.

The paper is available through IEEE with DOI [10.1109/JCDL67857.2025.00024](https://doi.org/10.1109/JCDL67857.2025.00024), and the project code is available on [GitHub](https://github.com/waingram/llm-sdg-disagreement).

[^1]: William A. Ingram, Bipasha Banerjee, and Edward A. Fox. 2025. Learning from LLM Disagreement in Retrieval Evaluation. In *2025 ACM/IEEE Joint Conference on Digital Libraries (JCDL)*. IEEE. [https://doi.org/10.1109/JCDL67857.2025.00024](https://doi.org/10.1109/JCDL67857.2025.00024)
