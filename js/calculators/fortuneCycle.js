/* =========================================
   대운 계산기

   기준
   - 성별 + 년간 음양으로 순행/역행
   - 순행 : 출생 → 다음 절입
   - 역행 : 이전 절입 → 출생
   - 3일 = 1년
   - 월주 기준으로 대운 간지 진행
========================================= */


/* =========================================
   천간 / 지지
========================================= */

const STEMS = [
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


const BRANCHES = [
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

      STEMS[
        index % 10
      ]

      +

      BRANCHES[
        index % 12
      ]
  );


/* =========================================
   천간 음양
========================================= */

const STEM_POLARITY = {

  甲: "yang",
  乙: "yin",

  丙: "yang",
  丁: "yin",

  戊: "yang",
  己: "yin",

  庚: "yang",
  辛: "yin",

  壬: "yang",
  癸: "yin"

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
   오행 생극
========================================= */

const GENERATES = {

  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood"

};


const CONTROLS = {

  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire"

};


/* =========================================
   절입

   태양 황경 기준

   소한   285
   입춘   315
   경칩   345
   청명    15
   입하    45
   망종    75
   소서   105
   입추   135
   백로   165
   한로   195
   입동   225
   대설   255
========================================= */

const JEOL_TERMS = [

  {
    name: "소한",
    longitude: 285,
    month: 1,
    day: 5
  },

  {
    name: "입춘",
    longitude: 315,
    month: 2,
    day: 4
  },

  {
    name: "경칩",
    longitude: 345,
    month: 3,
    day: 6
  },

  {
    name: "청명",
    longitude: 15,
    month: 4,
    day: 5
  },

  {
    name: "입하",
    longitude: 45,
    month: 5,
    day: 6
  },

  {
    name: "망종",
    longitude: 75,
    month: 6,
    day: 6
  },

  {
    name: "소서",
    longitude: 105,
    month: 7,
    day: 7
  },

  {
    name: "입추",
    longitude: 135,
    month: 8,
    day: 8
  },

  {
    name: "백로",
    longitude: 165,
    month: 9,
    day: 8
  },

  {
    name: "한로",
    longitude: 195,
    month: 10,
    day: 8
  },

  {
    name: "입동",
    longitude: 225,
    month: 11,
    day: 7
  },

  {
    name: "대설",
    longitude: 255,
    month: 12,
    day: 7
  }

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


/* =========================================
   태양 황경

   절입 시각 계산용

   Meeus 계열 태양 위치 근사식
========================================= */

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

      36000.76983 * T

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

      35999.05029 * T

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
      0.004817 * T
      -
      0.000014 * T * T
    )

    *
    Math.sin(
      Mr
    )

    +

    (
      0.019993
      -
      0.000101 * T
    )

    *
    Math.sin(
      2 * Mr
    )

    +

    0.000289

    *
    Math.sin(
      3 * Mr
    );


  const omega =

    125.04

    -

    1934.136 * T;


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

   -180 ~ +180
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
   해당 연도의 절입 시각 찾기

   예상 날짜 ±4일 사이에서
   황경 통과 순간을 찾음
========================================= */

function calculateJeolMoment(
  year,
  term
) {

  /*
    정오 KST 부근을 중심점으로 사용
  */

  const center =
    new Date(
      `${year}-${String(
        term.month
      ).padStart(
        2,
        "0"
      )}-${String(
        term.day
      ).padStart(
        2,
        "0"
      )}T12:00:00+09:00`
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

      term.longitude

    );


  /*
    1시간 단위 탐색
  */

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

        term.longitude

      );


    /*
      태양 황경이 목표값을 통과
    */

    if (
      previousDifference <= 0
      &&
      currentDifference >= 0
    ) {

      let low =
        previous.getTime();


      let high =
        current.getTime();


      /*
        이분 탐색으로
        절입 시각 세밀화
      */

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

            term.longitude

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


  /*
    계산 실패 시
    중심 날짜 반환
  */

  return center;

}


/* =========================================
   출생일 주변 절입 전체
========================================= */

function getNearbyJeolTerms(
  birthYear
) {

  const result =
    [];


  [
    birthYear - 1,
    birthYear,
    birthYear + 1
  ]
    .forEach(
      year => {

        JEOL_TERMS.forEach(
          term => {

            result.push({

              ...term,

              year,

              moment:
                calculateJeolMoment(
                  year,
                  term
                )

            });

          }
        );

      }
    );


  return result.sort(
    (
      a,
      b
    ) =>
      a.moment
      -
      b.moment
  );

}


/* =========================================
   성별 정규화
========================================= */

function normalizeGender(
  gender
) {

  const value =
    String(
      gender ?? ""
    )
      .trim()
      .toLowerCase();


  if (
    [
      "male",
      "m",
      "남",
      "남성"
    ].includes(
      value
    )
  ) {

    return "male";

  }


  if (
    [
      "female",
      "f",
      "여",
      "여성"
    ].includes(
      value
    )
  ) {

    return "female";

  }


  throw new Error(
    "대운 계산에 성별 정보가 필요합니다."
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
    typeof pillar === "string"
  ) {

    const chars =
      Array.from(
        pillar
      );


    return {

      stem:
        chars[0],

      branch:
        chars[1],

      hanja:
        chars
          .slice(
            0,
            2
          )
          .join("")

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
   순행 / 역행

   양년 남자 = 순행
   음년 여자 = 순행

   음년 남자 = 역행
   양년 여자 = 역행
========================================= */

function determineDirection(
  yearStem,
  gender
) {

  const polarity =
    STEM_POLARITY[
      yearStem
    ];


  if (
    !polarity
  ) {

    throw new Error(
      "년간의 음양 정보를 찾을 수 없습니다."
    );

  }


  const normalizedGender =
    normalizeGender(
      gender
    );


  const forward =

    (
      normalizedGender === "male"
      &&
      polarity === "yang"
    )

    ||

    (
      normalizedGender === "female"
      &&
      polarity === "yin"
    );


  return {

    key:
      forward
        ? "forward"
        : "reverse",

    label:
      forward
        ? "순행"
        : "역행",

    gender:
      normalizedGender,

    yearStem,

    polarity,

    polarityLabel:
      polarity === "yang"
        ? "양간"
        : "음간"

  };

}


/* =========================================
   절입 선택

   순행 → 다음 절입
   역행 → 이전 절입
========================================= */

function findReferenceJeol(
  birthMoment,
  direction
) {

  const year =
    Number(

      birthMoment
        .toLocaleString(
          "en-US",
          {
            timeZone:
              "Asia/Seoul",

            year:
              "numeric"
          }
        )

    );


  const terms =
    getNearbyJeolTerms(
      year
    );


  if (
    direction === "forward"
  ) {

    return terms.find(
      item =>
        item.moment >
        birthMoment
    );

  }


  return [
    ...terms
  ]
    .reverse()
    .find(
      item =>
        item.moment <
        birthMoment
    );

}


/* =========================================
   대운 시작 나이

   3일 = 1년
========================================= */

function calculateStartAge(
  birthMoment,
  jeolMoment
) {

  const milliseconds =
    Math.abs(

      jeolMoment.getTime()

      -

      birthMoment.getTime()

    );


  const days =
    milliseconds
    /
    86400000;


  const years =
    days
    /
    3;


  let fullYears =
    Math.floor(
      years
    );


  let months =
    Math.round(

      (
        years
        -
        fullYears
      )

      *
      12

    );


  if (
    months >= 12
  ) {

    fullYears +=
      1;


    months =
      0;

  }


  return {

    days,

    years,

    fullYears,

    months,

    label:

      months > 0

        ? `${fullYears}세 ${months}개월`

        : `${fullYears}세`

  };

}


/* =========================================
   천간 십성
========================================= */

function getTenGod(
  dayStem,
  targetStem
) {

  if (
    dayStem ===
    targetStem
  ) {

    return "비견";

  }


  const dayElement =
    STEM_ELEMENT[
      dayStem
    ];


  const targetElement =
    STEM_ELEMENT[
      targetStem
    ];


  const dayPolarity =
    STEM_POLARITY[
      dayStem
    ];


  const targetPolarity =
    STEM_POLARITY[
      targetStem
    ];


  const samePolarity =
    dayPolarity ===
    targetPolarity;


  /*
    같은 오행
  */

  if (
    dayElement ===
    targetElement
  ) {

    return samePolarity
      ? "비견"
      : "겁재";

  }


  /*
    일간이 대상을 생
    → 식상
  */

  if (
    GENERATES[
      dayElement
    ] ===
    targetElement
  ) {

    return samePolarity
      ? "식신"
      : "상관";

  }


  /*
    일간이 대상 극
    → 재성
  */

  if (
    CONTROLS[
      dayElement
    ] ===
    targetElement
  ) {

    return samePolarity
      ? "편재"
      : "정재";

  }


  /*
    대상이 일간 극
    → 관성
  */

  if (
    CONTROLS[
      targetElement
    ] ===
    dayElement
  ) {

    return samePolarity
      ? "편관"
      : "정관";

  }


  /*
    대상이 일간 생
    → 인성
  */

  if (
    GENERATES[
      targetElement
    ] ===
    dayElement
  ) {

    return samePolarity
      ? "편인"
      : "정인";

  }


  return "";

}


/* =========================================
   월주 위치
========================================= */

function getGanjiIndex(
  pillar
) {

  return GANJI_60.indexOf(
    pillar
  );

}


/* =========================================
   날짜에 년수 추가
========================================= */

function addYearsApprox(
  birthMoment,
  years
) {

  const milliseconds =

    years

    *

    365.2422

    *

    86400000;


  return new Date(

    birthMoment.getTime()

    +

    milliseconds

  );

}


/* =========================================
   연도 표시
========================================= */

function getKoreanYear(
  date
) {

  return Number(

    date.toLocaleString(
      "en-US",
      {
        timeZone:
          "Asia/Seoul",

        year:
          "numeric"
      }
    )

  );

}


/* =========================================
   대운 10개 생성
========================================= */

function buildCycles(
  monthPillar,
  dayStem,
  direction,
  startAge,
  birthMoment,
  count
) {

  const monthIndex =
    getGanjiIndex(
      monthPillar
    );


  if (
    monthIndex < 0
  ) {

    throw new Error(
      `월주 ${monthPillar}를 60갑자에서 찾을 수 없습니다.`
    );

  }


  const step =
    direction === "forward"
      ? 1
      : -1;


  return Array.from(
    {
      length:
        count
    },
    (
      _,
      index
    ) => {

      /*
        월주 다음/이전 간지부터
        첫 대운
      */

      const cycleIndex =
        mod(

          monthIndex

          +

          step
          *
          (
            index
            +
            1
          ),

          60

        );


      const ganji =
        GANJI_60[
          cycleIndex
        ];


      const stem =
        ganji[0];


      const branch =
        ganji[1];


      const hidden =
        HIDDEN_STEMS[
          branch
        ]
        ??
        [];


      const mainHidden =
        hidden[
          hidden.length - 1
        ]
        ??
        "";


      const startAgeYears =

        startAge.years

        +

        index
        *
        10;


      const endAgeYears =

        startAgeYears

        +

        10;


      const startMoment =
        addYearsApprox(

          birthMoment,

          startAgeYears

        );


      const endMoment =
        addYearsApprox(

          birthMoment,

          endAgeYears

        );


      return {

        index:
          index + 1,

        ganji,

        stem,

        branch,

        stemTenGod:
          getTenGod(
            dayStem,
            stem
          ),

        branchMainStem:
          mainHidden,

        branchTenGod:

          mainHidden

            ? getTenGod(
                dayStem,
                mainHidden
              )

            : "",


        startAge:
          startAgeYears,

        endAge:
          endAgeYears,


        startAgeLabel:
          `${Math.floor(
            startAgeYears
          )}세`,

        endAgeLabel:
          `${Math.floor(
            endAgeYears
          )}세`,


        startYear:
          getKoreanYear(
            startMoment
          ),

        endYear:
          getKoreanYear(
            endMoment
          )

      };

    }
  );

}


/* =========================================
   메인 대운 계산
========================================= */

export function calculateFortuneCycle({

  birthDate,

  birthTime = "12:00",

  unknownTime = false,

  gender,

  pillars,

  count = 10

}) {

  if (
    !birthDate
  ) {

    throw new Error(
      "대운 계산에 출생일이 필요합니다."
    );

  }


  const yearPillar =
    normalizePillar(
      pillars?.year
    );


  const monthPillar =
    normalizePillar(
      pillars?.month
    );


  const dayPillar =
    normalizePillar(
      pillars?.day
    );


  if (
    !yearPillar
    ||
    !monthPillar
    ||
    !dayPillar
  ) {

    throw new Error(
      "대운 계산에 년주·월주·일주가 필요합니다."
    );

  }


  /*
    시간 미상은 정오 기준
  */

  const effectiveTime =

    unknownTime

      ? "12:00"

      : (
          birthTime
          ||
          "12:00"
        );


  const birthMoment =
    new Date(

      `${birthDate}T${effectiveTime}:00+09:00`

    );


  if (
    Number.isNaN(
      birthMoment.getTime()
    )
  ) {

    throw new Error(
      "출생 날짜 또는 시간을 확인해주세요."
    );

  }


  /* =====================================
     순행 / 역행
  ===================================== */

  const direction =
    determineDirection(

      yearPillar.stem,

      gender

    );


  /* =====================================
     기준 절입
  ===================================== */

  const referenceJeol =
    findReferenceJeol(

      birthMoment,

      direction.key

    );


  if (
    !referenceJeol
  ) {

    throw new Error(
      "대운수 계산에 필요한 절입을 찾지 못했습니다."
    );

  }


  /* =====================================
     대운 시작 나이
  ===================================== */

  const startAge =
    calculateStartAge(

      birthMoment,

      referenceJeol.moment

    );


  /* =====================================
     10년 대운
  ===================================== */

  const cycles =
    buildCycles(

      monthPillar.hanja,

      dayPillar.stem,

      direction.key,

      startAge,

      birthMoment,

      count

    );


  return {

    direction,

    startAge,


    referenceJeol: {

      name:
        referenceJeol.name,

      moment:
        referenceJeol.moment,

      directionText:

        direction.key ===
        "forward"

          ? "다음 절입"

          : "이전 절입"

    },


    birth: {

      date:
        birthDate,

      time:
        effectiveTime,

      unknownTime,

      approximate:
        unknownTime

    },


    pillars: {

      year:
        yearPillar,

      month:
        monthPillar,

      day:
        dayPillar

    },


    cycles,


    convention:
      "성별·년간 음양 순역법 + 절입 기준 + 3일 1년법",


    note:

      unknownTime

        ? "출생시간 미상으로 정오를 기준으로 계산했으므로 대운 시작 나이는 근사값입니다."

        : "출생 시각과 절입 시각의 차이를 3일=1년으로 환산했습니다."

  };

}