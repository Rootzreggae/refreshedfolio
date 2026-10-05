/**
 * Nilson OS window state: niri-style strips of columns, one strip per workspace.
 * URL format (shareable): /desktop?ws=1&open=cloud-onboarding,essays+about&focus=0
 *   - `open`: columns left to right, `+` stacks windows inside a column
 *   - only the active workspace goes in the URL; sessionStorage keeps the rest for reloads
 */
import { flatten, type FsNode } from './tree';

export type WsId = 1 | 2 | 3;
export interface Column {
  key: string;
  windows: string[]; // node ids, >1 = stacked
}
export interface Workspace {
  columns: Column[];
  focus: number;
}
export type Workspaces = Record<WsId, Workspace>;

export const emptyWorkspaces = (): Workspaces => ({
  1: { columns: [], focus: 0 },
  2: { columns: [], focus: 0 },
  3: { columns: [], focus: 0 },
});

let seq = 0;
export const newColumn = (id: string): Column => ({
  key: `c${Date.now().toString(36)}${seq++}`,
  windows: [id],
});

/** Short, unique, URL-friendly names for every node ("cloud-onboarding", "case-studies"). */
export function slugIndex(tree: FsNode[]) {
  const toSlug = new Map<string, string>();
  const toId = new Map<string, string>();
  for (const n of flatten(tree)) {
    const base = n.name
      .replace(/\.(case|md|mp4|pdf|app)$/, '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    let slug = base;
    for (let i = 2; toId.has(slug); i++) slug = `${base}-${i}`;
    toSlug.set(n.id, slug);
    toId.set(slug, n.id);
  }
  return { toSlug, toId };
}

/** Open a node as a new column right of the focused one, and focus it. */
export function openBeside(ws: Workspace, id: string): Workspace {
  const at = ws.columns.length ? ws.focus + 1 : 0;
  const columns = [
    ...ws.columns.slice(0, at),
    newColumn(id),
    ...ws.columns.slice(at),
  ];
  return { columns, focus: at };
}

/** Replace the window inside a column (in-place navigation, e.g. folder → child, "← parent"). */
export function navigate(
  ws: Workspace,
  col: number,
  win: number,
  id: string
): Workspace {
  const columns = ws.columns.map((c, i) =>
    i === col
      ? { ...c, windows: c.windows.map((w, j) => (j === win ? id : w)) }
      : c
  );
  return { ...ws, columns };
}

export function closeColumn(ws: Workspace, col: number): Workspace {
  const columns = ws.columns.filter((_, i) => i !== col);
  // closing the focused column hands focus to the previous one (handover: "returns focus to the previous column")
  const focus =
    col < ws.focus ? ws.focus - 1 : col === ws.focus ? col - 1 : ws.focus;
  return { columns, focus: Math.max(0, Math.min(focus, columns.length - 1)) };
}

export function closeWindow(
  ws: Workspace,
  col: number,
  win: number
): Workspace {
  const c = ws.columns[col];
  if (!c || c.windows.length <= 1) return closeColumn(ws, col);
  const columns = ws.columns.map((x, i) =>
    i === col ? { ...x, windows: x.windows.filter((_, j) => j !== win) } : x
  );
  return { ...ws, columns };
}

export function encode(
  ws: Workspace,
  active: WsId,
  toSlug: Map<string, string>
): string {
  if (!ws.columns.length) return active === 1 ? '' : `?ws=${active}`;
  const open = ws.columns
    .map((c) => c.windows.map((w) => toSlug.get(w)).join('+'))
    .join(',');
  return `?ws=${active}&open=${open}&focus=${ws.focus}`;
}

export function decode(
  search: string,
  toId: Map<string, string>
): { active: WsId; ws: Workspace } | null {
  const q = new URLSearchParams(search);
  const active = Number(q.get('ws') || 1);
  if (![1, 2, 3].includes(active)) return null;
  const columns = (q.get('open') || '')
    .split(',')
    .map((c) =>
      c
        .split('+')
        .map((s) => toId.get(s))
        .filter((x): x is string => !!x)
    )
    .filter((w) => w.length)
    .map((windows) => ({ ...newColumn(windows[0]), windows }));
  const focus = Math.min(
    Math.max(Number(q.get('focus') || 0) || 0, 0),
    Math.max(columns.length - 1, 0)
  );
  return { active: active as WsId, ws: { columns, focus } };
}

const KEY = 'nilson-os:v1';
export function loadSession(): { active: WsId; spaces: Workspaces } | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function saveSession(active: WsId, spaces: Workspaces) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ active, spaces }));
  } catch {
    /* private mode or storage blocked: the URL still carries the layout */
  }
}

/** Move a column to another slot (drag or Ctrl+Alt+Shift+arrows) and keep it focused. */
export function moveColumn(ws: Workspace, from: number, to: number): Workspace {
  const target = Math.max(0, Math.min(to, ws.columns.length - 1));
  if (from === target || !ws.columns[from]) return ws;
  const columns = [...ws.columns];
  const [col] = columns.splice(from, 1);
  columns.splice(target, 0, col);
  return { columns, focus: target };
}
