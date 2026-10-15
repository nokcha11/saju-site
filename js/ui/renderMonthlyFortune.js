import {
  EDUCATION_LABELS,
  getEducationReading
} from "../calculators/educationFortune.js";

/* 월운 영역 이름 */

const DOMAIN_LABELS = {
  ...EDUCATION_LABELS,
  career: "직업 · 취업",
  wealth: "재물",
  relationship: "연애 · 관계",
  health: "건강 · 생활"
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

function ensureMonthlyFortuneCss() {
  const already = Array.from(document.styleSheets).some(
    sheet => sheet.href?.includes("monthly-fortune.css")
  );

  if (already) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./css/monthly-fortune.css";
  link.dataset.monthlyFortuneCss = "true";
  document.head.appendChild(link);
}

/* 상단 메뉴 */

function ensureMonthlyFortuneNav() {
  const nav = document.querySelector(".site-nav");

  if (!nav) {
    return;
  }

  let link = nav.querySelector(
    'a[href="#monthlyFortuneSection"]'
  );

  if (!link) {
    link = document.createElement("a");
    link.href = "#monthlyFortuneSection";
    link.textContent = "월운";

    const annualLink = nav.querySelector(
      'a[href="#annualFortuneSection"]'
    );

    const todayLink = nav.querySelector(
      'a[href="#today"]'
    );

    if (annualLink) {
      annualLink.after(link);
    } else if (todayLink) {
      todayLink.before(link);
    } else {
      nav.appendChild(link);
    }
  }

  if (link.dataset.monthlyBound === "true") {
    return;
  }

  link.dataset.monthlyBound = "true";

  link.addEventListener("click", event => {
    event.preventDefault();

    const section = document.getElementById(
      "monthlyFortuneSection"
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
      "#monthlyFortuneSection"
    );
  });
}

/* 월운 섹션 생성 */

function ensureMonthlyFortuneSection() {
  let section = document.getElementById(
    "monthlyFortuneSection"
  );

  if (section) {
    return section;
  }

  section = document.createElement("section");
  section.id = "monthlyFortuneSection";
  section.className =
    "page-section monthly-fortune-section";

  const annualSection = document.getElementById(
    "annualFortuneSection"
  );

  const fortuneCycleSection = document.getElementById(
    "fortuneCycleSection"
  );

  const today = document.getElementById("today");

  if (annualSection) {
    annualSection.after(section);
  } else if (fortuneCycleSection) {
    fortuneCycleSection.after(section);
  } else if (today) {
    today.before(section);
  } else {
    document.querySelector(".app")?.appendChild(section);
  }

  return section;
}

/* 점수 표시 */

function formatScore(value) {
  const number = Number(value ?? 0);

  return number >= 0
    ? `+${number.toFixed(1)}`
    : number.toFixed(1);
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

/* 합·충 관계 문장 */

function buildRelationText(month) {
  const groups = [
    ["원국", month.natalRelations],
    ["세운", month.annualRelations],
    ["대운", month.daeunRelations]
  ];

  const text = groups.flatMap(
    ([label, relations]) => {
      if (
        !Array.isArray(relations) ||
        !relations.length
      ) {
        return [];
      }

      return relations.map(
        relation => `${label} · ${relation.text}`
      );
    }
  );

  return text.length
    ? text.join(" / ")
    : "원국·대운·세운과 뚜렷한 합·충이 겹치지 않는 달입니다.";
}

/* 기존 생활 영역 해석 */

function getDomainDescription(key, score) {
  const positive = Number(score) >= 1.5;
  const caution = Number(score) < 0;

  const descriptions = {
    career: {
      positive:
        "직업·취업·책임 영역에 힘이 실립니다. 지원, 면접, 업무 추진처럼 밖으로 움직이는 선택을 적극적으로 활용하기 좋습니다.",
      neutral:
        "직업에서는 무리하게 판을 키우기보다 현재 역할을 정리하고 다음 기회를 준비하는 흐름으로 쓰기 좋습니다.",
      caution:
        "직업 영역의 압박이 커질 수 있습니다. 일정과 책임을 한꺼번에 늘리기보다 우선순위를 좁히는 편이 좋습니다."
    },

    wealth: {
      positive:
        "재물·실적·현실 성과에 힘이 실립니다. 수입 구조, 계약, 실적 관리처럼 숫자로 확인되는 결과에 집중하기 좋습니다.",
      neutral:
        "재물은 큰 변화보다 수입과 지출의 균형을 점검하고 현실적인 목표를 유지하는 흐름이 적합합니다.",
      caution:
        "지출이나 경쟁성 소비가 커질 수 있습니다. 큰 결정보다 현금 흐름과 고정비를 먼저 점검하는 편이 좋습니다."
    },

    relationship: {
      positive:
        "연애·대인관계에서 만남과 교류의 힘이 커집니다. 관계를 분명하게 표현하고 필요한 대화를 진행하기 좋은 흐름입니다.",
      neutral:
        "관계에서는 속도를 내기보다 상대의 반응을 확인하면서 균형을 맞추는 편이 좋습니다.",
      caution:
        "관계에서 감정 소모나 힘겨루기가 생기기 쉽습니다. 즉각적인 결론보다 거리와 말의 강도를 조절하는 것이 중요합니다."
    },

    health: {
      positive:
        "생활 리듬을 회복하고 컨디션을 정비하기 좋은 달입니다. 수면·운동·휴식처럼 기본 생활을 안정시키는 데 힘을 쓰기 좋습니다.",
      neutral:
        "건강·생활은 큰 무리 없이 기본 리듬을 유지하는 것이 중요합니다. 과로만 피하면 비교적 안정적으로 관리할 수 있습니다.",
      caution:
        "피로 누적과 생활 리듬 저하에 주의가 필요합니다. 일정이 많아질수록 수면과 회복 시간을 먼저 확보하는 편이 좋습니다."
    }
  };

  const group = descriptions[key];

  if (!group) {
    return "현재 월운의 흐름을 원국·대운·세운과 함께 확인합니다.";
  }

  if (positive) {
    return group.positive;
  }

  if (caution) {
    return group.caution;
  }

  return group.neutral;
}

/* 월 선택 카드 */

function buildMonthCard(month, index) {
  const domains = month.domainAnalysis ?? {};

  return `
    <button
      type="button"
      class="monthly-fortune-card ${month.isCurrent ? "is-current" : ""}"
      data-month-index="${index}"
    >
      <div class="monthly-fortune-card-top">
        <span class="monthly-fortune-month">
          ${escapeHtml(`${month.civilMonth}월`)}
        </span>

        ${
          month.isCurrent
            ? `
              <small class="monthly-current-badge">
                현재
              </small>
            `
            : ""
        }
      </div>

      <div class="monthly-fortune-symbol-row">
        <strong class="monthly-fortune-ganji">
          ${escapeHtml(month.ganji)}
        </strong>
        <span>${escapeHtml(month.monthName)}</span>
      </div>

      <p>
        ${escapeHtml(month.termName)} 시작
        · ${escapeHtml(month.stemTenGod)}
        / ${escapeHtml(month.branchTenGod)}
      </p>

      <small class="monthly-fortune-status">
        ${escapeHtml(domains.strongestLabel ?? "월운 분석")}
      </small>
    </button>
  `;
}

/* 상세 영역 카드 */

function buildDomainCard(key, month) {
  const analysis =
    month.domainAnalysis ?? {
      scores: {},
      strongestKey: ""
    };

  const score = Number(
    analysis.scores?.[key] ?? 0
  );

  const strongest =
    analysis.strongestKey === key;

  const rankMeta = getDomainRankMeta(
    analysis,
    key
  );

  const cardClassName = [
    "monthly-domain-card"
  ];

  if (strongest) {
    cardClassName.push("is-strongest");
  }

  if (rankMeta) {
    cardClassName.push(`is-rank-${rankMeta.rank}`);
  }

  const description =
    EDUCATION_LABELS[key]
      ? getEducationReading(
          key,
          analysis.education,
          "이 달"
        )
      : getDomainDescription(key, score);

  return `
    <article class="${cardClassName.join(" ")}">
      <div class="monthly-domain-title">
        <span>${escapeHtml(DOMAIN_LABELS[key])}</span>
        <div class="monthly-domain-meta">
          <strong>${escapeHtml(formatScore(score))}</strong>

          ${
            rankMeta
              ? `
                <b class="monthly-domain-rank-badge rank-${rankMeta.rank}">
                  ${rankMeta.rank}위 · ${escapeHtml(formatRankScore(rankMeta.score))}
                </b>
              `
              : ""
          }
        </div>
      </div>

      ${
        strongest
          ? `
            <em class="monthly-domain-peak">
              ★ ${escapeHtml(analysis.peakLabel ?? "이 달 가장 강한 운")}
            </em>
          `
          : ""
      }

      <p>${escapeHtml(description)}</p>

      ${
        strongest
          ? `
            <small class="monthly-domain-reason">
              원국의 용신·희신·기신·구신,
              현재 대운,
              올해 세운,
              이 달 월운의 십성 및 합·충을 함께 반영한 결과입니다.
            </small>
          `
          : ""
      }
    </article>
  `;
}

/* 선택 월운 상세 */

function buildMonthlyDetail(month) {
  const analysis = month.domainAnalysis ?? {};

  const daeunText =
    month.daeun
      ? `${month.daeun.ganji} 대운`
      : "대운 정보 없음";

  const annualText =
    month.annual
      ? `${month.annual.ganji} 세운`
      : "세운 정보 없음";

  return `
    <div class="monthly-detail-head">
      <div>
        <span>선택한 월운</span>

        <h3>
          ${escapeHtml(`${month.civilMonth}월`)}
          · ${escapeHtml(month.ganji)}
          <small>${escapeHtml(month.monthName)}</small>
        </h3>

        <p>
          ${escapeHtml(month.periodLabel)}
          · ${escapeHtml(month.termName)} 절입 기준
        </p>
      </div>

      <div class="monthly-detail-status">
        ${month.isCurrent ? "현재 월운" : "월운 분석"}
      </div>
    </div>

    <div class="monthly-flow-row">
      <div>
        <span>대운</span>
        <strong>${escapeHtml(daeunText)}</strong>
      </div>

      <div>
        <span>세운</span>
        <strong>${escapeHtml(annualText)}</strong>
      </div>

      <div>
        <span>월운</span>
        <strong>
          ${escapeHtml(month.ganji)}
          · ${escapeHtml(month.stemTenGod)}
          / ${escapeHtml(month.branchTenGod)}
        </strong>
      </div>
    </div>

    <div class="monthly-strongest-summary">
      <div>
        <span>원국 + 대운 + 세운 + 월운 종합</span>
        <strong>
          ${escapeHtml(analysis.strongestLabel ?? "종합 분석")}
        </strong>
      </div>

      <p>
        ${escapeHtml(analysis.peakLabel ?? "이 달의 상대적인 중심 영역")}입니다.
        상위 1~3위 영역은 아래 카드에서 순위별 테두리와 점수로 표시합니다.
      </p>
    </div>

    <div class="monthly-domain-grid">
      ${
        Object.keys(EDUCATION_LABELS)
          .map(key => buildDomainCard(key, month))
          .join("")
      }

      ${buildDomainCard("career", month)}
      ${buildDomainCard("wealth", month)}
      ${buildDomainCard("relationship", month)}
      ${buildDomainCard("health", month)}
    </div>

    <div class="monthly-relation-box">
      <span>합 · 충 관계</span>
      <p>${escapeHtml(buildRelationText(month))}</p>
    </div>
  `;
}

/* 전체 렌더 */

export function renderMonthlyFortune(result) {
  if (
    !result ||
    !Array.isArray(result.months) ||
    !result.months.length
  ) {
    throw new Error(
      "월운 화면에 표시할 계산 결과가 없습니다."
    );
  }

  ensureMonthlyFortuneCss();
  ensureMonthlyFortuneNav();

  const section = ensureMonthlyFortuneSection();
  const months = result.months;

  let selectedIndex = Number(
    result.currentIndex ?? 0
  );

  if (
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= months.length
  ) {
    selectedIndex = 0;
  }

  section.hidden = false;

  section.innerHTML = `
    <div class="monthly-fortune-inner glass">
      <div class="monthly-fortune-title">
        <div>
          <span class="monthly-fortune-eyebrow">
            MONTHLY FORTUNE
          </span>
          <h2>월운 月運</h2>
          <p>
            원국과 현재 대운·세운 위에 들어오는
            월별 흐름을 절입 기준으로 분석합니다.
          </p>
        </div>

        <div class="monthly-fortune-year">
          <span>분석 세운</span>
          <strong>${escapeHtml(result.annualYear)}</strong>
          <small>
            ${escapeHtml(result.annual?.ganji ?? "")} 세운
          </small>
        </div>
      </div>

      <div class="monthly-fortune-guide">
        <strong>월운 보는 법</strong>
        <p>
          월운은 양력 1일부터가 아니라
          입춘·경칩·청명 등 절입부터 다음 절입 전까지입니다.
          월을 선택하면 원국 + 대운 + 세운 + 월운을 합친
          종합 영역을 아래에서 확인할 수 있습니다.
        </p>
      </div>

      <div class="monthly-fortune-list">
        ${months.map(buildMonthCard).join("")}
      </div>

      <section
        id="monthlyFortuneDetail"
        class="monthly-fortune-detail"
      >
        ${buildMonthlyDetail(months[selectedIndex])}
      </section>

      <p class="monthly-fortune-note">
        ※ 월운의 강조 영역은 절대적인 길흉 단정이 아니라
        원국의 용·희·기·구신, 대운, 세운, 월운의 십성과
        합·충을 함께 본 상대 지표입니다.
      </p>
    </div>
  `;

  const detail = section.querySelector(
    "#monthlyFortuneDetail"
  );

  const buttons = Array.from(
    section.querySelectorAll("[data-month-index]")
  );

  function selectMonth(index) {
    const month = months[index];

    if (!month) {
      return;
    }

    buttons.forEach(button => {
      button.classList.remove("is-selected");
    });

    buttons[index]?.classList.add("is-selected");

    detail.innerHTML = buildMonthlyDetail(month);
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      selectMonth(
        Number(button.dataset.monthIndex)
      );
    });
  });

  selectMonth(selectedIndex);

  return section;
}