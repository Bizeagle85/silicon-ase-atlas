(() => {
  "use strict";

  const STORAGE_KEY = "axis-atlas-language-v1";
  const SUPPORTED_LOCALES = ["en", "es", "pt-BR", "it"];
  const catalogs = {
    es: window.ATLAS_TRANSLATIONS_ES || null,
    "pt-BR": window.ATLAS_TRANSLATIONS_PT_BR || null,
    it: window.ATLAS_TRANSLATIONS_IT || null
  };

  const defaultMessages = {
    "journey.completeTitle": "The complete path has been viewed",
    "journey.completeCopy": "All eight sections were opened in this browser session. The record is local and can be reset at any time.",
    "journey.openTitle": "The archive is open",
    "journey.remainingOne": "{count} section remains. Nothing is locked; the path is a reading aid, not an initiation hierarchy.",
    "journey.remainingMany": "{count} sections remain. Nothing is locked; the path is a reading aid, not an initiation hierarchy.",
    "motion.enable": "Enable motion",
    "motion.still": "Still mode",
    "motion.paused": "Motion paused.",
    "motion.enabled": "Motion enabled.",
    "shell.stateA": "orientation A",
    "shell.stateB": "orientation B",
    "shell.unset": "unset",
    "shell.objectAria": "Study object {index}, {state}. Activate to change.",
    "shell.objectTitle": "Object {index}: {state}",
    "shell.unsetCount": "{count} unset",
    "shell.remainingOne": "{count} state remains unset.",
    "shell.remainingMany": "{count} states remain unset.",
    "shell.completePattern": "Complete neutral pattern {pattern}. Ready to record as set A or B.",
    "shell.pairStatus": "Two count categories recorded. Index {index} is a software address, not an odù or interpretation.",
    "shell.pairAnnounce": "Sets A and B recorded as the neutral ordered pair {a}, {b}. No interpretation generated.",
    "shell.simulated": "Sixteen neutral binary states were simulated locally.",
    "shell.cleared": "The sixteen-object editor was cleared.",
    "shell.cannotRecordOne": "Cannot record set {which}: {count} state is unset.",
    "shell.cannotRecordMany": "Cannot record set {which}: {count} states are unset.",
    "shell.incompleteAnnounce": "Set {which} was not recorded because the pattern is incomplete.",
    "token.unitTitle": "Unit {index}: {token}",
    "token.foundOne": "{count} demonstration unit found; {loaded} loaded into the finite window.",
    "token.foundMany": "{count} demonstration units found; {loaded} loaded into the finite window.",
    "token.none": "No units were found. Type ordinary study text first.",
    "token.cleared": "The local text field was cleared.",
    "attention.cellLabel": "row {row} → value {column}",
    "attention.aria": "Attention weights {weights}. Context vectors {vectors}.",
    "attention.calculated": "The two-by-two attention matrix was calculated. Each row sums to one.",
    "atlas.measure": "measure {index}",
    "atlas.letter": "letter {index}",
    "atlas.boundaryLabel": "Boundary: ",
    "atlas.diagramAria": "{label}: {cardinality}. Abstract software indexing only.",
    "crosswalk.result": "No exact crosswalk exists: 32 joins two typed classes by addition; 256 enumerates ordered pairs by Cartesian product. Cardinality and relation type both differ.",
    "crosswalk.announce": "The crosswalk failed for both cardinality and type. No invented correspondences were added.",
    "authority.completeHtml": "<p><strong>Complete:</strong> form makes the system operable; evidence makes claims accountable; people retain consent, interpretation, authority, and responsibility. None of these engineering layers proves or manufactures <i lang='yo'>àṣẹ</i>.</p>",
    "authority.completeAnnounce": "All three responsibility layers are present. The app keeps spiritual authority outside the software.",
    "authority.remainingOne": "{count} layer remains. Computation alone cannot supply the missing governance.",
    "authority.remainingMany": "{count} layers remain. Computation alone cannot supply the missing governance.",
    "lexicon.languagePrefix": "EN",
    "lexicon.documented": "Documented definition",
    "lexicon.comparison": "Situated comparison",
    "lexicon.analogy": "Permitted analogy",
    "lexicon.boundary": "Do not equate",
    "lexicon.empty": "No entries match this search. Try a broader term or select All.",
    "lexicon.count": "{count} of {total} controlled entries",
    "journey.reset": "The local study path was reset."
  };

  const originalTextNodes = [];
  const originalAttributes = [];
  const attributeNames = ["aria-label", "placeholder", "title"];
  let locale = "en";

  function isTranslatable(value) {
    return /[A-Za-zÀ-žỌọẸẹṢṣ]/u.test(value);
  }

  function format(template, values = {}) {
    return String(template).replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
    ));
  }

  function activeCatalog() {
    return locale === "en" ? null : catalogs[locale];
  }

  function text(source) {
    if (locale === "en") return source;
    return activeCatalog()?.strings?.[source] ?? source;
  }

  function message(key, values = {}, fallback = defaultMessages[key] ?? key) {
    const template = activeCatalog()?.messages?.[key] ?? defaultMessages[key] ?? fallback;
    return format(template, values);
  }

  function localizedAtlasData(key, base) {
    const translated = activeCatalog()?.atlasData?.[key];
    return translated ? { ...base, ...translated } : base;
  }

  function localizedLexicon(term) {
    return activeCatalog()?.lexicon?.[term] || null;
  }

  function captureStaticContent(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, noscript, template, .display-equation, [data-i18n-skip]")) continue;
      const source = node.nodeValue.trim();
      if (!source || !isTranslatable(source)) continue;
      originalTextNodes.push({ node, source, leading: node.nodeValue.match(/^\s*/)?.[0] || "", trailing: node.nodeValue.match(/\s*$/)?.[0] || "" });
    }

    root.querySelectorAll?.("*").forEach((element) => {
      if (element.closest("[data-i18n-skip]")) return;
      attributeNames.forEach((name) => {
        if (!element.hasAttribute(name)) return;
        const source = element.getAttribute(name);
        if (!source || !isTranslatable(source)) return;
        originalAttributes.push({ element, name, source });
      });
    });

    const description = root.querySelector?.('meta[name="description"]');
    if (description?.content && isTranslatable(description.content)) {
      originalAttributes.push({ element: description, name: "content", source: description.content });
    }
  }

  function applyStaticTranslations() {
    originalTextNodes.forEach(({ node, source, leading, trailing }) => {
      if (!node.isConnected) return;
      node.nodeValue = `${leading}${text(source)}${trailing}`;
    });
    originalAttributes.forEach(({ element, name, source }) => {
      if (element.isConnected) element.setAttribute(name, text(source));
    });
  }

  function audit(targetLocale) {
    const catalog = targetLocale === "en" ? null : catalogs[targetLocale];
    if (targetLocale === "en") return { locale: targetLocale, missingStrings: [], missingMessages: [], placeholderMismatches: [] };
    const sources = new Set([
      ...originalTextNodes.map(({ source }) => source),
      ...originalAttributes.map(({ source }) => source)
    ]);
    const placeholders = (template) => [...String(template).matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]).sort();
    const placeholderMismatches = Object.keys(defaultMessages).flatMap((key) => {
      const translated = catalog?.messages?.[key];
      if (typeof translated !== "string") return [];
      const expected = placeholders(defaultMessages[key]);
      const actual = placeholders(translated);
      return expected.join("|") === actual.join("|") ? [] : [{ key, expected, actual }];
    });
    return {
      locale: targetLocale,
      missingStrings: [...sources].filter((source) => !Object.prototype.hasOwnProperty.call(catalog?.strings || {}, source)).sort(),
      missingMessages: Object.keys(defaultMessages).filter((key) => !Object.prototype.hasOwnProperty.call(catalog?.messages || {}, key)).sort(),
      placeholderMismatches
    };
  }

  function setLanguage(nextLocale, options = {}) {
    locale = SUPPORTED_LOCALES.includes(nextLocale) ? nextLocale : "en";
    document.documentElement.lang = locale;
    const selector = document.querySelector("#language-select");
    if (selector) selector.value = locale;
    try {
      sessionStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Language selection still works if browser storage is disabled.
    }
    applyStaticTranslations();
    if (options.dispatch !== false) {
      window.dispatchEvent(new CustomEvent("atlas:languagechange", { detail: { locale } }));
    }
  }

  captureStaticContent(document);
  let initialLocale = "en";
  try {
    initialLocale = sessionStorage.getItem(STORAGE_KEY) || "en";
  } catch {
    initialLocale = "en";
  }

  window.AtlasI18n = {
    supportedLocales: [...SUPPORTED_LOCALES],
    get locale() { return locale; },
    setLanguage,
    text,
    message,
    localizedAtlasData,
    localizedLexicon,
    applyStaticTranslations,
    audit
  };

  document.querySelector("#language-select")?.addEventListener("change", (event) => {
    setLanguage(event.currentTarget.value);
  });
  setLanguage(initialLocale, { dispatch: false });
})();
