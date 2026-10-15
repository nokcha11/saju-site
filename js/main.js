import { updateDailyFortunePage } from "./ui/dailyFortunePage.js";
/* =========================================
   배경 파티클
========================================= */

import "./effects/particles.js";


/* =========================================
   입력 폼
========================================= */

import {
  getBirthFormData
} from "./form/birthForm.js";


/* =========================================
   사주 원국 계산
========================================= */

import {
  calculatePillars
} from "./calculators/pillars.js";


/* =========================================
   원국 출력
========================================= */

import {
  renderPillars
} from "./ui/renderPillars.js";


/* =========================================
   관계
========================================= */

import {
  renderRelations
} from "./ui/renderRelations.js";


/* =========================================
   오행
========================================= */

import {
  renderFiveElements
} from "./ui/renderFiveElements.js";


/* =========================================
   신살 · 길성
========================================= */

import {
  renderSinsal
} from "./ui/renderSinsal.js";


/* =========================================
   핵심 요약
========================================= */

import {
  renderSajuSummary
} from "./ui/renderSajuSummary.js";


/* =========================================
   신강 · 신약
========================================= */

import {
  calculateStrength
} from "./calculators/strengthCalculator.js";


import {
  renderStrength
} from "./ui/renderStrength.js";


/* =========================================
   FORM
========================================= */

const sajuForm =
  document.getElementById(
    "sajuForm"
  );


const resultSection =
  document.getElementById(
    "resultSection"
  );


/* =========================================
   만세력 결과에서 간지 문자열 추출

   manseryeok 결과는

   result.toHanjaObject()

   형태로 변환한 뒤 사용합니다.

   예:
   {
     year:  { hanja: "丁卯" },
     month: { hanja: "戊申" },
     day:   { hanja: "丙申" },
     hour:  { hanja: "乙未" }
   }
========================================= */

function getPillarHanja(
  pillar
) {

  if (
    !pillar
  ) {

    return null;

  }


  if (
    typeof pillar === "string"
  ) {

    return pillar;

  }


  return (

    pillar.hanja
    ??
    pillar.ganji
    ??
    pillar.value
    ??
    null

  );

}


/* =========================================
   신강 · 신약 계산용 원국 생성

   strengthCalculator.js가
   다른 화면 코드에 종속되지 않도록

   년주 / 월주 / 일주 / 시주만
   간지 문자열로 넘깁니다.
========================================= */

function createStrengthSource(
  result
) {

  if (
    !result ||
    typeof result.toHanjaObject !== "function"
  ) {

    throw new Error(
      "신강·신약 계산용 원국 데이터를 만들 수 없습니다."
    );

  }


  const raw =
    result.toHanjaObject();


  return {

    year:
      getPillarHanja(
        raw.year
      ),


    month:
      getPillarHanja(
        raw.month
      ),


    day:
      getPillarHanja(
        raw.day
      ),


    hour:
      getPillarHanja(
        raw.hour
      )

  };

}


/* =========================================
   사주 계산
========================================= */

sajuForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    /* =====================================
       1. 출생 정보 읽기
    ===================================== */

    const birthInfo =
      getBirthFormData();


    if (
      !birthInfo
    ) {

      return;

    }


    try {

      /* =====================================
         2. 사주 원국 계산
      ===================================== */

      const result =
        calculatePillars(
          birthInfo
        );


      const gender =
        birthInfo.gender;


      /* =====================================
         3. 상세 만세력

         성별 전달
         → 애정 / 결혼 / 배우자 / 자녀 해석에 사용
      ===================================== */

      renderPillars(
        result,
        {
          gender
        }
      );


      /* =====================================
         4. 합 · 충 · 형 · 파 · 해
            병존 · 간여지동 등
      ===================================== */

      renderRelations(
        result
      );


      /* =====================================
         5. 오행 분석
      ===================================== */

      renderFiveElements(
        result
      );


      /* =====================================
         6. 신강 · 신약

         ★ 이번에 추가한 부분

         resultSection 안에서
         원국표 아래에 출력됩니다.
      ===================================== */

      const strengthSource =
        createStrengthSource(
          result
        );


      const strengthResult =
        calculateStrength(
          strengthSource
        );


      renderStrength(
        resultSection,
        strengthResult
      );

      updateDailyFortunePage({ result, strengthResult, birthInfo });


      /* =====================================
         개발 확인용

         F12 → Console에서
         실제 계산 결과 확인 가능
      ===================================== */

      console.log(
        "신강·신약 계산 결과:",
        strengthResult
      );


      /* =====================================
         7. 신살과 길성
      ===================================== */

      renderSinsal(
        result
      );


      /* =====================================
         8. 핵심 요약

         반드시 마지막 실행

         renderSajuSummary 안에서
         scrollIntoView()를 실행하므로

         계산 후 첫 화면은
         요약 화면으로 이동합니다.
      ===================================== */

      renderSajuSummary(
        result
      );

      // Signal UI completion only after the whole calculation succeeds.
      document.dispatchEvent(new CustomEvent("saju:calculated"));

    }

    catch (
      error
    ) {

      console.error(
        "만세력 계산 오류:",
        error
      );


      alert(
        "사주 계산 중 오류가 발생했습니다."
      );

    }

  }
);