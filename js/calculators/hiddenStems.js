/* =========================================
   지장간

   stems = 지장간 전체
   main  = 정기(본기)

   십성 비율 계산에서는
   main만 사용
========================================= */

const HIDDEN_STEMS = {

  子: {
    stems: [
      "癸"
    ],
    main: "癸"
  },


  丑: {
    stems: [
      "癸",
      "辛",
      "己"
    ],
    main: "己"
  },


  寅: {
    stems: [
      "戊",
      "丙",
      "甲"
    ],
    main: "甲"
  },


  卯: {
    stems: [
      "乙"
    ],
    main: "乙"
  },


  辰: {
    stems: [
      "乙",
      "癸",
      "戊"
    ],
    main: "戊"
  },


  巳: {
    stems: [
      "戊",
      "庚",
      "丙"
    ],
    main: "丙"
  },


  午: {
    stems: [
      "丙",
      "己",
      "丁"
    ],
    main: "丁"
  },


  未: {
    stems: [
      "丁",
      "乙",
      "己"
    ],
    main: "己"
  },


  申: {
    stems: [
      "戊",
      "壬",
      "庚"
    ],
    main: "庚"
  },


  酉: {
    stems: [
      "辛"
    ],
    main: "辛"
  },


  戌: {
    stems: [
      "辛",
      "丁",
      "戊"
    ],
    main: "戊"
  },


  亥: {
    stems: [
      "甲",
      "壬"
    ],
    main: "壬"
  }

};


/* =========================================
   지장간 전체
========================================= */

export function getHiddenStems(
  branch
) {

  return (
    HIDDEN_STEMS[
      branch
    ]?.stems ?? []
  );

}


/* =========================================
   정기 / 본기
========================================= */

export function getMainHiddenStem(
  branch
) {

  return (
    HIDDEN_STEMS[
      branch
    ]?.main ?? ""
  );

}