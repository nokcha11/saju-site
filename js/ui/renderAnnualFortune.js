import {
  EDUCATION_LABELS,
  analyzeEducationDomains,
  getEducationReading
} from "../calculators/educationFortune.js";

/* 세운 오행 표시 */

const ELEMENT_LABEL = {
  wood: "木 목",
  fire: "火 화",
  earth: "土 토",
  metal: "金 금",
  water: "水 수"
};

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

/* 사이트 내부 상대 가중치 */

const TEN_GOD_DOMAIN_WEIGHT = {
  비견: {
    career: 1.1,
    wealth: 0.2,
    relationship: 0.3,
    study: 0.4,
    health: 0.8
  },

  겁재: {
    career: 0.6,
    wealth: -0.8,
    relationship: 0.3,
    study: 0.2,
    health: 0.2
  },

  식신: {
    career: 1.2,
    wealth: 1.0,
    relationship: 0.8,
    study: 0.8,
    health: 1.0
  },

  상관: {
    career: 0.8,
    wealth: 0.8,
    relationship: 0.2,
    study: 1.0,
    health: 0.3
  },

  편재: {
    career: 1.2,
    wealth: 2.0,
    relationship: 1.2,
    study: 0.2,
    health: 0.2
  },

  정재: {
    career: 1.0,
    wealth: 2.0,
    relationship: 1.3,
    study: 0.5,
    health: 0.5
  },

  편관: {
    career: 1.4,
    wealth: 0.2,
    relationship: 1.1,
    study: 0.8,
    health: -0.8
  },

  정관: {
    career: 1.8,
    wealth: 0.5,
    relationship: 1.3,
    study: 1.0,
    health: -0.2
  },

  편인: {
    career: 1.0,
    wealth: 0.1,
    relationship: -0.2,
    study: 2.0,
    health: 0.5
  },

  정인: {
    career: 1.2,
    wealth: 0.3,
    relationship: 0.4,
    study: 2.2,
    health: 1.0
  }
};

/* 십성별 기본 세운 해석 */

const TEN_GOD_READING = {
  비견: {
    core:
      "내 판단과 주도권을 직접 써야 하는 해입니다.",
    career:
      "직업에서는 스스로 결정하고 맡아서 추진하는 일이 늘 수 있습니다. 독립적으로 처리할 수 있는 역할에서 강점을 쓰기 좋습니다.",
    wealth:
      "재물은 크게 늘리기보다 내 기반과 생활비 구조를 안정적으로 지키는 쪽이 중요합니다.",
    relationship:
      "관계에서는 내 기준이 강해질 수 있으므로 상대의 영역을 존중하는 것이 중요합니다.",
    study:
      "공부에서는 혼자 계획을 세워 꾸준히 밀어붙이는 방식이 잘 맞습니다.",
    caution:
      "혼자 다 결정하려 하거나 경쟁심이 과해지지 않도록 조율하는 것이 좋습니다."
  },

  겁재: {
    core:
      "경쟁과 사람의 영향이 커지는 해입니다.",
    career:
      "협업·경쟁·인맥을 통해 기회가 생길 수 있지만 역할과 책임을 분명하게 나누는 것이 중요합니다.",
    wealth:
      "사람과 관련된 지출, 공동 비용, 예상 밖의 금전 이동을 평소보다 신중하게 보는 편이 좋습니다.",
    relationship:
      "새로운 사람과의 접점은 늘 수 있지만 주도권 충돌이나 감정적인 경쟁은 피하는 것이 좋습니다.",
    study:
      "혼자 공부하기보다 스터디·동료·경쟁 환경을 잘 활용하면 자극을 받기 좋습니다.",
    caution:
      "주변 분위기에 휩쓸려 중요한 결정을 급하게 하지 않는 것이 중요합니다."
  },

  식신: {
    core:
      "배운 것과 가진 기술을 실제 결과로 만드는 해입니다.",
    career:
      "기술·기획·제작·콘텐츠·프로젝트처럼 결과물이 남는 일이 잘 맞습니다.",
    wealth:
      "지식이나 기술을 실제 서비스·성과·프로젝트로 만들어 수입화하는 방식과 잘 연결됩니다.",
    relationship:
      "관계는 비교적 편안하게 이어지기 쉬우며 함께 즐길 수 있는 활동이 도움이 됩니다.",
    study:
      "배운 내용을 문제풀이·작품·포트폴리오처럼 실제 결과물로 바꾸는 공부가 효과적입니다.",
    caution:
      "할 일을 너무 많이 벌여 체력과 시간을 소모하지 않도록 조절하는 것이 좋습니다."
  },

  상관: {
    core:
      "표현과 변화 욕구가 강해지는 해입니다.",
    career:
      "기존 방식보다 새로운 방법을 제안하거나 자신의 의견을 직접 드러내는 일이 많아질 수 있습니다.",
    wealth:
      "새로운 수입 방식을 만들 수 있지만 변동성도 커질 수 있으므로 계획적인 관리가 필요합니다.",
    relationship:
      "감정을 직접 표현하기 쉬운 해라서 솔직함은 장점이지만 말이 너무 강해지지 않도록 조절하는 것이 좋습니다.",
    study:
      "암기만 반복하기보다 이해한 것을 설명하고 써보는 방식이 학습 효율을 높이기 좋습니다.",
    caution:
      "조직·상사·가까운 사람과 불필요한 말의 충돌이 생기지 않도록 표현을 한 번 더 정리하는 편이 좋습니다."
  },

  편재: {
    core:
      "외부 활동과 현실적인 기회가 넓어지는 해입니다.",
    career:
      "프로젝트·외부 활동·영업·사람을 많이 만나는 역할처럼 기회를 넓게 접하는 일이 활발해질 수 있습니다.",
    wealth:
      "돈의 흐름이 커질 수 있으므로 버는 것만큼 지출과 자금 흐름을 관리하는 것이 중요합니다.",
    relationship:
      "사람을 만나는 범위가 넓어지고 새로운 인연의 접점도 늘어날 수 있습니다.",
    study:
      "공부 자체보다 배운 것을 실무·현장·성과로 연결하는 과정에서 동기가 커지기 쉽습니다.",
    caution:
      "여러 기회를 동시에 잡으려다 시간·돈·에너지가 분산되지 않도록 선택과 집중이 필요합니다."
  },

  정재: {
    core:
      "생활과 재정을 안정적으로 정리하기 좋은 해입니다.",
    career:
      "꾸준한 업무, 장기 프로젝트, 안정적인 성과를 쌓는 방식과 잘 맞습니다.",
    wealth:
      "고정적인 수입과 지출을 정리하고 생활 기반을 안정시키는 흐름에 유리합니다.",
    relationship:
      "관계에서도 신뢰, 약속, 현실적인 안정성을 중요하게 보게 됩니다.",
    study:
      "정해진 일정과 목표를 꾸준히 지키는 학습 방식이 효과적입니다.",
    caution:
      "안정을 지키려다 필요한 변화까지 미루지 않는 것이 좋습니다."
  },

  편관: {
    core:
      "책임과 압박이 커지면서 행동력이 요구되는 해입니다.",
    career:
      "경쟁·책임·난도가 높은 역할을 맡을 가능성이 커지며 이를 잘 넘기면 경력으로 남기기 좋습니다.",
    wealth:
      "성과를 위해 쓰는 비용과 책임이 늘 수 있으므로 무리한 금전 부담은 피하는 편이 좋습니다.",
    relationship:
      "관계에서도 긴장감이나 힘겨루기가 생기지 않도록 상대와의 경계를 분명히 하는 것이 중요합니다.",
    study:
      "시험이나 평가처럼 압박이 있는 환경에서는 집중력이 올라갈 수 있지만 과도한 긴장은 관리가 필요합니다.",
    caution:
      "업무와 책임을 계속 혼자 감당하지 말고 일정과 체력을 함께 관리하는 것이 중요합니다."
  },

  정관: {
    core:
      "직업·책임·평판처럼 사회적인 기준이 중요해지는 해입니다.",
    career:
      "취업·승진·직책·공적인 평가처럼 조직 안에서 자리를 잡는 흐름과 잘 연결됩니다.",
    wealth:
      "큰 변동보다 안정적인 직업과 규칙적인 수입을 만드는 방향이 중요합니다.",
    relationship:
      "관계를 가볍게 보기보다 책임과 장기적인 안정성을 중요하게 보게 됩니다.",
    study:
      "자격시험, 공적인 평가, 정해진 기준을 통과해야 하는 공부와 잘 연결됩니다.",
    caution:
      "규칙과 책임을 너무 완벽하게 지키려다 스스로를 압박하지 않는 것이 좋습니다."
  },

  편인: {
    core:
      "전문성·새로운 지식·독자적인 생각이 강해지는 해입니다.",
    career:
      "연구·기획·전문기술처럼 깊게 파고드는 일이 잘 맞습니다.",
    wealth:
      "즉각적인 수입보다 전문성이나 기술을 쌓아 이후 수입으로 연결하는 흐름에 가깝습니다.",
    relationship:
      "혼자 생각하는 시간이 늘 수 있으므로 가까운 사람과의 소통을 의식적으로 유지하는 것이 좋습니다.",
    study:
      "전문 분야를 깊게 공부하거나 새로운 방식으로 문제를 파고드는 데 유리합니다.",
    caution:
      "준비와 생각만 계속 늘리고 실제 실행을 미루지 않는 것이 중요합니다."
  },

  정인: {
    core:
      "배움·준비·지원이 중요한 해입니다.",
    career:
      "교육·자격증·멘토링·자료처럼 능력을 보강하는 과정이 이후 경력에 도움이 됩니다.",
    wealth:
      "당장의 큰 수입보다 실력과 기반을 쌓는 데 투자하는 흐름과 잘 맞습니다.",
    relationship:
      "도움을 주고받는 안정적인 관계가 중요한 역할을 합니다.",
    study:
      "시험 준비, 자격증, 교육처럼 체계적으로 배우고 축적하는 과정에 도움이 되는 해입니다.",
    caution:
      "충분히 준비했다면 계속 공부만 하기보다 지원·응시·실행으로 연결하는 것이 중요합니다."
  }
};

const DEFAULT_READING = {
  core:
    "원국과 대운, 세운을 함께 보아야 하는 해입니다.",
  career:
    "직업에서는 현재 상황과 운의 흐름을 함께 확인하는 것이 좋습니다.",
  wealth:
    "재물은 수입과 지출의 균형을 함께 관리하는 것이 중요합니다.",
  relationship:
    "관계에서는 상대와의 소통과 조율이 중요합니다.",
  study:
    "학업에서는 계획과 실행의 균형을 맞추는 것이 중요합니다.",
  caution:
    "한쪽으로 지나치게 치우치지 않는 것이 좋습니다."
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

/* CSS */

function ensureAnnualFortuneCss() {
  const already = Array.from(document.styleSheets).some(
    sheet => sheet.href?.includes("annual-fortune.css")
  );

  if (already) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./css/annual-fortune.css";
  link.dataset.annualFortuneCss = "true";
  document.head.appendChild(link);
}

/* 상단 메뉴 */

function ensureAnnualFortuneNav() {
  const nav = document.querySelector(".site-nav");

  if (!nav) {
    return;
  }

  let link = nav.querySelector(
    'a[href="#annualFortuneSection"]'
  );

  if (!link) {
    link = document.createElement("a");
    link.href = "#annualFortuneSection";
    link.textContent = "세운";

    const daeunLink = nav.querySelector(
      'a[href="#fortuneCycleSection"]'
    );

    const todayLink = nav.querySelector(
      'a[href="#today"]'
    );

    if (daeunLink) {
      daeunLink.after(link);
    } else if (todayLink) {
      todayLink.before(link);
    } else {
      nav.appendChild(link);
    }
  }

  if (link.dataset.annualBound === "true") {
    return;
  }

  link.dataset.annualBound = "true";

  link.addEventListener("click", event => {
    event.preventDefault();

    const section = document.getElementById(
      "annualFortuneSection"
    );

    if (!section) {
      return;
    }

    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth"
    });

    history.replaceState(
      null,
      "",
      "#annualFortuneSection"
    );
  });
}

/* 세운 섹션 */

function ensureAnnualFortuneSection() {
  let section = document.getElementById(
    "annualFortuneSection"
  );

  if (section) {
    return section;
  }

  section = document.createElement("section");
  section.id = "annualFortuneSection";
  section.className =
    "page-section annual-fortune-section";

  const daeun = document.getElementById(
    "fortuneCycleSection"
  );

  const today = document.getElementById("today");

  if (daeun) {
    daeun.after(section);
  } else if (today) {
    today.before(section);
  } else {
    document.querySelector(".app")?.appendChild(section);
  }

  return section;
}

function getCurrentGender() {
  return (
    document.querySelector(
      'input[name="gender"]:checked'
    )?.value ?? ""
  );
}

/* 원국 도움·부담 */

function getElementStatus(element, usefulGod) {
  if (!element || !usefulGod) {
    return "neutral";
  }

  if (usefulGod.yongsin?.element === element) {
    return "yongsin";
  }

  if (usefulGod.huisin?.element === element) {
    return "huisin";
  }

  if (usefulGod.gisin?.element === element) {
    return "gisin";
  }

  if (usefulGod.gusin?.element === element) {
    return "gusin";
  }

  return "neutral";
}

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

function getRoleAdjustment(role, usefulGod) {
  const status = getRoleStatus(role, usefulGod);

  const map = {
    yongsin: 0.90,
    huisin: 0.45,
    neutral: 0,
    gusin: -0.40,
    gisin: -0.80
  };

  return map[status] ?? 0;
}

/* 영역 점수 */

function applyTenGodScore(
  scores,
  tenGod,
  factor,
  usefulGod
) {
  const weight = TEN_GOD_DOMAIN_WEIGHT[tenGod];

  if (!weight) {
    return;
  }

  const role = TEN_GOD_ROLE[tenGod];

  const roleAdjustment = getRoleAdjustment(
    role,
    usefulGod
  );

  Object.keys(scores).forEach(domain => {
    const base = Number(weight[domain] ?? 0);

    scores[domain] += base * factor;

    if (base !== 0) {
      scores[domain] +=
        Math.abs(base) *
        factor *
        roleAdjustment;
    }
  });
}

function applyNatalRelationScore(scores, relations) {
  if (!Array.isArray(relations)) {
    return;
  }

  relations.forEach(relation => {
    const positive = relation.type !== "충";
    const sign = positive ? 1 : -1;

    switch (relation.scope) {
      case "월주":
        scores.career += 0.80 * sign;
        scores.wealth += 0.25 * sign;
        break;

      case "일주":
        scores.relationship += 0.90 * sign;
        scores.health += 0.20 * sign;
        break;

      case "년주":
        scores.relationship += 0.35 * sign;
        scores.career += 0.25 * sign;
        break;

      case "시주":
        scores.study += 0.35 * sign;
        scores.relationship += 0.20 * sign;
        break;
    }
  });
}

function applyDaeunRelationScore(scores, relations) {
  if (!Array.isArray(relations)) {
    return;
  }

  relations.forEach(relation => {
    const positive = relation.type !== "충";
    const sign = positive ? 1 : -1;

    scores.career += 0.35 * sign;
    scores.wealth += 0.20 * sign;
    scores.relationship += 0.35 * sign;
    scores.health += 0.15 * sign;
  });
}

function applySpouseStarScore(scores, annual, gender) {
  const spouseStars =
    gender === "male"
      ? ["정재", "편재"]
      : gender === "female"
        ? ["정관", "편관"]
        : [];

  if (!spouseStars.length) {
    return;
  }

  if (spouseStars.includes(annual.stemTenGod)) {
    scores.relationship += 0.75;
  }

  if (spouseStars.includes(annual.branchTenGod)) {
    scores.relationship += 0.60;
  }

  if (spouseStars.includes(annual.daeun?.stemTenGod)) {
    scores.relationship += 0.35;
  }

  if (spouseStars.includes(annual.daeun?.branchTenGod)) {
    scores.relationship += 0.25;
  }
}

/* 원국 + 대운 + 세운 */

function getDomainRankMeta(domainAnalysis, key) {
  const ranking = Array.isArray(domainAnalysis?.ranking)
    ? domainAnalysis.ranking
    : [];

  const index = ranking.findIndex(
    ([domainKey]) => domainKey === key
  );

  if (index < 0 || index > 2) {
    return null;
  }

  return {
    rank: index + 1,
    score: Number(ranking[index]?.[1] ?? 0)
  };
}

function formatRankScore(value) {
  return `${Number(value ?? 0).toFixed(1)}점`;
}

function analyzeDomains(annual, usefulGod) {
  const scores = {
    career: 0,
    wealth: 0,
    relationship: 0,
    study: 0,
    health: 0
  };

  applyTenGodScore(
    scores,
    annual.stemTenGod,
    1.00,
    usefulGod
  );

  applyTenGodScore(
    scores,
    annual.branchTenGod,
    0.85,
    usefulGod
  );

  applyTenGodScore(
    scores,
    annual.daeun?.stemTenGod,
    0.55,
    usefulGod
  );

  applyTenGodScore(
    scores,
    annual.daeun?.branchTenGod,
    0.45,
    usefulGod
  );

  applyNatalRelationScore(
    scores,
    annual.natalRelations
  );

  applyDaeunRelationScore(
    scores,
    annual.daeunRelations
  );

  applySpouseStarScore(
    scores,
    annual,
    getCurrentGender()
  );

  const education = analyzeEducationDomains(
    [
      {
        ...annual,
        label: "세운",
        stemFactor: 1,
        branchFactor: 0.85
      },
      {
        ...annual.daeun,
        label: "대운",
        stemFactor: 0.55,
        branchFactor: 0.45
      }
    ],
    usefulGod
  );

  Object.assign(scores, education.scores);

  const ranking = Object.entries(scores).sort(
    (first, second) => second[1] - first[1]
  );

  const strongest = ranking[0];

  const strongestKey =
    strongest ? strongest[0] : "career";

  const strongestScore =
    strongest ? strongest[1] : 0;

  let peakLabel;

  if (strongestScore >= 2) {
    peakLabel = "올해 가장 강한 운";
  } else if (strongestScore >= 0.5) {
    peakLabel = "올해 상대적으로 좋은 흐름";
  } else {
    peakLabel = "올해 상대적으로 덜 부담되는 영역";
  }

  return {
    scores,
    education,
    ranking,
    strongestKey,
    strongestScore,
    strongestLabel: DOMAIN_LABELS[strongestKey],
    peakLabel
  };
}

/* 세운 도움·부담 */

function analyzeAnnualBalance(annual, usefulGod) {
  const scoreMap = {
    yongsin: 2,
    huisin: 1,
    neutral: 0,
    gusin: -1,
    gisin: -2
  };

  const stemStatus = getElementStatus(
    annual.stemElement,
    usefulGod
  );

  const branchStatus = getElementStatus(
    annual.branchElement,
    usefulGod
  );

  const score =
    scoreMap[stemStatus] +
    scoreMap[branchStatus];

  if (score >= 3) {
    return {
      score,
      label: "도움이 큰 해",
      text:
        "용신·희신 기운이 함께 들어와 원국의 부족한 부분을 보완하기 좋은 해입니다."
    };
  }

  if (score >= 1) {
    return {
      score,
      label: "도움이 있는 해",
      text:
        "전체적으로 원국에 도움이 되는 기운이 포함되어 있어 활용하기 좋은 해입니다."
    };
  }

  if (score <= -3) {
    return {
      score,
      label: "부담이 큰 해",
      text:
        "기신·구신의 영향이 커질 수 있어 무리하게 일을 늘리기보다 관리와 조절이 중요한 해입니다."
    };
  }

  if (score <= -1) {
    return {
      score,
      label: "조절이 필요한 해",
      text:
        "부담이 되는 기운이 일부 들어오므로 자신의 여력과 우선순위를 관리하는 것이 중요합니다."
    };
  }

  return {
    score,
    label: "혼합 흐름",
    text:
      "도움과 부담이 함께 존재하므로 어떤 선택을 하느냐에 따라 체감이 달라질 수 있는 해입니다."
  };
}

function getBalanceClass(score) {
  if (score >= 3) {
    return "is-good-strong";
  }

  if (score >= 1) {
    return "is-good";
  }

  if (score <= -3) {
    return "is-bad-strong";
  }

  if (score <= -1) {
    return "is-bad";
  }

  return "is-mixed";
}

/* 세운 선택 카드 */

function buildAnnualCard(annual, index, usefulGod) {
  const balance = analyzeAnnualBalance(
    annual,
    usefulGod
  );

  return `
    <button
      type="button"
      class="annual-fortune-card ${annual.isCurrent ? "is-current" : ""}"
      data-annual-index="${index}"
    >
      <div class="annual-card-head">
        <strong>${annual.year}</strong>
        ${annual.isCurrent ? "<em>현재</em>" : ""}
      </div>

      <div class="annual-card-ten-god annual-card-ten-god-top">
        ${escapeHtml(annual.stemTenGod)}
      </div>

      <div class="annual-card-pillar-stack">
        <div class="annual-card-pillar is-${escapeHtml(annual.stemElement)}">
          <strong>${escapeHtml(annual.stem)}</strong>
          <span>${escapeHtml(annual.stemKorean)}</span>
        </div>

        <div class="annual-card-pillar is-${escapeHtml(annual.branchElement)}">
          <strong>${escapeHtml(annual.branch)}</strong>
          <span>${escapeHtml(annual.branchKorean)}</span>
        </div>
      </div>

      <div class="annual-card-ten-god annual-card-ten-god-bottom">
        ${escapeHtml(annual.branchTenGod)}
      </div>

      <div class="annual-card-stage">
        12운성 · ${escapeHtml(annual.twelveStage || "-")}
      </div>

      <small class="annual-card-daeun">
        대운 · ${escapeHtml(annual.daeun?.ganji || "-")}
      </small>

      <b class="annual-card-balance ${getBalanceClass(balance.score)}">
        ${escapeHtml(balance.label)}
      </b>
    </button>
  `;
}

/* 관계 및 생활 해석 */

function getRelationText(annual) {
  const natal =
    annual.natalRelations?.map(item => item.text) ?? [];

  const daeun =
    annual.daeunRelations?.map(item => item.text) ?? [];

  const all = [...natal, ...daeun];

  if (!all.length) {
    return "원국과 현재 대운에서 강하게 표시되는 천간 합·충 또는 지지 육합·충 관계는 없습니다.";
  }

  return all.join(" · ");
}

function getElementLifeReading(element) {
  switch (element) {
    case "wood":
      return "전통 오행 기준으로는 눈·근육·간담 계통을 생활 관리 체크포인트로 봅니다. 장시간 같은 자세와 과로를 줄이는 것이 좋습니다.";

    case "fire":
      return "전통 오행 기준으로는 열감·순환·눈을 생활 관리 체크포인트로 봅니다. 지나친 과로와 생활 리듬의 과열을 줄이는 편이 좋습니다.";

    case "earth":
      return "전통 오행 기준으로는 위장·소화·복부를 생활 관리 체크포인트로 봅니다. 불규칙한 식사와 과로를 줄이는 것이 좋습니다.";

    case "metal":
      return "전통 오행 기준으로는 호흡기·코·피부를 생활 관리 체크포인트로 봅니다. 건조함과 생활 리듬 관리가 중요합니다.";

    case "water":
      return "전통 오행 기준으로는 허리·귀·비뇨 계통을 생활 관리 체크포인트로 봅니다. 수면 부족과 장시간 과로를 줄이는 편이 좋습니다.";

    default:
      return "특정 신체 문제를 단정하기보다 수면·식사·과로 같은 생활 리듬을 관리하는 것이 중요합니다.";
  }
}

/* 상세 영역 카드 */

function buildDomainCard({
  key,
  title,
  text,
  domainAnalysis
}) {
  const isStrongest =
    domainAnalysis.strongestKey === key;

  const rankMeta = getDomainRankMeta(
    domainAnalysis,
    key
  );

  const cardClassName = [
    "annual-domain-card"
  ];

  if (isStrongest) {
    cardClassName.push("is-strongest");
  }

  if (rankMeta) {
    cardClassName.push(`is-rank-${rankMeta.rank}`);
  }

  return `
    <article class="${cardClassName.join(" ")}">
      <div class="annual-domain-title">
        <span>${escapeHtml(title)}</span>

        <div class="annual-domain-meta">
          ${
            rankMeta
              ? `
                <b class="annual-domain-rank-badge rank-${rankMeta.rank}">
                  ${rankMeta.rank}위 · ${escapeHtml(formatRankScore(rankMeta.score))}
                </b>
              `
              : ""
          }

          ${
            isStrongest
              ? `
                <em class="annual-domain-peak">
                  ★ ${escapeHtml(domainAnalysis.peakLabel)}
                </em>
              `
              : ""
          }
        </div>
      </div>

      <p>${escapeHtml(text)}</p>

      ${
        isStrongest
          ? `
            <small class="annual-domain-reason">
              원국의 도움·부담 기운,
              현재 대운,
              올해 세운,
              합·충 관계를 함께 보면
              이 영역에 상대적으로 가장 많은 힘이 실립니다.
            </small>
          `
          : ""
      }
    </article>
  `;
}

/* 세운 상세 */

function buildAnnualDetail(annual, usefulGod) {
  const reading =
    TEN_GOD_READING[annual.stemTenGod] ??
    DEFAULT_READING;

  const balance = analyzeAnnualBalance(
    annual,
    usefulGod
  );

  const domains = analyzeDomains(
    annual,
    usefulGod
  );

  const daeunText =
    annual.daeun
      ? `${annual.daeun.ganji} 대운 안에서 들어오는 ${annual.ganji} 세운입니다.`
      : `현재 대운 정보와 직접 연결되지 않은 ${annual.ganji} 세운입니다.`;

  return `
    <div class="annual-detail-head">
      <div>
        <span>선택한 세운</span>

        <h3>
          ${annual.year}년 · ${escapeHtml(annual.ganji)}
          <small>
            ${escapeHtml(annual.stemKorean)}
            ${escapeHtml(annual.branchKorean)}
          </small>
        </h3>

        <p>
          ${escapeHtml(annual.periodLabel)}
          · 천간 ${escapeHtml(annual.stemTenGod)}
          · 지지 ${escapeHtml(annual.branchTenGod)}
          · 12운성 ${escapeHtml(annual.twelveStage || "-")}
        </p>
      </div>

      <div class="annual-detail-status ${getBalanceClass(balance.score)}">
        ${escapeHtml(balance.label)}
      </div>
    </div>

    <div class="annual-detail-core">
      <span>이 해의 핵심</span>
      <strong>
        ${escapeHtml(reading.core)}
        ${escapeHtml(balance.text)}
      </strong>
      <small>${escapeHtml(daeunText)}</small>
    </div>

    <div class="annual-strongest-summary">
      <div>
        <span>원국 + 대운 + 세운 종합</span>
        <strong>${escapeHtml(domains.strongestLabel)}</strong>
      </div>

      <p>
        ${escapeHtml(domains.peakLabel)}입니다.
        원국의 용신·희신·기신·구신,
        현재 대운의 십성,
        올해 세운의 십성,
        원국·대운과의 합·충을 함께 반영했습니다.
      </p>
    </div>

    <div class="annual-detail-grid">
      ${
        buildDomainCard({
          key: "career",
          title: "직업 · 취업",
          text: reading.career,
          domainAnalysis: domains
        })
      }

      ${
        buildDomainCard({
          key: "wealth",
          title: "재물",
          text: reading.wealth,
          domainAnalysis: domains
        })
      }

      ${
        buildDomainCard({
          key: "relationship",
          title: "연애 · 관계",
          text: reading.relationship,
          domainAnalysis: domains
        })
      }

      ${
        Object.entries(EDUCATION_LABELS)
          .map(([key, title]) =>
            buildDomainCard({
              key,
              title,
              text: getEducationReading(
                key,
                domains.education,
                "올해"
              ),
              domainAnalysis: domains
            })
          )
          .join("")
      }

      ${
        buildDomainCard({
          key: "health",
          title: "건강 · 생활",
          text: getElementLifeReading(
            annual.branchElement
          ),
          domainAnalysis: domains
        })
      }

      <article class="annual-domain-card">
        <div class="annual-domain-title">
          <span>원국 · 대운 관계</span>
        </div>
        <p>${escapeHtml(getRelationText(annual))}</p>
      </article>

      <article class="annual-domain-card">
        <div class="annual-domain-title">
          <span>올해 기운</span>
        </div>
        <p>
          천간은 ${escapeHtml(ELEMENT_LABEL[annual.stemElement] ?? "-")},
          지지는 ${escapeHtml(ELEMENT_LABEL[annual.branchElement] ?? "-")}
          기운입니다.
        </p>
      </article>

      <article class="annual-domain-card">
        <div class="annual-domain-title">
          <span>주의</span>
        </div>
        <p>${escapeHtml(reading.caution)}</p>
      </article>
    </div>
  `;
}

/* 전체 렌더 */

export function renderAnnualFortune(
  result,
  usefulGodResult = null
) {
  if (
    !result ||
    !Array.isArray(result.years) ||
    !result.years.length
  ) {
    throw new Error("세운 계산 결과가 없습니다.");
  }

  ensureAnnualFortuneCss();
  ensureAnnualFortuneNav();

  const section = ensureAnnualFortuneSection();

  let initialIndex = result.years.findIndex(
    item => item.isCurrent
  );

  if (initialIndex < 0) {
    initialIndex = 0;
  }

  const initialAnnual = result.years[initialIndex];
  const currentDaeun = initialAnnual.daeun;

  section.hidden = false;

  section.innerHTML = `
    <div class="annual-fortune-inner glass">
      <div class="annual-title-row">
        <div>
          <span class="annual-eyebrow">YEARLY FORTUNE</span>
          <h2>세운 歲運</h2>
          <p>
            대운이라는 큰 흐름 안에서
            해마다 달라지는 운의 변화를 봅니다.
            원국 · 현재 대운 · 해당 연도의
            간지를 함께 해석합니다.
          </p>
        </div>
      </div>

      <div class="annual-summary-grid">
        <article>
          <span>현재 대운</span>
          <strong>${escapeHtml(currentDaeun?.ganji || "-")}</strong>
          <p>
            ${
              currentDaeun
                ? `${escapeHtml(currentDaeun.startAgeLabel)} ~ ${escapeHtml(currentDaeun.endAgeLabel)}`
                : "현재 대운 정보를 확인할 수 없습니다."
            }
          </p>
        </article>

        <article>
          <span>현재 세운</span>
          <strong>${result.currentAnnualYear}년</strong>
          <p>
            ${escapeHtml(initialAnnual.ganji)}
            ·
            ${escapeHtml(initialAnnual.stemKorean)}
            ${escapeHtml(initialAnnual.branchKorean)}
          </p>
        </article>

        <article>
          <span>연도 경계</span>
          <strong>입춘</strong>
          <p>
            세운은 1월 1일이 아니라
            입춘부터 다음 해 입춘 전까지를
            한 해의 운으로 봅니다.
          </p>
        </article>

        <article>
          <span>해석 기준</span>
          <strong>원국 + 대운 + 세운</strong>
          <p>
            원국의 기본 구조 위에
            대운과 해당 연도의 간지를
            겹쳐서 종합합니다.
          </p>
        </article>
      </div>

      <div class="annual-guide">
        <strong>어떻게 보면 되나요?</strong>
        <p>
          각 카드는 입춘부터 다음 해
          입춘 전까지의 한 해 흐름입니다.
          위 십성은 세운 천간,
          아래 십성은 세운 지지의 본기를
          일간과 비교한 결과입니다.
          <b>현재</b> 표시가 지금 지나고 있는 세운이며,
          아래 상세해석에서는
          <b>원국 + 대운 + 세운을 종합했을 때
          가장 힘이 실리는 영역을 색으로 강조</b>합니다.
        </p>
      </div>

      <div class="annual-card-grid">
        ${
          result.years
            .map((annual, index) =>
              buildAnnualCard(
                annual,
                index,
                usefulGodResult
              )
            )
            .join("")
        }
      </div>

      <section
        class="annual-detail"
        id="annualFortuneDetail"
      >
        ${
          buildAnnualDetail(
            initialAnnual,
            usefulGodResult
          )
        }
      </section>

      <p class="annual-note">
        ※ ${escapeHtml(result.convention)}
        ${escapeHtml(result.note)}
        영역 강조는 사이트의 종합 해석 지표이며
        명리학에 공통된 절대 점수는 아닙니다.
      </p>
    </div>
  `;

  const detail = section.querySelector(
    "#annualFortuneDetail"
  );

  const buttons = section.querySelectorAll(
    "[data-annual-index]"
  );

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.annualIndex);
      const annual = result.years[index];

      if (!annual) {
        return;
      }

      buttons.forEach(item => {
        item.classList.remove("is-selected");
      });

      button.classList.add("is-selected");

      detail.innerHTML = buildAnnualDetail(
        annual,
        usefulGodResult
      );
    });
  });

  buttons[initialIndex]?.classList.add("is-selected");

  return section;
}