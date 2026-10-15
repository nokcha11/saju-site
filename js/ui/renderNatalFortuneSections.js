import {
  getNatalSectionDomain,
  pickStrongestNatalSection
} from "../interpreters/natalFortuneHighlight.js";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

/* Shared ONLY by the natal pillar and natal pattern detail modals. */
export function renderNatalFortuneSections(reading, data) {
  const sections = Array.isArray(reading?.sections) ? reading.sections : [];
  const strongest = pickStrongestNatalSection(reading, data);

  const html = sections.map((section, sectionIndex) => {
    if (!String(section?.text ?? "").trim()) return "";

    const highlighted = strongest?.sectionIndex === sectionIndex;
    const domain = getNatalSectionDomain(section.title);
    const reason = highlighted
      ? `${strongest.source} / ${strongest.focus} - 기존 해석 규칙의 우선순위`
      : "";

    // section.text is the existing trusted interpreter HTML (including wealth details).
    // Keep it intact; never rebuild the interpretation or change its calculations.
    return `
      <section
        class="pillar-modal-section${highlighted ? " natal-fortune-strongest" : ""}"
        ${domain ? `data-natal-domain="${domain}"` : ""}
      >
        <h3 class="natal-fortune-heading">
          <span>${escapeHtml(section.title)}</span>
          ${highlighted ? `
            <span class="natal-fortune-badge" title="${escapeHtml(reason)}">
              대표 운
            </span>
          ` : ""}
        </h3>
        <p>${section.text}</p>
      </section>
    `;
  }).join("");

  return html + (strongest ? `
    <p class="natal-fortune-priority-note">
      금색 테두리는 기존 해석 기준에서 우선하는 영역입니다.
      실제 결과의 확률이나 길흉 점수는 아닙니다.
    </p>
  ` : "");
}
