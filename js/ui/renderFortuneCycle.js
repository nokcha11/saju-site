import {
  EDUCATION_LABELS,
  analyzeEducationDomains,
  getEducationReading
} from "../calculators/educationFortune.js";

import {
  getTwelveStage
} from "../calculators/twelveStages.js";

/* 대운 기본 데이터 */

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

const BRANCH_ELEMENT = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water"
};

const STEM_KOREAN = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계"
};

const BRANCH_KOREAN = {
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해"
};

/* 절입 설명 */

const JEOL_DESCRIPTIONS = {
  소한:
    "한겨울의 찬 기운이 깊어지는 절기입니다.",
  입춘:
    "봄 기운이 시작되는 절기이며 명리에서는 해의 경계를 볼 때도 중요합니다.",
  경칩:
    "봄기운이 본격적으로 움직이기 시작하는 절기입니다.",
  청명:
    "봄 기운이 맑고 뚜렷해지는 절기입니다.",
  입하:
    "여름 기운이 시작되는 절기입니다.",
  망종:
    "초여름에서 한여름으로 넘어가는 흐름의 절기입니다.",
  소서:
    "본격적인 여름 더위가 시작되는 절기입니다.",
  입추:
    "가을 기운이 시작되는 절기입니다.",
  백로:
    "초가을의 서늘함이 뚜렷해지는 절기입니다.",
  한로:
    "가을의 찬 기운과 건조함이 깊어지는 절기입니다.",
  입동:
    "겨울 기운이 시작되는 절기입니다.",
  대설:
    "겨울의 찬 기운이 본격적으로 강해지는 절기입니다."
};

/* 지지 관계 */

const SIX_HARMONY = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"]
];

const SIX_CLASH = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"]
];

/* 십성 해석 */

const TEN_GOD_READING = {
  비견: {
    core:
      "내 판단과 주도권이 강해지는 시기입니다.",
    work:
      "남이 정해주는 역할보다 직접 판단하고 맡아서 추진하는 일이 잘 맞습니다.",
    money:
      "수입 확대보다 자신의 기반을 지키는 것이 중요하며 동료·지인과의 금전 분담은 명확하게 하는 편이 좋습니다.",
    relation:
      "내 생활방식과 기준이 분명해지므로 서로의 영역을 존중하는 관계가 중요합니다.",
    caution:
      "혼자 결정하고 밀어붙이는 패턴이 과해지지 않도록 조율이 필요합니다."
  },

  겁재: {
    core:
      "경쟁과 사람의 영향이 강해지는 시기입니다.",
    work:
      "경쟁·협업·인맥을 통해 기회가 생기지만 역할과 책임을 분명하게 나누는 것이 중요합니다.",
    money:
      "사람과 관련된 지출이나 공동 자금 문제는 평소보다 신중하게 관리하는 편이 좋습니다.",
    relation:
      "새로운 사람과의 접점은 늘 수 있지만 서로의 주도권이 충돌하지 않도록 조율이 필요합니다.",
    caution:
      "경쟁심이나 주변 사람의 결정에 휩쓸리지 않는 것이 중요합니다."
  },

  식신: {
    core:
      "가지고 있는 능력을 꾸준히 결과로 만드는 시기입니다.",
    work:
      "기술·기획·제작·콘텐츠처럼 실제 결과물을 쌓는 일이 잘 맞습니다.",
    money:
      "자신의 기술이나 경험을 실제 수입으로 연결하는 흐름이 중요합니다.",
    relation:
      "관계가 비교적 편안하게 이어지기 쉬우며 함께 즐길 수 있는 활동이 관계에 도움이 됩니다.",
    caution:
      "해야 할 일을 지나치게 많이 벌여 체력과 시간을 소모하지 않는 것이 중요합니다."
  },

  상관: {
    core:
      "표현과 변화 욕구가 강해지는 시기입니다.",
    work:
      "기존 방식보다 새로운 방법을 시도하거나 자신의 의견을 직접 드러내는 일이 많아질 수 있습니다.",
    money:
      "새로운 수입 방식을 만들 수 있지만 변동성이 커질 수 있어 계획적인 관리가 필요합니다.",
    relation:
      "감정을 숨기기보다 직접 표현하는 경향이 강해질 수 있습니다.",
    caution:
      "말이나 표현이 너무 강해져 조직·상사·가까운 사람과 충돌하지 않도록 주의하는 것이 좋습니다."
  },

  편재: {
    core:
      "외부 활동과 현실적인 기회가 많아지는 시기입니다.",
    work:
      "프로젝트·영업·사업·외부 활동처럼 사람과 기회를 넓게 접하는 일이 활발해질 수 있습니다.",
    money:
      "돈의 흐름이 커질 수 있으므로 버는 것만큼 지출과 자금관리가 중요합니다.",
    relation:
      "사람을 만나는 범위가 넓어지고 새로운 인연의 접점이 늘어날 수 있습니다.",
    caution:
      "여러 기회를 동시에 잡으려다 시간·돈·에너지가 분산되지 않도록 선택과 집중이 필요합니다."
  },

  정재: {
    core:
      "생활과 재정을 안정시키는 힘이 강해지는 시기입니다.",
    work:
      "꾸준한 업무·장기 프로젝트·안정적인 성과를 쌓는 방식이 잘 맞습니다.",
    money:
      "고정적인 수입과 지출 관리, 저축처럼 안정적인 재정 흐름을 만드는 데 유리합니다.",
    relation:
      "관계에서도 현실적인 안정과 신뢰를 중요하게 보게 됩니다.",
    caution:
      "안정을 지키려다 변화가 필요한 상황에서도 지나치게 보수적으로 판단하지 않는 것이 좋습니다."
  },

  편관: {
    core:
      "책임과 압박이 커지면서 행동력이 요구되는 시기입니다.",
    work:
      "경쟁·책임·난도가 높은 역할을 맡을 가능성이 커지며 이를 잘 넘기면 경력으로 남기기 좋습니다.",
    money:
      "성과를 위해 쓰는 비용과 책임이 커질 수 있으므로 무리한 금전 부담은 피하는 것이 좋습니다.",
    relation:
      "관계에서도 상대와의 힘겨루기나 긴장감이 커지지 않도록 조율이 필요합니다.",
    caution:
      "과도한 업무와 압박을 계속 혼자 감당하지 않는 것이 중요합니다."
  },

  정관: {
    core:
      "직업·책임·평판처럼 사회적인 기준이 중요해지는 시기입니다.",
    work:
      "취업·승진·직책·공적인 평가처럼 조직 안에서 자리를 잡는 흐름과 잘 연결됩니다.",
    money:
      "큰 변동보다 안정적인 직업과 규칙적인 수입을 만드는 방향이 중요합니다.",
    relation:
      "관계를 가볍게 보기보다 책임과 장기적인 안정성을 중요하게 보게 됩니다.",
    caution:
      "규칙과 책임을 지나치게 완벽하게 지키려다 스스로 압박하지 않는 것이 좋습니다."
  },

  편인: {
    core:
      "전문성·새로운 지식·독자적인 생각이 강해지는 시기입니다.",
    work:
      "연구·기획·전문기술처럼 깊게 파고드는 일이 잘 맞습니다.",
    money:
      "즉각적인 수입보다 전문성이나 기술을 쌓아 이후 수입으로 연결하는 흐름에 가깝습니다.",
    relation:
      "혼자 생각하는 시간이 늘 수 있으므로 가까운 사람과의 소통을 의식적으로 유지하는 것이 좋습니다.",
    caution:
      "생각과 준비만 계속 늘리고 실행을 미루지 않는 것이 중요합니다."
  },

  정인: {
    core:
      "배움·준비·지원이 중요한 시기입니다.",
    work:
      "공부·자격증·교육·멘토링처럼 능력을 보강하는 과정이 이후 경력에 도움이 됩니다.",
    money:
      "당장의 큰 수입보다 실력과 기반을 쌓는 데 투자하는 흐름과 잘 맞습니다.",
    relation:
      "도움을 주고받는 안정적인 관계가 중요한 역할을 합니다.",
    caution:
      "충분히 준비했다면 계속 공부만 하기보다 실제 지원·취업·실행으로 연결하는 것이 중요합니다."
  }
};

/* 영역 종합 판정 */

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

const DOMAIN_LABEL = {
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

/* CSS 연결 */

function ensureFortuneCycleCss() {
  const already = Array.from(document.styleSheets).some(
    sheet => sheet.href?.includes("fortune-cycle.css")
  );

  if (already) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./css/fortune-cycle.css";
  link.dataset.fortuneCycleCss = "true";
  document.head.appendChild(link);
}

/* 상단 메뉴 */

function ensureFortuneCycleNav() {
  const nav = document.querySelector(".site-nav");

  if (!nav) {
    return;
  }

  let link = nav.querySelector(
    'a[href="#fortuneCycleSection"]'
  );

  if (!link) {
    link = document.createElement("a");
    link.href = "#fortuneCycleSection";
    link.textContent = "대운";

    const sinsalLink = nav.querySelector(
      'a[href="#sinsalSection"]'
    );

    const todayLink = nav.querySelector(
      'a[href="#today"]'
    );

    if (sinsalLink) {
      sinsalLink.after(link);
    } else if (todayLink) {
      todayLink.before(link);
    } else {
      nav.appendChild(link);
    }
  }

  if (link.dataset.fortuneBound === "true") {
    return;
  }

  link.dataset.fortuneBound = "true";

  link.addEventListener("click", event => {
    event.preventDefault();

    const section = document.getElementById(
      "fortuneCycleSection"
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
      "#fortuneCycleSection"
    );
  });
}

/* 독립 섹션 생성 */

function ensureFortuneCycleSection() {
  let section = document.getElementById(
    "fortuneCycleSection"
  );

  if (section) {
    return section;
  }

  section = document.createElement("section");
  section.id = "fortuneCycleSection";
  section.className =
    "page-section fortune-cycle-section";

  const sinsal = document.getElementById(
    "sinsalSection"
  );

  const today = document.getElementById("today");

  if (sinsal) {
    sinsal.after(section);
  } else if (today) {
    today.before(section);
  } else {
    document.querySelector(".app")?.appendChild(section);
  }

  return section;
}

/* 원국 데이터 */

function hasPair(first, second, pairs) {
  return pairs.some(
    ([a, b]) =>
      (first === a && second === b) ||
      (first === b && second === a)
  );
}

function normalizeBranch(pillar) {
  if (!pillar) {
    return "";
  }

  if (typeof pillar === "string") {
    return Array.from(pillar)[1] ?? "";
  }

  return (
    pillar.branch ??
    Array.from(pillar.hanja ?? "")[1] ??
    ""
  );
}

function getDayStem(result) {
  const day = result?.pillars?.day;

  if (!day) {
    return "";
  }

  if (typeof day === "string") {
    return Array.from(day)[0] ?? "";
  }

  return (
    day.stem ??
    Array.from(day.hanja ?? "")[0] ??
    ""
  );
}

function getCycleRelations(cycle, pillars) {
  const positions = [
    ["년지", normalizeBranch(pillars?.year)],
    ["월지", normalizeBranch(pillars?.month)],
    ["일지", normalizeBranch(pillars?.day)],
    ["시지", normalizeBranch(pillars?.hour)]
  ];

  const relations = [];

  positions.forEach(([label, branch]) => {
    if (!branch) {
      return;
    }

    if (hasPair(cycle.branch, branch, SIX_HARMONY)) {
      relations.push(`${label} ${branch}와 육합`);
    }

    if (hasPair(cycle.branch, branch, SIX_CLASH)) {
      relations.push(`${label} ${branch}와 충`);
    }
  });

  return relations;
}

/* 용신·희신·기신·구신 상태 */

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

/* 대운 도움·부담 */

function analyzeCycleBalance(cycle, usefulGod) {
  const stemElement = STEM_ELEMENT[cycle.stem];
  const branchElement = BRANCH_ELEMENT[cycle.branch];

  const stemStatus = getElementStatus(
    stemElement,
    usefulGod
  );

  const branchStatus = getElementStatus(
    branchElement,
    usefulGod
  );

  const scoreMap = {
    yongsin: 2,
    huisin: 1,
    neutral: 0,
    gusin: -1,
    gisin: -2
  };

  const score =
    scoreMap[stemStatus] +
    scoreMap[branchStatus];

  if (score >= 3) {
    return {
      score,
      label: "도움이 큰 대운",
      text:
        "용신·희신 기운이 함께 들어와 원국의 부족한 부분을 보완하기 좋은 흐름입니다.",
      stemElement,
      branchElement
    };
  }

  if (score >= 1) {
    return {
      score,
      label: "도움이 있는 대운",
      text:
        "전체적으로 원국에 도움이 되는 기운이 포함되어 있어 활용하기 좋은 흐름입니다.",
      stemElement,
      branchElement
    };
  }

  if (score <= -3) {
    return {
      score,
      label: "부담이 큰 대운",
      text:
        "기신·구신 기운의 영향이 커지므로 무리하게 일을 늘리기보다 조절과 관리가 중요한 흐름입니다.",
      stemElement,
      branchElement
    };
  }

  if (score <= -1) {
    return {
      score,
      label: "조절이 필요한 대운",
      text:
        "부담이 되는 기운이 일부 들어오므로 성과를 무리하게 늘리기보다 자신의 여력을 관리하는 것이 중요합니다.",
      stemElement,
      branchElement
    };
  }

  return {
    score,
    label: "혼합 대운",
    text:
      "도움과 부담이 함께 존재하므로 어떤 선택을 하느냐에 따라 체감이 달라질 수 있는 흐름입니다.",
    stemElement,
    branchElement
  };
}

/* 생활 영역 점수 */

function applyTenGodDomainScore(
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

function applyNatalRelationDomainScore(
  scores,
  relations
) {
  if (!Array.isArray(relations)) {
    return;
  }

  relations.forEach(relationText => {
    const text = String(relationText ?? "");
    const isHarmony = text.includes("육합");
    const isClash = text.includes("충");

    if (!isHarmony && !isClash) {
      return;
    }

    const sign = isHarmony ? 1 : -1;

    if (text.startsWith("월지")) {
      scores.career += 0.65 * sign;
      scores.wealth += 0.20 * sign;
    }

    if (text.startsWith("일지")) {
      scores.relationship += 0.80 * sign;
      scores.health += 0.15 * sign;
    }

    if (text.startsWith("년지")) {
      scores.career += 0.20 * sign;
      scores.relationship += 0.25 * sign;
    }

    if (text.startsWith("시지")) {
      scores.health += 0.20 * sign;
      scores.relationship += 0.15 * sign;
    }
  });
}

function applySpouseDomainScore(scores, cycle) {
  const gender =
    document.querySelector(
      'input[name="gender"]:checked'
    )?.value ?? "";

  const spouseStars =
    gender === "male"
      ? ["정재", "편재"]
      : gender === "female"
        ? ["정관", "편관"]
        : [];

  if (spouseStars.includes(cycle.stemTenGod)) {
    scores.relationship += 0.60;
  }

  if (spouseStars.includes(cycle.branchTenGod)) {
    scores.relationship += 0.50;
  }
}

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

function analyzeCycleDomains(
  cycle,
  result,
  usefulGod
) {
  const scores = {
    career: 0,
    wealth: 0,
    relationship: 0,
    health: 0
  };

  applyTenGodDomainScore(
    scores,
    cycle.stemTenGod,
    1.00,
    usefulGod
  );

  applyTenGodDomainScore(
    scores,
    cycle.branchTenGod,
    0.85,
    usefulGod
  );

  const relations = getCycleRelations(
    cycle,
    result.pillars
  );

  applyNatalRelationDomainScore(scores, relations);
  applySpouseDomainScore(scores, cycle);

  const education = analyzeEducationDomains(
    [
      {
        ...cycle,
        label: "대운",
        stemFactor: 1,
        branchFactor: 0.85
      }
    ],
    usefulGod
  );

  Object.assign(scores, education.scores);

  const ranking = Object.entries(scores).sort(
    (first, second) => second[1] - first[1]
  );

  const strongest = ranking[0] ?? ["career", 0];

  let badge = "이 대운에서 가장 강한 운";

  if (strongest[1] < 0.5) {
    badge =
      "이 대운에서 상대적으로 힘이 실리는 영역";
  }

  return {
    scores,
    education,
    ranking,
    strongestKey: strongest[0],
    strongestScore: strongest[1],
    strongestLabel: DOMAIN_LABEL[strongest[0]],
    badge
  };
}

/* 현재 대운 */

function getCurrentAgeDecimal(birthDate) {
  if (!birthDate) {
    return -1;
  }

  const birth = new Date(
    `${birthDate}T12:00:00`
  );

  const now = new Date();

  return (
    (now.getTime() - birth.getTime()) /
    (365.2422 * 86400000)
  );
}

function getCurrentCycleIndex(result) {
  const age = getCurrentAgeDecimal(
    result.birth?.date
  );

  if (age < 0) {
    return -1;
  }

  return result.cycles.findIndex(
    cycle =>
      age >= cycle.startAge &&
      age < cycle.endAge
  );
}

/* 해석 도움 함수 */

function getTenGodReading(tenGod) {
  return (
    TEN_GOD_READING[tenGod] ?? {
      core:
        "원국과 대운의 기운을 함께 보아야 하는 시기입니다.",
      work:
        "직업에서는 현재 상황과 원국의 흐름을 함께 확인하는 것이 좋습니다.",
      money:
        "재물은 수입과 지출의 균형을 함께 관리하는 것이 중요합니다.",
      relation:
        "관계에서는 상대와의 소통과 조율이 중요합니다.",
      caution:
        "한쪽으로 지나치게 치우치지 않는 것이 좋습니다."
    }
  );
}

function getElementLifeReading(element) {
  switch (element) {
    case "wood":
      return "전통 오행 기준으로는 눈·근육·간담 계통을 생활 관리 체크포인트로 봅니다. 장시간 같은 자세나 과로를 줄이는 것이 좋습니다.";

    case "fire":
      return "전통 오행 기준으로는 열감·순환·눈과 관련된 부분을 생활 관리 체크포인트로 봅니다. 과열되듯 무리하는 생활을 피하는 편이 좋습니다.";

    case "earth":
      return "전통 오행 기준으로는 위장·소화·복부를 생활 관리 체크포인트로 봅니다. 불규칙한 식사와 과로를 줄이는 것이 좋습니다.";

    case "metal":
      return "전통 오행 기준으로는 호흡기·코·피부를 생활 관리 체크포인트로 봅니다. 건조함과 생활 리듬 관리가 중요합니다.";

    case "water":
      return "전통 오행 기준으로는 허리·귀·비뇨 계통을 생활 관리 체크포인트로 봅니다. 수면 부족과 장시간 과로를 줄이는 편이 좋습니다.";

    default:
      return "특정 신체 문제를 단정하기보다 생활 리듬과 과로 여부를 함께 관리하는 것이 좋습니다.";
  }
}

function getJeolExplanation(result) {
  const name = result.referenceJeol?.name ?? "";

  const seasonal =
    JEOL_DESCRIPTIONS[name] ??
    "계절의 기운이 바뀌는 절기입니다.";

  const directionText =
    result.referenceJeol?.directionText ??
    "기준 절입";

  const directionExplain =
    result.direction?.key === "forward"
      ? "순행은 출생 후 다음 절입까지의 시간을 사용합니다."
      : "역행은 출생 전 이전 절입까지의 시간을 사용합니다.";

  return (
    `${seasonal} ` +
    `대운에서는 ${directionText}까지의 시간 차이를 대운 시작 나이 계산에 사용합니다. ` +
    directionExplain
  );
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

/* 대운 선택 카드 */

function buildCycleCard(
  cycle,
  index,
  currentIndex,
  usefulGod,
  dayStem
) {
  const analysis = analyzeCycleBalance(
    cycle,
    usefulGod
  );

  const isCurrent = index === currentIndex;
  const stage = getTwelveStage(dayStem, cycle.branch);

  const stemElement =
    STEM_ELEMENT[cycle.stem] ?? "neutral";

  const branchElement =
    BRANCH_ELEMENT[cycle.branch] ?? "neutral";

  return `
    <button
      type="button"
      class="fortune-cycle-card ${isCurrent ? "is-current" : ""}"
      data-cycle-index="${index}"
      aria-label="${escapeHtml(cycle.ganji)} 대운 보기"
    >
      <div class="fortune-cycle-card-top">
        <span>${cycle.index}대운</span>
        ${isCurrent ? "<em>현재</em>" : ""}
      </div>

      <div class="fortune-cycle-age-line">
        <strong>${escapeHtml(cycle.startAgeLabel)}</strong>
        <span>부터</span>
      </div>

      <div class="fortune-cycle-upper-god">
        ${escapeHtml(cycle.stemTenGod)}
      </div>

      <div class="fortune-cycle-pillar-stack">
        <div class="fortune-cycle-pillar is-${stemElement}">
          <strong>${escapeHtml(cycle.stem)}</strong>
          <span>${escapeHtml(STEM_KOREAN[cycle.stem] ?? "")}</span>
        </div>

        <div class="fortune-cycle-pillar is-${branchElement}">
          <strong>${escapeHtml(cycle.branch)}</strong>
          <span>${escapeHtml(BRANCH_KOREAN[cycle.branch] ?? "")}</span>
        </div>
      </div>

      <div class="fortune-cycle-lower-god">
        ${escapeHtml(cycle.branchTenGod)}
      </div>

      <div class="fortune-cycle-stage">
        ${escapeHtml(stage || "-")}
      </div>

      <div class="fortune-cycle-card-period">
        <span>
          ${escapeHtml(cycle.startAgeLabel)}
          ~
          ${escapeHtml(cycle.endAgeLabel)}
        </span>
        <small>${cycle.startYear} ~ ${cycle.endYear}</small>
      </div>

      <b class="fortune-cycle-balance ${getBalanceClass(analysis.score)}">
        ${escapeHtml(analysis.label)}
      </b>
    </button>
  `;
}

/* 상세 영역 카드 */

function buildCycleDomainCard({
  key,
  title,
  text,
  domainAnalysis
}) {
  const strongest =
    domainAnalysis.strongestKey === key;

  const rankMeta = getDomainRankMeta(
    domainAnalysis,
    key
  );

  const cardClassName = [
    "fortune-cycle-domain-card"
  ];

  if (strongest) {
    cardClassName.push("is-strongest");
  }

  if (rankMeta) {
    cardClassName.push(`is-rank-${rankMeta.rank}`);
  }

  return `
    <article class="${cardClassName.join(" ")}">
      <div class="fortune-cycle-domain-title">
        <span>${escapeHtml(title)}</span>

        <div class="fortune-cycle-domain-meta">
          ${
            rankMeta
              ? `
                <b class="fortune-cycle-domain-rank-badge rank-${rankMeta.rank}">
                  ${rankMeta.rank}위 · ${escapeHtml(formatRankScore(rankMeta.score))}
                </b>
              `
              : ""
          }

          ${
            strongest
              ? `
                <em class="fortune-cycle-domain-peak">
                  ★ ${escapeHtml(domainAnalysis.badge)}
                </em>
              `
              : ""
          }
        </div>
      </div>

      <p>${escapeHtml(text)}</p>

      ${
        strongest
          ? `
            <small class="fortune-cycle-domain-reason">
              원국의 용신·희신·기신·구신,
              이 대운의 천간·지지 십성,
              원국과의 합·충 관계를 함께 보면
              이 영역에 상대적으로 가장 힘이 실립니다.
            </small>
          `
          : ""
      }
    </article>
  `;
}

/* 선택 대운 상세 */

function buildCycleDetail(cycle, result, usefulGod) {
  const stemReading = getTenGodReading(
    cycle.stemTenGod
  );

  const branchReading = getTenGodReading(
    cycle.branchTenGod
  );

  const balance = analyzeCycleBalance(
    cycle,
    usefulGod
  );

  const relations = getCycleRelations(
    cycle,
    result.pillars
  );

  const domains = analyzeCycleDomains(
    cycle,
    result,
    usefulGod
  );

  const mainElement =
    balance.branchElement ?? balance.stemElement;

  const dayStem = getDayStem(result);
  const stage = getTwelveStage(dayStem, cycle.branch);

  const ganjiKorean =
    `${STEM_KOREAN[cycle.stem] ?? ""}` +
    `${BRANCH_KOREAN[cycle.branch] ?? ""}`;

  return `
    <div class="fortune-cycle-detail-head">
      <div>
        <span>선택한 대운</span>

        <h3>
          ${escapeHtml(cycle.ganji)}
          <small>${escapeHtml(ganjiKorean)}</small>
          대운
        </h3>

        <p>
          ${escapeHtml(cycle.startAgeLabel)}
          ~
          ${escapeHtml(cycle.endAgeLabel)}
          · ${cycle.startYear} ~ ${cycle.endYear}
          · 천간 ${escapeHtml(cycle.stemTenGod)}
          · 지지 ${escapeHtml(cycle.branchTenGod)}
          ${stage ? ` · 12운성 ${escapeHtml(stage)}` : ""}
        </p>
      </div>

      <div class="fortune-cycle-detail-status ${getBalanceClass(balance.score)}">
        ${escapeHtml(balance.label)}
      </div>
    </div>

    <div class="fortune-cycle-detail-summary">
      <span>이 10년의 핵심</span>
      <strong>
        ${escapeHtml(stemReading.core)}
        ${escapeHtml(balance.text)}
      </strong>
    </div>

    <div class="fortune-cycle-strongest-summary">
      <div>
        <span>원국 + 대운 종합</span>
        <strong>${escapeHtml(domains.strongestLabel)}</strong>
      </div>

      <p>
        ${escapeHtml(domains.badge)}입니다.
        원국의 도움·부담 기운과
        이 대운의 십성,
        원국과의 육합·충을 함께 반영했습니다.
      </p>
    </div>

    <div class="fortune-cycle-detail-grid">
      ${
        Object.entries(EDUCATION_LABELS)
          .map(([key, title]) =>
            buildCycleDomainCard({
              key,
              title,
              text: getEducationReading(
                key,
                domains.education,
                "이 대운"
              ),
              domainAnalysis: domains
            })
          )
          .join("")
      }

      ${
        buildCycleDomainCard({
          key: "career",
          title: "직업 · 취업",
          text: stemReading.work,
          domainAnalysis: domains
        })
      }

      ${
        buildCycleDomainCard({
          key: "wealth",
          title: "재물",
          text: stemReading.money,
          domainAnalysis: domains
        })
      }

      ${
        buildCycleDomainCard({
          key: "relationship",
          title: "연애 · 관계",
          text: branchReading.relation,
          domainAnalysis: domains
        })
      }

      ${
        buildCycleDomainCard({
          key: "health",
          title: "건강 · 생활",
          text: getElementLifeReading(mainElement),
          domainAnalysis: domains
        })
      }

      <article class="fortune-cycle-domain-card">
        <div class="fortune-cycle-domain-title">
          <span>원국과의 관계</span>
        </div>
        <p>
          ${
            relations.length
              ? escapeHtml(relations.join(" · "))
              : "현재 대운 지지와 원국에서 강하게 표시되는 육합·충 관계는 없습니다."
          }
        </p>
      </article>

      <article class="fortune-cycle-domain-card">
        <div class="fortune-cycle-domain-title">
          <span>주의</span>
        </div>
        <p>${escapeHtml(stemReading.caution)}</p>
      </article>
    </div>
  `;
}

/* 전체 렌더 */

export function renderFortuneCycle(
  result,
  usefulGodResult = null
) {
  if (!result || !Array.isArray(result.cycles)) {
    throw new Error("대운 계산 결과가 없습니다.");
  }

  ensureFortuneCycleCss();
  ensureFortuneCycleNav();

  const section = ensureFortuneCycleSection();
  const currentIndex = getCurrentCycleIndex(result);

  const initialIndex =
    currentIndex >= 0 ? currentIndex : 0;

  const dayStem = getDayStem(result);

  section.hidden = false;

  section.innerHTML = `
    <div class="fortune-cycle-inner glass">
      <div class="fortune-cycle-title">
        <div>
          <span class="fortune-cycle-eyebrow">
            10-YEAR FORTUNE CYCLE
          </span>
          <h2>대운 大運</h2>
          <p>
            약 10년 단위로 바뀌는 인생의 큰 흐름입니다.
            현재 대운과 각 시기의 직업·재물·관계·생활 흐름을 확인합니다.
          </p>
        </div>

        <div class="fortune-cycle-direction">
          <span>대운 방향</span>
          <strong>${escapeHtml(result.direction.label)}</strong>
          <small>
            ${escapeHtml(result.direction.polarityLabel)}
            · ${result.direction.gender === "male" ? "남성" : "여성"}
          </small>
        </div>
      </div>

      <div class="fortune-cycle-summary-grid">
        <article>
          <span>순행 · 역행</span>
          <strong>${escapeHtml(result.direction.label)}</strong>
          <p>
            ${escapeHtml(result.direction.polarityLabel)}
            년생
            ${result.direction.gender === "male" ? "남성" : "여성"}
            기준으로 대운 방향을 정했습니다.
          </p>
        </article>

        <article>
          <span>대운 시작</span>
          <strong>${escapeHtml(result.startAge.label)}</strong>
          <p>
            출생 시각과 기준 절입까지의 시간 차이를
            대운수로 환산한 결과입니다.
          </p>
        </article>

        <article class="fortune-cycle-jeol-card">
          <span>기준 절입</span>
          <strong>${escapeHtml(result.referenceJeol.name)}</strong>
          <p>${escapeHtml(getJeolExplanation(result))}</p>
        </article>

        <article>
          <span>계산 기준</span>
          <strong>3일 = 1년</strong>
          <p>
            절입까지 3일 차이를
            대운 시작 나이 1년으로 환산하는
            전통 계산 방식입니다.
          </p>
        </article>
      </div>

      <div class="fortune-cycle-guide">
        <strong>어떻게 보면 되나요?</strong>
        <p>
          카드의 위쪽 십성은 <b>대운 천간</b>,
          아래쪽 십성은 <b>대운 지지의 본기</b>를
          일간과 비교한 결과입니다.
          한자 옆 한글은 간지 읽는 법이고,
          색은 목·화·토·금·수 오행을 뜻합니다.
          <b>현재</b> 표시가 지금 지나고 있는 대운입니다.
          아래 상세 해석에서는
          <b>원국과 해당 대운을 종합했을 때
          가장 힘이 실리는 영역 한 곳만 색으로 강조</b>합니다.
        </p>
      </div>

      <div class="fortune-cycle-list">
        ${
          result.cycles
            .map((cycle, index) =>
              buildCycleCard(
                cycle,
                index,
                currentIndex,
                usefulGodResult,
                dayStem
              )
            )
            .join("")
        }
      </div>

      <section
        class="fortune-cycle-detail"
        id="fortuneCycleDetail"
      >
        ${
          buildCycleDetail(
            result.cycles[initialIndex],
            result,
            usefulGodResult
          )
        }
      </section>

      <p class="fortune-cycle-note">
        ※ ${escapeHtml(result.convention)} 기준입니다.
        ${escapeHtml(result.note)}
        강조 영역은 사이트의 종합 해석용 상대 지표이며
        명리학에 공통된 절대 점수는 아닙니다.
      </p>
    </div>
  `;

  const detail = section.querySelector(
    "#fortuneCycleDetail"
  );

  const buttons = section.querySelectorAll(
    "[data-cycle-index]"
  );

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.cycleIndex);
      const cycle = result.cycles[index];

      if (!cycle) {
        return;
      }

      buttons.forEach(item => {
        item.classList.remove("is-selected");
      });

      button.classList.add("is-selected");

      detail.innerHTML = buildCycleDetail(
        cycle,
        result,
        usefulGodResult
      );
    });
  });

  buttons[initialIndex]?.classList.add("is-selected");

  return section;
}