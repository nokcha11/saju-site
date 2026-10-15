import {
  STEMS
} from "../data/stems.js";


import {
  BRANCHES
} from "../data/branches.js";


import {
  calculateTenGod
} from "./tenGods.js";


import {
  getMainHiddenStem
} from "./hiddenStems.js";


/* =========================================
   오행 정보
========================================= */

const ELEMENT_INFO = {

  wood: {

    korean: "목",
    hanja: "木",

    description:
      "성장 · 확장 · 창의",

    stems: [
      "甲",
      "乙"
    ]

  },


  fire: {

    korean: "화",
    hanja: "火",

    description:
      "열정 · 표현 · 활동",

    stems: [
      "丙",
      "丁"
    ]

  },


  earth: {

    korean: "토",
    hanja: "土",

    description:
      "안정 · 현실 · 중재",

    stems: [
      "戊",
      "己"
    ]

  },


  metal: {

    korean: "금",
    hanja: "金",

    description:
      "결단 · 원칙 · 판단",

    stems: [
      "庚",
      "辛"
    ]

  },


  water: {

    korean: "수",
    hanja: "水",

    description:
      "지혜 · 유연 · 흐름",

    stems: [
      "壬",
      "癸"
    ]

  }

};


/* =========================================
   십성 10개
========================================= */

const TEN_GOD_NAMES = [

  "비견",
  "겁재",

  "식신",
  "상관",

  "편재",
  "정재",

  "편관",
  "정관",

  "편인",
  "정인"

];


/* =========================================
   십성 그룹
========================================= */

const TEN_GOD_GROUPS = {

  비견: "비겁",
  겁재: "비겁",

  식신: "식상",
  상관: "식상",

  편재: "재성",
  정재: "재성",

  편관: "관성",
  정관: "관성",

  편인: "인성",
  정인: "인성"

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
   십성 카운트 생성
========================================= */

function createTenGodCounts() {

  const counts = {};


  TEN_GOD_NAMES.forEach(
    name => {

      counts[
        name
      ] = 0;

    }
  );


  return counts;

}


/* =========================================
   메인 계산
========================================= */

export function calculateFiveElements(
  pillars
) {

  const hour =
    splitPillar(
      pillars.hour
    );


  const day =
    splitPillar(
      pillars.day
    );


  const month =
    splitPillar(
      pillars.month
    );


  const year =
    splitPillar(
      pillars.year
    );


  const pillarList = [

    hour,
    day,
    month,
    year

  ];


  /* =========================================
     1. 오행 비율

     천간 4글자
     +
     지지 자체의 오행 4글자

     지장간 사용 X
  ========================================= */

  const counts = {

    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0

  };


  pillarList.forEach(
    pillar => {


      /* 천간 */

      const stemElement =
        STEMS[
          pillar.stem
        ]?.element;


      if (
        stemElement
      ) {

        counts[
          stemElement
        ] += 1;

      }


      /* 지지 자체 오행 */

      const branchElement =
        BRANCHES[
          pillar.branch
        ]?.element;


      if (
        branchElement
      ) {

        counts[
          branchElement
        ] += 1;

      }

    }
  );


  const total =
    8;


  /* =========================================
     오행 %
  ========================================= */

  const ratios = {};


  Object.keys(
    counts
  ).forEach(
    element => {

      ratios[
        element
      ] =
        Number(
          (
            (
              counts[element] /
              total
            )
            * 100
          ).toFixed(1)
        );

    }
  );


  /* =========================================
     2. 일간
  ========================================= */

  const dayMasterStem =
    day.stem;


  const mainElement =
    STEMS[
      dayMasterStem
    ]?.element ?? "";


  /* =========================================
     3. 십성 비율

     천간 4개
     +
     지지의 정기(본기) 4개

     총 8개
  ========================================= */

  const tenGodCounts =
    createTenGodCounts();


  pillarList.forEach(
    pillar => {


      /* ---------------------------------
         천간의 십성
      --------------------------------- */

      const stemTenGod =
        calculateTenGod(
          dayMasterStem,
          pillar.stem
        );


      if (
        stemTenGod &&
        Object.prototype.hasOwnProperty.call(
          tenGodCounts,
          stemTenGod
        )
      ) {

        tenGodCounts[
          stemTenGod
        ] += 1;

      }


      /* ---------------------------------
         지지의 십성

         지지 자체 오행을 쓰는 게 아니라
         정기(본기)를 천간으로 바꿔 계산
      --------------------------------- */

      const mainHiddenStem =
        getMainHiddenStem(
          pillar.branch
        );


      if (
        !mainHiddenStem
      ) {

        return;

      }


      const branchTenGod =
        calculateTenGod(
          dayMasterStem,
          mainHiddenStem
        );


      if (
        branchTenGod &&
        Object.prototype.hasOwnProperty.call(
          tenGodCounts,
          branchTenGod
        )
      ) {

        tenGodCounts[
          branchTenGod
        ] += 1;

      }

    }
  );


  /* =========================================
     십성 %
  ========================================= */

  const tenGodRatios = {};


  TEN_GOD_NAMES.forEach(
    name => {

      tenGodRatios[
        name
      ] =
        Number(
          (
            (
              tenGodCounts[name] /
              total
            )
            * 100
          ).toFixed(1)
        );

    }
  );


  /* =========================================
     4. 각 오행의 십성

     예: 丙 일간

     木 = 편인 / 정인
     火 = 비견 / 겁재
     土 = 식신 / 상관
     金 = 편재 / 정재
     水 = 편관 / 정관
  ========================================= */

  const elementTenGods = {};


  Object.entries(
    ELEMENT_INFO
  ).forEach(
    ([element, info]) => {


      const items =
        info.stems.map(
          stem => {


            const name =
              calculateTenGod(
                dayMasterStem,
                stem
              );


            return {

              stem,

              name,

              count:
                tenGodCounts[
                  name
                ] ?? 0,

              ratio:
                tenGodRatios[
                  name
                ] ?? 0

            };

          }
        );


      elementTenGods[
        element
      ] = {

        group:
          TEN_GOD_GROUPS[
            items[0]?.name
          ] ?? "",

        items

      };

    }
  );


  /* =========================================
     가장 많은 오행
  ========================================= */

  const elementEntries =
    Object.entries(
      counts
    );


  const maxCount =
    Math.max(
      ...elementEntries.map(
        ([, count]) =>
          count
      )
    );


  const minCount =
    Math.min(
      ...elementEntries.map(
        ([, count]) =>
          count
      )
    );


  const strongest =
    elementEntries

      .filter(
        ([, count]) =>
          count === maxCount
      )

      .map(
        ([element]) =>
          element
      );


  const weakest =
    elementEntries

      .filter(
        ([, count]) =>
          count === minCount
      )

      .map(
        ([element]) =>
          element
      );


  return {

    counts,

    ratios,

    total,

    mainElement,

    dayMasterStem,

    strongest,

    weakest,

    elementInfo:
      ELEMENT_INFO,

    tenGodCounts,

    tenGodRatios,

    elementTenGods

  };

}