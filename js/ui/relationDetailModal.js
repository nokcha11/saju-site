import {
  buildRelationReading
} from "../interpreters/relationReading.js";


let previousFocus = null;


/* =========================================
   모달 생성
========================================= */

function ensureRelationModal() {

  let modal =
    document.getElementById(
      "relationDetailModal"
    );


  if (modal) {
    return modal;
  }


  document.body.insertAdjacentHTML(
    "beforeend",
    `

      <div
        id="relationDetailOverlay"
        class="relation-detail-overlay"
      ></div>


      <div
        id="relationDetailModal"
        class="relation-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
        inert
      >


        <button
          type="button"
          class="relation-detail-close"
          aria-label="닫기"
        >
          ×
        </button>


        <div
          id="relationDetailContent"
        ></div>


      </div>

    `
  );


  modal =
    document.getElementById(
      "relationDetailModal"
    );


  const overlay =
    document.getElementById(
      "relationDetailOverlay"
    );


  const closeButton =
    modal.querySelector(
      ".relation-detail-close"
    );


  function closeModal() {

    if (
      !modal.classList.contains(
        "open"
      )
    ) {
      return;
    }


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
        event.key ===
        "Escape"
      ) {

        closeModal();

      }

    }
  );


  return modal;

}


/* =========================================
   모달 열기
========================================= */

export function openRelationDetail(
  item
) {

  const modal =
    ensureRelationModal();


  const overlay =
    document.getElementById(
      "relationDetailOverlay"
    );


  const content =
    document.getElementById(
      "relationDetailContent"
    );


  const reading =
    buildRelationReading(
      item
    );


  previousFocus =
    document.activeElement;


  content.innerHTML = `


    <div class="relation-modal-heading">


      <span>
        PILLAR RELATION
      </span>


      <div class="relation-modal-symbol">

        ${item.symbols}

      </div>


      <h2>

        ${item.displayName ?? item.name}

      </h2>


      <p>

        ${reading.locationLabel}

      </p>


    </div>


    <div class="relation-modal-meta">


      <div>

        <span>
          위치
        </span>

        <strong>
          ${reading.locationLabel}
        </strong>

      </div>


      <div>

        <span>
          관계
        </span>

        <strong>
          ${item.name}
        </strong>

      </div>


      <div>

        <span>
          판정 기준
        </span>

        <strong>
          ${item.basis}
        </strong>

      </div>


    </div>


    <section
      class="
        relation-modal-section
        result
      "
    >

      <h3>
        해석 결과
      </h3>

      <p>
        ${reading.result}
      </p>

    </section>


    <section
      class="
        relation-modal-section
        positive
      "
    >

      <h3>
        강점으로 활용하면
      </h3>

      <p>
        ${reading.strength}
      </p>

    </section>


    <section
      class="
        relation-modal-section
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


    <section class="relation-modal-section">

      <h3>
        이렇게 판정했습니다
      </h3>

      <p>
        ${reading.basis}
      </p>

    </section>


    <p class="relation-modal-note">

      ※ 합·충·형·파·해·원진·반합은
      하나의 관계만으로 길흉을 단정하지 않습니다.

      실제 작용은 오행 세력,
      신강·신약과 대운·세운을 함께 확인합니다.

    </p>


  `;


  modal.removeAttribute(
    "inert"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  modal.classList.add(
    "open"
  );


  overlay.classList.add(
    "open"
  );


  requestAnimationFrame(
    () => {

      modal
        .querySelector(
          ".relation-detail-close"
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

export function bindRelationDetail(
  section,
  items
) {

  ensureRelationModal();


  section.onclick =
    event => {

      const card =
        event.target.closest(
          "[data-relation-index]"
        );


      if (!card) {
        return;
      }


      const index =
        Number(
          card.dataset.relationIndex
        );


      const item =
        items[
          index
        ];


      if (!item) {
        return;
      }


      openRelationDetail(
        item
      );

    };


  section.onkeydown =
    event => {

      const card =
        event.target.closest(
          "[data-relation-index]"
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
          card.dataset.relationIndex
        );


      const item =
        items[
          index
        ];


      if (!item) {
        return;
      }


      openRelationDetail(
        item
      );

    };

}