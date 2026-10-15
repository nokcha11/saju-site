/* =========================================
   날짜 / 시간 Custom Controls
========================================= */


/* =========================================
   DOM
========================================= */

const birthDate =
  document.getElementById(
    "birthDate"
  );


const birthTime =
  document.getElementById(
    "birthTime"
  );


const unknownTime =
  document.getElementById(
    "unknownTime"
  );


/* =========================================
   숫자 2자리
========================================= */

function pad2(
  value
) {

  return String(
    value
  ).padStart(
    2,
    "0"
  );

}


/* =========================================
   윤년
========================================= */

function isLeapYear(
  year
) {

  return (

    year % 400 === 0

    ||

    (
      year % 4 === 0 &&
      year % 100 !== 0
    )

  );

}


/* =========================================
   해당 월의 마지막 날짜
========================================= */

function getDaysInMonth(
  year,
  month
) {

  const days = [

    31,

    isLeapYear(
      year
    )
      ? 29
      : 28,

    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31

  ];


  return days[
    month - 1
  ];

}


/* =========================================
   날짜 문자열 읽기
========================================= */

function parseDateValue(
  value
) {

  if (
    !value
  ) {

    return null;

  }


  const parts =
    value
      .split("-")
      .map(Number);


  if (
    parts.length !== 3
  ) {

    return null;

  }


  const [
    year,
    month,
    day
  ] = parts;


  if (
    !year ||
    !month ||
    !day
  ) {

    return null;

  }


  return {
    year,
    month,
    day
  };

}


/* =========================================
   오늘 날짜
========================================= */

function getTodayParts() {

  const now =
    new Date();


  return {

    year:
      now.getFullYear(),

    month:
      now.getMonth() + 1,

    day:
      now.getDate()

  };

}


/* =========================================
   날짜 값 생성
========================================= */

function formatDate({

  year,
  month,
  day

}) {

  return `${year}-${pad2(month)}-${pad2(day)}`;

}


/* =========================================
   Date input Event 발생

   기존 birthForm.js와
   다른 로직이 change 이벤트를 듣고 있어도
   정상 작동하도록 함.
========================================= */

function dispatchDateEvents() {

  if (
    !birthDate
  ) {

    return;

  }


  birthDate.dispatchEvent(
    new Event(
      "input",
      {
        bubbles: true
      }
    )
  );


  birthDate.dispatchEvent(
    new Event(
      "change",
      {
        bubbles: true
      }
    )
  );

}


/* =========================================
   연도 이동

   월 / 일은 그대로 유지
========================================= */

function shiftBirthYear(
  offset
) {

  if (
    !birthDate
  ) {

    return;

  }


  /*
    날짜가 아직 비어 있으면
    오늘 날짜를 기준으로 시작
  */

  const current =
    parseDateValue(
      birthDate.value
    )

    ??

    getTodayParts();


  let newYear =
    current.year +
    offset;


  /*
    HTML date가 일반적으로 다루기 좋은
    현실적인 범위만 방어
  */

  if (
    newYear < 1
  ) {

    newYear = 1;

  }


  if (
    newYear > 9999
  ) {

    newYear = 9999;

  }


  /*
    2월 29일 문제 처리

    예:
    2024-02-29
    ↓ -1년
    2023-02-28
  */

  const maxDay =
    getDaysInMonth(
      newYear,
      current.month
    );


  const safeDay =
    Math.min(
      current.day,
      maxDay
    );


  birthDate.value =
    formatDate({

      year:
        newYear,

      month:
        current.month,

      day:
        safeDay

    });


  dispatchDateEvents();

}


/* =========================================
   연도 버튼 연결
========================================= */

document
  .querySelectorAll(
    "[data-year-offset]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const offset =
            Number(
              button.dataset
                .yearOffset
            );


          if (
            Number.isNaN(
              offset
            )
          ) {

            return;

          }


          shiftBirthYear(
            offset
          );

        }
      );

    }
  );


/* =========================================
   Native Picker 열기
========================================= */

function openPicker(
  input
) {

  if (
    !input ||
    input.disabled
  ) {

    return;

  }


  /*
    최신 Chrome / Edge
  */

  if (
    typeof input.showPicker ===
    "function"
  ) {

    try {

      input.showPicker();

      return;

    }

    catch (
      error
    ) {

      /*
        showPicker 지원은 하지만
        실행을 막는 브라우저의 경우
        아래 fallback 사용
      */

    }

  }


  /*
    Fallback
  */

  input.focus();

  input.click();

}


/* =========================================
   달력 / 시계 버튼
========================================= */

document
  .querySelectorAll(
    "[data-picker-target]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset
              .pickerTarget;


          const input =
            document.getElementById(
              id
            );


          openPicker(
            input
          );

        }
      );

    }
  );


/* =========================================
   시간 모름
========================================= */

function syncUnknownTime() {

  if (
    !unknownTime ||
    !birthTime
  ) {

    return;

  }


  const disabled =
    unknownTime.checked;


  birthTime.disabled =
    disabled;


  /*
    기존 birthForm 처리와 충돌하지 않도록
    시간을 강제로 삭제하지는 않음.
  */


  const timeControl =
    birthTime.closest(
      ".time-control"
    );


  timeControl
    ?.classList.toggle(
      "is-disabled",
      disabled
    );


  const timeButton =
    timeControl
      ?.querySelector(
        ".time-picker-btn"
      );


  if (
    timeButton
  ) {

    timeButton.disabled =
      disabled;

  }

}


/* =========================================
   Checkbox 연결
========================================= */

unknownTime
  ?.addEventListener(
    "change",
    syncUnknownTime
  );


/* 초기 상태 */

syncUnknownTime();