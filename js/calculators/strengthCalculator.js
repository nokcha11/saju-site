import {
  STEMS
} from "../data/stems.js";


import {
  BRANCHES
} from "../data/branches.js";


/* =========================================
   오행 생극 관계
========================================= */

const GENERATES = {

  wood:
    "fire",

  fire:
    "earth",

  earth:
    "metal",

  metal:
    "water",

  water:
    "wood"

};


const CONTROLS = {

  wood:
    "earth",

  fire:
    "metal",

  earth:
    "water",

  metal:
    "wood",

  water:
    "fire"

};


/* =========================================
   오행 표시
========================================= */

const ELEMENT_LABELS = {

  wood: {
    korean:
      "목",

    hanja:
      "木"
  },


  fire: {
    korean:
      "화",

    hanja:
      "火"
  },


  earth: {
    korean:
      "토",

    hanja:
      "土"
  },


  metal: {
    korean:
      "금",

    hanja:
      "金"
  },


  water: {
    korean:
      "수",

    hanja:
      "水"
  }

};


/* =========================================
   기둥 표시
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
   지장간

   배열 순서
   여기 → 중기 → 본기

   마지막 값 = 본기
========================================= */

const HIDDEN_STEMS = {

  子: [
    "癸"
  ],


  丑: [
    "癸",
    "辛",
    "己"
  ],


  寅: [
    "戊",
    "丙",
    "甲"
  ],


  卯: [
    "乙"
  ],


  辰: [
    "乙",
    "癸",
    "戊"
  ],


  巳: [
    "戊",
    "庚",
    "丙"
  ],


  午: [
    "丙",
    "己",
    "丁"
  ],


  未: [
    "丁",
    "乙",
    "己"
  ],


  申: [
    "戊",
    "壬",
    "庚"
  ],


  酉: [
    "辛"
  ],


  戌: [
    "辛",
    "丁",
    "戊"
  ],


  亥: [
    "甲",
    "壬"
  ]

};


/* =========================================
   지장간 기본 가중치

   본기 > 중기 > 여기
========================================= */

const HIDDEN_BASE_WEIGHTS = {

  1: [
    3.5
  ],


  2: [
    1.75,
    3.5
  ],


  3: [
    1.0,
    1.75,
    3.5
  ]

};


/* =========================================
   지지 위치 가중치

   월지:
   계절과 연결되므로 강화

   일지:
   일간과 가까워 강화
========================================= */

const PILLAR_MULTIPLIER = {

  year:
    1.0,

  month:
    1.2,

  day:
    1.15,

  hour:
    1.0

};


/* =========================================
   천간 가중치
========================================= */

const VISIBLE_WEIGHTS = {

  /* 비겁 */
  peer:
    8,


  /* 인성 */
  resource:
    6,


  /* 식상 */
  output:
    -5,


  /* 재성 */
  wealth:
    -4,


  /* 관성 */
  authority:
    -7

};


/* =========================================
   지장간 작용 가중치

   같은 오행은 통근으로 분리
========================================= */

const HIDDEN_MULTIPLIER = {

  root:
    2.0,

  resource:
    1.0,

  output:
    -0.9,

  wealth:
    -0.7,

  authority:
    -1.0

};


/* =========================================
   ★ 강근(强根) 질적 보정

   단순히 지장간에 같은 오행이
   들어 있다고 모두 같은 통근으로
   보지 않습니다.

   본기 자체가 일간과 같은 오행이면
   해당 지지를 강한 뿌리로 봅니다.

   일지와 시지를 특히 중요하게 반영.
========================================= */

const STRONG_ROOT_BONUS = {

  year:
    3.0,

  month:
    5.0,

  day:
    6.0,

  hour:
    5.0

};


/* =========================================
   같은 지지 내부에서

   일간과 같은 오행의 지장간이
   2개 이상 존재할 경우 추가 보정

   예:
   丙火 기준 午

   丙 + 丁
   → 火 뿌리가 중첩
========================================= */

const MULTI_ROOT_BONUS =
  2.0;


/* =========================================
   표시 이름
========================================= */

const GROUP_LABELS = {

  root:
    "통근",

  peer:
    "비겁",

  resource:
    "인성",

  output:
    "식상",

  wealth:
    "재성",

  authority:
    "관성"

};


/* =========================================
   숫자 Helper
========================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );

}


function round1(
  value
) {

  return Math.round(
    value * 10
  ) / 10;

}


/* =========================================
   문자 읽기
========================================= */

function readSymbol(
  value
) {

  if (
    value == null
  ) {

    return "";

  }


  if (
    typeof value === "string"
  ) {

    return value.trim();

  }


  if (
    typeof value === "object"
  ) {

    return String(

      value.symbol
      ??
      value.hanja
      ??
      value.value
      ??
      value.name
      ??
      ""

    ).trim();

  }


  return String(
    value
  ).trim();

}


/* =========================================
   기둥 정규화
========================================= */

function normalizePillar(
  value
) {

  if (
    !value
  ) {

    return null;

  }


  /* 문자열 */

  if (
    typeof value === "string"
  ) {

    const chars =
      Array.from(
        value.trim()
      );


    if (
      chars.length >= 2
    ) {

      return {

        stem:
          chars[0],

        branch:
          chars[1]

      };

    }


    return null;

  }


  /* 객체 */

  const ganji =
    readSymbol(

      value.ganji
      ??
      value.pillar
      ??
      value.value

    );


  const ganjiChars =
    Array.from(
      ganji
    );


  const stem =

    readSymbol(

      value.stem
      ??
      value.gan
      ??
      value.heavenlyStem
      ??
      value.cheongan
      ??
      value.sky

    )

    ||

    ganjiChars[0]

    ||

    "";


  const branch =

    readSymbol(

      value.branch
      ??
      value.ji
      ??
      value.earthlyBranch
      ??
      value.jiji
      ??
      value.ground

    )

    ||

    ganjiChars[1]

    ||

    "";


  if (
    !stem ||
    !branch
  ) {

    return null;

  }


  return {

    stem,

    branch

  };

}


/* =========================================
   원국 데이터 찾기
========================================= */

function resolvePillars(
  source
) {

  const candidate =

    source?.pillars
    ??
    source?.fourPillars
    ??
    source?.saju
    ??
    source?.chart
    ??
    source;


  if (
    !candidate
  ) {

    throw new Error(
      "신강·신약 계산에 사용할 원국 데이터가 없습니다."
    );

  }


  /* 배열 형태 */

  if (
    Array.isArray(
      candidate
    )
  ) {

    const mapped = {};


    candidate.forEach(
      item => {

        const key =

          item?.pillarKey
          ??
          item?.key
          ??
          item?.type;


        if (
          [
            "year",
            "month",
            "day",
            "hour"
          ].includes(
            key
          )
        ) {

          mapped[
            key
          ] =
            normalizePillar(
              item
            );

        }

      }
    );


    if (
      !mapped.day ||
      !mapped.month
    ) {

      throw new Error(
        "배열형 원국은 pillarKey(year/month/day/hour)가 필요합니다."
      );

    }


    return mapped;

  }


  /* 객체 형태 */

  const result = {};


  [
    "year",
    "month",
    "day",
    "hour"
  ].forEach(
    key => {

      const value =

        candidate[
          key
        ]

        ??

        candidate[
          `${key}Pillar`
        ]

        ??

        candidate[
          `${key}Ju`
        ];


      result[
        key
      ] =
        normalizePillar(
          value
        );

    }
  );


  if (
    !result.day ||
    !result.month
  ) {

    throw new Error(
      "일주와 월주를 찾지 못했습니다."
    );

  }


  return result;

}


/* =========================================
   일간과 대상 오행 관계
========================================= */

function relationGroup(
  dayElement,
  targetElement
) {

  if (
    !dayElement ||
    !targetElement
  ) {

    return "";

  }


  /* 같은 오행 → 비겁 */

  if (
    targetElement ===
    dayElement
  ) {

    return "peer";

  }


  /* 상대가 나를 생 → 인성 */

  if (
    GENERATES[
      targetElement
    ] ===
    dayElement
  ) {

    return "resource";

  }


  /* 내가 상대를 생 → 식상 */

  if (
    GENERATES[
      dayElement
    ] ===
    targetElement
  ) {

    return "output";

  }


  /* 내가 상대를 극 → 재성 */

  if (
    CONTROLS[
      dayElement
    ] ===
    targetElement
  ) {

    return "wealth";

  }


  /* 상대가 나를 극 → 관성 */

  if (
    CONTROLS[
      targetElement
    ] ===
    dayElement
  ) {

    return "authority";

  }


  return "";

}


/* =========================================
   월령

   旺
   같은 오행

   相
   월령이 일간을 생

   休
   일간이 월령을 생

   囚
   일간이 월령을 극

   死
   월령이 일간을 극
========================================= */

function getSeasonInfo(
  dayElement,
  monthElement
) {

  /* 旺 */

  if (
    dayElement ===
    monthElement
  ) {

    return {

      score:
        22,

      state:
        "왕(旺)",

      label:
        "득령",

      description:
        "월지의 계절 기운과 일간의 오행이 같아 계절의 힘을 직접 받습니다."

    };

  }


  /* 相 */

  if (
    GENERATES[
      monthElement
    ] ===
    dayElement
  ) {

    return {

      score:
        14,

      state:
        "상(相)",

      label:
        "계절 지원",

      description:
        "월지의 계절 기운이 일간을 생해 힘을 보태줍니다."

    };

  }


  /* 休 */

  if (
    GENERATES[
      dayElement
    ] ===
    monthElement
  ) {

    return {

      score:
        -6,

      state:
        "휴(休)",

      label:
        "설기 계절",

      description:
        "일간이 계절의 기운을 생하므로 자신의 힘이 밖으로 빠져나갑니다."

    };

  }


  /* 囚 */

  if (
    CONTROLS[
      dayElement
    ] ===
    monthElement
  ) {

    return {

      score:
        -10,

      state:
        "수(囚)",

      label:
        "재성 계절",

      description:
        "일간이 월지의 계절 기운을 제어해야 하므로 힘을 사용합니다."

    };

  }


  /* 死 */

  if (
    CONTROLS[
      monthElement
    ] ===
    dayElement
  ) {

    return {

      score:
        -16,

      state:
        "사(死)",

      label:
        "관성 계절",

      description:
        "월지의 계절 기운이 일간을 직접 제어해 부담이 커집니다."

    };

  }


  return {

    score:
      0,

    state:
      "중립",

    label:
      "중립",

    description:
      "월령에서 특별한 강약 보정이 없습니다."

  };

}


/* =========================================
   7단계 판정
========================================= */

function strengthLabel(
  score
) {

  if (
    score < 30
  ) {

    return "매우 신약";

  }


  if (
    score < 40
  ) {

    return "신약";

  }


  if (
    score < 47
  ) {

    return "중화신약";

  }


  if (
    score <= 53
  ) {

    return "중화";

  }


  if (
    score <= 60
  ) {

    return "중화신강";

  }


  if (
    score <= 70
  ) {

    return "신강";

  }


  return "매우 신강";

}


/* =========================================
   판정 문장
========================================= */

function strengthSummary(
  label
) {

  if (
    label === "매우 신약"
  ) {

    return "일간을 돕는 힘보다 소모·압박이 매우 크게 작용합니다.";

  }


  if (
    label === "신약"
  ) {

    return "일간을 돕는 힘보다 소모·압박이 뚜렷하게 우세합니다.";

  }


  if (
    label === "중화신약"
  ) {

    return "지원도 있지만 소모·압박이 조금 더 우세한 편입니다.";

  }


  if (
    label === "중화"
  ) {

    return "일간을 돕는 힘과 소모시키는 힘이 비교적 균형을 이룹니다.";

  }


  if (
    label === "중화신강"
  ) {

    return "전체적으로 균형을 이루면서 일간의 힘이 조금 더 우세합니다.";

  }


  if (
    label === "신강"
  ) {

    return "통근·비겁·인성 등 일간을 지지하는 힘이 뚜렷하게 강합니다.";

  }


  return "일간을 지지하고 강화하는 힘이 매우 강하게 집중되어 있습니다.";

}


/* =========================================
   그룹 초기화
========================================= */

function createGroupMap() {

  return {

    root: {
      score:
        0,

      items:
        []
    },


    peer: {
      score:
        0,

      items:
        []
    },


    resource: {
      score:
        0,

      items:
        []
    },


    output: {
      score:
        0,

      items:
        []
    },


    wealth: {
      score:
        0,

      items:
        []
    },


    authority: {
      score:
        0,

      items:
        []
    }

  };

}


/* =========================================
   계산 항목 추가
========================================= */

function pushContribution(
  groups,
  group,
  item,
  score
) {

  if (
    !groups[
      group
    ]
  ) {

    return;

  }


  groups[
    group
  ].score +=
    score;


  groups[
    group
  ].items.push({

    ...item,

    score:
      round1(
        score
      )

  });

}


/* =========================================
   지장간 위치 점수
========================================= */

function getHiddenWeight(
  hiddenList,
  index
) {

  return HIDDEN_BASE_WEIGHTS[
    hiddenList.length
  ]?.[
    index
  ]
  ??
  0;

}


/* =========================================
   ★ 지지의 강한 통근 여부

   본기가 일간과 같은 오행인가?
========================================= */

function isStrongMainRoot(
  branch,
  dayElement
) {

  const hiddenList =
    HIDDEN_STEMS[
      branch
    ]
    ??
    [];


  if (
    !hiddenList.length
  ) {

    return false;

  }


  const mainStem =
    hiddenList[
      hiddenList.length - 1
    ];


  return (
    STEMS[
      mainStem
    ]?.element ===
    dayElement
  );

}


/* =========================================
   ★ 같은 지지 내부에
      일간과 같은 오행이 몇 개 있는가
========================================= */

function countSameElementRoots(
  branch,
  dayElement
) {

  const hiddenList =
    HIDDEN_STEMS[
      branch
    ]
    ??
    [];


  return hiddenList.filter(
    stem =>

      STEMS[
        stem
      ]?.element ===
      dayElement

  ).length;

}


/* =========================================
   ★ 통근의 질적 보정

   기존:
   지장간 숫자만 가산

   수정:
   본기 통근 여부까지 별도 반영
========================================= */

function applyStrongRootBonus(
  groups,
  pillars,
  dayElement
) {

  [
    "year",
    "month",
    "day",
    "hour"
  ].forEach(
    pillarKey => {

      const pillar =
        pillars[
          pillarKey
        ];


      if (
        !pillar
      ) {

        return;

      }


      const branch =
        pillar.branch;


      /* -----------------------------
         1. 본기가 같은 오행인가
      ----------------------------- */

      const strongMainRoot =
        isStrongMainRoot(

          branch,

          dayElement

        );


      if (
        !strongMainRoot
      ) {

        return;

      }


      const mainBonus =
        STRONG_ROOT_BONUS[
          pillarKey
        ]
        ??
        0;


      if (
        mainBonus
      ) {

        pushContribution(

          groups,

          "root",

          {

            source:
              "root-quality",

            pillarKey,

            branch,

            label:
              `${PILLAR_LABELS[pillarKey]} ${branch} 본기 통근 보정`

          },

          mainBonus

        );

      }


      /* -----------------------------
         2. 같은 오행 뿌리가
            지장간에 2개 이상 있는가
      ----------------------------- */

      const sameRootCount =
        countSameElementRoots(

          branch,

          dayElement

        );


      if (
        sameRootCount >= 2
      ) {

        pushContribution(

          groups,

          "root",

          {

            source:
              "multi-root",

            pillarKey,

            branch,

            label:
              `${PILLAR_LABELS[pillarKey]} ${branch} 복수 통근 보정`

          },

          MULTI_ROOT_BONUS

        );

      }

    }
  );

}


/* =========================================
   신강 · 신약 계산
========================================= */

export function calculateStrength(
  source,
  options = {}
) {

  const pillars =
    resolvePillars(
      source
    );


  const dayStem =
    pillars.day.stem;


  const dayElement =
    STEMS[
      dayStem
    ]?.element;


  const monthElement =
    BRANCHES[
      pillars.month.branch
    ]?.element;


  if (
    !dayElement ||
    !monthElement
  ) {

    throw new Error(
      "일간 또는 월지의 오행 정보를 찾지 못했습니다."
    );

  }


  const groups =
    createGroupMap();


  /* =====================================
     1. 월령
  ===================================== */

  const season =
    getSeasonInfo(

      dayElement,

      monthElement

    );


  /* =====================================
     2. 천간

     일간 자신은 제외
  ===================================== */

  [
    "year",
    "month",
    "hour"
  ].forEach(
    pillarKey => {

      const pillar =
        pillars[
          pillarKey
        ];


      if (
        !pillar
      ) {

        return;

      }


      const targetElement =
        STEMS[
          pillar.stem
        ]?.element;


      const group =
        relationGroup(

          dayElement,

          targetElement

        );


      const score =
        VISIBLE_WEIGHTS[
          group
        ]
        ??
        0;


      pushContribution(

        groups,

        group,

        {

          source:
            "visible",

          pillarKey,

          label:
            `${PILLAR_LABELS[pillarKey]} 천간 ${pillar.stem}`,

          stem:
            pillar.stem

        },

        score

      );

    }
  );


  /* =====================================
     3. 지장간

     같은 오행은 통근으로 계산
  ===================================== */

  [
    "year",
    "month",
    "day",
    "hour"
  ].forEach(
    pillarKey => {

      const pillar =
        pillars[
          pillarKey
        ];


      if (
        !pillar
      ) {

        return;

      }


      const hiddenList =
        HIDDEN_STEMS[
          pillar.branch
        ]
        ??
        [];


      hiddenList.forEach(
        (
          hiddenStem,
          index
        ) => {

          const targetElement =
            STEMS[
              hiddenStem
            ]?.element;


          const relation =
            relationGroup(

              dayElement,

              targetElement

            );


          const group =

            relation === "peer"

              ? "root"

              : relation;


          const multiplier =
            HIDDEN_MULTIPLIER[
              group
            ];


          if (
            multiplier ===
              undefined
          ) {

            return;

          }


          const isMain =
            index ===
            hiddenList.length - 1;


          const base =
            getHiddenWeight(

              hiddenList,

              index

            );


          const pillarMultiplier =
            PILLAR_MULTIPLIER[
              pillarKey
            ]
            ??
            1;


          const score =

            base

            *

            pillarMultiplier

            *

            multiplier;


          pushContribution(

            groups,

            group,

            {

              source:
                "hidden",

              pillarKey,

              label:
                `${PILLAR_LABELS[pillarKey]} ${pillar.branch} 지장간 ${hiddenStem}${isMain ? "(본기)" : ""}`,

              stem:
                hiddenStem,

              branch:
                pillar.branch,

              isMain

            },

            score

          );

        }
      );

    }
  );


  /* =====================================
     4. ★ 강한 통근의 질적 보정

     핵심 수정 부분
  ===================================== */

  applyStrongRootBonus(

    groups,

    pillars,

    dayElement

  );


  /* =====================================
     소수점 정리
  ===================================== */

  Object.values(
    groups
  ).forEach(
    group => {

      group.score =
        round1(
          group.score
        );

    }
  );


  /* =====================================
     5. 합 · 충 등 관계 보정

     현재 기본값 0

     추후 relations 계산과 연결
  ===================================== */

  const requestedRelationAdjustment =
    Number(
      options.relationAdjustment
      ??
      0
    );


  const relationAdjustment =
    round1(

      clamp(

        Number.isFinite(
          requestedRelationAdjustment
        )

          ? requestedRelationAdjustment

          : 0,

        -12,

        12

      )

    );


  /* =====================================
     6. 최종 점수

     50 = 중립 기준
  ===================================== */

  const rawScore =

    50

    +

    season.score

    +

    relationAdjustment

    +

    Object.values(
      groups
    ).reduce(
      (
        sum,
        group
      ) =>

        sum +
        group.score,

      0
    );


  const score =
    round1(

      clamp(

        rawScore,

        0,

        100

      )

    );


  const label =
    strengthLabel(
      score
    );


  const elementInfo =
    ELEMENT_LABELS[
      dayElement
    ];


  const availablePillars =

    [
      "year",
      "month",
      "day",
      "hour"
    ].filter(
      key =>
        pillars[
          key
        ]
    ).length;


  /* =====================================
     7. 도움 총합
  ===================================== */

  const supportScore =
    round1(

      Math.max(
        season.score,
        0
      )

      +

      Math.max(
        relationAdjustment,
        0
      )

      +

      groups.root.score

      +

      groups.peer.score

      +

      groups.resource.score

    );


  /* =====================================
     8. 소모 · 압박 총합
  ===================================== */

  const pressureScore =
    round1(

      Math.abs(
        Math.min(
          season.score,
          0
        )
      )

      +

      Math.abs(
        Math.min(
          relationAdjustment,
          0
        )
      )

      +

      Math.abs(
        groups.output.score
      )

      +

      Math.abs(
        groups.wealth.score
      )

      +

      Math.abs(
        groups.authority.score
      )

    );


  /* =====================================
     9. 강근 정보

     이후 용신 계산에서도 사용할 수 있음
  ===================================== */

  const strongRoots =

    [
      "year",
      "month",
      "day",
      "hour"
    ]

      .filter(
        pillarKey => {

          const pillar =
            pillars[
              pillarKey
            ];


          if (
            !pillar
          ) {

            return false;

          }


          return isStrongMainRoot(

            pillar.branch,

            dayElement

          );

        }
      )

      .map(
        pillarKey => ({

          pillarKey,

          pillarLabel:
            PILLAR_LABELS[
              pillarKey
            ],

          branch:
            pillars[
              pillarKey
            ].branch,

          sameElementRootCount:
            countSameElementRoots(

              pillars[
                pillarKey
              ].branch,

              dayElement

            )

        })
      );


  /* =====================================
     결과
  ===================================== */

  return {

    score,

    label,

    summary:
      strengthSummary(
        label
      ),


    dayMaster: {

      stem:
        dayStem,

      element:
        dayElement,

      korean:
        elementInfo.korean,

      hanja:
        elementInfo.hanja

    },


    monthCommand: {

      branch:
        pillars.month.branch,

      element:
        monthElement,

      ...season

    },


    supportScore,

    pressureScore,

    relationAdjustment,


    strongRoots,


    groups:

      Object.fromEntries(

        Object.entries(
          groups
        ).map(
          (
            [
              key,
              value
            ]
          ) => [

            key,

            {

              ...value,

              label:
                GROUP_LABELS[
                  key
                ]

            }

          ]
        )

      ),


    pillars,

    availablePillars,


    confidence:

      availablePillars === 4

        ? "4주(四柱) 전체 반영"

        : "시주 제외 판정",


    convention:
      "월령 + 통근 + 강근(强根) + 투간 + 지장간 가중치",


    note:
      "오행 개수 비율과 별도의 강약 지수입니다. 특히 지지 본기에 일간과 같은 오행이 자리한 경우 강한 통근으로 추가 반영합니다. 합·충·합화로 실제 오행력이 달라지는 경우에는 관계 보정을 추가할 수 있습니다."

  };

}


/* =========================================
   외부 판정용
========================================= */

export function getStrengthLabel(
  score
) {

  return strengthLabel(
    Number(
      score
    )
  );

}