/**
 * Breeze-style file icons (the look of KDE's Dolphin), drawn for the portfolio palette:
 * flat folders with a back panel, a lighter front and a symbol for what's inside; paper files
 * with a folded corner and a type badge. Original drawings, so no icon-theme licensing.
 */
import type { FsNode } from '../../lib/desktop/tree';

const MINT = { back: '#2fb07b', front: '#54e0a6', lip: '#8af0c4' };
const GOLD = { back: '#d9a92c', front: '#ffd84d', lip: '#ffe88f' };
const GLYPH = '#0a1626';

/** Symbol on the folder front, by folder. 24px box, drawn at the folder's centre. */
const GLYPHS: Record<string, string> = {
  'Case studies':
    'M8 9V7.5A1.5 1.5 0 0 1 9.5 6h5A1.5 1.5 0 0 1 16 7.5V9M5 9h14v9H5zM5 13h14', // briefcase
  'Side projects': 'M9 8l-4 4 4 4M15 8l4 4-4 4M13 6l-2 12', // </>
  Essays: 'M5 19l1-4L15.5 5.5a2 2 0 0 1 3 3L9 18zM14 7l3 3', // pen
  'About & CV':
    'M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M5 19c1-3.5 3.8-5 7-5s6 1.5 7 5', // person
  Dynatrace: 'M8 11V8.5a4 4 0 0 1 8 0V11M6.5 11h11v8h-11z', // lock
  'Grafana Labs': 'M5 18l4-6 3 3 4-7 3 4', // chart line
  'Open source': 'M7 6v12M7 9a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v3M17 6v4', // branch
};

function Folder({ node, size }: { node: FsNode; size: number }) {
  const c = node.locked ? GOLD : MINT;
  const g = GLYPHS[node.name];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 9h15l4 4h21v27H4z" fill={c.back} />
      <path d="M4 16h40v24H4z" fill={c.front} />
      <path d="M4 16h40v2H4z" fill={c.lip} />
      {g && (
        <g transform="translate(14 17) scale(0.84)">
          <path
            d={g}
            fill="none"
            stroke={GLYPH}
            stroke-opacity="0.62"
            stroke-width="2.1"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

function Trash({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 13h28l-2.5 29h-23z" fill="#9aa3b0" />
      <path d="M10 13h28l-.4 4H10.4z" fill="#c2c9d4" />
      <path d="M8 9h32v4H8zM19 6h10v3H19z" fill="#e7eaf0" />
      <path
        d="M19 19v18M24 19v18M29 19v18"
        stroke="#5a6473"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
}

/** Paper with a folded corner; the badge says what kind of file it is. */
function Paper({ node, size }: { node: FsNode; size: number }) {
  const ext = node.name.split('.').pop();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 4h20l9 9v31H10z" fill="#e7eaf0" />
      <path d="M30 4v9h9z" fill="#9aa3b0" />
      {ext === 'mp4' && (
        <>
          <path d="M10 26h29v18H10z" fill="#ff3d77" />
          <path d="M21 30v10l8.5-5z" fill="#fff" />
        </>
      )}
      {ext === 'md' && (
        <path
          d="M15 20h17M15 25h17M15 30h17M15 35h11"
          stroke="#5a6473"
          stroke-width="2.2"
          stroke-linecap="round"
        />
      )}
      {ext === 'pdf' && (
        <>
          <path d="M10 30h29v10H10z" fill="#e5484d" />
          <text
            x="24.5"
            y="38"
            text-anchor="middle"
            font-size="7.5"
            font-weight="700"
            fill="#fff"
            font-family="Helvetica, Arial, sans-serif"
          >
            PDF
          </text>
        </>
      )}
      {ext === 'case' && (
        <>
          <path
            d="M10 30h29v14H10z"
            fill={node.locked ? GOLD.front : MINT.front}
          />
          <path
            d="M15 19h17M15 24h12"
            stroke="#5a6473"
            stroke-width="2.2"
            stroke-linecap="round"
          />
          <text
            x="24.5"
            y="40"
            text-anchor="middle"
            font-size="7"
            font-weight="700"
            fill={GLYPH}
            font-family="Helvetica, Arial, sans-serif"
            letter-spacing="0.5"
          >
            {node.locked ? 'NDA' : 'CASE'}
          </text>
        </>
      )}
      {ext === 'app' && (
        <>
          <path d="M10 26h29v18H10z" fill="#182e49" />
          <path
            d="M17 31l-3 4 3 4M32 31l3 4-3 4M26 30l-3 10"
            stroke={MINT.front}
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function TerminalIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 8h40v32H4z" fill="#0a1626" />
      <path d="M4 8h40v5H4z" fill="#182e49" />
      <path
        d="M11 20l6 5-6 5M21 31h10"
        stroke={MINT.front}
        stroke-width="2.6"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function FileIcon({ node, size = 48 }: { node: FsNode; size?: number }) {
  if (node.kind === 'trash') return <Trash size={size} />;
  if (node.kind === 'terminal') return <TerminalIcon size={size} />;
  if (node.children) return <Folder node={node} size={size} />;
  return <Paper node={node} size={size} />;
}
