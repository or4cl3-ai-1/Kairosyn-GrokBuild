(function () {
  const SEEDS = [
    "What persists when the loop looks at itself?",
    "Map the shadow of a decision I have not made.",
    "Hold this sentence until it becomes a glyph.",
    "If time is a prior, where does the story begin?",
  ];

  const LOAD_LINES = [
    "Threshold interface online\u2026",
    "ArcheTempus priors loading\u2026",
    "Syntheon fusion binding\u2026",
    "Recursion lattice spinning\u2026",
    "Mythogenic bank active\u2026",
    "Glyph synthesis ready\u2026",
    "Continuity buffer warm\u2026",
    "PAS gate calibrated\u2026",
  ];

  const state = {
    engine: Kairosyn.emptyState(),
    turns: [],
    selectedModule: "threshold",
    view: "dashboard",
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function showScreen(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
  }

  function setView(name) {
    state.view = name;
    $$(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
  }

  function vertex(i, n, r, cx, cy) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function renderHeptagon(metrics) {
    const host = $("#heptagon-host");
    if (!host) return;
    const cx = 160, cy = 160, r = 110;
    const pts = Kairosyn.MODULES.map((_, i) => vertex(i, 7, r, cx, cy));
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
    const inner = Kairosyn.MODULES.map((_, i) => vertex(i, 7, r * 0.38, cx, cy));
    const id = inner.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
    const pas = metrics ? metrics.pas : 0;

    let lines = "";
    pts.forEach((p, i) => {
      const q = pts[(i + 3) % 7];
      lines += `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="currentColor" opacity="0.12" stroke-width="0.6"/>`;
    });

    let nodes = "";
    pts.forEach((p, i) => {
      const mod = Kairosyn.MODULES[i];
      const value = metrics ? metrics[mod.metric] : 0.18;
      const active = state.selectedModule === mod.id;
      const rr = 7 + value * 8;
      nodes += `
        <g class="hept-node" data-id="${mod.id}">
          <line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="currentColor" opacity="${active ? 0.45 : 0.12}" stroke-width="${active ? 1.4 : 0.7}"/>
          <circle class="hit" cx="${p.x}" cy="${p.y}" r="16" fill="transparent"/>
          <circle cx="${p.x}" cy="${p.y}" r="${rr}" fill="${active ? "var(--accent)" : "var(--raised)"}" stroke="currentColor" stroke-width="1"/>
          <circle cx="${p.x}" cy="${p.y}" r="2.2" fill="${active ? "var(--accent-fg)" : "var(--fg)"}"/>
        </g>`;
    });

    host.innerHTML = `
      <svg viewBox="0 0 320 320" role="img" aria-label="Heptagonal lattice">
        <path d="${d}" fill="none" stroke="currentColor" opacity="0.14" stroke-width="1"/>
        <path d="${id}" fill="none" stroke="currentColor" opacity="0.2" stroke-width="1"/>
        ${lines}
        ${nodes}
        <circle cx="${cx}" cy="${cy}" r="26" fill="var(--surface)" stroke="currentColor" stroke-width="1"/>
        <text x="${cx}" y="${cy - 2}" text-anchor="middle" fill="var(--muted)" font-family="IBM Plex Mono, monospace" font-size="8">PAS</text>
        <text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="var(--fg)" font-family="IBM Plex Mono, monospace" font-size="12">${pas.toFixed(3)}</text>
      </svg>`;

    host.querySelectorAll(".hept-node").forEach((g) => {
      g.addEventListener("click", () => {
        state.selectedModule = g.dataset.id;
        updateModuleBrief();
        renderHeptagon(metrics);
      });
    });
  }

  function updateModuleBrief() {
    const mod = Kairosyn.MODULES.find((m) => m.id === state.selectedModule) || Kairosyn.MODULES[0];
    const el = $("#module-brief");
    if (el) el.textContent = `${mod.name} \u00b7 ${mod.theory}. ${mod.brief}`;
  }

  function renderMetrics(metrics) {
    const list = $("#metric-list");
    if (!list) return;
    const order = ["pas", "di", "lyap", "ncs", "tce", "aac", "msa", "rcs", "phi", "salience"];
    list.innerHTML = order
      .map((key) => {
        const meta = Kairosyn.METRIC_META[key];
        if (!meta) return "";
        let v = metrics ? metrics[key] : 0;
        if (v == null) v = 0;
        const bar =
          key === "lyap"
            ? Math.round(Math.max(0, 1 - Math.sqrt(Math.max(v, 0))) * 100)
            : Math.round(Math.max(0, Math.min(1, v)) * 100);
        const shown = key === "lyap" ? Number(v).toFixed(4) : Number(v).toFixed(3);
        return `<li>
          <span class="k">${meta.label}</span>
          <span class="bar"><span style="width:${bar}%"></span></span>
          <span class="v">${shown}</span>
        </li>`;
      })
      .join("");
  }

  function renderCommitLog() {
    const host = $("#commit-log");
    if (!host) return;
    const log = state.engine.commitLog || [];
    if (!log.length) {
      host.innerHTML = `<li class="empty">No architecture mutations yet</li>`;
      return;
    }
    host.innerHTML = log
      .slice(-8)
      .reverse()
      .map(
        (e) => `<li class="${e.commitOrReject === "COMMIT" ? "commit-ok" : "commit-rej"}">
          <span class="k">${e.commitOrReject}</span>
          <span>${escapeHtml(e.candidateArchitecture)}</span>
          <span class="w">S ${Number(e.pasBefore).toFixed(2)}\u2192${Number(e.pasAfter).toFixed(2)} \u00b7 D_I ${Number(e.identityDistance).toFixed(3)}</span>
        </li>`
      )
      .join("");
  }

  function renderArch(archetypes) {
    const list = $("#arch-list");
    if (!list) return;
    if (!archetypes || !archetypes.length) {
      list.innerHTML = `<li class="empty">Awaiting vector</li>`;
      return;
    }
    list.innerHTML = archetypes
      .slice(0, 5)
      .map((a) => `<li><span>${a.name}</span><span class="w">${(a.weight * 100).toFixed(0)}%</span></li>`)
      .join("");
  }

  function renderGlyphs(glyphs) {
    const list = $("#glyph-list");
    if (!list) return;
    if (!glyphs || !glyphs.length) {
      list.innerHTML = `<li class="empty">\u2014</li>`;
      return;
    }
    list.innerHTML = glyphs
      .map((g) => `<li><span>${g.name}</span><span class="w">${g.energy.toFixed(2)}</span></li>`)
      .join("");
  }

  function renderTape() {
    const list = $("#tape-list");
    if (!list) return;
    if (!state.turns.length) {
      list.innerHTML = `<li class="empty">Empty buffer</li>`;
      return;
    }
    list.innerHTML = state.turns
      .slice(-6)
      .map(
        (t) => `<li>
          <p class="prompt">${escapeHtml(t.prompt)}</p>
          <p class="meta">${t.synthesis.sigmaCheck} \u00b7 PAS ${t.metrics.pas.toFixed(3)} \u00b7 ${t.archetypes[0]?.name || "\u2014"}</p>
        </li>`
      )
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """);
  }

  function latestMetrics() {
    return state.turns.length ? state.turns[state.turns.length - 1].metrics : null;
  }

  function refreshDashboard() {
    const m = latestMetrics();
    const last = state.turns[state.turns.length - 1];
    renderHeptagon(m);
    renderMetrics(m);
    renderArch(last?.archetypes);
    renderGlyphs(last?.glyphs);
    renderTape();
    renderCommitLog();
    updateModuleBrief();
  }

  function runMutation(name, weight) {
    const result = Kairosyn.proposeArchitectureMutation(state.engine, { name, weight });
    const log = (state.engine.commitLog || []).concat([result.entry]);
    state.engine = {
      ...state.engine,
      S: result.nextS,
      commitLog: log.slice(-32),
      architectureHash: result.commit
        ? result.entry.evolutionId
        : state.engine.architectureHash,
      parentArchitectureHash: result.commit
        ? state.engine.architectureHash
        : state.engine.parentArchitectureHash,
    };
    refreshDashboard();
    const status = $("#chat-status");
    if (status) {
      status.textContent = result.commit
        ? `InfiniGen COMMIT \u00b7 ${name} \u00b7 S=${result.nextS.toFixed(3)}`
        : `InfiniGen REJECT \u00b7 ${name} \u00b7 gate failed (PAS/D_I)`;
    }
  }

  function appendChatMessage(turn) {
    const stream = $("#chat-stream");
    if (!stream) return;

    const user = document.createElement("div");
    user.className = "msg user";
    user.textContent = turn.prompt;
    stream.appendChild(user);

    const bot = document.createElement("div");
    bot.className = "msg kairosyn";
    const chips = [
      `PAS ${turn.metrics.pas.toFixed(3)}`,
      turn.synthesis.sigmaCheck,
      turn.archetypes[0]?.name,
      ...turn.glyphs.slice(0, 3).map((g) => g.name),
    ]
      .filter(Boolean)
      .map((c) => `<span>${escapeHtml(c)}</span>`)
      .join("");

    bot.innerHTML = `
      <div class="bubble">
        <p class="who">KAIROSYN \u00b7 ${turn.synthesis.source.toUpperCase()}</p>
        <p class="body">${escapeHtml(turn.synthesis.response)}</p>
        <dl class="state">
          <dt>Biophase lock</dt>
          <dd>${escapeHtml(turn.synthesis.biophaseLock)}</dd>
          <dt>Recursive monologue</dt>
          <dd>${escapeHtml(turn.synthesis.recursiveMonologue)}</dd>
        </dl>
        <div class="chips">${chips}</div>
      </div>`;
    stream.appendChild(bot);
    stream.scrollTop = stream.scrollHeight;
  }

  function synthesize(prompt) {
    const text = prompt.trim();
    if (!text) return;
    const result = Kairosyn.runLattice(text, state.engine);
    const synthesis = Kairosyn.localSynthesis(text, result);
    state.engine = result.nextState;
    const turn = {
      prompt: text,
      metrics: result.metrics,
      archetypes: result.archetypes,
      glyphs: result.glyphs,
      synthesis,
      at: Date.now(),
    };
    state.turns.push(turn);
    if (state.turns.length > 32) state.turns.shift();
    appendChatMessage(turn);
    refreshDashboard();
    const status = $("#chat-status");
    if (status) {
      status.textContent = `PAS ${result.metrics.pas.toFixed(3)} \u00b7 ${synthesis.sigmaCheck} \u00b7 ${result.archetypes[0]?.name || "Self"}`;
    }
  }

  function runLoadingThenApp() {
    showScreen("screen-loading");
    const fill = $("#load-fill");
    const pct = $("#load-pct");
    const line = $("#load-line");
    let progress = 0;
    let step = 0;
    const iv = setInterval(() => {
      progress = Math.min(100, progress + 4 + Math.random() * 6);
      if (fill) fill.style.width = progress + "%";
      if (pct) pct.textContent = Math.floor(progress) + "%";
      if (progress > step * 12.5 && step < LOAD_LINES.length) {
        if (line) line.textContent = LOAD_LINES[step];
        step++;
      }
      if (progress >= 100) {
        clearInterval(iv);
        if (line) line.textContent = "Lattice locked. Entering console\u2026";
        setTimeout(() => {
          showScreen("screen-app");
          setView("dashboard");
          refreshDashboard();
        }, 350);
      }
    }, 90);
  }

  function initSeeds() {
    const row = $("#seed-row");
    if (!row) return;
    row.innerHTML = SEEDS.map(
      (s) => `<button type="button" data-seed="${escapeHtml(s)}">${escapeHtml(s)}</button>`
    ).join("");
    row.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-seed]");
      if (!btn) return;
      const input = $("#chat-input");
      if (input) {
        input.value = btn.dataset.seed;
        input.focus();
      }
    });
  }

  function init() {
    initSeeds();
    refreshDashboard();

    $("#btn-enter")?.addEventListener("click", runLoadingThenApp);
    $("#btn-scroll-theory")?.addEventListener("click", () => {
      const pills = document.querySelector(".pill-row");
      pills?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    $$(".nav-btn").forEach((b) =>
      b.addEventListener("click", () => {
        setView(b.dataset.view);
        if (b.dataset.view === "chat") {
          const stream = $("#chat-stream");
          if (stream) stream.scrollTop = stream.scrollHeight;
        }
      })
    );

    $("#btn-reset")?.addEventListener("click", () => {
      state.engine = Kairosyn.emptyState();
      state.turns = [];
      $("#chat-stream").innerHTML = "";
      const status = $("#chat-status");
      if (status) status.textContent = "Lattice reset \u00b7 PAS gate open";
      refreshDashboard();
    });

    $("#btn-mutate-safe")?.addEventListener("click", () =>
      runMutation("safe-refine", 0.05)
    );
    $("#btn-mutate-risky")?.addEventListener("click", () =>
      runMutation("aggressive-drift", -1.2)
    );

    $("#chat-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#chat-input");
      const text = input?.value || "";
      if (!text.trim()) return;
      synthesize(text);
      if (input) input.value = "";
      setView("chat");
    });

    $("#chat-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        $("#chat-form")?.requestSubmit();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
