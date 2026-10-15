/* =========================================
   재물운 직접 해석

   목적
   - 투자상품 추천 X
   - 돈 버는 방식
   - 자금 운용 성향
   - 관리 방식
   을 직관적으로 표시
========================================= */


const PILLAR_LABELS = {

  year:
    "년주",

  month:
    "월주",

  day:
    "일주",

  hour:
    "시주"

};


/* =========================================
   십성별 재물 프로필
========================================= */

const WEALTH_PROFILE = {


  /* =====================================
     일원
  ===================================== */

  일원: {

    type:
      "자기주도형",

    summary:
      "본인의 기술과 판단력을 직접 수입으로 연결하는 방식이 재물과 잘 맞습니다.",

    income:
      "본업 역량 · 개인 프로젝트 · 독립 수입",

    management:
      "목적별 계좌 분리 · 예산 기준 고정",

    investment:
      "직접 판단하고 관리하는 자산 성향"

  },


  /* =====================================
     비견
  ===================================== */

  비견: {

    type:
      "독립·성과형",

    summary:
      "남의 자원에 의존하기보다 자신의 기술과 노동, 개인 프로젝트를 직접 수입으로 연결하는 방식이 잘 맞습니다.",

    income:
      "본업 · 개인 프로젝트 · 프리랜스 · 성과 수입",

    management:
      "개인자금과 공동자금 분리",

    investment:
      "본인이 직접 판단하고 관리하는 자산 성향"

  },


  /* =====================================
     겁재
  ===================================== */

  겁재: {

    type:
      "경쟁·변동형",

    summary:
      "경쟁이 있는 환경이나 성과에 따라 수입이 달라지는 구조에서 돈을 만들어내는 힘이 강한 편입니다.",

    income:
      "성과급 · 영업 · 사업 · 프로젝트 수입",

    management:
      "공동자금 분리 · 손실 한도 설정",

    investment:
      "변동성이 있는 자산에 관심이 커질 수 있는 성향"

  },


  /* =====================================
     식신
  ===================================== */

  식신: {

    type:
      "기술·생산형",

    summary:
      "지식이나 기술을 가지고 있는 것만으로 끝내기보다 실제로 서비스·성과·프로젝트로 만들어 수입화하는 방식이 재물과 잘 연결됩니다.",

    income:
      "기술 · 서비스 · 콘텐츠 · 프로젝트",

    management:
      "본업 역량 재투자 · 꾸준한 수입원 구축",

    investment:
      "금융투자보다 자신의 기술·생산성에 먼저 투자하는 성향"

  },


  /* =====================================
     상관
  ===================================== */

  상관: {

    type:
      "아이디어·확장형",

    summary:
      "아이디어나 기술을 실제 서비스와 프로젝트로 만들어 돈으로 바꾸는 방식이 잘 맞습니다.",

    income:
      "기획 · 컨설팅 · 프리랜스 · 콘텐츠 · 프로젝트",

    management:
      "계약 · 세금 · 정산 관리",

    investment:
      "새로운 시장과 상품을 빠르게 살펴보는 성향"

  },


  /* =====================================
     편재
  ===================================== */

  편재: {

    type:
      "유동·성과형",

    summary:
      "한 가지 고정수입만 기다리기보다 프로젝트·성과·부수입·거래처럼 외부 기회를 실제 수입으로 연결하는 방식이 재물과 잘 맞습니다.",

    income:
      "프로젝트 · 성과 · 부수입 · 거래 · 외부 기회",

    management:
      "수입원 분리 · 현금흐름 관리 · 한도 설정",

    investment:
      "유동성이 있는 금융자산 성향"

  },


  /* =====================================
     정재
  ===================================== */

  정재: {

    type:
      "안정·축적형",

    summary:
      "일정한 수입을 꾸준히 쌓고 계획적으로 자산을 늘리는 방식이 재물과 잘 맞습니다.",

    income:
      "급여 · 고정계약 · 반복수입 · 장기적 축적",

    management:
      "자동저축 · 고정비 관리 · 장기계획",

    investment:
      "안정성과 장기 보유를 중시하는 자산 성향"

  },


  /* =====================================
     편관
  ===================================== */

  편관: {

    type:
      "직업·성과형",

    summary:
      "책임이 큰 일을 맡고 실제 성과와 직업적 위치를 높이면서 수입을 키우는 방식이 잘 맞습니다.",

    income:
      "전문직 · 책임수당 · 성과보상 · 직업소득",

    management:
      "본업 안정 우선 · 과도한 레버리지 제한",

    investment:
      "수익보다 위험 통제를 먼저 보는 자산 성향"

  },


  /* =====================================
     정관
  ===================================== */

  정관: {

    type:
      "직업·승진형",

    summary:
      "안정적인 직업 기반을 만들고 승진·직위·경력을 통해 소득을 단계적으로 높이는 방식이 재물과 잘 맞습니다.",

    income:
      "급여 · 승진 · 직위 · 안정적 보상",

    management:
      "장기저축 · 고정비 관리 · 안정적 축적",

    investment:
      "장기·안정형 자산 성향"

  },


  /* =====================================
     편인
  ===================================== */

  편인: {

    type:
      "전문성·기회형",

    summary:
      "특정 분야의 전문지식이나 기술을 깊게 만들어 높은 단가의 수입으로 연결하는 방식이 잘 맞습니다.",

    income:
      "전문기술 · 연구 · 컨설팅 · 지식 수입",

    management:
      "기술 투자와 생활자금 분리",

    investment:
      "정보를 충분히 분석한 뒤 선택하는 성향"

  },


  /* =====================================
     정인
  ===================================== */

  정인: {

    type:
      "전문성·축적형",

    summary:
      "자격·지식·전문경력을 먼저 쌓고 그것을 안정적인 수입으로 전환하는 방식이 재물과 잘 맞습니다.",

    income:
      "자격 · 전문직 · 교육 · 지식 기반 수입",

    management:
      "경력 투자 · 저축 · 장기축적",

    investment:
      "안정성과 장기성을 중시하는 자산 성향"

  }

};


/* =========================================
   위치 표시
========================================= */

function formatPositions(
  positions = []
) {

  if (
    !positions.length
  ) {

    return "—";

  }


  return [

    ...new Set(
      positions
    )

  ]
    .map(
      key =>
        PILLAR_LABELS[
          key
        ] ?? key
    )
    .join(" · ");

}


/* =========================================
   HTML Escape

   내부 고정 데이터지만
   구조적으로 안전하게 처리
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
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================
   재물 프로필 생성
========================================= */

export function buildWealthProfile({

  tenGod,

  positions = [],

  count = 1

}) {

  const profile =
    WEALTH_PROFILE[
      tenGod
    ]
    ??
    WEALTH_PROFILE
      .일원;


  return {

    summary:
      profile.summary,


    facts: [

      {
        label:
          "재물 유형",

        value:
          profile.type
      },

      {
        label:
          "주요 십성",

        value:
          tenGod || "일원"
      },

      {
        label:

          count >= 2

            ? "반복 위치"

            : "작용 위치",

        value:
          formatPositions(
            positions
          )
      },

      {
        label:
          "유리한 수입 방식",

        value:
          profile.income
      },

      {
        label:
          "자금관리",

        value:
          profile.management
      },

      {
        label:
          "투자 성향 예시",

        value:
          profile.investment
      }

    ]

  };

}


/* =========================================
   기존 Modal에서도 바로 사용할 수 있는
   HTML 버전
========================================= */

export function buildWealthSectionHtml({

  tenGod,

  positions = [],

  count = 1

}) {

  const result =
    buildWealthProfile({

      tenGod,

      positions,

      count

    });


  const factsHtml =
    result.facts

      .map(
        item => `

          <span
            style="
              display:grid;
              grid-template-columns:120px 1fr;
              gap:12px;
              margin-top:8px;
            "
          >

            <strong
              style="
                color:rgba(255,255,255,.62);
                font-weight:600;
              "
            >
              ${escapeHtml(
                item.label
              )}
            </strong>


            <span
              style="
                color:rgba(255,255,255,.9);
              "
            >
              ${escapeHtml(
                item.value
              )}
            </span>

          </span>

        `
      )

      .join("");


  return `

    <span
      style="
        display:block;
        margin-bottom:14px;
      "
    >
      ${escapeHtml(
        result.summary
      )}
    </span>

    <span
      style="
        display:block;
        margin-top:8px;
        padding:14px 16px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:14px;
        background:rgba(255,255,255,.025);
      "
    >
      ${factsHtml}
    </span>

  `;

}