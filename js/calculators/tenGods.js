import {
  STEMS
} from "../data/stems.js";


const GENERATES = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood"
};


const CONTROLS = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire"
};


export function calculateTenGod(
  dayStem,
  targetStem
) {

  if (dayStem === targetStem) {
    return "비견";
  }


  const day =
    STEMS[dayStem];

  const target =
    STEMS[targetStem];


  if (!day || !target) {
    return "";
  }


  const samePolarity =
    day.polarity === target.polarity;


  // 같은 오행
  if (day.element === target.element) {

    return samePolarity
      ? "비견"
      : "겁재";

  }


  // 내가 생해주는 오행
  if (
    GENERATES[day.element] ===
    target.element
  ) {

    return samePolarity
      ? "식신"
      : "상관";

  }


  // 내가 극하는 오행
  if (
    CONTROLS[day.element] ===
    target.element
  ) {

    return samePolarity
      ? "편재"
      : "정재";

  }


  // 나를 극하는 오행
  if (
    CONTROLS[target.element] ===
    day.element
  ) {

    return samePolarity
      ? "편관"
      : "정관";

  }


  // 나를 생해주는 오행
  if (
    GENERATES[target.element] ===
    day.element
  ) {

    return samePolarity
      ? "편인"
      : "정인";

  }


  return "";
}