import {
  STEMS
} from "../data/stems.js";


import {
  BRANCHES
} from "../data/branches.js";


import {
  calculateTenGod
} from "../calculators/tenGods.js";


import {
  getMainHiddenStem
} from "../calculators/hiddenStems.js";


import {
  getTwelveStage
} from "../calculators/twelveStages.js";


import {
  bindSummaryDetailModal
} from "./summaryDetailModal.js";


/* =========================================
   오행 표시 정보
========================================= */

const ELEMENT_INFO = {

  wood: {
    hanja: "木",
    korean: "목",
    adjective: "푸른"
  },

  fire: {
    hanja: "火",
    korean: "화",
    adjective: "붉은"
  },

  earth: {
    hanja: "土",
    korean: "토",
    adjective: "노란"
  },

  metal: {
    hanja: "金",
    korean: "금",
    adjective: "하얀"
  },

  water: {
    hanja: "水",
    korean: "수",
    adjective: "검은"
  }

};


/* =========================================
   동물
========================================= */

const ZODIAC = {

  子: {
    name: "쥐",
    emoji: "🐭"
  },

  丑: {
    name: "소",
    emoji: "🐮"
  },

  寅: {
    name: "호랑이",
    emoji: "🐯"
  },

  卯: {
    name: "토끼",
    emoji: "🐰"
  },

  辰: {
    name: "용",
    emoji: "🐲"
  },

  巳: {
    name: "뱀",
    emoji: "🐍"
  },

  午: {
    name: "말",
    emoji: "🐴"
  },

  未: {
    name: "양",
    emoji: "🐑"
  },

  申: {
    name: "원숭이",
    emoji: "🐵"
  },

  酉: {
    name: "닭",
    emoji: "🐔"
  },

  戌: {
    name: "개",
    emoji: "🐶"
  },

  亥: {
    name: "돼지",
    emoji: "🐷"
  }

};


/* =========================================
   십성 한자
========================================= */

const TEN_GOD_HANJA = {

  비견: "比肩",
  겁재: "劫財",

  식신: "食神",
  상관: "傷官",

  편재: "偏財",
  정재: "正財",

  편관: "偏官",
  정관: "正官",

  편인: "偏印",
  정인: "正印",

  일원: "日元"

};


/* =========================================
   기둥 분리
========================================= */

function splitPillar(
  pillar
) {

  const chars =
    Array.from(
      pillar.hanja
    );


  return {

    stem:
      chars[0],

    branch:
      chars[1]

  };

}


/* =========================================
   천간 십성
========================================= */

function getUpperTenGod(
  dayStem,
  targetStem,
  isDay = false
) {

  if (isDay) {
    return "일원";
  }


  return calculateTenGod(
    dayStem,
    targetStem
  );

}


/* =========================================
   지지 십성
========================================= */

function getLowerTenGod(
  dayStem,
  branch
) {

  const mainStem =
    getMainHiddenStem(
      branch
    );


  if (!mainStem) {
    return "—";
  }


  return calculateTenGod(
    dayStem,
    mainStem
  );

}


/* =========================================
   미니 기둥
========================================= */

function createMiniPillar({
  label,
  pillar,
  dayStem,
  isDay
}) {

  const stemInfo =
    STEMS[
      pillar.stem
    ];


  const branchInfo =
    BRANCHES[
      pillar.branch
    ];


  const upperTenGod =
    getUpperTenGod(
      dayStem,
      pillar.stem,
      isDay
    );


  const lowerTenGod =
    getLowerTenGod(
      dayStem,
      pillar.branch
    );


  const twelveStage =
    getTwelveStage(
      dayStem,
      pillar.branch
    );


  return `

    <div class="summary-pillar-column">


      <div class="summary-pillar-label">
        ${label}
      </div>


      <div class="summary-ten-god top">
        ${upperTenGod}
      </div>


      <div
        class="
          summary-char-box
          element-${stemInfo.element}
        "
      >

        <strong>
          ${pillar.stem}
        </strong>

        <span>
          ${stemInfo.korean}
        </span>

      </div>


      <div
        class="
          summary-char-box
          element-${branchInfo.element}
        "
      >

        <strong>
          ${pillar.branch}
        </strong>

        <span>
          ${branchInfo.korean}
        </span>

      </div>


      <div class="summary-ten-god bottom">
        ${lowerTenGod}
      </div>


      <div class="summary-stage">
        ${twelveStage}
      </div>


    </div>

  `;

}


/* =========================================
   전체 렌더링
========================================= */

export function renderSajuSummary(
  result
) {

  let section =
    document.getElementById(
      "sajuSummarySection"
    );


  if (!section) {

    const resultSection =
      document.getElementById(
        "resultSection"
      );


    section =
      document.createElement(
        "section"
      );


    section.id =
      "sajuSummarySection";


    section.className =
      "page-section saju-summary-section";


    if (resultSection) {

      resultSection.before(
        section
      );

    }

  }


  const raw =
    result.toHanjaObject();


  const hour =
    splitPillar(
      raw.hour
    );


  const day =
    splitPillar(
      raw.day
    );


  const month =
    splitPillar(
      raw.month
    );


  const year =
    splitPillar(
      raw.year
    );


  /* =========================================
     메인 오행
  ========================================= */

  const mainElement =
    STEMS[
      day.stem
    ]?.element;


  const mainInfo =
    ELEMENT_INFO[
      mainElement
    ];


  /* =========================================
     일주 동물
  ========================================= */

  const zodiac =
    ZODIAC[
      day.branch
    ];


  const animalName =
    `${mainInfo.adjective} ${zodiac.name}`;


  /* =========================================
     타고난 성향
     월간의 십성
  ========================================= */

  const tendency =
    calculateTenGod(
      day.stem,
      month.stem
    );


  const tendencyHanja =
    TEN_GOD_HANJA[
      tendency
    ] ?? tendency;


  /* =========================================
     모달 데이터
  ========================================= */

  const summaryData = {

    element: {

      element:
        mainElement,

      hanja:
        mainInfo.hanja,

      korean:
        mainInfo.korean,

      dayStem:
        day.stem

    },


    animal: {

      element:
        mainElement,

      emoji:
        zodiac.emoji,

      animalName,

      dayStem:
        day.stem,

      dayBranch:
        day.branch,

      ganji:
        `${day.stem}${day.branch}`

    },


    tendency: {

      name:
        tendency,

      hanja:
        tendencyHanja,

      monthStem:
        month.stem

    }

  };


  /* =========================================
     화면
  ========================================= */

  section.innerHTML = `

    <div class="saju-summary-inner glass">


      <div class="saju-summary-heading">

        <span class="section-label">
          SAJU SUMMARY
        </span>

        <h2>
          나의 사주 한눈에 보기
        </h2>

        <p>
          태어난 순간의 핵심 기운과
          사주 네 기둥을 먼저 확인합니다.
        </p>

      </div>


      <!-- =================================
           핵심 3개
      ================================== -->

      <div class="summary-highlight-grid">


        <!-- 메인 오행 -->

        <article
          class="
            summary-highlight-card
            element-${mainElement}
          "

          data-summary-card="element"

          tabindex="0"

          role="button"
        >

          <span class="summary-card-label">
            메인 오행
          </span>


          <div class="summary-main-symbol">
            ${mainInfo.hanja}
          </div>


          <strong>
            ${mainInfo.korean}
          </strong>


          <small>
            일간 ${day.stem} 기준
          </small>


          <span class="summary-more">
            자세히 보기
          </span>

        </article>


        <!-- 일주 동물 -->

        <article
          class="summary-highlight-card"

          data-summary-card="animal"

          tabindex="0"

          role="button"
        >

          <span class="summary-card-label">
            일주 동물
          </span>


          <div class="summary-animal">
            ${zodiac.emoji}
          </div>


          <strong>
            ${animalName}
          </strong>


          <small>
            ${day.stem}${day.branch} 일주
          </small>


          <span class="summary-more">
            자세히 보기
          </span>

        </article>


        <!-- 타고난 성향 -->

        <article
          class="summary-highlight-card"

          data-summary-card="tendency"

          tabindex="0"

          role="button"
        >

          <span class="summary-card-label">
            타고난 성향
          </span>


          <div class="summary-tendency-hanja">
            ${tendencyHanja}
          </div>


          <strong>
            ${tendency}
          </strong>


          <small>
            월간의 십성
          </small>


          <span class="summary-more">
            자세히 보기
          </span>

        </article>


      </div>


      <!-- =================================
           미니 만세력
      ================================== -->

      <div class="summary-chart">


        <div class="summary-row-labels">

          <div></div>

          <div>
            십성
          </div>

          <div>
            천간
          </div>

          <div>
            지지
          </div>

          <div>
            십성
          </div>

          <div>
            12운성
          </div>

        </div>


        <div class="summary-pillar-grid">


          ${createMiniPillar({
            label: "시주",
            pillar: hour,
            dayStem: day.stem,
            isDay: false
          })}


          ${createMiniPillar({
            label: "일주",
            pillar: day,
            dayStem: day.stem,
            isDay: true
          })}


          ${createMiniPillar({
            label: "월주",
            pillar: month,
            dayStem: day.stem,
            isDay: false
          })}


          ${createMiniPillar({
            label: "년주",
            pillar: year,
            dayStem: day.stem,
            isDay: false
          })}


        </div>


      </div>


      <p class="summary-note">

        ※ 핵심 카드의 해석은 전통 명리학적
        성향을 이해하기 위한 참고 정보입니다.
        전체 판단은 원국의 오행·십성·관계와
        운의 흐름을 함께 살펴봅니다.

      </p>


    </div>

  `;


  section.hidden =
    false;


  /* 카드 클릭 → 모달 */

  bindSummaryDetailModal(
    section,
    summaryData
  );


  section.scrollIntoView({

    behavior:
      "smooth",

    block:
      "start"

  });

}