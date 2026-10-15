import {
  getStrengthDescription
} from "../data/strengthDescriptions.js";


import {
  calculateUsefulGod
} from "../calculators/usefulGodCalculator.js";


import {
  renderUsefulGod
} from "./renderUsefulGod.js";


import {
  calculateFortuneCycle
} from "../calculators/fortuneCycle.js";


import {
  renderFortuneCycle
} from "./renderFortuneCycle.js";


/* =========================================
   신강 · 신약
========================================= */

const GROUP_ORDER = [
  "root",
  "peer",
  "resource",
  "output",
  "wealth",
  "authority"
];


/* =========================================
   HTML Escape
========================================= */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      "\"",
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================
   CSS
========================================= */

function ensureStrengthCss() {

  const already =
    Array.from(
      document.styleSheets
    )
      .some(
        sheet =>
          sheet.href
          ?.includes(
            "strength.css"
          )
      );


  if (
    already
  ) {

    return;

  }


  const link =
    document.createElement(
      "link"
    );


  link.rel =
    "stylesheet";


  link.href =
    "./css/strength.css";


  link.dataset.strengthCss =
    "true";


  document.head.appendChild(
    link
  );

}


/* =========================================
   점수
========================================= */

function formatScore(
  value
) {

  const number =
    Number(
      value ?? 0
    );


  return number > 0

    ? `+${number.toFixed(1)}`

    : number.toFixed(1);

}


/* =========================================
   색상
========================================= */

function toneClass(
  value
) {

  const number =
    Number(
      value ?? 0
    );


  if (
    number > 0
  ) {

    return "is-support";

  }


  if (
    number < 0
  ) {

    return "is-pressure";

  }


  return "is-neutral";

}


function resultTone(
  label
) {

  if (
    String(label)
      .includes(
        "신약"
      )
  ) {

    return "is-weak";

  }


  if (
    String(label)
      .includes(
        "신강"
      )
  ) {

    return "is-strong";

  }


  return "is-balanced";

}


/* =========================================
   근거
========================================= */

function buildEvidence(
  group
) {

  if (
    !group?.items?.length
  ) {

    return "해당 없음";

  }


  return group.items
    .map(
      item =>
        `${item.label} ${formatScore(
          item.score
        )}`
    )
    .join(
      " · "
    );

}


/* =========================================
   세부 카드
========================================= */

function buildGroupCard(
  group
) {

  return `

    <article
      class="
        strength-factor-card
        ${toneClass(
          group.score
        )}
      "
    >

      <div class="strength-factor-head">

        <span>
          ${escapeHtml(
            group.label
          )}
        </span>

        <strong>
          ${formatScore(
            group.score
          )}
        </strong>

      </div>


      <p>
        ${escapeHtml(
          buildEvidence(
            group
          )
        )}
      </p>

    </article>

  `;

}


/* =========================================
   월령
========================================= */

function buildSeasonCard(
  result
) {

  const month =
    result.monthCommand;


  return `

    <article
      class="
        strength-factor-card
        ${toneClass(
          month.score
        )}
      "
    >

      <div class="strength-factor-head">

        <span>
          월령
        </span>

        <strong>
          ${formatScore(
            month.score
          )}
        </strong>

      </div>


      <p>

        ${escapeHtml(
          month.branch
        )}월

        ·

        ${escapeHtml(
          month.state
        )}

        ·

        ${escapeHtml(
          month.label
        )}

        <br>

        ${escapeHtml(
          month.description
        )}

      </p>

    </article>

  `;

}


/* =========================================
   관계 보정
========================================= */

function buildRelationCard(
  result
) {

  if (
    !result.relationAdjustment
  ) {

    return "";

  }


  return `

    <article
      class="
        strength-factor-card
        ${toneClass(
          result.relationAdjustment
        )}
      "
    >

      <div class="strength-factor-head">

        <span>
          관계 보정
        </span>

        <strong>
          ${formatScore(
            result.relationAdjustment
          )}
        </strong>

      </div>


      <p>
        합 · 충 등 원국 관계에서 반영된 강약 보정입니다.
      </p>

    </article>

  `;

}


/* =========================================
   해석
========================================= */

function buildStrengthInterpretation(
  result
) {

  const description =
    getStrengthDescription(
      result.label
    );


  return `

    <section class="strength-interpretation">


      <div class="strength-interpretation-title">

        <span>
          INTERPRETATION
        </span>

        <h3>
          ${escapeHtml(
            result.label
          )} 해석
        </h3>

      </div>


      <div class="strength-interpretation-grid">


        <article
          class="
            strength-interpretation-card
            core
          "
        >

          <span class="strength-reading-label">
            핵심
          </span>

          <p>
            ${escapeHtml(
              description.core
            )}
          </p>

        </article>



        <article
          class="
            strength-interpretation-card
            favorable
          "
        >

          <span class="strength-reading-label">
            잘 맞는 방식
          </span>

          <p>
            ${escapeHtml(
              description.favorable
            )}
          </p>

        </article>



        <article
          class="
            strength-interpretation-card
            caution
          "
        >

          <span class="strength-reading-label">
            주의
          </span>

          <p>
            ${escapeHtml(
              description.caution
            )}
          </p>

        </article>


      </div>


      <p class="strength-interpretation-note">

        ※ 신약은 성격이나 의지가 약하다는 뜻이 아니며,
        신강 역시 성격이 강하다는 뜻이 아닙니다.
        사주 원국에서 일간이 받는 지원과 소모의 세력을
        비교한 판정입니다.

      </p>


    </section>

  `;

}


/* =========================================
   신강 페이지
========================================= */

function ensureStrengthSection() {

  let section =
    document.getElementById(
      "strengthSection"
    );


  if (
    section
  ) {

    return section;

  }


  section =
    document.createElement(
      "section"
    );


  section.id =
    "strengthSection";


  section.className =
    "page-section strength-section";


  const elements =
    document.getElementById(
      "elementsSection"
    );


  const sinsal =
    document.getElementById(
      "sinsalSection"
    );


  if (
    elements
  ) {

    elements.after(
      section
    );

  }

  else if (
    sinsal
  ) {

    sinsal.before(
      section
    );

  }

  else {

    document
      .querySelector(
        ".app"
      )
      ?.appendChild(
        section
      );

  }


  return section;

}


/* =========================================
   이전 카드 삭제
========================================= */

function removeOldStrengthCard() {

  document
    .querySelectorAll(
      '[data-strength-analysis="true"]'
    )
    .forEach(
      element => {

        if (
          !element.closest(
            "#strengthSection"
          )
        ) {

          element.remove();

        }

      }
    );

}


/* =========================================
   입력값 읽기
========================================= */

function getFortuneInput() {

  const birthDate =
    document.getElementById(
      "birthDate"
    );


  const birthTime =
    document.getElementById(
      "birthTime"
    );


  const unknownTime =
    document.getElementById(
      "unknownTime"
    );


  const gender =
    document.querySelector(
      'input[name="gender"]:checked'
    );


  return {

    birthDate:
      birthDate?.value
      ?? "",

    birthTime:
      birthTime?.value
      || "12:00",

    unknownTime:
      Boolean(
        unknownTime?.checked
      ),

    gender:
      gender?.value
      ?? ""

  };

}


/* =========================================
   용신 + 대운 + 세운 + 월운
========================================= */

async function renderAdditionalFortunePages(
  strengthResult
) {

  let usefulGodResult =
    null;


  let fortuneResult =
    null;


  let annualResult =
    null;


  /* =====================================
     용신
  ===================================== */

  try {

    usefulGodResult =
      calculateUsefulGod(
        strengthResult
      );


    renderUsefulGod(
      usefulGodResult
    );

  }

  catch (
    error
  ) {

    console.error(
      "용신 계산 오류:",
      error
    );

  }


  /* =====================================
     대운
  ===================================== */

  try {

    const input =
      getFortuneInput();


    if (
      !input.birthDate
      ||
      !input.gender
    ) {

      console.warn(
        "대운 계산에 필요한 출생 정보가 없습니다."
      );

      return;

    }


    fortuneResult =
      calculateFortuneCycle({

        birthDate:
          input.birthDate,

        birthTime:
          input.birthTime,

        unknownTime:
          input.unknownTime,

        gender:
          input.gender,

        pillars:
          strengthResult.pillars,

        count:
          10

      });


    renderFortuneCycle(

      fortuneResult,

      usefulGodResult

    );


    console.log(
      "대운 계산 결과:",
      fortuneResult
    );

  }

  catch (
    error
  ) {

    console.error(
      "대운 계산 오류:",
      error
    );

    return;

  }


  /* =====================================
     세운
  ===================================== */

  try {

    const [
      annualCalculatorModule,
      annualRendererModule
    ] =
      await Promise.all([

        import(
          "../calculators/annualFortune.js"
        ),

        import(
          "./renderAnnualFortune.js"
        )

      ]);


    const calculateAnnualFortune =
      annualCalculatorModule
        .calculateAnnualFortune;


    const renderAnnualFortune =
      annualRendererModule
        .renderAnnualFortune;


    if (
      typeof calculateAnnualFortune !== "function"
      ||
      typeof renderAnnualFortune !== "function"
    ) {

      throw new Error(
        "세운 계산 또는 렌더 함수 export를 확인해주세요."
      );

    }


    const currentYear =
      Number(
        new Intl.DateTimeFormat(
          "en-US",
          {
            timeZone:
              "Asia/Seoul",

            year:
              "numeric"
          }
        ).format(
          new Date()
        )
      );


    annualResult =
      calculateAnnualFortune({

        pillars:
          strengthResult.pillars,

        fortuneCycle:
          fortuneResult,

        startYear:
          currentYear - 4,

        count:
          10

      });


    renderAnnualFortune(

      annualResult,

      usefulGodResult

    );


    console.log(
      "세운 계산 결과:",
      annualResult
    );

  }

  catch (
    annualError
  ) {

    console.error(
      "세운 계산/화면 연결 오류:",
      annualError
    );

    return;

  }


  /* =====================================
     월운

     원국 + 대운 + 세운 + 월운
     종합 계산 후 독립 페이지 출력
  ===================================== */

  try {

    const [
      monthlyCalculatorModule,
      monthlyRendererModule
    ] =
      await Promise.all([

        import(
          "../calculators/monthlyFortune.js"
        ),

        import(
          "./renderMonthlyFortune.js"
        )

      ]);


    const calculateMonthlyFortune =
      monthlyCalculatorModule
        .calculateMonthlyFortune;


    const renderMonthlyFortune =
      monthlyRendererModule
        .renderMonthlyFortune;


    if (
      typeof calculateMonthlyFortune !== "function"
      ||
      typeof renderMonthlyFortune !== "function"
    ) {

      throw new Error(
        "월운 계산 또는 렌더 함수 export를 확인해주세요."
      );

    }


    const input =
      getFortuneInput();


    const monthlyResult =
      calculateMonthlyFortune({

        annualResult,

        annualYear:
          annualResult.currentAnnualYear,

        usefulGod:
          usefulGodResult,

        gender:
          input.gender

      });


    renderMonthlyFortune(
      monthlyResult
    );


    console.log(
      "월운 계산 결과:",
      monthlyResult
    );

  }

  catch (
    monthlyError
  ) {

    console.error(
      "월운 계산/화면 연결 오류:",
      monthlyError
    );

  }

}


/* =========================================
   렌더
========================================= */

export function renderStrength(
  first,
  second
) {

  ensureStrengthCss();


  removeOldStrengthCard();


  const result =
    second
    ??
    first;


  if (
    !result
  ) {

    throw new Error(
      "신강·신약 계산 결과가 없습니다."
    );

  }


  const section =
    ensureStrengthSection();


  section.hidden =
    false;


  section.innerHTML = `

    <div
      class="
        strength-inner
        glass
      "

      data-strength-analysis="true"
    >


      <div class="strength-title-row">


        <div>

          <span class="section-label">
            DAY MASTER STRENGTH
          </span>


          <h2>
            신강 · 신약
          </h2>


          <p>
            월령 · 통근 · 강근 · 투간 · 지장간을
            함께 반영한 일간의 실제 강약입니다.
          </p>

        </div>


        <span class="strength-confidence">

          ${escapeHtml(
            result.confidence
          )}

        </span>


      </div>



      <div class="strength-summary-grid">


        <article class="strength-main-card">

          <span>
            일간
          </span>


          <strong>

            ${escapeHtml(
              result.dayMaster.stem
            )}

            ${escapeHtml(
              result.dayMaster.hanja
            )}

          </strong>


          <small>

            ${escapeHtml(
              result.dayMaster.korean
            )} 일간

          </small>

        </article>



        <article
          class="
            strength-main-card
            ${resultTone(
              result.label
            )}
          "
        >

          <span>
            최종 판정
          </span>


          <strong>

            ${escapeHtml(
              result.label
            )}

          </strong>


          <small>

            ${escapeHtml(
              result.summary
            )}

          </small>

        </article>



        <article class="strength-main-card">

          <span>
            강도 지수
          </span>


          <strong>

            ${Number(
              result.score
            ).toFixed(1)}

            <em>
              / 100
            </em>

          </strong>


          <small>
            오행 비율과는 별도의 일간 강약 지수
          </small>

        </article>


      </div>



      <div class="strength-meter">


        <div class="strength-meter-track">

          <span
            class="strength-meter-fill"

            style="
              width:
              ${Math.max(
                0,
                Math.min(
                  100,
                  Number(
                    result.score
                  )
                )
              )}%;
            "
          >
          </span>


          <span class="strength-meter-center">
          </span>

        </div>


        <div class="strength-meter-labels">

          <span>
            신약
          </span>

          <span>
            중화
          </span>

          <span>
            신강
          </span>

        </div>


      </div>



      <div class="strength-balance-row">


        <article>

          <span>
            일간을 돕는 힘
          </span>


          <strong>

            +${Number(
              result.supportScore
            ).toFixed(1)}

          </strong>


          <small>
            월령 지원 · 통근 · 비겁 · 인성
          </small>

        </article>



        <article>

          <span>
            소모 · 압박
          </span>


          <strong>

            -${Number(
              result.pressureScore
            ).toFixed(1)}

          </strong>


          <small>
            불리한 월령 · 식상 · 재성 · 관성
          </small>

        </article>


      </div>



      <div class="strength-factor-grid">


        ${buildSeasonCard(
          result
        )}


        ${GROUP_ORDER
          .map(
            key =>
              buildGroupCard(
                result.groups[
                  key
                ]
              )
          )
          .join("")}


        ${buildRelationCard(
          result
        )}


      </div>



      ${buildStrengthInterpretation(
        result
      )}



      <p class="strength-note">

        ※ ${escapeHtml(
          result.convention
        )} 기준입니다.

        ${escapeHtml(
          result.note
        )}

      </p>


    </div>

  `;


  /* =====================================
     용신 + 대운 + 세운 독립 페이지
  ===================================== */

  renderAdditionalFortunePages(
    result
  );


  return section;

}