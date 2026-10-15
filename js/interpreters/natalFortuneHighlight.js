import {
  TEN_GOD_RULES,
  STEM_RULES,
  BRANCH_RULES,
  STAGE_RULES,
  SINSAL_RULES,
  GONGMANG_RULES
} from "../data/directReadingRules.js";

import { getCurrentTenGod } from "./directReading.js";

/*
 * Highlight priority, NOT a fortune probability or an auspiciousness score.
 * Reuse the existing rule.focus order. Do not count words in the prose,
 * assign invented scores, or blindly highlight the first rendered card.
 * Secondary rules are used only when the primary rule has no visible match.
 */
const SECTION_DOMAINS = new Map([
  ["학업·합격운", "study"],
  ["취업·직업운", "career"],
  ["직업운", "career"],
  ["명예·승진운", "honor"],
  ["재물운", "wealth"],
  ["애정·이성운", "love"],
  ["애정·관계", "love"],
  ["결혼·배우자운", "marriage"],
  ["자녀운", "children"],
  ["건강운", "health"]
]);

/*
 * Exact aliases for the existing focus vocabulary.
 * Broad words such as general stability, delay, or social connections are
 * deliberately NOT treated as money, good luck, or romantic success.
 * Expertise can refer to the career card when a pattern has no study card.
 */
const FOCUS_DOMAINS = new Map([
  ["학업운", ["study"]],
  ["합격운", ["study"]],
  ["자격운", ["study"]],
  ["연구운", ["study"]],
  ["전문성운", ["study", "career"]],
  ["취업운", ["career"]],
  ["직업운", ["career"]],
  ["사업운", ["career"]],
  ["독립운", ["career"]],
  ["이직운", ["career"]],
  ["직업변화", ["career"]],
  ["직업선택", ["career"]],
  ["취업준비", ["career"]],
  ["기술운", ["career"]],
  ["실무운", ["career"]],
  ["기획운", ["career"]],
  ["명예운", ["honor"]],
  ["승진운", ["honor"]],
  ["평가운", ["honor"]],
  ["리더운", ["honor"]],
  ["재물운", ["wealth"]],
  ["재물관리", ["wealth"]],
  ["재정관리", ["wealth"]],
  ["축적운", ["wealth"]],
  ["이성운", ["love"]],
  ["애정운", ["love"]],
  ["연애운", ["love"]],
  ["배우자운", ["marriage"]],
  ["결혼운", ["marriage"]],
  ["자녀운", ["children"]]
]);

function normalize(value) {
  return String(value ?? "").replace(/\s+/g, "").trim();
}

export function getNatalSectionDomain(title) {
  return SECTION_DOMAINS.get(normalize(title)) ?? null;
}

function getRuleSources(reading, data) {
  const sources = [];
  const add = (rule, label) => {
    if (Array.isArray(rule?.focus) && rule.focus.length) {
      sources.push({ focus: rule.focus, label });
    }
  };
  const addTenGod = (name, label = "십성") => {
    add(TEN_GOD_RULES[name], `${label} ${name}`);
  };

  if (data.type === "coexistence" || data.type === "ganYeojidong") {
    // Use the SAME representative ten-gods already displayed by patternReading.
    const meta = Array.isArray(reading.meta) ? reading.meta : [];
    const labels = data.type === "coexistence"
      ? ["대표 십성"]
      : ["천간 십성", "지지 십성"];
    labels.forEach(label => {
      const item = meta.find(entry => entry?.label === label);
      if (item) addTenGod(item.value, label);
    });
    return sources;
  }

  switch (data.type) {
    case "stage":
      add(STAGE_RULES[data.name], `12운성 ${data.name}`);
      break;
    case "twelveSinsal":
      add(SINSAL_RULES[data.name], `12신살 ${data.name}`);
      break;
    case "gongmang":
      add(GONGMANG_RULES[data.pillarKey], "공망");
      break;
    case "stem":
    case "branch":
    case "tenGod":
    case "hidden":
      break;
    default:
      // Unknown data must not manufacture a winner.
      return sources;
  }

  addTenGod(getCurrentTenGod(data));

  if (data.type === "stem") {
    add(STEM_RULES[data.value], `천간 ${data.value}`);
  } else if (data.type === "branch" || data.type === "hidden") {
    const branch = data.type === "hidden" ? data.branch : data.value;
    add(BRANCH_RULES[branch], `지지 ${branch}`);
  }

  return sources;
}

/**
 * Return at most ONE visible section using the existing rule priority.
 * The original reading and its sections are never mutated.
 * Missing or unsupported data yields null, not an arbitrary first card.
 */
export function pickStrongestNatalSection(reading, data) {
  if (!Array.isArray(reading?.sections) || !data || typeof data !== "object") {
    return null;
  }

  const candidates = reading.sections
    .map((section, sectionIndex) => ({
      section,
      sectionIndex,
      domain: getNatalSectionDomain(section?.title)
    }))
    .filter(item => item.domain && String(item.section?.text ?? "").trim());

  for (const source of getRuleSources(reading, data)) {
    for (const focus of source.focus) {
      for (const domain of FOCUS_DOMAINS.get(normalize(focus)) ?? []) {
        const match = candidates.find(item => item.domain === domain);
        if (match) {
          return {
            sectionIndex: match.sectionIndex,
            domain,
            focus,
            source: source.label
          };
        }
      }
    }
  }

  return null;
}
