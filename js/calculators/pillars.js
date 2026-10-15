import {
  calculateFourPillars
} from "../lib/manseryeok.js";


export function calculatePillars(birthInfo) {

  const result = calculateFourPillars({
    year: birthInfo.year,
    month: birthInfo.month,
    day: birthInfo.day,

    hour: birthInfo.hour,
    minute: birthInfo.minute,

    isLunar: birthInfo.isLunar,
    isLeapMonth: birthInfo.isLeapMonth,

    gender: birthInfo.gender,

    dayBoundary: "midnight"
  });

  return result;
}