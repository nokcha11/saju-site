import { renderNatalFortuneSections } from "./renderNatalFortuneSections.js";

import {
  buildPatternReading
} from "../interpreters/patternReading.js";


let previousFocus =
  null;


function ensurePatternModal() {

  let modal =
    document.getElementById(
      "patternDetailModal"
    );


  if (modal) {

    return modal;

  }


  document.body.insertAdjacentHTML(
    "beforeend",
    `

      <div
        id="patternDetailOverlay"
        class="pillar-detail-overlay"
      ></div>


      <div
        id="patternDetailModal"
        class="
          pillar-detail-modal
          pattern-detail-modal
        "
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
        inert
      >

        <button
          type="button"
          class="
            pillar-detail-close
            pattern-detail-close
          "
          aria-label="닫기"
        >
          ×
        </button>


        <div
          id="patternDetailContent"
          class="pillar-detail-content"
        ></div>

      </div>

    `
  );


  modal =
    document.getElementById(
      "patternDetailModal"
    );


  const overlay =
    document.getElementById(
      "patternDetailOverlay"
    );


  function closeModal() {

    if (
      modal.contains(
        document.activeElement
      )
    ) {

      document.activeElement.blur();

    }


    modal.classList.remove(
      "open"
    );


    overlay.classList.remove(
      "open"
    );


    modal.setAttribute(
      "inert",
      ""
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    previousFocus
      ?.focus?.({
        preventScroll: true
      });

  }


  modal
    .querySelector(
      ".pattern-detail-close"
    )
    .addEventListener(
      "click",
      closeModal
    );


  overlay.addEventListener(
    "click",
    closeModal
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        modal.classList.contains(
          "open"
        )
      ) {

        closeModal();

      }

    }
  );


  return modal;
}


function createMeta(
  items
) {

  return `

    <div class="pillar-modal-meta-grid">

      ${items
        .map(
          item => `

            <div>

              <span>
                ${item.label}
              </span>

              <strong>
                ${item.value}
              </strong>

            </div>

          `
        )
        .join("")}

    </div>

  `;
}





export function openPatternDetail(
  data
) {

  const reading =
    buildPatternReading(
      data
    );


  if (!reading) {

    return;

  }


  const modal =
    ensurePatternModal();


  const overlay =
    document.getElementById(
      "patternDetailOverlay"
    );


  const content =
    document.getElementById(
      "patternDetailContent"
    );


  previousFocus =
    document.activeElement;


  content.innerHTML = `

    <div class="pillar-modal-heading">

      <span class="pillar-modal-category">
        ${reading.category}
      </span>


      <div class="pillar-modal-main-text">
        ${reading.symbol}
      </div>


      <h2>
        ${reading.title}
      </h2>


      <p>
        ${reading.keyword}
      </p>

    </div>


    ${createMeta(
      reading.meta
    )}


    <section
      class="
        pillar-modal-section
        result-reading
        pattern-overall-reading
      "
    >

      <h3>
        종합 해석
      </h3>

      <p>
        ${reading.summary}
      </p>

    </section>


    ${(() => {

      const structuralSections =
        Array.isArray(reading.sections)
          ? reading.sections.filter(
              section =>
                section?.title === "병존 핵심" ||
                section?.title === "간여지동 핵심"
            )
          : [];


      if (!structuralSections.length) {

        return "";

      }


      return `

        <details class="pattern-structure-details">

          <summary>
            상세 구조 보기
          </summary>

          <div class="pattern-structure-details-body">

            ${structuralSections
              .map(
                section => `

                  <div class="pattern-structure-detail-row">
                    ${section.text}
                  </div>

                `
              )
              .join("")}

          </div>

        </details>

      `;

    })()}


    ${renderNatalFortuneSections(
      {
        ...reading,
        sections:
          Array.isArray(reading.sections)
            ? reading.sections.filter(
                section =>
                  section?.title !== "병존 핵심" &&
                  section?.title !== "간여지동 핵심"
              )
            : []
      },
      data
    )}


    <p class="pillar-modal-note">

      ※ 병존과 간여지동의 재물·결혼·명예 해석은
      원국 구조의 경향을 보여주는 단계입니다.

      실제 운의 강약과 발생 시기는
      신강·신약, 용신,
      대운·세운까지 함께 계산합니다.

    </p>

  `;


  modal.removeAttribute(
    "inert"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  overlay.classList.add(
    "open"
  );


  modal.classList.add(
    "open"
  );

}


export function bindPatternDetail(
  section,
  items
) {

  ensurePatternModal();


  section.__patternDetailItems =
    items;


  if (
    section.dataset
      .patternDetailBound ===
      "true"
  ) {

    return;

  }


  section.dataset
    .patternDetailBound =
      "true";


  section.addEventListener(
    "click",
    event => {

      const target =
        event.target.closest(
          "[data-pattern-detail]"
        );


      if (!target) {

        return;

      }


      event.preventDefault();

      event.stopPropagation();


      const item =
        section
          .__patternDetailItems?.[
            Number(
              target.dataset
                .patternDetail
            )
          ];


      if (
        item
      ) {

        openPatternDetail(
          item
        );

      }

    },
    true
  );

}