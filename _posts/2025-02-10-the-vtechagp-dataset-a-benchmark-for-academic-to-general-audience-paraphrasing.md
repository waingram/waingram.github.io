---
layout: default
title: 'The VTechAGP Dataset: A Benchmark for Academic-to-General-Audience Paraphrasing'
date: 2025-02-10 15:58 -0500
---
I recently collaborated with [Ming Cheng](https://github.com/SIGSEGV-0x7) and 
[Jiaying Gong](https://sites.google.com/vt.edu/jiaying-gong/home), two members of
the [Machine Learning Laboratory](https://people.cs.vt.edu/hdardiry/lab/) research team
led by [Dr. Hoda Eldardiry](https://people.cs.vt.edu/~hdardiry/). We created
the VTechAGP dataset to support research on text simplification and paraphrase
generation.

### Motivation

Non-specialists often struggle with academic writing due to its
discipline-specific jargon and rigid conventions. Text simplification
research seeks to mitigate this challenge by reducing linguistic
complexity, primarily through lexical and syntactic modifications.
Existing datasets are restricted to sentence-level transformations and lack
coverage across multiple domains, limiting their utility for broader
applications. While domain-specific datasets, such as those in medicine
and law, provide targeted resources, they do not support general-purpose
simplification across disciplines. For a comparison of existing text simplification and paraphrase datasets, see Table 5 in the appendix of Cheng et al. (2024).[^1] 

### Institutional Context and Rationale

To address the lack of broadly applicable, document-level datasets, we propose VTechAGP,[^2] which provides a parallel corpus that pairs full academic abstracts with their general-audience counterparts. These pairs were collected
from [VTechWorks](https://vtechworks.lib.vt.edu/), Virginia Tech’s
institutional repository, which includes Electronic Theses and
Dissertations (ETDs) along with other scholarly materials. The [Graduate
School’s ETD policies](https://guides.lib.vt.edu/ETDguide) require
students to submit both a traditional academic abstract and a
general-audience abstract as part of their thesis or dissertation.
Because these abstracts are written for distinct audiences but
correspond to the same work, they provide a basis for analyzing
differences in lexical complexity, syntactic variation, and semantic
focus between academic and general-audience writing. By capturing these
distinctions at the document level, the dataset serves as a resource for
research in text simplification and domain adaptation in NLP. 

### Dataset Construction

To build the dataset, I collected academic and general audience abstracts from [VTechWorks](https://vtechworks.lib.vt.edu/), using the [Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH)](https://www.openarchives.org/OAI/openarchivesprotocol.html). Each record includes:

- A traditional academic abstract.
- A corresponding general audience abstract.
- Metadata such as title, discipline, department, and degree information.

The dataset consists of paired academic and general-audience abstracts, allowing for document-level analysis of structural and linguistic differences. This enables potential applications in NLP for document-level paraphrasing and retrieval-based reformulation tasks.

[^1]: Ming Cheng, Jiaying Gong, Chenhan Yuan, William A. Ingram, Edward A. Fox, and Hoda Eldardiry. 2024. VTechAGP: An Academic-to-General-Audience Text Paraphrase Dataset and Benchmark Models. arXiv:2411.04825. [https://doi.org/10.48550/arXiv.2411.04825](https://doi.org/10.48550/arXiv.2411.04825)

[^2]: The VTechAGP dataset is publicly available via [Zenodo (DOI: 10.5281/zenodo.14833933)](https://doi.org/10.5281/zenodo.14833933) and [GitHub](https://github.com/waingram/VTechAGP-Dataset), distributed under the Open Data Commons Attribution License (ODC-By).