/* Shared dialog shell. Move existing nodes; never clone forms or rendered data. */
export function createFloatingDialog({ id, title, eyebrow, kind, onClose }) {
  const dialog = document.createElement("dialog");
  dialog.id = id;
  dialog.className = `saju-floating-dialog saju-floating-dialog--${kind}`;
  dialog.setAttribute("aria-labelledby", `${id}Title`);
  dialog.innerHTML = `
    <div class="saju-floating-frame">
      <header class="saju-floating-heading">
        <div>
          <span class="saju-floating-eyebrow">${eyebrow}</span>
          <h2 id="${id}Title">${title}</h2>
        </div>
        <button type="button" class="saju-floating-close" autofocus
          aria-label="\uCC3D \uB2EB\uAE30">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18"/>
          </svg>
        </button>
      </header>
      <div class="saju-floating-content"></div>
    </div>`;
  document.body.append(dialog);

  const content = dialog.querySelector(".saju-floating-content");
  let mount = null;
  let backdropPointer = false;

  function finish({ reason = "dismiss", restoreFocus = true, restoreScroll = true } = {}) {
    if (!mount) return;
    const { node, placeholder, trigger, x, y } = mount;
    mount = null;
    placeholder.replaceWith(node);
    if (dialog.open) dialog.close();
    if (!document.querySelector(".saju-floating-dialog[open]")) {
      document.documentElement.classList.remove("saju-floating-open");
    }
    if (restoreFocus && trigger?.isConnected) {
      trigger.focus({ preventScroll: true });
    }
    if (restoreScroll) window.scrollTo({ left: x, top: y, behavior: "instant" });
    onClose?.({ reason });
  }

  function open(node, trigger) {
    if (!node || mount || typeof dialog.showModal !== "function") return false;
    const { height } = node.getBoundingClientRect();
    const placeholder = document.createElement("div");
    placeholder.className = "saju-floating-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.style.height = `${height}px`;
    placeholder.style.scrollSnapAlign = getComputedStyle(node).scrollSnapAlign;
    placeholder.style.scrollSnapStop = getComputedStyle(node).scrollSnapStop;
    mount = { node, placeholder, trigger, x: window.scrollX, y: window.scrollY };
    node.replaceWith(placeholder);
    content.append(node);
    document.documentElement.classList.add("saju-floating-open");
    try {
      dialog.showModal();
      content.scrollTop = 0;
      window.scrollTo({ left: mount.x, top: mount.y, behavior: "instant" });
      return true;
    } catch (error) {
      finish({ reason: "error" });
      console.error("Floating dialog could not open:", error);
      return false;
    }
  }

  dialog.querySelector(".saju-floating-close").addEventListener("click", () => finish());
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    finish();
  });
  // Keep Tab/Shift+Tab inside the window, including at the browser-chrome boundary.
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const items = [...dialog.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), ' +
      'select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
    )].filter(item => item.getClientRects().length && getComputedStyle(item).visibility !== "hidden");
    const first = items[0];
    const last = items.at(-1);
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("pointerdown", event => {
    backdropPointer = event.target === dialog;
  });
  dialog.addEventListener("click", event => {
    if (backdropPointer && event.target === dialog) finish();
    backdropPointer = false;
  });
  dialog.addEventListener("close", () => {
    if (!dialog.open) finish();
  });

  return { dialog, open, close: finish };
}
