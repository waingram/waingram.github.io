---
layout: default
title: 'Learning from LLM Disagreement in Retrieval Evaluation'
date: 2025-12-19 12:00 -0500
categories: AI, Digital Libraries, Information Retrieval, SDGs, JCDL
---
Our [JCDL 2025](https://2025.jcdl.org/) paper with [Bipasha Banerjee](https://bipasha-banerjee.github.io/) and [Edward A. Fox](https://fox.cs.vt.edu/) examines how model disagreement changes retrieval evaluation when large language models filter scholarly records before ranking. "Learning from LLM Disagreement in Retrieval Evaluation" shows that disagreement between relevance labelers can identify cases near the boundary of an information need. In thematic retrieval tasks, particularly ones involving [Sustainable Development Goals (SDGs)](https://sdgs.un.org/goals), those boundary cases determine which records remain available to a dashboard, bibliography, or downstream synthesis.[^1]

Universities and research organizations use bibliographic databases and digital library systems to describe how research contributes to strategic priorities. SDG mapping illustrates the retrieval problem. A university may want to know which publications support affordable clean energy, good health and well-being, or poverty reduction. Existing workflows often begin with Boolean search queries, including the SDG query sets used in [Scopus](https://www.scopus.com/) and related bibliometric tools.

Boolean queries retrieve documents that contain the selected terms, but they do not determine whether a document makes a substantive contribution to the goal. A paper may mention "energy," "poverty," or "health" without advancing an SDG target. LLMs therefore enter these workflows as post-retrieval filters, reading abstracts and assigning semantic relevance labels after keyword retrieval has produced a candidate set.

Semantic relevance judgment is not a stable measuring instrument. In our study, two locally hosted open-weight models, [LLaMA 3.1-8B](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) and [Qwen 2.5-7B](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct), labeled the same abstract-SDG pairs as relevant or non-relevant using the same structured prompt. The models often agreed, but their disagreements occurred in the ambiguous middle, where the relation between a publication and an SDG was plausible but not obvious.

We built a corpus from [Elsevier's 2023 SDG-aligned Boolean queries](https://elsevier.digitalcommonsdata.com/datasets/y2zyy9vwzy/1), retrieved up to 20,000 Scopus records for each of the 17 SDGs, and cleaned the resulting metadata. The experiments focused on three goals that occupy different regions of the SDG co-occurrence structure. SDG 1 (No Poverty) clusters with social and governance goals, SDG 3 (Good Health and Well-Being) represents the health domain, and SDG 7 (Affordable and Clean Energy) anchors the technical and environmental cluster. After deduplication and cleaning, the working set for those three goals contained 46,755 labeled rows representing 46,573 unique abstracts.

Each model evaluated whether an abstract made a substantive contribution to the indicated SDG. We then isolated four kinds of cases: documents both models labeled relevant, documents both labeled non-relevant, documents only LLaMA labeled relevant, and documents only Qwen labeled relevant. This partition made disagreement the object of analysis rather than a residual error category.

The analysis measured agreement and Cohen's kappa, compared lexical patterns in the disagreement subsets with TF-IDF and permutation tests, simulated ranked retrieval over the ambiguous cases, and trained logistic regression classifiers to test whether lexical features predicted which model assigned relevance.

Across the three SDGs, the models assigned the same label in 83.6% of cases, but Cohen's kappa was only 0.467. Raw agreement overstated reliability because both models labeled many abstracts as relevant. Kappa showed weaker reliability once chance agreement and class imbalance were taken into account. The disagreement region, roughly 15-20% of decisions per SDG, was a structured set of borderline cases rather than a random residue.

<figure class="paper-figure">
  <img src="{{ '/img/blog/llm-agreement-breakdown.png' | relative_url }}" alt="Stacked bar chart showing both non-relevant labels, both relevant labels, and model disagreement for SDG 1, SDG 3, and SDG 7, with kappa values of 0.51, 0.40, and 0.43.">
  <figcaption>Agreement between LLaMA and Qwen was concentrated in shared relevant labels, which explains why raw agreement and Cohen's kappa diverged across SDGs.</figcaption>
</figure>

We ran a negative control to test whether the shared relevant labels reflected a general tendency to include documents. Applying the SDG 7 energy prompt to abstracts retrieved by the SDG 1 poverty query produced 91% agreement, with Cohen's kappa of 0.59. The models jointly assigned non-relevance to 84% of cases, jointly assigned relevance to 7%, and disagreed on 8%. The main experiment therefore cannot be reduced to affirmative-label bias; the models converged on rejection when the prompt and candidate set described conceptually distant SDGs.

Lexical analysis identified model-specific relevance criteria. For SDG 1, LLaMA assigned relevance more often to documents using healthcare access terms such as health, care, insurance, and coverage, while Qwen assigned relevance more often to documents using terms associated with structural inequality, wealth, income, and taxation. For SDG 3, LLaMA assigned relevance more often to clinical and procedural terms, while Qwen assigned relevance more often to molecular and cellular terms. For SDG 7, LLaMA assigned relevance more often to systems and infrastructure terms, while Qwen assigned relevance more often to electrochemistry and battery terms. The FDR-adjusted p-values for the reported terms were below 0.001.

<figure class="paper-table">
  <figcaption>Top differentiating terms between LLaMA-relevant and Qwen-relevant documents in the disagreement subsets. Positive values indicate terms with higher mean TF-IDF in LLaMA-relevant documents; negative values indicate terms with higher mean TF-IDF in Qwen-relevant documents.</figcaption>
  <div class="paper-table-scroll" role="region" aria-label="Top differentiating terms by SDG" tabindex="0">
    <table>
      <thead>
        <tr>
          <th scope="col">SDG</th>
          <th scope="col">LLaMA-relevant terms</th>
          <th scope="col">Qwen-relevant terms</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">SDG 1<br><span>No Poverty</span></th>
          <td>health (+0.019), care (+0.014), insurance (+0.013), covid (+0.010), coverage (+0.010)</td>
          <td>inequality (-0.020), wealth (-0.012), income (-0.009), tax (-0.008), political (-0.005)</td>
        </tr>
        <tr>
          <th scope="row">SDG 3<br><span>Health</span></th>
          <td>patients (+0.023), risk (+0.007), tavr (+0.007), stroke (+0.006), coronary (+0.006)</td>
          <td>cells (-0.019), cancer (-0.018), cell (-0.017), tumor (-0.015), human (-0.007)</td>
        </tr>
        <tr>
          <th scope="row">SDG 7<br><span>Energy</span></th>
          <td>fuel (+0.006), computing (+0.006), neural (+0.004), plasma (+0.004), network (+0.005)</td>
          <td>lithium (-0.018), capacity (-0.018), ion (-0.016), batteries (-0.016), anode (-0.015)</td>
        </tr>
      </tbody>
    </table>
  </div>
</figure>

The retrieval experiments show a direct consequence for ranked output. Under a fixed scoring function applied to the same disagreement pool, the top-ranked documents changed according to the model that filtered the candidate set. In SDG 7, the LLaMA-relevant subset contained 19 of the top 20 centroid-ranked disagreement documents, while the Qwen-relevant subset contained one. The ranking logic was held constant, so the difference came from the earlier relevance filter.

A separate classification experiment showed that disagreement was learnable from lexical features. Logistic regression classifiers trained on TF-IDF features predicted which model labeled a disagreement document as relevant with AUC scores above chance for all three goals. The AUC was 0.739 for SDG 1, 0.753 for SDG 3, and 0.703 for SDG 7. These results do not identify either model as correct. They show that the models used different, learnable lexical criteria when assigning relevance.

The paper does not use LLM labels as ground truth. For subjective retrieval tasks, including policy-relevant tasks such as SDG assessment, a single definitive label may not exist. A publication can contribute to a goal directly, indirectly, methodologically, or under a particular interpretation of the target. In that setting, the better evaluation question is how each model changes the corpus available for ranking and synthesis.

A single LLM filter cannot be described as neutral preprocessing in SDG retrieval. It determines document eligibility before ranking begins and can remove alternative interpretations of relevance from the result set. A dashboard, literature review, or retrieval-augmented generation workflow built on a filtered corpus inherits those exclusions.

Digital library systems that use LLM filtering should report and inspect disagreement sets rather than relying on aggregate agreement. Audits should identify which topics each model admits or excludes, which disciplines gain or lose representation, which lexical cues mark the edge of relevance, and which documents disappear before ranking begins.

Retrieval workflows should expose model disagreement before downstream synthesis. Multi-model filtering, human review of disagreement cases, and audits of model justifications can locate where model-specific criteria enter the retrieval process. Extending the analysis to additional models, domains, and RAG-based policy briefs would measure how filtering variability changes the substantive content of generated outputs.

When LLMs disagree in thematic retrieval, the disagreement identifies the documents most sensitive to the definition of relevance. Those documents require analysis before the filtered corpus is used for institutional reporting or evidence synthesis.

The paper is available through IEEE with DOI [10.1109/JCDL67857.2025.00024](https://doi.org/10.1109/JCDL67857.2025.00024), and the project code is available on [GitHub](https://github.com/waingram/llm-sdg-disagreement).

[^1]: William A. Ingram, Bipasha Banerjee, and Edward A. Fox. 2025. Learning from LLM Disagreement in Retrieval Evaluation. In *2025 ACM/IEEE Joint Conference on Digital Libraries (JCDL)*. IEEE. [https://doi.org/10.1109/JCDL67857.2025.00024](https://doi.org/10.1109/JCDL67857.2025.00024)
