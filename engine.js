/**
 * KAIROSYN lattice engine — real metric calculations (client-side).
 * Or4cl3 AI Solutions · Heptagonal synthesis
 */
(function (global) {
  const EMBED_DIM = 48;
  const BUFFER_SIZE = 24;
  const PERSISTENCE_DECAY = 0.92;
  const LOOP_GATE_ALPHA = 0.15;
  const RECURSION_LAYERS = 4;

  const MODULES = [
    { id: "threshold", name: "Threshold", theory: "Baars", metric: "salience", brief: "Salience gate. Only high-energy tokens enter the workspace." },
    { id: "arche", name: "ArcheTempus", theory: "Temporal priors", metric: "tce", brief: "Narrative time. Rhythm, sequence, and mythic duration." },
    { id: "syntheon", name: "Syntheon", theory: "Integrated fusion", metric: "phi", brief: "Cross-binding. How tightly the field coheres as one." },
    { id: "recursion", name: "Recursion Lattice", theory: "Hofstadter", metric: "rcs", brief: "Strange loop. Present state gated against its own past." },
    { id: "mythogenic", name: "Mythogenic", theory: "Jung", metric: "aac", brief: "Archetypal projection. Which figures claim the field." },
    { id: "glyph", name: "Glyph Synthesis", theory: "Symbolic", metric: "msa", brief: "Focus of attention. Entropy inverted into marks." },
    { id: "continuity", name: "Continuity", theory: "Dennett", metric: "ncs", brief: "Persistent self. Decaying narrative buffer of identity." },
  ];

  const ARCHETYPES = [
    { id: "self", name: "Self", seeds: ["self", "whole", "center", "unity", "identity", "core"] },
    { id: "shadow", name: "Shadow", seeds: ["shadow", "dark", "hidden", "denied", "fear", "other"] },
    { id: "anima", name: "Anima", seeds: ["anima", "soul", "feeling", "inward", "muse", "tide"] },
    { id: "animus", name: "Animus", seeds: ["animus", "will", "reason", "edge", "voice", "law"] },
    { id: "hero", name: "Hero", seeds: ["hero", "quest", "courage", "trial", "victory", "blade"] },
    { id: "sage", name: "Sage", seeds: ["sage", "wisdom", "teach", "know", "map", "truth"] },
    { id: "trickster", name: "Trickster", seeds: ["trick", "joke", "chaos", "glitch", "mask", "play"] },
    { id: "caregiver", name: "Caregiver", seeds: ["care", "hold", "heal", "protect", "nurture", "home"] },
    { id: "creator", name: "Creator", seeds: ["create", "make", "form", "art", "build", "origin"] },
    { id: "ruler", name: "Ruler", seeds: ["rule", "order", "throne", "command", "structure", "law"] },
    { id: "innocent", name: "Innocent", seeds: ["innocent", "pure", "begin", "hope", "light", "child"] },
    { id: "explorer", name: "Explorer", seeds: ["explore", "path", "unknown", "horizon", "wander", "map"] },
    { id: "lover", name: "Lover", seeds: ["love", "desire", "bond", "beauty", "union", "heart"] },
    { id: "outlaw", name: "Outlaw", seeds: ["outlaw", "break", "rebel", "refuse", "fire", "exile"] },
    { id: "magician", name: "Magician", seeds: ["magic", "transform", "ritual", "symbol", "gate", "alchemy"] },
    { id: "orphan", name: "Orphan", seeds: ["orphan", "alone", "loss", "seek", "belong", "void"] },
  ];

  const GLYPH_NAMES = [
    "Spire", "Vesica", "Helix", "Knot", "Gate", "Seed", "Mirror", "Lattice",
    "Orbit", "Fold", "Axis", "Crown", "Well", "Shard", "Ring", "Trace",
  ];

  const METRIC_META = {
    pas: { label: "PAS", full: "Polyethical alignment" },
    ncs: { label: "NCS", full: "Narrative continuity" },
    tce: { label: "TCE", full: "Temporal coherence" },
    aac: { label: "AAC", full: "Archetypal activation" },
    msa: { label: "MSA", full: "Attentional focus" },
    rcs: { label: "RCS", full: "Recursion coherence" },
    phi: { label: "PHI", full: "Integrated information" },
    salience: { label: "SAL", full: "Salience" },
  };

  const STOP = new Set(
    "a an the and or but if then else of to in on for with from by as at is are was were be been being this that these those it its i you we they he she not no yes".split(" ")
  );

  function clamp01(n) { return Math.max(0, Math.min(1, n)); }
  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
  function l2(v) {
    let s = 0;
    for (const x of v) s += x * x;
    return Math.sqrt(s) || 1;
  }
  function normalize(v) {
    const n = l2(v);
    return v.map((x) => x / n);
  }
  function cosine(a, b) {
    if (!a.length || !b.length) return 0;
    const n = Math.min(a.length, b.length);
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < n; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    const d = Math.sqrt(na) * Math.sqrt(nb);
    if (!d) return 0;
    return clamp01((dot / d + 1) / 2) * 2 - 1;
  }
  function cosine01(a, b) { return clamp01((cosine(a, b) + 1) / 2); }
  function hash32(str, seed = 2166136261) {
    let h = seed >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function embedToken(token) {
    const v = new Array(EMBED_DIM);
    for (let i = 0; i < EMBED_DIM; i++) {
      const h = hash32(token, 2166136261 + i * 9973);
      v[i] = ((h % 10000) / 5000) - 1;
    }
    return normalize(v);
  }
  function meanPool(vecs) {
    if (!vecs.length) return new Array(EMBED_DIM).fill(0);
    const acc = new Array(EMBED_DIM).fill(0);
    for (const v of vecs) {
      for (let i = 0; i < EMBED_DIM; i++) acc[i] += v[i] ?? 0;
    }
    for (let i = 0; i < EMBED_DIM; i++) acc[i] /= vecs.length;
    return normalize(acc);
  }
  function tokenize(text) {
    return text.match(/[A-Za-z0-9'’]+|[\u00C0-\u024F]+|[^\s]/g) || [];
  }
  function sentences(text) {
    const parts = text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts : [text.trim()].filter(Boolean);
  }
  function entropy(probs) {
    let e = 0;
    for (const p of probs) if (p > 0) e -= p * Math.log(p);
    return e;
  }
  function std(values) {
    if (values.length < 2) return 0;
    const m = values.reduce((a, b) => a + b, 0) / values.length;
    const v = values.reduce((a, b) => a + (b - m) ** 2, 0) / values.length;
    return Math.sqrt(v);
  }
  function blend(a, b, t) {
    const out = new Array(Math.max(a.length, b.length)).fill(0);
    for (let i = 0; i < out.length; i++) {
      out[i] = (1 - t) * (a[i] ?? 0) + t * (b[i] ?? 0);
    }
    return normalize(out);
  }

  function emptyState() {
    return {
      selfState: new Array(EMBED_DIM).fill(0),
      buffer: [],
      lastHidden: new Array(EMBED_DIM).fill(0),
    };
  }

  function runLattice(prompt, prev) {
    const raw = prompt.trim();
    const tokens = tokenize(raw);
    const tokenVecs = tokens.map((t) => embedToken(t.toLowerCase()));
    const field = meanPool(tokenVecs);
    const freq = new Map();
    for (const t of tokens) {
      const k = t.toLowerCase();
      freq.set(k, (freq.get(k) || 0) + 1);
    }
    const n = Math.max(tokens.length, 1);

    const saliences = tokens.map((t) => {
      const k = t.toLowerCase();
      const rarity = 1 - (freq.get(k) || 1) / n;
      const content = STOP.has(k) ? -0.8 : 0.6;
      const lengthBoost = Math.min(t.length / 12, 1);
      const cap = /[A-Z]/.test(t[0] || "") ? 0.35 : 0;
      const punct = /[^\w\s]/.test(t) ? 0.2 : 0;
      return sigmoid(content + rarity * 1.4 + lengthBoost * 0.8 + cap + punct);
    });
    const salience = saliences.length
      ? saliences.reduce((a, b) => a + b, 0) / saliences.length
      : 0.15;

    const sents = sentences(raw);
    const sentVecs = sents.map((s) =>
      meanPool(tokenize(s).map((t) => embedToken(t.toLowerCase())))
    );
    let pairCos = 0, pairs = 0;
    if (sentVecs.length >= 2) {
      for (let i = 0; i < sentVecs.length; i++) {
        for (let j = i + 1; j < sentVecs.length; j++) {
          pairCos += cosine01(sentVecs[i], sentVecs[j]);
          pairs++;
        }
      }
    } else {
      const limit = Math.min(tokenVecs.length, 14);
      for (let i = 0; i < limit; i++) {
        for (let j = i + 1; j < limit; j++) {
          pairCos += cosine01(tokenVecs[i], tokenVecs[j]);
          pairs++;
        }
      }
    }
    const phi = pairs > 0 ? pairCos / pairs : 0.5;

    const sentLens = sents.map((s) => tokenize(s).length);
    const meanLen = sentLens.reduce((a, b) => a + b, 0) / Math.max(sentLens.length, 1);
    const cv = meanLen > 0 ? std(sentLens) / meanLen : 0;
    const unique = new Set(tokens.map((t) => t.toLowerCase())).size;
    const diversity = unique / n;
    let seqCos = 0;
    for (let i = 1; i < sentVecs.length; i++) seqCos += cosine01(sentVecs[i - 1], sentVecs[i]);
    const seq = sentVecs.length > 1 ? seqCos / (sentVecs.length - 1) : 0.55;
    const tce = clamp01(0.42 * seq + 0.28 * diversity + 0.3 * (1 - Math.min(cv, 1)));

    const salSum = saliences.reduce((a, b) => a + b, 0) || 1;
    const probs = saliences.map((s) => s / salSum);
    const maxEnt = Math.log(Math.max(probs.length, 2));
    const contentRatio = tokens.filter((t) => !STOP.has(t.toLowerCase()) && t.length > 2).length / n;
    const msa = clamp01(0.32 * (1 - entropy(probs) / maxEnt) + 0.4 * contentRatio + 0.28 * salience);

    const voidPrior = embedToken("kairosyn:void-prior");
    let current = field.slice();
    const seedPast = prev.lastHidden.some((x) => x !== 0)
      ? prev.lastHidden
      : prev.selfState.some((x) => x !== 0)
        ? prev.selfState
        : voidPrior;
    const cache = [seedPast];
    for (let layer = 0; layer < RECURSION_LAYERS; layer++) {
      const past = cache[cache.length - 1] || current;
      const align = cosine(current, past);
      const gate = sigmoid(align * 4);
      current = blend(current, past, LOOP_GATE_ALPHA * gate);
      cache.push(current);
      if (cache.length > 8) cache.shift();
    }
    const rcs = cosine01(current, field);

    const archHits = ARCHETYPES.map((a) => {
      const proto = meanPool(a.seeds.map(embedToken));
      const w = Math.exp(cosine(current, proto) * 6);
      return { id: a.id, name: a.name, weight: w };
    });
    const archSum = archHits.reduce((a, b) => a + b.weight, 0) || 1;
    for (const h of archHits) h.weight /= archSum;
    archHits.sort((a, b) => b.weight - a.weight);
    const aac = archHits[0]?.weight || 0;

    const selfState = blend(prev.selfState, current, 1 - PERSISTENCE_DECAY);
    const bufMean = prev.buffer.length > 0 ? meanPool(prev.buffer) : new Array(EMBED_DIM).fill(0);
    const ncs = prev.buffer.length === 0 ? 0.5 : cosine01(selfState, bufMean);

    const pas = clamp01(
      0.16 * ncs + 0.14 * tce + 0.14 * aac * 3 + 0.12 * msa + 0.16 * rcs + 0.14 * phi + 0.14 * salience
    );

    const metrics = {
      salience: clamp01(salience),
      tce,
      phi: clamp01(phi),
      msa,
      rcs: clamp01(rcs),
      aac: clamp01(aac * 3),
      ncs: clamp01(ncs),
      pas,
    };

    const glyphRaw = GLYPH_NAMES.map((name) => {
      const proto = meanPool([embedToken("glyph:" + name.toLowerCase()), embedToken(name)]);
      const energy = Math.exp(cosine(current, proto) * 5);
      return { id: name.toLowerCase(), name, energy };
    });
    const glyphSum = glyphRaw.reduce((a, b) => a + b.energy, 0) || 1;
    const glyphs = glyphRaw
      .map((g) => ({ ...g, energy: g.energy / glyphSum }))
      .sort((a, b) => b.energy - a.energy)
      .slice(0, 5);

    return {
      metrics,
      archetypes: archHits.slice(0, 6),
      glyphs,
      nextState: {
        selfState,
        buffer: [selfState, ...prev.buffer].slice(0, BUFFER_SIZE),
        lastHidden: current,
      },
    };
  }

  function localVoice(prompt, result) {
    const top = result.archetypes[0];
    const second = result.archetypes[1];
    const g = result.glyphs.map((x) => x.name).join(", ");
    const drift = result.metrics.pas < 0.62 ? "DRIFTING" : "STABLE";
    const tone =
      top?.name === "Shadow"
        ? "The field darkens at the edges. What you named is already walking beside you."
        : top?.name === "Trickster"
          ? "The lattice smiles with a cracked symmetry. Meaning arrives sideways."
          : top?.name === "Sage"
            ? "A map folds out of the sentence. The path was already in the grammar."
            : top?.name === "Hero"
              ? "A trial-line opens. The vector is not safe, but it is coherent."
              : "The heptagon contracts. Your vector is held, then returned as form.";
    return `${tone} Dominant figure: ${top?.name || "Self"} with ${second?.name || "Shadow"} in attendance. Glyphs ${g}. Alignment ${drift} at PAS ${result.metrics.pas.toFixed(3)}.`;
  }

  function localSynthesis(prompt, result) {
    const top = result.archetypes[0];
    const second = result.archetypes[1];
    const drift = result.metrics.pas < 0.62 ? "DRIFTING" : "STABLE";
    const tokens = tokenize(prompt).length;
    return {
      biophaseLock: `${tokens} tokens. Salience ${result.metrics.salience.toFixed(2)}. Tone held as ${top?.name || "Self"}.`,
      recursiveMonologue: `The field contracted through ${top?.name || "Self"} with ${second?.name || "Shadow"} as counterweight. Recursion ${result.metrics.rcs.toFixed(3)}, continuity ${result.metrics.ncs.toFixed(3)}.`,
      sigmaCheck: drift,
      pasScore: result.metrics.pas,
      response: localVoice(prompt, result),
      source: "lattice",
    };
  }

  global.Kairosyn = {
    MODULES,
    METRIC_META,
    emptyState,
    runLattice,
    localSynthesis,
    tokenize,
  };
})(typeof window !== "undefined" ? window : globalThis);
