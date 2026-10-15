import {
  calculatePillars
} from "../calculators/pillars.js";

import {
  calculateTenGod
} from "../calculators/tenGods.js";

import {
  getMainHiddenStem
} from "../calculators/hiddenStems.js";

import {
  applyTenGodDomainScore,
  getNatalRelations
} from "../calculators/monthlyFortune.js";

import {
  scoreExtraLayer
} from "./dailyExtraDomains.js";

export function referenceScore(raw) {
  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error("운세 점수를 확인해주세요.");
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(50 + value * 6)
    )
  );
}

export function scoreDescription(score) {
  if (score >= 80) {
    return "오늘의 흐름을 적극 활용해보세요";
  }

  if (score >= 65) {
    return "준비한 일에 차분히 힘을 써보세요";
  }

  if (score >= 50) {
    return "우선순위를 정하고 균형을 지켜보세요";
  }

  return "무리하지 말고 여유를 확보하세요";
}

export function calculateDailyScores({
  date,
  scores,
  pillars,
  usefulGod
}) {
  const domainValues =
    Object.values(scores);

  const base =
    domainValues.reduce(
      (sum, value) => sum + value,
      0
    ) / domainValues.length;

  const total = referenceScore(base);

  const [year, month, day] =
    date.split("-").map(Number);

  const periods = [
    {
      key: "morning",
      label: "오전",
      range: "00:00 ~ 11:59",
      hours: [1, 3, 5, 7, 9, 11],
      advice:
        "핵심 공부와 중요한 준비를 작은 단위로 나누어 진행해보세요."
    },
    {
      key: "afternoon",
      label: "오후",
      range: "12:00 ~ 17:59",
      hours: [13, 15, 17],
      advice:
        "업무, 문제 풀이, 대화처럼 결과를 확인하는 일에 집중해보세요."
    },
    {
      key: "night",
      label: "밤",
      range: "18:00 ~ 23:59",
      hours: [19, 21, 23],
      advice:
        "오늘의 결과를 정리하고 오답 복습과 다음 날 준비를 해보세요."
    }
  ].map(period => {
    const adjustments = period.hours.map(hour => {
      const hourPillar = calculatePillars({
        year,
        month,
        day,
        hour,
        minute: 0,
        isLunar: false,
        isLeapMonth: false
      }).toHanjaObject().hour.hanja;

      const [stem, branch] =
        [...hourPillar];

      const item = {
        stemTenGod: calculateTenGod(
          pillars.day.stem,
          stem
        ),

        branchTenGod: calculateTenGod(
          pillars.day.stem,
          getMainHiddenStem(branch)
        )
      };

      const values = {
        career: 0,
        wealth: 0,
        relationship: 0,
        health: 0
      };

      applyTenGodDomainScore(
        values,
        item.stemTenGod,
        0.45,
        usefulGod
      );

      applyTenGodDomainScore(
        values,
        item.branchTenGod,
        0.35,
        usefulGod
      );

      Object.assign(
        values,
        scoreExtraLayer(
          item,
          0.45,
          0.35,
          usefulGod
        )
      );

      const relationAdjustment =
        getNatalRelations(
          stem,
          branch,
          pillars
        ).reduce(
          (sum, relation) =>
            sum + (
              relation.type === "충"
                ? -0.04
                : 0.04
            ),
          0
        );

      return (
        Object.values(values).reduce(
          (sum, value) => sum + value,
          0
        ) / Object.keys(values).length
      ) + relationAdjustment;
    });

    const adjustment =
      adjustments.reduce(
        (sum, value) => sum + value,
        0
      ) / adjustments.length;

    return {
      ...period,

      score:
        referenceScore(base + adjustment)
    };
  });

  const highest = Math.max(
    ...periods.map(
      period => period.score
    )
  );

  return {
    total,

    description:
      scoreDescription(total),

    domainScores: Object.fromEntries(
      Object.entries(scores).map(
        ([key, value]) => [
          key,
          referenceScore(value)
        ]
      )
    ),

    periods: periods.map(period => ({
      ...period,

      isStrongest:
        period.score === highest
    }))
  };
}