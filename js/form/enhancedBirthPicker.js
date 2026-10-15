/* =========================================
   Inline combo birth date / time picker
   - one field: typing + option selection
   - no separate popup modal
   - arrow inside the same input opens options
   - same DOM works in main form and floating input dialog
========================================= */

const dateInput = document.getElementById("birthDate");
const timeInput = document.getElementById("birthTime");
const unknownTime = document.getElementById("unknownTime");

function pad2(value) {
  return String(value).padStart(2, "0");
}

function emitInputEvents(input) {
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function daysInMonth(year, month) {
  return new Date(Number(year), Number(month), 0).getDate();
}

function createSelect(label) {
  const select = document.createElement("select");
  select.className = "saju-inline-select";
  select.setAttribute("aria-label", label);
  return select;
}

function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = String(value);
  option.textContent = String(label ?? value);
  select.append(option);
}

function closeAllInlinePanels(except = null) {
  document.querySelectorAll(".saju-inline-options.is-open").forEach(panel => {
    if (panel !== except) {
      panel.classList.remove("is-open");
      const shell = panel.closest(".saju-inline-combo");
      shell?.classList.remove("is-open");
      shell?.querySelector(".saju-inline-toggle")?.setAttribute("aria-expanded", "false");
    }
  });
}

function buildComboShell(input, kind) {
  const existing = input.closest(".saju-inline-combo");
  if (existing) return existing;

  const shell = document.createElement("div");
  shell.className = `saju-inline-combo saju-inline-combo--${kind}`;
  input.parentNode.insertBefore(shell, input);
  shell.append(input);

  input.classList.add("saju-inline-input");

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "saju-inline-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", kind === "date" ? "생년월일 옵션 열기" : "태어난 시간 옵션 열기");
  toggle.innerHTML = kind === "date"
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="m9 14 3 3 3-3"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/><path d="m9 17 3 3 3-3"/></svg>';
  shell.append(toggle);

  return shell;
}

function buildDateCombo() {
  if (!dateInput) return;

  const shell = buildComboShell(dateInput, "date");
  const toggle = shell.querySelector(".saju-inline-toggle");

  const panel = document.createElement("div");
  panel.className = "saju-inline-options saju-inline-options--date";

  const year = createSelect("년도");
  const month = createSelect("월");
  const day = createSelect("일");

  const now = new Date();
  const currentYear = now.getFullYear();
  for (let y = currentYear + 10; y >= 1900; y--) addOption(year, y, `${y}년`);
  for (let m = 1; m <= 12; m++) addOption(month, m, `${m}월`);

  function fillDays(preferredDay = null) {
    const y = Number(year.value || currentYear);
    const m = Number(month.value || 1);
    const keep = preferredDay ?? Number(day.value || 1);
    day.innerHTML = "";
    const max = daysInMonth(y, m);
    for (let d = 1; d <= max; d++) addOption(day, d, `${d}일`);
    day.value = String(Math.min(Math.max(keep, 1), max));
  }

  function syncPanelFromInput() {
    const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateInput.value.trim());
    const y = match ? Number(match[1]) : currentYear;
    const m = match ? Number(match[2]) : now.getMonth() + 1;
    const d = match ? Number(match[3]) : now.getDate();
    if ([...year.options].some(o => Number(o.value) === y)) year.value = String(y);
    month.value = String(Math.min(Math.max(m, 1), 12));
    fillDays(d);
  }

  function syncInputFromPanel() {
    dateInput.value = `${year.value}-${pad2(month.value)}-${pad2(day.value)}`;
    emitInputEvents(dateInput);
  }

  year.addEventListener("change", () => {
    fillDays();
    syncInputFromPanel();
  });
  month.addEventListener("change", () => {
    fillDays();
    syncInputFromPanel();
  });
  day.addEventListener("change", syncInputFromPanel);

  panel.append(year, month, day);
  shell.append(panel);

  function open() {
    syncPanelFromInput();
    closeAllInlinePanels(panel);
    panel.classList.add("is-open");
    shell.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function close() {
    panel.classList.remove("is-open");
    shell.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", event => {
    event.stopPropagation();
    panel.classList.contains("is-open") ? close() : open();
  });

  dateInput.addEventListener("input", () => {
    // typing stays fully available; keep options in sync only when open
    if (panel.classList.contains("is-open")) syncPanelFromInput();
  });

  panel.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("click", event => {
    if (!shell.contains(event.target)) close();
  });
}

function buildTimeCombo() {
  if (!timeInput) return;

  const shell = buildComboShell(timeInput, "time");
  const toggle = shell.querySelector(".saju-inline-toggle");

  const panel = document.createElement("div");
  panel.className = "saju-inline-options saju-inline-options--time";

  const ampm = createSelect("오전 오후");
  addOption(ampm, "AM", "오전");
  addOption(ampm, "PM", "오후");

  const hour = createSelect("시");
  for (let h = 1; h <= 12; h++) addOption(hour, h, `${pad2(h)}시`);

  const minute = createSelect("분");
  for (let m = 0; m < 60; m++) addOption(minute, m, `${pad2(m)}분`);

  function parseTimeText(value) {
    const trimmed = value.trim();
    let match = /^(오전|오후)\s*(\d{1,2}):(\d{1,2})$/.exec(trimmed);
    if (match) {
      return {
        ampm: match[1] === "오후" ? "PM" : "AM",
        hour12: Math.min(Math.max(Number(match[2]), 1), 12),
        minute: Math.min(Math.max(Number(match[3]), 0), 59),
      };
    }

    match = /^(\d{1,2}):(\d{1,2})$/.exec(trimmed);
    if (match) {
      const h24 = Math.min(Math.max(Number(match[1]), 0), 23);
      return {
        ampm: h24 >= 12 ? "PM" : "AM",
        hour12: h24 % 12 || 12,
        minute: Math.min(Math.max(Number(match[2]), 0), 59),
      };
    }

    const now = new Date();
    const h24 = now.getHours();
    return {
      ampm: h24 >= 12 ? "PM" : "AM",
      hour12: h24 % 12 || 12,
      minute: now.getMinutes(),
    };
  }

  function syncPanelFromInput() {
    const parsed = parseTimeText(timeInput.value);
    ampm.value = parsed.ampm;
    hour.value = String(parsed.hour12);
    minute.value = String(parsed.minute);
  }

  function syncInputFromPanel() {
    const h12 = Number(hour.value);
    let h24 = h12 % 12;
    if (ampm.value === "PM") h24 += 12;
    timeInput.value = `${pad2(h24)}:${pad2(minute.value)}`;
    emitInputEvents(timeInput);
  }

  ampm.addEventListener("change", syncInputFromPanel);
  hour.addEventListener("change", syncInputFromPanel);
  minute.addEventListener("change", syncInputFromPanel);

  panel.append(ampm, hour, minute);
  shell.append(panel);

  function open() {
    if (timeInput.disabled) return;
    syncPanelFromInput();
    closeAllInlinePanels(panel);
    panel.classList.add("is-open");
    shell.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function close() {
    panel.classList.remove("is-open");
    shell.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", event => {
    event.stopPropagation();
    panel.classList.contains("is-open") ? close() : open();
  });

  timeInput.addEventListener("input", () => {
    if (panel.classList.contains("is-open")) syncPanelFromInput();
  });

  panel.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("click", event => {
    if (!shell.contains(event.target)) close();
  });

  unknownTime?.addEventListener("change", () => {
    toggle.disabled = unknownTime.checked;
    if (unknownTime.checked) close();
  });
}

buildDateCombo();
buildTimeCombo();
