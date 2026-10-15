/*
  Floating menu safe positioning
  - Keeps all three floating controls away from visible text and form controls.
  - Uses a compact center-right safe zone first, then chooses the least-overlapping fallback.
*/

const FLOATING_SELECTOR = "#sajuFloatingMenus";
const SECTION_SELECTOR = [
  "#manse",
  "#sajuSummarySection",
  "#resultSection",
  "#relationsSection",
  "#elementsSection",
  "#strengthSection",
  "#usefulGodSection",
  "#sinsalSection",
  "#fortuneCycleSection",
  "#annualFortuneSection",
  "#monthlyFortuneSection",
  "#today"
].join(",");

const CONTROL_SELECTOR = [
  "input",
  "select",
  "textarea",
  "button",
  ".date-controls",
  ".birth-date-controls",
  ".fortune-cycle-tabs",
  ".annual-fortune-tabs",
  ".monthly-fortune-tabs"
].join(",");

function isRenderable(element) {
  if (!(element instanceof Element)) return false;
  if (element.closest(FLOATING_SELECTOR)) return false;
  if (element.closest(".saju-floating-dialog")) return false;

  const style = getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0;
}

function viewportIntersectionArea(rect) {
  const left = Math.max(0, rect.left);
  const top = Math.max(0, rect.top);
  const right = Math.min(innerWidth, rect.right);
  const bottom = Math.min(innerHeight, rect.bottom);
  return Math.max(0, right - left) * Math.max(0, bottom - top);
}

function getActiveSection() {
  const sections = [...document.querySelectorAll(SECTION_SELECTOR)]
    .filter(section => !section.hidden && isRenderable(section));

  let best = null;
  let bestArea = -1;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const area = viewportIntersectionArea(rect);
    if (area > bestArea) {
      best = section;
      bestArea = area;
    }
  }

  return best || document.body;
}

function getTextRects(root) {
  const rects = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || !isRenderable(parent)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("script,style,noscript,svg")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node;
  while ((node = walker.nextNode())) {
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (rect.width < 1 || rect.height < 1) continue;
      if (rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) continue;
      rects.push({
        left: rect.left - 12,
        top: rect.top - 10,
        right: rect.right + 12,
        bottom: rect.bottom + 10,
        weight: 4
      });
    }
  }

  return rects;
}

function getControlRects(root) {
  return [...root.querySelectorAll(CONTROL_SELECTOR)]
    .filter(isRenderable)
    .map(element => element.getBoundingClientRect())
    .filter(rect => rect.width > 1 && rect.height > 1 && viewportIntersectionArea(rect) > 0)
    .map(rect => ({
      left: rect.left - 14,
      top: rect.top - 14,
      right: rect.right + 14,
      bottom: rect.bottom + 14,
      weight: 6
    }));
}

function overlapArea(a, b) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function candidateRect(element, candidate) {
  const width = element.offsetWidth || 180;
  const height = element.offsetHeight || 64;
  const maxLeft = Math.max(12, innerWidth - width - 18);
  const headerBottom = Math.max(100, document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0);
  const minTop = headerBottom + 18;
  const maxTop = Math.max(minTop, innerHeight - height - 20);

  const left = clamp(candidate.x * innerWidth - width / 2, 16, maxLeft);
  const top = clamp(candidate.y * innerHeight - height / 2, minTop, maxTop);

  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height
  };
}

function selectBestRect(element, candidates, obstacles, otherRects = []) {
  let winner = null;
  let bestScore = Infinity;

  candidates.forEach((candidate, index) => {
    const rect = candidateRect(element, candidate);
    let score = index * 6;

    for (const obstacle of obstacles) {
      score += overlapArea(rect, obstacle) * obstacle.weight;
    }

    for (const otherRect of otherRects.filter(Boolean)) {
      score += overlapArea(rect, {
        left: otherRect.left - 18,
        top: otherRect.top - 18,
        right: otherRect.right + 18,
        bottom: otherRect.bottom + 18
      }) * 14;
    }

    if (score < bestScore) {
      bestScore = score;
      winner = rect;
    }
  });

  return winner;
}

function applyRect(element, rect) {
  if (!rect) return;
  element.style.left = `${Math.round(rect.left)}px`;
  element.style.top = `${Math.round(rect.top)}px`;
  element.style.right = "auto";
  element.style.bottom = "auto";
}

export function initFloatingSafePosition(dock) {
  const inputButton = dock?.querySelector("#sajuFloatingInput");
  const cycleNav = dock?.querySelector("#sajuFloatingCycleNav");
  const todayButton = dock?.querySelector("#sajuFloatingToday");
  if (!inputButton || !cycleNav || !todayButton) return;

  const inputCandidates = [
    { x: 0.62, y: 0.27 },
    { x: 0.64, y: 0.35 },
    { x: 0.61, y: 0.43 },
    { x: 0.66, y: 0.52 },
    { x: 0.60, y: 0.61 },
    { x: 0.68, y: 0.70 },
    { x: 0.55, y: 0.78 }
  ];

  const cycleCandidates = [
    { x: 0.69, y: 0.80 },
    { x: 0.72, y: 0.70 },
    { x: 0.67, y: 0.60 },
    { x: 0.74, y: 0.50 },
    { x: 0.63, y: 0.88 },
    { x: 0.78, y: 0.88 },
    { x: 0.57, y: 0.68 }
  ];

  const todayCandidates = [
    { x: 0.86, y: 0.33 },
    { x: 0.84, y: 0.45 },
    { x: 0.87, y: 0.56 },
    { x: 0.82, y: 0.66 },
    { x: 0.88, y: 0.74 },
    { x: 0.80, y: 0.25 },
    { x: 0.90, y: 0.84 }
  ];

  let frame = 0;

  function reposition() {
    frame = 0;

    /* Mobile uses the reserved bottom safe dock. */
    if (innerWidth <= 700) {
      inputButton.removeAttribute("style");
      cycleNav.removeAttribute("style");
      todayButton.removeAttribute("style");
      return;
    }

    const activeSection = getActiveSection();
    const obstacles = [
      ...getTextRects(activeSection),
      ...getControlRects(activeSection)
    ];

    let inputRect;

    /*
      Input page only: place the green birth-info shortcut in the
      upper-right empty zone of the intro panel, as requested.
    */
    if (activeSection?.id === "manse") {
      const introPanel = activeSection.querySelector(".intro-panel");
      if (introPanel && isRenderable(introPanel)) {
        const panelRect = introPanel.getBoundingClientRect();
        const width = inputButton.offsetWidth || 180;
        const height = inputButton.offsetHeight || 58;
        const headerBottom = Math.max(100, document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0);

        const left = clamp(
          panelRect.right - width - Math.max(26, panelRect.width * 0.035),
          panelRect.left + 16,
          innerWidth - width - 18
        );

        const top = clamp(
          panelRect.top + Math.max(72, panelRect.height * 0.10),
          headerBottom + 18,
          innerHeight - height - 20
        );

        inputRect = { left, top, right:left+width, bottom:top+height, width, height };
      }
    }

    if (!inputRect) {
      inputRect = selectBestRect(inputButton, inputCandidates, obstacles);
    }

    /*
      용신 페이지에서는 입력 버튼과 흐름 메뉴가 같은 안전영역으로
      몰리지 않도록 서로 다른 고정 후보 구역을 우선 사용한다.
    */
    if (activeSection?.id === "usefulGodSection") {
      inputRect = candidateRect(inputButton, { x: 0.62, y: 0.84 });
    }

    let cycleRect;

    /*
      Input page only:
      Anchor the vertical fortune-flow menu inside the empty right side
      of the intro panel, matching the user's indicated arrow position.
      Other pages continue to use the automatic safe-zone algorithm.
    */
    if (activeSection?.id === "manse") {
      const introPanel = activeSection.querySelector(".intro-panel");

      if (introPanel && isRenderable(introPanel)) {
        const panelRect = introPanel.getBoundingClientRect();
        const width = cycleNav.offsetWidth || 92;
        const height = cycleNav.offsetHeight || 226;
        const headerBottom = Math.max(100, document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0);

        const left = clamp(
          panelRect.right - width - Math.max(48, panelRect.width * 0.08),
          panelRect.left + 16,
          innerWidth - width - 18
        );

        const top = clamp(
          panelRect.top + panelRect.height * 0.50,
          headerBottom + 18,
          innerHeight - height - 20
        );

        cycleRect = {
          left,
          top,
          right: left + width,
          bottom: top + height,
          width,
          height
        };
      }
    }

    if (activeSection?.id === "usefulGodSection") {
      cycleRect = candidateRect(cycleNav, { x: 0.78, y: 0.52 });
    }

    if (!cycleRect) {
      cycleRect = selectBestRect(cycleNav, cycleCandidates, obstacles, [inputRect]);
    }

    const todayRect = activeSection?.id === "usefulGodSection"
      ? candidateRect(todayButton, { x: 0.89, y: 0.82 })
      : selectBestRect(todayButton, todayCandidates, obstacles, [inputRect, cycleRect]);

    applyRect(inputButton, inputRect);
    applyRect(cycleNav, cycleRect);
    applyRect(todayButton, todayRect);
  }

  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(reposition);
  }

  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("scroll", schedule, { passive: true });
  document.addEventListener("saju:calculated", () => requestAnimationFrame(schedule));

  const observer = new MutationObserver(schedule);
  observer.observe(document.querySelector(".app") || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["hidden", "class"]
  });

  requestAnimationFrame(reposition);
}
