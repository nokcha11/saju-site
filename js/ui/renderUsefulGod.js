/* =========================================
   용신 · 희신 · 기신
   최종 화면
========================================= */


/* =========================================
   CSS
========================================= */

function ensureUsefulGodCss() {

  const already =
    Array.from(
      document.styleSheets
    )
      .some(
        sheet =>
          sheet.href
          ?.includes(
            "useful-god.css"
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
    "./css/useful-god.css";


  link.dataset.usefulGodCss =
    "true";


  document.head.appendChild(
    link
  );

}


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
   메뉴 이동
========================================= */

function bindUsefulGodNav(
  link
) {

  if (
    !link
    ||
    link.dataset.usefulGodBound ===
      "true"
  ) {

    return;

  }


  link.dataset.usefulGodBound =
    "true";


  link.addEventListener(
    "click",
    event => {

      event.preventDefault();


      const section =
        document.getElementById(
          "usefulGodSection"
        );


      if (
        !section
      ) {

        return;

      }


      window.scrollTo({

        top:
          section.offsetTop,

        behavior:
          "smooth"

      });


      history.replaceState(
        null,
        "",
        "#usefulGodSection"
      );

    }
  );

}


/* =========================================
   상단 메뉴
========================================= */

function ensureUsefulGodNav() {

  const nav =
    document.querySelector(
      ".site-nav"
    );


  if (
    !nav
  ) {

    return;

  }


  let link =
    nav.querySelector(
      'a[href="#usefulGodSection"]'
    );


  if (
    !link
  ) {

    link =
      document.createElement(
        "a"
      );


    link.href =
      "#usefulGodSection";


    link.textContent =
      "용신";


    const strength =
      nav.querySelector(
        'a[href="#strengthSection"]'
      );


    if (
      strength
    ) {

      strength.after(
        link
      );

    }

    else {

      nav.appendChild(
        link
      );

    }

  }


  bindUsefulGodNav(
    link
  );

}


/* =========================================
   페이지
========================================= */

function ensureUsefulGodSection() {

  let section =
    document.getElementById(
      "usefulGodSection"
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
    "usefulGodSection";


  section.className =
    "page-section useful-god-section";


  const strength =
    document.getElementById(
      "strengthSection"
    );


  const sinsal =
    document.getElementById(
      "sinsalSection"
    );


  if (
    strength
  ) {

    strength.after(
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
   십성별 쉬운 뜻
========================================= */

const ROLE_INTERPRETATIONS = {

  peer: {

    helpful:
      "내 판단과 주도권을 세우는 힘이 먼저 필요하다는 뜻입니다. 같은 목표를 가진 동료의 도움도 여기에 해당합니다.",

    harmful:
      "자기주장이나 경쟁이 너무 강해지면 오히려 힘이 분산될 수 있다는 뜻입니다. 혼자 모든 것을 밀어붙이는 상황은 줄이는 편이 좋습니다."

  },


  resource: {

    helpful:
      "배우고 준비하고 도움받는 과정이 유리하다는 뜻입니다. 교육·자료·자격·조언처럼 나를 뒷받침하는 기반입니다.",

    harmful:
      "생각과 준비가 지나치게 많아지면 실제 행동이 늦어질 수 있다는 뜻입니다. 충분히 준비했다면 실행으로 옮기는 것이 중요합니다."

  },


  output: {

    helpful:
      "가지고 있는 능력을 말·기술·기획·제작·콘텐츠처럼 실제 결과물로 꺼내 쓰는 것이 도움이 된다는 뜻입니다.",

    harmful:
      "계속 설명하고 표현하고 결과물을 만들어내는 일이 과해지면 여력이 빠르게 소모될 수 있다는 뜻입니다. 표현이나 창작 자체가 나쁘다는 의미는 아닙니다."

  },


  wealth: {

    helpful:
      "가지고 있는 능력을 돈·성과·실적·프로젝트처럼 현실적인 결과로 연결하는 것이 도움이 된다는 뜻입니다.",

    harmful:
      "돈·실적·성과를 관리해야 하는 요구가 커지면 부담도 커질 수 있다는 뜻입니다. 돈복이 없다는 의미는 아닙니다."

  },


  authority: {

    helpful:
      "목표·규칙·책임을 분명하게 두는 것이 도움이 된다는 뜻입니다. 일정과 역할이 명확할수록 가진 힘을 안정적으로 사용하기 쉽습니다.",

    harmful:
      "책임·평가·규칙·압박을 지나치게 많이 떠안으면 부담이 커질 수 있다는 뜻입니다. 직장이나 책임 자체가 나쁘다는 의미는 아닙니다."

  }

};


/* =========================================
   역할 설명
========================================= */

function getRoleText(
  item,
  helpful
) {

  if (
    !item
  ) {

    return "";

  }


  const reading =
    ROLE_INTERPRETATIONS[
      item.role
    ];


  if (
    !reading
  ) {

    return "";

  }


  return helpful
    ? reading.helpful
    : reading.harmful;

}


/* =========================================
   용신 카드
========================================= */

function buildGodCard(
  title,
  subtitle,
  item,
  helpful
) {

  if (
    !item
  ) {

    return "";

  }


  return `

    <article
      class="useful-god-card"
      data-element="${escapeHtml(
        item.element
      )}"
    >


      <div class="useful-god-card-head">


        <div>

          <span class="useful-god-card-label">

            ${escapeHtml(
              title
            )}

          </span>


          <small>

            ${escapeHtml(
              subtitle
            )}

          </small>

        </div>


        <div class="useful-god-symbol">

          ${escapeHtml(
            item.hanja
          )}

        </div>


      </div>


      <strong class="useful-god-name">

        ${escapeHtml(
          item.korean
        )}

        <span>

          ${escapeHtml(
            item.roleLabel
          )}

        </span>

      </strong>


      <p>

        ${escapeHtml(
          getRoleText(
            item,
            helpful
          )
        )}

      </p>


    </article>

  `;

}


/* =========================================
   적용 용신 방식

   실제 적용된 것만 표시
========================================= */

function buildMethodReading(
  result
) {

  const details =
    result.methodDetails
    ?? [];


  if (
    !details.length
  ) {

    return "";

  }


  return `

    <div class="useful-god-method-summary">


      <strong>

        ${escapeHtml(
          result.method
        )}

      </strong>


      <p>

        ${details
          .map(
            item =>

              `<b>${escapeHtml(
                item.title
              )}</b> — ${escapeHtml(
                item.description
              )}`

          )
          .join(
            "<br>"
          )}

      </p>


    </div>

  `;

}


/* =========================================
   전체 한 문장
========================================= */

function buildOverallReading(
  result
) {

  const y =
    result.yongsin
      ?.role;


  const h =
    result.huisin
      ?.role;


  /*
    비겁 + 인성
  */

  if (
    y === "peer"
    &&
    h === "resource"
  ) {

    return "돈과 성과를 더 많이 챙기기 전에, 그것을 감당할 내 기반과 여력을 먼저 보강하는 편이 도움이 됩니다.";

  }


  /*
    인성 + 비겁
  */

  if (
    y === "resource"
    &&
    h === "peer"
  ) {

    return "바로 결과부터 만들기보다 먼저 배우고 준비해 기반을 갖춘 뒤, 자신의 판단으로 실행해 나가는 순서가 더 잘 맞습니다.";

  }


  /*
    식상
  */

  if (
    y === "output"
  ) {

    return "이미 가지고 있는 힘을 더 쌓기보다 기술과 생각을 실제 행동과 결과물로 꺼내 쓰는 편이 도움이 됩니다.";

  }


  /*
    재성
  */

  if (
    y === "wealth"
  ) {

    return "가지고 있는 능력을 실제 성과·프로젝트·수입처럼 현실적인 결과로 연결하는 방향이 도움이 됩니다.";

  }


  /*
    관성
  */

  if (
    y === "authority"
  ) {

    return "자기 힘으로만 밀어붙이기보다 목표와 책임 범위를 분명히 하고 일정한 기준 안에서 움직이는 편이 도움이 됩니다.";

  }


  return "현재 원국에서 부족한 부분은 보완하고 지나치게 강한 부분은 줄여 전체적인 균형을 맞추는 방향이 도움이 됩니다.";

}


/* =========================================
   직업 해석
========================================= */

function buildWorkReading(
  result
) {

  const y =
    result.yongsin
      ?.role;


  const h =
    result.huisin
      ?.role;


  if (
    y === "peer"
    &&
    h === "resource"
  ) {

    return "준비 없이 여러 역할과 성과 요구를 떠안는 환경보다, 충분히 배우고 지원받으면서 자기 판단으로 일할 수 있는 환경이 더 잘 맞습니다.";

  }


  if (
    y === "resource"
    &&
    h === "peer"
  ) {

    return "처음부터 높은 실적만 요구하는 환경보다 교육·자료·멘토링처럼 배울 기반이 있고, 익숙해진 뒤 스스로 판단해서 일할 수 있는 환경이 잘 맞습니다.";

  }


  if (
    y === "output"
  ) {

    return "정해진 일만 반복하기보다 자신의 기술·아이디어를 직접 사용해 실제 결과물을 만들어낼 수 있는 역할이 잘 맞습니다.";

  }


  if (
    y === "wealth"
  ) {

    return "지식이나 기술을 가지고 있는 것만으로 끝내기보다 실제로 서비스·성과·프로젝트로 만들어 수입화하는 방식이 잘 맞습니다.";

  }


  if (
    y === "authority"
  ) {

    return "업무 기준과 책임 범위가 명확하고 목표와 일정이 분명한 환경에서 능력을 안정적으로 발휘하기 좋습니다.";

  }


  return "도움이 되는 역할은 충분히 활용하고 부담이 되는 역할이 한쪽으로 지나치게 몰리지 않는 환경이 잘 맞습니다.";

}


/* =========================================
   일상적인 결과 행
========================================= */

function buildPlainRow(
  label,
  item,
  helpful
) {

  if (
    !item
  ) {

    return "";

  }


  return `

    <div class="useful-god-plain-row" data-element="${escapeHtml(item.element ?? "")}">


      <div class="useful-god-plain-key">


        <strong>

          ${escapeHtml(
            item.hanja
          )}

          ${escapeHtml(
            item.korean
          )}

        </strong>


        <span>

          ${escapeHtml(
            label
          )}

          ·

          ${escapeHtml(
            item.roleLabel
          )}

        </span>


      </div>


      <p>

        ${escapeHtml(
          getRoleText(
            item,
            helpful
          )
        )}

      </p>


    </div>

  `;

}


/* =========================================
   신강신약을 쉬운 말로
========================================= */

function getStrengthMeaning(
  label
) {

  switch (
    label
  ) {

    case "매우 신약":

      return "본인을 돕는 힘보다 밖으로 쓰거나 감당해야 하는 힘이 훨씬 큰 상태입니다.";


    case "신약":

      return "본인을 돕는 힘보다 밖으로 쓰거나 감당해야 하는 힘이 더 큰 상태입니다.";


    case "중화신약":

      return "거의 균형에 가깝지만, 본인을 돕는 힘보다 밖으로 쓰거나 감당해야 하는 힘이 조금 더 큰 상태입니다.";


    case "중화":

      return "본인을 돕는 힘과 밖으로 사용하는 힘이 비교적 균형을 이루고 있습니다.";


    case "중화신강":

      return "거의 균형에 가깝지만, 스스로 버티고 밀고 나가는 힘이 조금 더 큰 상태입니다.";


    case "신강":

      return "스스로 버티고 밀고 나가는 힘이 뚜렷하게 강한 상태입니다.";


    case "매우 신강":

      return "자기 쪽으로 힘이 매우 강하게 모여 있어 그 힘을 밖으로 적절히 사용하는 것이 중요합니다.";


    default:

      return "일간을 돕는 힘과 소모하는 힘의 균형을 확인한 결과입니다.";

  }

}


/* =========================================
   우선 보완 의미
========================================= */

function getPriorityMeaning(
  item
) {

  if (
    !item
  ) {

    return "";

  }


  switch (
    item.role
  ) {

    case "peer":

      return "스스로 결정하고 움직일 힘과 주도권을 먼저 보강하는 것이 좋습니다.";


    case "resource":

      return "바로 성과부터 내기보다 배움·준비·자료·조언처럼 기반을 먼저 채우는 것이 좋습니다.";


    case "output":

      return "가지고 있는 힘을 실제 행동·기술·표현·결과물로 꺼내 쓰는 것이 좋습니다.";


    case "wealth":

      return "능력을 성과·프로젝트·수입처럼 현실적인 결과로 연결하는 것이 좋습니다.";


    case "authority":

      return "목표와 책임 범위를 분명히 하고 일정한 기준 안에서 움직이는 것이 좋습니다.";


    default:

      return "현재 원국에서 가장 먼저 보완할 기운입니다.";

  }

}


/* =========================================
   가장 큰 지원
========================================= */

function getSupportMeaning(
  role
) {

  switch (
    role
  ) {

    case "resource":

      return "배움·준비·자료·조언처럼 나를 받쳐주는 힘이 현재 가장 큰 도움입니다.";


    case "peer":

      return "내 실행력·주도권·동료의 지원처럼 직접 힘을 보태는 요소가 가장 큰 도움입니다.";


    default:

      return "현재 원국에서 나를 가장 많이 받쳐주는 힘입니다.";

  }

}


/* =========================================
   가장 큰 부담
========================================= */

function getBurdenMeaning(
  role
) {

  switch (
    role
  ) {

    case "wealth":

      return "돈·실적·성과와 현실적인 책임을 관리하는 데 현재 가장 많은 힘을 사용합니다.";


    case "output":

      return "말·표현·생산·결과물을 계속 만들어내는 데 현재 가장 많은 힘을 사용합니다.";


    case "authority":

      return "책임·평가·규칙·압박을 감당하는 데 현재 가장 많은 힘을 사용합니다.";


    default:

      return "현재 원국에서 가장 많은 에너지를 요구하는 부분입니다.";

  }

}


/* =========================================
   판정 근거 카드
========================================= */

function buildEvidenceCard(
  label,
  value,
  meaning,
  element = ""
) {

  return `

    <div data-element="${escapeHtml(element)}">


      <span>

        ${escapeHtml(
          label
        )}

      </span>


      <strong>

        ${escapeHtml(
          value
        )}

      </strong>


      <p>

        ${escapeHtml(
          meaning
        )}

      </p>


    </div>

  `;

}


/* =========================================
   역할과 연결되는 오행 찾기
========================================= */

function getElementForRole(result, role) {
  if (!role) return "";

  const items = [
    result?.yongsin,
    result?.huisin,
    result?.gisin,
    result?.gusin
  ].filter(Boolean);

  return items.find(item => item.role === role)?.element ?? "";
}


/* =========================================
   화면
========================================= */

function buildUsefulGodContent(
  result
) {

  const strength =
    result.strength
    ?? {};


  const support =
    result.evidence
      ?.strongestSupport;


  const burden =
    result.evidence
      ?.strongestBurden;


  return `

    <div class="useful-god-inner glass">


      <!-- =================================
           제목
      ================================== -->

      <div class="useful-god-title">


        <div>

          <span class="useful-god-eyebrow">

            FINAL USEFUL ELEMENT

          </span>


          <h2>

            용신 · 희신 · 기신

          </h2>


          <p>

            원국의 강약·계절·오행 흐름을
            함께 검토한 최종 결과입니다.

          </p>

        </div>


        <div class="useful-god-method">

          <strong>

            ${escapeHtml(
              result.method
            )}

          </strong>


          <span>

            최종 판정

          </span>

        </div>


      </div>



      <!-- =================================
           실제 적용된 용신 방식
      ================================== -->

      ${buildMethodReading(
        result
      )}



      <!-- =================================
           한 문장 결론
      ================================== -->

      <div class="useful-god-main-reading">

        <span>

          이 결과를 한 문장으로 보면

        </span>


        <strong>

          ${escapeHtml(
            buildOverallReading(
              result
            )
          )}

        </strong>

      </div>



      <!-- =================================
           용희기구
      ================================== -->

      <div class="useful-god-grid">


        ${buildGodCard(

          "용신",

          "가장 먼저 필요한 기운",

          result.yongsin,

          true

        )}


        ${buildGodCard(

          "희신",

          "용신 다음으로 도움이 되는 기운",

          result.huisin,

          true

        )}


        ${buildGodCard(

          "기신",

          "과해질 때 부담이 되는 기운",

          result.gisin,

          false

        )}


        ${buildGodCard(

          "구신",

          "기신과 함께 부담을 키울 수 있는 기운",

          result.gusin,

          false

        )}


      </div>



      <!-- =================================
           일상적인 말
      ================================== -->

      <section class="useful-god-plain">


        <h3>

          일상적인 말로 보면

        </h3>


        ${buildPlainRow(

          "용신",

          result.yongsin,

          true

        )}


        ${buildPlainRow(

          "희신",

          result.huisin,

          true

        )}


        ${buildPlainRow(

          "기신",

          result.gisin,

          false

        )}


        ${buildPlainRow(

          "구신",

          result.gusin,

          false

        )}


      </section>



      <!-- =================================
           일 적용
      ================================== -->

      <div class="useful-god-work-reading">

        <span>

          일에 대입하면

        </span>


        <p>

          ${escapeHtml(
            buildWorkReading(
              result
            )
          )}

        </p>

      </div>



      <!-- =================================
           직관적인 근거
      ================================== -->

      <div class="useful-god-evidence">


        <h3>

          왜 이렇게 나왔을까?

        </h3>


        <div class="useful-god-evidence-grid">


          ${buildEvidenceCard(

            "현재 상태",

            `${strength.label ?? ""} · ${Number(
              strength.score
              ?? 0
            ).toFixed(1)}`,

            getStrengthMeaning(
              strength.label
            ),

            ""

          )}



          ${buildEvidenceCard(

            "가장 먼저 보완할 힘",

            `${result.yongsin?.hanja ?? ""} ${result.yongsin?.korean ?? ""} · ${result.yongsin?.roleLabel ?? ""}`,

            getPriorityMeaning(
              result.yongsin
            ),

            result.yongsin?.element ?? ""

          )}



          ${buildEvidenceCard(

            "이미 도움이 되는 힘",

            support

              ? `${support.label} · ${Number(
                  support.value
                ).toFixed(1)}`

              : "확인 중",

            getSupportMeaning(
              support?.role
            ),

            getElementForRole(result, support?.role)

          )}



          ${buildEvidenceCard(

            "현재 가장 힘을 쓰는 곳",

            burden

              ? `${burden.label} · ${Number(
                  burden.value
                ).toFixed(1)}`

              : "확인 중",

            getBurdenMeaning(
              burden?.role
            ),

            getElementForRole(result, burden?.role)

          )}


        </div>


      </div>



      ${
        result.specialCaseReview

          ? `

            <div class="useful-god-special-note">

              <strong>

                특수 구조 확인

              </strong>


              <p>

                ${escapeHtml(
                  result.specialCaseNote
                )}

              </p>

            </div>

          `

          : ""
      }



      <p class="useful-god-note">

        ※ 용신은 억부를 기본으로 하되
        계절은 조후로 보정하고,
        충돌·과다·특수격 조건이 실제로 성립하는 경우에만
        통관·병약·종격을 추가 반영합니다.

      </p>


    </div>

  `;

}


/* =========================================
   렌더
========================================= */

export function renderUsefulGod(
  result
) {

  if (
    !result
  ) {

    throw new Error(
      "용신 계산 결과가 없습니다."
    );

  }


  ensureUsefulGodCss();


  ensureUsefulGodNav();


  const section =
    ensureUsefulGodSection();


  section.hidden =
    false;


  section.innerHTML =
    buildUsefulGodContent(
      result
    );


  return section;

}