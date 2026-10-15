import {
  EDUCATION_LABELS,
  analyzeEducationDomains
} from "./educationFortune.js";

import { STEMS } from "../data/stems.js";
import { BRANCHES } from "../data/branches.js";
import { calculateTenGod } from "./tenGods.js";
import { getTwelveStage } from "./twelveStages.js";

/*
 * 월운 계산 기준
 * - 월 경계: 절입
 * - 寅월: 입춘 시작
 * - 월간: 오호둔
 * - 지지 십성: 지지 본기 기준
 * - 원국 + 대운 + 세운 + 월운 종합
 */

const STEM_ORDER = [
  "甲", "乙", "丙", "丁", "戊",
  "己", "庚", "辛", "壬", "癸"
];

const MONTH_BRANCHES = [
  "寅", "卯", "辰", "巳", "午", "未",
  "申", "酉", "戌", "亥", "子", "丑"
];

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

/* 오호둔: 년간으로 寅월 천간 계산 */

const TIGER_MONTH_START_STEM = {
  甲: "丙",
  己: "丙",
  乙: "戊",
  庚: "戊",
  丙: "庚",
  辛: "庚",
  丁: "壬",
  壬: "壬",
  戊: "甲",
  癸: "甲"
};

/* 12절입 */

const MONTH_TERMS = [
  {
    name: "입춘",
    branch: "寅",
    longitude: 315,
    month: 2,
    day: 4,
    yearOffset: 0
  },
  {
    name: "경칩",
    branch: "卯",
    longitude: 345,
    month: 3,
    day: 6,
    yearOffset: 0
  },
  {
    name: "청명",
    branch: "辰",
    longitude: 15,
    month: 4,
    day: 5,
    yearOffset: 0
  },
  {
    name: "입하",
    branch: "巳",
    longitude: 45,
    month: 5,
    day: 6,
    yearOffset: 0
  },
  {
    name: "망종",
    branch: "午",
    longitude: 75,
    month: 6,
    day: 6,
    yearOffset: 0
  },
  {
    name: "소서",
    branch: "未",
    longitude: 105,
    month: 7,
    day: 7,
    yearOffset: 0
  },
  {
    name: "입추",
    branch: "申",
    longitude: 135,
    month: 8,
    day: 8,
    yearOffset: 0
  },
  {
    name: "백로",
    branch: "酉",
    longitude: 165,
    month: 9,
    day: 8,
    yearOffset: 0
  },
  {
    name: "한로",
    branch: "戌",
    longitude: 195,
    month: 10,
    day: 8,
    yearOffset: 0
  },
  {
    name: "입동",
    branch: "亥",
    longitude: 225,
    month: 11,
    day: 7,
    yearOffset: 0
  },
  {
    name: "대설",
    branch: "子",
    longitude: 255,
    month: 12,
    day: 7,
    yearOffset: 0
  },
  {
    name: "소한",
    branch: "丑",
    longitude: 285,
    month: 1,
    day: 6,
    yearOffset: 1
  }
];

const STEM_COMBINE = [
  ["甲", "己"],
  ["乙", "庚"],
  ["丙", "辛"],
  ["丁", "壬"],
  ["戊", "癸"]
];

const STEM_CLASH = [
  ["甲", "庚"],
  ["乙", "辛"],
  ["丙", "壬"],
  ["丁", "癸"]
];

const BRANCH_COMBINE = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"]
];

const BRANCH_CLASH = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"]
];

/* 기본 도움 함수 */

function mod(value, length) {
  return ((value % length) + length) % length;
}

function hasPair(first, second, pairs) {
  return pairs.some(
    ([a, b]) =>
      (first === a && second === b) ||
      (first === b && second === a)
  );
}

/* 기둥 정규화 */

function normalizePillar(pillar) {
  if (!pillar) {
    return null;
  }

  if (typeof pillar === "string") {
    const chars = Array.from(pillar);

    if (!chars[0] || !chars[1]) {
      return null;
    }

    return {
      stem: chars[0],
      branch: chars[1],
      hanja: `${chars[0]}${chars[1]}`
    };
  }

  const hanja = String(
    pillar.hanja ??
    pillar.ganji ??
    pillar.value ??
    ""
  );

  const chars = Array.from(hanja);
  const stem = pillar.stem ?? chars[0];
  const branch = pillar.branch ?? chars[1];

  if (!stem || !branch) {
    return null;
  }

  return {
    stem,
    branch,
    hanja: `${stem}${branch}`
  };
}

function normalizePillars(pillars) {
  return {
    year: normalizePillar(pillars?.year),
    month: normalizePillar(pillars?.month),
    day: normalizePillar(pillars?.day),
    hour: normalizePillar(pillars?.hour)
  };
}

/* 태양 황경 */

function normalizeDegree(value) {
  return mod(value, 360);
}

function toRadians(degree) {
  return degree * Math.PI / 180;
}

function getSolarLongitude(date) {
  const julianDay =
    date.getTime() / 86400000 + 2440587.5;

  const T =
    (julianDay - 2451545.0) / 36525;

  const L0 = normalizeDegree(
    280.46646 +
    36000.76983 * T +
    0.0003032 * T * T
  );

  const M = normalizeDegree(
    357.52911 +
    35999.05029 * T -
    0.0001537 * T * T
  );

  const Mr = toRadians(M);

  const C =
    (
      1.914602 -
      0.004817 * T -
      0.000014 * T * T
    ) * Math.sin(Mr) +
    (
      0.019993 -
      0.000101 * T
    ) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);

  const omega =
    125.04 - 1934.136 * T;

  return normalizeDegree(
    L0 +
    C -
    0.00569 -
    0.00478 * Math.sin(toRadians(omega))
  );
}

function longitudeDifference(longitude, target) {
  return ((longitude - target + 540) % 360) - 180;
}

/* 절입 순간 계산 */

function calculateSolarTermMoment({
  year,
  month,
  day,
  longitude
}) {
  const center = new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00:00+09:00`
  );

  let previous = new Date(
    center.getTime() - 4 * 86400000
  );

  let previousDifference = longitudeDifference(
    getSolarLongitude(previous),
    longitude
  );

  for (let hour = 1; hour <= 192; hour += 1) {
    const current = new Date(
      previous.getTime() + 3600000
    );

    const currentDifference = longitudeDifference(
      getSolarLongitude(current),
      longitude
    );

    if (
      previousDifference <= 0 &&
      currentDifference >= 0
    ) {
      let low = previous.getTime();
      let high = current.getTime();

      for (let i = 0; i < 35; i += 1) {
        const middle = (low + high) / 2;

        const difference = longitudeDifference(
          getSolarLongitude(new Date(middle)),
          longitude
        );

        if (difference < 0) {
          low = middle;
        } else {
          high = middle;
        }
      }

      return new Date((low + high) / 2);
    }

    previous = current;
    previousDifference = currentDifference;
  }

  return center;
}

function getTermMoment(annualYear, term) {
  return calculateSolarTermMoment({
    year: annualYear + term.yearOffset,
    month: term.month,
    day: term.day,
    longitude: term.longitude
  });
}

function getNextTermMoment(annualYear, index) {
  if (index < MONTH_TERMS.length - 1) {
    return getTermMoment(
      annualYear,
      MONTH_TERMS[index + 1]
    );
  }

  return calculateSolarTermMoment({
    year: annualYear + 1,
    month: 2,
    day: 4,
    longitude: 315
  });
}

/* 월간 */

function getMonthStem(yearStem, monthIndex) {
  const startStem =
    TIGER_MONTH_START_STEM[yearStem];

  if (!startStem) {
    return "";
  }

  const startIndex =
    STEM_ORDER.indexOf(startStem);

  if (startIndex < 0) {
    return "";
  }

  return STEM_ORDER[
    mod(startIndex + monthIndex, 10)
  ];
}

/* 화면용 날짜 */

function formatKoreanDate(date) {
  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      timeZone: "Asia/Seoul",
      month: "numeric",
      day: "numeric"
    }
  ).format(date);
}

function getCivilMonth(date) {
  return Number(
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Asia/Seoul",
        month: "numeric"
      }
    ).format(date)
  );
}

/* 합·충 관계 */

function collectRelation(
  sourceStem,
  sourceBranch,
  targetPillar,
  targetLabel
) {
  if (!targetPillar) {
    return [];
  }

  const result = [];

  if (
    hasPair(
      sourceStem,
      targetPillar.stem,
      STEM_COMBINE
    )
  ) {
    result.push({
      scope: targetLabel,
      layer: "stem",
      type: "합",
      text: `${targetLabel} 천간 ${targetPillar.stem}와 합`
    });
  }

  if (
    hasPair(
      sourceStem,
      targetPillar.stem,
      STEM_CLASH
    )
  ) {
    result.push({
      scope: targetLabel,
      layer: "stem",
      type: "충",
      text: `${targetLabel} 천간 ${targetPillar.stem}와 충`
    });
  }

  if (
    hasPair(
      sourceBranch,
      targetPillar.branch,
      BRANCH_COMBINE
    )
  ) {
    result.push({
      scope: targetLabel,
      layer: "branch",
      type: "육합",
      text: `${targetLabel} 지지 ${targetPillar.branch}와 육합`
    });
  }

  if (
    hasPair(
      sourceBranch,
      targetPillar.branch,
      BRANCH_CLASH
    )
  ) {
    result.push({
      scope: targetLabel,
      layer: "branch",
      type: "충",
      text: `${targetLabel} 지지 ${targetPillar.branch}와 충`
    });
  }

  return result;
}

export function getNatalRelations(stem, branch, pillars) {
  const positions = [
    ["년주", pillars.year],
    ["월주", pillars.month],
    ["일주", pillars.day],
    ["시주", pillars.hour]
  ];

  return positions.flatMap(
    ([label, pillar]) =>
      collectRelation(
        stem,
        branch,
        pillar,
        label
      )
  );
}

export function getLayerRelations(
  stem,
  branch,
  pillar,
  label
) {
  if (!pillar) {
    return [];
  }

  return collectRelation(
    stem,
    branch,
    {
      stem: pillar.stem,
      branch: pillar.branch,
      hanja:
        pillar.ganji ??
        `${pillar.stem}${pillar.branch}`
    },
    label
  );
}

/* 세운 선택 */

function getSelectedAnnual(annualResult, annualYear) {
  if (!annualResult?.years?.length) {
    return null;
  }

  return (
    annualResult.years.find(
      item => item.year === annualYear
    ) ??
    annualResult.years.find(
      item => item.isCurrent
    ) ??
    annualResult.years[0]
  );
}

/* 월운 한 항목 생성 */

function buildMonthlyItem({
  annualYear,
  annual,
  monthIndex,
  pillars,
  now
}) {
  const term = MONTH_TERMS[monthIndex];
  const branch = MONTH_BRANCHES[monthIndex];

  const stem = getMonthStem(
    annual.stem,
    monthIndex
  );

  const startMoment = getTermMoment(
    annualYear,
    term
  );

  const endMoment = getNextTermMoment(
    annualYear,
    monthIndex
  );

  const branchMainStem =
    BRANCH_MAIN_STEM[branch] ?? "";

  return {
    index: monthIndex + 1,
    annualYear,
    civilMonth: getCivilMonth(startMoment),
    monthName: `${branch}월`,
    termName: term.name,
    ganji: `${stem}${branch}`,
    stem,
    branch,

    stemKorean:
      STEMS[stem]?.korean ?? "",

    branchKorean:
      BRANCHES[branch]?.korean ?? "",

    stemElement:
      STEMS[stem]?.element ?? "",

    branchElement:
      BRANCHES[branch]?.element ?? "",

    stemTenGod:
      calculateTenGod(
        pillars.day.stem,
        stem
      ),

    branchMainStem,

    branchTenGod:
      branchMainStem
        ? calculateTenGod(
            pillars.day.stem,
            branchMainStem
          )
        : "",

    twelveStage:
      getTwelveStage(
        pillars.day.stem,
        branch
      ),

    startMoment,
    endMoment,

    periodLabel:
      `${formatKoreanDate(startMoment)} ~ ${formatKoreanDate(endMoment)}`,

    isCurrent:
      now >= startMoment &&
      now < endMoment,

    annual: {
      year: annual.year,
      ganji: annual.ganji,
      stem: annual.stem,
      branch: annual.branch,
      stemTenGod: annual.stemTenGod,
      branchTenGod: annual.branchTenGod
    },

    daeun:
      annual.daeun
        ? { ...annual.daeun }
        : null,

    natalRelations:
      getNatalRelations(
        stem,
        branch,
        pillars
      ),

    annualRelations:
      getLayerRelations(
        stem,
        branch,
        annual,
        "세운"
      ),

    daeunRelations:
      getLayerRelations(
        stem,
        branch,
        annual.daeun,
        "대운"
      )
  };
}

/* 생활 영역 판정 */

const TEN_GOD_ROLE = {
  비견: "peer",
  겁재: "peer",
  식신: "output",
  상관: "output",
  편재: "wealth",
  정재: "wealth",
  편관: "authority",
  정관: "authority",
  편인: "resource",
  정인: "resource"
};

const DOMAIN_LABELS = {
  ...EDUCATION_LABELS,
  career: "직업 · 취업",
  wealth: "재물",
  relationship: "연애 · 관계",
  health: "건강 · 생활"
};

const TEN_GOD_DOMAIN_WEIGHT = {
  비견: {
    career: 1.1, wealth: 0.2, relationship: 0.4, health: 0.7
  },
  겁재: {
    career: 0.7, wealth: -0.8, relationship: 0.2, health: 0.1
  },
  식신: {
    career: 1.0, wealth: 1.0, relationship: 0.7, health: 1.0
  },
  상관: {
    career: 0.8, wealth: 0.8, relationship: 0.2, health: 0.3
  },
  편재: {
    career: 1.0, wealth: 2.0, relationship: 1.2, health: 0.2
  },
  정재: {
    career: 0.9, wealth: 2.0, relationship: 1.3, health: 0.5
  },
  편관: {
    career: 1.5, wealth: 0.2, relationship: 1.0, health: -0.8
  },
  정관: {
    career: 1.8, wealth: 0.5, relationship: 1.2, health: -0.2
  },
  편인: {
    career: 1.0, wealth: 0.1, relationship: -0.2, health: 0.5
  },
  정인: {
    career: 1.2, wealth: 0.3, relationship: 0.4, health: 1.0
  }
};

function getRoleStatus(role, usefulGod) {
  if (!role || !usefulGod) {
    return "neutral";
  }

  if (usefulGod.yongsin?.role === role) {
    return "yongsin";
  }

  if (usefulGod.huisin?.role === role) {
    return "huisin";
  }

  if (usefulGod.gisin?.role === role) {
    return "gisin";
  }

  if (usefulGod.gusin?.role === role) {
    return "gusin";
  }

  return "neutral";
}

export function applyTenGodDomainScore(
  scores,
  tenGod,
  factor,
  usefulGod
) {
  const weights = TEN_GOD_DOMAIN_WEIGHT[tenGod];

  if (!weights) {
    return;
  }

  const role = TEN_GOD_ROLE[tenGod];
  const status = getRoleStatus(role, usefulGod);

  const adjustmentMap = {
    yongsin: 0.85,
    huisin: 0.40,
    neutral: 0,
    gusin: -0.35,
    gisin: -0.75
  };

  const adjustment = adjustmentMap[status] ?? 0;

  Object.keys(scores).forEach(key => {
    const base = Number(weights[key] ?? 0);

    scores[key] += base * factor;

    if (base !== 0) {
      scores[key] +=
        Math.abs(base) *
        factor *
        adjustment;
    }
  });
}

function relationSign(relation) {
  return relation?.type === "충" ? -1 : 1;
}

function applyNatalRelationDomainScore(
  scores,
  relations
) {
  if (!Array.isArray(relations)) {
    return;
  }

  relations.forEach(relation => {
    const sign = relationSign(relation);

    switch (relation.scope) {
      case "월주":
        scores.career += 0.65 * sign;
        scores.wealth += 0.20 * sign;
        break;

      case "일주":
        scores.relationship += 0.80 * sign;
        scores.health += 0.15 * sign;
        break;

      case "년주":
        scores.career += 0.20 * sign;
        scores.relationship += 0.25 * sign;
        break;

      case "시주":
        scores.health += 0.20 * sign;
        scores.relationship += 0.15 * sign;
        break;
    }
  });
}

export function applyLayerRelationDomainScore(
  scores,
  relations,
  factor
) {
  if (!Array.isArray(relations)) {
    return;
  }

  relations.forEach(relation => {
    const sign = relationSign(relation);

    scores.career += 0.45 * factor * sign;
    scores.wealth += 0.28 * factor * sign;
    scores.relationship += 0.45 * factor * sign;
    scores.health += 0.20 * factor * sign;
  });
}

function applySpouseDomainScore(
  scores,
  month,
  gender
) {
  const spouseStars =
    gender === "male"
      ? ["정재", "편재"]
      : gender === "female"
        ? ["정관", "편관"]
        : [];

  if (!spouseStars.length) {
    return;
  }

  const checks = [
    [month.stemTenGod, 0.55],
    [month.branchTenGod, 0.45],
    [month.annual?.stemTenGod, 0.30],
    [month.annual?.branchTenGod, 0.25],
    [month.daeun?.stemTenGod, 0.18],
    [month.daeun?.branchTenGod, 0.15]
  ];

  checks.forEach(([tenGod, score]) => {
    if (spouseStars.includes(tenGod)) {
      scores.relationship += score;
    }
  });
}

/* 원국 + 대운 + 세운 + 월운 */

export function analyzeMonthlyDomains(
  month,
  usefulGod,
  gender
) {
  const scores = {
    career: 0,
    wealth: 0,
    relationship: 0,
    health: 0
  };

  applyTenGodDomainScore(
    scores,
    month.stemTenGod,
    1.00,
    usefulGod
  );

  applyTenGodDomainScore(
    scores,
    month.branchTenGod,
    0.85,
    usefulGod
  );

  applyTenGodDomainScore(
    scores,
    month.annual?.stemTenGod,
    0.65,
    usefulGod
  );

  applyTenGodDomainScore(
    scores,
    month.annual?.branchTenGod,
    0.55,
    usefulGod
  );

  applyTenGodDomainScore(
    scores,
    month.daeun?.stemTenGod,
    0.35,
    usefulGod
  );

  applyTenGodDomainScore(
    scores,
    month.daeun?.branchTenGod,
    0.30,
    usefulGod
  );

  applyNatalRelationDomainScore(
    scores,
    month.natalRelations
  );

  applyLayerRelationDomainScore(
    scores,
    month.annualRelations,
    0.80
  );

  applyLayerRelationDomainScore(
    scores,
    month.daeunRelations,
    0.60
  );

  applySpouseDomainScore(
    scores,
    month,
    gender
  );

  const education = analyzeEducationDomains(
    [
      {
        ...month,
        label: "월운",
        stemFactor: 1,
        branchFactor: 0.85
      },
      {
        ...month.annual,
        label: "세운",
        stemFactor: 0.65,
        branchFactor: 0.55
      },
      {
        ...month.daeun,
        label: "대운",
        stemFactor: 0.35,
        branchFactor: 0.30
      }
    ],
    usefulGod
  );

  Object.assign(scores, education.scores);

  const ranking = Object.entries(scores).sort(
    (first, second) => second[1] - first[1]
  );

  const strongest = ranking[0] ?? ["career", 0];

  let peakLabel = "이 달 가장 강한 운";

  if (strongest[1] < 0.5) {
    peakLabel =
      "이 달 상대적으로 힘이 실리는 영역";
  }

  return {
    scores,
    education,
    ranking,
    strongestKey: strongest[0],
    strongestScore: strongest[1],
    strongestLabel: DOMAIN_LABELS[strongest[0]],
    peakLabel
  };
}

/* 메인 계산 */

export function calculateMonthlyFortune({
  annualResult,
  annualYear = null,
  usefulGod = null,
  gender = "",
  now = new Date()
}) {
  if (
    !annualResult ||
    !Array.isArray(annualResult.years) ||
    !annualResult.years.length
  ) {
    throw new Error(
      "월운 계산에 세운 계산 결과가 필요합니다."
    );
  }

  const pillars = normalizePillars(
    annualResult.pillars
  );

  if (!pillars.day) {
    throw new Error(
      "월운 계산에 일주가 필요합니다."
    );
  }

  const targetYear =
    Number.isFinite(Number(annualYear))
      ? Number(annualYear)
      : Number(annualResult.currentAnnualYear);

  const annual = getSelectedAnnual(
    annualResult,
    targetYear
  );

  if (!annual) {
    throw new Error(
      "월운 계산에 사용할 세운을 찾을 수 없습니다."
    );
  }

  const months = MONTH_TERMS.map(
    (_, monthIndex) => {
      const month = buildMonthlyItem({
        annualYear: annual.year,
        annual,
        monthIndex,
        pillars,
        now
      });

      return {
        ...month,
        domainAnalysis: analyzeMonthlyDomains(
          month,
          usefulGod,
          gender
        )
      };
    }
  );

  let currentIndex = months.findIndex(
    month => month.isCurrent
  );

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  return {
    annualYear: annual.year,
    annual,
    daeun: annual.daeun ?? null,
    pillars,
    months,
    currentIndex,

    convention:
      "월운은 절입을 월 경계로 보고, 원국 + 대운 + 세운 + 월운을 함께 해석합니다.",

    note:
      "각 월운은 양력 1일 기준이 아니라 입춘·경칩·청명 등 절입부터 다음 절입 전까지의 흐름입니다."
  };
}