/* =========================================
   용신 · 희신 · 기신 최종 계산기

   사이트 최종 기준

   1. 억부용신
   2. 조후용신
   3. 통관용신
   4. 병약용신
   5. 종격용신

   ※ 모든 방식을 무조건 적용하지 않음
   ※ 원국 조건에 해당하는 방식만 사용
========================================= */


/* =========================================
   오행
========================================= */

const ELEMENTS = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water"
];


const ELEMENT_META = {

  wood: {
    korean: "목",
    hanja: "木"
  },

  fire: {
    korean: "화",
    hanja: "火"
  },

  earth: {
    korean: "토",
    hanja: "土"
  },

  metal: {
    korean: "금",
    hanja: "金"
  },

  water: {
    korean: "수",
    hanja: "水"
  }

};


/* =========================================
   천간 오행
========================================= */

const STEM_ELEMENT = {

  甲: "wood",
  乙: "wood",

  丙: "fire",
  丁: "fire",

  戊: "earth",
  己: "earth",

  庚: "metal",
  辛: "metal",

  壬: "water",
  癸: "water"

};


/* =========================================
   지지 대표 오행
========================================= */

const BRANCH_ELEMENT = {

  子: "water",
  丑: "earth",

  寅: "wood",
  卯: "wood",
  辰: "earth",

  巳: "fire",
  午: "fire",
  未: "earth",

  申: "metal",
  酉: "metal",
  戌: "earth",

  亥: "water"

};


/* =========================================
   지장간

   마지막 = 본기
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
   오행 생
========================================= */

const GENERATES = {

  wood: "fire",

  fire: "earth",

  earth: "metal",

  metal: "water",

  water: "wood"

};


/* =========================================
   오행 극
========================================= */

const CONTROLS = {

  wood: "earth",

  fire: "metal",

  earth: "water",

  metal: "wood",

  water: "fire"

};


/* =========================================
   십성 그룹
========================================= */

const ROLE_META = {

  peer: {
    label: "비겁"
  },

  resource: {
    label: "인성"
  },

  output: {
    label: "식상"
  },

  wealth: {
    label: "재성"
  },

  authority: {
    label: "관성"
  }

};


/* =========================================
   조후

   월지를 기준으로
   한난조습 보정
========================================= */

const CLIMATE_RULES = {

  子: {

    climate:
      "강한 한기와 습기",

    primary:
      "fire",

    secondary:
      "earth",

    primaryWeight:
      20,

    secondaryWeight:
      9,

    summary:
      "겨울의 강한 한기를 덥히는 火를 우선하고, 과한 습기를 정리하는 土를 보조로 봅니다."

  },


  丑: {

    climate:
      "차갑고 습한 겨울 끝",

    primary:
      "fire",

    secondary:
      "earth",

    primaryWeight:
      18,

    secondaryWeight:
      9,

    summary:
      "남아 있는 한기를 덥히는 火와 습기를 정리하는 土가 필요합니다."

  },


  寅: {

    climate:
      "초봄의 잔한기",

    primary:
      "fire",

    secondary:
      "wood",

    primaryWeight:
      13,

    secondaryWeight:
      6,

    summary:
      "초봄의 찬 기운을 火로 덥히고 木의 생장을 돕는 방향을 봅니다."

  },


  卯: {

    climate:
      "온화한 봄",

    primary:
      "fire",

    secondary:
      "water",

    primaryWeight:
      7,

    secondaryWeight:
      4,

    summary:
      "계절 자체는 비교적 온화하여 조후 보정은 강하게 적용하지 않습니다."

  },


  辰: {

    climate:
      "습기가 남은 늦봄",

    primary:
      "fire",

    secondary:
      "earth",

    primaryWeight:
      10,

    secondaryWeight:
      5,

    summary:
      "습기가 남은 계절이므로 火로 덥히고 土로 습기를 정리합니다."

  },


  巳: {

    climate:
      "초여름의 열기",

    primary:
      "water",

    secondary:
      "metal",

    primaryWeight:
      14,

    secondaryWeight:
      7,

    summary:
      "더워지기 시작하는 계절이므로 水로 열기를 조절하고 金을 보조로 봅니다."

  },


  午: {

    climate:
      "강한 더위와 건조함",

    primary:
      "water",

    secondary:
      "metal",

    primaryWeight:
      20,

    secondaryWeight:
      9,

    summary:
      "한여름의 강한 열기와 건조함을 水로 식히는 것을 가장 중요하게 봅니다."

  },


  未: {

    climate:
      "여름 끝의 열기와 건조함",

    primary:
      "water",

    secondary:
      "metal",

    primaryWeight:
      16,

    secondaryWeight:
      7,

    summary:
      "남아 있는 열기와 건조함을 水로 조절하는 방향을 봅니다."

  },


  申: {

    climate:
      "초가을의 건조함",

    primary:
      "water",

    secondary:
      "wood",

    primaryWeight:
      13,

    secondaryWeight:
      6,

    summary:
      "초가을의 건조함을 水로 보완하고 木의 생기를 보조합니다."

  },


  酉: {

    climate:
      "가을의 강한 건조함",

    primary:
      "water",

    secondary:
      "wood",

    primaryWeight:
      16,

    secondaryWeight:
      7,

    summary:
      "건조한 가을 기운을 水로 적셔주고 木을 보조적으로 활용합니다."

  },


  戌: {

    climate:
      "늦가을의 건조함과 서늘함",

    primary:
      "water",

    secondary:
      "fire",

    primaryWeight:
      11,

    secondaryWeight:
      6,

    summary:
      "건조함에는 水, 늦가을의 서늘함에는 火를 보조적으로 봅니다."

  },


  亥: {

    climate:
      "초겨울의 한기와 습기",

    primary:
      "fire",

    secondary:
      "earth",

    primaryWeight:
      17,

    secondaryWeight:
      8,

    summary:
      "초겨울의 한기를 火로 덥히고 습기를 土로 정리합니다."

  }

};


/* =========================================
   Helper
========================================= */

function round1(
  value
) {

  return Math.round(
    Number(
      value
    ) * 10
  ) / 10;

}


function positive(
  value
) {

  return Math.max(
    0,
    Number(
      value ?? 0
    )
  );

}


function negativeMagnitude(
  value
) {

  return Math.abs(
    Math.min(
      0,
      Number(
        value ?? 0
      )
    )
  );

}


/* =========================================
   target을 생하는 오행
========================================= */

function getGeneratorOf(
  target
) {

  return Object.entries(
    GENERATES
  )
    .find(
      ([
        ,
        result
      ]) =>
        result === target
    )
    ?.[0]
    ?? "";

}


/* =========================================
   target을 극하는 오행
========================================= */

function getControllerOf(
  target
) {

  return Object.entries(
    CONTROLS
  )
    .find(
      ([
        ,
        result
      ]) =>
        result === target
    )
    ?.[0]
    ?? "";

}


/* =========================================
   일간 기준 각 십성의 오행
========================================= */

function buildRoleElements(
  dayElement
) {

  return {

    peer:
      dayElement,


    resource:
      getGeneratorOf(
        dayElement
      ),


    output:
      GENERATES[
        dayElement
      ],


    wealth:
      CONTROLS[
        dayElement
      ],


    authority:
      getControllerOf(
        dayElement
      )

  };

}


/* =========================================
   오행 → 십성
========================================= */

function getElementRole(
  dayElement,
  targetElement
) {

  const roles =
    buildRoleElements(
      dayElement
    );


  return Object.keys(
    roles
  )
    .find(
      role =>
        roles[
          role
        ] ===
        targetElement
    )
    ?? "";

}


/* =========================================
   십성 힘 계산
========================================= */

function buildRoleMagnitudes(
  strengthResult
) {

  const groups =
    strengthResult.groups
    ?? {};


  const result = {

    peer:

      positive(
        groups.peer?.score
      )

      +

      positive(
        groups.root?.score
      ),


    resource:

      positive(
        groups.resource?.score
      ),


    output:

      negativeMagnitude(
        groups.output?.score
      ),


    wealth:

      negativeMagnitude(
        groups.wealth?.score
      ),


    authority:

      negativeMagnitude(
        groups.authority?.score
      )

  };


  /*
    월령 영향 추가
  */

  const dayElement =
    strengthResult
      .dayMaster
      ?.element;


  const monthElement =
    strengthResult
      .monthCommand
      ?.element;


  const monthScore =
    Math.abs(
      Number(
        strengthResult
          .monthCommand
          ?.score
        ?? 0
      )
    );


  const monthRole =
    getElementRole(
      dayElement,
      monthElement
    );


  if (
    monthRole
    &&
    result[
      monthRole
    ] !== undefined
  ) {

    result[
      monthRole
    ] +=
      monthScore;

  }


  Object.keys(
    result
  )
    .forEach(
      key => {

        result[
          key
        ] =
          round1(
            result[
              key
            ]
          );

      }
    );


  return result;

}


/* =========================================
   역할 순위
========================================= */

function rankRoles(
  roles,
  magnitudes
) {

  return roles
    .map(
      role => ({

        role,

        value:
          Number(
            magnitudes[
              role
            ]
            ?? 0
          )

      })
    )
    .sort(
      (a, b) =>
        b.value -
        a.value
    );

}


/* =========================================
   원국 오행 분포

   통관 / 병약 / 종격 확인용

   단순 개수가 아니라
   천간 + 지장간 + 월지 계절 가중
========================================= */

function buildElementProfile(
  pillars
) {

  const scores =
    Object.fromEntries(
      ELEMENTS.map(
        element => [
          element,
          0
        ]
      )
    );


  const stemPositionWeight = {

    year:
      1.0,

    month:
      1.15,

    day:
      1.25,

    hour:
      1.0

  };


  const branchPositionWeight = {

    year:
      0.9,

    month:
      1.25,

    day:
      1.1,

    hour:
      0.9

  };


  const hiddenRatio = {

    1: [
      1
    ],

    2: [
      0.35,
      0.65
    ],

    3: [
      0.20,
      0.30,
      0.50
    ]

  };


  [
    "year",
    "month",
    "day",
    "hour"
  ]
    .forEach(
      pillarKey => {

        const pillar =
          pillars?.[
            pillarKey
          ];


        if (
          !pillar
        ) {

          return;

        }


        /* 천간 */

        const stemElement =
          STEM_ELEMENT[
            pillar.stem
          ];


        if (
          stemElement
        ) {

          scores[
            stemElement
          ] +=
            stemPositionWeight[
              pillarKey
            ]
            ?? 1;

        }


        /* 지장간 */

        const hidden =
          HIDDEN_STEMS[
            pillar.branch
          ]
          ?? [];


        const ratio =
          hiddenRatio[
            hidden.length
          ]
          ?? [];


        hidden.forEach(
          (
            stem,
            index
          ) => {

            const element =
              STEM_ELEMENT[
                stem
              ];


            if (
              !element
            ) {

              return;

            }


            scores[
              element
            ] +=

              (
                ratio[
                  index
                ]
                ?? 0
              )

              *

              (
                branchPositionWeight[
                  pillarKey
                ]
                ?? 1
              );

          }
        );

      }
    );


  /*
    월지 계절력 추가
  */

  const monthBranch =
    pillars?.month
      ?.branch;


  const seasonElement =
    BRANCH_ELEMENT[
      monthBranch
    ];


  if (
    seasonElement
  ) {

    scores[
      seasonElement
    ] +=
      1.4;

  }


  const total =
    Object.values(
      scores
    )
      .reduce(
        (
          sum,
          value
        ) =>
          sum + value,
        0
      );


  const share = {};


  ELEMENTS.forEach(
    element => {

      share[
        element
      ] =

        total > 0

          ? scores[
              element
            ] / total

          : 0;

    }
  );


  return {

    scores,

    share,

    total

  };

}


/* =========================================
   신약 억부
========================================= */

function chooseWeakHelpfulRoles(
  magnitudes
) {

  const burdens =
    rankRoles(
      [
        "output",
        "wealth",
        "authority"
      ],
      magnitudes
    );


  const first =
    burdens[0];


  const second =
    burdens[1];


  /*
    재성 부담이 압도적
    → 비겁 우선
  */

  if (
    first?.role === "wealth"
    &&
    first.value >
      (
        second?.value
        ?? 0
      ) * 1.2
  ) {

    return {

      primary:
        "peer",

      secondary:
        "resource"

    };

  }


  /*
    인성은 있는데
    비겁 / 통근이 부족
  */

  if (
    magnitudes.resource >=
      magnitudes.peer * 1.7
    &&
    magnitudes.peer < 12
  ) {

    return {

      primary:
        "peer",

      secondary:
        "resource"

    };

  }


  return {

    primary:
      "resource",

    secondary:
      "peer"

  };

}


/* =========================================
   신강 억부
========================================= */

function chooseStrongHelpfulRoles(
  magnitudes
) {

  const peer =
    magnitudes.peer;


  const resource =
    magnitudes.resource;


  /*
    인성 과다
  */

  if (
    resource >
      peer * 1.2
    &&
    resource >= 14
  ) {

    return {

      primary:
        "wealth",

      secondary:
        "output"

    };

  }


  /*
    비겁 / 통근 과다
  */

  if (
    peer >
      resource * 1.2
  ) {

    return {

      primary:
        "output",

      secondary:
        "authority"

    };

  }


  return {

    primary:
      "output",

    secondary:
      "wealth"

  };

}


/* =========================================
   신강 / 신약 방향
========================================= */

function determineDirection(
  strengthResult,
  magnitudes
) {

  const label =
    strengthResult.label;


  if (
    [
      "매우 신약",
      "신약",
      "중화신약"
    ].includes(
      label
    )
  ) {

    return "weak";

  }


  if (
    [
      "중화신강",
      "신강",
      "매우 신강"
    ].includes(
      label
    )
  ) {

    return "strong";

  }


  const support =

    magnitudes.peer

    +

    magnitudes.resource;


  const pressure =

    magnitudes.output

    +

    magnitudes.wealth

    +

    magnitudes.authority;


  if (
    support >
    pressure
  ) {

    return "strong";

  }


  if (
    pressure >
    support
  ) {

    return "weak";

  }


  return Number(
    strengthResult.score
  ) >= 50

    ? "strong"

    : "weak";

}


/* =========================================
   억부 계산
========================================= */

function calculateEokbu(
  strengthResult,
  magnitudes,
  roleElements
) {

  const direction =
    determineDirection(
      strengthResult,
      magnitudes
    );


  const helpful =

    direction === "weak"

      ? chooseWeakHelpfulRoles(
          magnitudes
        )

      : chooseStrongHelpfulRoles(
          magnitudes
        );


  const harmfulRanking =

    direction === "weak"

      ? rankRoles(
          [
            "output",
            "wealth",
            "authority"
          ],
          magnitudes
        )

      : rankRoles(
          [
            "peer",
            "resource"
          ],
          magnitudes
        );


  const gisinRole =
    harmfulRanking[0]
      ?.role;


  const gusinRole =
    harmfulRanking[1]
      ?.role;


  return {

    direction,


    yongsin: {

      role:
        helpful.primary,

      element:
        roleElements[
          helpful.primary
        ]

    },


    huisin: {

      role:
        helpful.secondary,

      element:
        roleElements[
          helpful.secondary
        ]

    },


    gisin: {

      role:
        gisinRole,

      element:
        roleElements[
          gisinRole
        ]

    },


    gusin: {

      role:
        gusinRole,

      element:
        roleElements[
          gusinRole
        ]

    }

  };

}


/* =========================================
   조후
========================================= */

function calculateJohu(
  strengthResult
) {

  const branch =
    strengthResult
      .monthCommand
      ?.branch;


  const rule =
    CLIMATE_RULES[
      branch
    ];


  if (
    !rule
  ) {

    return null;

  }


  return {

    branch,

    ...rule

  };

}


/* =========================================
   통관용신 판정

   예:
   木 ↔ 土 충돌
   ↓
   火가 중간 역할
   木 → 火 → 土
========================================= */

function detectTonggwan(
  profile
) {

  let best =
    null;


  Object.entries(
    CONTROLS
  )
    .forEach(
      ([
        controller,
        controlled
      ]) => {

        const controllerShare =
          profile.share[
            controller
          ];


        const controlledShare =
          profile.share[
            controlled
          ];


        /*
          통관은 극하는 오행이
          생하는 오행을 중간에 둠

          木克土
          木生火
          火生土
        */

        const mediator =
          GENERATES[
            controller
          ];


        const mediatorShare =
          profile.share[
            mediator
          ];


        /*
          양쪽 모두 강하고
          중간 기운이 약해야
          통관 필요성 인정
        */

        if (
          controllerShare < 0.19
          ||
          controlledShare < 0.19
          ||
          mediatorShare > 0.17
        ) {

          return;

        }


        const score =

          Math.min(
            controllerShare,
            controlledShare
          )

          -

          mediatorShare * 0.6;


        if (
          score < 0.10
        ) {

          return;

        }


        if (
          !best
          ||
          score >
            best.score
        ) {

          best = {

            controller,

            controlled,

            mediator,

            score,

            description:
              `${ELEMENT_META[controller].hanja}${ELEMENT_META[controller].korean}과 ${ELEMENT_META[controlled].hanja}${ELEMENT_META[controlled].korean}의 충돌이 강하고 중간 연결 기운이 약해 ${ELEMENT_META[mediator].hanja}${ELEMENT_META[mediator].korean}을 통관 기운으로 봅니다.`

          };

        }

      }
    );


  return best;

}


/* =========================================
   병약용신

   특정 오행 하나가
   지나치게 강하면서
   실제 부담 역할일 때만 적용
========================================= */

function detectByeongyak(
  profile,
  dayElement,
  direction,
  eokbu
) {

  const ranking =
    ELEMENTS
      .map(
        element => ({

          element,

          share:
            profile.share[
              element
            ]

        })
      )
      .sort(
        (a, b) =>
          b.share -
          a.share
      );


  const first =
    ranking[0];


  const second =
    ranking[1];


  if (
    !first
    ||
    first.share < 0.38
    ||
    (
      first.share -
      second.share
    ) < 0.12
  ) {

    return null;

  }


  const role =
    getElementRole(
      dayElement,
      first.element
    );


  const harmfulRoles =

    direction === "weak"

      ? [
          "output",
          "wealth",
          "authority"
        ]

      : [
          "peer",
          "resource"
        ];


  /*
    과한 오행이 실제로
    현재 구조에서 부담이어야 함
  */

  if (
    !harmfulRoles.includes(
      role
    )
  ) {

    return null;

  }


  /*
    치료 후보

    1. 과한 오행을 극하는 오행
    2. 과한 오행이 생하는 오행
       → 기운을 빼내는 방식
  */

  const controlMedicine =
    getControllerOf(
      first.element
    );


  const drainMedicine =
    GENERATES[
      first.element
    ];


  const candidates = [
    controlMedicine,
    drainMedicine
  ]
    .filter(Boolean)
    .map(
      element => {

        let score =
          0;


        /*
          억부용신과 일치하면
          우선
        */

        if (
          element ===
          eokbu.yongsin.element
        ) {

          score +=
            10;

        }


        if (
          element ===
          eokbu.huisin.element
        ) {

          score +=
            5;

        }


        /*
          원국에 너무 많은 기운보다는
          상대적으로 부족한 기운 선호
        */

        score +=
          Math.max(
            0,
            0.20 -
            profile.share[
              element
            ]
          ) * 20;


        return {

          element,

          score

        };

      }
    )
    .sort(
      (a, b) =>
        b.score -
        a.score
    );


  const medicine =
    candidates[0]
      ?.element;


  if (
    !medicine
  ) {

    return null;

  }


  return {

    diseaseElement:
      first.element,

    diseaseRole:
      role,

    diseaseShare:
      first.share,

    medicineElement:
      medicine,

    description:
      `${ELEMENT_META[first.element].hanja}${ELEMENT_META[first.element].korean}이 원국에서 과하게 강하면서 현재 균형에 부담으로 작용해 ${ELEMENT_META[medicine].hanja}${ELEMENT_META[medicine].korean}을 완화 기운으로 봅니다.`

  };

}


/* =========================================
   종격용신

   매우 보수적으로 판정

   뿌리와 지원이 거의 없고
   한쪽 세력이 압도하는 경우만
========================================= */

function detectJonggyeok(
  strengthResult,
  magnitudes,
  roleElements
) {

  const score =
    Number(
      strengthResult.score
    );


  const root =
    positive(
      strengthResult
        .groups
        ?.root
        ?.score
    );


  const support =

    magnitudes.peer

    +

    magnitudes.resource;


  const burden =

    magnitudes.output

    +

    magnitudes.wealth

    +

    magnitudes.authority;


  /* =====================================
     극신약 종격
  ===================================== */

  if (
    score <= 22
    &&
    root <= 2.5
    &&
    support <= 7
    &&
    burden >= 32
  ) {

    const ranking =
      rankRoles(
        [
          "output",
          "wealth",
          "authority"
        ],
        magnitudes
      );


    const first =
      ranking[0];


    const ratio =

      burden > 0

        ? first.value /
          burden

        : 0;


    /*
      한 세력이 전체 부담의
      절반 이상이어야 종격 후보
    */

    if (
      ratio >= 0.48
    ) {

      /* 종재 */

      if (
        first.role ===
        "wealth"
      ) {

        return {

          type:
            "종재격",

          primaryRole:
            "wealth",

          secondaryRole:
            "output",

          primaryElement:
            roleElements.wealth,

          secondaryElement:
            roleElements.output,

          description:
            "일간을 억지로 보강하기보다 강한 재성 흐름을 따르는 편이 자연스러운 종재격 조건으로 판단합니다."

        };

      }


      /* 종관 */

      if (
        first.role ===
        "authority"
      ) {

        return {

          type:
            "종관격",

          primaryRole:
            "authority",

          secondaryRole:
            "wealth",

          primaryElement:
            roleElements.authority,

          secondaryElement:
            roleElements.wealth,

          description:
            "일간을 억지로 보강하기보다 강한 관성 흐름을 따르는 편이 자연스러운 종관격 조건으로 판단합니다."

        };

      }


      /* 종아 */

      if (
        first.role ===
        "output"
      ) {

        return {

          type:
            "종아격",

          primaryRole:
            "output",

          secondaryRole:
            "wealth",

          primaryElement:
            roleElements.output,

          secondaryElement:
            roleElements.wealth,

          description:
            "일간을 억지로 보강하기보다 강한 식상 흐름을 따라 능력을 밖으로 사용하는 편이 자연스러운 종아격 조건으로 판단합니다."

        };

      }

    }

  }


  /* =====================================
     극신강 전왕 / 종강
  ===================================== */

  if (
    score >= 82
    &&
    support >= 40
    &&
    burden <= 12
  ) {

    return {

      type:
        "종강격",

      primaryRole:
        "peer",

      secondaryRole:
        "resource",

      primaryElement:
        roleElements.peer,

      secondaryElement:
        roleElements.resource,

      description:
        "일간을 억지로 약화시키기보다 이미 압도적으로 강한 비겁·인성의 흐름을 따르는 종강격 조건으로 판단합니다."

    };

  }


  return null;

}


/* =========================================
   최종 점수
========================================= */

function createElementScores() {

  return Object.fromEntries(

    ELEMENTS.map(
      element => [

        element,

        {
          score:
            0,

          reasons:
            []
        }

      ]
    )

  );

}


function addScore(
  scores,
  element,
  score,
  reason
) {

  if (
    !element
    ||
    !scores[
      element
    ]
  ) {

    return;

  }


  scores[
    element
  ].score +=
    score;


  scores[
    element
  ].reasons.push(
    reason
  );

}


/* =========================================
   최종 점수 조합
========================================= */

function buildFinalScores(
  eokbu,
  johu,
  tonggwan,
  byeongyak,
  jonggyeok,
  roleElements
) {

  const scores =
    createElementScores();


  /* =====================================
     종격이 성립하면
     일반 억부보다 종격 우선
  ===================================== */

  if (
    jonggyeok
  ) {

    addScore(
      scores,
      jonggyeok.primaryElement,
      70,
      jonggyeok.type
    );


    addScore(
      scores,
      jonggyeok.secondaryElement,
      40,
      `${jonggyeok.type} 보조`
    );


    /*
      종격을 깨뜨리는 반대 방향
    */

    if (
      jonggyeok.type ===
      "종강격"
    ) {

      addScore(
        scores,
        roleElements.output,
        -28,
        "종강격 역행"
      );

      addScore(
        scores,
        roleElements.wealth,
        -24,
        "종강격 역행"
      );

      addScore(
        scores,
        roleElements.authority,
        -20,
        "종강격 역행"
      );

    }

    else {

      addScore(
        scores,
        roleElements.peer,
        -35,
        "종격 역행"
      );

      addScore(
        scores,
        roleElements.resource,
        -30,
        "종격 역행"
      );

    }

  }

  else {

    /* =====================================
       일반 억부
    ===================================== */

    addScore(
      scores,
      eokbu.yongsin.element,
      50,
      "억부용신"
    );


    addScore(
      scores,
      eokbu.huisin.element,
      28,
      "억부 희신"
    );


    addScore(
      scores,
      eokbu.gisin.element,
      -42,
      "억부 기신"
    );


    addScore(
      scores,
      eokbu.gusin.element,
      -24,
      "억부 구신"
    );

  }


  /* =====================================
     조후
  ===================================== */

  if (
    johu
  ) {

    addScore(
      scores,
      johu.primary,
      johu.primaryWeight,
      "조후 1순위"
    );


    addScore(
      scores,
      johu.secondary,
      johu.secondaryWeight,
      "조후 보조"
    );

  }


  /* =====================================
     통관
  ===================================== */

  if (
    tonggwan
  ) {

    addScore(
      scores,
      tonggwan.mediator,
      18,
      "통관용신"
    );

  }


  /* =====================================
     병약
  ===================================== */

  if (
    byeongyak
  ) {

    addScore(
      scores,
      byeongyak.medicineElement,
      16,
      "병약용신"
    );


    addScore(
      scores,
      byeongyak.diseaseElement,
      -10,
      "병약의 병"
    );

  }


  Object.values(
    scores
  )
    .forEach(
      value => {

        value.score =
          round1(
            value.score
          );

      }
    );


  return scores;

}


/* =========================================
   오행 순위
========================================= */

function rankElements(
  scores
) {

  return ELEMENTS
    .map(
      element => ({

        element,

        score:
          scores[
            element
          ].score,

        reasons:
          scores[
            element
          ].reasons

      })
    )
    .sort(
      (a, b) =>
        b.score -
        a.score
    );

}


/* =========================================
   결과 오행 데이터
========================================= */

function makeItem(
  ranked,
  dayElement
) {

  const element =
    ranked.element;


  const meta =
    ELEMENT_META[
      element
    ];


  const role =
    getElementRole(
      dayElement,
      element
    );


  return {

    element,

    korean:
      meta.korean,

    hanja:
      meta.hanja,

    role,

    roleLabel:
      ROLE_META[
        role
      ]?.label
      ?? "",

    finalScore:
      round1(
        ranked.score
      ),

    sources:
      ranked.reasons

  };

}


/* =========================================
   적용 방식 목록
========================================= */

function buildMethodDetails(
  eokbu,
  johu,
  tonggwan,
  byeongyak,
  jonggyeok
) {

  const result =
    [];


  /*
    종격이면
    일반 억부 대신 종격 표시
  */

  if (
    jonggyeok
  ) {

    result.push({

      key:
        "jonggyeok",

      title:
        "종격용신",

      subtitle:
        jonggyeok.type,

      description:
        jonggyeok.description

    });

  }

  else {

    result.push({

      key:
        "eokbu",

      title:
        "억부용신",

      subtitle:
        "강약의 균형",

      description:
        "일간이 강하거나 약한 정도를 먼저 보고, 강한 기운은 덜고 약한 기운은 도와 전체적인 균형을 맞춥니다."

    });

  }


  if (
    johu
  ) {

    result.push({

      key:
        "johu",

      title:
        "조후용신",

      subtitle:
        "계절의 균형",

      description:
        johu.summary

    });

  }


  if (
    tonggwan
  ) {

    result.push({

      key:
        "tonggwan",

      title:
        "통관용신",

      subtitle:
        "충돌의 연결",

      description:
        tonggwan.description

    });

  }


  if (
    byeongyak
  ) {

    result.push({

      key:
        "byeongyak",

      title:
        "병약용신",

      subtitle:
        "과한 기운 완화",

      description:
        byeongyak.description

    });

  }


  return result;

}


/* =========================================
   최종 계산
========================================= */

export function calculateUsefulGod(
  strengthResult
) {

  if (
    !strengthResult
  ) {

    throw new Error(
      "용신 계산에 필요한 신강·신약 결과가 없습니다."
    );

  }


  const dayElement =
    strengthResult
      .dayMaster
      ?.element;


  if (
    !ELEMENT_META[
      dayElement
    ]
  ) {

    throw new Error(
      "일간 오행을 찾을 수 없습니다."
    );

  }


  const roleElements =
    buildRoleElements(
      dayElement
    );


  const magnitudes =
    buildRoleMagnitudes(
      strengthResult
    );


  const profile =
    buildElementProfile(
      strengthResult.pillars
    );


  /* =====================================
     억부
  ===================================== */

  const eokbu =
    calculateEokbu(
      strengthResult,
      magnitudes,
      roleElements
    );


  /* =====================================
     조후
  ===================================== */

  const johu =
    calculateJohu(
      strengthResult
    );


  /* =====================================
     통관
  ===================================== */

  const tonggwan =
    detectTonggwan(
      profile
    );


  /* =====================================
     병약
  ===================================== */

  const byeongyak =
    detectByeongyak(
      profile,
      dayElement,
      eokbu.direction,
      eokbu
    );


  /* =====================================
     종격
  ===================================== */

  const jonggyeok =
    detectJonggyeok(
      strengthResult,
      magnitudes,
      roleElements
    );


  /* =====================================
     최종 점수
  ===================================== */

  const finalScores =
    buildFinalScores(
      eokbu,
      johu,
      tonggwan,
      byeongyak,
      jonggyeok,
      roleElements
    );


  const ranking =
    rankElements(
      finalScores
    );


  const yongsin =
    makeItem(
      ranking[0],
      dayElement
    );


  const huisin =
    makeItem(
      ranking[1],
      dayElement
    );


  const gusin =
    makeItem(
      ranking[
        ranking.length - 2
      ],
      dayElement
    );


  const gisin =
    makeItem(
      ranking[
        ranking.length - 1
      ],
      dayElement
    );


  /* =====================================
     가장 큰 지원 / 부담
  ===================================== */

  const supportRanking =
    rankRoles(
      [
        "peer",
        "resource"
      ],
      magnitudes
    );


  const burdenRanking =
    rankRoles(
      [
        "output",
        "wealth",
        "authority"
      ],
      magnitudes
    );


  /* =====================================
     적용 방식
  ===================================== */

  const methodDetails =
    buildMethodDetails(
      eokbu,
      johu,
      tonggwan,
      byeongyak,
      jonggyeok
    );


  const method =
    methodDetails
      .map(
        item =>
          item.title
            .replace(
              "용신",
              ""
            )
      )
      .join(
        " + "
      );


  /* =====================================
     균형 방향
  ===================================== */

  let balanceDirection;


  if (
    jonggyeok
  ) {

    balanceDirection =
      "강한 원국 흐름을 따름";

  }

  else if (
    strengthResult.label ===
    "중화"
  ) {

    balanceDirection =
      "현재 균형 유지";

  }

  else if (
    eokbu.direction ===
    "weak"
  ) {

    balanceDirection =
      "일간 보강";

  }

  else {

    balanceDirection =
      "강한 힘을 사용·조절";

  }


  /* =====================================
     극단적이지만 종격 조건 미충족
  ===================================== */

  const extreme =
    [
      "매우 신약",
      "매우 신강"
    ].includes(
      strengthResult.label
    );


  const specialCaseReview =
    Boolean(
      jonggyeok
    )
    ||
    extreme;


  let specialCaseNote =
    "";


  if (
    jonggyeok
  ) {

    specialCaseNote =
      `${jonggyeok.type} 조건을 충족하여 일반 억부보다 강한 흐름을 따르는 방식을 우선 적용했습니다.`;

  }

  else if (
    extreme
  ) {

    specialCaseNote =
      "강약은 극단적이지만 현재 기준에서는 종격 조건을 충분히 충족하지 않아 일반 억부 기준을 유지했습니다.";

  }


  return {

    /* =====================================
       최종 표시
    ===================================== */

    method,

    methodDetails,

    stage:
      "최종 판정",

    status:
      "사이트 기준 최종",


    /* =====================================
       일간
    ===================================== */

    dayMaster: {

      ...strengthResult.dayMaster

    },


    /* =====================================
       강약
    ===================================== */

    strength: {

      score:
        strengthResult.score,

      label:
        strengthResult.label

    },


    direction:
      eokbu.direction,

    balanceDirection,


    /* =====================================
       최종 결과
    ===================================== */

    yongsin,

    huisin,

    gisin,

    gusin,


    /* =====================================
       적용 방식 상세
    ===================================== */

    eokbu,

    johu,

    tonggwan,

    byeongyak,

    jonggyeok,


    methodFlags: {

      eokbu:
        !jonggyeok,

      johu:
        Boolean(
          johu
        ),

      tonggwan:
        Boolean(
          tonggwan
        ),

      byeongyak:
        Boolean(
          byeongyak
        ),

      jonggyeok:
        Boolean(
          jonggyeok
        )

    },


    /* =====================================
       원국 오행 세력
    ===================================== */

    elementProfile:
      profile,


    /* =====================================
       최종 점수
    ===================================== */

    finalScores,

    ranking,


    /* =====================================
       판정 근거
    ===================================== */

    magnitudes,


    evidence: {

      strongestSupport: {

        role:
          supportRanking[0]
            ?.role
          ?? "",

        label:
          ROLE_META[
            supportRanking[0]
              ?.role
          ]?.label
          ?? "",

        value:
          round1(
            supportRanking[0]
              ?.value
            ?? 0
          )

      },


      strongestBurden: {

        role:
          burdenRanking[0]
            ?.role
          ?? "",

        label:
          ROLE_META[
            burdenRanking[0]
              ?.role
          ]?.label
          ?? "",

        value:
          round1(
            burdenRanking[0]
              ?.value
            ?? 0
          )

      }

    },


    specialCaseReview,

    specialCaseNote,


    convention:
      "억부를 기본으로 하고 조후를 보정하며, 실제 조건이 성립할 때만 통관·병약·종격을 추가 적용",


    note:
      "용신 선정에는 여러 명리 기준이 존재합니다. 이 사이트는 동일한 원국에 항상 같은 결과가 나오도록 억부·조후·통관·병약·종격의 적용 조건과 우선순위를 고정해 계산합니다."

  };

}