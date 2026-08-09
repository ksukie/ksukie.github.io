/* Canonical application logic for ksukie-world.html. */

const root = document.documentElement;
const toast = document.querySelector(".toast");

function updateIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupNavHanger() {
  const header = document.querySelector(".site-header");
  const hanger = document.querySelector(".nav-hanger");
  const navLinks = document.querySelector("#site-header-nav");
  if (!header || !hanger || !navLinks) return;

  const mobileMenu = window.matchMedia("(max-width: 720px)");
  let isOpen = false;

  const sync = () => {
    const open = mobileMenu.matches && isOpen;
    header.classList.toggle("is-hanger-open", open);
    hanger.classList.toggle("is-hanger-open", open);
    hanger.setAttribute("aria-expanded", String(open));
    navLinks.setAttribute("aria-hidden", String(mobileMenu.matches && !open));
  };

  const setOpen = (next, restoreFocus = false) => {
    isOpen = Boolean(next);
    sync();
    if (restoreFocus && mobileMenu.matches) hanger.focus();
  };

  hanger.addEventListener("click", () => setOpen(!isOpen));
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (!isOpen || !mobileMenu.matches || header.contains(event.target) || hanger.contains(event.target)) return;
    setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setOpen(false, true);
    }
  });

  const handleMenuModeChange = () => {
    if (!mobileMenu.matches) isOpen = false;
    sync();
  };
  if (mobileMenu.addEventListener) {
    mobileMenu.addEventListener("change", handleMenuModeChange);
  } else {
    mobileMenu.addListener(handleMenuModeChange);
  }
  sync();
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
    "#top.hero, #top > .hero, .hero-bridge, #profile, .life-bridge, #life, #projects, .contact-bridge, #contact"
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
      if (canScrollInside(event.target, lastDirection)) return;
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
  const slides = Array.from(stage.querySelectorAll("[data-life-slide]:not([hidden])"));
  const dots = stage.querySelectorAll("[data-life-dot]:not([hidden])");
  const prev = stage.querySelector("[data-life-prev]");
  const next = stage.querySelector("[data-life-next]");
  const count = document.querySelector("[data-life-count]");
  const caption = document.querySelector("[data-life-current-caption]");
  const artists = stage.querySelectorAll("[data-life-slide]:not([hidden]) [data-artist]");
  const trackPanel = stage.querySelector("[data-life-slide]:not([hidden]) [data-track-panel]");
  const order = slides.map((slide) => slide.dataset.lifeSlide);
  let activeIndex = 0;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let dragging = false;
  let trackCloudFrame = 0;
  let activeTrackCloud = null;
  let trackCloudResizeTimer = 0;

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
    const index = order.indexOf(target);
    if (index < 0) return;
    activeIndex = index;
    const slide = slides[index];

    slides.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot) => {
      const isActive = dot.dataset.lifeDot === target;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
    stage.dataset.activeLife = target;
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === order.length - 1;
    if (track) {
      track.style.transition = options.instant ? "none" : "";
      track.style.transform = `translateX(-${index * 100}%)`;
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
    if (activeIndex > 0) setActiveLife(order[activeIndex - 1]);
  });

  next?.addEventListener("click", () => {
    if (activeIndex < order.length - 1) setActiveLife(order[activeIndex + 1]);
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && activeIndex > 0) {
      event.preventDefault();
      setActiveLife(order[activeIndex - 1]);
    }
    if (event.key === "ArrowRight" && activeIndex < order.length - 1) {
      event.preventDefault();
      setActiveLife(order[activeIndex + 1]);
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
    track.style.transform = `translateX(calc(-${activeIndex * 100}% + ${dragDeltaX}px))`;
  });

  const finishDrag = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    if (track) track.style.transition = "";
    if (Math.abs(dragDeltaX) > 70) {
      const direction = dragDeltaX < 0 ? 1 : -1;
      const targetIndex = activeIndex + direction;
      if (targetIndex >= 0 && targetIndex < order.length) setActiveLife(order[targetIndex]);
      else setActiveLife(order[activeIndex]);
    } else {
      setActiveLife(order[activeIndex]);
    }
    dragStartX = 0;
    dragDeltaX = 0;
  };

  stage.addEventListener("pointerup", finishDrag);
  stage.addEventListener("pointercancel", finishDrag);
  stage.addEventListener("pointerleave", finishDrag);

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

function setupProvinceMap() {
  const hotspots = Array.from(document.querySelectorAll("[data-province]"));
  hotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      hotspots.forEach((item) => {
        const selected = item.dataset.province === hotspot.dataset.province;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
    });
  });
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
    buttons.forEach((button) => {
      const isActive = button.dataset.lens === lens;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
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

updateIcons();
setupNavHanger();
setupResponsiveScale();
setupPageSnap();
setupLensConsole();
setupLifeArchive();
setupProvinceMap();

(() => {
  "use strict";

  const GITHUB_USER = "ksukie";
  // GitHub's public REST API does not expose profile pins. Keep this list in the same order as the public profile's pinned cards.
  const FEATURED_REPOSITORY_NAMES = [
    "TactiWeave-VP",
    "WildfireAegis",
    "vision-workbench",
    "adaptive-ui-engineer",
    "AgentGuard"
  ];
  // Portfolio projects outside the account queried below stay visible after snapshot refreshes.
  const PORTFOLIO_REPOSITORIES = Object.freeze([
    {
      name: "TactiWeave-VP",
      full_name: "CanyonChen/TactiWeave-VP",
      private: true,
      visibility: "private",
      description: "Visual-physical temporal fusion for fabric classification from tactile pressure sequences and calibrated physical measurements.",
      language: "Python",
      topics: ["tactile", "pytorch", "resnet", "temporal-fusion"],
      homepage: "",
      html_url: "",
      stargazers_count: 0,
      forks_count: 0,
      pushed_at: "2026-07-24T09:27:17Z",
      updated_at: "2026-07-24T09:27:17Z"
    }
  ]);
  // GitHub Topics are the source of card metadata and representative top-level filters.
  const REPOSITORY_PALETTES = Object.freeze([
    { rgb: "113, 131, 143", ink: "#60717c" },
    { rgb: "211, 147, 148", ink: "#9f686a" },
    { rgb: "229, 204, 150", ink: "#846d36" },
    { rgb: "214, 199, 178", ink: "#6f6251" }
  ]);
  const MAX_FILTER_TOPICS = 4;
  const MAX_CARD_TOPICS = 3;
  const REPOSITORY_CACHE_KEY = "ksukie.public-repositories.v4";
  const STATIC_REPOSITORY_SNAPSHOT = Array.isArray(globalThis.REPOSITORY_SNAPSHOT) ? globalThis.REPOSITORY_SNAPSHOT : [];
  const ICON_SVGS = Object.freeze({
    layers: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 7 3.5-7 3.5-7-3.5L12 3Z"/><path d="m5 12.5 7 3.5 7-3.5"/><path d="m5 16.5 7 3.5 7-3.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 13v9"/><path d="M9 3h6"/><path d="M9 3v5l-4 4v1h14v-1l-4-4V3"/></svg>',
    vision: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    cpu: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5M15 1v5M9 18v5M15 18v5M18 9h5M18 15h5M1 9h5M1 15h5"/><path d="M10 10h4v4h-4z"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 7 4 5-4 5"/><path d="M12 17h7"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.3 4.2L6.5 8.5l4.2 1.3L12 14l1.3-4.2 4.2-1.3-4.2-1.3L12 3Z"/><path d="m19 14-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7L19 14Z"/><path d="m5 15-.6 1.9L2.5 17l1.9.6L5 19.5l.6-1.9 1.9-.6-1.9-.6L5 15Z"/></svg>',
    code: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 4-4 16"/></svg>',
    tag: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13 13 20 3 10V3h7l7 7Z"/><circle cx="7.5" cy="7.5" r="1"/></svg>',
    lock: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    github: '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="currentColor"><path d="M12 .5C5.73.5.65 5.58.65 11.85c0 4.89 3.17 9.04 7.57 10.5.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.06-3.08.67-3.73-1.31-3.73-1.31-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.61 1.21 3.25.93.1-.72.39-1.21.71-1.49-2.46-.28-5.05-1.23-5.05-5.48 0-1.21.43-2.2 1.14-2.98-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.04 1.14.88-.24 1.82-.36 2.76-.36s1.88.12 2.76.36c2.11-1.44 3.04-1.14 3.04-1.14.61 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.59 5.19-5.06 5.47.4.34.75 1.01.75 2.04 0 1.48-.01 2.67-.01 3.04 0 .29.2.64.76.53 4.4-1.47 7.56-5.61 7.56-10.5C23.35 5.58 18.27.5 12 .5Z"/></svg>'
  });

  const filterRow = document.querySelector("[data-repository-filters]");
  const grid = document.querySelector("[data-repository-grid]");
  const detail = document.querySelector("[data-repository-detail]");
  const detailName = document.querySelector("[data-repository-name]");
  const detailDescription = document.querySelector("[data-repository-description]");
  const detailTags = document.querySelector("[data-repository-tags]");
  const detailTrail = document.querySelector("[data-repository-trail]");
  const sourceLink = document.querySelector("[data-repository-source]");
  const privateSourceButton = document.querySelector("[data-repository-private-source]");
  const isSoftReposPage = document.querySelector(".soft-repos-page") !== null;

  if (!filterRow || !grid || !detail || !detailName || !detailDescription || !detailTags || !detailTrail || !sourceLink || !privateSourceButton) {
    return;
  }

  const state = {
    repos: [],
    view: "all",
    activeTag: "",
    activeName: "",
    loadError: false,
    dataSource: "loading"
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function iconMarkup(name, className) {
    const icon = ICON_SVGS[name] || ICON_SVGS.tag;
    return `<span class="${className}" aria-hidden="true">${icon}</span>`;
  }

  function normalizeFilterTerm(value) {
    return String(value ?? "").trim().toLowerCase().replace(/[\s_-]+/g, "");
  }

  function filterIconName(view, label) {
    if (view === "featured") return "pin";
    if (view === "all") return "layers";

    const normalizedLabel = normalizeFilterTerm(label);
    if (normalizedLabel.includes("vision")) return "vision";
    if (normalizedLabel.includes("edge") || normalizedLabel.includes("esp") || normalizedLabel.includes("ai")) return "cpu";
    if (normalizedLabel.includes("power") || normalizedLabel.includes("shell")) return "terminal";
    if (normalizedLabel.includes("skill") || normalizedLabel.includes("agent")) return "sparkles";
    if (normalizedLabel.includes("pyqt") || normalizedLabel.includes("python") || normalizedLabel.includes("json")) return "code";
    return "tag";
  }

  function sourceActionMarkup(isPrivate, className) {
    return `${iconMarkup(isPrivate ? "lock" : "github", className)}<span>${isPrivate ? "Private" : "GitHub"}</span>`;
  }

  function showPrivateRepositoryNotice(name) {
    showToast(`${name} · 私密仓库仅展示基本信息，暂不支持跳转访问。`);
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function isPrivateRepository(repo) {
    return repo?.private === true || repo?.visibility === "private";
  }

  function repositoryTopics(repo) {
    if (!Array.isArray(repo.topics)) return [];

    return [...new Set(
      repo.topics
        .filter((topic) => typeof topic === "string")
        .map((topic) => topic.trim().toLowerCase())
        .filter(Boolean)
    )];
  }

  function formatTopic(topic) {
    return String(topic)
      .trim()
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.length <= 3
        ? part.toUpperCase()
        : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(" ");
  }

  function compareTopicsByDisplay(left, right) {
    const leftLabel = formatTopic(left);
    const rightLabel = formatTopic(right);
    const leftLength = [...leftLabel.replace(/\s/g, "")].length;
    const rightLength = [...rightLabel.replace(/\s/g, "")].length;
    const lengthDifference = leftLength - rightLength;

    if (lengthDifference) return lengthDifference;

    const initialDifference = leftLabel.charAt(0).localeCompare(rightLabel.charAt(0), "en", { sensitivity: "base" });
    return initialDifference || leftLabel.localeCompare(rightLabel, "en", { sensitivity: "base", numeric: true });
  }

  function sortedTopics(topics) {
    return [...new Set(topics)].sort(compareTopicsByDisplay);
  }

  function paletteFor(value) {
    let hash = 0;
    for (const character of String(value || "repository")) {
      hash = character.charCodeAt(0) + ((hash << 5) - hash);
    }
    return REPOSITORY_PALETTES[Math.abs(hash) % REPOSITORY_PALETTES.length];
  }

  function normalizeRepository(repo) {
    const privateRepository = isPrivateRepository(repo);
    const language = repo.language || "Other";
    const topics = repositoryTopics(repo);
    const featuredOrder = FEATURED_REPOSITORY_NAMES.indexOf(repo.name);

    return {
      ...repo,
      private: privateRepository,
      visibility: privateRepository ? "private" : repo.visibility || "public",
      topics,
      featured: featuredOrder !== -1,
      featuredOrder,
      language,
      safeUrl: safeUrl(repo.html_url)
    };
  }

  function topicFrequencies(repositories) {
    const frequencies = new Map();

    repositories.forEach((repo) => {
      repo.topics.forEach((topic) => {
        frequencies.set(topic, (frequencies.get(topic) || 0) + 1);
      });
    });

    return frequencies;
  }

  function normalizeRepositories(repos) {
    const repositories = Array.isArray(repos)
      ? repos.filter((repo) => repo && repo.name !== `${GITHUB_USER}.github.io`).map(normalizeRepository)
      : [];

    return repositories.map((repo) => {
      const palette = paletteFor(repo.topics[0] || repo.name);

      return {
        ...repo,
        repositoryRgb: palette.rgb,
        repositoryInk: palette.ink
      };
    });
  }

  function publicRepositories(repos) {
    return normalizeRepositories(repos).filter((repo) => !repo.private);
  }

  function mergeRepositories(...sources) {
    const merged = new Map();

    sources.flat().forEach((repo) => {
      if (!repo?.name) return;
      const key = String(repo.full_name || repo.name).toLowerCase();
      merged.set(key, repo);
    });

    return normalizeRepositories([...merged.values()]);
  }

  function readSessionCache() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(REPOSITORY_CACHE_KEY) || "[]");
      return publicRepositories(cached);
    } catch {
      return [];
    }
  }

  function writeSessionCache(repos) {
    try {
      sessionStorage.setItem(REPOSITORY_CACHE_KEY, JSON.stringify(publicRepositories(repos)));
    } catch {
      // The bundled snapshot remains available when session storage is blocked.
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    if (!response.ok) {
      const error = new Error(`GitHub API ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  async function fetchPublicRepositories() {
    const repos = [];

    for (let page = 1; page <= 10; page += 1) {
      const batch = await fetchJson(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&page=${page}`);
      repos.push(...batch);
      if (batch.length < 100) break;
    }

    return publicRepositories(repos);
  }

  async function loadRepositories() {
    const snapshotRepos = normalizeRepositories([
      ...STATIC_REPOSITORY_SNAPSHOT,
      ...PORTFOLIO_REPOSITORIES
    ]);

    try {
      const livePublicRepos = await fetchPublicRepositories();
      writeSessionCache(livePublicRepos);
      const repos = mergeRepositories(snapshotRepos, livePublicRepos);
      return { repos, source: snapshotRepos.some(isPrivateRepository) ? "live-snapshot" : "live" };
    } catch (liveError) {
      console.warn("Live GitHub repository request failed; using a local fallback.", liveError);

      const cachedRepos = readSessionCache();
      const repos = mergeRepositories(snapshotRepos, cachedRepos);
      if (repos.length) {
        const source = cachedRepos.length
          ? snapshotRepos.length ? "session-snapshot" : "session"
          : "snapshot";
        return { repos, source };
      }

      throw liveError;
    }
  }

  function formatDate(value) {
    if (!value) return "未知";

    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(value));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("zh-CN").format(value || 0);
  }

  function topicTag(topic) {
    const label = formatTopic(topic);
    return `<span class="repository-tag" title="${escapeHtml(label)}"><span class="repository-tag-label">${escapeHtml(label)}</span></span>`;
  }

  function cardTopics(repo) {
    const visible = sortedTopics(repo.topics).slice(0, MAX_CARD_TOPICS);
    return {
      visible,
      hiddenCount: Math.max(0, repo.topics.length - visible.length)
    };
  }

  function moreTopicsTag(hiddenCount) {
    if (!hiddenCount) return "";

    return `<span class="repository-tag repository-tag-more" title="还有 ${hiddenCount} 个 Topics"><span aria-hidden="true">+${hiddenCount}</span><span class="sr-only">还有 ${hiddenCount} 个 Topics，查看详情可见完整列表</span></span>`;
  }

  function filterCandidateScore(topic, coveredRepositoryNames) {
    const uncoveredRepositories = state.repos.filter((repo) => (
      !coveredRepositoryNames.has(repo.name) && repo.topics.includes(topic)
    ));
    const normalizedTopic = normalizeFilterTerm(topic);

    return {
      topic,
      uncoveredRepositoryNames: uncoveredRepositories.map((repo) => repo.name),
      uncoveredFeaturedCount: uncoveredRepositories.filter((repo) => repo.featured).length,
      uncoveredRepositoryCount: uncoveredRepositories.length,
      languageTopicMatchCount: normalizedTopic
        ? uncoveredRepositories.filter((repo) => normalizeFilterTerm(repo.language) === normalizedTopic).length
        : 0,
      stargazerCount: uncoveredRepositories.reduce(
        (total, repo) => total + Math.max(0, Number(repo.stargazers_count) || 0),
        0
      )
    };
  }

  function compareFilterCandidates(left, right) {
    return right.uncoveredFeaturedCount - left.uncoveredFeaturedCount
      || right.uncoveredRepositoryCount - left.uncoveredRepositoryCount
      || right.languageTopicMatchCount - left.languageTopicMatchCount
      || right.stargazerCount - left.stargazerCount
      || compareTopicsByDisplay(left.topic, right.topic);
  }

  function availableFilterTags() {
    const candidateTopics = sortedTopics(topicFrequencies(state.repos).keys());
    const coveredRepositoryNames = new Set();
    const selectedTopics = [];

    while (selectedTopics.length < MAX_FILTER_TOPICS) {
      const nextCandidate = candidateTopics
        .filter((topic) => !selectedTopics.includes(topic))
        .map((topic) => filterCandidateScore(topic, coveredRepositoryNames))
        .filter((candidate) => candidate.uncoveredRepositoryCount > 0)
        .sort(compareFilterCandidates)[0];

      if (!nextCandidate) break;

      selectedTopics.push(nextCandidate.topic);
      nextCandidate.uncoveredRepositoryNames.forEach((name) => coveredRepositoryNames.add(name));
    }

    return sortedTopics(selectedTopics);
  }

  function synchronizeFilterButtonWidth() {
    const topicScroller = filterRow.querySelector(".filter-topic-scroll");
    if (!topicScroller) return;

    topicScroller.style.removeProperty("--filter-button-inline-size");
    const buttons = [...topicScroller.querySelectorAll(".filter-button")];
    const widestButton = Math.max(0, ...buttons.map((button) => button.getBoundingClientRect().width));

    if (widestButton) {
      topicScroller.style.setProperty("--filter-button-inline-size", `${Math.ceil(widestButton)}px`);
    }
  }

  function renderFilterControls() {
    const tags = availableFilterTags();

    if (state.view === "tag" && !tags.includes(state.activeTag)) {
      state.view = "featured";
      state.activeTag = "";
    }

    const control = (view, label, tag = "") => {
      const active = state.view === view && (view !== "tag" || state.activeTag === tag);
      const tagAttribute = tag ? ` data-repository-tag="${escapeHtml(tag)}"` : "";

      return `<button class="filter-button${active ? " is-active" : ""}" type="button" data-repository-view="${view}"${tagAttribute} aria-pressed="${active}" title="${escapeHtml(label)}">${iconMarkup(filterIconName(view, label), "filter-icon")}<span class="control-label">${escapeHtml(label)}</span></button>`;
    };

    filterRow.innerHTML = `
      <div class="filter-topic-scroll filter-topic-scroll-all" role="group" aria-label="按视图或主题筛选仓库">
        ${control("all", "ALL")}
        ${control("featured", "OnPin")}
        ${tags.map((tag) => control("tag", formatTopic(tag), tag)).join("")}
      </div>
    `;

    synchronizeFilterButtonWidth();
  }

  function repositoryMatchesView(repo) {
    if (state.view === "featured") return repo.featured;
    if (state.view === "all") return true;
    return repo.topics.includes(state.activeTag);
  }

  function compareRepositoriesByStarsThenName(left, right) {
    return (right.stargazers_count || 0) - (left.stargazers_count || 0)
      || left.name.localeCompare(right.name, "en", { sensitivity: "base" });
  }

  function visibleRepositories() {
    return state.repos
      .filter(repositoryMatchesView)
      .sort(compareRepositoriesByStarsThenName);
  }

  function getActiveRepository(repositories) {
    const current = repositories.find((repo) => repo.name === state.activeName);
    if (current) return current;

    const featured = FEATURED_REPOSITORY_NAMES
      .map((name) => repositories.find((repo) => repo.name === name))
      .find(Boolean);
    const next = featured || repositories[0] || null;
    state.activeName = next?.name || "";
    return next;
  }

  function updateControlState() {
    [...filterRow.querySelectorAll("[data-repository-view]")].forEach((button) => {
      const active = button.dataset.repositoryView === state.view
        && (state.view !== "tag" || button.dataset.repositoryTag === state.activeTag);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function renderGrid(repositories, activeRepository) {
    grid.setAttribute("aria-busy", "false");

    if (state.loadError) {
      grid.innerHTML = `
        <p class="repository-empty">
          仓库数据暂时无法载入。<a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noreferrer">直接访问 GitHub</a>
        </p>
      `;
      return;
    }

    if (!repositories.length) {
      grid.innerHTML = '<p class="repository-empty">没有匹配的仓库。可尝试切换视图筛选。</p>';
      return;
    }

    grid.innerHTML = repositories.map((repo) => {
      const active = repo.name === activeRepository?.name;
      const topics = cardTopics(repo);
      const tags = topics.visible.map(topicTag).join("") + moreTopicsTag(topics.hiddenCount);
      const description = repo.description || "No description provided.";
      const sourceUrl = repo.safeUrl || `https://github.com/${GITHUB_USER}/${encodeURIComponent(repo.name)}`;
      const sourceAction = repo.private
        ? `<button class="repository-link" type="button" data-private-repository="${escapeHtml(repo.name)}">${sourceActionMarkup(true, "repository-link-icon")}</button>`
        : `<a class="repository-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">${sourceActionMarkup(false, "repository-link-icon")}</a>`;
      const cardTags = `<div class="repository-card-tags">${tags}</div>`;
      const cardHeading = `<h3><button class="repository-select" type="button" data-repository-name="${escapeHtml(repo.name)}" aria-pressed="${active}" aria-label="查看 ${escapeHtml(repo.name)} 仓库详情">${escapeHtml(repo.name)}</button></h3>`;
      const cardDescription = `<p class="repository-card-description">${escapeHtml(description)}</p>`;
      const cardBody = isSoftReposPage
        ? `${cardHeading}${cardDescription}${cardTags}`
        : `${cardTags}${cardHeading}${cardDescription}`;

      return `
        <article class="repository-card ${active ? "is-active" : ""}" data-repository-card="${escapeHtml(repo.name)}" data-repository-visibility="${repo.private ? "private" : "public"}" style="--repository-rgb: ${repo.repositoryRgb}; --repository-ink: ${repo.repositoryInk};">
          <div class="repository-card-body">${cardBody}</div>
          <footer class="repository-card-footer">
            <span class="repository-card-meta"><span class="language-dot" aria-hidden="true"></span>${escapeHtml(repo.language)} · ★ ${formatNumber(repo.stargazers_count)}</span>
            ${sourceAction}
          </footer>
        </article>
      `;
    }).join("");
  }

  function detailTrailStep(index, label, value) {
    return `
      <div class="repository-trail-step">
        <span aria-hidden="true">${String(index).padStart(2, "0")}</span>
        <div>
          <strong>${escapeHtml(label)}</strong>
          <small>${escapeHtml(value)}</small>
        </div>
      </div>
    `;
  }

  function renderDetail(repo) {
    detail.scrollTop = 0;
    detailTrail.scrollTop = 0;

    if (!repo) {
      detail.style.setProperty("--detail-rgb", "211, 147, 148");
      detail.style.setProperty("--detail-ink", "#9f686a");
      detailName.textContent = "No repository selected";
      detailDescription.textContent = "没有与当前筛选相匹配的仓库。";
      detailTags.innerHTML = "";
      detailTrail.innerHTML = "";
      delete detail.dataset.repositoryVisibility;
      sourceLink.hidden = false;
      sourceLink.href = `https://github.com/${GITHUB_USER}`;
      sourceLink.innerHTML = sourceActionMarkup(false, "detail-action-icon");
      privateSourceButton.hidden = true;
      delete privateSourceButton.dataset.privateRepository;
      return;
    }

    detail.style.setProperty("--detail-rgb", repo.repositoryRgb);
    detail.style.setProperty("--detail-ink", repo.repositoryInk);
    detail.dataset.repositoryVisibility = repo.private ? "private" : "public";
    detailName.textContent = repo.name;
    detailDescription.textContent = repo.description || "No description provided.";
    const topics = sortedTopics(repo.topics);
    detailTags.innerHTML = `${topics.length
      ? topics.map(topicTag).join("")
      : '<span class="detail-topic-empty">No topics set.</span>'}`;
    detailTrail.innerHTML = [
      detailTrailStep(1, "Repository", repo.full_name || `${GITHUB_USER}/${repo.name}`),
      detailTrailStep(2, "Activity", `更新于 ${formatDate(repo.pushed_at)} · ★ ${formatNumber(repo.stargazers_count)} · Fork ${formatNumber(repo.forks_count)}`),
      detailTrailStep(3, "Topics", topics.length ? topics.map(formatTopic).join(" · ") : "No topics set")
    ].join("");

    if (repo.private) {
      sourceLink.hidden = true;
      sourceLink.removeAttribute("href");
      privateSourceButton.hidden = false;
      privateSourceButton.dataset.privateRepository = repo.name;
      privateSourceButton.innerHTML = sourceActionMarkup(true, "detail-action-icon");
    } else {
      sourceLink.hidden = false;
      sourceLink.href = repo.safeUrl || `https://github.com/${GITHUB_USER}/${encodeURIComponent(repo.name)}`;
      sourceLink.innerHTML = sourceActionMarkup(false, "detail-action-icon");
      privateSourceButton.hidden = true;
      delete privateSourceButton.dataset.privateRepository;
    }
  }

  function render() {
    renderFilterControls();
    const repositories = visibleRepositories();
    const activeRepository = getActiveRepository(repositories);

    updateControlState();
    renderGrid(repositories, activeRepository);
    renderDetail(activeRepository);
  }

  function focusRepository(name) {
    [...grid.querySelectorAll("[data-repository-name]")]
      .find((button) => button.dataset.repositoryName === name)
      ?.focus();
  }

  function selectRepository(name, restoreFocus) {
    if (!name) return;

    state.activeName = name;
    render();
    if (restoreFocus) focusRepository(name);
  }

  filterRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-repository-view]");
    if (!button || !filterRow.contains(button)) return;

    const view = button.dataset.repositoryView;
    state.view = view === "tag" || view === "all" ? view : "featured";
    state.activeTag = state.view === "tag" ? button.dataset.repositoryTag || "" : "";
    state.activeName = "";
    render();
  });

  grid.addEventListener("click", (event) => {
    const sourceAction = event.target.closest(".repository-link");
    if (sourceAction) {
      if (sourceAction.dataset.privateRepository) {
        showPrivateRepositoryNotice(sourceAction.dataset.privateRepository);
      }
      return;
    }

    const button = event.target.closest("[data-repository-name]");
    const card = event.target.closest("[data-repository-card]");
    const name = button?.dataset.repositoryName || card?.dataset.repositoryCard || "";
    selectRepository(name, Boolean(button));
  });

  privateSourceButton.addEventListener("click", () => {
    if (privateSourceButton.dataset.privateRepository) {
      showPrivateRepositoryNotice(privateSourceButton.dataset.privateRepository);
    }
  });

  async function initialiseRepositoryConsole() {
    try {
      const { repos, source } = await loadRepositories();
      state.repos = repos;
      state.dataSource = source;
      state.activeName = FEATURED_REPOSITORY_NAMES.find((name) => repos.some((repo) => repo.name === name)) || "";
    } catch (error) {
      console.error("Repository data could not be loaded from GitHub or a local fallback.", error);
      state.loadError = true;
      state.dataSource = "failed";
      grid.setAttribute("aria-busy", "false");
    }

    render();
  }

  void initialiseRepositoryConsole().catch((error) => {
    console.error("Repository console could not be rendered.", error);
  });
})();
