const EXISTING_HEADER_SELECTOR =
  ".manse-section > .header";


const MENU_ITEMS = [

  {
    label: "입력",
    target: "#manse",
    requiresResult: false
  },

  {
    label: "요약",
    target: "#sajuSummarySection",
    requiresResult: true
  },

  {
    label: "원국",
    target: "#resultSection",
    requiresResult: true
  },

  {
    label: "관계",
    target: "#relationsSection",
    requiresResult: true
  },

  {
    label: "오행",
    target: "#elementsSection",
    requiresResult: true
  },

  {
    label: "신살·길성",
    target: "#sinsalSection",
    requiresResult: true
  },

  {
    label: "오늘의 운세",
    target: "#today",
    requiresResult: false
  }

];


/* =========================================
   해당 섹션으로 정확하게 이동
========================================= */

function moveToSection(
  target
) {

  if (!target) {
    return;
  }


  const top =
    target.offsetTop;


  window.scrollTo({

    top,

    behavior:
      "smooth"

  });

}


/* =========================================
   헤더 생성
========================================= */

function createHeader() {

  if (
    document.getElementById(
      "fixedSiteHeader"
    )
  ) {

    return;

  }


  document
    .querySelector(
      EXISTING_HEADER_SELECTOR
    )
    ?.classList.add(
      "legacy-header-hidden"
    );


  const header =
    document.createElement(
      "header"
    );


  header.id =
    "fixedSiteHeader";


  header.className =
    "fixed-site-header";


  header.innerHTML = `

    <a
      class="fixed-site-logo"
      href="#manse"
      data-target="#manse"
      aria-label="만세력 입력으로 이동"
    >

      <span class="fixed-site-logo-symbol">
        命
      </span>

      <span class="fixed-site-logo-text">
        SAJU
      </span>

    </a>


    <nav
      class="fixed-site-nav"
      aria-label="사주 페이지 메뉴"
    >

      ${MENU_ITEMS

        .map(
          item => `

            <a
              href="${item.target}"

              data-target="${item.target}"

              data-requires-result="${
                item.requiresResult
                  ? "true"
                  : "false"
              }"
            >

              ${item.label}

            </a>

          `
        )

        .join("")}

    </nav>

  `;


  document.body.appendChild(
    header
  );


  /* =====================================
     메뉴 클릭
  ===================================== */

  header.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(
          "a[data-target]"
        );


      if (!link) {
        return;
      }


      event.preventDefault();


      const selector =
        link.dataset.target;


      const requiresResult =
        link.dataset
          .requiresResult ===
          "true";


      const target =
        document.querySelector(
          selector
        );


      /*
        아직 결과 생성 전
      */

      if (
        requiresResult &&
        (
          !target ||
          target.hidden
        )
      ) {

        moveToSection(
          document.querySelector(
            "#manse"
          )
        );


        return;

      }


      moveToSection(
        target
      );

    }
  );

}


createHeader();