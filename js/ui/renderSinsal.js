import {
  calculateSinsal
} from "../calculators/sinsal.js";


import {
  bindSinsalDetail
} from "./sinsalDetail.js";


/* =========================================
   위치 이름
========================================= */

const POSITION_LABELS = {

  yearStem: "년간",
  yearBranch: "년지",
  yearPillar: "년주",

  monthStem: "월간",
  monthBranch: "월지",
  monthPillar: "월주",

  dayStem: "일간",
  dayBranch: "일지",
  dayPillar: "일주",

  hourStem: "시간",
  hourBranch: "시지",
  hourPillar: "시주"

};


/* =========================================
   지지 관계 표시 문구

   예:
   일지 申 ↔ 년지 卯
========================================= */

function createRelationText(item) {

  const basisList =
    Array.isArray(item.basis)
      ? item.basis
      : [item.basis];


  const isRelation =
    basisList.includes(
      "지지 관계"
    );


  if (
    !isRelation ||
    !Array.isArray(item.positions) ||
    item.positions.length < 2
  ) {

    return null;

  }


  const symbols =
    Array.from(
      item.branch ?? ""
    );


  const firstPosition =
    POSITION_LABELS[
      item.positions[0]
    ] ?? item.positions[0];


  const secondPosition =
    POSITION_LABELS[
      item.positions[1]
    ] ?? item.positions[1];


  const firstSymbol =
    symbols[0] ?? "";


  const secondSymbol =
    symbols[1] ?? "";


  return `
    ${firstPosition}
    ${firstSymbol}
    ↔
    ${secondPosition}
    ${secondSymbol}
  `;

}


/* =========================================
   카드 하단 표시

   일반 신살:
   申

   관계 신살:
   일지 申 ↔ 년지 卯
========================================= */

function createCardDetail(item) {

  const relationText =
    createRelationText(
      item
    );


  if (relationText) {

    return relationText;

  }


  return item.branch ?? "—";

}


/* =========================================
   신살 / 길성 카드
========================================= */

function createSinsalCard(
  item,
  index
) {

  const typeClass =
    item.type === "길성"
      ? "good-star"
      : "special-star";


  const basisText =
    Array.isArray(
      item.basis
    )
      ? item.basis.join(" · ")
      : item.basis;


  const detailText =
    createCardDetail(
      item
    );


  return `

    <article
      class="
        sinsal-card
        ${typeClass}
      "

      data-sinsal-index="${index}"

      tabindex="0"

      role="button"

      aria-label="${item.name} 상세보기"
    >


      <div class="sinsal-card-top">


        <span class="sinsal-type">
          ${item.type}
        </span>


        <span class="sinsal-basis">
          ${basisText}
        </span>


      </div>


      <strong class="sinsal-name">
        ${item.name}
      </strong>


      <div class="sinsal-detail">

        <span>
          ${detailText}
        </span>

      </div>


    </article>

  `;

}


/* =========================================
   시주 / 일주 / 월주 / 년주 그룹
========================================= */

function createPillarGroup(
  label,
  items
) {

  /*
    원본 index를 유지해야
    클릭할 때 정확한 상세정보를 찾을 수 있음
  */

  const filteredItems =
    items

      .map(
        (item, index) => ({
          item,
          index
        })
      )

      .filter(
        ({ item }) =>
          item.pillar.includes(
            label
          )
      );


  return `

    <section class="sinsal-pillar">


      <div class="sinsal-pillar-title">


        <span>
          ${label}
        </span>


        <small>
          ${filteredItems.length}개
        </small>


      </div>


      <div class="sinsal-pillar-list">


        ${
          filteredItems.length

            ? filteredItems

                .map(
                  ({
                    item,
                    index
                  }) =>

                    createSinsalCard(
                      item,
                      index
                    )
                )

                .join("")

            : `

              <div class="sinsal-empty">

                해당되는 주요
                신살·길성이 없습니다.

              </div>

            `
        }


      </div>


    </section>

  `;

}


/* =========================================
   전체 화면 렌더링
========================================= */

export function renderSinsal(
  result
) {

  const section =
    document.getElementById(
      "sinsalSection"
    );


  if (!section) {

    console.error(
      "sinsalSection을 찾을 수 없습니다."
    );

    return;

  }


  const pillars =
    result.toHanjaObject();


  const items =
    calculateSinsal(
      pillars
    );


  section.innerHTML = `

    <div class="sinsal-inner glass">


      <div class="sinsal-title">


        <span class="section-label">
          STARS & SYMBOLS
        </span>


        <h2>
          신살과 길성
        </h2>


        <p>
          시주 · 일주 · 월주 · 년주별로
          나타나는 신살과 길성입니다.
        </p>


      </div>


      <div class="sinsal-pillar-grid">


        ${createPillarGroup(
          "시주",
          items
        )}


        ${createPillarGroup(
          "일주",
          items
        )}


        ${createPillarGroup(
          "월주",
          items
        )}


        ${createPillarGroup(
          "년주",
          items
        )}


      </div>


    </div>

  `;


  section.hidden = false;


  /*
    카드 클릭 → 상세 해석
  */

  bindSinsalDetail(
    section,
    items
  );

}