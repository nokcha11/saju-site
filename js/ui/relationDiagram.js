import { STEMS } from "../data/stems.js";
import { BRANCHES } from "../data/branches.js";

const WIDTH = 880;
const CELL_WIDTH = 112;
const CELL_HEIGHT = 64;
const LANE_GAP = 44;

const COLUMNS = [
  {
    key: "hour",
    stemLabel: "시간",
    branchLabel: "시지",
    x: 110
  },
  {
    key: "day",
    stemLabel: "일간",
    branchLabel: "일지",
    x: 330
  },
  {
    key: "month",
    stemLabel: "월간",
    branchLabel: "월지",
    x: 550
  },
  {
    key: "year",
    stemLabel: "년간",
    branchLabel: "년지",
    x: 770
  }
];

const COLORS = {
  wood: {
    fill: "#43b581",
    text: "#09251b"
  },
  fire: {
    fill: "#ff5c5c",
    text: "#ffffff"
  },
  earth: {
    fill: "#daae43",
    text: "#211a08"
  },
  metal: {
    fill: "#cdd3de",
    text: "#171b23"
  },
  water: {
    fill: "#4a597a",
    text: "#ffffff"
  },
  unknown: {
    fill: "#30333c",
    text: "#c7cad3"
  }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* 관계도 전용 CSS 연결 */

export function ensureRelationDiagramCss() {
  const existing = document.querySelector(
    'link[data-relation-diagram-css="true"]'
  );

  if (existing) {
    return;
  }

  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = new URL(
    "../../css/relation-diagram.css",
    import.meta.url
  ).href;

  link.dataset.relationDiagramCss = "true";

  document.head.appendChild(link);
}

/* 기둥에서 천간·지지 추출 */

function symbolsOf(pillar) {
  const value =
    typeof pillar === "string"
      ? pillar
      : (
          pillar?.hanja ??
          pillar?.ganji ??
          pillar?.value ??
          ""
        );

  const chars = Array.from(value);

  return {
    stem: pillar?.stem ?? chars[0] ?? "",
    branch: pillar?.branch ?? chars[1] ?? ""
  };
}

/* 실제 관계 결과를 연결선으로 변환 */

function collectEdges(items, layer) {
  const suffix =
    layer === "stem" ? "Stem" : "Branch";

  return items
    .map((item, index) => {
      const positions =
        item.positions ??
        item.members?.map(member => member.position) ??
        [];

      const columns = [
        ...new Set(
          positions
            .map(position =>
              COLUMNS.findIndex(
                column =>
                  `${column.key}${suffix}` === position
              )
            )
            .filter(column => column >= 0)
        )
      ].sort((a, b) => a - b);

      return {
        item,
        index,
        columns
      };
    })
    .filter(
      edge =>
        edge.item.layer === layer &&
        edge.columns.length >= 2
    )
    .sort((a, b) => {
      const spanA =
        a.columns.at(-1) - a.columns[0];

      const spanB =
        b.columns.at(-1) - b.columns[0];

      return (
        spanA - spanB ||
        a.columns[0] - b.columns[0] ||
        a.index - b.index
      );
    });
}

/* 천간·지지 색상 칸 */

function buildCell(symbol, layer, x, y) {
  const data =
    layer === "stem"
      ? STEMS[symbol]
      : BRANCHES[symbol];

  const color =
    COLORS[data?.element] ?? COLORS.unknown;

  return `
    <rect
      x="${x - CELL_WIDTH / 2}"
      y="${y}"
      width="${CELL_WIDTH}"
      height="${CELL_HEIGHT}"
      rx="15"
      fill="${color.fill}"
      stroke="rgba(255,255,255,0.15)"
    />

    <text
      x="${x}"
      y="${y + CELL_HEIGHT / 2 + 2}"
      text-anchor="middle"
      dominant-baseline="central"
      font-size="42"
      font-weight="800"
      fill="${color.text}"
    >
      ${escapeHtml(symbol || "—")}
    </text>
  `;
}

/* U자 연결선과 관계명 */

function buildLinks(edges, startY, firstLaneY) {
  const ports = COLUMNS.map(
    (_, column) =>
      edges.filter(
        edge => edge.columns.includes(column)
      )
  );

  return edges
    .map((edge, lane) => {
      const points = edge.columns.map(column => {
        const connections = ports[column];
        const port = connections.indexOf(edge);

        const offset =
          (
            port -
            (connections.length - 1) / 2
          ) * 7;

        return COLUMNS[column].x + offset;
      });

      const left = points[0];
      const right = points.at(-1);

      const bottom =
        firstLaneY + lane * LANE_GAP;

      const center = (left + right) / 2;
      const radius = 8;

      const name = String(
        edge.item.displayName ?? edge.item.name
      ).trim();

      const labelWidth = Math.max(
        82,
        Math.min(
          right - left - 20,
          Array.from(name).length * 18 + 22
        )
      );

      const combine =
        edge.item.category === "combine";

      const color =
        combine ? "#9bdcb9" : "#e4b3bc";

      /*
       * 삼합·방합처럼 세 기둥을 잇는 경우
       * 가운데 기둥도 아래 연결선에 연결합니다.
       */

      const extraBranches = points
        .slice(1, -1)
        .map(
          x => `
            <path
              class="relation-map-line"
              d="M ${x} ${startY} V ${bottom}"
              stroke="${color}"
              fill="none"
            />
          `
        )
        .join("");

      const dots = points
        .map(
          x => `
            <circle
              cx="${x}"
              cy="${startY}"
              r="3"
              fill="${color}"
            />
          `
        )
        .join("");

      const location =
        edge.item.pillars.join(" · ");

      return `
        <g
          class="relation-map-link ${combine ? "is-combine" : "is-conflict"}"
          data-relation-index="${edge.index}"
          tabindex="0"
          role="button"
          aria-label="${escapeHtml(location)} ${escapeHtml(name)} 상세 해석 보기"
        >
          <title>
            ${escapeHtml(location)} · ${escapeHtml(name)}
          </title>

          <path
            class="relation-map-line"
            d="
              M ${left} ${startY}
              V ${bottom - radius}
              Q ${left} ${bottom} ${left + radius} ${bottom}
              H ${right - radius}
              Q ${right} ${bottom} ${right} ${bottom - radius}
              V ${startY}
            "
            stroke="${color}"
            fill="none"
          />

          ${extraBranches}
          ${dots}

          <rect
            class="relation-map-label-bg"
            x="${center - labelWidth / 2}"
            y="${bottom + 7}"
            width="${labelWidth}"
            height="28"
            rx="9"
            fill="#272831"
            stroke="${color}"
            stroke-opacity="0.3"
          />

          <text
            x="${center}"
            y="${bottom + 26}"
            text-anchor="middle"
            font-size="18"
            font-weight="600"
            fill="${color}"
          >
            ${escapeHtml(name)}
          </text>
        </g>
      `;
    })
    .join("");
}

/* 전체 관계도 */

export function buildRelationDiagram(pillars, items) {
  const stems = collectEdges(items, "stem");
  const branches = collectEdges(items, "branch");

  const stemY = 42;

  const stemSpace =
    stems.length
      ? 30 + stems.length * LANE_GAP
      : 0;

  const branchY = 142 + stemSpace;

  const branchStart =
    branchY + CELL_HEIGHT + 44;

  const height =
    branchY +
    CELL_HEIGHT +
    64 +
    branches.length * LANE_GAP;

  const cells = COLUMNS
    .map(column => {
      const symbols = symbolsOf(
        pillars[column.key]
      );

      return `
        <text
          x="${column.x}"
          y="26"
          text-anchor="middle"
          font-size="22"
          font-weight="600"
          fill="#dddfe8"
        >
          ${column.stemLabel}
        </text>

        ${
          buildCell(
            symbols.stem,
            "stem",
            column.x,
            stemY
          )
        }

        ${
          buildCell(
            symbols.branch,
            "branch",
            column.x,
            branchY
          )
        }

        <text
          x="${column.x}"
          y="${branchY + CELL_HEIGHT + 28}"
          text-anchor="middle"
          font-size="22"
          font-weight="600"
          fill="#dddfe8"
        >
          ${column.branchLabel}
        </text>
      `;
    })
    .join("");

  const stemLinks = buildLinks(
    stems,
    stemY + CELL_HEIGHT + 6,
    stemY + CELL_HEIGHT + 26
  );

  const branchLinks = buildLinks(
    branches,
    branchStart,
    branchStart + 16
  );

  const note =
    stems.length + branches.length
      ? "관계명을 누르면 해당 연결의 상세 해석을 확인할 수 있습니다."
      : "현재 계산에서 연결선으로 표시할 주요 관계가 없습니다.";

  return `
    <div class="relation-map-panel">
      <div class="relation-map-heading">
        <h3>관계 한눈에 보기</h3>

        <div
          class="relation-map-legend"
          aria-label="연결선 색상"
        >
          <span class="is-combine">
            결합 · 강화
          </span>

          <span class="is-conflict">
            변화 · 마찰
          </span>
        </div>
      </div>

      <div
        class="relation-map-scroll"
        tabindex="0"
        role="region"
        aria-label="원국 관계도, 작은 화면에서는 좌우로 이동할 수 있습니다"
      >
        <svg
          class="relation-map-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 ${WIDTH} ${height}"
          role="group"
          aria-label="천간과 지지의 원국 관계도"
          style="font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif"
        >
          <title>
            원국의 천간·지지 관계도
          </title>

          <desc>
            왼쪽부터 시주, 일주, 월주, 년주입니다.
            연결선은 위 관계 카드와 같은 계산 결과입니다.
          </desc>

          ${cells}
          ${stemLinks}
          ${branchLinks}
        </svg>
      </div>

      <p class="relation-map-note">
        ${note}
        작은 화면에서는 관계도를 좌우로 이동해 보세요.
      </p>
    </div>
  `;
}