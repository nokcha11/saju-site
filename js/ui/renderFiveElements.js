import {
  calculateFiveElements
} from "../calculators/fiveElements.js";


import {
  bindElementBalanceDetail
} from "./elementBalanceDetail.js";


/* =========================================
   십성 비율
========================================= */

function createTenGodRatios(
  element,
  result
) {

  const relation =
    result.elementTenGods[
      element
    ];


  if (!relation) {
    return "";
  }


  return `

    <div class="element-ten-god-ratios">

      ${
        relation.items

          .map(
            item => `

              <div class="element-ten-god-row">

                <span>
                  ${item.name}
                </span>

                <strong>
                  ${item.ratio.toFixed(1)}%
                </strong>

              </div>

            `
          )

          .join("")
      }

    </div>

  `;

}


/* =========================================
   오행 카드
========================================= */

function createElementCard(
  element,
  result
) {

  const info =
    result.elementInfo[
      element
    ];


  const count =
    result.counts[
      element
    ];


  const ratio =
    result.ratios[
      element
    ];


  const relation =
    result.elementTenGods[
      element
    ];


  const isMain =
    result.mainElement ===
    element;


  const isWeakest =
    result.weakest.includes(
      element
    );


  return `

    <article
      class="
        five-element-card
        element-${element}
        ${isMain ? "main-element" : ""}
        ${isWeakest ? "weak-element" : ""}
      "
    >


      <div class="five-element-card-top">


        <div class="element-title-area">


          <span class="five-element-hanja">
            ${info.hanja}
          </span>


          <div>


            <strong class="element-title">

              ${info.korean}
              (${relation.group})

            </strong>


            <span class="element-description">
              ${info.description}
            </span>


          </div>


        </div>


        ${
          isMain

            ? `
              <span class="main-element-badge">
                나의 오행
              </span>
            `

            : ""
        }


      </div>


      ${createTenGodRatios(
        element,
        result
      )}


      <div class="five-element-total">

        <span>
          오행 합계
        </span>

        <strong>
          ${ratio.toFixed(1)}%
        </strong>

      </div>


      <div class="five-element-bar">

        <div
          class="five-element-bar-fill"
          style="width: ${ratio}%"
        ></div>

      </div>


      <div class="five-element-count">
        ${count} / 8
      </div>


      ${
        isWeakest

          ? `

            <div class="element-balance-action">


              <span class="element-low-label">
                적게 보이는 기운
              </span>


              <button
                type="button"
                class="element-guide-button"
                data-element-guide="${element}"
              >

                보완 가이드 보기

              </button>


            </div>

          `

          : ""
      }


    </article>

  `;

}


/* =========================================
   오행 이름
========================================= */

function elementNames(
  elements,
  info
) {

  return elements

    .map(
      element =>
        `${info[element].hanja} ${info[element].korean}`
    )

    .join(" · ");

}


/* =========================================
   화면
========================================= */

export function renderFiveElements(
  result
) {

  let section =
    document.getElementById(
      "elementsSection"
    );


  if (!section) {

    const sinsalSection =
      document.getElementById(
        "sinsalSection"
      );


    section =
      document.createElement(
        "section"
      );


    section.id =
      "elementsSection";


    section.className =
      "page-section elements-section";


    if (sinsalSection) {

      sinsalSection.before(
        section
      );

    }

    else {

      document
        .querySelector(
          ".app"
        )
        ?.appendChild(
          section
        );

    }

  }


  const pillars =
    result.toHanjaObject();


  const fiveElements =
    calculateFiveElements(
      pillars
    );


  const mainInfo =
    fiveElements.elementInfo[
      fiveElements.mainElement
    ];


  section.innerHTML = `

    <div class="elements-inner glass">


      <div class="elements-title">

        <span class="section-label">
          FIVE ELEMENTS
        </span>

        <h2>
          오행 분석
        </h2>

        <p>
          사주 원국의 오행 구성과
          일간을 기준으로 한
          십성 비율을 함께 분석합니다.
        </p>

      </div>


      <div class="main-element-summary">


        <div>

          <span class="summary-label">
            나의 메인 오행
          </span>


          <strong
            class="
              main-element-symbol
              element-text-${fiveElements.mainElement}
            "
          >
            ${mainInfo.hanja}
          </strong>

        </div>


        <div class="main-element-copy">

          <h3>
            ${mainInfo.korean}의 기운
          </h3>

          <p>
            일간
            ${fiveElements.dayMasterStem}을
            기준으로 한 나의 중심 오행입니다.
          </p>

        </div>


      </div>


      <div class="five-element-grid">


        ${createElementCard(
          "wood",
          fiveElements
        )}


        ${createElementCard(
          "fire",
          fiveElements
        )}


        ${createElementCard(
          "earth",
          fiveElements
        )}


        ${createElementCard(
          "metal",
          fiveElements
        )}


        ${createElementCard(
          "water",
          fiveElements
        )}


      </div>


      <div class="element-analysis-summary">


        <div>

          <span>
            가장 많이 보이는 오행
          </span>

          <strong>
            ${elementNames(
              fiveElements.strongest,
              fiveElements.elementInfo
            )}
          </strong>

        </div>


        <div class="weak-element-summary">

          <span>
            가장 적게 보이는 오행
          </span>

          <strong>
            ${elementNames(
              fiveElements.weakest,
              fiveElements.elementInfo
            )}
          </strong>


          <div class="weak-element-buttons">

            ${
              fiveElements.weakest

                .map(
                  element => `

                    <button
                      type="button"
                      class="summary-guide-button"
                      data-element-guide="${element}"
                    >
                      ${
                        fiveElements
                          .elementInfo[element]
                          .hanja
                      }
                      보완 방법
                    </button>

                  `
                )

                .join("")
            }

          </div>


        </div>


      </div>


      <p class="elements-note">

        ※ 오행 비율과 현재의 보완 가이드는
        천간 4자와 지지 4자의 단순 구성비를
        기준으로 합니다.

        월령·지장간·통근 등을 반영한
        오행 세력 및 신강·신약 분석에서는
        실제 보완 필요 여부가 달라질 수 있습니다.

      </p>


    </div>

  `;


  section.hidden =
    false;


  bindElementBalanceDetail(
    section,
    fiveElements
  );

}