const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const supportsPassiveEvents = (() => {
  if (typeof window === "undefined") return false;
  let supported = false;
  const listener = () => {};

  try {
    const options = Object.defineProperty({}, "passive", {
      get() {
        supported = true;
        return true;
      }
    });
    window.addEventListener("scroll-media-passive-test", listener, options);
    window.removeEventListener("scroll-media-passive-test", listener, options);
  } catch {
    supported = false;
  }

  return supported;
})();

let currentInstance = null;

function sceneProgress(scene, viewportHeight) {
  const rect = scene.getBoundingClientRect();

  if (rect.height <= viewportHeight) {
    return clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
  }

  return clamp(-rect.top / Math.max(1, rect.height - viewportHeight));
}

function setMediaState(element, state) {
  element.dataset.mediaState = state;
}

function createPosterFallback(video, scene) {
  const poster =
    video.getAttribute("poster") || video.dataset.poster || scene.dataset.poster;

  if (!poster) return null;

  const existing = video.nextElementSibling;
  if (existing?.hasAttribute("data-scroll-media-poster")) return existing;

  const image = document.createElement("img");
  image.className = "scroll-media-poster";
  image.setAttribute("data-scroll-media-poster", "");
  if (video.id) image.dataset.scrollPosterFor = video.id;
  image.src = poster;
  image.alt = video.dataset.posterAlt || scene.dataset.posterAlt || "";
  image.decoding = "async";
  image.loading = "eager";
  image.hidden = true;

  if (!image.alt) image.setAttribute("aria-hidden", "true");
  video.insertAdjacentElement("afterend", image);
  return image;
}

function activateDeferredSources(video) {
  let changed = false;

  if (video.dataset.scrollSrc && !video.getAttribute("src")) {
    video.src = video.dataset.scrollSrc;
    changed = true;
  }

  video.querySelectorAll("source[data-src]").forEach((source) => {
    if (!source.getAttribute("src")) {
      source.src = source.dataset.src;
      changed = true;
    }
  });

  if (changed) video.load();
}

function createVideoController(video, scene, isStatic) {
  const poster = createPosterFallback(video, scene);
  const originalHidden = video.hidden;
  const originalPreload = video.getAttribute("preload");
  let duration = 0;
  let ready = false;
  let failed = false;
  let active = false;
  let destroyed = false;
  let pendingProgress = 0;
  let lastTargetTime = -1;

  video.pause();
  video.playsInline = true;
  video.preload = isStatic() ? "none" : originalPreload || "metadata";
  setMediaState(video, "loading");

  function showPoster(show) {
    if (!poster) return;
    poster.hidden = !show;
    video.hidden = show ? true : originalHidden;
  }

  function updateReadiness() {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    ready =
      duration > 0 &&
      video.readyState >= HTMLMediaElement.HAVE_METADATA &&
      (video.seekable.length > 0 ||
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);

    if (ready) {
      failed = false;
      showPoster(false);
      setMediaState(video, "ready");
      seek(pendingProgress);
    }
  }

  function seek(progress) {
    pendingProgress = clamp(progress);
    if (destroyed || failed || !active || isStatic() || !ready) return;

    const target = pendingProgress * Math.max(0, duration - 0.04);
    if (
      Math.abs(target - lastTargetTime) < 1 / 60 ||
      Math.abs(target - video.currentTime) < 1 / 60
    ) {
      return;
    }

    lastTargetTime = target;
    try {
      video.currentTime = target;
    } catch {
      // A later media readiness event will retry the latest requested position.
    }
  }

  function handleError() {
    failed = true;
    ready = false;
    video.pause();
    showPoster(true);
    setMediaState(video, "fallback");
    scene.classList.add("has-scroll-media-fallback");
  }

  const readinessEvents = [
    "loadedmetadata",
    "loadeddata",
    "durationchange",
    "canplay",
    "progress"
  ];
  readinessEvents.forEach((event) =>
    video.addEventListener(event, updateReadiness)
  );
  video.addEventListener("error", handleError);
  video.addEventListener("stalled", updateReadiness);

  updateReadiness();

  return {
    setActive(nextActive) {
      active = nextActive;
      video.pause();

      if (!active || isStatic()) return;
      video.preload = originalPreload || "auto";
      activateDeferredSources(video);
      updateReadiness();
      seek(pendingProgress);
    },

    update(progress) {
      seek(progress);
    },

    applyPreference() {
      video.pause();

      if (isStatic()) {
        video.preload = "none";
        showPoster(Boolean(poster));
        setMediaState(video, "static");
        return;
      }

      video.preload = originalPreload || "auto";
      showPoster(false);
      setMediaState(video, ready ? "ready" : "loading");
      if (active) {
        activateDeferredSources(video);
        updateReadiness();
        seek(pendingProgress);
      }
    },

    destroy() {
      destroyed = true;
      readinessEvents.forEach((event) =>
        video.removeEventListener(event, updateReadiness)
      );
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", updateReadiness);
      video.pause();
      video.hidden = originalHidden;

      if (originalPreload === null) {
        video.removeAttribute("preload");
      } else {
        video.setAttribute("preload", originalPreload);
      }

      poster?.remove();
      delete video.dataset.mediaState;
    }
  };
}

function sequenceUrl(template, index, host) {
  const start = Number.parseInt(host.dataset.frameStart || "1", 10);
  const frameNumber = index + (Number.isFinite(start) ? start : 1);
  const explicitPadding = Number.parseInt(host.dataset.framePadding || "0", 10);

  const format = (value, inlinePadding = "") => {
    const width = inlinePadding
      ? inlinePadding.length
      : Number.isFinite(explicitPadding)
        ? explicitPadding
        : 0;
    return String(value).padStart(width, "0");
  };

  return template
    .replace(/\{frame(?::(0+))?\}/g, (_, padding) =>
      format(frameNumber, padding)
    )
    .replace(/\{index(?::(0+))?\}/g, (_, padding) => format(index, padding))
    .replace(/%0(\d+)d/g, (_, width) =>
      String(frameNumber).padStart(Number(width), "0")
    )
    .replace(/%d/g, String(frameNumber));
}

function drawImageToCanvas(context, canvas, image, fit) {
  const width = canvas.width;
  const height = canvas.height;
  if (!width || !height || !image.naturalWidth || !image.naturalHeight) return;

  const scale =
    fit === "contain"
      ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
      : Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function createSequenceController(host, canvas, scene, isStatic, schedule) {
  const template = host.dataset.sequenceTemplate;
  const frameCount = Number.parseInt(
    host.dataset.frameCount || scene.dataset.frameCount || "0",
    10
  );
  const context = canvas.getContext("2d", { alpha: true });
  const fit = host.dataset.sequenceFit === "contain" ? "contain" : "cover";
  const radius = clamp(
    Number.parseInt(host.dataset.prefetchRadius || "3", 10) || 3,
    1,
    8
  );
  const images = new Map();
  const loading = new Set();
  let active = false;
  let destroyed = false;
  let targetIndex = 0;
  let renderedIndex = -1;
  let previousTarget = 0;
  let sizeDirty = true;

  if (!template || !context || !Number.isFinite(frameCount) || frameCount < 1) {
    setMediaState(canvas, "fallback");
    return null;
  }

  if (!canvas.hasAttribute("aria-label") && !canvas.hasAttribute("aria-hidden")) {
    const description =
      host.dataset.sequenceAlt || scene.dataset.sequenceAlt || "";
    if (description) {
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", description);
    } else {
      canvas.setAttribute("aria-hidden", "true");
    }
  }

  setMediaState(canvas, "loading");

  function resize() {
    if (!sizeDirty) return;
    sizeDirty = false;

    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      renderedIndex = -1;
    }
  }

  function nearestLoadedFrame(index) {
    if (images.has(index)) return index;

    for (let distance = 1; distance < frameCount; distance += 1) {
      const lower = index - distance;
      const upper = index + distance;
      if (lower >= 0 && images.has(lower)) return lower;
      if (upper < frameCount && images.has(upper)) return upper;
    }

    return -1;
  }

  function render() {
    resize();
    const frame = nearestLoadedFrame(targetIndex);
    if (frame < 0 || frame === renderedIndex) return;

    drawImageToCanvas(context, canvas, images.get(frame), fit);
    renderedIndex = frame;
    setMediaState(canvas, "ready");
  }

  function loadFrame(index) {
    if (
      destroyed ||
      index < 0 ||
      index >= frameCount ||
      images.has(index) ||
      loading.has(index)
    ) {
      return;
    }

    loading.add(index);
    const image = new Image();
    image.decoding = "async";

    image.addEventListener(
      "load",
      () => {
        loading.delete(index);
        if (destroyed) return;
        images.set(index, image);
        if (index === targetIndex || renderedIndex < 0) schedule();
      },
      { once: true }
    );

    image.addEventListener(
      "error",
      () => {
        loading.delete(index);
        if (index === 0 && images.size === 0) {
          setMediaState(canvas, "fallback");
          scene.classList.add("has-scroll-media-fallback");
        }
      },
      { once: true }
    );

    image.src = sequenceUrl(template, index, host);
  }

  function preloadNearby() {
    loadFrame(targetIndex);
    if (isStatic() || !active) return;

    const direction = targetIndex >= previousTarget ? 1 : -1;
    for (let offset = 1; offset <= radius; offset += 1) {
      loadFrame(targetIndex + offset * direction);
      loadFrame(targetIndex - offset * direction);
    }
  }

  loadFrame(0);

  return {
    setActive(nextActive) {
      active = nextActive;
      if (active) {
        preloadNearby();
        schedule();
      }
    },

    update(progress) {
      previousTarget = targetIndex;
      targetIndex = isStatic()
        ? 0
        : clamp(Math.round(progress * (frameCount - 1)), 0, frameCount - 1);

      if (active || targetIndex === 0) preloadNearby();
      render();
    },

    resize() {
      sizeDirty = true;
      if (active) schedule();
    },

    applyPreference() {
      if (isStatic()) targetIndex = 0;
      preloadNearby();
      schedule();
    },

    destroy() {
      destroyed = true;
      images.clear();
      loading.clear();
      delete canvas.dataset.mediaState;
    }
  };
}

function sequenceHosts(scene) {
  const hosts = [];
  if (scene.hasAttribute("data-sequence-template")) hosts.push(scene);
  hosts.push(...scene.querySelectorAll("[data-sequence-template]"));
  return [...new Set(hosts)];
}

function canvasForSequence(host, scene) {
  if (host instanceof HTMLCanvasElement) return host;

  const existing =
    host.querySelector("canvas[data-scroll-sequence]") ||
    (host === scene
      ? scene.querySelector("canvas[data-scroll-sequence]")
      : host.querySelector("canvas"));
  if (existing) return existing;

  const canvas = document.createElement("canvas");
  canvas.dataset.scrollSequence = "";
  canvas.className = "scroll-image-sequence";
  host.prepend(canvas);
  return canvas;
}

/**
 * Enhances data-scroll-scene elements without changing native scrolling.
 *
 * Video markup:
 *   <section data-scroll-scene>
 *     <video data-scroll-video poster="still.webp">...</video>
 *   </section>
 *
 * Sequence markup:
 *   <canvas data-sequence-template="frames/frame-{frame:0000}.webp"
 *           data-frame-count="48"></canvas>
 *
 * @param {{ root?: Document|Element, observerMargin?: string }} options
 * @returns {{ refresh: Function, destroy: Function, isStatic: Function }}
 */
export function initScrollMedia(options = {}) {
  if (currentInstance) return currentInstance;
  if (typeof document === "undefined" || typeof window === "undefined") {
    return {
      refresh() {},
      destroy() {},
      isStatic: () => true
    };
  }

  const root = options.root || document;
  const scenes = [...root.querySelectorAll("[data-scroll-scene]")];
  if (!scenes.length) {
    return {
      refresh() {},
      destroy() {},
      isStatic: () => false
    };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let saveData = Boolean(connection?.saveData);
  let frameRequest = 0;
  let destroyed = false;
  let resizeDirty = true;

  const isStatic = () => reducedMotion.matches || saveData;
  const schedule = () => {
    if (!destroyed && !frameRequest) {
      frameRequest = window.requestAnimationFrame(update);
    }
  };

  const records = scenes.map((scene) => {
    const videos = [...scene.querySelectorAll("[data-scroll-video]")].map(
      (video) => createVideoController(video, scene, isStatic)
    );
    const sequences = sequenceHosts(scene)
      .map((host) =>
        createSequenceController(
          host,
          canvasForSequence(host, scene),
          scene,
          isStatic,
          schedule
        )
      )
      .filter(Boolean);

    scene.style.setProperty("--scene-progress", "0");
    return {
      scene,
      videos,
      sequences,
      active: false,
      progress: 0
    };
  });

  function setActive(record, active) {
    if (record.active === active) return;
    record.active = active;
    record.scene.classList.toggle("is-scroll-scene-active", active);
    record.videos.forEach((video) => video.setActive(active));
    record.sequences.forEach((sequence) => sequence.setActive(active));
    if (active) schedule();
  }

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const record = records.find(({ scene }) => scene === entry.target);
              if (record) setActive(record, entry.isIntersecting);
            });
          },
          {
            root: null,
            rootMargin: options.observerMargin || "15% 0px 15% 0px",
            threshold: 0
          }
        )
      : null;

  records.forEach((record) => {
    if (observer) {
      observer.observe(record.scene);
    } else {
      setActive(record, true);
    }
  });

  function update() {
    frameRequest = 0;
    if (destroyed) return;

    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 1;
    const measurements = records.map((record) => ({
      record,
      progress: sceneProgress(record.scene, viewportHeight)
    }));

    measurements.forEach(({ record, progress }) => {
      record.progress = progress;
      record.scene.style.setProperty("--scene-progress", progress.toFixed(4));

      if (!record.active && !isStatic()) return;
      record.videos.forEach((video) => video.update(progress));
      record.sequences.forEach((sequence) => sequence.update(progress));
    });

    if (resizeDirty) {
      resizeDirty = false;
      records.forEach((record) =>
        record.sequences.forEach((sequence) => sequence.resize())
      );
    }
  }

  function handleResize() {
    resizeDirty = true;
    schedule();
  }

  function applyPreference() {
    saveData = Boolean(connection?.saveData);
    document.documentElement.classList.toggle(
      "scroll-media-static",
      isStatic()
    );
    records.forEach((record) => {
      record.videos.forEach((video) => video.applyPreference());
      record.sequences.forEach((sequence) => sequence.applyPreference());
    });
    schedule();
  }

  const passive = supportsPassiveEvents ? { passive: true } : false;
  window.addEventListener("scroll", schedule, passive);
  window.addEventListener("resize", handleResize, passive);
  window.addEventListener("orientationchange", handleResize, passive);

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", applyPreference);
  } else {
    reducedMotion.addListener(applyPreference);
  }

  connection?.addEventListener?.("change", applyPreference);
  document.documentElement.classList.add("scroll-media-enhanced");
  applyPreference();
  schedule();

  currentInstance = {
    refresh() {
      handleResize();
    },

    isStatic,

    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (frameRequest) window.cancelAnimationFrame(frameRequest);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule, passive);
      window.removeEventListener("resize", handleResize, passive);
      window.removeEventListener("orientationchange", handleResize, passive);

      if (typeof reducedMotion.removeEventListener === "function") {
        reducedMotion.removeEventListener("change", applyPreference);
      } else {
        reducedMotion.removeListener(applyPreference);
      }

      connection?.removeEventListener?.("change", applyPreference);
      records.forEach((record) => {
        record.videos.forEach((video) => video.destroy());
        record.sequences.forEach((sequence) => sequence.destroy());
        record.scene.classList.remove("is-scroll-scene-active");
        record.scene.style.removeProperty("--scene-progress");
      });
      document.documentElement.classList.remove(
        "scroll-media-enhanced",
        "scroll-media-static"
      );
      currentInstance = null;
    }
  };

  return currentInstance;
}
