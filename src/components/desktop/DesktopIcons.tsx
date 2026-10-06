/**
 * Desktop icons that stay where you put them. Drag one (or a rubber-band selection) and it snaps to the
 * grid; the arrangement is kept in this browser. Alt+arrows move the focused icon from the keyboard.
 * Right-click is handed to the shell (onMenu), which owns the menu.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import { FileIcon } from './FileIcon';
import { cx } from './Strip';

const CW = 104;
const CH = 108;
const X0 = 24;
const Y0 = 22;
const KEY = 'nilson-os:icons';
/** Pointer travel before a press becomes a drag (so clicks and double-clicks still work). */
const DRAG_AFTER = 4;

type Cell = [number, number];
type Layout = Record<string, Cell>;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(v, hi));

function nearestFree(
  [c, r]: Cell,
  taken: Set<string>,
  cols: number,
  rows: number
): Cell {
  let best: Cell = [c, r];
  let bd = Infinity;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const d = (i - c) ** 2 + (j - r) ** 2;
      if (d < bd && !taken.has(`${i},${j}`)) {
        bd = d;
        best = [i, j];
      }
    }
  return best;
}

/** Give every icon a free cell, in priority order, as close as possible to where it wants to be. */
function place(ids: string[], want: Layout, cols: number, rows: number) {
  const out: Layout = {};
  const taken = new Set<string>();
  for (const id of ids) {
    const [c, r] = want[id];
    const cell = nearestFree(
      [clamp(c, 0, cols - 1), clamp(r, 0, rows - 1)],
      taken,
      cols,
      rows
    );
    out[id] = cell;
    taken.add(cell.join());
  }
  return out;
}

function load(): Layout {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}
function save(l: Layout | null) {
  try {
    if (l) localStorage.setItem(KEY, JSON.stringify(l));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: the arrangement lasts until reload */
  }
}

const ARROWS: Record<string, Cell> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

interface Props {
  nodes: FsNode[];
  /** Bumped by the shell's "Clean up": back to the default column. */
  tidy: number;
  onOpen: (id: string) => void;
  onMenu: (e: MouseEvent, id: string | null) => void;
  onMoved: () => void;
}

export function DesktopIcons({ nodes, tidy, onOpen, onMenu, onMoved }: Props) {
  const ul = useRef<HTMLUListElement>(null);
  const [grid, setGrid] = useState({ cols: 8, rows: 6 });
  const [saved, setSaved] = useState<Layout>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [drag, setDrag] = useState<{
    ids: string[];
    dx: number;
    dy: number;
  } | null>(null);
  const [band, setBand] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const dragged = useRef(false);

  useEffect(() => setSaved(load()), []);
  useEffect(() => {
    if (!tidy) return;
    save(null);
    setSaved({});
  }, [tidy]);
  useLayoutEffect(() => {
    const el = ul.current!;
    const measure = () =>
      setGrid({
        cols: Math.max(1, Math.floor((el.clientWidth - X0) / CW)),
        rows: Math.max(1, Math.floor((el.clientHeight - Y0 - 48) / CH)),
      });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const ids = nodes.map((n) => n.id);
  const want: Layout = Object.fromEntries(
    ids.map((id, i) => [
      id,
      saved[id] ?? [Math.floor(i / grid.rows), i % grid.rows],
    ])
  );
  const pos = place(ids, want, grid.cols, grid.rows);
  const target = (id: string, dx: number, dy: number): Cell => [
    clamp(Math.round(pos[id][0] + dx / CW), 0, grid.cols - 1),
    clamp(Math.round(pos[id][1] + dy / CH), 0, grid.rows - 1),
  ];

  /** Moved icons take the nearest free cell to where they were dropped; the others stay put. */
  const commit = (group: string[], to: (id: string) => Cell) => {
    const next = { ...pos };
    for (const g of group) next[g] = to(g);
    const rest = ids.filter((x) => !group.includes(x));
    const placed = place([...rest, ...group], next, grid.cols, grid.rows);
    save(placed);
    setSaved(placed);
    onMoved();
  };

  const startIcon = (e: PointerEvent, id: string) => {
    if (e.button !== 0) return;
    dragged.current = false;
    const x0 = e.clientX;
    const y0 = e.clientY;
    const group = selected.includes(id) ? selected : [id];
    let last = { dx: 0, dy: 0 };
    const move = (ev: PointerEvent) => {
      last = { dx: ev.clientX - x0, dy: ev.clientY - y0 };
      if (!dragged.current) {
        if (Math.hypot(last.dx, last.dy) < DRAG_AFTER) return;
        dragged.current = true;
        setSelected(group);
        document.documentElement.classList.add('os-gesture');
      }
      setDrag({ ids: group, ...last });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!dragged.current) return;
      document.documentElement.classList.remove('os-gesture');
      commit(group, (g) => target(g, last.dx, last.dy));
      setDrag(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  /** Press on empty desktop and drag: select everything the rectangle touches. */
  const startBand = (e: PointerEvent) => {
    if (e.target !== e.currentTarget || e.button !== 0) return;
    const r = ul.current!.getBoundingClientRect();
    const x0 = e.clientX - r.left;
    const y0 = e.clientY - r.top;
    setSelected([]);
    const move = (ev: PointerEvent) => {
      const x1 = ev.clientX - r.left;
      const y1 = ev.clientY - r.top;
      const b = {
        x: Math.min(x0, x1),
        y: Math.min(y0, y1),
        w: Math.abs(x1 - x0),
        h: Math.abs(y1 - y0),
      };
      setBand(b);
      setSelected(
        ids.filter((id) => {
          const ix = X0 + pos[id][0] * CW;
          const iy = Y0 + pos[id][1] * CH;
          return (
            ix < b.x + b.w && ix + CW > b.x && iy < b.y + b.h && iy + CH > b.y
          );
        })
      );
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setBand(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <ul
      class={cx('os-icons', drag && 'is-dragging')}
      ref={ul}
      aria-label="Desktop"
      onPointerDown={startBand}
      onContextMenu={(e) => {
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        setSelected([]);
        onMenu(e, null);
      }}
    >
      {drag?.ids.map((id) => {
        const [c, r] = target(id, drag.dx, drag.dy);
        return (
          <li
            key={`slot-${id}`}
            class="os-icon-slot"
            aria-hidden="true"
            style={`left:${X0 + c * CW}px;top:${Y0 + r * CH}px`}
          />
        );
      })}
      {nodes.map((node, i) => {
        const [c, r] = pos[node.id];
        const d = drag?.ids.includes(node.id) ? drag : null;
        return (
          <li
            key={node.id}
            class={cx('os-icon-cell', d && 'is-lifted')}
            style={`left:${X0 + c * CW}px;top:${Y0 + r * CH}px;--i:${i}${d ? `;transform:translate(${d.dx}px,${d.dy}px)` : ''}`}
          >
            <button
              class="os-icon"
              aria-pressed={selected.includes(node.id)}
              aria-label={
                node.title ? `${node.name}: ${node.title}` : node.name
              }
              onPointerDown={(e) => startIcon(e, node.id)}
              onClick={(e) => {
                if (dragged.current) return;
                if (e.ctrlKey || e.metaKey)
                  setSelected((s) =>
                    s.includes(node.id)
                      ? s.filter((x) => x !== node.id)
                      : [...s, node.id]
                  );
                else setSelected([node.id]);
              }}
              onDblClick={() => onOpen(node.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (!selected.includes(node.id)) setSelected([node.id]);
                onMenu(e, node.id);
              }}
              onKeyDown={(e) => {
                const a = ARROWS[e.key];
                if (a && e.altKey) {
                  e.preventDefault();
                  commit([node.id], () => [
                    clamp(c + a[0], 0, grid.cols - 1),
                    clamp(r + a[1], 0, grid.rows - 1),
                  ]);
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  onOpen(node.id);
                } else if (e.key === 'Escape') setSelected([]);
              }}
            >
              <span class="os-icon-tile">
                <FileIcon node={node} size={56} />
              </span>
              <span class="os-icon-label">{node.name}</span>
            </button>
          </li>
        );
      })}
      {band && (
        <li
          class="os-band"
          aria-hidden="true"
          style={`left:${band.x}px;top:${band.y}px;width:${band.w}px;height:${band.h}px`}
        />
      )}
    </ul>
  );
}
