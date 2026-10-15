import {
  calculateTenGod
} from "../calculators/tenGods.js";

import {
  getHiddenStems,
  getMainHiddenStem
} from "../calculators/hiddenStems.js";


export const POSITION_LABELS = {
  yearStem: "년간",
  yearBranch: "년지",

  monthStem: "월간",
  monthBranch: "월지",

  dayStem: "일간",
  dayBranch: "일지",

  hourStem: "시간",
  hourBranch: "시지"
};


const PILLAR_LABELS = {
  year: "년주",
  month: "월주",
  day: "일주",
  hour: "시주"
};


function splitPillar(pillar) {

  const [
    stem,
    branch
  ] = Array.from(
    pillar.hanja
  );


  return {
    stem,
    branch
  };
}


function normalizeGender(
  gender
) {

  return gender === "female"
    ? "female"
    : "male";
}


function uniquePlacements(
  items
) {

  const map =
    new Map();


  items.forEach(
    item => {

      const key =
        [
          item.pillarKey,
          item.layer,
          item.tenGod,
          item.stem ?? "",
          item.branch ?? ""
        ].join("-");


      if (
        !map.has(key)
      ) {

        map.set(
          key,
          item
        );

      }

    }
  );


  return Array.from(
    map.values()
  );
}


export function buildChartContext(
  raw,
  gender = "male"
) {

  const normalizedGender =
    normalizeGender(
      gender
    );


  const pillars = {

    year:
      splitPillar(
        raw.year
      ),

    month:
      splitPillar(
        raw.month
      ),

    day:
      splitPillar(
        raw.day
      ),

    hour:
      splitPillar(
        raw.hour
      )

  };


  const dayStem =
    pillars.day.stem;


  const primaryPoints = [];

  const hiddenPoints = [];


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


      const stemTenGod =
        pillarKey === "day"

          ? "일원"

          : calculateTenGod(
              dayStem,
              pillar.stem
            );


      primaryPoints.push({

        pillarKey,

        pillarLabel:
          PILLAR_LABELS[
            pillarKey
          ],

        layer:
          "stem",

        position:
          `${pillarKey}Stem`,

        symbol:
          pillar.stem,

        tenGod:
          stemTenGod

      });


      const mainHiddenStem =
        getMainHiddenStem(
          pillar.branch
        );


      const branchTenGod =
        mainHiddenStem

          ? calculateTenGod(
              dayStem,
              mainHiddenStem
            )

          : "";


      primaryPoints.push({

        pillarKey,

        pillarLabel:
          PILLAR_LABELS[
            pillarKey
          ],

        layer:
          "branch",

        position:
          `${pillarKey}Branch`,

        symbol:
          pillar.branch,

        hiddenStem:
          mainHiddenStem,

        tenGod:
          branchTenGod

      });


      const hiddenStems =
        getHiddenStems(
          pillar.branch
        );


      hiddenStems.forEach(
        stem => {

          hiddenPoints.push({

            pillarKey,

            pillarLabel:
              PILLAR_LABELS[
                pillarKey
              ],

            layer:
              "hidden",

            position:
              `${pillarKey}Branch`,

            branch:
              pillar.branch,

            stem,

            tenGod:
              calculateTenGod(
                dayStem,
                stem
              ),

            isMain:
              stem ===
              mainHiddenStem

          });

        }
      );

    }
  );


  /*
    전통 명리의 배우자 별 기준
  */

  const spouseGods =

    normalizedGender ===
      "male"

      ? [
          "정재",
          "편재"
        ]

      : [
          "정관",
          "편관"
        ];


  /*
    이번 사이트에서 사용할
    전통 육친 자녀 기준

    남성 : 관성
    여성 : 식상
  */

  const childGods =

    normalizedGender ===
      "male"

      ? [
          "정관",
          "편관"
        ]

      : [
          "식신",
          "상관"
        ];


  const spousePrimary =
    primaryPoints.filter(
      item =>
        spouseGods.includes(
          item.tenGod
        )
    );


  const spouseHidden =
    hiddenPoints.filter(
      item =>
        spouseGods.includes(
          item.tenGod
        )
    );


  const childPrimary =
    primaryPoints.filter(
      item =>
        childGods.includes(
          item.tenGod
        )
    );


  const childHidden =
    hiddenPoints.filter(
      item =>
        childGods.includes(
          item.tenGod
        )
    );


  return {

    gender:
      normalizedGender,

    genderLabel:
      normalizedGender ===
        "male"

        ? "남성"

        : "여성",

    pillars,

    dayStem,

    primaryPoints,

    hiddenPoints,

    spouseGods,

    childGods,

    spousePrimary:
      uniquePlacements(
        spousePrimary
      ),

    spouseHidden:
      uniquePlacements(
        spouseHidden
      ),

    childPrimary:
      uniquePlacements(
        childPrimary
      ),

    childHidden:
      uniquePlacements(
        childHidden
      )

  };
}


/* =========================================
   배우자 구조 요약
========================================= */

export function summarizeSpouseStructure(
  context
) {

  if (!context) {

    return "";

  }


  const starLabel =

    context.gender ===
      "male"

      ? "재성(정재·편재)"

      : "관성(정관·편관)";


  const visible =
    context.spousePrimary;


  const hidden =
    context.spouseHidden.filter(
      item =>
        !item.isMain
    );


  const hasDay =
    visible.some(
      item =>
        item.pillarKey ===
        "day"
    );


  const hasMonth =
    visible.some(
      item =>
        item.pillarKey ===
        "month"
    );


  let result =
    `전통 명리 기준에서 ${context.genderLabel}의 배우자 별은 ${starLabel}입니다. `;


  if (
    visible.length >= 2
  ) {

    result +=
      `배우자 별이 원국의 주요 위치에 ${visible.length}곳 이상 반복되어 이성·배우자 문제가 삶에서 비교적 분명한 주제로 나타나기 쉽습니다. `;

  }

  else if (
    visible.length === 1
  ) {

    result +=
      "배우자 별이 주요 위치 한 곳에 드러나 있어 관계의 성향이 특정 생활 영역을 중심으로 나타나는 편입니다. ";

  }

  else if (
    hidden.length
  ) {

    result +=
      "배우자 별이 천간이나 본기에 강하게 드러나기보다 지장간에 숨어 있어 관계 문제가 겉으로 즉시 드러나기보다 실제 생활이나 운의 변화에서 체감될 수 있습니다. ";

  }

  else {

    result +=
      "배우자 별이 원국 표면에서 뚜렷하지 않습니다. 이것은 연애나 결혼이 없다는 뜻이 아니며, 배우자궁과 합충 관계 및 이후 대운·세운에서 관계 운이 활성화될 수 있습니다. ";

  }


  if (
    hasDay &&
    hasMonth
  ) {

    result +=
      "특히 일주와 월주에 배우자 별이 함께 나타나면 개인적인 연애·결혼 문제와 직장·사회생활 속 인연이 서로 연결되기 쉽습니다.";

  }

  else if (
    hasDay
  ) {

    result +=
      "일주 영역에 배우자 별이 있어 실제 생활과 가까운 관계에서 이성·배우자 문제가 직접적으로 체감되기 쉽습니다.";

  }

  else if (
    hasMonth
  ) {

    result +=
      "월주 영역에 배우자 별이 있어 직장·사회생활이나 외부 활동을 통해 관계 이슈가 나타나기 쉽습니다.";

  }


  return result;
}


/* =========================================
   자녀 구조 요약
========================================= */

export function summarizeChildStructure(
  context
) {

  if (!context) {

    return "";

  }


  const starLabel =

    context.gender ===
      "male"

      ? "관성(정관·편관)"

      : "식상(식신·상관)";


  const visible =
    context.childPrimary;


  const hidden =
    context.childHidden.filter(
      item =>
        !item.isMain
    );


  const hasHour =
    visible.some(
      item =>
        item.pillarKey ===
        "hour"
    );


  let result =
    `이 사이트의 전통 육친 기준에서는 ${context.genderLabel}의 자녀 별을 ${starLabel}으로 봅니다. `;


  if (
    visible.length >= 2
  ) {

    result +=
      "자녀 별이 원국 여러 위치에 반복되어 자녀·후배·성과를 책임지는 문제가 비교적 중요한 삶의 주제가 되기 쉽습니다. ";

  }

  else if (
    visible.length === 1
  ) {

    result +=
      "자녀 별이 주요 위치 한 곳에 드러나 있어 해당 영역을 중심으로 자녀·후배·성과 문제가 나타나기 쉽습니다. ";

  }

  else if (
    hidden.length
  ) {

    result +=
      "자녀 별이 지장간에 숨어 있어 자녀 문제나 후배를 책임지는 역할이 겉보다 실제 생활 과정에서 나타날 가능성이 있습니다. ";

  }

  else {

    result +=
      "자녀 별이 원국 표면에서 강하게 드러나지 않습니다. 이것만으로 자녀운의 유무를 판단하지 않고 시주와 운의 흐름을 함께 봅니다. ";

  }


  if (
    hasHour
  ) {

    result +=
      "특히 시주에 자녀 별이 있어 후반기 삶과 자녀·후배·결과물 영역이 직접 연결되는 편입니다.";

  }


  return result;
}