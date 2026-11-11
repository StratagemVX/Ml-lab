# Machine Learning Laboratory Portal (`Ml-lab`) — Python Programs 1 to 10

> Static web reference gallery serving 10 Python ML algorithm `.txt` files (`pgm1.txt`–`pgm10.txt`) with Prism.js syntax highlighting, one-click copy buttons, and drag-and-drop `.txt` preview support.

[![HTML5](https://img.shields.io/badge/HTML5-Static%20Site-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-NumPy%20%7C%20Pandas-F7931E.svg)](https://scikit-learn.org/)

---

## Executive Overview

**`Ml-lab`** provides an interactive browser viewer (`index.html`, `script.js`, `style.css`) for 10 VTU/college Machine Learning laboratory Python programs, allowing students to inspect syntax-highlighted code, copy snippets, or drop additional `.txt` files locally.

> **Quality & CI Status (`main` vs. Open Draft PR #2 — `maintenance/repository-quality-improvements`):**
> - **PR #2** adds `.gitignore`, static HTML/JS/asset verification (`tests/verify_site.mjs`), and `.github/workflows/quality.yml` (Node 20 verification passing in CI alongside local Python syntax checks across all 10 program files).

---

## Verified Program Index (`script.js` `bundledPrograms`)

| File | Topic | Focus |
|---|---|---|
| `pgm1.txt` | **Candidate-Elimination** | Learns specific and general hypotheses from training data |
| `pgm2.txt` | **A\* Search Algorithm** | Shortest-path search using heuristics and priority queue |
| `Pgm3.txt` | **Simple Linear Regression** | Least-squares linear regression prediction |
| `pgm4.txt` | **Decision Tree Classification** | Decision tree classifier construction & evaluation |
| `pgm5.txt` | **Back Propagation** | Neural network regression/prediction experiment |
| `pgm6.txt` | **Perceptron Learning** | Perceptron training on binary inputs |
| `pgm7.txt` | **Naive Bayes Classification** | Categorical feature classification |
| `pgm8.txt` | **Random Forest Classification** | Ensemble classifier trained on the Iris dataset |
| `pgm9.txt` | **K-Means & GMM Clustering** | Clustering model comparison with silhouette scores |
| `pgm10.txt` | **K-Nearest Neighbors** | Iris flower sample classification via nearest neighbors |

---

## Usage & Verification

Because `script.js` fetches `pgm1.txt`–`pgm10.txt` via `fetch()`, serve the repository over a local HTTP server rather than `file://`:

```bash
git clone https://github.com/StratagemVX/Ml-lab.git
cd Ml-lab

# Serve locally
python -m http.server 8000

# Verify static structure & asset links (PR #2)
node tests/verify_site.mjs
```

---

## Contributor Attribution

- **Curator:** Chethan Kumar B S (`StratagemVX`) — *Archived prototype `StratagemVX/mvjlab` points here as canonical*
- **GitHub:** [https://github.com/StratagemVX](https://github.com/StratagemVX)
- **Portfolio:** [https://chethan-kumar-portfolio.vercel.app/](https://chethan-kumar-portfolio.vercel.app/)
