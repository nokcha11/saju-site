import { renderNatalFortuneSections } from "./renderNatalFortuneSections.js";

import {
  buildPillarReading
} from "../interpreters/pillarReading.js";


let previousFocus =
  null;


/* =========================================
   Modal 생성
========================================= */

function ensurePillarModal() {

  let modal =
    document.getElementById(
      "pillarDetailModal"
    );


  if (
    modal
  ) {

    return modal;

  }


  document.body.insertAdjacentHTML(
    "beforeend",
    `

      <div
        id="pillarDetailOverlay"
        class="pillar-detail-overlay"
      ></div>


      <div
        id="pillarDetailModal"
        class="pillar-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
        inert
      >


        <button
          type="button"
          class="pillar-detail-close"
          aria-label="닫기"
        >
          ×
        </button>


        <div
          id="pillarDetailContent"
          class="pillar-detail-content"
        ></div>


      </div>

    `
  );


  modal =
    document.getElementById(
      "pillarDetailModal"
    );


  const overlay =
    document.getElementById(
      "pillarDetailOverlay"
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
      ".pillar-detail-close"
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
        event.key === "Escape"

        &&

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


/* =========================================
   Meta
========================================= */

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


/* =========================================
   지장간 구성
========================================= */

function createHiddenStems(
  reading
) {

  if (
    !reading.hiddenStems
  ) {

    return "";

  }


  return `

    <section class="pillar-modal-section">

      <h3>
        지장간 구성
      </h3>


      <div class="pillar-hidden-detail-list">

        ${reading.hiddenStems
          .map(
            item => `

              <div class="pillar-hidden-detail">


                <div>

                  <strong>
                    ${item.stem}
                  </strong>

                  <span>
                    ${item.korean}
                  </span>

                </div>


                <div>

                  <span>
                    ${item.tenGod}
                  </span>

                  <small>

                    ${
                      item.isMain
                        ? "본기"
                        : "보조"
                    }

                  </small>

                </div>


              </div>

            `
          )
          .join("")}

      </div>

    </section>

  `;

}


/* =========================================
   Open
========================================= */

export function openPillarDetailModal(
  data
) {

  const reading =
    buildPillarReading(
      data
    );


  if (
    !reading
  ) {

    return;

  }


  const modal =
    ensurePillarModal();


  const overlay =
    document.getElementById(
      "pillarDetailOverlay"
    );


  const content =
    document.getElementById(
      "pillarDetailContent"
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


    <!-- =================================
         핵심 운세
    ================================== -->

    <section
      class="
        pillar-modal-section
        result-reading
      "
    >

      <h3>
        핵심 운세
      </h3>

      <p>
        ${reading.summary}
      </p>

    </section>


    ${createHiddenStems(
      reading
    )}


    ${renderNatalFortuneSections(
      reading,
      data
    )}


    <p class="pillar-modal-note">

      ※ 현재 내용은 태어난 원국을 기준으로 한
      전통 명리학적 기본 해석입니다.

      실제 어느 해에 취업·합격·결혼·재물운이
      강하게 들어오는지는 신강·신약,
      용신과 대운·세운을 함께 계산합니다.

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


  requestAnimationFrame(
    () => {

      modal
        .querySelector(
          ".pillar-detail-close"
        )
        ?.focus({
          preventScroll: true
        });

    }
  );

}


/* =========================================
   Binding
========================================= */

export function bindPillarDetailModal(
  section,
  items
) {

  ensurePillarModal();


  section.__pillarDetailItems =
    items;


  /*
    rerender마다 onclick만 갱신
  */

  section.onclick =
    event => {

      const target =
        event.target.closest(
          "[data-pillar-detail]"
        );


      if (
        !target
      ) {

        return;

      }


      const item =
        section
          .__pillarDetailItems?.[
            Number(
              target.dataset
                .pillarDetail
            )
          ];


      if (
        item
      ) {

        openPillarDetailModal(
          item
        );

      }

    };


  section.onkeydown =
    event => {

      const target =
        event.target.closest(
          "[data-pillar-detail]"
        );


      if (
        !target
      ) {

        return;

      }


      if (
        event.key !== "Enter"
        &&
        event.key !== " "
      ) {

        return;

      }


      event.preventDefault();


      const item =
        section
          .__pillarDetailItems?.[
            Number(
              target.dataset
                .pillarDetail
            )
          ];


      if (
        item
      ) {

        openPillarDetailModal(
          item
        );

      }

    };

}