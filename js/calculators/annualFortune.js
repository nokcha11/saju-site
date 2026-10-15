import {
  STEMS as STEM_DATA
} from "../data/stems.js";


import {
  BRANCHES as BRANCH_DATA
} from "../data/branches.js";


import {
  calculateTenGod
} from "./tenGods.js";


import {
  getTwelveStage
} from "./twelveStages.js";


/* =========================================
   세운 歲運 계산기

   기준
   - 세운 연도 경계: 입춘
   - 1984년 甲子를 기준으로 60갑자 계산
   - 천간 십성: 세운 천간 vs 일간
   - 지지 십성: 세운 지지의 본기 vs 일간
   - 현재 대운과 함께 분석
========================================= */


const STEM_ORDER = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸"
];


const BRANCH_ORDER = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥"
];


/* =========================================
   60갑자
========================================= */

const GANJI_60 =
  Array.from(
    {
      length: 60
    },
    (
      _,
      index
    ) =>

      STEM_ORDER[
        index % 10
      ]

      +

      BRANCH_ORDER[
        index % 12
      ]
  );


/* =========================================
   지지 본기
========================================= */

const BRANCH_MAIN_STEM = {

  子: "癸",
  丑: "己",

  寅: "甲",
  卯: "乙",
  辰: "戊",

  巳: "丙",
  午: "丁",
  未: "己",

  申: "庚",
  酉: "辛",
  戌: "戊",

  亥: "壬"

};


/* =========================================
   천간 합
========================================= */

const STEM_COMBINE = [

  [
    "甲",
    "己"
  ],

  [
    "乙",
    "庚"
  ],

  [
    "丙",
    "辛"
  ],

  [
    "丁",
    "壬"
  ],

  [
    "戊",
    "癸"
  ]

];


/* =========================================
   천간 충
========================================= */

const STEM_CLASH = [

  [
    "甲",
    "庚"
  ],

  [
    "乙",
    "辛"
  ],

  [
    "丙",
    "壬"
  ],

  [
    "丁",
    "癸"
  ]

];


/* =========================================
   지지 육합
========================================= */

const BRANCH_COMBINE = [

  [
    "子",
    "丑"
  ],

  [
    "寅",
    "亥"
  ],

  [
    "卯",
    "戌"
  ],

  [
    "辰",
    "酉"
  ],

  [
    "巳",
    "申"
  ],

  [
    "午",
    "未"
  ]

];


/* =========================================
   지지 충
========================================= */

const BRANCH_CLASH = [

  [
    "子",
    "午"
  ],

  [
    "丑",
    "未"
  ],

  [
    "寅",
    "申"
  ],

  [
    "卯",
    "酉"
  ],

  [
    "辰",
    "戌"
  ],

  [
    "巳",
    "亥"
  ]

];


/* =========================================
   Helper
========================================= */

function mod(
  value,
  length
) {

  return (

    (
      value % length
    )

    +

    length

  )

  %

  length;

}


function hasPair(
  first,
  second,
  pairs
) {

  return pairs.some(
    (
      [
        a,
        b
      ]
    ) =>

      (
        first === a
        &&
        second === b
      )

      ||

      (
        first === b
        &&
        second === a
      )
  );

}


/* =========================================
   기둥 정규화
========================================= */

function normalizePillar(
  pillar
) {

  if (
    !pillar
  ) {

    return null;

  }


  if (
    typeof pillar ===
    "string"
  ) {

    const chars =
      Array.from(
        pillar
      );


    if (
      !chars[0]
      ||
      !chars[1]
    ) {

      return null;

    }


    return {

      stem:
        chars[0],

      branch:
        chars[1],

      hanja:
        `${chars[0]}${chars[1]}`

    };

  }


  const hanja =
    String(

      pillar.hanja

      ??

      pillar.ganji

      ??

      pillar.value

      ??

      ""

    );


  const chars =
    Array.from(
      hanja
    );


  const stem =

    pillar.stem

    ??

    chars[0];


  const branch =

    pillar.branch

    ??

    chars[1];


  if (
    !stem
    ||
    !branch
  ) {

    return null;

  }


  return {

    stem,

    branch,

    hanja:
      `${stem}${branch}`

  };

}


/* =========================================
   원국 정규화
========================================= */

function normalizePillars(
  pillars
) {

  return {

    year:
      normalizePillar(
        pillars?.year
      ),

    month:
      normalizePillar(
        pillars?.month
      ),

    day:
      normalizePillar(
        pillars?.day
      ),

    hour:
      normalizePillar(
        pillars?.hour
      )

  };

}


/* =========================================
   태양 황경

   입춘 순간 계산용
========================================= */

function normalizeDegree(
  value
) {

  return mod(
    value,
    360
  );

}


function toRadians(
  degree
) {

  return degree
    *
    Math.PI
    /
    180;

}


function getSolarLongitude(
  date
) {

  const julianDay =

    date.getTime()
    /
    86400000

    +

    2440587.5;


  const T =

    (
      julianDay
      -
      2451545.0
    )

    /

    36525;


  const L0 =
    normalizeDegree(

      280.46646

      +

      36000.76983
      *
      T

      +

      0.0003032
      *
      T
      *
      T

    );


  const M =
    normalizeDegree(

      357.52911

      +

      35999.05029
      *
      T

      -

      0.0001537
      *
      T
      *
      T

    );


  const Mr =
    toRadians(
      M
    );


  const C =

    (
      1.914602
      -
      0.004817
      *
      T

      -

      0.000014
      *
      T
      *
      T
    )

    *

    Math.sin(
      Mr
    )

    +

    (
      0.019993
      -
      0.000101
      *
      T
    )

    *

    Math.sin(
      2
      *
      Mr
    )

    +

    0.000289

    *

    Math.sin(
      3
      *
      Mr
    );


  const omega =

    125.04

    -

    1934.136
    *
    T;


  return normalizeDegree(

    L0

    +

    C

    -

    0.00569

    -

    0.00478

    *

    Math.sin(
      toRadians(
        omega
      )
    )

  );

}


/* =========================================
   황경 차이
========================================= */

function longitudeDifference(
  longitude,
  target
) {

  return (

    (
      longitude
      -
      target
      +
      540
    )

    %

    360

  )

  -

  180;

}


/* =========================================
   입춘 순간

   태양 황경 315도
========================================= */

function calculateIpchunMoment(
  year
) {

  const center =
    new Date(

      `${year}-02-04T12:00:00+09:00`

    );


  let previous =
    new Date(

      center.getTime()

      -

      4
      *
      86400000

    );


  let previousDifference =
    longitudeDifference(

      getSolarLongitude(
        previous
      ),

      315

    );


  for (
    let hour = 1;
    hour <= 192;
    hour += 1
  ) {

    const current =
      new Date(

        previous.getTime()

        +

        3600000

      );


    const currentDifference =
      longitudeDifference(

        getSolarLongitude(
          current
        ),

        315

      );


    if (
      previousDifference <= 0
      &&
      currentDifference >= 0
    ) {

      let low =
        previous.getTime();


      let high =
        current.getTime();


      for (
        let i = 0;
        i < 35;
        i += 1
      ) {

        const middle =

          (
            low
            +
            high
          )

          /

          2;


        const difference =
          longitudeDifference(

            getSolarLongitude(
              new Date(
                middle
              )
            ),

            315

          );


        if (
          difference < 0
        ) {

          low =
            middle;

        }

        else {

          high =
            middle;

        }

      }


      return new Date(

        (
          low
          +
          high
        )

        /

        2

      );

    }


    previous =
      current;


    previousDifference =
      currentDifference;

  }


  return center;

}


/* =========================================
   현재 세운 연도

   입춘 전이면 이전 세운
========================================= */

function getCurrentAnnualYear(
  now = new Date()
) {

  const koreanYear =
    Number(

      now.toLocaleString(

        "en-US",

        {

          timeZone:
            "Asia/Seoul",

          year:
            "numeric"

        }

      )

    );


  const ipchun =
    calculateIpchunMoment(
      koreanYear
    );


  return now >= ipchun

    ? koreanYear

    : koreanYear - 1;

}


/* =========================================
   연도 간지

   1984 = 甲子
========================================= */

function getYearGanji(
  year
) {

  const index =
    mod(

      year - 1984,

      60

    );


  const ganji =
    GANJI_60[
      index
    ];


  return {

    ganji,

    stem:
      Array.from(
        ganji
      )[0],

    branch:
      Array.from(
        ganji
      )[1]

  };

}


/* =========================================
   대운 출생 순간
========================================= */

function getBirthMomentFromFortuneCycle(
  fortuneCycle
) {

  const date =
    fortuneCycle
      ?.birth
      ?.date;


  const time =

    fortuneCycle
      ?.birth
      ?.time

    ||

    "12:00";


  if (
    !date
  ) {

    return null;

  }


  const moment =
    new Date(

      `${date}T${time}:00+09:00`

    );


  return Number.isNaN(
    moment.getTime()
  )

    ? null

    : moment;

}


/* =========================================
   특정 날짜의 나이
========================================= */

function getAgeAtMoment(
  birthMoment,
  targetMoment
) {

  if (
    !birthMoment
    ||
    !targetMoment
  ) {

    return null;

  }


  return (

    targetMoment.getTime()

    -

    birthMoment.getTime()

  )

  /

  (
    365.2422
    *
    86400000
  );

}


/* =========================================
   해당 세운의 대운 찾기
========================================= */

function findFortuneCycleForMoment(
  fortuneCycle,
  targetMoment
) {

  if (
    !fortuneCycle
    ||
    !Array.isArray(
      fortuneCycle.cycles
    )
  ) {

    return null;

  }


  const birthMoment =
    getBirthMomentFromFortuneCycle(
      fortuneCycle
    );


  const age =
    getAgeAtMoment(

      birthMoment,

      targetMoment

    );


  if (
    age === null
  ) {

    return null;

  }


  return (

    fortuneCycle.cycles.find(
      cycle =>

        age >=
        cycle.startAge

        &&

        age <
        cycle.endAge
    )

    ??

    null

  );

}


/* =========================================
   관계 수집
========================================= */

function collectRelation(

  sourceStem,

  sourceBranch,

  targetPillar,

  targetLabel

) {

  if (
    !targetPillar
  ) {

    return [];

  }


  const result =
    [];


  /* 천간 합 */

  if (
    hasPair(

      sourceStem,

      targetPillar.stem,

      STEM_COMBINE

    )
  ) {

    result.push({

      scope:
        targetLabel,

      layer:
        "stem",

      type:
        "합",

      text:
        `${targetLabel} 천간 ${targetPillar.stem}와 합`

    });

  }


  /* 천간 충 */

  if (
    hasPair(

      sourceStem,

      targetPillar.stem,

      STEM_CLASH

    )
  ) {

    result.push({

      scope:
        targetLabel,

      layer:
        "stem",

      type:
        "충",

      text:
        `${targetLabel} 천간 ${targetPillar.stem}와 충`

    });

  }


  /* 지지 육합 */

  if (
    hasPair(

      sourceBranch,

      targetPillar.branch,

      BRANCH_COMBINE

    )
  ) {

    result.push({

      scope:
        targetLabel,

      layer:
        "branch",

      type:
        "육합",

      text:
        `${targetLabel} 지지 ${targetPillar.branch}와 육합`

    });

  }


  /* 지지 충 */

  if (
    hasPair(

      sourceBranch,

      targetPillar.branch,

      BRANCH_CLASH

    )
  ) {

    result.push({

      scope:
        targetLabel,

      layer:
        "branch",

      type:
        "충",

      text:
        `${targetLabel} 지지 ${targetPillar.branch}와 충`

    });

  }


  return result;

}


/* =========================================
   원국 관계
========================================= */

function getNatalRelations(
  stem,
  branch,
  pillars
) {

  const positions = [

    [
      "년주",
      pillars.year
    ],

    [
      "월주",
      pillars.month
    ],

    [
      "일주",
      pillars.day
    ],

    [
      "시주",
      pillars.hour
    ]

  ];


  return positions.flatMap(
    (
      [
        label,
        pillar
      ]
    ) =>

      collectRelation(

        stem,

        branch,

        pillar,

        label

      )
  );

}


/* =========================================
   대운 관계
========================================= */

function getDaeunRelations(
  stem,
  branch,
  cycle
) {

  if (
    !cycle
  ) {

    return [];

  }


  const pillar = {

    stem:
      cycle.stem,

    branch:
      cycle.branch,

    hanja:
      cycle.ganji

  };


  return collectRelation(

    stem,

    branch,

    pillar,

    "대운"

  );

}


/* =========================================
   세운 한 해 생성
========================================= */

function buildAnnualItem({

  year,

  currentAnnualYear,

  dayStem,

  pillars,

  fortuneCycle

}) {

  const ganjiInfo =
    getYearGanji(
      year
    );


  const mainHiddenStem =
    BRANCH_MAIN_STEM[
      ganjiInfo.branch
    ]

    ??

    "";


  const startMoment =
    calculateIpchunMoment(
      year
    );


  const endMoment =
    calculateIpchunMoment(
      year + 1
    );


  const middleMoment =
    new Date(

      (
        startMoment.getTime()

        +

        endMoment.getTime()
      )

      /

      2

    );


  const daeun =
    findFortuneCycleForMoment(

      fortuneCycle,

      middleMoment

    );


  const stemTenGod =
    calculateTenGod(

      dayStem,

      ganjiInfo.stem

    );


  const branchTenGod =

    mainHiddenStem

      ? calculateTenGod(

          dayStem,

          mainHiddenStem

        )

      : "";


  return {

    year,


    ganji:
      ganjiInfo.ganji,


    stem:
      ganjiInfo.stem,


    branch:
      ganjiInfo.branch,


    stemKorean:

      STEM_DATA[
        ganjiInfo.stem
      ]?.korean

      ??

      "",


    branchKorean:

      BRANCH_DATA[
        ganjiInfo.branch
      ]?.korean

      ??

      "",


    stemElement:

      STEM_DATA[
        ganjiInfo.stem
      ]?.element

      ??

      "",


    branchElement:

      BRANCH_DATA[
        ganjiInfo.branch
      ]?.element

      ??

      "",


    stemTenGod,


    branchMainStem:
      mainHiddenStem,


    branchTenGod,


    twelveStage:
      getTwelveStage(

        dayStem,

        ganjiInfo.branch

      ),


    startMoment,


    endMoment,


    periodLabel:
      `입춘 ${year} ~ 입춘 ${year + 1}`,


    isCurrent:
      year ===
      currentAnnualYear,


    daeun:

      daeun

        ? {

            index:
              daeun.index,

            ganji:
              daeun.ganji,

            stem:
              daeun.stem,

            branch:
              daeun.branch,

            stemTenGod:
              daeun.stemTenGod,

            branchTenGod:
              daeun.branchTenGod,

            startAgeLabel:
              daeun.startAgeLabel,

            endAgeLabel:
              daeun.endAgeLabel

          }

        : null,


    natalRelations:
      getNatalRelations(

        ganjiInfo.stem,

        ganjiInfo.branch,

        pillars

      ),


    daeunRelations:
      getDaeunRelations(

        ganjiInfo.stem,

        ganjiInfo.branch,

        daeun

      )

  };

}


/* =========================================
   메인 세운 계산
========================================= */

export function calculateAnnualFortune({

  pillars,

  fortuneCycle = null,

  startYear = null,

  count = 10,

  now = new Date()

}) {

  const normalizedPillars =
    normalizePillars(
      pillars
    );


  if (
    !normalizedPillars.day
  ) {

    throw new Error(
      "세운 계산에 일주가 필요합니다."
    );

  }


  const currentAnnualYear =
    getCurrentAnnualYear(
      now
    );


  const actualStartYear =

    Number.isFinite(
      Number(
        startYear
      )
    )

      ? Number(
          startYear
        )

      : currentAnnualYear - 4;


  const safeCount =
    Math.max(

      1,

      Math.min(

        30,

        Number(
          count
        )

        ||

        10

      )

    );


  const years =
    Array.from(

      {
        length:
          safeCount
      },

      (
        _,
        index
      ) =>

        buildAnnualItem({

          year:
            actualStartYear
            +
            index,

          currentAnnualYear,

          dayStem:
            normalizedPillars
              .day
              .stem,

          pillars:
            normalizedPillars,

          fortuneCycle

        })

    );


  return {

    currentAnnualYear,


    selectedYear:
      currentAnnualYear,


    startYear:
      actualStartYear,


    count:
      safeCount,


    pillars:
      normalizedPillars,


    years,


    convention:
      "세운은 입춘을 연도 경계로 보고, 원국 + 해당 시기의 대운 + 연간 간지를 함께 해석합니다.",


    note:
      "연도 표기는 해당 연도의 입춘부터 다음 해 입춘 전까지의 세운을 뜻합니다."

  };

}