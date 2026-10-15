import { initFloatingSafePosition } from "./floatingSafePosition.js";
import { createFloatingDialog } from "./floatingMenuDialog.js";

/* Three floating shortcuts: input, today, and a compact fortune-flow navigator. */
function initFloatingMenus() {
  if (document.getElementById("sajuFloatingMenus")) return;

  const formPanel = document.querySelector("#manse .form-panel");
  const today = document.getElementById("today");
  if (!formPanel || !today) return;

  const dock = document.createElement("nav");
  dock.id = "sajuFloatingMenus";
  dock.className = "saju-floating-menus";
  dock.setAttribute("aria-label", "빠른 메뉴");
  const cycleCompassSvg = `
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2"/>
      <path d="m14.9 9.1-1.7 4.1-4.1 1.7 1.7-4.1 4.1-1.7Z"/>
    </svg>`;

  dock.innerHTML = `
    <button type="button" id="sajuFloatingInput" class="saju-floating-button"
      aria-haspopup="dialog" aria-controls="sajuInputDialog" aria-expanded="false">
      <span class="saju-floating-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="16" rx="4"/>
          <path d="M8 3v4m8-4v4M4 11h16m-12 4h2m4 0h2m-8 3h2"/></svg>
      </span>
      <span>출생정보 입력</span>
    </button>

    <div id="sajuFloatingCycleNav" class="saju-floating-cycle-nav" aria-label="운세 흐름 빠른 이동">
      <span class="saju-floating-cycle-label" aria-hidden="true" title="운세 흐름">
        <span class="saju-floating-cycle-label-icon">${cycleCompassSvg}</span>
      </span>
      <button type="button" class="saju-floating-cycle-button" data-target="resultSection" data-name="원국" aria-label="원국">
        <span class="saju-floating-cycle-button__text">원국</span>
      </button>
      <span class="saju-floating-cycle-divider" aria-hidden="true"></span>
      <button type="button" class="saju-floating-cycle-button" data-target="fortuneCycleSection" data-name="대운" aria-label="대운">
        <span class="saju-floating-cycle-button__text">대운</span>
      </button>
      <span class="saju-floating-cycle-divider" aria-hidden="true"></span>
      <button type="button" class="saju-floating-cycle-button" data-target="annualFortuneSection" data-name="세운" aria-label="세운">
        <span class="saju-floating-cycle-button__text">세운</span>
      </button>
      <span class="saju-floating-cycle-divider" aria-hidden="true"></span>
      <button type="button" class="saju-floating-cycle-button" data-target="monthlyFortuneSection" data-name="월운" aria-label="월운">
        <span class="saju-floating-cycle-button__text">월운</span>
      </button>
    </div>

    <button type="button" id="sajuFloatingToday"
      class="saju-floating-button saju-floating-button--today"
      aria-haspopup="dialog" aria-controls="sajuTodayDialog" aria-expanded="false">
      <span class="saju-floating-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4"/></svg>
      </span>
      <span>오늘의 운세</span>
    </button>`;

  document.body.append(dock);
  initFloatingSafePosition(dock);

  const inputButton = dock.querySelector("#sajuFloatingInput");
  const todayButton = dock.querySelector("#sajuFloatingToday");
  const cycleNav = dock.querySelector("#sajuFloatingCycleNav");
  let returnToToday = false;

  const inputModal = createFloatingDialog({
    id: "sajuInputDialog",
    title: "출생정보 입력",
    eyebrow: "MY BIRTH CHART",
    kind: "input",
    onClose: ({ reason }) => {
      inputButton.setAttribute("aria-expanded", "false");
      if (reason === "dismiss" && returnToToday) {
        returnToToday = false;
        openToday();
      }
    }
  });

  const todayModal = createFloatingDialog({
    id: "sajuTodayDialog",
    title: "오늘의 운세",
    eyebrow: "DAILY FORTUNE",
    kind: "today",
    onClose: () => todayButton.setAttribute("aria-expanded", "false")
  });

  function openInput({ fromToday = false, trigger = inputButton } = {}) {
    returnToToday = fromToday;
    todayModal.close({ reason: "switch", restoreFocus: false });
    if (inputModal.open(formPanel, trigger)) {
      inputButton.setAttribute("aria-expanded", "true");
    }
  }

  function openToday() {
    inputModal.close({ reason: "switch", restoreFocus: false });
    returnToToday = false;
    if (todayModal.open(today, todayButton)) {
      todayButton.setAttribute("aria-expanded", "true");
    }
  }

  function scrollToFortuneSection(targetId, trigger) {
    const target = document.getElementById(targetId);

    if (!target || target.hidden || getComputedStyle(target).display === "none") {
      openInput({ trigger });
      return;
    }

    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start"
    });
  }

  inputButton.addEventListener("click", () => openInput());
  todayButton.addEventListener("click", openToday);

  cycleNav.addEventListener("click", event => {
    const button = event.target.closest("button[data-target]");
    if (!button) return;
    scrollToFortuneSection(button.dataset.target, button);
  });

  const cycleTargets = [
    "resultSection",
    "fortuneCycleSection",
    "annualFortuneSection",
    "monthlyFortuneSection"
  ];

  function updateCycleNavState() {
    const sections = cycleTargets
      .map(id => document.getElementById(id))
      .filter(section => section && !section.hidden && getComputedStyle(section).display !== "none");

    let activeId = "";
    let bestArea = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const visibleWidth = Math.max(0, Math.min(window.innerWidth, rect.right) - Math.max(0, rect.left));
      const visibleHeight = Math.max(0, Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top));
      const area = visibleWidth * visibleHeight;
      if (area > bestArea) {
        bestArea = area;
        activeId = section.id;
      }
    });

    cycleNav.querySelectorAll("button[data-target]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.target === activeId);
    });
  }

  window.addEventListener("scroll", updateCycleNavState, { passive: true });
  window.addEventListener("resize", updateCycleNavState, { passive: true });
  document.addEventListener("saju:calculated", () => requestAnimationFrame(updateCycleNavState));
  requestAnimationFrame(updateCycleNavState);

  /* The empty-state link switches windows instead of jumping behind the dialog. */
  todayModal.dialog.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('a[href="#manse"]')) return;
    event.preventDefault();
    openInput({ fromToday: true, trigger: todayButton });
  });

  /* Only a successfully completed calculation closes the input dialog. */
  document.addEventListener("saju:calculated", () => {
    if (!inputModal.dialog.open) return;
    const showDaily = returnToToday;
    returnToToday = false;
    inputModal.close({ reason: "calculated", restoreFocus: false });

    if (showDaily) {
      openToday();
    } else {
      requestAnimationFrame(() => {
        const summary = document.getElementById("sajuSummarySection");
        if (!summary) return;
        if (!summary.hasAttribute("tabindex")) summary.tabIndex = -1;
        summary.focus({ preventScroll: true });
        summary.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
          block: "start"
        });
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFloatingMenus, { once: true });
} else {
  initFloatingMenus();
}
