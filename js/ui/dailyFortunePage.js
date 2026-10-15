import {
  calculatePillars
} from "../calculators/pillars.js";

import {
  calculateStrength
} from "../calculators/strengthCalculator.js";

import {
  calculateUsefulGod
} from "../calculators/usefulGodCalculator.js";

import {
  calculateFortuneCycle
} from "../calculators/fortuneCycle.js";

import {
  lunarToSolar
} from "../lib/manseryeok.js";

import {
  calculateDailyFortune,
  koreaDate,
  dateMoment
} from "../calculators/dailyFortune.js";

import {
  renderDailyFortune,
  renderLottoNumbers
} from "./renderDailyFortune.js";

import {
  drawLottoNumbers
} from "../calculators/lottoNumbers.js";

let lottoNumbers = drawLottoNumbers();
let context = null;
let followsToday = true;

const section =
  document.getElementById("today");

section.innerHTML = `
  <div class="daily-shell glass">
    <div class="daily-page-heading">
      <div>
        <span class="daily-kicker">
          DAILY FORTUNE
        </span>

        <h2>오늘의 운세</h2>

        <p>
          나의 사주와 긴 흐름 위에,
          오늘의 기운을 더합니다.
        </p>
      </div>

      <div class="daily-controls">
        <button
          type="button"
          data-daily-shift="-1"
          aria-label="이전 날짜"
        >
          ‹
        </button>

        <label class="daily-date-label">
          조회 날짜

          <input
            id="dailyDate"
            type="date"
            min="1801-01-01"
            max="2298-12-31"
          >
        </label>

        <button
          type="button"
          data-daily-shift="1"
          aria-label="다음 날짜"
        >
          ›
        </button>

        <button
          type="button"
          id="dailyToday"
        >
          오늘
        </button>
      </div>
    </div>

    <p
      id="dailyStatus"
      class="daily-status"
      role="status"
      aria-live="polite"
    ></p>

    <div id="dailyResult">
      <div class="daily-empty">
        <span>命</span>
        <h3>나의 오늘을 읽어보세요</h3>

        <p>
          먼저 출생 정보를 입력하고
          ‘내 사주 보기’를 눌러주세요.
        </p>

        <a href="#manse">
          출생 정보 입력하기 →
        </a>
      </div>
    </div>
  </div>
`;

const dateInput =
  document.getElementById("dailyDate");

const status =
  document.getElementById("dailyStatus");

const output =
  document.getElementById("dailyResult");

dateInput.value = koreaDate();

function refresh() {
  if (!context) return;

  try {
    const now = new Date();
    const date = dateInput.value;

    dateMoment(date, now);

    const [year, month, day] =
      date.split("-").map(Number);

    const dayGanji = calculatePillars({
      year,
      month,
      day,
      hour: 12,
      minute: 0,
      gender: context.gender,
      isLunar: false,
      isLeapMonth: false
    }).toHanjaObject().day.hanja;

    const result = calculateDailyFortune({
      ...context,
      date,
      dayGanji,
      now
    });

    /*
      자동 갱신이나 날짜 이동으로
      로또 번호가 바뀌지 않도록 유지합니다.
    */

    result.lottoNumbers = lottoNumbers;

    renderDailyFortune(result, output);

    status.textContent =
      date === koreaDate(now)
        ? "오늘 · 한국 시간 기준"
        : `${date} · 선택한 날짜의 운세`;

    if (context.unknownTime) {
      status.textContent += " · 출생시간 미상";
    }

    section.dataset.ready = "true";
  } catch (error) {
    output.replaceChildren();

    status.textContent =
      error.message ||
      "운세를 계산하지 못했습니다. 날짜를 확인해주세요.";

    section.dataset.ready = "false";

    console.error(
      "오늘의 운세 계산 오류:",
      error
    );
  }
}

export function updateDailyFortunePage({
  result,
  strengthResult,
  birthInfo
}) {
  context = null;

  try {
    const pillars = result.toHanjaObject();

    if (birthInfo.unknownTime) {
      pillars.hour = null;
    }

    const birth = birthInfo.isLunar
      ? lunarToSolar(
          birthInfo.year,
          birthInfo.month,
          birthInfo.day,
          birthInfo.isLeapMonth
        )
      : birthInfo;

    const pad = number =>
      String(number).padStart(2, "0");

    const birthDate =
      `${birth.year}-${pad(birth.month)}-${pad(birth.day)}`;

    const birthTime =
      `${pad(birthInfo.hour)}:${pad(birthInfo.minute)}`;

    const fortuneCycle = calculateFortuneCycle({
      birthDate,
      birthTime,
      unknownTime: birthInfo.unknownTime,
      gender: birthInfo.gender,
      pillars,
      count: 10
    });

    const effectiveStrength =
      birthInfo.unknownTime
        ? calculateStrength(
            Object.fromEntries(
              Object.entries(pillars).map(
                ([key, value]) => [
                  key,
                  value?.hanja ?? null
                ]
              )
            )
          )
        : strengthResult;

    context = {
      pillars,
      fortuneCycle,
      usefulGod:
        calculateUsefulGod(effectiveStrength),
      gender: birthInfo.gender,
      unknownTime: birthInfo.unknownTime
    };

    if (followsToday) {
      dateInput.value = koreaDate();
    }

    refresh();
  } catch (error) {
    output.replaceChildren();

    section.dataset.ready = "false";

    status.textContent =
      error.message ||
      "출생 정보를 다시 확인해주세요.";

    console.error(
      "오늘의 운세 초기화 오류:",
      error
    );
  }
}

dateInput.addEventListener("change", () => {
  followsToday =
    dateInput.value === koreaDate();

  refresh();
});

section.addEventListener("click", event => {
  if (event.target.closest("#dailyLottoDraw")) {
    lottoNumbers = drawLottoNumbers();

    document.getElementById(
      "dailyLottoNumbers"
    ).innerHTML = renderLottoNumbers(lottoNumbers);

    return;
  }

  const shift = event.target.closest(
    "[data-daily-shift]"
  );

  if (!shift) return;

  try {
    const date = new Date(
      `${dateInput.value}T12:00:00+09:00`
    );

    date.setTime(
      date.getTime() +
      Number(shift.dataset.dailyShift) *
      86400000
    );

    dateInput.value = koreaDate(date);

    followsToday =
      dateInput.value === koreaDate();

    refresh();
  } catch {
    status.textContent =
      "조회 날짜를 선택해주세요.";
  }
});

document.getElementById(
  "dailyToday"
).addEventListener("click", () => {
  followsToday = true;
  dateInput.value = koreaDate();

  refresh();
});

/*
  오늘 조회 중에는 1분 간격으로
  자정 · 절입 · 대운 변화를 반영합니다.
*/

setInterval(() => {
  if (
    context &&
    followsToday &&
    !document.hidden
  ) {
    dateInput.value = koreaDate();
    refresh();
  }
}, 60000);

document.addEventListener(
  "visibilitychange",
  () => {
    if (
      !document.hidden &&
      followsToday &&
      context
    ) {
      dateInput.value = koreaDate();
      refresh();
    }
  }
);