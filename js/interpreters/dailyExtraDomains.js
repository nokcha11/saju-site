import { calculateTenGod } from "../calculators/tenGods.js";
import { getMainHiddenStem } from "../calculators/hiddenStems.js";

/*
  학업 · 합격 · 인간관계 추가 영역

  사이트 내부의 상대 비교 규칙입니다.
  합격 확률을 계산하지 않습니다.
*/

const WEIGHTS = {
  비견: { study: 0.8, exam: 0.9, social: 1.8 },
  겁재: { study: 0.2, exam: 0.1, social: 0.6 },
  식신: { study: 1.1, exam: 1.2, social: 1.1 },
  상관: { study: 0.8, exam: 0.6, social: 0.4 },
  편재: { study: -0.3, exam: 0.1, social: 1.2 },
  정재: { study: 0.4, exam: 0.4, social: 0.9 },
  편관: { study: 0.4, exam: 1.3, social: 0.3 },
  정관: { study: 1.1, exam: 1.8, social: 0.9 },
  편인: { study: 1.8, exam: 1.1, social: 0.5 },
  정인: { study: 2.0, exam: 1.5, social: 1.2 }
};

const ROLES = {
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

function roleAdjustment(tenGod, usefulGod) {
  const role = ROLES[tenGod];

  if (!role || !usefulGod) return 0;

  if (usefulGod.yongsin?.role === role) return 0.85;
  if (usefulGod.huisin?.role === role) return 0.40;
  if (usefulGod.gisin?.role === role) return -0.75;
  if (usefulGod.gusin?.role === role) return -0.35;

  return 0;
}

function applyStar(scores, tenGod, factor, usefulGod) {
  const weight = WEIGHTS[tenGod];

  if (!weight) return;

  const adjustment = roleAdjustment(tenGod, usefulGod);

  for (const key of ["study", "exam", "social"]) {
    const base = weight[key];

    scores[key] +=
      (base + Math.abs(base) * adjustment) * factor;
  }
}

export function scoreExtraLayer(
  item,
  stemWeight,
  branchWeight,
  usefulGod
) {
  const scores = {
    study: 0,
    exam: 0,
    social: 0
  };

  applyStar(
    scores,
    item?.stemTenGod,
    stemWeight,
    usefulGod
  );

  applyStar(
    scores,
    item?.branchTenGod,
    branchWeight,
    usefulGod
  );

  return scores;
}

function addScores(target, source, factor = 1) {
  target.study += source.study * factor;
  target.exam += source.exam * factor;
  target.social += source.social * factor;
}

function applyRelations(
  scores,
  relations = [],
  factor = 1
) {
  for (const relation of relations) {
    const sign = relation.type === "충" ? -1 : 1;

    const scopeWeight =
      relation.scope === "월주" ? 1.5 : 1;

    scores.study +=
      0.06 * sign * factor * scopeWeight;

    scores.exam +=
      0.10 * sign * factor * scopeWeight;

    scores.social +=
      0.16 * sign * factor;
  }
}

export function analyzeDailyExtraDomains({
  pillars,
  daily,
  month,
  annual,
  daeun,
  cycleRelations,
  usefulGod
}) {
  const contributions = {};

  const scores = {
    study: 0,
    exam: 0,
    social: 0
  };

  const layers = [
    ["일운", daily, 1.00, 0.85],
    ["월운", month, 0.65, 0.55],
    ["세운", annual, 0.35, 0.30],
    ["대운", daeun, 0.20, 0.17]
  ];

  for (const [
    label,
    item,
    stemWeight,
    branchWeight
  ] of layers) {
    contributions[label] = scoreExtraLayer(
      item,
      stemWeight,
      branchWeight,
      usefulGod
    );

    addScores(scores, contributions[label]);
  }

  /*
    원국의 배경을 낮은 비중으로 반영합니다.
    일간 자신의 천간 점수는 제외합니다.
  */

  const natal = {
    study: 0,
    exam: 0,
    social: 0
  };

  for (const [key, pillar] of Object.entries(pillars)) {
    if (!pillar) continue;

    if (key !== "day") {
      applyStar(
        natal,
        calculateTenGod(
          pillars.day.stem,
          pillar.stem
        ),
        0.12,
        usefulGod
      );
    }

    applyStar(
      natal,
      calculateTenGod(
        pillars.day.stem,
        getMainHiddenStem(pillar.branch)
      ),
      0.12,
      usefulGod
    );
  }

  addScores(scores, natal);

  applyRelations(
    scores,
    daily.natalRelations,
    1.00
  );

  applyRelations(
    scores,
    daily.annualRelations,
    0.80
  );

  applyRelations(
    scores,
    daily.daeunRelations,
    0.60
  );

  applyRelations(
    scores,
    cycleRelations,
    0.40
  );

  /*
    월운의 종합 배경을 0.25 비중으로 반영합니다.
  */

  const background = {
    study: 0,
    exam: 0,
    social: 0
  };

  addScores(
    background,
    scoreExtraLayer(
      month,
      1.00,
      0.85,
      usefulGod
    )
  );

  addScores(
    background,
    scoreExtraLayer(
      annual,
      0.65,
      0.55,
      usefulGod
    )
  );

  addScores(
    background,
    scoreExtraLayer(
      daeun,
      0.35,
      0.30,
      usefulGod
    )
  );

  applyRelations(
    background,
    month.natalRelations,
    1.00
  );

  applyRelations(
    background,
    month.annualRelations,
    0.80
  );

  applyRelations(
    background,
    month.daeunRelations,
    0.60
  );

  addScores(scores, background, 0.25);

  return {
    scores,
    contributions
  };
}