import {
  DAY_STEM_BRANCH_RULES,
  YEAR_DAY_STEM_BRANCH_RULES,
  MONTH_BRANCH_STEM_RULES,
  CHEONDEOK_RULE,
  DIRECT_CHARACTER_RULES,
  ANY_PILLAR_GANJI_RULES,
  DAY_GANJI_RULES,
  GOSIN_BY_YEAR,
  GWASUK_BY_YEAR,
  GEUPGAK_BY_MONTH,
  TANGHWA_BY_DAY,
  PAIR_RULES,
  BRANCH_ORDER
} from "../data/sinsalRules.js";


import {
  getTwelveSinsal
} from "./twelveSinsal.js";


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
      chars[1],

    ganji:
      chars.join("")

  };

}


/* =========================================
   두 지지 관계 확인
========================================= */

function hasPair(
  first,
  second,
  pairs
) {

  return pairs.some(
    ([a, b]) =>

      (
        first === a &&
        second === b
      )

      ||

      (
        first === b &&
        second === a
      )
  );

}


/* =========================================
   메인 계산
========================================= */

export function calculateSinsal(
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


  /* =========================================
     각 기둥 위치
  ========================================= */

  const pillarList = [

    {
      label: "시주",

      stemPosition:
        "hourStem",

      branchPosition:
        "hourBranch",

      pillarPosition:
        "hourPillar",

      ...hour
    },


    {
      label: "일주",

      stemPosition:
        "dayStem",

      branchPosition:
        "dayBranch",

      pillarPosition:
        "dayPillar",

      ...day
    },


    {
      label: "월주",

      stemPosition:
        "monthStem",

      branchPosition:
        "monthBranch",

      pillarPosition:
        "monthPillar",

      ...month
    },


    {
      label: "년주",

      stemPosition:
        "yearStem",

      branchPosition:
        "yearBranch",

      pillarPosition:
        "yearPillar",

      ...year
    }

  ];


  const results = [];


  /* =========================================
     결과 추가
  ========================================= */

  function addResult({

    name,
    type,
    pillar,
    symbol,
    basis,
    positions = []

  }) {

    results.push({

      name,

      type,

      pillar,

      /*
        기존 UI와 호환
      */
      branch:
        symbol,

      basis,

      /*
        상세 해석용 위치
      */
      positions

    });

  }


  /* =========================================
     1. 일간 → 지지
  ========================================= */

  DAY_STEM_BRANCH_RULES.forEach(
    rule => {

      const targets =
        rule.table[
          day.stem
        ] ?? [];


      pillarList.forEach(
        pillar => {

          if (
            targets.includes(
              pillar.branch
            )
          ) {

            addResult({

              name:
                rule.name,

              type:
                rule.type,

              pillar:
                pillar.label,

              symbol:
                pillar.branch,

              basis:
                "일간 기준 · 지지",

              positions: [
                pillar.branchPosition
              ]

            });

          }

        }
      );

    }
  );


  /* =========================================
     2. 천을귀인
     년간 + 일간 → 지지
  ========================================= */

  YEAR_DAY_STEM_BRANCH_RULES.forEach(
    rule => {

      const references = [

        {
          name:
            "년간",

          stem:
            year.stem
        },

        {
          name:
            "일간",

          stem:
            day.stem
        }

      ];


      references.forEach(
        reference => {

          const targets =
            rule.table[
              reference.stem
            ] ?? [];


          pillarList.forEach(
            pillar => {

              if (
                targets.includes(
                  pillar.branch
                )
              ) {

                addResult({

                  name:
                    rule.name,

                  type:
                    rule.type,

                  pillar:
                    pillar.label,

                  symbol:
                    pillar.branch,

                  basis:
                    `${reference.name} 기준 · 지지`,

                  positions: [
                    pillar.branchPosition
                  ]

                });

              }

            }
          );

        }
      );

    }
  );


  /* =========================================
     3. 월덕귀인
     월지 → 천간
  ========================================= */

  MONTH_BRANCH_STEM_RULES.forEach(
    rule => {

      const targets =
        rule.table[
          month.branch
        ] ?? [];


      pillarList.forEach(
        pillar => {

          if (
            targets.includes(
              pillar.stem
            )
          ) {

            addResult({

              name:
                rule.name,

              type:
                rule.type,

              pillar:
                pillar.label,

              symbol:
                pillar.stem,

              basis:
                "월지 기준 · 천간",

              positions: [
                pillar.stemPosition
              ]

            });

          }

        }
      );

    }
  );


  /* =========================================
     4. 천덕귀인
  ========================================= */

  const cheondeok =
    CHEONDEOK_RULE.table[
      month.branch
    ];


  if (cheondeok) {

    pillarList.forEach(
      pillar => {

        const value =
          cheondeok.position ===
          "stem"

            ? pillar.stem

            : pillar.branch;


        if (
          cheondeok.values.includes(
            value
          )
        ) {

          addResult({

            name:
              CHEONDEOK_RULE.name,

            type:
              CHEONDEOK_RULE.type,

            pillar:
              pillar.label,

            symbol:
              value,

            basis:
              cheondeok.position ===
              "stem"

                ? "월지 기준 · 천간"

                : "월지 기준 · 지지",

            positions: [

              cheondeok.position ===
              "stem"

                ? pillar.stemPosition

                : pillar.branchPosition

            ]

          });

        }

      }
    );

  }


  /* =========================================
     5. 천의성
  ========================================= */

  const monthIndex =
    BRANCH_ORDER.indexOf(
      month.branch
    );


  if (
    monthIndex !== -1
  ) {

    const target =
      BRANCH_ORDER[
        (
          monthIndex -
          1 +
          12
        ) % 12
      ];


    pillarList.forEach(
      pillar => {

        if (
          pillar.branch ===
          target
        ) {

          addResult({

            name:
              "천의성",

            type:
              "길성",

            pillar:
              pillar.label,

            symbol:
              pillar.branch,

            basis:
              "월지 기준 · 지지",

            positions: [
              pillar.branchPosition
            ]

          });

        }

      }
    );

  }


  /* =========================================
     6. 현침살 / 곡각살
  ========================================= */

  DIRECT_CHARACTER_RULES.forEach(
    rule => {

      pillarList.forEach(
        pillar => {


          /* 천간 */

          if (
            rule.stems.includes(
              pillar.stem
            )
          ) {

            addResult({

              name:
                rule.name,

              type:
                rule.type,

              pillar:
                pillar.label,

              symbol:
                pillar.stem,

              basis:
                "천간 글자 기준",

              positions: [
                pillar.stemPosition
              ]

            });

          }


          /* 지지 */

          if (
            rule.branches.includes(
              pillar.branch
            )
          ) {

            addResult({

              name:
                rule.name,

              type:
                rule.type,

              pillar:
                pillar.label,

              symbol:
                pillar.branch,

              basis:
                "지지 글자 기준",

              positions: [
                pillar.branchPosition
              ]

            });

          }

        }
      );

    }
  );


  /* =========================================
     7. 백호대살
  ========================================= */

  ANY_PILLAR_GANJI_RULES.forEach(
    rule => {

      pillarList.forEach(
        pillar => {

          if (
            rule.values.includes(
              pillar.ganji
            )
          ) {

            addResult({

              name:
                rule.name,

              type:
                rule.type,

              pillar:
                pillar.label,

              symbol:
                pillar.ganji,

              basis:
                "간지 기준",

              positions: [
                pillar.pillarPosition
              ]

            });

          }

        }
      );

    }
  );


  /* =========================================
     8. 괴강 / 고란
  ========================================= */

  DAY_GANJI_RULES.forEach(
    rule => {

      if (
        rule.values.includes(
          day.ganji
        )
      ) {

        addResult({

          name:
            rule.name,

          type:
            rule.type,

          pillar:
            "일주",

          symbol:
            day.ganji,

          basis:
            "일주 기준",

          positions: [
            "dayPillar"
          ]

        });

      }

    }
  );


  /* =========================================
     9. 12신살

     ⭐ 핵심 수정 부분

     위 만세력 표와 동일하게
     twelveSinsal.js 사용

     년지 기준으로
     시지 / 일지 / 월지 / 년지 계산
  ========================================= */

  pillarList.forEach(
    pillar => {

      const twelveSinsal =
        getTwelveSinsal(

          year.branch,

          pillar.branch

        );


      if (
        !twelveSinsal
      ) {

        return;

      }


      addResult({

        name:
          twelveSinsal,

        type:
          "신살",

        pillar:
          pillar.label,

        symbol:
          pillar.branch,

        basis:
          "12신살 · 년지 기준",

        positions: [
          pillar.branchPosition
        ]

      });

    }
  );


  /* =========================================
     10. 고신살
  ========================================= */

  const gosinTarget =
    GOSIN_BY_YEAR[
      year.branch
    ];


  pillarList.forEach(
    pillar => {

      if (
        pillar.branch ===
        gosinTarget
      ) {

        addResult({

          name:
            "고신살",

          type:
            "신살",

          pillar:
            pillar.label,

          symbol:
            pillar.branch,

          basis:
            "년지 기준",

          positions: [
            pillar.branchPosition
          ]

        });

      }

    }
  );


  /* =========================================
     11. 과숙살
  ========================================= */

  const gwasukTarget =
    GWASUK_BY_YEAR[
      year.branch
    ];


  pillarList.forEach(
    pillar => {

      if (
        pillar.branch ===
        gwasukTarget
      ) {

        addResult({

          name:
            "과숙살",

          type:
            "신살",

          pillar:
            pillar.label,

          symbol:
            pillar.branch,

          basis:
            "년지 기준",

          positions: [
            pillar.branchPosition
          ]

        });

      }

    }
  );


  /* =========================================
     12. 급각살
  ========================================= */

  const geupgakTargets =
    GEUPGAK_BY_MONTH[
      month.branch
    ] ?? [];


  pillarList.forEach(
    pillar => {

      if (
        geupgakTargets.includes(
          pillar.branch
        )
      ) {

        addResult({

          name:
            "급각살",

          type:
            "신살",

          pillar:
            pillar.label,

          symbol:
            pillar.branch,

          basis:
            "월지 기준",

          positions: [
            pillar.branchPosition
          ]

        });

      }

    }
  );


  /* =========================================
     13. 탕화살
  ========================================= */

  const tanghwaTargets =
    TANGHWA_BY_DAY[
      day.branch
    ] ?? [];


  pillarList.forEach(
    pillar => {

      if (
        tanghwaTargets.includes(
          pillar.branch
        )
      ) {

        addResult({

          name:
            "탕화살",

          type:
            "신살",

          pillar:
            pillar.label,

          symbol:
            pillar.branch,

          basis:
            "일지 기준",

          positions: [
            pillar.branchPosition
          ]

        });

      }

    }
  );


  /* =========================================
     14. 지지 관계

     원진
     귀문
     천라
     지망
  ========================================= */

  PAIR_RULES.forEach(
    rule => {


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


          if (
            !hasPair(

              first.branch,

              second.branch,

              rule.pairs

            )
          ) {

            continue;

          }


          addResult({

            name:
              rule.name,

            type:
              rule.type,

            pillar:
              `${first.label} · ${second.label}`,

            symbol:
              `${first.branch}${second.branch}`,

            basis:
              "지지 관계",

            positions: [

              first.branchPosition,

              second.branchPosition

            ]

          });

        }

      }

    }
  );


  /* =========================================
     중복 정리
  ========================================= */

  const merged =
    new Map();


  results.forEach(
    item => {

      const key =
        [

          item.name,

          item.pillar,

          item.branch

        ].join("-");


      if (
        !merged.has(key)
      ) {

        merged.set(
          key,
          {

            ...item,

            basis: [
              item.basis
            ],

            positions: [
              ...(item.positions ?? [])
            ]

          }
        );


        return;

      }


      const existing =
        merged.get(
          key
        );


      /* 판정기준 합치기 */

      if (
        !existing.basis.includes(
          item.basis
        )
      ) {

        existing.basis.push(
          item.basis
        );

      }


      /* 위치 합치기 */

      (
        item.positions ?? []
      ).forEach(
        position => {

          if (
            !existing.positions.includes(
              position
            )
          ) {

            existing.positions.push(
              position
            );

          }

        }
      );

    }
  );


  return Array.from(
    merged.values()
  );

}