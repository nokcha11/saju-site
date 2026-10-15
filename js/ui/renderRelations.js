import {
  calculateRelations
} from "../calculators/relations.js";

import {
  bindRelationDetail
} from "./relationDetailModal.js";

import {
  buildRelationDiagram,
  ensureRelationDiagramCss
} from "./relationDiagram.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* 기존 관계 카드 */

function createRelationCard(item, index) {
  const positive =
    item.category === "combine";

  const name =
    item.displayName ?? item.name;

  return `
    <article
      class="relation-card ${positive ? "combine" : "conflict"}"
      data-relation-index="${index}"
      tabindex="0"
      role="button"
      aria-label="${escapeHtml(name)} 상세 해석 보기"
    >
      <div class="relation-card-top">
        <span>
          ${item.layer === "stem" ? "천간" : "지지"}
        </span>

        <small>
          ${escapeHtml(item.pillars.join(" · "))}
        </small>
      </div>

      <div class="relation-symbol">
        ${escapeHtml(item.symbols)}
      </div>

      <strong>
        ${escapeHtml(name)}
      </strong>

      <p>
        ${escapeHtml(item.basis)}
        ${item.element ? ` · ${escapeHtml(item.element)}` : ""}
      </p>

      <span class="relation-more">
        해석 보기
      </span>
    </article>
  `;
}

/* 전체 관계 화면 */

export function renderRelations(result) {
  let section = document.getElementById(
    "relationsSection"
  );

  if (!section) {
    const resultSection = document.getElementById(
      "resultSection"
    );

    section = document.createElement("section");

    section.id = "relationsSection";
    section.className =
      "page-section relations-section";

    if (resultSection) {
      resultSection.after(section);
    } else {
      document
        .querySelector(".app")
        ?.appendChild(section);
    }
  }

  const pillars = result.toHanjaObject();

  const items = calculateRelations(
    pillars
  );

  const combineItems = items.filter(
    item => item.category === "combine"
  );

  const conflictItems = items.filter(
    item => item.category !== "combine"
  );

  ensureRelationDiagramCss();

  section.innerHTML = `
    <div class="relations-inner glass">
      <div class="relations-heading">
        <span class="section-label">
          PILLAR RELATIONS
        </span>

        <h2>사주 관계</h2>

        <p>
          원국 안에서 서로 만나는 천간과 지지의
          합·충·형·파·해·반합·원진을 분석합니다.
        </p>
      </div>

      <div class="relation-summary">
        <div>
          <span>결합 · 강화</span>
          <strong>${combineItems.length}</strong>
        </div>

        <div>
          <span>변화 · 마찰</span>
          <strong>${conflictItems.length}</strong>
        </div>
      </div>

      ${
        items.length
          ? `
            <div class="relation-grid">
              ${items.map(createRelationCard).join("")}
            </div>
          `
          : `
            <div class="relation-empty">
              현재 원국에서 주요 천간·지지 관계가
              발견되지 않았습니다.
            </div>
          `
      }

      <p class="relations-note">
        카드를 클릭하면 어느 위치 사이에서 성립하는지와
        실제 해석 결과를 확인할 수 있습니다.
      </p>

      ${buildRelationDiagram(pillars, items)}
    </div>
  `;

  section.hidden = false;

  /*
   * 기존 카드와 새로운 SVG 관계명을
   * 같은 상세 해석창에 연결합니다.
   */
  bindRelationDetail(section, items);

  return section;
}