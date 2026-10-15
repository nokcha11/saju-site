import {
  STEMS
} from "../data/stems.js";


import {
  PILLAR_LABELS,
  ELEMENT_LABELS
} from "../data/directReadingRules.js";


import {
  buildHealthReading
} from "./directReading.js";


/* =========================================
   지장간
========================================= */

const BRANCH_HIDDEN = {

  子: {
    stems: ["癸"],
    main: "癸"
  },

  丑: {
    stems: ["癸", "辛", "己"],
    main: "己"
  },

  寅: {
    stems: ["戊", "丙", "甲"],
    main: "甲"
  },

  卯: {
    stems: ["乙"],
    main: "乙"
  },

  辰: {
    stems: ["乙", "癸", "戊"],
    main: "戊"
  },

  巳: {
    stems: ["戊", "庚", "丙"],
    main: "丙"
  },

  午: {
    stems: ["丙", "己", "丁"],
    main: "丁"
  },

  未: {
    stems: ["丁", "乙", "己"],
    main: "己"
  },

  申: {
    stems: ["戊", "壬", "庚"],
    main: "庚"
  },

  酉: {
    stems: ["辛"],
    main: "辛"
  },

  戌: {
    stems: ["辛", "丁", "戊"],
    main: "戊"
  },

  亥: {
    stems: ["甲", "壬"],
    main: "壬"
  }

};


/* =========================================
   오행 생극
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
   공통
========================================= */

function unique(
  values
) {

  return [
    ...new Set(
      values.filter(Boolean)
    )
  ];

}


function joinText(
  ...texts
) {

  return unique(

    texts
      .flat()
      .map(
        value =>
          String(
            value ?? ""
          ).trim()
      )
      .filter(Boolean)

  ).join(" ");

}


function formatPositions(
  positions = []
) {

  return positions
    .map(
      key =>
        PILLAR_LABELS[
          key
        ] ?? key
    )
    .join(" · ");

}


/* =========================================
   일간
========================================= */

function getDayStem(
  context
) {

  return context
    ?.primaryPoints
    ?.find(
      item =>

        item.pillarKey === "day"

        &&

        item.layer === "stem"
    )
    ?.symbol
    ?? "";

}


/* =========================================
   십성 계산
========================================= */

function calculateTenGod(
  dayStem,
  targetStem
) {

  const day =
    STEMS[
      dayStem
    ];


  const target =
    STEMS[
      targetStem
    ];


  if (
    !day ||
    !target
  ) {

    return "";

  }


  const samePolarity =
    day.polarity ===
    target.polarity;


  if (
    day.element ===
    target.element
  ) {

    return samePolarity

      ? "비견"

      : "겁재";

  }


  if (
    GENERATES[
      day.element
    ] ===
    target.element
  ) {

    return samePolarity

      ? "식신"

      : "상관";

  }


  if (
    CONTROLS[
      day.element
    ] ===
    target.element
  ) {

    return samePolarity

      ? "편재"

      : "정재";

  }


  if (
    CONTROLS[
      target.element
    ] ===
    day.element
  ) {

    return samePolarity

      ? "편관"

      : "정관";

  }


  if (
    GENERATES[
      target.element
    ] ===
    day.element
  ) {

    return samePolarity

      ? "편인"

      : "정인";

  }


  return "";

}


/* =========================================
   지지 지장간 Profile
========================================= */

function getBranchHiddenProfile(
  context,
  branch
) {

  const hidden =
    BRANCH_HIDDEN[
      branch
    ];


  if (!hidden) {

    return [];

  }


  const dayStem =
    getDayStem(
      context
    );


  return hidden.stems.map(
    stem => ({

      stem,

      tenGod:
        calculateTenGod(
          dayStem,
          stem
        ),

      isMain:
        stem ===
        hidden.main

    })
  );

}


/* =========================================
   대표 십성
========================================= */

function getRepresentativeTenGod(
  context,
  pattern
) {

  if (
    pattern.layer === "branch"
  ) {

    return getBranchHiddenProfile(
      context,
      pattern.symbol
    )
      .find(
        item =>
          item.isMain
      )
      ?.tenGod
      ?? "";

  }


  return calculateTenGod(

    getDayStem(
      context
    ),

    pattern.symbol

  );

}


/* =========================================
   지장간 표시
========================================= */

function formatHidden(
  hidden
) {

  return hidden
    .map(
      item =>

        `${item.stem} ${item.tenGod}` +

        (
          item.isMain
            ? " (본기)"
            : ""
        )
    )
    .join(" · ");

}


/* =========================================
   십성 검색
========================================= */

function findGodItems(
  hidden,
  gods
) {

  return hidden.filter(
    item =>
      gods.includes(
        item.tenGod
      )
  );

}


function hasGod(
  hidden,
  gods
) {

  return findGodItems(
    hidden,
    gods
  ).length > 0;

}


/* =========================================
   병존 핵심
========================================= */

function buildPatternCore(
  pattern,
  hidden,
  mainTenGod
) {

  if (
    pattern.layer === "branch"
  ) {

    return `${pattern.symbol}이 ${formatPositions(
      pattern.positions
    )}에 ${pattern.count}회 반복됩니다. 대표 십성은 ${mainTenGod}이지만 내부의 ${formatHidden(
      hidden
    )} 조합 전체가 함께 반복됩니다.`;

  }


  return `${pattern.symbol} ${mainTenGod}이 ${formatPositions(
    pattern.positions
  )}에서 ${pattern.count}회 반복됩니다.`;

}


/* =========================================
   학업
========================================= */

function buildStudy(
  hidden,
  pattern
) {

  const output =
    hasGod(
      hidden,
      [
        "식신",
        "상관"
      ]
    );


  const authority =
    hasGod(
      hidden,
      [
        "정관",
        "편관"
      ]
    );


  const wealth =
    hasGod(
      hidden,
      [
        "정재",
        "편재"
      ]
    );


  if (
    output &&
    authority
  ) {

    return "실기·기술자격·코딩테스트처럼 결과와 평가기준이 분명한 시험에 강점을 쓰기 좋습니다.";

  }


  if (
    output &&
    wealth
  ) {

    return "이론 암기보다 문제풀이·실기처럼 실제 결과와 취업으로 연결되는 공부가 잘 맞습니다.";

  }


  if (
    pattern.element === "metal"
  ) {

    return "논리·정확성·판단기준이 분명한 IT·보안·데이터·기술 자격시험과 잘 맞습니다.";

  }


  return "같은 기운이 반복되므로 자신에게 맞는 공부방식을 찾으면 한 분야를 깊게 밀고 가는 힘이 강합니다.";

}


/* =========================================
   직업
========================================= */

function buildCareer(
  hidden,
  pattern
) {

  const output =
    hasGod(
      hidden,
      [
        "식신",
        "상관"
      ]
    );


  const wealth =
    hasGod(
      hidden,
      [
        "정재",
        "편재"
      ]
    );


  const authority =
    hasGod(
      hidden,
      [
        "정관",
        "편관"
      ]
    );


  if (
    output &&
    wealth &&
    authority
  ) {

    return "기술 + 성과 + 책임형입니다. 기술을 실제 결과와 수입으로 연결하면서 책임까지 맡는 직무에서 강점이 살아납니다.";

  }


  if (
    output &&
    wealth
  ) {

    return "기술 + 성과형입니다. 자신의 기술이나 결과물을 프로젝트·매출·수입으로 연결하는 일이 잘 맞습니다.";

  }


  if (
    wealth &&
    authority
  ) {

    return "성과 + 책임형입니다. 실적과 조직 책임을 함께 요구하는 업무와 잘 맞습니다.";

  }


  return "같은 업무능력이 여러 생활영역에서 반복되므로 한 분야를 전문화할수록 유리합니다.";

}


/* =========================================
   명예 · 승진
========================================= */

function buildHonor(
  hidden
) {

  const authority =
    findGodItems(
      hidden,
      [
        "정관",
        "편관"
      ]
    );


  if (
    authority.length
  ) {

    return `관성 ${unique(
      authority.map(
        item =>
          `${item.stem} ${item.tenGod}`
      )
    ).join(" · ")}이 반복됩니다. 실무성과가 쌓일수록 책임·평가·직급으로 연결되는 흐름을 봅니다.`;

  }


  return "직급 자체보다 실력·성과·전문성을 통해 평가받는 쪽이 더 강합니다.";

}


/* =========================================
   재물
========================================= */

function buildWealth(
  hidden,
  pattern
) {

  const wealth =
    findGodItems(
      hidden,
      [
        "정재",
        "편재"
      ]
    );


  if (
    !wealth.length
  ) {

    return "이 병존 내부에는 재성이 반복되지 않습니다. 재물운은 원국의 다른 재성을 함께 확인합니다.";

  }


  const stars =
    unique(
      wealth.map(
        item =>
          `${item.stem} ${item.tenGod}`
      )
    ).join(" · ");


  const output =
    hasGod(
      hidden,
      [
        "식신",
        "상관"
      ]
    );


  const authority =
    hasGod(
      hidden,
      [
        "정관",
        "편관"
      ]
    );


  let result =
    `${stars}이 ${pattern.count}회 반복됩니다.`;


  if (
    output &&
    authority
  ) {

    result +=
      " 기술을 성과와 수입으로 연결하고, 직업적 책임까지 함께 가져갈 때 재물운을 활용하기 좋습니다.";

  }

  else if (
    output
  ) {

    result +=
      " 자신의 기술이나 결과물을 프로젝트·서비스·수입으로 연결하는 방식이 잘 맞습니다.";

  }

  else {

    result +=
      " 실제 성과와 현금흐름을 만드는 능력이 반복되는 구조입니다.";

  }


  return result;

}


/* =========================================
   배우자 Profile
========================================= */

function getPatternSpouseProfile(
  context,
  hidden,
  pattern
) {

  const spouseGods =

    context?.gender === "male"

      ? [
          "정재",
          "편재"
        ]

      : [
          "정관",
          "편관"
        ];


  const items =
    findGodItems(
      hidden,
      spouseGods
    );


  const visible =
    items.some(
      item =>
        item.isMain
    );


  return {

    gods:
      spouseGods,

    items,

    visible,

    state:

      !items.length

        ? "병존 내부 미표출"

        : visible

          ? `본기 표출 · ${pattern.count}회 반복`

          : `지장간 잠복 · ${pattern.count}회 반복`,

    stars:
      unique(
        items.map(
          item =>
            `${item.stem} ${item.tenGod}`
        )
      )

  };

}


/* =========================================
   배우자 성향
========================================= */

function getSpouseTrait(
  gods
) {

  if (
    gods.includes(
      "편관"
    )
  ) {

    return "추진력이 있고 자기주장이 분명한 사람";

  }


  if (
    gods.includes(
      "정관"
    )
  ) {

    return "책임감이 있고 안정적인 사람";

  }


  if (
    gods.includes(
      "편재"
    )
  ) {

    return "활동적이고 현실감각과 사회성이 좋은 사람";

  }


  if (
    gods.includes(
      "정재"
    )
  ) {

    return "성실하고 생활이 안정적인 사람";

  }


  return "운에서 들어오는 배우자성까지 확인 필요";

}


/* =========================================
   애정 · 이성운

   ★ 남녀 확실히 분리
========================================= */

function buildLove(
  context,
  hidden,
  pattern
) {

  const profile =
    getPatternSpouseProfile(

      context,

      hidden,

      pattern

    );


  const spouseLabel =

    context?.gender === "male"

      ? "정재 · 편재"

      : "정관 · 편관";


  let result = "";


  if (
    !profile.items.length
  ) {

    result =
      "이 병존 자체에서는 배우자성이 반복되지 않습니다.";

  }

  else if (
    context?.gender === "female"
  ) {

    if (
      profile.visible
    ) {

      result =
        "이성·연애 문제가 비교적 직접적으로 드러나는 편입니다.";

    }

    else {

      result =
        "자주 마주치며 관계가 깊어지는 연애가 잘 맞습니다.";

    }

  }

  else {

    if (
      profile.visible
    ) {

      result =
        "이성 인연이 비교적 직접적으로 나타나는 편입니다. 사회활동이 넓어질수록 연애 기회도 함께 늘기 쉽습니다.";

    }

    else {

      result =
        "실제 교류가 쌓이면서 관계가 깊어지는 형태가 더 자연스럽습니다.";

    }

  }


  return `

    <strong>배우자성</strong>
    ${spouseLabel}

    <br>

    <strong>병존 속 배우자성</strong>
    ${
      profile.stars.join(" · ")
      ||
      "없음"
    }

    <br>

    <strong>상태</strong>
    ${profile.state}

    <br><br>

    <strong>이성운</strong>
    ${result}

    <br>

    <strong>배우자 성향</strong>
    ${getSpouseTrait(
      profile.items.map(
        item =>
          item.tenGod
      )
    )}

  `;

}


/* =========================================
   결혼
========================================= */

function buildMarriage(
  context,
  hidden,
  pattern
) {

  const profile =
    getPatternSpouseProfile(

      context,

      hidden,

      pattern

    );


  if (
    !profile.items.length
  ) {

    return `

      <strong>결혼 유형</strong>
      원국 전체 확인형

      <br>

      <strong>배우자성 상태</strong>
      병존 내부 미표출

      <br><br>

      이 병존 하나만으로 결혼운을 판단하지 않습니다.

    `;

  }


  let marriageType = "";

  let result = "";

  let point = "";


  if (
    context?.gender === "female"
  ) {

    marriageType =

      profile.visible

        ? "안정·책임형"

        : "신중·확인형";


    result =

      profile.visible

        ? "배우자 문제가 원국에서 비교적 직접적으로 드러나는 편입니다."

        : "상대를 충분히 경험한 뒤 결혼을 결정하는 쪽이 더 자연스럽습니다.";


    point =
      "대운·세운에서 관성이 강하게 드러나는 시기를 함께 확인합니다.";

  }

  else {

    marriageType =

      profile.visible

        ? "현실·생활형"

        : "신중·확인형";


    result =

      profile.visible

        ? "배우자 문제가 원국에서 비교적 직접적으로 드러나는 편입니다."

        : "관계가 충분히 쌓인 뒤 결혼으로 이어지는 흐름이 자연스럽습니다.";


    point =
      "배우자성이 반복되면 연애와 사회생활이 서로 영향을 주기 쉽습니다.";

  }


  return `

    <strong>결혼 유형</strong>
    ${marriageType}

    <br>

    <strong>배우자성 상태</strong>
    ${profile.state}

    <br><br>

    <strong>결혼운</strong>
    ${result}

    <br>

    <strong>중요 포인트</strong>
    ${point}

  `;

}


/* =========================================
   자녀운

   병존 내부만 해석
========================================= */

function buildChildren(
  context,
  hidden,
  pattern
) {

  const childGods =

    context?.gender === "male"

      ? [
          "정관",
          "편관"
        ]

      : [
          "식신",
          "상관"
        ];


  const items =
    findGodItems(
      hidden,
      childGods
    );


  if (
    !items.length
  ) {

    return `

      <strong>자녀성</strong>
      ${childGods.join(" · ")}

      <br>

      <strong>병존 속 자녀성</strong>
      없음

      <br><br>

      자녀운은 시주와 원국 전체를 따로 확인합니다.

    `;

  }


  const stars =
    unique(
      items.map(
        item =>
          `${item.stem} ${item.tenGod}`
      )
    ).join(" · ");


  return `

    <strong>자녀성</strong>
    ${childGods.join(" · ")}

    <br>

    <strong>병존 속 자녀성</strong>
    ${stars}

    <br>

    <strong>상태</strong>
    ${pattern.count}회 반복

    <br><br>

    자녀와 관련된 관심·책임이 반복적으로 중요한 주제가 될 가능성을 봅니다.

  `;

}


/* =========================================
   병존 + 간여지동
========================================= */

function buildCompositeReading(
  data
) {

  const summary =
    data.patternSummary;


  if (
    !summary?.ganYeojidongCount ||
    !summary?.coexistenceCount
  ) {

    return "";

  }


  if (
    summary.mode === "same-element"
  ) {

    return "병존과 간여지동이 같은 오행으로 겹칩니다. 한 가지 능력을 깊게 전문화하기 좋지만 같은 판단을 반복하지 않도록 주의하는 편이 좋습니다.";

  }


  return "병존과 간여지동이 서로 다른 오행으로 작동합니다. 주력 능력과 보조 능력을 구분해서 사용하는 편이 좋습니다.";

}


/* =========================================
   병존
========================================= */

function buildCoexistenceReading(
  data
) {

  const pattern =
    data.pattern;


  const context =
    data.chartContext;


  const hidden =

    pattern.layer === "branch"

      ? getBranchHiddenProfile(
          context,
          pattern.symbol
        )

      : [

          {

            stem:
              pattern.symbol,

            tenGod:
              calculateTenGod(
                getDayStem(
                  context
                ),
                pattern.symbol
              ),

            isMain:
              true

          }

        ];


  const mainTenGod =
    getRepresentativeTenGod(

      context,

      pattern

    );


  return {

    category:

      pattern.layer === "stem"

        ? "STEM COEXISTENCE"

        : "BRANCH COEXISTENCE",

    symbol:
      pattern.symbol.repeat(
        pattern.count
      ),

    title:
      `${pattern.symbol} ${pattern.level}`,

    keyword:
      `${formatPositions(
        pattern.positions
      )} · ${mainTenGod} · ${ELEMENT_LABELS[pattern.element]}`,

    meta: [

      {
        label:
          "반복 위치",

        value:
          formatPositions(
            pattern.positions
          )
      },

      {
        label:
          "대표 십성",

        value:
          mainTenGod
      },

      {
        label:
          "반복",

        value:
          `${pattern.count}회`
      },

      {
        label:
          "성별",

        value:
          context?.genderLabel ?? "—"
      }

    ],

    summary:
      buildPatternCore(

        pattern,

        hidden,

        mainTenGod

      ),

    sections: [

      {
        title:
          "병존 핵심",

        text:
          `내부 구조: ${formatHidden(
            hidden
          )} · ${pattern.count}회 반복`
      },

      {
        title:
          "학업 · 합격운",

        text:
          buildStudy(
            hidden,
            pattern
          )
      },

      {
        title:
          "취업 · 직업운",

        text:
          buildCareer(
            hidden,
            pattern
          )
      },

      {
        title:
          "명예 · 승진운",

        text:
          buildHonor(
            hidden
          )
      },

      {
        title:
          "재물운",

        text:
          buildWealth(
            hidden,
            pattern
          )
      },

      {
        title:
          "애정 · 이성운",

        text:
          buildLove(

            context,

            hidden,

            pattern

          )
      },

      {
        title:
          "결혼 · 배우자운",

        text:
          buildMarriage(

            context,

            hidden,

            pattern

          )
      },

      {
        title:
          "자녀운",

        text:
          buildChildren(

            context,

            hidden,

            pattern

          )
      },

      {
        title:
          "건강운",

        text:
          buildHealthReading({

            element:
              pattern.element,

            count:
              pattern.count

          })
      },

      {
        title:
          "병존 + 간여지동",

        text:
          buildCompositeReading(
            data
          )
      }

    ]

  };

}


/* =========================================
   간여지동
========================================= */

function buildGanYeojidongReading(
  data
) {

  const pattern =
    data.pattern;


  const context =
    data.chartContext;


  const ganji =
    Array.from(
      pattern.ganji ?? ""
    );


  const stem =
    pattern.stem
    ??
    ganji[0];


  const branch =
    pattern.branch
    ??
    ganji[1];


  const stemTenGod =
    calculateTenGod(

      getDayStem(
        context
      ),

      stem

    );


  const hidden =
    getBranchHiddenProfile(

      context,

      branch

    );


  const branchTenGod =
    hidden
      .find(
        item =>
          item.isMain
      )
      ?.tenGod
      ?? "";


  return {

    category:
      "GAN YEO JI DONG",

    symbol:
      pattern.ganji,

    title:
      `${pattern.pillarLabel} 간여지동`,

    keyword:
      `${ELEMENT_LABELS[pattern.element]} · 같은 오행 집중`,

    meta: [

      {
        label:
          "위치",

        value:
          pattern.pillarLabel
      },

      {
        label:
          "간지",

        value:
          pattern.ganji
      },

      {
        label:
          "천간 십성",

        value:
          stemTenGod || "—"
      },

      {
        label:
          "지지 십성",

        value:
          branchTenGod || "—"
      }

    ],

    summary:
      `${pattern.pillarLabel}의 천간과 지지가 같은 ${ELEMENT_LABELS[pattern.element]}으로 묶여 한 방향으로 힘이 집중됩니다.`,

    sections: [

      {
        title:
          "직업운",

        text:
          "자신에게 맞는 분야를 잡으면 같은 능력을 반복해서 사용하면서 전문성을 빠르게 깊게 만들기 좋습니다."
      },

      {
        title:
          "재물운",

        text:
          "잘 맞는 수입방식을 찾으면 꾸준히 확대하기 좋지만 잘못된 재정판단도 반복할 수 있으므로 객관적인 기준을 두는 편이 좋습니다."
      },

      {
        title:
          "애정 · 관계",

        text:
          "관계에서도 자신의 기준이 일관되게 나타나는 편입니다. 상대와 생활기준이 맞는지가 중요합니다."
      },

      {
        title:
          "건강운",

        text:
          buildHealthReading({

            element:
              pattern.element,

            count: 1

          })
      },

      {
        title:
          "병존과 함께 나타날 때",

        text:
          buildCompositeReading(
            data
          )
      }

    ]

  };

}


/* =========================================
   외부
========================================= */

export function buildPatternReading(
  data
) {

  if (
    data.type === "coexistence"
  ) {

    return buildCoexistenceReading(
      data
    );

  }


  if (
    data.type === "ganYeojidong"
  ) {

    return buildGanYeojidongReading(
      data
    );

  }


  return null;

}