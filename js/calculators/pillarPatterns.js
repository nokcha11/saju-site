import {
  STEMS
} from "../data/stems.js";


import {
  BRANCHES
} from "../data/branches.js";


const PILLAR_ORDER = [
  "hour",
  "day",
  "month",
  "year"
];


const PILLAR_LABELS = {
  hour: "시주",
  day: "일주",
  month: "월주",
  year: "년주"
};


/* =========================================
   기둥 분리
========================================= */

function splitPillar(
  pillar
) {

  /*
    라이브러리 반환값이
    { hanja: "乙未" } 형태든
    "乙未" 문자열이든 둘 다 대응
  */

  const ganji =

    typeof pillar === "string"

      ? pillar

      : pillar?.hanja ?? "";


  const [
    stem,
    branch
  ] =
    Array.from(
      ganji
    );


  return {
    stem,
    branch
  };

}


/* =========================================
   병존 명칭
========================================= */

function getCoexistenceLevel(
  count
) {

  if (
    count >= 4
  ) {

    return "4중 병존";

  }


  if (
    count === 3
  ) {

    return "3중 병존";

  }


  return "병존";

}


/* =========================================
   같은 글자 찾기
========================================= */

function findDuplicateSymbols(
  pillars,
  layer
) {

  const groups =
    new Map();


  PILLAR_ORDER.forEach(
    pillarKey => {

      const symbol =
        pillars[
          pillarKey
        ]?.[
          layer
        ];


      if (!symbol) {

        return;

      }


      if (
        !groups.has(
          symbol
        )
      ) {

        groups.set(
          symbol,
          []
        );

      }


      groups
        .get(
          symbol
        )
        .push(
          pillarKey
        );

    }
  );


  return Array
    .from(
      groups.entries()
    )

    .filter(
      (
        [
          ,
          positions
        ]
      ) =>
        positions.length >= 2
    )

    .map(
      (
        [
          symbol,
          positions
        ]
      ) => {

        const info =

          layer === "stem"

            ? STEMS[
                symbol
              ]

            : BRANCHES[
                symbol
              ];


        return {

          type:
            "coexistence",

          layer,

          symbol,

          korean:
            info?.korean ?? "",

          element:
            info?.element ?? "",

          count:
            positions.length,

          level:
            getCoexistenceLevel(
              positions.length
            ),

          positions,

          pillarLabels:
            positions.map(
              key =>
                PILLAR_LABELS[
                  key
                ]
            )

        };

      }
    );

}


/* =========================================
   전체 계산
========================================= */

export function calculatePillarPatterns(
  raw
) {

  const pillars = {};


  PILLAR_ORDER.forEach(
    pillarKey => {

      pillars[
        pillarKey
      ] =
        splitPillar(
          raw[
            pillarKey
          ]
        );

    }
  );


  /* =====================================
     간여지동

     한 기둥 안에서
     천간 오행 = 지지 오행
  ===================================== */

  const ganYeojidong =
    PILLAR_ORDER

      .map(
        pillarKey => {

          const pillar =
            pillars[
              pillarKey
            ];


          const stemElement =
            STEMS[
              pillar.stem
            ]?.element;


          const branchElement =
            BRANCHES[
              pillar.branch
            ]?.element;


          if (
            !stemElement ||
            !branchElement ||
            stemElement !==
              branchElement
          ) {

            return null;

          }


          return {

            type:
              "ganYeojidong",

            pillarKey,

            pillarLabel:
              PILLAR_LABELS[
                pillarKey
              ],

            stem:
              pillar.stem,

            branch:
              pillar.branch,

            ganji:
              `${pillar.stem}${pillar.branch}`,

            element:
              stemElement

          };

        }
      )

      .filter(
        Boolean
      );


  /* =====================================
     천간 병존
  ===================================== */

  const stemCoexistence =
    findDuplicateSymbols(
      pillars,
      "stem"
    );


  /* =====================================
     지지 병존
  ===================================== */

  const branchCoexistence =
    findDuplicateSymbols(
      pillars,
      "branch"
    );


  const coexistence = [

    ...stemCoexistence,
    ...branchCoexistence

  ];


  /* =====================================
     복합 오행
  ===================================== */

  const activeElements = [

    ...ganYeojidong.map(
      item =>
        item.element
    ),

    ...coexistence.map(
      item =>
        item.element
    )

  ].filter(
    Boolean
  );


  const uniqueElements = [
    ...new Set(
      activeElements
    )
  ];


  const summary = {

    ganYeojidongCount:
      ganYeojidong.length,

    coexistenceCount:
      coexistence.length,

    uniqueElements,

    mode:

      activeElements.length === 0

        ? "none"

        : uniqueElements.length === 1

          ? "same-element"

          : "mixed-elements"

  };


  /* =====================================
     기둥별 검색용
  ===================================== */

  const byPillar = {};


  PILLAR_ORDER.forEach(
    pillarKey => {

      byPillar[
        pillarKey
      ] = {

        ganYeojidong:

          ganYeojidong.find(
            item =>
              item.pillarKey ===
              pillarKey
          )

          ?? null,


        stemCoexistence:

          stemCoexistence.find(
            item =>
              item.positions.includes(
                pillarKey
              )
          )

          ?? null,


        branchCoexistence:

          branchCoexistence.find(
            item =>
              item.positions.includes(
                pillarKey
              )
          )

          ?? null

      };

    }
  );


  return {

    pillars,

    ganYeojidong,

    stemCoexistence,

    branchCoexistence,

    coexistence,

    summary,

    byPillar

  };

}