import {
  calculateAnnualFortune
} from "./annualFortune.js";

import {
  calculateMonthlyFortune,
  getNatalRelations,
  getLayerRelations,
  analyzeMonthlyDomains,
  applyTenGodDomainScore,
  applyLayerRelationDomainScore
} from "./monthlyFortune.js";

import {
  calculateTenGod
} from "./tenGods.js";

import {
  getMainHiddenStem
} from "./hiddenStems.js";

import { STEMS } from "../data/stems.js";
import { BRANCHES } from "../data/branches.js";

import {
  analyzeDailyExtraDomains
} from "../interpreters/dailyExtraDomains.js";

import {
  DAILY_ELEMENT_GUIDE
} from "../data/dailyFortuneGuide.js";

import {
  calculateDailyScores
} from "../interpreters/dailyScore.js";

export function koreaDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).formatToParts(now);

  const get = type =>
    parts.find(part => part.type === type).value;

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function dateMoment(
  date,
  now = new Date()
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("조회 날짜를 확인해주세요.");
  }

  const moment =
    new Date(`${date}T12:00:00+09:00`);

  if (
    !Number.isFinite(moment.getTime()) ||
    koreaDate(moment) !== date
  ) {
    throw new Error("올바른 날짜를 선택해주세요.");
  }

  return date === koreaDate(now)
    ? now
    : moment;
}

export function findActiveCycle(
  fortuneCycle,
  moment
) {
  const birth = fortuneCycle.birth;

  const born = new Date(
    `${birth.date}T${birth.time}:00+09:00`
  );

  if (moment < born) {
    throw new Error("출생 이후 날짜를 선택해주세요.");
  }

  const age =
    (moment - born) / (365.2422 * 86400000);

  return fortuneCycle.cycles.find(
    cycle =>
      age >= cycle.startAge &&
      age < cycle.endAge
  ) ?? null;
}

function buildDailyLifestyle({
  date,
  daily,
  month,
  annual,
  daeun,
  pillars,
  usefulGod
}) {
  const elements =
    Object.keys(DAILY_ELEMENT_GUIDE);

  const yongsin =
    usefulGod?.yongsin?.element;

  const huisin =
    usefulGod?.huisin?.element;

  const helpful = [
    yongsin,
    huisin
  ].filter(
    element => elements.includes(element)
  );

  const candidates = helpful.length
    ? [...new Set(helpful)]
    : elements;

  const influence = Object.fromEntries(
    elements.map(element => [element, 0])
  );

  if (influence[yongsin] !== undefined) {
    influence[yongsin] += 0.65;
  }

  if (influence[huisin] !== undefined) {
    influence[huisin] += 0.30;
  }

  const layers = [
    [daily, 1.0],
    [month, 0.4],
    [annual, 0.2],
    [daeun, 0.12]
  ];

  for (const [item, factor] of layers) {
    if (!item) continue;

    influence[STEMS[item.stem].element] +=
      factor;

    influence[BRANCHES[item.branch].element] +=
      factor * 0.8;
  }

  const ranked = candidates.sort(
    (a, b) => influence[b] - influence[a]
  );

  const element = ranked[0];

  const palette =
    DAILY_ELEMENT_GUIDE[element];

  const serial = Math.floor(
    new Date(
      `${date}T12:00:00+09:00`
    ).getTime() / 86400000
  );

  const index = (
    (serial % palette.colors.length) +
    palette.colors.length
  ) % palette.colors.length;

  const color = palette.colors[index];

  const secondElement = ranked[1];

  const secondary = secondElement
    ? DAILY_ELEMENT_GUIDE[secondElement].colors[index]
    : palette.colors[
        (index + 1) % palette.colors.length
      ];

  /*
    동 · 서 · 남 · 북만 표시합니다.
    토의 중앙 방위는 보조 오행으로 연결합니다.
  */

  const cardinalElement = preferred => [
    preferred,
    ...ranked,
    yongsin,
    huisin,
    ...elements.slice().sort(
      (a, b) => influence[b] - influence[a]
    )
  ].find(
    item => DAILY_ELEMENT_GUIDE[item]?.direction
  );

  const directionElement =
    cardinalElement(element);

  const resourceElement = {
    wood: "water",
    fire: "wood",
    earth: "fire",
    metal: "earth",
    water: "metal"
  }[STEMS[pillars.day.stem].element];

  const helperElement =
    cardinalElement(resourceElement);

  return {
    element,
    color,
    secondary,
    numbers: [...palette.numbers],

    colorReason:
      `${
        element === yongsin
          ? "용신"
          : element === huisin
            ? "희신"
            : "오늘"
      } 기운과 오늘의 오행을 조합한 컬러입니다.`,

    direction:
      DAILY_ELEMENT_GUIDE[directionElement].direction,

    directionHint:
      DAILY_ELEMENT_GUIDE[directionElement].directionHint,

    directionReason:
      element === "earth"
        ? "토는 중앙에 해당하므로 보조 기운의 방위를 적용했습니다."
        : "추천 오행에 연결되는 방위입니다.",

    helperDirection:
      DAILY_ELEMENT_GUIDE[helperElement].direction,

    helperHint:
      "조언을 구하거나 도움을 요청할 만남의 방향으로 참고해보세요.",

    helperReason:
      resourceElement === "earth"
        ? "인성의 토 기운은 중앙이므로 보조 오행의 방위를 적용했습니다."
        : "원국 일간을 생하는 인성 오행의 방위를 참고했습니다.",

    perfume: palette.perfume,
    perfumeNotes: palette.notes,
    perfumeHint: palette.perfumeHint
  };
}

/*
  오늘의 일진은 기존 만세력 엔진 결과를 사용합니다.
*/

export function calculateDailyFortune({
  date,
  dayGanji,
  pillars,
  fortuneCycle,
  usefulGod,
  gender,
  now = new Date()
}) {
  const moment = dateMoment(date, now);

  const daeun =
    findActiveCycle(fortuneCycle, moment);

  const year =
    Number(date.slice(0, 4));

  const annualResult = calculateAnnualFortune({
    pillars,
    fortuneCycle,
    startYear: year - 1,
    count: 3,
    now: moment
  });

  /*
    연중 대표 대운 대신 조회 시각의 대운을 사용합니다.
  */

  annualResult.years.forEach(item => {
    item.daeun = daeun;
  });

  const monthlyResult = calculateMonthlyFortune({
    annualResult,
    annualYear: annualResult.currentAnnualYear,
    usefulGod,
    gender,
    now: moment
  });

  const month = monthlyResult.months.find(
    item => item.isCurrent
  );

  if (!month) {
    throw new Error(
      "조회 날짜의 절입 월운을 찾을 수 없습니다."
    );
  }

  const normalized =
    monthlyResult.pillars;

  const [stem, branch] = [...dayGanji];

  if (!STEMS[stem] || !BRANCHES[branch]) {
    throw new Error(
      "일진 계산 결과를 확인해주세요."
    );
  }

  const daily = {
    ganji: dayGanji,
    stem,
    branch,

    stemTenGod: calculateTenGod(
      normalized.day.stem,
      stem
    ),

    branchTenGod: calculateTenGod(
      normalized.day.stem,
      getMainHiddenStem(branch)
    ),

    natalRelations: getNatalRelations(
      stem,
      branch,
      normalized
    ),

    annualRelations: getLayerRelations(
      stem,
      branch,
      month,
      "월운"
    ),

    daeunRelations: getLayerRelations(
      stem,
      branch,
      month.annual,
      "세운"
    ),

    annual: month,
    daeun: month.annual
  };

  /*
    기존 월운의 십성 · 용희신 · 관계 규칙을 공유합니다.
  */

  const analysis =
    analyzeMonthlyDomains(
      daily,
      usefulGod,
      gender
    );

  /* 월운의 시험운·합격운 확장 키와 오늘의 운세 키를 구분합니다. */
  analysis.scores = Object.fromEntries(
    ["career", "wealth", "relationship", "health"].map(
      key => [key, Number(analysis.scores[key] ?? 0)]
    )
  );

  applyTenGodDomainScore(
    analysis.scores,
    daeun?.stemTenGod,
    0.20,
    usefulGod
  );

  applyTenGodDomainScore(
    analysis.scores,
    daeun?.branchTenGod,
    0.17,
    usefulGod
  );

  const cycleRelations = getLayerRelations(
    stem,
    branch,
    daeun,
    "대운"
  );

  applyLayerRelationDomainScore(
    analysis.scores,
    cycleRelations,
    0.40
  );

  for (const key of Object.keys(analysis.scores)) {
    analysis.scores[key] +=
      (month.domainAnalysis.scores[key] ?? 0) * 0.25;
  }

  const contributions = {};

  const layers = [
    ["일운", daily, 1.00, 0.85],
    ["월운", month, 0.65, 0.55],
    ["세운", month.annual, 0.35, 0.30],
    ["대운", daeun, 0.20, 0.17]
  ];

  for (const [
    label,
    item,
    stemWeight,
    branchWeight
  ] of layers) {
    const scores = {
      career: 0,
      wealth: 0,
      relationship: 0,
      health: 0
    };

    applyTenGodDomainScore(
      scores,
      item?.stemTenGod,
      stemWeight,
      usefulGod
    );

    applyTenGodDomainScore(
      scores,
      item?.branchTenGod,
      branchWeight,
      usefulGod
    );

    contributions[label] = scores;
  }

  const extraAnalysis =
    analyzeDailyExtraDomains({
      pillars: normalized,
      daily,
      month,
      annual: month.annual,
      daeun,
      cycleRelations,
      usefulGod
    });

  Object.assign(
    analysis.scores,
    extraAnalysis.scores
  );

  for (const label of Object.keys(contributions)) {
    Object.assign(
      contributions[label],
      extraAnalysis.contributions[label]
    );
  }

  const ranking = Object.entries(
    analysis.scores
  ).sort(
    (a, b) => b[1] - a[1]
  );

  const highest = ranking[0][1];

  const strongestKeys = ranking
    .filter(
      ([, value]) =>
        Math.abs(value - highest) < 1e-8
    )
    .map(([key]) => key);

  return {
    date,
    moment,
    daily,
    month,
    annual: month.annual,
    daeun,
    pillars: normalized,

    scores: analysis.scores,
    contributions,
    ranking,
    strongestKeys,

    relations: [
      ...daily.natalRelations,
      ...daily.annualRelations,
      ...daily.daeunRelations,
      ...cycleRelations
    ],

    scoreSummary: calculateDailyScores({
      date,
      scores: analysis.scores,
      pillars: normalized,
      usefulGod
    }),

    lifestyle: buildDailyLifestyle({
      date,
      daily,
      month,
      annual: month.annual,
      daeun,
      pillars: normalized,
      usefulGod
    }),

    usefulGod,

    beforeFirstCycle:
      !daeun &&
      moment <
        new Date(
          `${fortuneCycle.birth.date}T${fortuneCycle.birth.time}:00+09:00`
        ).getTime() +
        fortuneCycle.cycles[0].startAge *
        365.2422 *
        86400000,

    approximate:
      fortuneCycle.birth.unknownTime
  };
}