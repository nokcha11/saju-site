import {
  STEMS
} from "../data/stems.js";


import {
  BRANCHES
} from "../data/branches.js";


import {
  PILLAR_LABELS,
  ELEMENT_LABELS,
  TEN_GOD_RULES,
  STEM_RULES,
  BRANCH_RULES,
  STAGE_RULES,
  SINSAL_RULES,
  GONGMANG_RULES
} from "../data/directReadingRules.js";


import {
  buildWealthSectionHtml
} from "./wealthReading.js";


/* =========================================
   건강운
========================================= */

const HEALTH_ELEMENT_RULES = {

  wood: {
    parts:
      "간·담 · 눈 · 근육·인대",

    care:
      "눈의 피로, 목·어깨 긴장, 수면 부족이 오래 이어지지 않도록 관리하는 편이 좋습니다."
  },


  fire: {
    parts:
      "심혈관 계통 · 순환 · 열감 · 수면",

    care:
      "과로와 수면 부족을 반복하지 않고 생활 리듬을 일정하게 유지하는 편이 좋습니다."
  },


  earth: {
    parts:
      "위장·소화 · 복부",

    care:
      "불규칙한 식사와 과식을 줄이고 식사시간을 일정하게 유지하는 편이 좋습니다."
  },


  metal: {
    parts:
      "폐·호흡기 · 코 · 피부",

    care:
      "건조한 환경, 먼지·연기 자극을 줄이고 수분 섭취와 실내 공기 관리에 신경 쓰는 편이 좋습니다."
  },


  water: {
    parts:
      "신장·비뇨 · 허리 · 귀",

    care:
      "수분 부족과 장시간 앉아 있는 생활을 피하고 허리와 하체를 자주 움직여주는 편이 좋습니다."
  }

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


function getPillarShortLabel(
  pillarKey
) {

  const table = {

    year:
      "년",

    month:
      "월",

    day:
      "일",

    hour:
      "시"

  };


  return table[
    pillarKey
  ] ?? pillarKey;

}


/* =========================================
   현재 십성
========================================= */

export function getCurrentTenGod(
  data
) {

  if (
    data.type === "tenGod"
  ) {

    return data.name ?? "";

  }


  if (
    data.type === "hidden"
  ) {

    return data.hiddenStems
      ?.find(
        item =>
          item.isMain
      )
      ?.tenGod ?? "";

  }


  const point =
    data.chartContext
      ?.primaryPoints
      ?.find(
        item =>

          item.pillarKey ===
            data.pillarKey

          &&

          item.layer ===
            data.layer
      );


  return point?.tenGod ?? "";

}


/* =========================================
   현재 오행
========================================= */

export function getCurrentElement(
  data
) {

  if (
    data.type === "stem"
  ) {

    return STEMS[
      data.value
    ]?.element ?? "";

  }


  if (
    data.type === "branch"
  ) {

    return BRANCHES[
      data.value
    ]?.element ?? "";

  }


  if (
    data.type === "hidden"
  ) {

    const main =
      data.hiddenStems
        ?.find(
          item =>
            item.isMain
        );


    return STEMS[
      main?.stem
    ]?.element ?? "";

  }


  if (
    data.value &&
    BRANCHES[
      data.value
    ]
  ) {

    return BRANCHES[
      data.value
    ].element;

  }


  const point =
    data.chartContext
      ?.primaryPoints
      ?.find(
        item =>

          item.pillarKey ===
            data.pillarKey

          &&

          item.layer ===
            data.layer
      );


  if (
    point?.layer === "stem"
  ) {

    return STEMS[
      point.symbol
    ]?.element ?? "";

  }


  if (
    point?.layer === "branch"
  ) {

    return BRANCHES[
      point.symbol
    ]?.element ?? "";

  }


  return "";

}


/* =========================================
   천간 / 지지 Rule
========================================= */

function getSymbolRule(
  data
) {

  if (
    data.type === "stem"
  ) {

    return STEM_RULES[
      data.value
    ] ?? null;

  }


  if (
    data.type === "branch"
  ) {

    return BRANCH_RULES[
      data.value
    ] ?? null;

  }


  if (
    data.type === "hidden"
  ) {

    return BRANCH_RULES[
      data.branch
    ] ?? null;

  }


  return null;

}


/* =========================================
   가족성 위치 수집
========================================= */

function collectFamilyPlacements(
  context,
  primaryKey,
  hiddenKey
) {

  if (!context) {

    return [];

  }


  const primary =
    context[
      primaryKey
    ] ?? [];


  const hidden =
    context[
      hiddenKey
    ] ?? [];


  const result = [];

  const seen =
    new Set();


  primary.forEach(
    item => {

      let text = "";


      if (
        item.layer === "stem"
      ) {

        text =
          `${getPillarShortLabel(
            item.pillarKey
          )}간 ${item.symbol} ${item.tenGod}`;

      }


      if (
        item.layer === "branch"
      ) {

        text =
          `${getPillarShortLabel(
            item.pillarKey
          )}지 ${item.symbol} 본기 ` +
          `${item.hiddenStem} ${item.tenGod}`;

      }


      const key =
        [
          item.pillarKey,
          item.layer,
          item.symbol,
          item.tenGod
        ].join("-");


      if (
        text &&
        !seen.has(
          key
        )
      ) {

        seen.add(
          key
        );


        result.push({

          pillarKey:
            item.pillarKey,

          layer:
            item.layer,

          source:
            "primary",

          tenGod:
            item.tenGod,

          stem:
            item.hiddenStem ??
            item.symbol,

          branch:
            item.layer === "branch"
              ? item.symbol
              : "",

          text

        });

      }

    }
  );


  hidden.forEach(
    item => {

      const duplicatedMain =
        primary.some(
          primaryItem =>

            primaryItem.pillarKey ===
              item.pillarKey

            &&

            primaryItem.layer ===
              "branch"

            &&

            primaryItem.hiddenStem ===
              item.stem

            &&

            primaryItem.tenGod ===
              item.tenGod
        );


      if (
        duplicatedMain
      ) {

        return;

      }


      const key =
        [
          item.pillarKey,
          item.branch,
          item.stem,
          item.tenGod
        ].join("-");


      if (
        seen.has(
          key
        )
      ) {

        return;

      }


      seen.add(
        key
      );


      result.push({

        pillarKey:
          item.pillarKey,

        layer:
          "hidden",

        source:
          "hidden",

        tenGod:
          item.tenGod,

        stem:
          item.stem,

        branch:
          item.branch,

        text:
          `${getPillarShortLabel(
            item.pillarKey
          )}지 ${item.branch} 지장간 ` +
          `${item.stem} ${item.tenGod}`

      });

    }
  );


  const order = {

    day:
      0,

    month:
      1,

    hour:
      2,

    year:
      3

  };


  result.sort(
    (
      a,
      b
    ) =>
      (
        order[
          a.pillarKey
        ] ?? 9
      )
      -
      (
        order[
          b.pillarKey
        ] ?? 9
      )
  );


  return result;

}


/* =========================================
   가족성 Profile
========================================= */

function buildFamilyProfile(
  context,
  type
) {

  const isSpouse =
    type === "spouse";


  const primaryKey =
    isSpouse

      ? "spousePrimary"

      : "childPrimary";


  const hiddenKey =
    isSpouse

      ? "spouseHidden"

      : "childHidden";


  const placements =
    collectFamilyPlacements(

      context,

      primaryKey,

      hiddenKey

    );


  const visible =
    placements.filter(
      item =>
        item.source === "primary"
    );


  const hidden =
    placements.filter(
      item =>
        item.source === "hidden"
    );


  const pillarCount =
    new Set(
      placements.map(
        item =>
          item.pillarKey
      )
    ).size;


  let state =
    "원국 미표출";


  if (
    visible.length &&
    hidden.length
  ) {

    state =
      "표출 + 잠복";

  }

  else if (
    visible.length
  ) {

    state =
      "표출형";

  }

  else if (
    hidden.length
  ) {

    state =
      "잠복형";

  }


  if (
    pillarCount >= 2 &&
    state !== "원국 미표출"
  ) {

    state +=
      ` · ${pillarCount}곳 반복`;

  }


  return {

    placements,

    visible,

    hidden,

    pillarCount,

    state,

    stars:
      unique(
        placements.map(
          item =>
            `${item.stem} ${item.tenGod}`
        )
      ),

    gods:
      unique(
        placements.map(
          item =>
            item.tenGod
        )
      )

  };

}


/* =========================================
   배우자성
========================================= */

export function buildSpouseStarSummary(
  context
) {

  if (!context) {

    return "";

  }


  const profile =
    buildFamilyProfile(
      context,
      "spouse"
    );


  const spouseGodLabel =

    context.gender === "male"

      ? "정재 · 편재"

      : "정관 · 편관";


  return [
    `${
      context.genderLabel ?? ""
    } 배우자성: ${spouseGodLabel}`,
    `현재: ${
      profile.stars.join(" · ")
      ||
      "원국 미표출"
    }`,
    `위치: ${
      profile.placements
        .map(
          item =>
            item.text
        )
        .join(" · ")
      ||
      "—"
    }`,
    `상태: ${profile.state}`
  ].join(" / ");

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

    return "추진력이 있고 자기주장이 분명한 사람과 인연이 닿기 쉽습니다.";

  }


  if (
    gods.includes(
      "정관"
    )
  ) {

    return "책임감이 있고 약속을 잘 지키는 사람과 인연이 닿기 쉽습니다.";

  }


  if (
    gods.includes(
      "편재"
    )
  ) {

    return "활동적이고 현실감각과 사회성이 좋은 사람과 인연이 닿기 쉽습니다.";

  }


  if (
    gods.includes(
      "정재"
    )
  ) {

    return "성실하고 생활이 안정적인 사람과 인연이 닿기 쉽습니다.";

  }


  return "배우자 성향은 대운·세운에서 들어오는 배우자성까지 함께 확인합니다.";

}


/* =========================================
   애정 · 이성운

   ★ 현재 클릭 십성의 일반 연애문장 제거
   ★ 실제 배우자성 우선
========================================= */

export function buildGenderLoveReading(
  context
) {

  if (!context) {

    return "";

  }


  const profile =
    buildFamilyProfile(
      context,
      "spouse"
    );


  const spouseLabel =

    context.gender === "male"

      ? "정재 · 편재"

      : "정관 · 편관";


  let loveResult = "";


  if (
    !profile.placements.length
  ) {

    loveResult =
      "원국에서 배우자성이 뚜렷하게 보이지 않습니다. 이성운은 대운·세운에서 배우자성이 들어오는 시기를 함께 확인합니다.";

  }

  else if (
    context.gender === "female"
  ) {

    if (
      profile.visible.length
    ) {

      loveResult =
        "이성·연애 문제가 원국에서 비교적 직접적으로 드러나는 편입니다.";

    }

    else {

      loveResult =
        "자주 마주치며 관계가 깊어지는 연애가 잘 맞습니다.";

    }

  }

  else {

    if (
      profile.visible.length
    ) {

      loveResult =
        "이성 인연이 비교적 직접적으로 나타나는 편입니다. 사회활동이 넓어질수록 연애 기회도 함께 늘기 쉽습니다.";

    }

    else {

      loveResult =
        "처음부터 선명한 인연보다 실제 교류가 쌓이면서 관계가 깊어지는 편입니다.";

    }

  }


  return `

    <strong>배우자성</strong>
    ${spouseLabel}

    <br>

    <strong>현재 배우자성</strong>
    ${
      profile.stars.join(" · ")
      ||
      "원국 미표출"
    }

    <br>

    <strong>위치</strong>
    ${
      profile.placements
        .map(
          item =>
            item.text
        )
        .join(" · ")
      ||
      "—"
    }

    <br>

    <strong>상태</strong>
    ${profile.state}

    <br><br>

    <strong>이성운</strong>
    ${loveResult}

    <br>

    <strong>배우자 성향</strong>
    ${getSpouseTrait(
      profile.gods
    )}

  `;

}


/* =========================================
   결혼 · 배우자운
========================================= */

export function buildMarriageReading(
  context
) {

  if (!context) {

    return "";

  }


  const profile =
    buildFamilyProfile(
      context,
      "spouse"
    );


  if (
    !profile.placements.length
  ) {

    return `

      <strong>결혼 유형</strong>
      운 흐름 확인형

      <br>

      <strong>배우자성 상태</strong>
      원국 미표출

      <br><br>

      <strong>결혼운</strong>
      원국만으로 결혼운이 없다고 판단하지 않습니다.

      <br>

      <strong>중요 포인트</strong>
      대운·세운에서 배우자성이 들어오는 시기를 확인합니다.

    `;

  }


  let marriageType = "";

  let marriageResult = "";

  let important = "";


  if (
    context.gender === "female"
  ) {

    if (
      profile.visible.length
    ) {

      marriageType =
        "안정·책임형";

      marriageResult =
        "배우자 문제가 원국에서 비교적 직접적으로 드러나는 편입니다.";

    }

    else {

      marriageType =
        "신중·확인형";

      marriageResult =
        "빠르게 결혼을 결정하기보다 상대를 충분히 경험한 뒤 결혼으로 이어지는 쪽이 잘 맞습니다.";

    }


    important =
      "대운·세운에서 관성이 강하게 드러날 때 연애·결혼 문제가 더 구체화될 가능성을 봅니다.";

  }

  else {

    if (
      profile.visible.length
    ) {

      marriageType =
        profile.gods.includes(
          "편재"
        )

          ? "현실·생활형"

          : "안정·생활형";


      marriageResult =
        "배우자 문제가 원국에서 비교적 직접적으로 드러나는 편입니다.";

    }

    else {

      marriageType =
        "신중·확인형";

      marriageResult =
        "교류가 충분히 쌓인 뒤 결혼을 결정하는 흐름이 더 자연스럽습니다.";

    }


    important =
      "배우자성이 반복되는 경우 연애와 사회생활이 서로 영향을 주기 쉽습니다.";

  }


  return `

    <strong>결혼 유형</strong>
    ${marriageType}

    <br>

    <strong>배우자성 상태</strong>
    ${profile.state}

    <br><br>

    <strong>결혼운</strong>
    ${marriageResult}

    <br>

    <strong>중요 포인트</strong>
    ${important}

  `;

}


/* =========================================
   자녀운
========================================= */

export function buildChildReading(
  context
) {

  if (!context) {

    return "";

  }


  const profile =
    buildFamilyProfile(
      context,
      "child"
    );


  const childLabel =

    context.gender === "male"

      ? "정관 · 편관"

      : "식신 · 상관";


  if (
    !profile.placements.length
  ) {

    return `

      <strong>자녀성</strong>
      ${childLabel}

      <br>

      <strong>현재 자녀성</strong>
      원국 미표출

      <br>

      <strong>상태</strong>
      대운·세운 확인 필요

      <br><br>

      자녀운이 없다는 뜻은 아니며
      시주와 운의 흐름을 함께 확인합니다.

    `;

  }


  const hourExists =
    profile.placements.some(
      item =>
        item.pillarKey === "hour"
    );


  let result = "";


  if (
    hourExists
  ) {

    result =
      "자녀 자리인 시주에도 자녀성이 있어 자녀 문제가 삶에서 비교적 직접적으로 드러나는 편입니다.";

  }

  else if (
    profile.visible.length
  ) {

    result =
      "자녀성이 원국에 직접 드러나 있어 자녀와 관련된 관심과 책임이 비교적 분명한 편입니다.";

  }

  else {

    result =
      "자녀성이 지장간에 있어 실제 생활에서 관계와 책임이 구체화되는 형태로 봅니다.";

  }


  return `

    <strong>자녀성</strong>
    ${childLabel}

    <br>

    <strong>현재 자녀성</strong>
    ${profile.stars.join(" · ")}

    <br>

    <strong>위치</strong>
    ${profile.placements
      .map(
        item =>
          item.text
      )
      .join(" · ")}

    <br>

    <strong>상태</strong>
    ${profile.state}

    <br><br>

    ${result}

  `;

}


/* =========================================
   건강운
========================================= */

export function buildHealthReading({

  element,

  count = 1

}) {

  const rule =
    HEALTH_ELEMENT_RULES[
      element
    ];


  if (!rule) {

    return "현재 항목만으로 특정 건강 부위를 연결하기 어렵습니다.";

  }


  const repeat =

    count >= 2

      ? "같은 오행이 반복되므로 이 영역을 평소 관리 포인트로 두는 편이 좋습니다."

      : "";


  return `

    <strong>체크 부위</strong>
    ${rule.parts}

    <br>

    <strong>생활 관리</strong>
    ${rule.care}

    ${
      repeat
        ? `<br><strong>반복 영향</strong> ${repeat}`
        : ""
    }

    <br><br>

    <small>
      ※ 전통 오행 참고 해석이며 실제 증상은 의료진의 진료와 검사를 우선합니다.
    </small>

  `;

}


/* =========================================
   지장간 구성
========================================= */

function buildHiddenMix(
  data
) {

  if (
    data.type !== "hidden"
  ) {

    return "";

  }


  const main =
    data.hiddenStems
      ?.find(
        item =>
          item.isMain
      );


  const others =
    data.hiddenStems
      ?.filter(
        item =>
          !item.isMain
      );


  if (!main) {

    return "";

  }


  if (
    !others?.length
  ) {

    return `${main.stem} ${main.tenGod}이 지장간의 중심입니다.`;

  }


  return `지장간 중심은 ${main.stem} ${main.tenGod}, 내부에는 ${others
    .map(
      item =>
        `${item.stem} ${item.tenGod}`
    )
    .join(" · ")}이 함께 있습니다.`;

}


/* =========================================
   Focus
========================================= */

function getFocusText(
  rule,
  secondaryRule
) {

  const focus =
    unique([
      ...(
        rule?.focus ?? []
      ),
      ...(
        secondaryRule?.focus ?? []
      )
    ])
      .slice(
        0,
        3
      );


  return focus.length

    ? focus.join(" · ")

    : "직업운 · 재물운";

}


/* =========================================
   12운성
========================================= */

function buildStageReading(
  data,
  context,
  tenGod,
  element
) {

  const rule =
    STAGE_RULES[
      data.name
    ];


  if (!rule) {

    return null;

  }


  const pillarLabel =
    PILLAR_LABELS[
      data.pillarKey
    ];


  return {

    category:
      "TWELVE STAGES",

    symbol:
      data.name,

    title:
      `${data.name} · ${pillarLabel}`,

    keyword:
      getFocusText(
        rule
      ),

    meta: [

      {
        label:
          "위치",

        value:
          pillarLabel
      },

      {
        label:
          "12운성",

        value:
          data.name
      },

      {
        label:
          "성별",

        value:
          context?.genderLabel ?? "—"
      }

    ],

    summary:
      `${getFocusText(rule)}이 먼저 눈에 띕니다. ${rule.career}`,

    sections: [

      {
        title:
          "성장 배경",

        text:
          rule.growth
      },

      {
        title:
          "학업 · 합격운",

        text:
          rule.exam
      },

      {
        title:
          "취업 · 직업운",

        text:
          rule.career
      },

      {
        title:
          "명예 · 승진운",

        text:
          rule.honor
      },

      {
        title:
          "재물운",

        text:
          buildWealthSectionHtml({

            tenGod,

            positions: [
              data.pillarKey
            ],

            count: 1

          })
      },

      {
        title:
          "애정 · 이성운",

        text:
          buildGenderLoveReading(
            context
          )
      },

      {
        title:
          "결혼 · 배우자운",

        text:
          buildMarriageReading(
            context
          )
      },

      {
        title:
          "자녀운",

        text:
          buildChildReading(
            context
          )
      },

      {
        title:
          "건강운",

        text:
          buildHealthReading({

            element,

            count: 1

          })
      }

    ]

  };

}


/* =========================================
   12신살
========================================= */

function buildSinsalReading(
  data,
  context,
  tenGod,
  element
) {

  const rule =
    SINSAL_RULES[
      data.name
    ];


  if (!rule) {

    return null;

  }


  const pillarLabel =
    PILLAR_LABELS[
      data.pillarKey
    ];


  return {

    category:
      "TWELVE SINSAL",

    symbol:
      data.name,

    title:
      `${data.name} · ${pillarLabel}`,

    keyword:
      getFocusText(
        rule
      ),

    meta: [

      {
        label:
          "위치",

        value:
          pillarLabel
      },

      {
        label:
          "12신살",

        value:
          data.name
      },

      {
        label:
          "성별",

        value:
          context?.genderLabel ?? "—"
      }

    ],

    summary:
      `${getFocusText(rule)}을 중심으로 봅니다. ${rule.career}`,

    sections: [

      {
        title:
          "학업 · 합격운",

        text:
          rule.exam
      },

      {
        title:
          "취업 · 직업운",

        text:
          rule.career
      },

      {
        title:
          "명예 · 승진운",

        text:
          rule.honor
      },

      {
        title:
          "재물운",

        text:
          buildWealthSectionHtml({

            tenGod,

            positions: [
              data.pillarKey
            ],

            count: 1

          })
      },

      {
        title:
          "애정 · 이성운",

        text:
          buildGenderLoveReading(
            context
          )
      },

      {
        title:
          "결혼 · 배우자운",

        text:
          buildMarriageReading(
            context
          )
      },

      {
        title:
          "자녀운",

        text:
          buildChildReading(
            context
          )
      },

      {
        title:
          "건강운",

        text:
          buildHealthReading({

            element,

            count: 1

          })
      }

    ]

  };

}


/* =========================================
   공망
========================================= */

function buildGongmangReading(
  data,
  context,
  tenGod,
  element
) {

  const rule =
    GONGMANG_RULES[
      data.pillarKey
    ];


  if (!rule) {

    return null;

  }


  const pillarLabel =
    PILLAR_LABELS[
      data.pillarKey
    ];


  return {

    category:
      "GONGMANG",

    symbol:
      "空亡",

    title:
      `${pillarLabel} ${data.value} · 공망`,

    keyword:
      getFocusText(
        rule
      ),

    meta: [

      {
        label:
          "위치",

        value:
          pillarLabel
      },

      {
        label:
          "공망",

        value:
          data.value
      },

      {
        label:
          "성별",

        value:
          context?.genderLabel ?? "—"
      }

    ],

    summary:
      `${getFocusText(rule)}에서 일반적인 흐름과 다른 선택이 나타날 수 있습니다.`,

    sections: [

      {
        title:
          "성장 배경",

        text:
          rule.growth
      },

      {
        title:
          "학업 · 합격운",

        text:
          rule.exam
      },

      {
        title:
          "취업 · 직업운",

        text:
          rule.career
      },

      {
        title:
          "명예 · 승진운",

        text:
          rule.honor
      },

      {
        title:
          "재물운",

        text:
          buildWealthSectionHtml({

            tenGod,

            positions: [
              data.pillarKey
            ],

            count: 1

          })
      },

      {
        title:
          "애정 · 이성운",

        text:
          buildGenderLoveReading(
            context
          )
      },

      {
        title:
          "결혼 · 배우자운",

        text:
          buildMarriageReading(
            context
          )
      },

      {
        title:
          "자녀운",

        text:
          buildChildReading(
            context
          )
      },

      {
        title:
          "건강운",

        text:
          buildHealthReading({

            element,

            count: 1

          })
      }

    ]

  };

}


/* =========================================
   일반
========================================= */

function buildNormalReading(
  data,
  context,
  tenGod,
  element
) {

  const pillarLabel =
    PILLAR_LABELS[
      data.pillarKey
    ];


  const tenGodRule =
    TEN_GOD_RULES[
      tenGod
    ]
    ??
    TEN_GOD_RULES.일원;


  const symbolRule =
    getSymbolRule(
      data
    );


  const hiddenMix =
    buildHiddenMix(
      data
    );


  let category =
    "TEN GOD";


  let symbol =
    tenGod;


  let title =
    `${tenGod} · ${pillarLabel}`;


  if (
    data.type === "stem"
  ) {

    category =
      "HEAVENLY STEM";

    symbol =
      data.value;

    title =
      `${data.korean} · ${pillarLabel}`;

  }


  if (
    data.type === "branch"
  ) {

    category =
      "EARTHLY BRANCH";

    symbol =
      data.value;

    title =
      `${data.korean} · ${pillarLabel}`;

  }


  if (
    data.type === "hidden"
  ) {

    category =
      "HIDDEN STEMS";

    symbol =
      data.branch;

    title =
      `${pillarLabel} 지장간`;

  }


  return {

    category,

    symbol,

    title,

    keyword:
      joinText(

        getFocusText(
          tenGodRule,
          symbolRule
        ),

        element
          ? ELEMENT_LABELS[
              element
            ]
          : ""

      ),

    meta: [

      {
        label:
          "위치",

        value:
          pillarLabel
      },

      {
        label:
          "십성",

        value:
          tenGod || "—"
      },

      {
        label:
          "성별",

        value:
          context?.genderLabel ?? "—"
      }

    ],

    summary:
      `${getFocusText(
        tenGodRule,
        symbolRule
      )}이 먼저 눈에 띕니다. ${joinText(
        symbolRule?.career,
        tenGodRule.career
      )}`,

    sections: [

      {
        title:
          "성장 배경",

        text:
          joinText(

            tenGodRule.growth,

            hiddenMix

          )
      },

      {
        title:
          "학업 · 합격운",

        text:
          joinText(

            symbolRule?.exam,

            tenGodRule.exam

          )
      },

      {
        title:
          "취업 · 직업운",

        text:
          joinText(

            symbolRule?.career,

            tenGodRule.career

          )
      },

      {
        title:
          "명예 · 승진운",

        text:
          tenGodRule.honor
      },

      {
        title:
          "재물운",

        text:
          buildWealthSectionHtml({

            tenGod,

            positions: [
              data.pillarKey
            ],

            count: 1

          })
      },

      /*
        ★ 기존 tenGodRule.love 제거
        배우자성 실제 위치만 사용
      */
      {
        title:
          "애정 · 이성운",

        text:
          buildGenderLoveReading(
            context
          )
      },

      {
        title:
          "결혼 · 배우자운",

        text:
          buildMarriageReading(
            context
          )
      },

      /*
        ★ 기존 tenGodRule.children 제거
        실제 자녀성만 사용
      */
      {
        title:
          "자녀운",

        text:
          buildChildReading(
            context
          )
      },

      {
        title:
          "건강운",

        text:
          buildHealthReading({

            element,

            count: 1

          })
      }

    ],

    hiddenStems:

      data.type === "hidden"

        ? data.hiddenStems

        : null

  };

}


/* =========================================
   외부
========================================= */

export function buildDirectReading(
  data
) {

  const context =
    data.chartContext;


  const tenGod =
    getCurrentTenGod(
      data
    );


  const element =
    getCurrentElement(
      data
    );


  if (
    data.type === "stage"
  ) {

    return buildStageReading(

      data,

      context,

      tenGod,

      element

    );

  }


  if (
    data.type === "twelveSinsal"
  ) {

    return buildSinsalReading(

      data,

      context,

      tenGod,

      element

    );

  }


  if (
    data.type === "gongmang"
  ) {

    return buildGongmangReading(

      data,

      context,

      tenGod,

      element

    );

  }


  return buildNormalReading(

    data,

    context,

    tenGod,

    element

  );

}