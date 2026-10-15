/*
 * 학업운·시험운·합격운 공통 계산 및 해석
 *
 * 가중치는 사이트 내부의 상대 지표입니다.
 * 합격 확률이나 실제 시험 결과를 예측하는 공식이 아닙니다.
 *
 * 원국은 기존 용신·희신·기신·구신 역할 판정을 통해 반영합니다.
 * 합·충은 이 점수에 일괄 가감하지 않으며,
 * 각 운의 기존 관계 카드에서 별도로 확인합니다.
 */

export const EDUCATION_LABELS = {
  study: "학업운",
  exam: "시험운",
  admission: "합격운"
};

const ROLE = {
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

/*
 * 배열 순서:
 * 학업운 → 시험운 → 합격운
 *
 * 학업운: 이해·학습·축적
 * 시험운: 표현·실행·실전 준비
 * 합격운: 평가·자격 준비
 */

const WEIGHTS = {
  비견: [0.7, 0.9, 0.6],
  겁재: [0.2, 0.5, 0.2],
  식신: [1.0, 1.8, 1.0],
  상관: [0.8, 1.5, 0.4],
  편재: [0.2, 0.4, 0.3],
  정재: [0.6, 0.8, 0.7],
  편관: [0.8, 1.2, 1.4],
  정관: [1.2, 1.4, 2.0],
  편인: [1.8, 0.9, 0.8],
  정인: [2.2, 1.2, 1.8]
};

const STATUS = {
  yongsin: [0.85, "도움"],
  huisin: [0.4, "보조"],
  neutral: [0, "중립"],
  gusin: [-0.35, "부담"],
  gisin: [-0.75, "부담"]
};

function roleStatus(role, usefulGod) {
  for (const key of ["yongsin", "huisin", "gisin", "gusin"]) {
    if (role && usefulGod?.[key]?.role === role) {
      return key;
    }
  }

  return "neutral";
}

/*
 * layers 예:
 * {
 *   label: "대운",
 *   stemTenGod: "정인",
 *   branchTenGod: "정관",
 *   stemFactor: 1,
 *   branchFactor: 0.85
 * }
 */

export function analyzeEducationDomains(layers, usefulGod) {
  const scores = {
    study: 0,
    exam: 0,
    admission: 0
  };

  const evidence = [];
  let totalFactor = 0;

  for (const layer of layers) {
    if (!layer) {
      continue;
    }

    const positions = [
      ["천간", layer.stemTenGod, layer.stemFactor],
      ["지지", layer.branchTenGod, layer.branchFactor]
    ];

    for (const [position, god, factor] of positions) {
      if (
        !WEIGHTS[god] ||
        !Number.isFinite(factor) ||
        factor <= 0
      ) {
        continue;
      }

      const status = roleStatus(ROLE[god], usefulGod);
      const [adjustment, statusLabel] = STATUS[status];

      Object.keys(scores).forEach((key, index) => {
        scores[key] +=
          WEIGHTS[god][index] *
          factor *
          (1 + adjustment);
      });

      totalFactor += factor;

      evidence.push(
        `${layer.label} ${position} ${god}(${statusLabel})`
      );
    }
  }

  return {
    scores,
    evidence,
    totalFactor
  };
}

const GUIDE = {
  study: {
    strong:
      "학습 내용을 이해하고 축적하는 데 상대적으로 힘이 실립니다. 개념 정리와 반복 복습을 중심에 두세요.",

    normal:
      "학업은 꾸준한 분량 관리로 활용할 수 있는 흐름입니다. 짧은 학습과 복습을 반복하세요.",

    weak:
      "학습·정리 쪽의 상대적인 지원이 낮습니다. 공부 범위를 좁히고 오답과 취약 개념부터 확인하세요."
  },

  exam: {
    strong:
      "배운 내용을 답안으로 표현하고 실행하는 데 상대적으로 힘이 실립니다. 시간 제한 모의시험과 실전 연습을 활용하세요.",

    normal:
      "시험 준비는 지식과 실전 연습을 연결하는 것이 핵심입니다. 문제 풀이 시간과 답안 정확도를 함께 점검하세요.",

    weak:
      "실전 표현과 시간 관리 쪽의 상대적인 지원이 낮습니다. 새로운 범위를 늘리기보다 반복 실수를 줄이는 데 집중하세요."
  },

  admission: {
    strong:
      "학습 기반과 평가·자격 준비에 상대적으로 힘이 실립니다. 응시 기준과 제출 요건을 확인하고 준비한 내용을 평가 방식에 맞춰 정리하세요.",

    normal:
      "합격 준비는 학습·실전·평가 요건을 고르게 점검하는 흐름으로 활용하세요. 최근 모의시험 결과로 준비 상태를 확인하세요.",

    weak:
      "평가·자격 준비 쪽의 상대적인 지원이 낮습니다. 이를 불합격 신호로 보지 말고 취약 과목과 응시 요건을 먼저 보완하세요."
  }
};

export function getEducationReading(key, analysis, period) {
  if (!GUIDE[key]) {
    return "";
  }

  if (!analysis?.totalFactor) {
    return "학업·시험·합격 준비를 해석할 십성 정보가 부족합니다.";
  }

  const average =
    analysis.scores[key] / analysis.totalFactor;

  const level =
    average >= 1.5
      ? "strong"
      : average >= 0.65
        ? "normal"
        : "weak";

  const evidence = analysis.evidence.join(" · ");

  const note =
    key === "admission"
      ? " 합격운은 합격 확률이나 결과 예측이 아니라 평가·자격 준비의 상대적 흐름입니다. 실제 결과는 준비도와 시험 조건에 따라 달라집니다."
      : "";

  return (
    `${period}의 흐름: ${GUIDE[key][level]} ` +
    `근거: ${evidence}. ` +
    `원국의 도움·부담 역할을 반영한 참고 해석입니다.${note}`
  );
}