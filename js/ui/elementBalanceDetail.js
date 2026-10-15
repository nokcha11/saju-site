import {
  ELEMENT_BALANCE_GUIDE
} from "../data/elementBalanceGuide.js";


/* =========================================
   Drawer 생성
========================================= */

function ensureElementDrawer() {

  let drawer =
    document.getElementById(
      "elementBalanceDrawer"
    );


  if (drawer) {
    return drawer;
  }


  document.body.insertAdjacentHTML(
    "beforeend",
    `

      <div
        id="elementBalanceOverlay"
        class="element-balance-overlay"
      ></div>


      <aside
        id="elementBalanceDrawer"
        class="element-balance-drawer"
        aria-hidden="true"
      >


        <button
          type="button"
          class="element-balance-close"
          aria-label="닫기"
        >
          ×
        </button>


        <div
          id="elementBalanceContent"
          class="element-balance-content"
        ></div>


      </aside>

    `
  );


  drawer =
    document.getElementById(
      "elementBalanceDrawer"
    );


  const overlay =
    document.getElementById(
      "elementBalanceOverlay"
    );


  const closeButton =
    drawer.querySelector(
      ".element-balance-close"
    );


  function closeDrawer() {

    drawer.classList.remove(
      "open"
    );


    overlay.classList.remove(
      "open"
    );


    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

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
        event.key === "Escape"
      ) {

        closeDrawer();

      }

    }
  );


  return drawer;

}


/* =========================================
   리스트 출력
========================================= */

function createList(
  values
) {

  return `

    <div class="balance-chip-list">

      ${
        values
          .map(
            value => `

              <span>
                ${value}
              </span>

            `
          )
          .join("")
      }

    </div>

  `;

}


/* =========================================
   Drawer 열기
========================================= */

export function openElementBalanceDetail(
  element,
  ratio
) {

  const guide =
    ELEMENT_BALANCE_GUIDE[
      element
    ];


  if (!guide) {
    return;
  }


  const drawer =
    ensureElementDrawer();


  const overlay =
    document.getElementById(
      "elementBalanceOverlay"
    );


  const content =
    document.getElementById(
      "elementBalanceContent"
    );


  content.innerHTML = `

    <div class="balance-detail-heading">


      <span class="balance-detail-label">
        ELEMENT BALANCE
      </span>


      <div class="balance-detail-title">


        <strong
          class="
            balance-element-symbol
            element-text-${element}
          "
        >
          ${guide.hanja}
        </strong>


        <div>

          <h2>
            ${guide.korean} 기운 보완
          </h2>

          <p>
            ${guide.keyword}
          </p>

        </div>


      </div>


      <div class="balance-current-ratio">

        <span>
          현재 단순 구성비
        </span>

        <strong>
          ${ratio.toFixed(1)}%
        </strong>

      </div>


      <p class="balance-summary">
        ${guide.summary}
      </p>


    </div>


    <section class="balance-detail-section">

      <h3>
        추천 색상
      </h3>

      ${createList(
        guide.colors
      )}

    </section>


    <section class="balance-detail-section">

      <h3>
        전통적인 방향
      </h3>

      <p>
        ${guide.direction}
      </p>

    </section>


    <section class="balance-detail-section">

      <h3>
        잘 어울리는 환경
      </h3>

      ${createList(
        guide.environment
      )}

    </section>


    <section class="balance-detail-section">

      <h3>
        추천 활동
      </h3>

      ${createList(
        guide.activities
      )}

    </section>


    <section class="balance-detail-section">

      <h3>
        생활에서 활용하기
      </h3>

      <p>
        ${guide.lifestyle}
      </p>

    </section>


    <section class="balance-detail-section positive">

      <h3>
        이런 방향으로 활용해보세요
      </h3>

      <p>
        ${guide.strength}
      </p>

    </section>


    <section class="balance-detail-section caution">

      <h3>
        참고할 점
      </h3>

      <p>
        ${guide.caution}
      </p>

    </section>


    <p class="balance-detail-note">

      ※ 현재 보완 가이드는 천간 4자와 지지 4자의
      단순 오행 구성비를 기준으로 한
      전통 명리학적 참고 정보입니다.

      추후 월령·지장간·통근 등을 반영한
      오행 세력과 신강·신약 분석에서는
      실제 보완 필요 여부가 달라질 수 있습니다.

    </p>

  `;


  drawer.classList.add(
    "open"
  );


  overlay.classList.add(
    "open"
  );


  drawer.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* =========================================
   오행 화면과 클릭 연결
========================================= */

export function bindElementBalanceDetail(
  section,
  result
) {

  ensureElementDrawer();


  section.onclick =
    event => {

      const button =
        event.target.closest(
          "[data-element-guide]"
        );


      if (!button) {
        return;
      }


      const element =
        button.dataset.elementGuide;


      const ratio =
        result.ratios[
          element
        ] ?? 0;


      openElementBalanceDetail(
        element,
        ratio
      );

    };

}