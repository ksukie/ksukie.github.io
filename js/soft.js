const GITHUB_USER = "ksukie";
const root = document.documentElement;
const toast = document.querySelector(".toast");

const projectData = [
  {
    title: "VTLA LeRobot",
    shortTitle: "VTLA LeRobot",
    category: "Robot",
    status: "Private",
    tags: ["VLA", "LeRobot", "Tactile"],
    summary: "视觉-触觉机器人学习与真机训练推理栈。",
    detail: "基于 LeRobot 构建数据采集、训练、推理和真机验证流程。",
    trail: [
      ["Input", "Piper 与触觉相机接入"],
      ["Data", "episode 录制与回放"],
      ["Policy", "训练、推理、真机验证"]
    ],
    private: true
  },
  {
    title: "WildfireAegis",
    shortTitle: "WildfireAegis",
    category: "Vision",
    status: "Public",
    tags: ["YOLO", "TensorRT", "Jetson"],
    summary: "森林火灾检测、端侧部署与 Web 预警系统。",
    detail: "完成火焰 / 烟雾检测、TensorRT 推理、Jetson 部署和控制台联动。",
    trail: [
      ["Detect", "火焰 / 烟雾检测"],
      ["Optimize", "ONNX / TensorRT"],
      ["Deploy", "Jetson 与 Web 控制台"]
    ],
    url: "https://github.com/ksukie/WildfireAegis"
  },
  {
    title: "VectorMotionTrack",
    shortTitle: "VectorMotionTrack",
    category: "Edge",
    status: "Private",
    tags: ["Optical Flow", "INT8", "Deploy"],
    summary: "双帧运动向量预测与端侧量化部署。",
    detail: "面向微小位移估计，完成 FP16 / INT8 量化和推理一致性检查。",
    trail: [
      ["Frame", "双帧 RGB 输入"],
      ["Quant", "FP16 / INT8 量化"],
      ["Check", "端侧一致性验证"]
    ],
    private: true
  },
  {
    title: "VisionDot",
    shortTitle: "VisionDot",
    category: "Edge",
    status: "Private",
    tags: ["OpenCV", "RV1126B", "RK3588"],
    summary: "五路相机标记点检测与边缘实时追踪。",
    detail: "覆盖摄像头接入、标记点检测、现场校准、日志分析和性能基准。",
    trail: [
      ["Capture", "多路相机接入"],
      ["Track", "检测、追踪、校准"],
      ["Bench", "日志与性能基准"]
    ],
    private: true
  }
];

function updateIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupNavHanger() {
  const header = document.querySelector(".site-header");
  const hanger = document.querySelector(".nav-hanger");
  if (!header || !hanger) return;

  let hoverOpen = false;
  let clickTimer = 0;

  const sync = () => {
    const isOpen = hoverOpen;
    header.classList.toggle("is-hanger-open", isOpen);
    hanger.classList.toggle("is-hanger-open", isOpen);
    hanger.setAttribute("aria-expanded", String(isOpen));
  };

  hanger.addEventListener("mouseenter", () => {
    hoverOpen = true;
    sync();
  });
  hanger.addEventListener("mouseleave", () => {
    hoverOpen = false;
    sync();
  });
  hanger.addEventListener("focus", () => {
    hoverOpen = true;
    sync();
  });
  hanger.addEventListener("blur", () => {
    hoverOpen = false;
    sync();
  });
  hanger.addEventListener("click", () => {
    hanger.classList.add("is-clicking");
    window.clearTimeout(clickTimer);
    clickTimer = window.setTimeout(() => {
      hanger.classList.remove("is-clicking");
    }, 180);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupResponsiveScale() {
  const baseWidth = 1920;
  const baseHeight = 1080;
  const baseVisualScale = 0.75;
  const desktopBreakpoint = 981;
  const scaledPixels = [
    -26, -16, -13, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13.5, 14, 14.5, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 46,
    48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 69, 70, 72, 76, 78, 82, 84, 86, 88, 90, 92,
    94, 96, 104, 106, 108, 110, 112, 116, 118, 120, 124, 132, 136, 138, 141, 142, 150, 154,
    156, 168, 184, 190, 192, 196, 205, 208, 210, 220, 235, 240, 260, 280, 292, 300, 322,
    340, 360, 390, 406, 420, 430, 438, 460, 520, 560, 600, 616, 620, 680, 730, 760, 784, 858,
    860, 876, 880, 920, 1060, 1080, 1120, 1134, 1180, 1280, 1360, 1640, 1720, 1880, 1960, 1980
  ];
  const baselinePixels = Array.from(new Set([
    ...scaledPixels,
    -52, 1, 2, 3, 4, 8.78, 10.98, 80, 126, 128, 146, 148, 180, 198, 216, 224, 230, 232, 252, 320,
    338, 380, 452, 580, 608, 700, 862, 900, 1040, 1194, 1247, 1408
  ]));

  const tokenFor = (value) => String(value).replace(".", "_");
  const cssPixels = (value) => `${Number(value.toFixed(3))}px`;
  const clampNumber = (min, value, max) => Math.min(Math.max(value, min), max);

  const update = () => {
    const isDesktop = window.innerWidth >= desktopBreakpoint;
    const rawScale = isDesktop ? Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight) : 1;
    const scale = isDesktop ? clampNumber(0.5, baseVisualScale * rawScale, 1.5) : 1;
    const baselineScale = isDesktop ? scale / baseVisualScale : 1;

    root.style.setProperty("--desktop-scale", scale.toFixed(4));
    root.style.setProperty("--show-scale", baselineScale.toFixed(4));
    root.dataset.desktopScale = scale.toFixed(4);
    root.dataset.showScale = baselineScale.toFixed(4);

    for (const value of scaledPixels) {
      root.style.setProperty(`--rs-${tokenFor(value)}`, cssPixels(value * scale));
    }

    for (const value of baselinePixels) {
      root.style.setProperty(`--srs-${tokenFor(value)}`, cssPixels(value * baselineScale));
    }
  };

  let resizeFrame = 0;
  const scheduleUpdate = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate);
}

function setupPageSnap() {
  const settleDelay = 90;
  const wheelIntentThreshold = 12;
  let snapTimer = 0;
  let wheelIntentTimer = 0;
  let wheelIntentDelta = 0;
  let lastDirection = 0;
  let isSnapping = false;
  let intentOriginPage = null;
  let intentDirection = 0;
  let touchStartY = 0;

  const snapOffset = 0;

  const getPages = () => Array.from(document.querySelectorAll(
    "#top.hero, #top > .hero, .hero-bridge, #profile, .life-bridge, #life, #projects, #repos, .contact-bridge, #contact"
  ))
    .sort((a, b) => (
      a.getBoundingClientRect().top + window.scrollY -
      (b.getBoundingClientRect().top + window.scrollY)
    ));

  const getVisibleHeight = (page) => {
    const rect = page.getBoundingClientRect();
    const viewportTop = snapOffset;
    const viewportBottom = window.innerHeight;
    return Math.max(0, Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop));
  };

  const getPageTop = (page) => (
    Math.max(0, page.getBoundingClientRect().top + window.scrollY - snapOffset)
  );

  const getNearestPage = () => {
    return getPages()
      .map((page) => ({
        page,
        distance: Math.abs(getPageTop(page) - window.scrollY)
      }))
      .sort((a, b) => a.distance - b.distance)[0]?.page || null;
  };

  const canScrollInside = (node, direction) => {
    let current = node instanceof Element ? node : node?.parentElement;
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const canScrollY = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight + 2;
      if (canScrollY) {
        const atTop = current.scrollTop <= 2;
        const atBottom = current.scrollTop + current.clientHeight >= current.scrollHeight - 2;
        if ((direction < 0 && !atTop) || (direction > 0 && !atBottom)) return true;
      }
      current = current.parentElement;
    }
    return false;
  };

  const scrollToPage = (page) => {
    const targetTop = getPageTop(page);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isSnapping = true;
    intentOriginPage = null;
    intentDirection = 0;
    window.scrollTo({ top: targetTop, behavior: reduceMotion ? "auto" : "smooth" });
    window.setTimeout(() => {
      isSnapping = false;
    }, reduceMotion ? 80 : 620);
  };

  const getDominantPage = () => {
    const pages = getPages();
    return pages
      .map((page) => ({
        page,
        visible: getVisibleHeight(page)
      }))
      .filter((item) => item.visible > 0)
      .sort((a, b) => (
        b.visible - a.visible ||
        (lastDirection >= 0 ? pages.indexOf(b.page) - pages.indexOf(a.page) : pages.indexOf(a.page) - pages.indexOf(b.page))
      ))[0]?.page || null;
  };

  const rememberIntent = (direction) => {
    if (!direction || isSnapping) return;
    if (!intentOriginPage) intentOriginPage = getNearestPage() || getDominantPage();
    intentDirection = direction;
  };

  const getIntentPage = () => {
    if (!intentOriginPage || !intentDirection) return null;
    const pages = getPages();
    const originIndex = pages.indexOf(intentOriginPage);
    if (originIndex < 0) return null;
    const targetIndex = Math.min(
      pages.length - 1,
      Math.max(0, originIndex + (intentDirection > 0 ? 1 : -1))
    );
    return pages[targetIndex] || null;
  };

  const settle = () => {
    if (isSnapping) return;
    const candidate = getIntentPage() || getDominantPage();
    intentOriginPage = null;
    intentDirection = 0;
    if (!candidate) return;
    const candidateTop = getPageTop(candidate);
    if (Math.abs(candidateTop - window.scrollY) <= 2) return;
    scrollToPage(candidate);
  };

  const snapFromInput = (direction) => {
    window.clearTimeout(snapTimer);
    intentOriginPage = getNearestPage() || getDominantPage();
    intentDirection = direction;
    settle();
  };

  const scheduleSettle = (delay = settleDelay) => {
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(settle, delay);
  };

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const delta = window.scrollY - lastScrollY;
    if (Math.abs(delta) > 1) lastDirection = delta > 0 ? 1 : -1;
    lastScrollY = window.scrollY;
    if (!isSnapping) scheduleSettle();
  }, { passive: true });

  window.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    if (!event.deltaY) return;
    lastDirection = event.deltaY > 0 ? 1 : -1;
    if (canScrollInside(event.target, lastDirection)) return;
    event.preventDefault();
    if (isSnapping) return;
    if (Math.sign(wheelIntentDelta) !== Math.sign(event.deltaY)) wheelIntentDelta = 0;
    wheelIntentDelta += event.deltaY;
    window.clearTimeout(wheelIntentTimer);
    wheelIntentTimer = window.setTimeout(() => {
      wheelIntentDelta = 0;
    }, 160);
    if (Math.abs(wheelIntentDelta) < wheelIntentThreshold) return;
    wheelIntentDelta = 0;
    snapFromInput(lastDirection);
  }, { passive: false });

  window.addEventListener("touchstart", (event) => {
    touchStartY = event.touches?.[0]?.clientY || 0;
    intentOriginPage = getNearestPage() || getDominantPage();
  }, { passive: true });
  window.addEventListener("touchend", (event) => {
    const touchEndY = event.changedTouches?.[0]?.clientY || touchStartY;
    const deltaY = touchStartY - touchEndY;
    if (Math.abs(deltaY) > 18) {
      lastDirection = deltaY > 0 ? 1 : -1;
      rememberIntent(lastDirection);
      scheduleSettle(40);
      return;
    }
    scheduleSettle();
  }, { passive: true });
  window.addEventListener("scrollend", () => scheduleSettle(0), { passive: true });
  window.addEventListener("resize", () => scheduleSettle(180), { passive: true });
}


function setupLifeArchive() {
  const stage = document.querySelector("[data-life-stage]");
  if (!stage) return;
  const track = stage.querySelector("[data-life-track]");
  const slides = Array.from(stage.querySelectorAll("[data-life-slide]"));
  const dots = stage.querySelectorAll("[data-life-dot]");
  const prev = stage.querySelector("[data-life-prev]");
  const next = stage.querySelector("[data-life-next]");
  const count = document.querySelector("[data-life-count]");
  const caption = document.querySelector("[data-life-current-caption]");
  const artists = document.querySelectorAll("[data-artist]");
  const trackPanel = document.querySelector("[data-track-panel]");
  const order = slides.map((slide) => slide.dataset.lifeSlide);
  let firstLifeClone = null;
  let lastLifeClone = null;
  let activeIndex = 0;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let dragging = false;
  let wheelLocked = false;
  let isWrappingLife = false;
  let wrapResetTimer = 0;
  let trackCloudFrame = 0;
  let activeTrackCloud = null;
  let trackCloudResizeTimer = 0;

  if (track && slides.length) {
    lastLifeClone = slides[slides.length - 1].cloneNode(true);
    lastLifeClone.classList.remove("is-active");
    lastLifeClone.setAttribute("aria-hidden", "true");
    lastLifeClone.dataset.lifeClone = "last";
    lastLifeClone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    track.insertBefore(lastLifeClone, slides[0]);

    firstLifeClone = slides[0].cloneNode(true);
    firstLifeClone.classList.remove("is-active");
    firstLifeClone.setAttribute("aria-hidden", "true");
    firstLifeClone.dataset.lifeClone = "first";
    firstLifeClone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    track.appendChild(firstLifeClone);
  }

  const clampNumber = (value, min, max) => Math.min(Math.max(value, min), max);

  const stopTrackCloud = () => {
    if (trackCloudFrame) {
      window.cancelAnimationFrame(trackCloudFrame);
      trackCloudFrame = 0;
    }
  };

  const renderTrackCloudItems = (items) => {
    items.forEach((item) => {
      item.node.style.setProperty("--cloud-x", `${item.x.toFixed(2)}px`);
      item.node.style.setProperty("--cloud-y", `${item.y.toFixed(2)}px`);
    });
  };

  const keepTrackCloudInside = (item, width, height) => {
    item.x = clampNumber(item.x, 0, Math.max(0, width - item.width));
    item.y = clampNumber(item.y, 0, Math.max(0, height - item.height));
  };

  const resolveTrackCloudCollisions = (items, width, height, passes = 7) => {
    const gap = 4;
    for (let pass = 0; pass < passes; pass += 1) {
      for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) {
          const a = items[i];
          const b = items[j];
          const overlapX = Math.min(a.x + a.width + gap, b.x + b.width + gap) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + a.height + gap, b.y + b.height + gap) - Math.max(a.y, b.y);
          if (overlapX <= 0 || overlapY <= 0) continue;

          const horizontalDirection = a.x + a.width / 2 < b.x + b.width / 2 ? -1 : 1;
          const verticalDirection = a.y + a.height / 2 < b.y + b.height / 2 ? -1 : 1;
          const verticalBlocked = (
            (verticalDirection < 0 && a.y <= gap) ||
            (verticalDirection > 0 && b.y <= gap) ||
            (verticalDirection < 0 && b.y + b.height >= height - gap) ||
            (verticalDirection > 0 && a.y + a.height >= height - gap)
          );

          if (overlapX < overlapY || verticalBlocked) {
            const direction = horizontalDirection;
            const shift = overlapX / 2 + 0.8;
            a.x += direction * shift;
            b.x -= direction * shift;
            a.vx += direction * 0.08;
            b.vx -= direction * 0.08;
          } else {
            const direction = verticalDirection;
            const shift = overlapY / 2 + 0.8;
            a.y += direction * shift;
            b.y -= direction * shift;
            a.vy += direction * 0.08;
            b.vy -= direction * 0.08;
          }
        }
      }
      items.forEach((item) => keepTrackCloudInside(item, width, height));
    }
  };

  const buildTrackCloudRings = (nodes, width, height) => {
    const measured = nodes.map((node, index) => ({
      node,
      index,
      width: Math.ceil(node.offsetWidth),
      height: Math.ceil(node.offsetHeight),
      vx: 0,
      vy: 0,
      phase: index * 0.83,
      floatX: index % 2 === 0 ? 3.4 : -3.4,
      floatY: 2.2 + (index % 4) * 0.7
    }));

    const centerX = width / 2;
    const centerY = height / 2;
    const ringCounts = [1, 6, 13];
    const ringX = [0, width * 0.23, width * 0.39];
    const ringY = [0, height * 0.2, height * 0.38];
    let cursor = 0;

    ringCounts.forEach((count, ringIndex) => {
      const ringItems = measured.slice(cursor, cursor + count);
      cursor += count;
      const angleOffset = ringIndex === 1 ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / Math.max(6, count);

      ringItems.forEach((item, itemIndex) => {
        const angle = count === 1 ? 0 : angleOffset + (Math.PI * 2 * itemIndex) / count;
        item.baseX = centerX + Math.cos(angle) * ringX[ringIndex] - item.width / 2;
        item.baseY = centerY + Math.sin(angle) * ringY[ringIndex] - item.height / 2;
        item.baseX = clampNumber(item.baseX, 0, Math.max(0, width - item.width));
        item.baseY = clampNumber(item.baseY, 0, Math.max(0, height - item.height));
        item.x = item.baseX;
        item.y = item.baseY;
      });
    });

    measured.slice(cursor).forEach((item, overflowIndex) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * overflowIndex) / Math.max(1, measured.length - cursor);
      item.baseX = centerX + Math.cos(angle) * width * 0.44 - item.width / 2;
      item.baseY = centerY + Math.sin(angle) * height * 0.42 - item.height / 2;
      item.baseX = clampNumber(item.baseX, 0, Math.max(0, width - item.width));
      item.baseY = clampNumber(item.baseY, 0, Math.max(0, height - item.height));
      item.x = item.baseX;
      item.y = item.baseY;
    });

    return measured;
  };

  const layoutTrackCloud = (list) => {
    if (!list) return;
    stopTrackCloud();
    const nodes = Array.from(list.querySelectorAll("span"));
    if (!nodes.length) return;
    const width = list.clientWidth;
    const height = list.clientHeight;
    if (!width || !height) {
      window.requestAnimationFrame(() => layoutTrackCloud(list));
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = buildTrackCloudRings(nodes, width, height);
    const pointer = { x: width / 2, y: height / 2, active: false };
    activeTrackCloud = { list, items, pointer };
    resolveTrackCloudCollisions(items, width, height, 18);
    renderTrackCloudItems(items);

    if (list.cloudPointerMoveHandler) {
      list.removeEventListener("pointermove", list.cloudPointerMoveHandler);
    }
    if (list.cloudPointerLeaveHandler) {
      list.removeEventListener("pointerleave", list.cloudPointerLeaveHandler);
    }
    list.cloudPointerMoveHandler = (event) => {
      const rect = list.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      list.classList.add("is-reacting");
    };
    list.cloudPointerLeaveHandler = () => {
      pointer.active = false;
      list.classList.remove("is-reacting");
    };
    list.addEventListener("pointermove", list.cloudPointerMoveHandler, { passive: true });
    list.addEventListener("pointerleave", list.cloudPointerLeaveHandler, { passive: true });

    const animate = (time) => {
      if (!activeTrackCloud || activeTrackCloud.list !== list) return;
      const currentWidth = list.clientWidth;
      const currentHeight = list.clientHeight;
      const avoidRadius = Math.max(92, Math.min(currentWidth, currentHeight) * 0.34);
      items.forEach((item) => {
        const floatX = reduceMotion ? 0 : Math.sin(time / 1120 + item.phase) * item.floatX;
        const floatY = reduceMotion ? 0 : Math.cos(time / 1320 + item.phase) * item.floatY;
        const targetX = item.baseX + floatX;
        const targetY = item.baseY + floatY;
        item.vx += (targetX - item.x) * 0.045;
        item.vy += (targetY - item.y) * 0.045;
        if (pointer.active && !reduceMotion) {
          const centerX = item.x + item.width / 2;
          const centerY = item.y + item.height / 2;
          const deltaX = centerX - pointer.x;
          const deltaY = centerY - pointer.y;
          const distance = Math.max(1, Math.hypot(deltaX, deltaY));
          if (distance < avoidRadius) {
            const force = ((1 - distance / avoidRadius) ** 2) * 7.2;
            item.vx += (deltaX / distance) * force;
            item.vy += (deltaY / distance) * force;
          }
        }
        item.vx *= 0.78;
        item.vy *= 0.78;
        item.x += item.vx;
        item.y += item.vy;
        keepTrackCloudInside(item, currentWidth, currentHeight);
      });
      resolveTrackCloudCollisions(items, currentWidth, currentHeight, 18);
      renderTrackCloudItems(items);
      trackCloudFrame = window.requestAnimationFrame(animate);
    };

    trackCloudFrame = window.requestAnimationFrame(animate);
  };

  const renderTracks = (artist) => {
    if (!artist || !trackPanel) return;
    const songs = (artist.dataset.songs || "").split("|").filter(Boolean);
    const image = artist.querySelector("img");
    const imageSrc = image?.currentSrc || image?.getAttribute("src") || "";
    const imageAlt = image?.getAttribute("alt") || artist.dataset.artist || "Artist";
    trackPanel.innerHTML = `
      <div class="track-artist-visual">
        ${imageSrc ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(imageAlt)}" />` : ""}
      </div>
      <div class="track-panel-title">
        <span>Selected Artist</span>
        <strong>${escapeHtml(artist.dataset.artist)}</strong>
      </div>
      <div class="track-list">
        ${songs.map((song) => `<span>${escapeHtml(song)}</span>`).join("")}
      </div>
    `;
    window.requestAnimationFrame(() => {
      layoutTrackCloud(trackPanel.querySelector(".track-list"));
    });
  };

  const setActiveLife = (target, options = {}) => {
    if (isWrappingLife && !options.instant) return;
    const index = order.indexOf(target);
    if (index < 0) return;
    const previousIndex = activeIndex;
    const shouldWrapForward = (
      options.direction === "next" &&
      previousIndex === order.length - 1 &&
      index === 0 &&
      track &&
      firstLifeClone
    );
    const shouldWrapBackward = (
      options.direction === "prev" &&
      previousIndex === 0 &&
      index === order.length - 1 &&
      track &&
      lastLifeClone
    );
    activeIndex = index;
    const slide = slides[index];

    slides.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
    });
    dots.forEach((dot) => dot.classList.toggle("is-active", dot.dataset.lifeDot === target));
    stage.dataset.activeLife = target;
    if (track) {
      window.clearTimeout(wrapResetTimer);
      if (shouldWrapForward) {
        isWrappingLife = true;
        track.style.transition = "";
        track.style.transform = `translateX(-${(order.length + 1) * 100}%)`;
        const resetForwardWrap = () => {
          if (!isWrappingLife) return;
          isWrappingLife = false;
          window.clearTimeout(wrapResetTimer);
          track.style.transition = "none";
          track.style.transform = "translateX(-100%)";
          window.requestAnimationFrame(() => {
            track.style.transition = "";
          });
        };
        track.addEventListener("transitionend", resetForwardWrap, { once: true });
        wrapResetTimer = window.setTimeout(resetForwardWrap, 820);
      } else if (shouldWrapBackward) {
        isWrappingLife = true;
        track.style.transition = "";
        track.style.transform = "translateX(0%)";
        const resetBackwardWrap = () => {
          if (!isWrappingLife) return;
          isWrappingLife = false;
          window.clearTimeout(wrapResetTimer);
          track.style.transition = "none";
          track.style.transform = `translateX(-${order.length * 100}%)`;
          window.requestAnimationFrame(() => {
            track.style.transition = "";
          });
        };
        track.addEventListener("transitionend", resetBackwardWrap, { once: true });
        wrapResetTimer = window.setTimeout(resetBackwardWrap, 820);
      } else {
        track.style.transition = options.instant ? "none" : "";
        track.style.transform = `translateX(-${(index + 1) * 100}%)`;
      }
      if (options.instant) {
        window.requestAnimationFrame(() => {
          track.style.transition = "";
        });
      }
    }
    if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(order.length).padStart(2, "0")}`;
    if (caption) caption.textContent = slide?.dataset.lifeCaption || target;
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => setActiveLife(dot.dataset.lifeDot));
  });

  prev?.addEventListener("click", () => {
    setActiveLife(order[(activeIndex - 1 + order.length) % order.length], { direction: "prev" });
  });

  next?.addEventListener("click", () => {
    setActiveLife(order[(activeIndex + 1) % order.length], { direction: "next" });
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveLife(order[(activeIndex - 1 + order.length) % order.length], { direction: "prev" });
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveLife(order[(activeIndex + 1) % order.length], { direction: "next" });
    }
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button, .life-book-card, .life-reading-grid, .life-track-panel")) return;
    dragging = true;
    dragStartX = event.clientX;
    dragDeltaX = 0;
    stage.classList.add("is-dragging");
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragging || !track) return;
    dragDeltaX = event.clientX - dragStartX;
    track.style.transition = "none";
    track.style.transform = `translateX(calc(-${(activeIndex + 1) * 100}% + ${dragDeltaX}px))`;
  });

  const finishDrag = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    if (track) track.style.transition = "";
    if (Math.abs(dragDeltaX) > 70) {
      const direction = dragDeltaX < 0 ? 1 : -1;
      setActiveLife(order[(activeIndex + direction + order.length) % order.length], {
        direction: direction > 0 ? "next" : "prev"
      });
    } else {
      setActiveLife(order[activeIndex]);
    }
    dragStartX = 0;
    dragDeltaX = 0;
  };

  stage.addEventListener("pointerup", finishDrag);
  stage.addEventListener("pointercancel", finishDrag);
  stage.addEventListener("pointerleave", finishDrag);

  stage.addEventListener("wheel", (event) => {
    if (event.target.closest(".life-reading-grid, .life-track-panel")) return;
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
    if (!horizontalIntent || wheelLocked) return;
    event.preventDefault();
    wheelLocked = true;
    const direction = (event.deltaX || event.deltaY) > 0 ? 1 : -1;
    setActiveLife(order[(activeIndex + direction + order.length) % order.length], {
      direction: direction > 0 ? "next" : "prev"
    });
    window.setTimeout(() => {
      wheelLocked = false;
    }, 560);
  }, { passive: false });

  window.addEventListener("resize", () => {
    if (!activeTrackCloud?.list) return;
    window.clearTimeout(trackCloudResizeTimer);
    trackCloudResizeTimer = window.setTimeout(() => {
      layoutTrackCloud(activeTrackCloud.list);
    }, 120);
  }, { passive: true });

  artists.forEach((artist) => {
    artist.addEventListener("click", () => {
      artists.forEach((item) => item.classList.toggle("is-active", item === artist));
      renderTracks(artist);
    });
  });

  setActiveLife(order[0], { instant: true });
  renderTracks(document.querySelector("[data-artist].is-active") || artists[0]);
}

function setupPhotographyCarousel() {
  const carousel = document.querySelector("[data-photo-carousel]");
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll("[data-photo-slide]"));
  if (!slides.length) return;
  let activeIndex = 0;

  const setActivePhoto = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
  };

  setActivePhoto(0);
  if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.setInterval(() => setActivePhoto(activeIndex + 1), 3000);
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function setupTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".tilt-card:not([data-tilt-ready])").forEach((card) => {
    card.dataset.tiltReady = "true";
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function setupLensConsole() {
  const buttons = Array.from(document.querySelectorAll("[data-lens]"));
  const cards = Array.from(document.querySelectorAll("[data-lens-card]"));
  if (!buttons.length || !cards.length) return;
  let activeLens = buttons.find((button) => button.classList.contains("is-active"))?.dataset.lens || buttons[0].dataset.lens;

  const setDetailVisibility = (visibleLens) => {
    cards.forEach((card) => {
      const detail = card.querySelector(".method-card-detail");
      if (detail) detail.setAttribute("aria-hidden", String(card.dataset.lensCard !== visibleLens));
    });
  };

  const previewLens = (lens) => {
    if (!lens) return;
    cards.forEach((card) => card.classList.toggle("is-preview", card.dataset.lensCard === lens && lens !== activeLens));
    setDetailVisibility(lens);
  };

  const clearPreview = () => {
    cards.forEach((card) => card.classList.remove("is-preview"));
    setDetailVisibility(activeLens);
  };

  const activateLens = (lens) => {
    if (!lens) return;
    activeLens = lens;
    buttons.forEach((button) => button.classList.toggle("is-active", button.dataset.lens === lens));
    cards.forEach((card) => {
      card.classList.toggle("is-active", card.dataset.lensCard === lens);
      card.classList.remove("is-preview");
    });
    setDetailVisibility(activeLens);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activateLens(button.dataset.lens));
    button.addEventListener("pointerenter", () => previewLens(button.dataset.lens));
    button.addEventListener("pointerleave", clearPreview);
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => activateLens(card.dataset.lensCard));
    card.addEventListener("pointerenter", () => previewLens(card.dataset.lensCard));
    card.addEventListener("pointerleave", clearPreview);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activateLens(card.dataset.lensCard);
    });
  });

  activateLens(activeLens);
}

function setupProjectExplorer() {
  const grid = document.querySelector("[data-project-grid]");
  const detail = document.querySelector("[data-project-detail]");
  const filters = document.querySelectorAll("[data-project-filter]");
  const randomButton = document.querySelector("[data-random-project]");
  if (!grid || !detail) return;
  let activeFilter = "All";
  let activeIndex = 0;

  const visibleProjects = () => projectData.filter((project) => activeFilter === "All" || project.category === activeFilter);

  const bindPrivateButtons = (rootNode) => {
    rootNode.querySelectorAll("[data-private-project]").forEach((button) => {
      button.addEventListener("click", () => showToast(`${button.dataset.privateProject} · Private project.`));
    });
  };

  function renderDetail(project) {
    if (!project) return;
    detail.dataset.projectCategory = project.category;
    detail.innerHTML = `
      <div class="detail-kicker">${escapeHtml(project.status)} · ${escapeHtml(project.category)}</div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.detail)}</p>
      <div class="method-tags">
        ${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="trail">
        ${project.trail.map((step, index) => `
          <div class="trail-step">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>${escapeHtml(step[0])}</strong>
              <small>${escapeHtml(step[1])}</small>
            </div>
          </div>
        `).join("")}
      </div>
      ${project.url ? `
        <a class="project-action" href="${project.url}" target="_blank" rel="noreferrer">
          <i data-lucide="external-link"></i>
          GitHub
        </a>
      ` : `
        <button class="project-action" type="button" data-private-project="${escapeHtml(project.shortTitle)}">
          <i data-lucide="lock"></i>
          Private
        </button>
      `}
    `;
    bindPrivateButtons(detail);
    updateIcons();
  }

  function renderProjects() {
    const projects = visibleProjects();
    if (activeIndex >= projects.length) activeIndex = 0;
    grid.innerHTML = projects.map((project, index) => `
      <article class="project-card tilt-card ${index === activeIndex ? "is-active" : ""}" data-project-index="${index}" data-project-category="${escapeHtml(project.category)}">
        <div>
          <div class="project-meta">
            ${project.tags.map((tag, tagIndex) => `<span class="badge ${tagIndex === 1 ? "alt" : ""}">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <h3>${escapeHtml(project.shortTitle)}</h3>
          <p>${escapeHtml(project.summary)}</p>
        </div>
        <div class="project-footer">
          <span>${escapeHtml(project.category)}</span>
          ${project.url ? `
            <a class="project-action" href="${project.url}" target="_blank" rel="noreferrer">
              <i data-lucide="external-link"></i>
              GitHub
            </a>
          ` : `
            <button class="project-action" type="button" data-private-project="${escapeHtml(project.shortTitle)}">
              <i data-lucide="lock"></i>
              Private
            </button>
          `}
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-project-index]").forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("a, button")) return;
        activeIndex = Number(card.dataset.projectIndex);
        grid.querySelectorAll(".project-card").forEach((item) => item.classList.toggle("is-active", item === card));
        renderDetail(projects[activeIndex]);
      });
    });

    bindPrivateButtons(grid);
    renderDetail(projects[activeIndex]);
    updateIcons();
    setupTilt();
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.projectFilter;
      activeIndex = 0;
      filters.forEach((item) => item.classList.toggle("is-active", item === button));
      renderProjects();
    });
  });

  randomButton?.addEventListener("click", () => {
    const projects = visibleProjects();
    if (!projects.length) return;
    activeIndex = (activeIndex + 1 + Math.floor(Math.random() * Math.max(1, projects.length - 1))) % projects.length;
    renderProjects();
    showToast(`Selected ${projects[activeIndex].shortTitle}`);
  });

  renderProjects();
}


function formatDate(value) {
  if (!value) return "unknown";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value));
}

function languageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    C: "#555555",
    "C++": "#f34b7d",
    Jupyter: "#da5b0b",
    Shell: "#89e051"
  };

  if (colors[language]) return colors[language];

  let hash = 0;
  for (const char of String(language || "Other")) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 54% 48%)`;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}`);
  }
  return response.json();
}

async function fetchAllRepos() {
  const repos = [];
  for (let page = 1; page <= 10; page += 1) {
    const batch = await fetchJson(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

function setupRepositories() {
  const grid = document.querySelector(".repo-grid");
  const languageFilter = document.querySelector(".language-filter");
  const search = document.querySelector(".repo-search");
  const sortButtons = document.querySelectorAll("[data-sort]");
  const state = {
    repos: [],
    language: "All",
    sort: "updated",
    query: ""
  };

  function renderLanguages() {
    const languages = Array.from(new Set(state.repos
      .filter((repo) => repo.name !== "ksukie.github.io")
      .map((repo) => repo.language)
      .filter(Boolean))).sort();
    const items = ["All", ...languages];
    languageFilter.innerHTML = items.map((language) => `
      <button class="chip-button ${state.language === language ? "is-active" : ""}" type="button" data-language="${escapeHtml(language)}" style="--language-color: ${language === "All" ? "#71838f" : languageColor(language)};">
        ${language !== "All" ? `<span class="language-dot" style="--language-color: ${languageColor(language)}"></span>` : ""}
        ${escapeHtml(language === "All" ? "全部" : language)}
      </button>
    `).join("");

    languageFilter.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        state.language = button.dataset.language;
        renderLanguages();
        renderRepos();
      });
    });
  }

  function getVisibleRepos() {
    const query = state.query.trim().toLowerCase();
    const filtered = state.repos.filter((repo) => {
      if (repo.name === "ksukie.github.io") return false;
      const languageMatch = state.language === "All" || repo.language === state.language;
      const haystack = [
        repo.name,
        repo.description,
        repo.language,
        repo.topics?.join(" ")
      ].join(" ").toLowerCase();
      return languageMatch && (!query || haystack.includes(query));
    });

    return filtered.sort((a, b) => {
      if (state.sort === "stars") {
        return (b.stargazers_count || 0) - (a.stargazers_count || 0) || new Date(b.pushed_at) - new Date(a.pushed_at);
      }
      if (state.sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    });
  }

  function renderRepos() {
    const repos = getVisibleRepos();
    if (!repos.length) {
      grid.innerHTML = `<div class="repo-empty">没有匹配的公开仓库。</div>`;
      return;
    }

    const repoCards = repos.map((repo, index) => {
      const language = repo.language || "Other";
      const description = repo.description || "No description provided.";
      const homepage = repo.homepage && /^https?:\/\//i.test(repo.homepage) ? repo.homepage : "";
      const rowStart = Math.floor(index / 3) * 3;
      const rowCount = Math.min(3, repos.length - rowStart);
      const repoSpan = 6 / rowCount;
      return `
        <article class="repo-card" style="--language-color: ${languageColor(language)}; --repo-span: ${repoSpan};">
          <div>
            <h3>
              <a href="${repo.html_url}" target="_blank" rel="noreferrer">${escapeHtml(repo.name)}</a>
            </h3>
            <p class="repo-description">${escapeHtml(description)}</p>
          </div>
          <div>
            <div class="repo-meta">
              <span><span class="language-dot"></span>${escapeHtml(language)}</span>
              <span>${repo.stargazers_count || 0}</span>
              <span>${repo.forks_count || 0}</span>
              <span>${formatDate(repo.pushed_at)}</span>
              ${repo.fork ? `<span>Fork</span>` : ""}
            </div>
            <div class="repo-links">
              <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noreferrer">Code</a>
              ${homepage ? `<a class="repo-link" href="${homepage}" target="_blank" rel="noreferrer">Live</a>` : ""}
            </div>
          </div>
        </article>
      `;
    }).join("");

    grid.innerHTML = `
      ${repoCards}
      <div class="repo-signals" aria-label="More repositories coming soon">
        <strong>Comming soon！</strong>
      </div>
    `;
  }

  search.addEventListener("input", () => {
    state.query = search.value;
    renderRepos();
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.dataset.sort;
      sortButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderRepos();
    });
  });

  fetchAllRepos().then((repos) => {
    state.repos = repos;
    renderLanguages();
    renderRepos();
  }).catch((error) => {
    console.error(error);
    grid.innerHTML = `
      <div class="repo-empty">
        GitHub 仓库暂时无法载入。可以直接访问
        <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noreferrer">github.com/${GITHUB_USER}</a>
      </div>
    `;
  });
}

updateIcons();
setupNavHanger();
setupResponsiveScale();
setupPageSnap();
setupLensConsole();
setupLifeArchive();
setupPhotographyCarousel();
setupProjectExplorer();
setupRepositories();
