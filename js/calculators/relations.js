/* =========================================
   천간 / 지지 관계 계산
========================================= */


/* =========================================
   한글 이름
========================================= */

const STEM_KOREAN = {

  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계"

};


const BRANCH_KOREAN = {

  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해"

};


/* =========================================
   천간합
========================================= */

const STEM_COMBINE = [

  {
    pair: ["甲", "己"],
    element: "土"
  },

  {
    pair: ["乙", "庚"],
    element: "金"
  },

  {
    pair: ["丙", "辛"],
    element: "水"
  },

  {
    pair: ["丁", "壬"],
    element: "木"
  },

  {
    pair: ["戊", "癸"],
    element: "火"
  }

];


/* =========================================
   천간충
========================================= */

const STEM_CLASH = [

  ["甲", "庚"],
  ["乙", "辛"],
  ["丙", "壬"],
  ["丁", "癸"]

];


/* =========================================
   지지 육합
========================================= */

const BRANCH_COMBINE = [

  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"]

];


/* =========================================
   지지 충
========================================= */

const BRANCH_CLASH = [

  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"]

];


/* =========================================
   지지 형
========================================= */

const BRANCH_PUNISHMENT = [

  ["寅", "巳"],
  ["巳", "申"],
  ["申", "寅"],

  ["丑", "戌"],
  ["戌", "未"],
  ["未", "丑"],

  ["子", "卯"]

];


/* =========================================
   자형
========================================= */

const SELF_PUNISHMENT = [

  "辰",
  "午",
  "酉",
  "亥"

];


/* =========================================
   지지 파
========================================= */

const BRANCH_BREAK = [

  ["子", "酉"],
  ["丑", "辰"],
  ["寅", "亥"],
  ["卯", "午"],
  ["巳", "申"],
  ["未", "戌"]

];


/* =========================================
   지지 해
========================================= */

const BRANCH_HARM = [

  ["子", "未"],
  ["丑", "午"],
  ["寅", "巳"],
  ["卯", "辰"],
  ["申", "亥"],
  ["酉", "戌"]

];


/* =========================================
   원진

   子未
   丑午
   寅酉
   卯申
   辰亥
   巳戌
========================================= */

const WONJIN = [

  ["子", "未"],
  ["丑", "午"],
  ["寅", "酉"],
  ["卯", "申"],
  ["辰", "亥"],
  ["巳", "戌"]

];


/* =========================================
   삼합
========================================= */

const THREE_COMBINE = [

  {
    branches: [
      "申",
      "子",
      "辰"
    ],

    element:
      "水"
  },

  {
    branches: [
      "亥",
      "卯",
      "未"
    ],

    element:
      "木"
  },

  {
    branches: [
      "寅",
      "午",
      "戌"
    ],

    element:
      "火"
  },

  {
    branches: [
      "巳",
      "酉",
      "丑"
    ],

    element:
      "金"
  }

];


/* =========================================
   반합

   왕지를 포함하는 두 글자만 사용

   申子 / 子辰
   亥卯 / 卯未
   寅午 / 午戌
   巳酉 / 酉丑
========================================= */

const HALF_COMBINE = [

  {
    pair: ["申", "子"],
    group: "申子辰",
    element: "水"
  },

  {
    pair: ["子", "辰"],
    group: "申子辰",
    element: "水"
  },


  {
    pair: ["亥", "卯"],
    group: "亥卯未",
    element: "木"
  },

  {
    pair: ["卯", "未"],
    group: "亥卯未",
    element: "木"
  },


  {
    pair: ["寅", "午"],
    group: "寅午戌",
    element: "火"
  },

  {
    pair: ["午", "戌"],
    group: "寅午戌",
    element: "火"
  },


  {
    pair: ["巳", "酉"],
    group: "巳酉丑",
    element: "金"
  },

  {
    pair: ["酉", "丑"],
    group: "巳酉丑",
    element: "金"
  }

];


/* =========================================
   방합
========================================= */

const DIRECTION_COMBINE = [

  {
    branches: [
      "寅",
      "卯",
      "辰"
    ],

    element:
      "木"
  },

  {
    branches: [
      "巳",
      "午",
      "未"
    ],

    element:
      "火"
  },

  {
    branches: [
      "申",
      "酉",
      "戌"
    ],

    element:
      "金"
  },

  {
    branches: [
      "亥",
      "子",
      "丑"
    ],

    element:
      "水"
  }

];


/* =========================================
   기둥 분리
========================================= */

function splitPillar(
  pillar
) {

  const chars =
    Array.from(
      pillar.hanja
    );


  return {

    stem:
      chars[0],

    branch:
      chars[1]

  };

}


/* =========================================
   순서 관계없이 같은 두 글자인지
========================================= */

function samePair(
  first,
  second,
  pair
) {

  return (

    (
      first === pair[0] &&
      second === pair[1]
    )

    ||

    (
      first === pair[1] &&
      second === pair[0]
    )

  );

}


/* =========================================
   표시 이름
========================================= */

function createPairDisplayName(
  pair,
  suffix,
  layer = "branch"
) {

  const map =
    layer === "stem"

      ? STEM_KOREAN

      : BRANCH_KOREAN;


  return `

    ${map[pair[0]]}
    ${map[pair[1]]}
    ${suffix}

  `
    .replace(/\s+/g, "")
    .trim();

}


/* =========================================
   관계 계산
========================================= */

export function calculateRelations(
  pillars
) {

  const hour =
    splitPillar(
      pillars.hour
    );


  const day =
    splitPillar(
      pillars.day
    );


  const month =
    splitPillar(
      pillars.month
    );


  const year =
    splitPillar(
      pillars.year
    );


  const pillarList = [

    {
      key:
        "hour",

      label:
        "시주",

      stemPosition:
        "hourStem",

      branchPosition:
        "hourBranch",

      ...hour
    },


    {
      key:
        "day",

      label:
        "일주",

      stemPosition:
        "dayStem",

      branchPosition:
        "dayBranch",

      ...day
    },


    {
      key:
        "month",

      label:
        "월주",

      stemPosition:
        "monthStem",

      branchPosition:
        "monthBranch",

      ...month
    },


    {
      key:
        "year",

      label:
        "년주",

      stemPosition:
        "yearStem",

      branchPosition:
        "yearBranch",

      ...year
    }

  ];


  const results = [];


  /* =========================================
     이미 완전한 삼합이 있는 그룹

     완전 삼합이면
     같은 그룹의 반합 카드는 생략
  ========================================= */

  const activeThreeGroups =
    new Set(

      THREE_COMBINE

        .filter(
          rule =>

            rule.branches.every(
              branch =>

                pillarList.some(
                  pillar =>
                    pillar.branch === branch
                )

            )

        )

        .map(
          rule =>
            rule.branches.join("")
        )

    );


  /* =========================================
     두 기둥 관계 추가
  ========================================= */

  function addPairRelation({

    name,
    category,
    layer,

    first,
    second,

    canonicalPair,

    basis,

    element = null,

    group = null,

    displayName = null

  }) {

    const isStem =
      layer === "stem";


    const firstPosition =
      isStem

        ? first.stemPosition

        : first.branchPosition;


    const secondPosition =
      isStem

        ? second.stemPosition

        : second.branchPosition;


    const firstSymbol =
      isStem

        ? first.stem

        : first.branch;


    const secondSymbol =
      isStem

        ? second.stem

        : second.branch;


    results.push({

      name,

      displayName:
        displayName ??
        name,

      category,

      layer,

      symbols:
        canonicalPair.join(""),

      pillars: [
        first.label,
        second.label
      ],

      positions: [
        firstPosition,
        secondPosition
      ],

      members: [

        {
          pillar:
            first.label,

          position:
            firstPosition,

          symbol:
            firstSymbol
        },

        {
          pillar:
            second.label,

          position:
            secondPosition,

          symbol:
            secondSymbol
        }

      ],

      element,

      group,

      basis

    });

  }


  /* =========================================
     두 기둥씩 비교
  ========================================= */

  for (
    let i = 0;
    i < pillarList.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < pillarList.length;
      j++
    ) {

      const first =
        pillarList[i];


      const second =
        pillarList[j];


      /* =====================================
         천간합
      ===================================== */

      STEM_COMBINE.forEach(
        rule => {

          if (
            samePair(
              first.stem,
              second.stem,
              rule.pair
            )
          ) {

            addPairRelation({

              name:
                "합",

              category:
                "combine",

              layer:
                "stem",

              first,
              second,

              canonicalPair:
                rule.pair,

              element:
                rule.element,

              basis:
                "천간 오합",

              displayName:
                createPairDisplayName(
                  rule.pair,
                  "합",
                  "stem"
                )

            });

          }

        }
      );


      /* =====================================
         천간충
      ===================================== */

      STEM_CLASH.forEach(
        pair => {

          if (
            samePair(
              first.stem,
              second.stem,
              pair
            )
          ) {

            addPairRelation({

              name:
                "충",

              category:
                "clash",

              layer:
                "stem",

              first,
              second,

              canonicalPair:
                pair,

              basis:
                "천간 충",

              displayName:
                createPairDisplayName(
                  pair,
                  "충",
                  "stem"
                )

            });

          }

        }
      );


      /* =====================================
         지지 육합
      ===================================== */

      BRANCH_COMBINE.forEach(
        pair => {

          if (
            samePair(
              first.branch,
              second.branch,
              pair
            )
          ) {

            addPairRelation({

              name:
                "육합",

              category:
                "combine",

              layer:
                "branch",

              first,
              second,

              canonicalPair:
                pair,

              basis:
                "지지 육합",

              displayName:
                createPairDisplayName(
                  pair,
                  "육합"
                )

            });

          }

        }
      );


      /* =====================================
         반합
      ===================================== */

      HALF_COMBINE.forEach(
        rule => {

          /*
            이미 세 글자가 다 있어서
            완전 삼합이 성립했다면
            반합은 따로 표시하지 않음
          */

          if (
            activeThreeGroups.has(
              rule.group
            )
          ) {
            return;
          }


          if (
            samePair(
              first.branch,
              second.branch,
              rule.pair
            )
          ) {

            addPairRelation({

              name:
                "반합",

              category:
                "combine",

              layer:
                "branch",

              first,
              second,

              canonicalPair:
                rule.pair,

              element:
                rule.element,

              group:
                rule.group,

              basis:
                "지지 삼합 반합 · 왕지 포함",

              displayName:
                createPairDisplayName(
                  rule.pair,
                  "반합"
                )

            });

          }

        }
      );


      /* =====================================
         지지 충
      ===================================== */

      BRANCH_CLASH.forEach(
        pair => {

          if (
            samePair(
              first.branch,
              second.branch,
              pair
            )
          ) {

            addPairRelation({

              name:
                "충",

              category:
                "clash",

              layer:
                "branch",

              first,
              second,

              canonicalPair:
                pair,

              basis:
                "지지 육충",

              displayName:
                createPairDisplayName(
                  pair,
                  "충"
                )

            });

          }

        }
      );


      /* =====================================
         형
      ===================================== */

      BRANCH_PUNISHMENT.forEach(
        pair => {

          if (
            samePair(
              first.branch,
              second.branch,
              pair
            )
          ) {

            addPairRelation({

              name:
                "형",

              category:
                "punishment",

              layer:
                "branch",

              first,
              second,

              canonicalPair:
                pair,

              basis:
                "지지 형",

              displayName:
                createPairDisplayName(
                  pair,
                  "형"
                )

            });

          }

        }
      );


      /* =====================================
         자형
      ===================================== */

      if (
        first.branch ===
          second.branch

        &&

        SELF_PUNISHMENT.includes(
          first.branch
        )
      ) {

        addPairRelation({

          name:
            "자형",

          category:
            "punishment",

          layer:
            "branch",

          first,
          second,

          canonicalPair: [
            first.branch,
            second.branch
          ],

          basis:
            "지지 자형",

          displayName:
            `${BRANCH_KOREAN[first.branch]}${BRANCH_KOREAN[second.branch]}자형`

        });

      }


      /* =====================================
         파
      ===================================== */

      BRANCH_BREAK.forEach(
        pair => {

          if (
            samePair(
              first.branch,
              second.branch,
              pair
            )
          ) {

            addPairRelation({

              name:
                "파",

              category:
                "break",

              layer:
                "branch",

              first,
              second,

              canonicalPair:
                pair,

              basis:
                "지지 파",

              displayName:
                createPairDisplayName(
                  pair,
                  "파"
                )

            });

          }

        }
      );


      /* =====================================
         해
      ===================================== */

      BRANCH_HARM.forEach(
        pair => {

          if (
            samePair(
              first.branch,
              second.branch,
              pair
            )
          ) {

            addPairRelation({

              name:
                "해",

              category:
                "harm",

              layer:
                "branch",

              first,
              second,

              canonicalPair:
                pair,

              basis:
                "지지 육해",

              displayName:
                createPairDisplayName(
                  pair,
                  "해"
                )

            });

          }

        }
      );


      /* =====================================
         원진
      ===================================== */

      WONJIN.forEach(
        pair => {

          if (
            samePair(
              first.branch,
              second.branch,
              pair
            )
          ) {

            addPairRelation({

              name:
                "원진",

              category:
                "conflict",

              layer:
                "branch",

              first,
              second,

              canonicalPair:
                pair,

              basis:
                "지지 원진",

              displayName:
                createPairDisplayName(
                  pair,
                  "원진"
                )

            });

          }

        }
      );

    }

  }


  /* =========================================
     삼합 / 방합
  ========================================= */

  function addThreeRelation(
    rules,
    name,
    basis
  ) {

    rules.forEach(
      rule => {

        const matched =
          rule.branches.map(
            branch =>

              pillarList.find(
                pillar =>
                  pillar.branch ===
                  branch
              )

          );


        if (
          !matched.every(Boolean)
        ) {
          return;
        }


        results.push({

          name,

          displayName:
            `${

              rule.branches

                .map(
                  branch =>
                    BRANCH_KOREAN[
                      branch
                    ]
                )

                .join("")

            }${name}`,

          category:
            "combine",

          layer:
            "branch",

          symbols:
            rule.branches.join(""),

          pillars:
            matched.map(
              item =>
                item.label
            ),

          positions:
            matched.map(
              item =>
                item.branchPosition
            ),

          members:
            matched.map(
              item => ({

                pillar:
                  item.label,

                position:
                  item.branchPosition,

                symbol:
                  item.branch

              })
            ),

          element:
            rule.element,

          basis

        });

      }
    );

  }


  addThreeRelation(
    THREE_COMBINE,
    "삼합",
    "지지 삼합"
  );


  addThreeRelation(
    DIRECTION_COMBINE,
    "방합",
    "지지 방합"
  );


  /* =========================================
     중복 제거
  ========================================= */

  const unique =
    new Map();


  results.forEach(
    item => {

      const key =
        [

          item.name,
          item.symbols,

          ...item.positions

        ].join("-");


      if (
        !unique.has(key)
      ) {

        unique.set(
          key,
          item
        );

      }

    }
  );


  return Array.from(
    unique.values()
  );

}