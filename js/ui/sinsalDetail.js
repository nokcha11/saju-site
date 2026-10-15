import {
  POSITION_LABELS
} from "../data/sinsalDescriptions.js";


import {
  buildSinsalReading
} from "../interpreters/sinsalReading.js";


let previousFocus = null;


/* =========================================
   관계형 신살 확인
========================================= */

function isRelationItem(
  item
) {

  const basisList =
    Array.isArray(item.basis)

      ? item.basis

      : [
          item.basis
        ];


  return basisList.includes(
    "지지 관계"
  );

}


/* =========================================
   관계 위치
========================================= */

function createRelationLabel(
  item
) {

  if (
    !isRelationItem(item) ||
    !Array.isArray(item.positions) ||
    item.positions.length < 2
  ) {

    return null;

  }


  const symbols =
    Array.from(
      item.branch ?? ""
    );


  const first =
    POSITION_LABELS[
      item.positions[0]
    ] ?? item.positions[0];


  const second =
    POSITION_LABELS[
      item.positions[1]
    ] ?? item.positions[1];


  return `
    ${first}
    ${symbols[0] ?? ""}
    ↔
    ${second}
    ${symbols[1] ?? ""}
  `;

}


/* =========================================
   Drawer 생성
========================================= */

function ensureDrawer() {

  let drawer =
    document.getElementById(
      "sinsalDetailDrawer"
    );


  if (drawer) {
    return drawer;
  }


  document.body.insertAdjacentHTML(
    "beforeend",
    `

      <div
        id="sinsalDetailOverlay"
        class="sinsal-detail-overlay"
      ></div>


      <aside
        id="sinsalDetailDrawer"
        class="sinsal-detail-drawer"
        aria-hidden="true"
        inert
      >


        <button
          type="button"
          class="sinsal-detail-close"
          aria-label="닫기"
        >
          ×
        </button>


        <div
          id="sinsalDetailContent"
          class="sinsal-detail-content"
        ></div>


      </aside>

    `
  );


  drawer =
    document.getElementById(
      "sinsalDetailDrawer"
    );


  const overlay =
    document.getElementById(
      "sinsalDetailOverlay"
    );


  const closeButton =
    drawer.querySelector(
      ".sinsal-detail-close"
    );


  function closeDrawer() {

    if (
      drawer.contains(
        document.activeElement
      )
    ) {

      document.activeElement.blur();

    }


    drawer.classList.remove(
      "open"
    );


    overlay.classList.remove(
      "open"
    );


    drawer.setAttribute(
      "inert",
      ""
    );


    drawer.setAttribute(
      "aria-hidden",
      "true"
    );


    if (
      previousFocus &&
      document.contains(
        previousFocus
      )
    ) {

      requestAnimationFrame(
        () => {

          previousFocus.focus({
            preventScroll: true
          });

        }
      );

    }

  }


  closeButton.addEventListener(
    "click",
    closeDrawer
  );


  overlay.addEventListener(
    "click",
    closeDrawer
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        drawer.classList.contains("open")
      ) {

        closeDrawer();

      }

    }
  );


  return drawer;

}


/* =========================================
   상세창
========================================= */

export function openSinsalDetail(
  item
) {

  const drawer =
    ensureDrawer();


  const overlay =
    document.getElementById(
      "sinsalDetailOverlay"
    );


  const content =
    document.getElementById(
      "sinsalDetailContent"
    );


  const reading =
    buildSinsalReading(
      item
    );


  const relationLabel =
    createRelationLabel(
      item
    );


  const positionLabel =
    relationLabel
      ?? reading.positionLabel;


  const basisLabel =
    Array.isArray(item.basis)

      ? item.basis.join(" · ")

      : item.basis;


  previousFocus =
    document.activeElement;


  content.innerHTML = `


    <div class="detail-heading">


      <span
        class="
          detail-type
          ${
            item.type === "길성"
              ? "good"
              : "special"
          }
        "
      >
        ${item.type}
      </span>


      <h2>
        ${item.name}
      </h2>


      <p>
        ${reading.summary}
      </p>


    </div>


    <div class="detail-meta">


      <div>

        <span>
          위치
        </span>

        <strong>
          ${positionLabel}
        </strong>

      </div>


      <div>

        <span>
          해당 글자
        </span>

        <strong>
          ${item.branch || "—"}
        </strong>

      </div>


      <div>

        <span>
          판정 기준
        </span>

        <strong>
          ${basisLabel}
        </strong>

      </div>


    </div>


    <!-- =================================
         핵심 변경
    ================================== -->

    <section
      class="
        detail-section
        detail-result
      "
    >

      <h3>
        해석 결과
      </h3>

      <p>
        ${reading.result}
      </p>

    </section>


    <section class="detail-section">

      <h3>
        강점으로 활용하면
      </h3>

      <p>
        ${reading.strength}
      </p>

    </section>


    <section
      class="
        detail-section
        caution
      "
    >

      <h3>
        주의할 점
      </h3>

      <p>
        ${reading.caution}
      </p>

    </section>


    <section class="detail-section">

      <h3>
        이렇게 해석한 이유
      </h3>

      <p>
        ${reading.basis}
      </p>

    </section>


    <p class="detail-note">

      ※ 신살·길성은 하나만으로
      길흉을 단정하지 않습니다.
      실제 작용은 십성·오행 세력·합충 관계와
      대운·세운을 함께 확인하여 종합합니다.

    </p>


  `;


  drawer.removeAttribute(
    "inert"
  );


  drawer.setAttribute(
    "aria-hidden",
    "false"
  );


  drawer.classList.add(
    "open"
  );


  overlay.classList.add(
    "open"
  );


  requestAnimationFrame(
    () => {

      drawer
        .querySelector(
          ".sinsal-detail-close"
        )
        ?.focus({
          preventScroll: true
        });

    }
  );

}


/* =========================================
   카드 연결
========================================= */

export function bindSinsalDetail(
  section,
  items
) {

  ensureDrawer();


  section.onclick =
    event => {

      const card =
        event.target.closest(
          "[data-sinsal-index]"
        );


      if (!card) {
        return;
      }


      const index =
        Number(
          card.dataset.sinsalIndex
        );


      const item =
        items[
          index
        ];


      if (!item) {
        return;
      }


      openSinsalDetail(
        item
      );

    };


  section.onkeydown =
    event => {

      const card =
        event.target.closest(
          "[data-sinsal-index]"
        );


      if (!card) {
        return;
      }


      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {

        return;

      }


      event.preventDefault();


      const index =
        Number(
          card.dataset.sinsalIndex
        );


      const item =
        items[
          index
        ];


      if (!item) {
        return;
      }


      openSinsalDetail(
        item
      );

    };

}