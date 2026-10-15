import {
  getDailyDomainReading,
  getDailyActionPlan
} from "../interpreters/dailyDirectReading.js";

import {
  referenceScore
} from "../interpreters/dailyScore.js";

import {
  LOTTO_NUMBER_COUNT
} from "../calculators/lottoNumbers.js";

import {
  DAILY_DOMAINS,
  ELEMENT_LABELS,
  TEN_GOD_ACTION
} from "../data/dailyFortuneGuide.js";

import { STEMS } from "../data/stems.js";
import { BRANCHES } from "../data/branches.js";

const escape = value =>
  String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char])
  );

const formatMoment = moment =>
  new Intl.DateTimeFormat(
    "ko-KR",
    {
      timeZone: "Asia/Seoul",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(moment);

export function renderDailyFortune(result, target) {
  const {
    daily,
    month,
    annual,
    daeun,
    strongestKeys
  } = result;

  const strongest = strongestKeys
    .map(key => DAILY_DOMAINS[key].label)
    .join(" / ");

  const picks = result.lifestyle;
  const scoreSummary = result.scoreSummary;
  const actionPlan = getDailyActionPlan(result);

  const clashes = result.relations.filter(
    item => item.type === "충"
  );

  const joins = result.relations.filter(
    item => item.type !== "충"
  );

  const layerCard = (
    label,
    item,
    description
  ) => `
    <article class="daily-layer-card">
      <span>${label}</span>

      <strong>
        ${item ? escape(item.ganji) : "—"}
      </strong>

      <p>
        ${
          item
            ? `
              <span class="daily-element ${STEMS[item.stem]?.element}">
                ${escape(STEMS[item.stem]?.korean)}
              </span>
              ·
              <span class="daily-element ${BRANCHES[item.branch]?.element}">
                ${escape(BRANCHES[item.branch]?.korean)}
              </span>
              &nbsp;
              ${escape(item.stemTenGod)}
              ·
              ${escape(item.branchTenGod)}
            `
            : "대운 미적용"
        }
      </p>

      <small>${escape(description)}</small>
    </article>
  `;

  target.innerHTML = `
    <div class="daily-headline">
      <div>
        <span class="daily-kicker">
          TODAY'S FLOW
        </span>

        <h3>
          ${escape(daily.ganji)}
          <span>오늘의 일진</span>
        </h3>

        <p>
          ${escape(TEN_GOD_ACTION[daily.stemTenGod])}
        </p>
      </div>

      <div class="daily-overall">
        <span>오늘의 총운 점수</span>

        <strong>
          ${scoreSummary.total}
          <small> / 100</small>
        </strong>

        <p>
          ${escape(scoreSummary.description)}
        </p>
      </div>

      <div class="daily-peak">
        <span>오늘 상대적으로 가장 강한 운</span>
        <strong>${escape(strongest)}</strong>

        <small>
          원국 · 대운 · 세운 · 월운 · 일운 종합
        </small>
      </div>
    </div>

    <div class="daily-layer-grid">
      ${
        layerCard(
          "대운",
          daeun,
          daeun
            ? `${daeun.startAgeLabel} ~ ${daeun.endAgeLabel}`
            : result.beforeFirstCycle
              ? "첫 대운 시작 전입니다."
              : "제공된 대운 기간 밖입니다."
        )
      }

      ${
        layerCard(
          "세운",
          annual,
          `${annual.year}년 · 입춘 기준`
        )
      }

      ${
        layerCard(
          "월운",
          month,
          `${month.termName} ~ 다음 절입`
        )
      }

      ${
        layerCard(
          "일운",
          daily,
          `${result.date} · 자정 기준`
        )
      }
    </div>

    <div
      class="daily-period-grid"
      aria-label="오전 오후 밤 운세 점수"
    >
      ${
        scoreSummary.periods.map(period => `
          <article class="daily-period-card ${
            period.isStrongest ? "is-strongest" : ""
          }">
            <div>
              <b>${period.label}</b>
              <small>${period.range}</small>
            </div>

            <strong>
              ${period.score}
              <small> / 100</small>
            </strong>

            <p>${escape(period.advice)}</p>

            ${
              period.isStrongest
                ? `
                  <span class="daily-strongest-badge">
                    가장 높은 시간대
                  </span>
                `
                : ""
            }
          </article>
        `).join("")
      }
    </div>

    <div class="daily-domain-grid">
      ${
        Object.entries(DAILY_DOMAINS)
          .map(([key, guide]) => {
            const score = result.scores[key];

            const points =
              scoreSummary.domainScores?.[key]
              ?? referenceScore(score);

            const reading =
              getDailyDomainReading(
                result,
                key,
                points
              );

            const isStrongest =
              strongestKeys.includes(key);

            const reasons = [
              ["일운", daily],
              ["월운", month],
              ["세운", annual],
              ["대운", daeun]
            ];

            return `
              <article
                class="daily-domain-card ${
                  isStrongest ? "is-strongest" : ""
                }"
                data-domain="${key}"
              >
                <div class="daily-domain-heading">
                  <span>
                    ${guide.icon} ${guide.label}
                  </span>

                  ${
                    isStrongest
                      ? `
                        <b class="daily-strongest-badge">
                          가장 강한 운
                        </b>
                      `
                      : ""
                  }
                </div>

                <div
                  class="daily-domain-score"
                  aria-label="${escape(guide.label)} ${points}점, 100점 기준"
                >
                  <strong>${points}</strong>
                  <span> / 100</span>
                </div>

                <div
                  class="daily-domain-meter"
                  aria-hidden="true"
                >
                  <i style="--daily-score:${points}%"></i>
                </div>

                <h4>${escape(reading.title)}</h4>

                <p>${escape(reading.reading)}</p>

                <p class="daily-direct-action">
                  ${escape(reading.action)}
                </p>

                <details>
                  <summary>판정 이유 보기</summary>

                  <div class="daily-reasons">
                    ${
                      reasons.map(([label, item]) => `
                        <p>
                          <b>${label}</b>

                          ${
                            item
                              ? `
                                ${escape(item.stemTenGod)}
                                ·
                                ${escape(item.branchTenGod)}
                                · 보정값
                                ${result.contributions[label][key].toFixed(2)}
                              `
                              : "미적용"
                          }
                        </p>
                      `).join("")
                    }

                    <p>
                      ${escape(reading.background)}
                    </p>

                    <p>
                      원국 일간을 기준으로 십성을 계산하고
                      용신·희신·기신과 합·충 관계를
                      보정했습니다.
                    </p>

                    <p>
                      월운의 종합 배경도
                      0.25 비중으로 반영했습니다.
                      이 영역의 내부 비교값:
                      ${score.toFixed(2)}
                    </p>
                  </div>
                </details>
              </article>
            `;
          }).join("")
      }
    </div>

    <div class="daily-action-grid">
      <article class="daily-action-card">
        <span class="daily-kicker">
          DO TODAY
        </span>

        <h4>오늘의 추천행동</h4>

        <p class="daily-action-caption">
          상대적으로 힘이 실리는 영역부터
          작은 행동으로 옮겨보세요.
        </p>

        <ul class="daily-action-list">
          ${
            actionPlan.recommended.map(item => `
              <li>
                <b>${escape(item.label)}</b>
                <span>${escape(item.text)}</span>
              </li>
            `).join("")
          }
        </ul>
      </article>

      <article class="daily-action-card is-caution">
        <span class="daily-kicker">
          TAKE CARE
        </span>

        <h4>오늘의 주의사항</h4>

        <p class="daily-action-caption">
          상대 지수가 낮은 영역과 관계 신호를
          참고한 점검사항입니다.
        </p>

        <ul class="daily-action-list">
          ${
            actionPlan.cautions.map(item => `
              <li>
                <b>${escape(item.label)}</b>
                <span>${escape(item.text)}</span>
              </li>
            `).join("")
          }
        </ul>
      </article>
    </div>

    <section
      class="daily-picks"
      aria-label="오늘의 행운 추천"
    >
      <div class="daily-picks-heading">
        <span class="daily-kicker">
          TODAY'S PICKS
        </span>

        <h4>오늘의 행운 추천</h4>

        <p>
          컬러와 향, 만남의 방향을
          오늘의 작은 선택에 참고해보세요.
        </p>
      </div>

      <div class="daily-picks-grid">
        <article class="daily-pick-card">
          <span>행운 컬러</span>

          <div class="daily-color-row">
            <i
              class="daily-color-chip"
              style="--daily-swatch:${escape(picks.color.hex)}"
              aria-hidden="true"
            ></i>

            <strong>
              ${escape(picks.color.name)}
            </strong>
          </div>

          <div class="daily-color-row is-secondary">
            <i
              class="daily-color-chip"
              style="--daily-swatch:${escape(picks.secondary.hex)}"
              aria-hidden="true"
            ></i>

            <small>
              보조 컬러 ·
              ${escape(picks.secondary.name)}
            </small>
          </div>

          <p>${escape(picks.colorReason)}</p>
        </article>

        <article class="daily-pick-card">
          <span>행운 방향</span>

          <strong class="daily-pick-main">
            ${escape(picks.direction)}
          </strong>

          <p>${escape(picks.directionHint)}</p>
          <small>${escape(picks.directionReason)}</small>
        </article>

        <article class="daily-pick-card">
          <span>귀인 방향</span>

          <strong class="daily-pick-main">
            ${escape(picks.helperDirection)}
          </strong>

          <p>${escape(picks.helperHint)}</p>
          <small>${escape(picks.helperReason)}</small>
        </article>

        <article class="daily-pick-card">
          <span>오늘의 향수 계열</span>

          <strong class="daily-pick-main">
            ${escape(picks.perfume)}
          </strong>

          <p>${escape(picks.perfumeNotes)}</p>
          <small>${escape(picks.perfumeHint)}</small>
        </article>

        <article class="daily-pick-card">
          <span>행운의 숫자</span>

          <div class="daily-lucky-numbers">
            ${
              picks.numbers.map(number => `
                <b>${number}</b>
              `).join("")
            }
          </div>

          <p>
            추천 오행에 배정한 상징 숫자입니다.
            오늘의 작은 선택에 가볍게 참고해보세요.
          </p>
        </article>
      </div>
    </section>

    <div class="daily-bottom-grid">
      <article class="daily-note-card">
        <h4>오늘의 관계 흐름</h4>

        <p>
          ${
            joins.length
              ? `합 신호 ${joins.length}건: 대화와 협의의 접점을 살펴보세요.`
              : "직접적인 합 신호가 없어도 일상적인 소통을 이어가셔도 좋습니다."
          }
        </p>

        <p>
          ${
            clashes.length
              ? `충 신호 ${clashes.length}건: 일정 변경과 의견 차이에 여유를 두세요.`
              : "직접적인 충 신호가 두드러지지 않습니다."
          }
        </p>

        <details>
          <summary>원국과 운의 관계 보기</summary>

          <ul>
            ${
              result.relations.length
                ? result.relations.map(item => `
                  <li>${escape(item.text)}</li>
                `).join("")
                : `
                  <li>
                    오늘 일진과 각 원국·운 사이의
                    직접적인 천간 합·충 및
                    지지 육합·충 신호가 없습니다.
                  </li>
                `
            }
          </ul>
        </details>
      </article>

      <article class="daily-note-card">
        <h4>나에게 도움이 되는 기운</h4>

        <p>
          용신
          <b>
            ${
              escape(
                ELEMENT_LABELS[
                  result.usefulGod?.yongsin?.element
                ] ?? "분석 없음"
              )
            }
          </b>

          · 희신

          <b>
            ${
              escape(
                ELEMENT_LABELS[
                  result.usefulGod?.huisin?.element
                ] ?? "분석 없음"
              )
            }
          </b>
        </p>

        <p>
          일진의 천간은
          ${escape(ELEMENT_LABELS[STEMS[daily.stem].element])},
          지지는
          ${escape(ELEMENT_LABELS[BRANCHES[daily.branch].element])}
          입니다.
        </p>

        <p>
          ${escape(TEN_GOD_ACTION[daily.branchTenGod])}
        </p>
      </article>
    </div>

    <section
      class="daily-lotto"
      aria-label="재미로 뽑는 로또 후보 번호"
    >
      <div class="daily-lotto-heading">
        <div>
          <span class="daily-kicker">
            JUST FOR FUN
          </span>

          <h4>
            로또 후보 번호 ${LOTTO_NUMBER_COUNT}개
          </h4>
        </div>

        <button
          type="button"
          id="dailyLottoDraw"
        >
          다시 뽑기 ↻
        </button>
      </div>

      <div
        id="dailyLottoNumbers"
        class="daily-lotto-numbers"
        role="status"
        aria-live="polite"
      >
        ${renderLottoNumbers(result.lottoNumbers ?? [])}
      </div>

      <p>
        1~45에서 중복 없이 뽑는 후보 번호
        ${LOTTO_NUMBER_COUNT}개입니다.
        당첨 확률을 높이거나 당첨을 예측하는
        번호는 아닙니다.
      </p>
    </section>

    <details class="daily-convention">
      <summary>계산 기준과 조회 시각</summary>

      <p>
        한국 시간
        ${escape(formatMoment(result.moment))}
        기준입니다.
        오늘은 현재 시각, 다른 날짜는 정오로 조회합니다.
        세운은 입춘, 월운은 절입,
        일운은 한국 시간 자정을 경계로 합니다.
        대운은 조회 시각에 해당하는 구간을 적용합니다.
      </p>

      <p>
        일운·월운·세운·대운의 천간/지지 비중은
        각각 1.00/0.85, 0.65/0.55,
        0.35/0.30, 0.20/0.17입니다.
        상대 순위를 위한 자체 해석 규칙이며
        점수는 확률이나 실제 사건의 보장이 아닙니다.
        합·충은 변화와 소통의 참고 신호로 해석합니다.
      </p>

      ${
        result.approximate
          ? `
            <p>
              출생시간 미상:
              시주는 제외하고 정오 기준
              대운수 근사값을 사용했습니다.
            </p>
          `
          : ""
      }

      <p>
        학업운은 학습·복습,
        합격운은 시험·평가 준비의 참고 흐름입니다.
        실제 합격 확률을 뜻하지 않습니다.
      </p>

      <p>
        학업·합격·인간관계 영역은
        원국의 십성 배경도 낮은 비중으로 반영합니다.
      </p>

      <p>
        각 영역 점수는 해당 영역의 내부값을,
        총운 점수는 일곱 영역의 내부값 평균을
        0~100으로 변환한 참고 지수입니다.
        가장 강한 운은 반올림 전 내부값을 비교합니다.

        시간대 점수는 오전·오후·밤 각 구간의
        2시간 단위 시주를 평균해 총운에 보정합니다.
        세운·월운·대운 배경은 조회 시각의 기준을 공유하며
        구간 중간의 절입·대운 변화는 세분하지 않습니다.
      </p>

      <p>
        행운 컬러와 향수는
        오행의 이미지를 연결한 자체 추천입니다.
        귀인 방향은 도움을 요청하는 만남의
        참고 방위입니다.
      </p>

      <p>
        건강·생활은 생활 리듬에 관한 참고 해석입니다.
      </p>
    </details>
  `;
}

export function renderLottoNumbers(numbers) {
  return numbers.map(number => {
    const band = Math.min(
      5,
      Math.ceil(number / 10)
    );

    return `
      <span class="daily-lotto-ball band-${band}">
        ${number}
      </span>
    `;
  }).join("");
}