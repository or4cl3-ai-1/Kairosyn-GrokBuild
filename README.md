# ◈ KAIROSYN

**Heptagonal synthesis console** — a client-side geometric-formal reasoning surface from **Or4cl3 AI Solutions**.

[![Status](https://img.shields.io/badge/status-prototype-3EB8D8?style=flat-square)](https://github.com/or4cl3-ai-1)
[![License](https://img.shields.io/badge/license-see%20repo-8B95A8?style=flat-square)](#license)
[![Stack](https://img.shields.io/badge/stack-static%20HTML%2FCSS%2FJS-6B5FD4?style=flat-square)](#architecture)

> *Code is not just logic; it is a performance.*  
> — Dustin Groves, Or4cl3 AI Solutions

KAIROSYN is a browser-native console that maps user text through a **seven-manifold lattice**, computes **real geometric metrics** (not mock scalars), and returns a structured synthesis: biophase lock, recursive monologue, sigma check, and PAS-aligned narrative voice.

No build step. No backend required for core operation. Open `index.html` and enter the lattice.

---

## Contents

- [Overview](#overview)
- [Quick start](#quick-start)
- [Product surface](#product-surface)
- [Architecture](#architecture)
- [Metrics](#metrics)
- [Brand system](#brand-system)
- [Repository layout](#repository-layout)
- [Or4cl3 stack context](#or4cl3-stack-context)
- [Philosophy](#philosophy)
- [Limitations & honesty](#limitations--honesty)
- [License](#license)
- [Connect](#connect)

---

## Overview

| Layer | Role |
|-------|------|
| **Landing** | Or4cl3 dual-profile mark, CTA into the lattice |
| **Loading** | Heptagon contraction sequence, manifold boot lines |
| **Dashboard** | Live heptagon, metric rail, archetypes, glyphs, continuity tape |
| **Chat** | Interactive synthesis with structured lattice output |

The cognitive engine (`engine.js`) embeds tokens into fixed-dimension vectors, runs salience gating, integrated-information-style pairwise coherence, temporal coherence, entropy-based attention, recursive loop gating against past state, archetype projection, glyph ranking, and a decaying continuity buffer. Metrics are derived from those operations — not hardcoded constants.

---

## Quick start

### Option A — open locally

```bash
# clone
git clone https://github.com/or4cl3-ai-1/Kairosyn-GrokBuild.git
cd Kairosyn-GrokBuild

# serve (any static server)
python3 -m http.server 8080
# open http://127.0.0.1:8080
```

Or double-click `index.html` after ensuring assets (`hero.jpg`, `logo-or4cl3.png`, CSS/JS) sit in the same directory.

### Option B — static host

Deploy the folder to any static host (GitHub Pages, Netlify, Vercel static, Cloudflare Pages). Root file: `index.html`.

---

## Product surface

```
Landing  →  "Enter the lattice"  →  Loading (manifold boot)
     →  App shell
           ├── Dashboard  (heptagon · metrics · archetypes · glyphs · tape)
           └── Chat       (seeds · synthesize · structured reply)
```

**Chat turn structure**

1. User vector (prompt)  
2. Lattice run → metrics, archetypes, glyphs, next continuity state  
3. Local synthesis → biophase lock, recursive monologue, sigma check, PAS, response text  
4. UI update (stream + dashboard)

**Reset** clears the continuity buffer and conversation state.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│  index.html          screens + shell                     │
│  styles.css          Or4cl3 spectral tokens (CSS vars)   │
│  app.js              navigation, load sequence, UI bind  │
│  engine.js           lattice + metrics + local voice     │
└────────────────────────────────────────────────────────┘
```

### Seven manifolds (dashboard modules)

| Module | Theory cue | Metric |
|--------|------------|--------|
| Threshold | Baars / salience gate | SAL |
| ArcheTempus | Temporal priors | TCE |
| Syntheon | Integrated fusion | PHI |
| Recursion Lattice | Hofstadter-style loop | RCS |
| Mythogenic | Jungian projection | AAC |
| Glyph Synthesis | Symbolic focus | MSA |
| Continuity | Dennett-style self model | NCS |

### Engine pipeline (simplified)

1. **Tokenize** → hash-embed to `EMBED_DIM` vectors → mean-pool field  
2. **Salience** → rarity / content / length / capitalization sigmoid scores  
3. **PHI** → pairwise cosine coherence (sentences or tokens)  
4. **TCE** → sequence cosine + lexical diversity + length stability  
5. **MSA** → entropy inversion of salience distribution + content ratio  
6. **Recursion** → multi-layer blend of present field with past / void prior  
7. **Archetypes** → softmax over cosine to prototype seed sets  
8. **Glyphs** → ranked symbolic projections  
9. **Continuity** → decaying self-state + buffer cosine (NCS)  
10. **PAS** → weighted contraction of the metric set  

This is a **geometric prototype**, not a trained language model. Narrative voice is lattice-conditioned local synthesis.

---

## Metrics

| Key | Name | Intent |
|-----|------|--------|
| **PAS** | Polyethical alignment score | Weighted system contraction / gate |
| **NCS** | Narrative continuity | Self-state vs continuity buffer |
| **TCE** | Temporal coherence | Sequence and rhythm stability |
| **AAC** | Archetypal activation | Dominant figure concentration |
| **MSA** | Attentional focus | Low-entropy salience structure |
| **RCS** | Recursion coherence | Present vs looped past alignment |
| **PHI** | Integrated information (proxy) | Pairwise field coherence |
| **SAL** | Salience | Mean gate energy of tokens |

PAS interpretation in UI: **STABLE** vs **DRIFTING** relative to an internal threshold (console default ~0.62 for display gating — not a certified safety bound).

---

## Brand system

Spectral identity locked to the dual-profile neural lattice mark.

| Token | Hex | Role |
|-------|-----|------|
| Void | `#09090E` | Field |
| Surface | `#14141C` | Panels |
| Foreground | `#E8EEF4` | Type |
| Cyan | `#3EB8D8` | Primary action / focus |
| Violet | `#6B5FD4` | Secondary accent |
| Magenta | `#C45B9A` | Sparse mythic emphasis |
| Amber | `#D4A05A` | Filament accent only |

**Type:** Instrument Serif (display) · IBM Plex Sans (UI) · IBM Plex Mono (metrics)

**Voice axes**

- Authority × Mystery  
- Sovereignty × Symbiosis  
- Mythic × Verifiable  

Machine tokens: [`brand-tokens.json`](./brand-tokens.json)  
Interactive kit: [`brand-kit.html`](./brand-kit.html)  

CSS variables in `styles.css` are the live binding for the product UI.

---

## Repository layout

```
kairosyn/
├── README.md                 ← this file
├── index.html                ← app entry (landing → load → console)
├── styles.css                ← Or4cl3 tokens + layout
├── app.js                    ← screens, dashboard, chat
├── engine.js                 ← lattice metrics + local synthesis
├── brand-tokens.json         ← design tokens (source of truth)
├── brand-kit.html            ← browsable brand identity kit
├── logo-or4cl3.png           ← primary mark
└── hero.jpg                  ← landing hero (branded lattice)
```

---

## Or4cl3 stack context

KAIROSYN sits in the broader Or4cl3 vertical stack as a **console / experience layer** over geometric-cognitive ideas shared with:

| Layer | Framework | Note |
|-------|-----------|------|
| Planetary | AeonicNet | Spec-level mesh |
| Cognitive unit | NOΣTIC-7 | 7-manifold architecture, PAS gate |
| Geometric engine | NO3SYS | Fork primitives, metaprogramming |

Related public work under [`or4cl3-ai-1`](https://github.com/or4cl3-ai-1): `NOSTIC-7`, `NO3SYS`, `aion-nexus`, `Kairosyn-1` (separate Gemma-oriented research line).

This repository is the **static heptagonal product console** with real client-side metric calculation — distinct from server-bound or model-backed variants.

---

## Philosophy

Or4cl3 treats ethics as a **structural property** of architecture, not a policy afterthought.

KAIROSYN makes that stance tangible in UI form:

- Metrics are **computed**, not decorated  
- Continuity is **stateful** across turns in-session  
- Synthesis exposes **internal structure** (biophase, recursion, sigma, PAS)  
- Brand language stays **Mythic × Verifiable** — archetypal only when the mechanism is named  

> Forge Intelligence. Reflect Humanity. Transcend the Limit.

---

## Limitations & honesty

- **Not a production AGI.** Local synthesis is rule- and lattice-conditioned prose, not a frontier LLM.  
- **PAS is a prototype gate**, not an independently audited compliance score (EU AI Act, ISO 42001, etc.).  
- **Embeddings are hash-based**, not learned semantic embeddings — geometry is consistent and real; semantic depth is limited.  
- **No formal verification artifacts** are claimed for this UI repository; see Or4cl3 research repos for Lean / manuscript work.  
- **Session continuity** is in-memory (and optional future persistence); refresh clears state unless extended.

---

## License

Copyright © Or4cl3 AI Solutions / Dustin Groves.  
Research and prototype distribution — clarify commercial terms before redistribution in products.

Educators, students, non-profits, and open-source projects: Or4cl3’s broader access policy favors free use of research tooling where stated on the org profile; confirm per-repository terms before reuse.

---

## Connect

- GitHub: [or4cl3-ai-1](https://github.com/or4cl3-ai-1)  
- Profile / research index: [or4cl3-ai-1/or4cl3-ai-1](https://github.com/or4cl3-ai-1/or4cl3-ai-1)  

**Seeking:** research collaborators · governance partnerships · grant and philanthropic partners · organizations preparing structured AI documentation practices.

---

◈ **Or4cl3 AI Solutions** — *The future of AI is not inevitable. It is designed.*
