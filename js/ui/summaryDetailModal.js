import {
  ELEMENT_SUMMARY_DESCRIPTIONS,
  ZODIAC_SUMMARY_DESCRIPTIONS
} from "../data/summaryDescriptions.js";


/* =========================================
   대표 십성 직접 해석

   요약 페이지의 세 번째 카드에서 사용
========================================= */

const TEN_GOD_DIRECT_READING = {

  비견: {

    keyword:
      "독립 · 경쟁 · 자기주도",

    headline:
      "남이 정해준 방식보다 자신이 직접 판단하고 움직일 때 능력이 잘 살아나는 독립형입니다.",

    study:
      "혼자 계획을 세우고 반복해서 문제를 푸는 공부가 잘 맞습니다. 모의시험처럼 자신의 실력을 바로 확인할 수 있는 방식에서 집중력이 올라가기 쉽습니다.",

    career:
      "전문직·개인 프로젝트·독립 업무처럼 자신의 실력이 직접 평가되는 직무와 잘 맞습니다. 지나치게 지시만 따르는 환경보다는 일정한 판단권이 있는 업무가 유리합니다.",

    wealth:
      "자신의 기술과 노동을 직접 수입으로 연결하는 방식이 재물과 잘 맞습니다.",

    wealthType:
      "독립·성과형",

    income:
      "본업 · 개인 프로젝트 · 프리랜스 · 성과수입",

    management:
      "개인자금과 공동자금 분리",

    direction:
      "자신의 능력을 직접 돈이 되는 형태로 만드는 방식",

    relation:
      "연애에서도 한쪽이 일방적으로 이끄는 관계보다 서로의 생활과 판단을 존중하는 관계가 잘 맞습니다.",

    caution:
      "혼자 해결하려는 성향이 지나치게 강해지면 도움을 받아야 할 때도 일을 혼자 떠안을 수 있습니다."

  },


  겁재: {

    keyword:
      "경쟁 · 추진 · 기회",

    headline:
      "경쟁이 있거나 빠르게 기회를 잡아야 할 때 추진력이 강하게 살아나는 유형입니다.",

    study:
      "짧은 기간에 집중력을 끌어올리는 힘이 좋습니다. 다만 공부법과 목표를 자주 바꾸기보다 한 계획을 끝까지 밀고 가는 것이 중요합니다.",

    career:
      "영업·성과경쟁·프로젝트·사업처럼 빠른 판단과 추진력이 필요한 환경에서 강점을 쓰기 좋습니다.",

    wealth:
      "성과와 경쟁을 통해 수입을 늘리는 방식과 잘 맞습니다.",

    wealthType:
      "경쟁·변동형",

    income:
      "성과급 · 영업 · 사업 · 프로젝트",

    management:
      "공동자금 분리 · 손실 한도 설정",

    direction:
      "성과가 커질수록 수입도 커지는 구조",

    relation:
      "관계가 빠르게 시작될 수 있지만 서로 주도권을 잡으려는 관계가 되지 않도록 조율하는 것이 중요합니다.",

    caution:
      "동업·공동투자·지인과의 금전거래처럼 사람과 돈이 섞이는 선택은 조건을 명확하게 하는 것이 좋습니다."

  },


  식신: {

    keyword:
      "기술 · 생산 · 결과물",

    headline:
      "배운 것을 머릿속에만 두기보다 직접 해보고 결과물로 완성할 때 능력이 가장 잘 드러나는 실무형입니다.",

    study:
      "단순 암기보다 문제풀이·실기·코딩·포트폴리오·자격 실습처럼 직접 결과를 만들어내는 공부가 잘 맞습니다. 이론을 오래 읽기보다 공부한 내용을 바로 문제나 결과물로 확인하는 방식이 효율적입니다.",

    career:
      "개발·기술·기획·콘텐츠·제작처럼 자신이 만든 결과를 눈으로 확인할 수 있는 직무에서 강점을 쓰기 좋습니다. 포트폴리오·프로젝트 실적·기술 경력을 쌓을수록 유리합니다.",

    wealth:
      "지식이나 기술을 가지고 있는 것만으로 끝내기보다 실제로 서비스·성과·프로젝트로 만들어 수입화하는 방식이 재물과 잘 연결됩니다.",

    wealthType:
      "기술·생산형",

    income:
      "기술 · 서비스 · 프로젝트 · 결과물",

    management:
      "본업 능력에 재투자 · 꾸준한 수입원 구축",

    direction:
      "내가 할 수 있는 일을 돈이 되는 형태로 만드는 방식",

    relation:
      "말보다 실제 행동으로 상대를 챙기는 관계가 잘 맞습니다. 함께 생활하면서 편안함과 신뢰가 쌓일수록 관계가 안정되기 쉽습니다.",

    caution:
      "준비와 공부만 계속하고 실제 결과물을 완성하지 못하면 장점이 약해집니다. 마감일을 정하고 완성물을 하나씩 쌓는 방식이 좋습니다."

  },


  상관: {

    keyword:
      "응용 · 개선 · 표현",

    headline:
      "기존 방식을 그대로 따르기보다 문제점을 발견하고 더 나은 방법으로 바꾸는 능력이 강한 개선형입니다.",

    study:
      "단순 암기보다 논술·면접·코딩테스트·실기처럼 응용력과 문제해결 능력을 보는 평가에서 강점을 쓰기 좋습니다.",

    career:
      "개발·기획·컨설팅·콘텐츠·분석처럼 문제를 발견하고 개선안을 만드는 직무와 잘 맞습니다.",

    wealth:
      "아이디어와 기술을 실제 서비스나 프로젝트로 만들어 수입화하는 방식이 잘 맞습니다.",

    wealthType:
      "아이디어·확장형",

    income:
      "기획 · 컨설팅 · 프리랜스 · 콘텐츠 · 프로젝트",

    management:
      "계약 · 세금 · 정산 관리",

    direction:
      "새로운 아이디어를 실제 수익으로 바꾸는 방식",

    relation:
      "생각과 표현이 빠른 편이라 관계에서는 정답을 따지기보다 상대의 감정을 먼저 확인하는 것이 도움이 됩니다.",

    caution:
      "아이디어를 계속 늘리기보다 실제 완성 가능한 일을 골라 끝까지 마무리하는 것이 중요합니다."

  },


  편재: {

    keyword:
      "성과 · 기회 · 유동성",

    headline:
      "현실적인 기회를 빠르게 파악하고 사람·성과·돈을 실제 결과로 연결하는 능력이 강한 활동형입니다.",

    study:
      "순수 이론 암기보다 실무 사례·응용문제·취업과 직접 연결되는 자격시험에서 강점을 쓰기 좋습니다.",

    career:
      "사업·영업·프로젝트·고객관리·재무처럼 사람과 돈, 실제 성과를 움직이는 업무와 잘 맞습니다.",

    wealth:
      "한 가지 고정수입만 기다리기보다 프로젝트·성과·부수입·거래처럼 외부 기회를 실제 수입으로 연결하는 방식이 재물과 잘 맞습니다.",

    wealthType:
      "유동·성과형",

    income:
      "프로젝트 · 성과 · 부수입 · 거래 · 외부 기회",

    management:
      "수입원 분리 · 현금흐름 관리 · 한도 설정",

    direction:
      "외부 기회와 활동을 실제 수입으로 연결하는 방식",

    relation:
      "외부활동과 사람을 만나는 과정에서 자연스럽게 인연이 생길 가능성이 큽니다.",

    caution:
      "좋아 보이는 기회를 한꺼번에 잡기보다 실제 수익으로 연결될 수 있는 것을 선별하는 것이 중요합니다."

  },


  정재: {

    keyword:
      "안정 · 축적 · 관리",

    headline:
      "계획한 것을 꾸준히 유지하면서 안정적으로 결과를 쌓아가는 현실형입니다.",

    study:
      "계획표를 세우고 일정한 공부량을 유지하는 방식이 잘 맞습니다. 단기간 몰아치는 것보다 반복학습에서 안정적인 성과를 만들기 좋습니다.",

    career:
      "회계·재무·행정·운영·관리처럼 정확성과 지속성이 필요한 직무와 잘 맞습니다.",

    wealth:
      "일정한 수입을 꾸준히 쌓고 계획적으로 자산을 늘리는 방식이 재물과 잘 맞습니다.",

    wealthType:
      "안정·축적형",

    income:
      "급여 · 고정계약 · 반복수입 · 장기축적",

    management:
      "자동저축 · 고정비 관리 · 장기계획",

    direction:
      "안정적인 현금흐름을 장기간 축적하는 방식",

    relation:
      "관계에서도 책임과 안정성을 중요하게 보며 장기적으로 생활을 함께 꾸릴 수 있는 상대를 선호하기 쉽습니다.",

    caution:
      "안정성만 지나치게 추구하면 좋은 변화의 기회를 놓칠 수 있습니다."

  },


  편관: {

    keyword:
      "책임 · 경쟁 · 돌파",

    headline:
      "압박과 책임이 있는 환경에서도 문제를 해결하고 결과를 만들어내는 힘이 강한 책임형입니다.",

    study:
      "경쟁률이 높고 압박감이 있는 시험에서도 목표가 분명하면 집중력을 강하게 끌어올릴 수 있습니다.",

    career:
      "보안·법무·관리·위기대응처럼 정확한 판단과 책임이 필요한 일에서 강점을 쓰기 좋습니다.",

    wealth:
      "직업적인 책임과 성과를 높이면서 수입도 함께 키우는 방식이 잘 맞습니다.",

    wealthType:
      "직업·성과형",

    income:
      "전문직 · 책임수당 · 성과보상 · 직업소득",

    management:
      "본업 안정 우선 · 무리한 확장 제한",

    direction:
      "책임이 큰 역할과 전문성을 소득으로 연결하는 방식",

    relation:
      "강한 추진력과 자기 기준을 가진 사람과 인연이 생길 수 있습니다.",

    caution:
      "성과를 빨리 만들기 위해 무리하거나 모든 책임을 혼자 떠안지 않는 것이 중요합니다."

  },


  정관: {

    keyword:
      "조직 · 책임 · 명예",

    headline:
      "규칙과 기준을 지키면서 신뢰를 쌓고 공식적인 평가를 받는 데 강한 조직형입니다.",

    study:
      "공무원·공기업·전문자격처럼 범위와 평가기준이 명확한 시험과 잘 맞습니다.",

    career:
      "공공기관·행정·관리·법규·보안정책·품질처럼 책임과 기준이 명확한 조직에서 강점을 쓰기 좋습니다.",

    wealth:
      "안정적인 직업 기반을 만들고 승진·직위·경력을 통해 소득을 단계적으로 높이는 방식이 잘 맞습니다.",

    wealthType:
      "직업·승진형",

    income:
      "급여 · 승진 · 직위 · 안정적 보상",

    management:
      "장기저축 · 고정비 관리 · 안정적 축적",

    direction:
      "직업적 위치와 경력을 장기적인 재산으로 연결하는 방식",

    relation:
      "책임감 있고 약속을 지키는 상대와 안정적인 관계를 만드는 방향이 잘 맞습니다.",

    caution:
      "규칙과 평가에 지나치게 맞추다 자신의 적성과 필요를 놓치지 않는 것이 중요합니다."

  },


  편인: {

    keyword:
      "분석 · 전문 · 심화",

    headline:
      "남들이 잘 보지 않는 부분을 파고들고 특정 분야를 깊게 연구하는 전문형입니다.",

    study:
      "전문기술·심화과목·연구형 공부처럼 깊이를 요구하는 분야에서 강점을 쓰기 좋습니다.",

    career:
      "IT·연구·분석·기술·전문 컨설팅처럼 특정 분야를 깊게 파는 직무와 잘 맞습니다.",

    wealth:
      "여러 분야를 조금씩 하기보다 하나의 전문기술을 높은 단가의 수입으로 연결하는 방식이 잘 맞습니다.",

    wealthType:
      "전문성·기회형",

    income:
      "전문기술 · 연구 · 컨설팅 · 지식수입",

    management:
      "기술 투자와 생활자금 분리",

    direction:
      "깊은 전문성을 높은 단가로 전환하는 방식",

    relation:
      "혼자 생각하고 정리할 시간이 필요한 편이라 적당한 개인공간이 있는 관계가 편안합니다.",

    caution:
      "관심분야를 계속 늘리기보다 하나를 실제 경력이나 수입으로 연결한 뒤 확장하는 것이 좋습니다."

  },


  정인: {

    keyword:
      "학습 · 자격 · 전문성",

    headline:
      "배운 내용을 체계적으로 정리하고 지식과 자격을 자신의 기반으로 만드는 학습형입니다.",

    study:
      "이론을 체계적으로 정리하고 반복해서 익히는 필기시험·자격시험과 잘 맞습니다.",

    career:
      "교육·연구·문서·행정·분석·전문자격을 기반으로 하는 직업과 잘 맞습니다.",

    wealth:
      "투자를 서두르기보다 자신의 전문성과 자격을 높여 수입단가를 올리는 방식이 재물과 잘 연결됩니다.",

    wealthType:
      "전문성·축적형",

    income:
      "자격 · 전문직 · 교육 · 지식 기반 수입",

    management:
      "경력 투자 · 저축 · 장기축적",

    direction:
      "지식과 자격을 장기적인 소득기반으로 만드는 방식",

    relation:
      "감정적인 자극보다 신뢰와 안정감을 주는 상대와 관계가 오래가기 쉽습니다.",

    caution:
      "계속 공부하고 준비만 하기보다 자격이나 지식을 실제 취업·경력과 연결하는 것이 중요합니다."

  }

};


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
   Modal 생성

   기존 CSS와 맞는 ID / class 유지
========================================= */

function ensureSummaryModal() {

  let modal =
    document.getElementById(
      "summaryDetailModal"
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
        id="summaryModalOverlay"
        class="
          summary-detail-overlay
          summary-modal-overlay
        "
      ></div>


      <div
        id="summaryDetailModal"
        class="
          summary-detail-modal
          summary-modal
        "
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
        inert
      >

        <button
          type="button"
          class="
            summary-detail-close
            summary-modal-close
          "
          aria-label="닫기"
        >
          ×
        </button>


        <div
          id="summaryDetailContent"
          class="
            summary-detail-content
            summary-modal-content
          "
        ></div>

      </div>

    `
  );


  modal =
    document.getElementById(
      "summaryDetailModal"
    );


  const overlay =
    document.getElementById(
      "summaryModalOverlay"
    );


  const closeButton =
    modal.querySelector(
      ".summary-modal-close"
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
      "aria-hidden",
      "true"
    );


    modal.setAttribute(
      "inert",
      ""
    );

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

    <div class="summary-modal-meta-grid">

      ${items
        .map(
          item => `

            <div>

              <span>
                ${escapeHtml(
                  item.label
                )}
              </span>

              <strong>
                ${escapeHtml(
                  item.value
                )}
              </strong>

            </div>

          `
        )
        .join("")}

    </div>

  `;

}


/* =========================================
   일반 Section
========================================= */

function createSection(
  title,
  text,
  extraClass = ""
) {

  if (
    !text
  ) {

    return "";

  }


  return `

    <section
      class="
        summary-modal-section
        ${extraClass}
      "
    >

      <h3>
        ${escapeHtml(
          title
        )}
      </h3>

      <p>
        ${escapeHtml(
          text
        )}
      </p>

    </section>

  `;

}


/* =========================================
   1. 메인 오행
========================================= */

function createElementContent(
  data
) {

  const description =
    ELEMENT_SUMMARY_DESCRIPTIONS[
      data.element
    ];


  if (
    !description
  ) {

    return `

      <section class="summary-modal-section">

        <h3>
          해석 데이터를 찾을 수 없습니다.
        </h3>

      </section>

    `;

  }


  return `

    <div class="summary-modal-heading">


      <span class="summary-modal-category">

        MAIN ELEMENT

      </span>


      <div class="summary-modal-main-text">

        ${escapeHtml(
          data.hanja
        )}

      </div>


      <h2>

        ${escapeHtml(
          data.korean
        )}

      </h2>


      <p>

        ${escapeHtml(
          description.keyword ?? ""
        )}

      </p>


    </div>


    ${createMeta([

      {
        label:
          "메인 오행",

        value:
          data.korean
      },

      {
        label:
          "해당 일간",

        value:
          data.dayStem
      },

      {
        label:
          "오행",

        value:
          data.hanja
      }

    ])}


    ${createSection(
      "핵심 해석",
      description.meaning
    )}


    ${createSection(
      "강점으로 나타나면",
      description.positive
    )}


    ${createSection(
      "함께 살펴볼 점",
      description.caution
    )}


    <p class="summary-modal-note">

      ※ 메인 오행은 일간의 오행을 기준으로 표시합니다.
      원국 전체의 강약은 신강·신약 계산에서 별도로 판단합니다.

    </p>

  `;

}


/* =========================================
   2. 일주 동물
========================================= */

function createAnimalContent(
  data
) {

  const description =
    ZODIAC_SUMMARY_DESCRIPTIONS[
      data.dayBranch
    ];


  if (
    !description
  ) {

    return `

      <section class="summary-modal-section">

        <h3>
          해석 데이터를 찾을 수 없습니다.
        </h3>

      </section>

    `;

  }


  return `

    <div class="summary-modal-heading">


      <span class="summary-modal-category">

        DAY PILLAR ANIMAL

      </span>


      <div class="summary-modal-main-text">

        ${escapeHtml(
          data.emoji
        )}

      </div>


      <h2>

        ${escapeHtml(
          data.animalName
        )}

      </h2>


      <p>

        ${escapeHtml(
          data.ganji
        )} 일주

      </p>


    </div>


    ${createMeta([

      {
        label:
          "일주",

        value:
          data.ganji
      },

      {
        label:
          "일간",

        value:
          data.dayStem
      },

      {
        label:
          "일지",

        value:
          data.dayBranch
      }

    ])}


    ${createSection(
      "일주 특징",
      description.meaning
    )}


    ${createSection(
      "직업에서 활용하면",
      description.keyword
        ? `${description.keyword}의 특징을 실제 업무 능력으로 연결하는 것이 중요합니다.`
        : ""
    )}


    <p class="summary-modal-note">

      ※ 일주 동물은 일간과 일지의 조합을 이해하기 위한
      보조적인 표현입니다.
      직업과 재물의 최종 판단은 원국 전체를 함께 봅니다.

    </p>

  `;

}


/* =========================================
   재물 상세 블록
========================================= */

function createWealthBlock(
  tenGod,
  rule
) {

  return `

    <section
      class="
        summary-modal-section
        summary-wealth-section
      "
    >

      <h3>
        재물운
      </h3>


      <p>
        ${escapeHtml(
          rule.wealth
        )}
      </p>


      <div
        class="summary-modal-meta-grid"
        style="margin-top:16px;"
      >


        <div>

          <span>
            재물 유형
          </span>

          <strong>
            ${escapeHtml(
              rule.wealthType
            )}
          </strong>

        </div>


        <div>

          <span>
            주요 십성
          </span>

          <strong>
            ${escapeHtml(
              tenGod
            )}
          </strong>

        </div>


        <div>

          <span>
            유리한 수입 방식
          </span>

          <strong>
            ${escapeHtml(
              rule.income
            )}
          </strong>

        </div>


        <div>

          <span>
            자금관리
          </span>

          <strong>
            ${escapeHtml(
              rule.management
            )}
          </strong>

        </div>


        <div>

          <span>
            재물 활용 방향
          </span>

          <strong>
            ${escapeHtml(
              rule.direction
            )}
          </strong>

        </div>


      </div>

    </section>

  `;

}


/* =========================================
   3. 대표 십성

   기존 '타고난 성향' 추상문구 제거
========================================= */

function createTendencyContent(
  data
) {

  const tenGod =
    data.name;


  const rule =
    TEN_GOD_DIRECT_READING[
      tenGod
    ];


  if (
    !rule
  ) {

    return `

      <section class="summary-modal-section">

        <h3>
          해석 데이터를 찾을 수 없습니다.
        </h3>

      </section>

    `;

  }


  return `

    <div class="summary-modal-heading">


      <span class="summary-modal-category">

        REPRESENTATIVE TEN GOD

      </span>


      <div class="summary-modal-main-text">

        ${escapeHtml(
          data.hanja
        )}

      </div>


      <h2>

        ${escapeHtml(
          tenGod
        )}

      </h2>


      <p>

        ${escapeHtml(
          rule.keyword
        )}

      </p>


    </div>


    ${createMeta([

      {
        label:
          "판정 위치",

        value:
          "월간"
      },

      {
        label:
          "해당 천간",

        value:
          data.monthStem
      },

      {
        label:
          "대표 십성",

        value:
          tenGod
      }

    ])}


    ${createSection(
      "핵심 성향",
      rule.headline,
      "summary-result-section"
    )}


    ${createSection(
      "학업 · 합격운",
      rule.study
    )}


    ${createSection(
      "취업 · 직업운",
      rule.career
    )}


    ${createWealthBlock(
      tenGod,
      rule
    )}


    ${createSection(
      "애정 · 관계",
      rule.relation
    )}


    ${createSection(
      "주의할 점",
      rule.caution
    )}


    <p class="summary-modal-note">

      ※ 대표 십성은 현재 월간의 십성을
      빠르게 확인하기 위한 요약입니다.
      최종 판단은 월령·지장간·십성 분포와
      신강·신약을 함께 살펴봅니다.

    </p>

  `;

}


/* =========================================
   모달 열기

   ★ 기존 함수 시그니처 유지

   openSummaryDetailModal(type, data)
========================================= */

export function openSummaryDetailModal(
  type,
  data
) {

  const modal =
    ensureSummaryModal();


  const overlay =
    document.getElementById(
      "summaryModalOverlay"
    );


  const content =
    document.getElementById(
      "summaryDetailContent"
    );


  let html = "";


  if (
    type === "element"
  ) {

    html =
      createElementContent(
        data
      );

  }


  else if (
    type === "animal"
  ) {

    html =
      createAnimalContent(
        data
      );

  }


  else if (
    type === "tendency"
  ) {

    html =
      createTendencyContent(
        data
      );

  }


  if (
    !html
  ) {

    return;

  }


  content.innerHTML =
    html;


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
          ".summary-modal-close"
        )
        ?.focus({
          preventScroll: true
        });

    }
  );

}


/* =========================================
   카드 이름 변경

   타고난 성향 → 대표 십성
========================================= */

function updateTendencyCardLabel(
  section
) {

  section
    .querySelectorAll(
      "*"
    )
    .forEach(
      element => {

        if (
          element.children.length
        ) {

          return;

        }


        const text =
          element.textContent
            ?.trim();


        if (
          text === "타고난 성향"
        ) {

          element.textContent =
            "대표 십성";

        }


        if (
          text === "월간의 십성"
        ) {

          element.textContent =
            "월간 기준";

        }

      }
    );

}


/* =========================================
   Binding

   ★ 기존 renderSajuSummary.js와 동일

   data-summary-card
   element / animal / tendency
========================================= */

export function bindSummaryDetailModal(
  section,
  summaryData
) {

  ensureSummaryModal();


  /*
    렌더링이 다시 되더라도
    최신 데이터를 사용
  */

  section.__summaryData =
    summaryData;


  updateTendencyCardLabel(
    section
  );


  /* =====================================
     Mouse
  ===================================== */

  section.onclick =
    event => {

      const card =
        event.target.closest(
          "[data-summary-card]"
        );


      if (
        !card
      ) {

        return;

      }


      const type =
        card.dataset
          .summaryCard;


      const data =
        section
          .__summaryData?.[
            type
          ];


      if (
        !data
      ) {

        return;

      }


      openSummaryDetailModal(
        type,
        data
      );

  };


  /* =====================================
     Keyboard
  ===================================== */

  section.onkeydown =
    event => {

      const card =
        event.target.closest(
          "[data-summary-card]"
        );


      if (
        !card
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


      const type =
        card.dataset
          .summaryCard;


      const data =
        section
          .__summaryData?.[
            type
          ];


      if (
        !data
      ) {

        return;

      }


      openSummaryDetailModal(
        type,
        data
      );

    };

}