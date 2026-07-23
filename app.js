(() => {
  "use strict";

  const SECTION_TOTAL = 8;
  const CONTEXT_LIMIT = 24;
  const i18n = window.AtlasI18n;
  const msg = (key, values = {}, fallback) => (
    i18n?.message(key, values, fallback) ?? fallback ?? key
  );
  const storageKeys = {
    orientation: "axis-atlas-orientation-v1",
    visited: "axis-atlas-visited-v1",
    tasks: "axis-atlas-tasks-v1"
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const announcer = document.querySelector("#live-announcer");
  const heroVideo = document.querySelector("#hero-video");
  const motionToggle = document.querySelector("#motion-toggle");
  const navLinks = [...document.querySelectorAll("[data-nav-section]")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const visited = new Set(readSessionArray(storageKeys.visited));
  const completedTasks = new Set(readSessionArray(storageKeys.tasks));
  let stillMode = prefersReducedMotion.matches;

  function readSessionArray(key) {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeSession(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The app remains fully functional if storage is disabled.
    }
  }

  function announce(message) {
    if (!announcer) return;
    announcer.textContent = "";
    window.setTimeout(() => {
      announcer.textContent = message;
    }, 20);
  }

  function markTask(task) {
    completedTasks.add(task);
    writeSession(storageKeys.tasks, [...completedTasks]);
  }

  function updateJourney() {
    const count = Math.min(visited.size, SECTION_TOTAL);
    const percentage = (count / SECTION_TOTAL) * 100;
    document.querySelector("#journey-count").textContent = String(count);
    document.querySelector("#completion-number").textContent = String(count);
    document.querySelector("#rail-progress-fill").style.width = `${percentage}%`;

    navLinks.forEach((link) => {
      link.classList.toggle("viewed", visited.has(link.dataset.navSection));
    });

    const title = document.querySelector("#completion-title");
    const copy = document.querySelector("#completion-copy");
    if (count === SECTION_TOTAL) {
      title.textContent = msg("journey.completeTitle");
      copy.textContent = msg("journey.completeCopy");
    } else {
      const remaining = SECTION_TOTAL - count;
      title.textContent = msg("journey.openTitle");
      copy.textContent = msg(remaining === 1 ? "journey.remainingOne" : "journey.remainingMany", { count: remaining });
    }
  }

  function setActiveSection(sectionNumber) {
    navLinks.forEach((link) => {
      if (link.dataset.navSection === sectionNumber) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      visible.forEach((entry) => {
        const number = entry.target.dataset.section;
        if (!visited.has(number)) {
          visited.add(number);
          writeSession(storageKeys.visited, [...visited]);
          updateJourney();
        }
      });

      if (visible[0]) setActiveSection(visible[0].target.dataset.section);
    },
    // Include a zero threshold so a section taller than the viewport can still
    // register when it enters the reading band. Requiring 20% visibility made
    // the long lexicon structurally impossible to complete on smaller screens.
    { threshold: [0, 0.05, 0.2, 0.45, 0.7], rootMargin: "-12% 0px -42% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
  updateJourney();

  // Dialogs and orientation.
  document.querySelectorAll("[data-open-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.openDialog);
      if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    });
  });

  const orientationDialog = document.querySelector("#orientation-dialog");
  document.querySelector("#accept-orientation")?.addEventListener("click", () => {
    try {
      sessionStorage.setItem(storageKeys.orientation, "seen");
    } catch {
      // No persistence required.
    }
  });
  orientationDialog?.querySelector("a[href^='#']")?.addEventListener("click", () => {
    orientationDialog.close();
  });

  window.setTimeout(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(storageKeys.orientation) === "seen";
    } catch {
      seen = false;
    }
    if (!seen && orientationDialog && typeof orientationDialog.showModal === "function") {
      orientationDialog.showModal();
    }
  }, 360);

  // Motion control.
  function applyMotionMode() {
    document.body.classList.toggle("still-mode", stillMode);
    motionToggle?.setAttribute("aria-pressed", String(stillMode));
    const label = motionToggle?.querySelector("span:last-child");
    if (label) label.textContent = stillMode ? msg("motion.enable") : msg("motion.still");

    if (heroVideo) {
      if (stillMode) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(() => {
          // The poster is a complete fallback if autoplay is blocked.
        });
      }
    }
  }

  motionToggle?.addEventListener("click", () => {
    stillMode = !stillMode;
    applyMotionMode();
    window.requestAnimationFrame(refreshCanvas);
    announce(stillMode ? msg("motion.paused") : msg("motion.enabled"));
  });
  prefersReducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      stillMode = true;
      applyMotionMode();
      window.requestAnimationFrame(refreshCanvas);
    }
  });
  applyMotionMode();

  // Gate I: sixteen neutral study objects.
  const shellGrid = document.querySelector("#shell-grid");
  const shellStage = shellGrid?.closest(".shell-stage");
  const shellStates = Array.from({ length: 16 }, () => "unset");
  let setA = null;
  let setB = null;

  function stateLabel(state) {
    if (state === "a") return msg("shell.stateA");
    if (state === "b") return msg("shell.stateB");
    return msg("shell.unset");
  }

  function nextState(state) {
    if (state === "unset") return "a";
    if (state === "a") return "b";
    return "unset";
  }

  function positionShells() {
    if (!shellGrid || !shellStage) return;
    const radius = Math.max(104, Math.min(shellStage.clientWidth * 0.41, 206));
    [...shellGrid.children].forEach((button, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 16;
      button.style.setProperty("--x", `${Math.cos(angle) * radius}px`);
      button.style.setProperty("--y", `${Math.sin(angle) * radius}px`);
    });
  }

  function renderShell(index) {
    const button = shellGrid?.children[index];
    if (!button) return;
    const state = shellStates[index];
    button.dataset.state = state;
    button.setAttribute("aria-label", msg("shell.objectAria", { index: index + 1, state: stateLabel(state) }));
    button.title = msg("shell.objectTitle", { index: index + 1, state: stateLabel(state) });
  }

  function shellMetrics(states) {
    const aCount = states.filter((state) => state === "a").length;
    const unset = states.filter((state) => state === "unset").length;
    const bits = states.map((state) => (state === "a" ? "1" : state === "b" ? "0" : "–")).join("");
    const transitions = states.slice(1).reduce((sum, state, index) => {
      if (state === "unset" || states[index] === "unset") return sum;
      return sum + Number(state !== states[index]);
    }, 0);
    return { aCount, unset, bits, transitions };
  }

  function updateShellReadout() {
    const metrics = shellMetrics(shellStates);
    document.querySelector("#orientation-a-count").textContent = String(metrics.aCount);
    document.querySelector("#unset-count").textContent = msg("shell.unsetCount", { count: metrics.unset });
    document.querySelector("#shell-status").textContent = metrics.unset
      ? msg(metrics.unset === 1 ? "shell.remainingOne" : "shell.remainingMany", { count: metrics.unset })
      : msg("shell.completePattern", { pattern: metrics.bits });
  }

  function updatePairLedger(silent = false) {
    const aValue = document.querySelector("#throw-a-value");
    const bValue = document.querySelector("#throw-b-value");
    const pairValue = document.querySelector("#pair-value");
    const pairIndex = document.querySelector("#pair-index");
    aValue.textContent = setA ? String(setA.aCount) : "—";
    bValue.textContent = setB ? String(setB.aCount) : "—";

    if (setA && setB) {
      const index = setA.aCount * 17 + setB.aCount;
      pairValue.textContent = `(${setA.aCount}, ${setB.aCount})`;
      pairIndex.textContent = String(index);
      document.querySelector("#shell-status").textContent = msg("shell.pairStatus", { index });
      markTask("form");
      if (!silent) announce(msg("shell.pairAnnounce", { a: setA.aCount, b: setB.aCount }));
    } else {
      pairValue.textContent = "—";
      pairIndex.textContent = "—";
    }
  }

  if (shellGrid) {
    shellStates.forEach((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "study-shell";
      button.dataset.state = "unset";
      button.addEventListener("click", () => {
        shellStates[index] = nextState(shellStates[index]);
        renderShell(index);
        updateShellReadout();
      });
      shellGrid.append(button);
      renderShell(index);
    });
  }

  window.addEventListener("resize", positionShells, { passive: true });
  window.requestAnimationFrame(positionShells);

  document.querySelector("#randomize-shells")?.addEventListener("click", () => {
    const random = new Uint8Array(16);
    window.crypto.getRandomValues(random);
    random.forEach((value, index) => {
      shellStates[index] = value % 2 === 0 ? "a" : "b";
      renderShell(index);
    });
    updateShellReadout();
    announce(msg("shell.simulated"));
  });

  document.querySelector("#clear-shells")?.addEventListener("click", () => {
    shellStates.fill("unset");
    shellStates.forEach((_, index) => renderShell(index));
    updateShellReadout();
    announce(msg("shell.cleared"));
  });

  function recordSet(which) {
    const metrics = shellMetrics(shellStates);
    if (metrics.unset) {
      document.querySelector("#shell-status").textContent = msg(
        metrics.unset === 1 ? "shell.cannotRecordOne" : "shell.cannotRecordMany",
        { which, count: metrics.unset }
      );
      announce(msg("shell.incompleteAnnounce", { which }));
      return;
    }
    const record = { ...metrics, states: [...shellStates] };
    if (which === "A") setA = record;
    if (which === "B") setB = record;
    updatePairLedger();
  }

  document.querySelector("#save-throw-a")?.addEventListener("click", () => recordSet("A"));
  document.querySelector("#save-throw-b")?.addEventListener("click", () => recordSet("B"));
  updateShellReadout();

  // Gate II: transparent token demonstration and a deterministic canvas field.
  const promptInput = document.querySelector("#prompt-input");
  const tokenWindow = document.querySelector("#token-window");
  const tokenCanvas = document.querySelector("#token-canvas");
  const tokenContext = tokenCanvas?.getContext("2d");
  let tokenPoints = [];
  let currentTokens = [];
  let canvasFrame = 0;

  function splitIntoUnits(text) {
    const normalized = text.normalize("NFC");
    try {
      return normalized.match(/[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*|\p{N}+|[^\s\p{L}\p{M}\p{N}]/gu) || [];
    } catch {
      return normalized.match(/[A-Za-z0-9]+|[^\sA-Za-z0-9]/g) || [];
    }
  }

  function fnv1a(text) {
    let hash = 0x811c9dc5;
    for (const character of text) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  }

  function tokenVector(token, index) {
    const hash = fnv1a(`${index}:${token}`);
    return {
      token,
      hash,
      xRatio: ((hash & 0xffff) / 0xffff) * 0.74 + 0.13,
      yRatio: (((hash >>> 16) & 0xffff) / 0xffff) * 0.66 + 0.17,
      phase: ((hash % 628) / 100),
      size: 2.2 + ((hash >>> 8) % 4)
    };
  }

  function renderTokenWindow(tokens) {
    currentTokens = [...tokens];
    tokenWindow.replaceChildren();
    const loaded = tokens.slice(0, CONTEXT_LIMIT);
    for (let index = 0; index < CONTEXT_LIMIT; index += 1) {
      const chip = document.createElement("div");
      chip.className = "token-chip";
      if (loaded[index]) {
        const text = document.createElement("span");
        text.textContent = loaded[index];
        chip.append(text);
        chip.title = msg("token.unitTitle", { index: index + 1, token: loaded[index] });
      } else {
        chip.classList.add("empty-token");
        chip.setAttribute("aria-hidden", "true");
      }
      tokenWindow.append(chip);
    }

    document.querySelector("#context-used").textContent = String(loaded.length);
    document.querySelector("#token-total").textContent = String(tokens.length);
    document.querySelector("#token-loaded").textContent = String(loaded.length);
    document.querySelector("#token-overflow").textContent = String(Math.max(0, tokens.length - CONTEXT_LIMIT));
    tokenPoints = loaded.map(tokenVector);
  }

  function tokenizeCurrentText() {
    const tokens = splitIntoUnits(promptInput.value.trim());
    renderTokenWindow(tokens);
    if (tokens.length) {
      markTask("code");
      announce(msg(tokens.length === 1 ? "token.foundOne" : "token.foundMany", {
        count: tokens.length,
        loaded: Math.min(tokens.length, CONTEXT_LIMIT)
      }));
    } else {
      announce(msg("token.none"));
    }
  }

  document.querySelector("#tokenize-button")?.addEventListener("click", tokenizeCurrentText);
  promptInput?.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") tokenizeCurrentText();
  });
  document.querySelector("#clear-prompt")?.addEventListener("click", () => {
    promptInput.value = "";
    renderTokenWindow([]);
    promptInput.focus();
    announce(msg("token.cleared"));
  });

  function sizeCanvas() {
    if (!tokenCanvas || !tokenContext) return;
    const rect = tokenCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    tokenCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
    tokenCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
    tokenContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawTokenField(time = 0) {
    if (!tokenCanvas || !tokenContext) return;
    const width = tokenCanvas.clientWidth;
    const height = tokenCanvas.clientHeight;
    tokenContext.clearRect(0, 0, width, height);

    const resolved = tokenPoints.map((point) => {
      const drift = stillMode ? 0 : Math.sin(time * 0.00035 + point.phase) * 8;
      return { ...point, x: point.xRatio * width + drift, y: point.yRatio * height - drift * 0.35 };
    });

    tokenContext.lineWidth = 0.7;
    resolved.forEach((point, index) => {
      for (let otherIndex = index + 1; otherIndex < resolved.length; otherIndex += 1) {
        const other = resolved[otherIndex];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance < 165) {
          tokenContext.strokeStyle = `rgba(111, 157, 148, ${Math.max(0.03, 0.24 - distance / 850)})`;
          tokenContext.beginPath();
          tokenContext.moveTo(point.x, point.y);
          tokenContext.lineTo(other.x, other.y);
          tokenContext.stroke();
        }
      }
    });

    resolved.forEach((point) => {
      tokenContext.fillStyle = point.hash % 3 === 0 ? "rgba(183, 139, 69, 0.7)" : "rgba(233, 226, 208, 0.58)";
      tokenContext.beginPath();
      tokenContext.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      tokenContext.fill();
    });

    if (!stillMode) canvasFrame = window.requestAnimationFrame(drawTokenField);
  }

  function refreshCanvas() {
    window.cancelAnimationFrame(canvasFrame);
    sizeCanvas();
    drawTokenField(performance.now());
  }

  window.addEventListener("resize", refreshCanvas, { passive: true });
  refreshCanvas();

  // Attention laboratory.
  const temperatureInput = document.querySelector("#temperature");
  const temperatureOutput = document.querySelector("#temperature-value");

  function multiplyVectorMatrix(vector, matrix) {
    return matrix[0].map((_, column) => vector.reduce((sum, value, row) => sum + value * matrix[row][column], 0));
  }

  function dot(a, b) {
    return a.reduce((sum, value, index) => sum + value * b[index], 0);
  }

  function softmax(values) {
    const maximum = Math.max(...values);
    const exponentials = values.map((value) => Math.exp(value - maximum));
    const total = exponentials.reduce((sum, value) => sum + value, 0);
    return exponentials.map((value) => value / total);
  }

  function featureVector(record, fallback) {
    if (!record) return fallback;
    return [record.aCount / 16, record.transitions / 15, record.aCount % 2];
  }

  function runAttention(shouldAnnounce = true) {
    const x = [
      featureVector(setA, [0.25, 0.6, 0]),
      featureVector(setB, [0.75, 0.27, 1])
    ];
    const wQ = [[0.8, -0.2], [0.35, 0.7], [-0.45, 0.3]];
    const wK = [[0.55, 0.5], [-0.25, 0.8], [0.6, -0.15]];
    const wV = [[0.7, 0.15], [0.1, 0.9], [-0.2, 0.45]];
    const q = x.map((row) => multiplyVectorMatrix(row, wQ));
    const k = x.map((row) => multiplyVectorMatrix(row, wK));
    const v = x.map((row) => multiplyVectorMatrix(row, wV));
    const temperature = Number(temperatureInput.value);
    const scores = q.map((query) => k.map((key) => dot(query, key) / Math.sqrt(2) / temperature));
    const weights = scores.map(softmax);
    const context = weights.map((row) => [
      row[0] * v[0][0] + row[1] * v[1][0],
      row[0] * v[0][1] + row[1] * v[1][1]
    ]);

    const output = document.querySelector("#matrix-output");
    output.replaceChildren();
    weights.forEach((row, rowIndex) => {
      row.forEach((weight, columnIndex) => {
        const cell = document.createElement("div");
        cell.className = "matrix-cell";
        cell.style.setProperty("--weight", String(weight));
        const label = document.createElement("span");
        label.textContent = msg("attention.cellLabel", {
          row: rowIndex + 1,
          column: columnIndex + 1,
          a: rowIndex + 1,
          b: columnIndex + 1
        });
        const value = document.createElement("strong");
        value.textContent = weight.toFixed(3);
        cell.append(label, value);
        output.append(cell);
      });
    });
    output.setAttribute("aria-label", msg("attention.aria", {
      weights: weights.flat().map((weight) => weight.toFixed(3)).join(", "),
      vectors: context.flat().map((value) => value.toFixed(3)).join(", ")
    }));
    markTask("attention");
    if (shouldAnnounce) announce(msg("attention.calculated"));
  }

  temperatureInput?.addEventListener("input", () => {
    temperatureOutput.textContent = Number(temperatureInput.value).toFixed(1);
  });
  document.querySelector("#run-attention")?.addEventListener("click", () => runAttention(true));

  // Emanation atlas: histories remain separate.
  const atlasData = {
    kabbalah: {
      label: "Kabbalistic histories",
      title: "Thirty-two typed paths are not one timeless diagram",
      cardinality: "10 + 22 = 32",
      body: "Sefer Yetzirah presents ten sefirot belimah and twenty-two foundational letters. The familiar fixed Tree should not be projected unchanged backward: medieval and early-modern ilanot form a varied diagram genre.",
      boundary: "Keter is not Ein Sof; neither is an odù, Olódùmarè, wuji, or a latent vector.",
      count: 32,
      columns: 8,
      labelUnit: (index) => (index < 10
        ? msg("atlas.measure", { index: index + 1 })
        : msg("atlas.letter", { index: index - 9 })),
      typeBStart: 10
    },
    ifa: {
      label: "Ifá corpus structure",
      title: "Sixteen principal odù generate 256 ordered figures",
      cardinality: "16 × 16 = 256",
      body: "UNESCO describes the odù as organizing a vast, open-ended literary corpus interpreted by trained diviners. A software bit index can serialize sixteen formal patterns, but the index is not the sign’s history, verse corpus, or authority.",
      boundary: "The 256 Ifá figure structure must not be transferred automatically to every sixteen-cowrie count procedure.",
      count: 16,
      columns: 4,
      labelUnit: (index) => index.toString(2).padStart(4, "0"),
      typeBStart: 16
    },
    yijing: {
      label: "Yijing and wuji",
      title: "Sixty-four hexagram patterns; later cosmological vocabularies",
      cardinality: "2⁶ = 64",
      body: "A six-line binary encoding enumerates sixty-four yin-yang patterns. Wuji, often translated as non-polarity, becomes prominent in Song cosmology and should not be treated as a lost zeroth hexagram or a machine null value.",
      boundary: "A shared use of polarity or binary notation does not establish identity with Ifá figures or neural representations.",
      count: 64,
      columns: 8,
      labelUnit: (index) => index.toString(2).padStart(6, "0"),
      typeBStart: 32
    }
  };

  const atlasVisited = new Set();
  let activeAtlasKey = "kabbalah";
  let crosswalkTested = false;

  function renderAtlas(key) {
    const baseData = atlasData[key];
    if (!baseData) return;
    const data = i18n?.localizedAtlasData(key, baseData) || baseData;
    activeAtlasKey = key;
    const copy = document.querySelector("#atlas-copy");
    const diagram = document.querySelector("#atlas-diagram");
    copy.replaceChildren();
    diagram.replaceChildren();

    const label = document.createElement("p");
    label.className = "mini-label";
    label.textContent = data.label;
    const heading = document.createElement("h3");
    heading.textContent = data.title;
    const cardinality = document.createElement("span");
    cardinality.className = "cardinality";
    cardinality.textContent = data.cardinality;
    const body = document.createElement("p");
    body.textContent = data.body;
    const boundary = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = msg("atlas.boundaryLabel");
    boundary.append(strong, data.boundary);
    copy.append(label, heading, cardinality, body, boundary);

    diagram.style.setProperty("--cols", String(data.columns));
    for (let index = 0; index < data.count; index += 1) {
      const unit = document.createElement("div");
      unit.className = "atlas-unit";
      if (index >= data.typeBStart) unit.classList.add("type-b");
      unit.textContent = data.labelUnit(index);
      diagram.append(unit);
    }
    diagram.setAttribute("aria-label", msg("atlas.diagramAria", { label: data.label, cardinality: data.cardinality }));

    document.querySelectorAll("[data-atlas]").forEach((button) => {
      const selected = button.dataset.atlas === key;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected) document.querySelector("#atlas-panel").setAttribute("aria-labelledby", button.id);
    });

    atlasVisited.add(key);
    if (atlasVisited.size === Object.keys(atlasData).length) markTask("emanation");
  }

  document.querySelectorAll("[data-atlas]").forEach((button) => {
    button.addEventListener("click", () => renderAtlas(button.dataset.atlas));
    button.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const buttons = [...document.querySelectorAll("[data-atlas]")];
      const current = buttons.indexOf(button);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = buttons[(current + direction + buttons.length) % buttons.length];
      next.focus();
      renderAtlas(next.dataset.atlas);
    });
  });
  renderAtlas("kabbalah");

  document.querySelector("#test-crosswalk")?.addEventListener("click", () => {
    const result = document.querySelector("#crosswalk-result");
    result.textContent = msg("crosswalk.result");
    crosswalkTested = true;
    markTask("crosswalk");
    announce(msg("crosswalk.announce"));
  });

  // Gate III: responsibility layers.
  const authoritySelected = new Set();
  function updateAuthorityReveal(shouldAnnounce = false) {
    const reveal = document.querySelector("#authority-reveal");
    if (!reveal) return;
    if (authoritySelected.size === 3) {
      reveal.innerHTML = msg("authority.completeHtml");
      markTask("authority");
      if (shouldAnnounce) announce(msg("authority.completeAnnounce"));
    } else {
      const remaining = 3 - authoritySelected.size;
      reveal.textContent = msg(
        remaining === 1 ? "authority.remainingOne" : "authority.remainingMany",
        { count: remaining }
      );
    }
  }

  document.querySelectorAll("[data-authority]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.authority;
      if (authoritySelected.has(key)) authoritySelected.delete(key);
      else authoritySelected.add(key);
      button.setAttribute("aria-pressed", String(authoritySelected.has(key)));

      updateAuthorityReveal(true);
    });
  });

  // Comparative lexicon.
  const lexicon = [
    {
      term: "Token",
      portuguese: "token",
      groups: ["ai", "yoruba"],
      technical: "A discrete unit produced by a model-specific tokenizer and represented by an integer identifier.",
      comparison: "Ọfọ̀ is a source-described verbal genre; it is not a token.",
      analogy: "Both analyses may attend closely to segmentation, sequence, and exact form.",
      boundary: "A token is not a sacred phoneme, word of power, or quantum of àṣẹ."
    },
    {
      term: "Model weight",
      portuguese: "peso do modelo",
      groups: ["ai", "yoruba"],
      technical: "A trained numerical parameter used by a network's computation.",
      comparison: "Àṣẹ / axé is discussed in cited scholarship as creative, effective, or vital force in situated Yorùbá and Candomblé relations.",
      analogy: "At a very abstract level, both may be discussed as conditions affecting what can occur.",
      boundary: "Weights are not distributed axé; signs, gradients, and norms do not measure sacred force."
    },
    {
      term: "Parameter space",
      portuguese: "espaço de parâmetros",
      groups: ["ai", "yoruba", "kabbalah"],
      technical: "The finite-dimensional set of possible parameter settings for one specified model architecture.",
      comparison: "Awo concerns secret, mystery, initiated knowledge, and governed disclosure in situated sources; Ein Sof is a theological term, not a model tensor.",
      analogy: "An observer may lack access to or understanding of either domain.",
      boundary: "Parameter space is not a primordial void, Olódùmarè, Ein Sof, or a store of every possible world."
    },
    {
      term: "Hidden state",
      portuguese: "estado oculto",
      groups: ["ai", "yoruba"],
      technical: "A context-dependent activation vector at a token position and model layer.",
      comparison: "Awo / segredo concerns sacred secrecy, trust, and permission; 'hidden' in a model only means internal to its interface.",
      analogy: "Both prompt questions about inspection, interpretation, and responsible disclosure.",
      boundary: "A hidden state is not initiated knowledge, and sacred secrecy is not failed interpretability."
    },
    {
      term: "Latent representation",
      portuguese: "representação latente",
      groups: ["ai", "yoruba", "kabbalah"],
      technical: "An internal numerical representation learned or computed for a task; a Transformer has several such spaces, not one universal latent realm.",
      comparison: "No exact religious equivalent is documented.",
      analogy: "It can serve as a clearly marked artistic metaphor for relation or unexpressed potential.",
      boundary: "It is not a cosmic matrix, spirit realm, all histories, or the ontology of odù or sefirot."
    },
    {
      term: "Prompt",
      portuguese: "prompt; instrução de entrada",
      groups: ["ai", "yoruba"],
      technical: "Input supplied at inference to condition model activations and output probabilities while parameters normally remain fixed.",
      comparison: "Ọfọ̀ and source-described ọfọ̀ àfọ̀ṣẹ concern consequential, formulaically ordered speech within religious-cultural authority.",
      analogy: "Wording, sequence, context, and competent use affect consequences in both domains.",
      boundary: "A prompt is not an incantation; ordinary prompting does not change trained weights or acquire ritual authority."
    },
    {
      term: "Context window",
      portuguese: "janela de contexto",
      groups: ["ai", "yoruba"],
      technical: "The maximum token sequence directly processed under a model invocation and architecture.",
      comparison: "Ọpọ́n Ifá is the materially and ritually situated Ifá divination tray documented by museum sources.",
      analogy: "Each can be described pedagogically as a bounded arena in which ordered signs become available.",
      boundary: "A token window is not a tray; capacity does not measure ritual scope; 'Alá' is not substituted for ọpọ́n Ifá."
    },
    {
      term: "Self-attention",
      portuguese: "autoatenção",
      groups: ["ai", "yoruba"],
      technical: "Input-dependent weighting of value vectors using softmax-normalized query-key scores at every token position.",
      comparison: "A sourced two-result protocol may combine ordered outcomes under a versioned rule set.",
      analogy: "Both may be visualized as relations among contextual elements.",
      boundary: "Set A is not Q, set B is not K, guidance is not V, and a lookup matrix is not attention."
    },
    {
      term: "Inference",
      portuguese: "inferência",
      groups: ["ai", "yoruba"],
      technical: "Evaluation of a trained model on supplied inputs, normally with learned parameters fixed.",
      comparison: "Divinatory interpretation is performed by authorized human practitioners within a tradition.",
      analogy: "Both transform a presented sign context into a context-sensitive result only at a very high level.",
      boundary: "Model inference is not divination, revelation, consultation, or spiritual intervention."
    },
    {
      term: "Generated output",
      portuguese: "saída gerada",
      groups: ["ai", "yoruba"],
      technical: "Text or another artifact produced by model inference and decoding.",
      comparison: "Ẹsẹ̀ denotes verse within the Ifá corpus in UNESCO's description.",
      analogy: "Generated commentary can cite and discuss public, rights-cleared source material.",
      boundary: "Generated prose is never labeled ẹsẹ̀, oral testimony, revelation, or traditional verse."
    },
    {
      term: "AI alignment / RLHF",
      portuguese: "alinhamento de IA / aprendizagem por reforço com feedback humano",
      groups: ["ai", "yoruba"],
      technical: "Engineering and governance methods intended to shape system behavior relative to specified values, preferences, constraints, and risks.",
      comparison: "Ẹbọ/ebó and Aláfíà belong to source- and community-specific religious practices or classifications.",
      analogy: "Both vocabularies can raise questions about desired and harmful outcomes.",
      boundary: "RLHF is not ebó; AI alignment is not Aláfíà; training loss is not spiritual adversity."
    },
    {
      term: "Emergent capability",
      portuguese: "capacidade emergente",
      groups: ["ai", "yoruba"],
      technical: "A measured ability reported as absent in smaller models and present in larger ones; apparent thresholds can depend on metrics and sampling.",
      comparison: "Òrìṣà and Vodun are religious beings or powers in their traditions, not capability labels.",
      analogy: "Complexity can exceed an observer's prior expectations in many domains.",
      boundary: "A benchmark threshold is not manifestation, possession, incarnation, or the birth of a deity."
    },
    {
      term: "Odù",
      portuguese: "odù",
      groups: ["yoruba"],
      technical: "Not an AI term. UNESCO describes the odù as signs/divisions organizing the Ifá corpus, with sixteen principal and 256 composite figures.",
      comparison: "Software may assign a source-governed identifier or one-hot vector to a public catalog record.",
      analogy: "An index can preserve identity and ordering inside one declared database version.",
      boundary: "An embedding is not the odù; geometric distance does not prove spiritual, semantic, or historical proximity."
    },
    {
      term: "Àṣẹ / axé",
      portuguese: "axé",
      groups: ["yoruba"],
      technical: "Not a machine variable. Scholarship describes situated creative/effective or vital force across Yorùbá and Brazilian histories.",
      comparison: "Models have measurable power consumption, parameters, activations, and outputs.",
      analogy: "The contrast invites inquiry into efficacy, embodiment, permission, and responsibility.",
      boundary: "Electrical energy, model capacity, confidence, and weight magnitude are not measurements of àṣẹ or axé."
    },
    {
      term: "Awo / segredo",
      portuguese: "segredo; mistério",
      groups: ["yoruba"],
      technical: "Not an interpretability metric. The term's documented fields include mystery, secret, initiated knowledge, and governed disclosure.",
      comparison: "Neural systems can be hard to interpret; institutions can also conceal training data or design facts.",
      analogy: "Both require claims about who knows what, who may disclose it, and why.",
      boundary: "Sacred secrecy is not defective explainability, and technical opacity does not authorize extraction of restricted knowledge."
    },
    {
      term: "Sefirot",
      portuguese: "sefirot",
      groups: ["kabbalah"],
      technical: "Not network nodes. Sefer Yetzirah's ten sefirot belimah and medieval Kabbalah's dynamic divine powers belong to distinct historical strata.",
      comparison: "Networks and later ilanot both use nodes and relations as visual organization.",
      analogy: "Diagrammatic form can support memory, contemplation, and analysis.",
      boundary: "A sefirah is not a hidden layer, attention head, weight cluster, odù, or machine coordinate."
    },
    {
      term: "Gematria",
      portuguese: "guematria",
      groups: ["kabbalah", "ai"],
      technical: "A family of rule-governed mappings from Hebrew letters or strings to scalar numerical values.",
      comparison: "Tokenizers map strings to ID sequences; embeddings map items to vectors.",
      analogy: "All make language available to numeric operations under declared conventions.",
      boundary: "Equal gematria sums are not cosine similarity; token IDs are not meanings; vectors are not theological equivalence."
    },
    {
      term: "Tzimtzum",
      portuguese: "tzimtzum; contração",
      groups: ["kabbalah", "ai"],
      technical: "A Lurianic theological account of divine contraction or concealment that enables differentiated existence.",
      comparison: "Engineering uses constraints, finite dimensions, regularization, compression, and quantization.",
      analogy: "Both can provoke reflection on limitation as a condition for form.",
      boundary: "Tzimtzum is not dimensionality reduction, pruning, quantization, context limitation, or a training algorithm."
    },
    {
      term: "Golem",
      portuguese: "golem",
      groups: ["kabbalah", "ai"],
      technical: "A changing archive of Jewish textual, esoteric, folkloric, and literary figures; not a historical AI design specification.",
      comparison: "Modern automation delegates action to artifacts that may exceed a maker's immediate control.",
      analogy: "The ethical parallel concerns maker responsibility and force without judgment.",
      boundary: "The Prague legend is not a documented sixteenth-century event; AI does not technically descend from a clay automaton."
    },
    {
      term: "Adam Kadmon",
      portuguese: "Adam Kadmon; Homem Primordial",
      groups: ["kabbalah", "ai"],
      technical: "A primordial anthropomorphic configuration in Lurianic cosmology, distinct from the biblical Adam and from a golem.",
      comparison: "Some ASI narratives imagine comprehensive intelligence integrating many domains.",
      analogy: "Comparative mythology may study both as totalizing macrohuman images.",
      boundary: "No evidence here shows that technology leaders are consciously or unconsciously reconstructing Adam Kadmon."
    }
  ];

  const lexiconPtBR = {
    "Token": {
      technicalPt: "Uma unidade discreta produzida por um tokenizador específico de cada modelo e representada por um identificador inteiro.",
      comparisonPt: "Ọfọ̀ é um gênero verbal descrito nas fontes; não é um token.",
      analogyPt: "Em ambos os domínios, a análise pode dedicar atenção à segmentação, à sequência e à forma exata.",
      boundaryPt: "Um token não é um fonema sagrado, uma palavra de poder nem uma unidade de àṣẹ."
    },
    "Model weight": {
      technicalPt: "Um parâmetro numérico treinado, usado na computação de uma rede neural.",
      comparisonPt: "Àṣẹ / axé é descrito na bibliografia citada como força criativa, eficaz ou vital em relações situadas Yorùbá e do Candomblé.",
      analogyPt: "Em um nível muito abstrato, ambos podem ser discutidos como condições que afetam o que pode ocorrer.",
      boundaryPt: "Pesos não são axé distribuído; seus sinais, gradientes e normas não medem força sagrada."
    },
    "Parameter space": {
      technicalPt: "O espaço finito-dimensional de todas as configurações possíveis dos parâmetros de uma arquitetura de modelo específica.",
      comparisonPt: "Awo diz respeito a segredo, mistério, conhecimento reservado à iniciação e divulgação submetida à autoridade; Ein Sof é um termo teológico, não um tensor de modelo.",
      analogyPt: "Um observador pode não ter acesso a nenhum dos dois domínios ou não compreendê-los.",
      boundaryPt: "O espaço de parâmetros não é um vazio primordial, Olódùmarè, Ein Sof nem um repositório de todos os mundos possíveis."
    },
    "Hidden state": {
      technicalPt: "Um vetor de ativação dependente do contexto, em determinada posição de token e camada do modelo.",
      comparisonPt: "Awo / segredo diz respeito a segredo sagrado, confiança e permissão; em um modelo, ‘oculto’ significa apenas interno à sua interface.",
      analogyPt: "Ambos suscitam perguntas sobre inspeção, interpretação e divulgação responsável.",
      boundaryPt: "Um estado oculto não é conhecimento reservado à iniciação, e o segredo sagrado não é uma falha de interpretabilidade."
    },
    "Latent representation": {
      technicalPt: "Uma representação numérica interna aprendida ou calculada para uma tarefa; um Transformer possui vários desses espaços, não um único domínio latente universal.",
      comparisonPt: "Não há equivalente religioso exato documentado.",
      analogyPt: "Pode servir como metáfora artística claramente identificada para relações não expressas ou potencialidades.",
      boundaryPt: "Não é uma matriz cósmica, um mundo espiritual, a totalidade das histórias nem a ontologia dos odù ou das sefirot."
    },
    "Prompt": {
      technicalPt: "Uma entrada fornecida durante a inferência para condicionar as ativações do modelo e as probabilidades de saída, enquanto os parâmetros normalmente permanecem fixos.",
      comparisonPt: "Ọfọ̀ e ọfọ̀ àfọ̀ṣẹ, conforme descritos nas fontes, dizem respeito a formas de fala consequencial e formulaicamente ordenada dentro de uma autoridade religioso-cultural.",
      analogyPt: "A formulação, a sequência, o contexto e o uso competente afetam as consequências em ambos os domínios.",
      boundaryPt: "Um prompt não é um encantamento; a interação comum com prompts não altera os pesos treinados nem adquire autoridade ritual."
    },
    "Context window": {
      technicalPt: "A sequência máxima de tokens processada diretamente em uma execução, conforme a arquitetura do modelo.",
      comparisonPt: "Ọpọ́n Ifá é a bandeja de divinação de Ifá material e ritualmente situada, documentada por fontes museológicas.",
      analogyPt: "Cada um pode ser descrito pedagogicamente como uma arena delimitada na qual signos ordenados se tornam disponíveis.",
      boundaryPt: "Uma janela de tokens não é uma bandeja; sua capacidade não mede o alcance ritual; ‘Alá’ não substitui o termo documentado Ọpọ́n Ifá."
    },
    "Self-attention": {
      technicalPt: "Ponderação, dependente da entrada, de vetores de valor por escores de consulta e chave normalizados com softmax em cada posição de token.",
      comparisonPt: "Um protocolo documentado de dois resultados pode combinar desfechos ordenados segundo um conjunto de regras versionado.",
      analogyPt: "Ambos podem ser visualizados como relações entre elementos contextualizados.",
      boundaryPt: "O conjunto A não é Q, o conjunto B não é K, a orientação interpretativa não é V, e uma matriz de consulta não é atenção."
    },
    "Inference": {
      technicalPt: "A avaliação de um modelo treinado sobre entradas fornecidas, normalmente com os parâmetros aprendidos mantidos fixos.",
      comparisonPt: "A interpretação divinatória é realizada por praticantes humanos autorizados dentro de uma tradição.",
      analogyPt: "Em nível muito geral, ambos transformam um contexto de signos apresentado em um resultado sensível ao contexto.",
      boundaryPt: "A inferência de um modelo não é divinação, revelação, consulta nem intervenção espiritual."
    },
    "Generated output": {
      technicalPt: "Texto ou outro artefato produzido pela inferência e pela decodificação de um modelo.",
      comparisonPt: "Ẹsẹ̀ designa verso dentro do corpus de Ifá na descrição da UNESCO.",
      analogyPt: "Um comentário gerado pode citar e discutir materiais públicos e devidamente licenciados.",
      boundaryPt: "A prosa gerada nunca deve ser rotulada como ẹsẹ̀, testemunho oral, revelação ou verso tradicional."
    },
    "AI alignment / RLHF": {
      technicalPt: "Métodos de engenharia e governança destinados a orientar o comportamento de sistemas segundo valores, preferências, restrições e riscos especificados.",
      comparisonPt: "Ẹbọ/ebó e Aláfíà pertencem a práticas religiosas ou classificações específicas de cada fonte e comunidade.",
      analogyPt: "Ambos os vocabulários podem suscitar perguntas sobre resultados desejados e prejudiciais.",
      boundaryPt: "RLHF não é ebó; alinhamento de IA não é Aláfíà; perda de treinamento não é adversidade espiritual."
    },
    "Emergent capability": {
      technicalPt: "Uma capacidade medida que é relatada como ausente em modelos menores e presente em modelos maiores; limiares aparentes podem depender da métrica e da amostragem.",
      comparisonPt: "Òrìṣà e Vodun são seres ou poderes religiosos em suas tradições, não rótulos de capacidade computacional.",
      analogyPt: "A complexidade pode superar as expectativas prévias de um observador em muitos domínios.",
      boundaryPt: "Um limiar de benchmark não é manifestação, possessão, encarnação nem nascimento de uma divindade."
    },
    "Odù": {
      technicalPt: "Não é um termo de IA. A UNESCO descreve os odù como signos ou divisões que organizam o corpus de Ifá, com dezesseis principais e 256 figuras compostas.",
      comparisonPt: "Um software pode atribuir um identificador governado pela fonte ou um vetor one-hot a um registro de catálogo público.",
      analogyPt: "Um índice pode preservar identidade e ordenação dentro de uma versão declarada de banco de dados.",
      boundaryPt: "Um embedding não é o odù; distância geométrica não prova proximidade espiritual, semântica ou histórica."
    },
    "Àṣẹ / axé": {
      technicalPt: "Não é uma variável de máquina. A bibliografia descreve força criativa, eficaz ou vital em histórias situadas Yorùbá e brasileiras.",
      comparisonPt: "Modelos possuem consumo de energia, parâmetros, ativações e saídas mensuráveis.",
      analogyPt: "O contraste permite examinar eficácia, corporeidade, permissão e responsabilidade.",
      boundaryPt: "Energia elétrica, capacidade do modelo, confiança estatística e magnitude dos pesos não medem àṣẹ ou axé."
    },
    "Awo / segredo": {
      technicalPt: "Não é uma métrica de interpretabilidade. Seus campos documentados incluem mistério, segredo, conhecimento reservado à iniciação e divulgação governada.",
      comparisonPt: "Sistemas neurais podem ser difíceis de interpretar; instituições também podem ocultar dados de treinamento ou decisões de projeto.",
      analogyPt: "Ambos exigem perguntas sobre quem sabe o quê, quem pode revelar esse conhecimento e por quê.",
      boundaryPt: "O segredo sagrado não é explicabilidade defeituosa, e a opacidade técnica não autoriza a extração de conhecimento reservado."
    },
    "Sefirot": {
      technicalPt: "Não são nós de rede. As dez sefirot belimah de Sefer Yetzirah e os poderes divinos dinâmicos da Kabbalah medieval pertencem a estratos históricos distintos.",
      comparisonPt: "Redes e os ilanot posteriores usam nós e relações como formas de organização visual.",
      analogyPt: "A forma diagramática pode apoiar memória, contemplação e análise.",
      boundaryPt: "Uma sefirah não é uma camada oculta, cabeça de atenção, agrupamento de pesos, odù ou coordenada de máquina."
    },
    "Gematria": {
      technicalPt: "Uma família de mapeamentos regidos por regras, de letras ou sequências hebraicas a valores numéricos escalares.",
      comparisonPt: "Tokenizadores mapeiam cadeias de caracteres para sequências de IDs; embeddings mapeiam itens para vetores.",
      analogyPt: "Todos tornam a linguagem disponível para operações numéricas segundo convenções declaradas.",
      boundaryPt: "Somas iguais de gematria não são similaridade de cosseno; IDs de tokens não são significados; vetores não estabelecem equivalência teológica."
    },
    "Tzimtzum": {
      technicalPt: "Um relato teológico luriano de contração ou ocultamento divino que possibilita a existência diferenciada.",
      comparisonPt: "A engenharia utiliza restrições, dimensões finitas, regularização, compressão e quantização.",
      analogyPt: "Ambos podem suscitar reflexão sobre a limitação como condição para a forma.",
      boundaryPt: "Tzimtzum não é redução de dimensionalidade, poda, quantização, limitação de contexto nem algoritmo de treinamento."
    },
    "Golem": {
      technicalPt: "Um conjunto histórico em transformação de figuras judaicas textuais, esotéricas, folclóricas e literárias; não uma especificação histórica de projeto de IA.",
      comparisonPt: "A automação moderna delega ações a artefatos que podem ultrapassar o controle imediato de seus criadores.",
      analogyPt: "O paralelo ético diz respeito à responsabilidade de quem cria e ao emprego de força sem discernimento.",
      boundaryPt: "A lenda de Praga não é um acontecimento documentado do século XVI, e a IA não descende tecnicamente de um autômato de barro."
    },
    "Adam Kadmon": {
      technicalPt: "Uma configuração antropomórfica primordial na cosmologia luriana, distinta do Adão bíblico e de um golem.",
      comparisonPt: "Algumas narrativas sobre ASI imaginam uma inteligência abrangente que integra muitos domínios.",
      analogyPt: "A mitologia comparada pode examinar ambos como imagens macro-humanas totalizantes.",
      boundaryPt: "Não há evidência aqui de que líderes tecnológicos estejam reconstruindo Adam Kadmon de forma consciente ou inconsciente."
    }
  };

  lexicon.forEach((entry) => Object.assign(entry, lexiconPtBR[entry.term]));

  let activeLexiconFilter = "all";

  function searchable(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function makeDefinition(labelKey, englishLabel, englishText, localizedText, className = "") {
    const wrapper = document.createElement("div");
    if (className) wrapper.className = className;
    const term = document.createElement("dt");
    const currentLocale = i18n?.locale || "en";
    const localizedLabel = msg(labelKey);
    term.textContent = currentLocale === "en" ? englishLabel : `${englishLabel} / ${localizedLabel}`;
    const definition = document.createElement("dd");
    const english = document.createElement("span");
    english.lang = "en";
    english.textContent = englishText;
    definition.append(english);
    if (currentLocale !== "en") {
      const translation = document.createElement("span");
      translation.lang = currentLocale;
      translation.className = "definition-translation";
      translation.textContent = localizedText || englishText;
      definition.append(translation);
    }
    wrapper.append(term, definition);
    return wrapper;
  }

  function makeLexiconCard(entry) {
    const currentLocale = i18n?.locale || "en";
    const localized = i18n?.localizedLexicon(entry.term) || null;
    const localizedTerm = localized?.localizedTerm || localized?.term || localized?.headword || (
      currentLocale === "pt-BR" ? entry.portuguese : entry.term
    );
    const localizedFields = {
      technical: localized?.technical || (currentLocale === "pt-BR" ? entry.technicalPt : entry.technical),
      comparison: localized?.comparison || (currentLocale === "pt-BR" ? entry.comparisonPt : entry.comparison),
      analogy: localized?.analogy || (currentLocale === "pt-BR" ? entry.analogyPt : entry.analogy),
      boundary: localized?.boundary || (currentLocale === "pt-BR" ? entry.boundaryPt : entry.boundary)
    };
    const article = document.createElement("article");
    article.className = "lexicon-card";

    const header = document.createElement("header");
    const group = document.createElement("p");
    group.className = "term-group";
    const groupLabels = { ai: "AI", yoruba: "Yorùbá / Candomblé", kabbalah: "Kabbalah / golem" };
    group.textContent = entry.groups.map((key) => i18n?.text(groupLabels[key]) || groupLabels[key]).join(" • ");
    const heading = document.createElement("h3");
    heading.textContent = entry.term;
    header.append(group, heading);
    if (currentLocale !== "en") {
      const localizedTermLine = document.createElement("p");
      localizedTermLine.className = "portuguese";
      localizedTermLine.lang = currentLocale;
      localizedTermLine.textContent = `${msg("lexicon.languagePrefix")}: ${localizedTerm}`;
      header.append(localizedTermLine);
    }

    const definitions = document.createElement("dl");
    definitions.append(
      makeDefinition("lexicon.documented", "Documented definition", entry.technical, localizedFields.technical),
      makeDefinition("lexicon.comparison", "Situated comparison", entry.comparison, localizedFields.comparison),
      makeDefinition("lexicon.analogy", "Permitted analogy", entry.analogy, localizedFields.analogy),
      makeDefinition("lexicon.boundary", "Do not equate", entry.boundary, localizedFields.boundary, "boundary")
    );
    article.append(header, definitions);
    return article;
  }

  function renderLexicon() {
    const query = searchable(document.querySelector("#lexicon-search").value.trim());
    const matches = lexicon.filter((entry) => {
      const groupMatch = activeLexiconFilter === "all" || entry.groups.includes(activeLexiconFilter);
      const localized = i18n?.localizedLexicon(entry.term) || {};
      const haystack = searchable([...Object.values(entry).flat(), ...Object.values(localized).flat()].join(" "));
      return groupMatch && (!query || haystack.includes(query));
    });

    const grid = document.querySelector("#lexicon-grid");
    grid.replaceChildren();
    matches.forEach((entry) => grid.append(makeLexiconCard(entry)));
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = msg("lexicon.empty");
      grid.append(empty);
    }
    document.querySelector("#lexicon-count").textContent = msg("lexicon.count", { count: matches.length, total: lexicon.length });
  }

  document.querySelector("#lexicon-search")?.addEventListener("input", renderLexicon);
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeLexiconFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      renderLexicon();
      markTask("lexicon");
    });
  });
  renderLexicon();

  window.addEventListener("atlas:languagechange", () => {
    updateJourney();
    applyMotionMode();
    shellStates.forEach((_, index) => renderShell(index));
    updateShellReadout();
    if (setA || setB) updatePairLedger(true);
    renderTokenWindow(currentTokens);
    if (document.querySelector("#matrix-output .matrix-cell")) runAttention(false);
    renderAtlas(activeAtlasKey);
    if (crosswalkTested) document.querySelector("#crosswalk-result").textContent = msg("crosswalk.result");
    updateAuthorityReveal(false);
    renderLexicon();
  });

  // Archive reset.
  document.querySelector("#reset-journey")?.addEventListener("click", () => {
    try {
      Object.values(storageKeys).forEach((key) => sessionStorage.removeItem(key));
    } catch {
      // State also resets in memory below.
    }
    visited.clear();
    completedTasks.clear();
    updateJourney();
    announce(msg("journey.reset"));
    document.querySelector("#threshold")?.scrollIntoView({ behavior: stillMode ? "auto" : "smooth" });
  });
})();
