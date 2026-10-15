const STEMS = [
  "甲", "乙", "丙", "丁", "戊",
  "己", "庚", "辛", "壬", "癸"
];

const BRANCHES = [
  "子", "丑", "寅", "卯", "辰", "巳",
  "午", "未", "申", "酉", "戌", "亥"
];


/*
  공망 계산

  甲子旬 → 戌亥
  甲戌旬 → 申酉
  甲申旬 → 午未
  甲午旬 → 辰巳
  甲辰旬 → 寅卯
  甲寅旬 → 子丑
*/

export function getGongmang(
  dayStem,
  dayBranch
) {
  const stemIndex =
    STEMS.indexOf(dayStem);

  const branchIndex =
    BRANCHES.indexOf(dayBranch);


  if (
    stemIndex === -1 ||
    branchIndex === -1
  ) {
    return [];
  }


  // 현재 일주가 속한 甲旬의 시작 지지
  const startBranchIndex =
    (
      branchIndex -
      stemIndex +
      12
    ) % 12;


  const firstVoid =
    BRANCHES[
      (startBranchIndex + 10) % 12
    ];

  const secondVoid =
    BRANCHES[
      (startBranchIndex + 11) % 12
    ];


  return [
    firstVoid,
    secondVoid
  ];
}


export function isGongmang(
  dayStem,
  dayBranch,
  targetBranch
) {
  return getGongmang(
    dayStem,
    dayBranch
  ).includes(targetBranch);
}