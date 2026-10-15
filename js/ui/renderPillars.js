import {
  STEMS
} from "../data/stems.js";


import {
  BRANCHES
} from "../data/branches.js";


import {
  calculateTenGod
} from "../calculators/tenGods.js";


import {
  getHiddenStems,
  getMainHiddenStem
} from "../calculators/hiddenStems.js";


import {
  getTwelveStage
} from "../calculators/twelveStages.js";


import {
  getTwelveSinsal
} from "../calculators/twelveSinsal.js";


import {
  getGongmang
} from "../calculators/gongmang.js";


import {
  calculatePillarPatterns
} from "../calculators/pillarPatterns.js";


import {
  buildChartContext
} from "../interpreters/chartContext.js";


import {
  bindPillarDetailModal
} from "./pillarDetailModal.js";


import {
  openPatternDetail
} from "./patternDetailModal.js";


/* =========================================
   기둥 분리
========================================= */

function splitPillar(
  pillar
) {

  const ganji =

    typeof pillar === "string"

      ? pillar

      : pillar?.hanja ?? "";


  const [
    stem,
    branch
  ] =
    Array.from(
      ganji
    );


  return {
    stem,
    branch
  };

}


/* =========================================
   상세 등록
========================================= */

function registerDetail(
  details,
  data
) {

  const index =
    details.length;


  details.push(
    data
  );


  return index;

}


/* =========================================
   기본 상세 클릭
========================================= */

function interactiveAttrs(
  index,
  label
) {

  return `

    data-pillar-detail="${index}"

    tabindex="0"

    role="button"

    aria-label="${label} 상세 해석 보기"

  `;

}


/* =========================================
   지장간
========================================= */

function createHiddenStemHtml(
  hiddenStems
) {

  if (
    !hiddenStems.length
  ) {

    return "—";

  }


  return hiddenStems

    .map(
      stem => {

        const info =
          STEMS[
            stem
          ];


        return `

          <span
            class="
              hidden-stem-item
              element-${info.element}
            "
          >

            <strong>
              ${stem}
            </strong>

            <small>
              ${info.korean}
            </small>

          </span>

        `;

      }
    )

    .join("");

}


/* =========================================
   한 기둥
========================================= */

function createPillarColumn({

  label,

  pillarKey,

  pillar,

  dayStem,

  yearBranch,

  gongmangBranches,

  dayGanji,

  patternAnalysis,

  chartContext,

  details,

  isDay = false

}) {

  const stemInfo =
    STEMS[
      pillar.stem
    ];


  const branchInfo =
    BRANCHES[
      pillar.branch
    ];


  const upperTenGod =

    isDay

      ? "일원"

      : calculateTenGod(
          dayStem,
          pillar.stem
        );


  const hiddenStems =
    getHiddenStems(
      pillar.branch
    );


  const mainHiddenStem =
    getMainHiddenStem(
      pillar.branch
    );


  const lowerTenGod =

    mainHiddenStem

      ? calculateTenGod(
          dayStem,
          mainHiddenStem
        )

      : "—";


  const twelveStage =
    getTwelveStage(
      dayStem,
      pillar.branch
    );


  const twelveSinsal =
    getTwelveSinsal(
      yearBranch,
      pillar.branch
    );


  const isGongmang =
    gongmangBranches.includes(
      pillar.branch
    );


  const pillarPatterns =
    patternAnalysis.byPillar[
      pillarKey
    ] ?? {};


  /* =====================================
     상세 데이터
  ===================================== */

  const upperIndex =
    registerDetail(
      details,
      {

        type:
          "tenGod",

        name:
          upperTenGod,

        pillarKey,

        layer:
          "stem",

        value:
          pillar.stem,

        chartContext

      }
    );


  const stemIndex =
    registerDetail(
      details,
      {

        type:
          "stem",

        pillarKey,

        layer:
          "stem",

        value:
          pillar.stem,

        korean:
          stemInfo.korean,

        chartContext

      }
    );


  const branchIndex =
    registerDetail(
      details,
      {

        type:
          "branch",

        pillarKey,

        layer:
          "branch",

        value:
          pillar.branch,

        korean:
          branchInfo.korean,

        chartContext

      }
    );


  const lowerIndex =
    registerDetail(
      details,
      {

        type:
          "tenGod",

        name:
          lowerTenGod,

        pillarKey,

        layer:
          "branch",

        value:
          `${pillar.branch} → ${mainHiddenStem}`,

        chartContext

      }
    );


  const hiddenIndex =
    registerDetail(
      details,
      {

        type:
          "hidden",

        pillarKey,

        layer:
          "hidden",

        branch:
          pillar.branch,

        hiddenStems:
          hiddenStems.map(
            stem => ({

              stem,

              korean:
                STEMS[
                  stem
                ]?.korean ?? "",

              tenGod:
                calculateTenGod(
                  dayStem,
                  stem
                ),

              isMain:
                stem ===
                mainHiddenStem

            })
          ),

        chartContext

      }
    );


  const stageIndex =
    registerDetail(
      details,
      {

        type:
          "stage",

        name:
          twelveStage,

        pillarKey,

        layer:
          "branch",

        value:
          pillar.branch,

        chartContext

      }
    );


  const twelveSinsalIndex =

    twelveSinsal

      ? registerDetail(
          details,
          {

            type:
              "twelveSinsal",

            name:
              twelveSinsal,

            pillarKey,

            layer:
              "branch",

            value:
              pillar.branch,

            chartContext

          }
        )

      : null;


  const gongmangIndex =

    isGongmang

      ? registerDetail(
          details,
          {

            type:
              "gongmang",

            pillarKey,

            layer:
              "branch",

            value:
              pillar.branch,

            dayGanji,

            gongmangBranches:
              [
                ...gongmangBranches
              ],

            chartContext

          }
        )

      : null;


  const stemCoexistence =
    Boolean(
      pillarPatterns
        .stemCoexistence
    );


  const branchCoexistence =
    Boolean(
      pillarPatterns
        .branchCoexistence
    );


  const ganYeojidong =
    Boolean(
      pillarPatterns
        .ganYeojidong
    );


  return `

    <div
      class="pillar-column"

      data-pillar-key="${pillarKey}"
    >


      <div class="pillar-label">

        ${label}

      </div>


      <!-- 천간 십성 -->

      <div
        class="
          pillar-cell
          ten-god-cell
          pillar-interactive
        "

        ${interactiveAttrs(
          upperIndex,
          `${label} ${upperTenGod}`
        )}
      >

        ${upperTenGod}

      </div>


      <!-- 천간 -->

      <div
        class="
          pillar-cell
          stem-cell
          element-${stemInfo.element}
          pillar-interactive

          ${
            stemCoexistence
              ? "pattern-coexistence-cell"
              : ""
          }

          ${
            ganYeojidong
              ? "pattern-gan-yeo-cell"
              : ""
          }
        "

        data-pattern-layer="stem"

        data-pattern-pillar="${pillarKey}"

        data-pattern-symbol="${pillar.stem}"

        ${interactiveAttrs(
          stemIndex,
          `${label} 천간 ${pillar.stem}`
        )}
      >

        <strong>
          ${pillar.stem}
        </strong>

        <span>
          ${stemInfo.korean}
        </span>

      </div>


      <!-- 지지 -->

      <div
        class="
          pillar-cell
          branch-cell
          element-${branchInfo.element}
          pillar-interactive

          ${
            branchCoexistence
              ? "pattern-coexistence-cell"
              : ""
          }

          ${
            ganYeojidong
              ? "pattern-gan-yeo-cell"
              : ""
          }
        "

        data-pattern-layer="branch"

        data-pattern-pillar="${pillarKey}"

        data-pattern-symbol="${pillar.branch}"

        ${interactiveAttrs(
          branchIndex,
          `${label} 지지 ${pillar.branch}`
        )}
      >

        <strong>
          ${pillar.branch}
        </strong>

        <span>
          ${branchInfo.korean}
        </span>

      </div>


      <!-- 지지 십성 -->

      <div
        class="
          pillar-cell
          ten-god-cell
          pillar-interactive
        "

        ${interactiveAttrs(
          lowerIndex,
          `${label} ${lowerTenGod}`
        )}
      >

        ${lowerTenGod}

      </div>


      <!-- 지장간 -->

      <div
        class="
          pillar-cell
          hidden-stem-cell
          pillar-interactive
        "

        ${interactiveAttrs(
          hiddenIndex,
          `${label} 지장간`
        )}
      >

        <div class="hidden-stem-list">

          ${createHiddenStemHtml(
            hiddenStems
          )}

        </div>

      </div>


      <!-- 12운성 -->

      <div
        class="
          pillar-cell
          stage-cell
          pillar-interactive
        "

        ${interactiveAttrs(
          stageIndex,
          `${label} 12운성 ${twelveStage}`
        )}
      >

        ${twelveStage}

      </div>


      <!-- 12신살 -->

      <div
        class="
          pillar-cell
          sinsal-cell

          ${
            twelveSinsal
              ? "pillar-interactive"
              : ""
          }
        "

        ${
          twelveSinsal

            ? interactiveAttrs(
                twelveSinsalIndex,
                `${label} ${twelveSinsal}`
              )

            : ""
        }
      >

        ${twelveSinsal || "—"}

      </div>


      <!-- 공망 -->

      <div
        class="
          pillar-cell
          gongmang-cell

          ${
            isGongmang

              ? "is-gongmang pillar-interactive"

              : ""
          }
        "

        ${
          isGongmang

            ? interactiveAttrs(
                gongmangIndex,
                `${label} ${pillar.branch} 공망`
              )

            : ""
        }
      >

        ${
          isGongmang
            ? "공망"
            : "—"
        }

      </div>


    </div>

  `;

}


/* =========================================
   패턴 상세 데이터
========================================= */

function createPatternDetails(
  patternAnalysis,
  chartContext
) {

  return [

    ...patternAnalysis
      .ganYeojidong
      .map(
        pattern => ({

          type:
            "ganYeojidong",

          pattern,

          patternSummary:
            patternAnalysis.summary,

          chartContext

        })
      ),


    ...patternAnalysis
      .coexistence
      .map(
        pattern => ({

          type:
            "coexistence",

          pattern,

          patternSummary:
            patternAnalysis.summary,

          chartContext

        })
      )

  ];

}


/* =========================================
   패턴 index 찾기
========================================= */

function findPatternIndex(
  patternDetails,
  type,
  pattern
) {

  return patternDetails.findIndex(
    item =>

      item.type === type

      &&

      item.pattern === pattern
  );

}


/* =========================================
   여러 셀을 감싸는 영역
========================================= */

function calculateGroupRect(
  cells,
  parentRect
) {

  if (
    !cells.length
  ) {

    return null;

  }


  const rects =
    cells.map(
      cell =>
        cell.getBoundingClientRect()
    );


  const left =
    Math.min(
      ...rects.map(
        rect =>
          rect.left
      )
    );


  const top =
    Math.min(
      ...rects.map(
        rect =>
          rect.top
      )
    );


  const right =
    Math.max(
      ...rects.map(
        rect =>
          rect.right
      )
    );


  const bottom =
    Math.max(
      ...rects.map(
        rect =>
          rect.bottom
      )
    );


  /*
    기존 카드 테두리와
    조금 떨어뜨려 표시
  */

  const padding =
    5;


  return {

    left:
      left -
      parentRect.left -
      padding,

    top:
      top -
      parentRect.top -
      padding,

    width:
      right -
      left +
      padding * 2,

    height:
      bottom -
      top +
      padding * 2

  };

}


/* =========================================
   패턴 외곽선
========================================= */

function createPatternBox({

  layer,

  rect,

  kind,

  label,

  detail

}) {

  if (
    !rect ||
    !detail
  ) {

    return;

  }


  const box =
    document.createElement(
      "div"
    );


  box.className =
    `pillar-pattern-group ${kind}`;


  box.style.left =
    `${rect.left}px`;


  box.style.top =
    `${rect.top}px`;


  box.style.width =
    `${rect.width}px`;


  box.style.height =
    `${rect.height}px`;


  /*
    병존 / 간여지동 이름 버튼
  */

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    `pattern-group-label ${kind}`;


  button.textContent =
    label;


  button.setAttribute(
    "aria-label",
    `${label} 상세 해석 보기`
  );


  /*
    여기에서 직접 해석창 호출

    이전처럼 부모 이벤트에 의존하지 않음
  */

  button.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      openPatternDetail(
        detail
      );

    }
  );


  box.appendChild(
    button
  );


  layer.appendChild(
    box
  );

}


/* =========================================
   패턴 외곽선 전체 그리기
========================================= */

function drawPatternOverlays(
  resultSection,
  patternAnalysis,
  patternDetails
) {

  const resultInner =
    resultSection.querySelector(
      ".result-inner"
    );


  const table =
    resultSection.querySelector(
      ".saju-table"
    );


  if (
    !resultInner ||
    !table
  ) {

    return;

  }


  /*
    이전 레이어 삭제
  */

  resultInner
    .querySelector(
      ".pillar-pattern-layer"
    )
    ?.remove();


  const parentRect =
    resultInner
      .getBoundingClientRect();


  if (
    parentRect.width <= 0 ||
    parentRect.height <= 0
  ) {

    return;

  }


  const layer =
    document.createElement(
      "div"
    );


  layer.className =
    "pillar-pattern-layer";


  resultInner.appendChild(
    layer
  );


  /* =====================================
     1. 간여지동

     천간 + 지지
     세로로 하나의 보라 외곽선
  ===================================== */

  patternAnalysis
    .ganYeojidong
    .forEach(
      pattern => {

        const stemCell =
          table.querySelector(
            `[data-pattern-layer="stem"][data-pattern-pillar="${pattern.pillarKey}"]`
          );


        const branchCell =
          table.querySelector(
            `[data-pattern-layer="branch"][data-pattern-pillar="${pattern.pillarKey}"]`
          );


        const cells =
          [
            stemCell,
            branchCell
          ]
            .filter(
              Boolean
            );


        const rect =
          calculateGroupRect(
            cells,
            parentRect
          );


        const index =
          findPatternIndex(
            patternDetails,
            "ganYeojidong",
            pattern
          );


        const detail =
          patternDetails[
            index
          ];


        createPatternBox({

          layer,

          rect,

          kind:
            "gan-yeo",

          label:
            "간여지동",

          detail

        });

      }
    );


  /* =====================================
     2. 병존

     같은 천간 / 같은 지지 전체를
     하나의 금빛 외곽선
  ===================================== */

  patternAnalysis
    .coexistence
    .forEach(
      pattern => {

        const cells =
          pattern.positions

            .map(
              pillarKey =>

                table.querySelector(
                  `[data-pattern-layer="${pattern.layer}"][data-pattern-pillar="${pillarKey}"][data-pattern-symbol="${pattern.symbol}"]`
                )

            )

            .filter(
              Boolean
            );


        const rect =
          calculateGroupRect(
            cells,
            parentRect
          );


        const index =
          findPatternIndex(
            patternDetails,
            "coexistence",
            pattern
          );


        const detail =
          patternDetails[
            index
          ];


        createPatternBox({

          layer,

          rect,

          kind:
            "coexistence",

          label:
            pattern.level,

          detail

        });

      }
    );

}


/* =========================================
   범례
========================================= */

function createPatternLegend(
  patternAnalysis
) {

  const hasCoexistence =
    patternAnalysis
      .coexistence
      .length > 0;


  const hasGanYeojidong =
    patternAnalysis
      .ganYeojidong
      .length > 0;


  if (
    !hasCoexistence &&
    !hasGanYeojidong
  ) {

    return "";

  }


  return `

    <div class="pillar-pattern-legend">


      ${
        hasCoexistence

          ? `

            <span
              class="
                legend-item
                coexistence
              "
            >

              <i></i>

              금빛 · 병존

            </span>

          `

          : ""
      }


      ${
        hasGanYeojidong

          ? `

            <span
              class="
                legend-item
                gan-yeo
              "
            >

              <i></i>

              보라빛 · 간여지동

            </span>

          `

          : ""
      }


    </div>

  `;

}


/* =========================================
   전체 원국 출력
========================================= */

export function renderPillars(
  result,
  options = {}
) {

  const resultSection =
    document.getElementById(
      "resultSection"
    );


  if (!resultSection) {

    console.error(
      "resultSection을 찾을 수 없습니다."
    );

    return;

  }


  const raw =
    result.toHanjaObject();


  /* =====================================
     성별
  ===================================== */

  const gender =
    options.gender ??
    "male";


  const chartContext =
    buildChartContext(
      raw,
      gender
    );


  const hour =
    splitPillar(
      raw.hour
    );


  const day =
    splitPillar(
      raw.day
    );


  const month =
    splitPillar(
      raw.month
    );


  const year =
    splitPillar(
      raw.year
    );


  const dayStem =
    day.stem;


  const yearBranch =
    year.branch;


  const dayGanji =
    `${day.stem}${day.branch}`;


  const gongmangBranches =
    getGongmang(
      day.stem,
      day.branch
    );


  /* =====================================
     병존 / 간여지동 계산
  ===================================== */

  const patternAnalysis =
    calculatePillarPatterns(
      raw
    );


  const details = [];


  const patternDetails =
    createPatternDetails(
      patternAnalysis,
      chartContext
    );


  /* =====================================
     HTML
  ===================================== */

  resultSection.innerHTML = `

    <div class="result-inner glass">


      <!-- 제목 : 최대한 작게 -->

      <div class="result-title result-title-compact">

        <span class="section-label">
          MY SAJU
        </span>


        <div class="result-title-text">

          <h2>
            사주 원국
          </h2>

          <p>
            태어난 순간의 네 기둥
          </p>

        </div>

      </div>


      <!-- 원국표 -->

      <div class="saju-table">


        <div class="row-labels">

          <div></div>

          <div>
            십성
          </div>

          <div>
            천간
          </div>

          <div>
            지지
          </div>

          <div>
            십성
          </div>

          <div>
            지장간
          </div>

          <div>
            12운성
          </div>

          <div>
            12신살
          </div>

          <div>
            공망
          </div>

        </div>


        <div class="pillar-columns">


          ${createPillarColumn({

            label:
              "시주",

            pillarKey:
              "hour",

            pillar:
              hour,

            dayStem,

            yearBranch,

            gongmangBranches,

            dayGanji,

            patternAnalysis,

            chartContext,

            details

          })}


          ${createPillarColumn({

            label:
              "일주",

            pillarKey:
              "day",

            pillar:
              day,

            dayStem,

            yearBranch,

            gongmangBranches,

            dayGanji,

            patternAnalysis,

            chartContext,

            details,

            isDay:
              true

          })}


          ${createPillarColumn({

            label:
              "월주",

            pillarKey:
              "month",

            pillar:
              month,

            dayStem,

            yearBranch,

            gongmangBranches,

            dayGanji,

            patternAnalysis,

            chartContext,

            details

          })}


          ${createPillarColumn({

            label:
              "년주",

            pillarKey:
              "year",

            pillar:
              year,

            dayStem,

            yearBranch,

            gongmangBranches,

            dayGanji,

            patternAnalysis,

            chartContext,

            details

          })}


        </div>


      </div>


      ${createPatternLegend(
        patternAnalysis
      )}


      <p class="result-interaction-note">

        항목과 병존 · 간여지동 표시를
        클릭하면 상세 해석을 볼 수 있습니다.

      </p>


    </div>

  `;


  /*
    중요:
    먼저 보이게 한 다음
    좌표를 계산해야 함
  */

  resultSection.hidden =
    false;


  bindPillarDetailModal(
    resultSection,
    details
  );


  const redraw =
    () => {

      drawPatternOverlays(
        resultSection,
        patternAnalysis,
        patternDetails
      );

    };


  /*
    첫 화면 표시 후
    여러 번 재계산
  */

  requestAnimationFrame(
    () => {

      redraw();


      requestAnimationFrame(
        redraw
      );

    }
  );


  window.setTimeout(
    redraw,
    100
  );


  window.setTimeout(
    redraw,
    300
  );


  /*
    반응형 변경 대응
  */

  if (
    resultSection.__patternObserver
  ) {

    resultSection
      .__patternObserver
      .disconnect();

  }


  if (
    "ResizeObserver" in window
  ) {

    const observer =
      new ResizeObserver(
        () => {

          redraw();

        }
      );


    const resultInner =
      resultSection.querySelector(
        ".result-inner"
      );


    if (
      resultInner
    ) {

      observer.observe(
        resultInner
      );

    }


    resultSection
      .__patternObserver =
        observer;

  }

}