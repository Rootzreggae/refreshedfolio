/**
 * The niri strip: columns on an infinite horizontal track, the focused one kept in view.
 * Mouse behaviour is deliberately plain-desktop: drag a window by its title strip and drop it over another
 * column to reorder, or anywhere else to float it; drag a column's right edge to resize it.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import type { Floating, Workspace } from '../../lib/desktop/state';
import { WindowBody } from './Window';
import { WinHead } from './WinHead';

/** Join class names (kept out of template strings: the Tailwind Prettier plugin trims their spaces). */
export const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(' ');

const GAP = 4;
const CLOSE_MS = 180;
/** A drag shorter than this snaps back instead of floating the window. */
const FLOAT_AFTER = 30;
const MIN_COL = 280;

export type FloatRect = Omit<Floating, 'key' | 'id'>;

interface Props {
  ws: Workspace;
  byId: Map<string, FsNode>;
  hidden: boolean;
  onFocus: (col: number) => void;
  onClose: (col: number, win: number) => void;
  onGo: (col: number, win: number, id: string) => void;
  onOpenBeside: (col: number, id: string) => void;
  onMove: (from: number, to: number) => void;
  onFloat: (col: number, rect: FloatRect) => void;
  onResize: (col: number, fraction: number) => void;
}

/** niri-like preset widths: folders a third, documents half the screen, unless the user resized it. */
const widthOf = (
  node: FsNode | undefined,
  fraction: number | undefined,
  vw: number
) => Math.round((fraction ?? (node?.children ? 1 / 3 : 1 / 2)) * vw - GAP);
const leftOf = (w: number[], i: number) =>
  w.slice(0, i).reduce((a, x) => a + x + GAP, 0);

/** Where a window lands when it floats: where it was dropped, at a comfortable size, inside the screen. */
export function floatRectFrom(el: HTMLElement): FloatRect {
  const os = el.closest('.os')!.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const w = Math.min(r.width, 720);
  const h = Math.min(r.height, os.height * 0.75);
  return {
    x: Math.round(Math.max(0, Math.min(r.left - os.left, os.width - w))),
    y: Math.round(Math.max(34, Math.min(r.top - os.top, os.height - 60))),
    w: Math.round(w),
    h: Math.round(h),
  };
}

export function Strip(props: Props) {
  const {
    ws,
    byId,
    hidden,
    onFocus,
    onClose,
    onGo,
    onOpenBeside,
    onMove,
    onFloat,
    onResize,
  } = props;
  const host = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1280);
  const [scroll, setScroll] = useState(0);
  const [closing, setClosing] = useState<string | null>(null);
  const [drag, setDrag] = useState<{
    key: string;
    dx: number;
    dy: number;
  } | null>(null);
  const live = useRef({ ws, widths: [] as number[] });

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setVw(el.clientWidth));
    ro.observe(el);
    setVw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const widths = ws.columns.map((c) =>
    widthOf(byId.get(c.windows[0]), c.width, vw)
  );
  const lefts = widths.map((_, i) => leftOf(widths, i));
  const total = widths.reduce((a, w) => a + w + GAP, 0) - GAP;
  const maxScroll = Math.max(0, total - vw);
  live.current = { ws, widths };

  /** Follow the pointer; reorder when the window's centre passes another column. */
  const startDrag = (e: PointerEvent, key: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    let startX = e.clientX;
    const startY = e.clientY;
    let reordered = false;
    document.documentElement.classList.add('os-gesture');
    let last = { dx: 0, dy: 0 };
    const move = (ev: PointerEvent) => {
      const { ws: cur, widths: w } = live.current;
      const i = cur.columns.findIndex((c) => c.key === key);
      if (i < 0) return;
      const center = leftOf(w, i) + w[i] / 2 + (ev.clientX - startX);
      let j = i;
      for (let k = 0; k < w.length; k++) {
        const l = leftOf(w, k);
        if (center >= l && center <= l + w[k]) j = k;
      }
      if (j !== i) {
        const order = [...w];
        const [mw] = order.splice(i, 1);
        order.splice(j, 0, mw);
        startX += leftOf(order, j) - leftOf(w, i); // keep the window under the pointer
        reordered = true;
        onMove(i, j);
      }
      last = { dx: ev.clientX - startX, dy: ev.clientY - startY };
      setDrag({ key, ...last });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.documentElement.classList.remove('os-gesture');
      const i = live.current.ws.columns.findIndex((c) => c.key === key);
      const el = host.current?.querySelector<HTMLElement>(
        `[data-col="${key}"]`
      );
      const dropped = Math.hypot(last.dx, last.dy) > FLOAT_AFTER;
      if (i >= 0 && el && dropped && (!reordered || Math.abs(last.dy) > 60)) {
        onFloat(i, floatRectFrom(el)); // dropped somewhere that isn't a slot: float it there
      } else if (i >= 0) onFocus(i);
      setDrag(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    setDrag({ key, dx: 0, dy: 0 });
  };

  /** Drag the right edge of a column to change its width. */
  const startResize = (e: PointerEvent, col: number) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const x0 = e.clientX;
    const w0 = widths[col];
    document.documentElement.classList.add('os-gesture');
    const move = (ev: PointerEvent) => {
      const px = Math.max(MIN_COL, w0 + ev.clientX - x0);
      onResize(col, (px + GAP) / vw);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.documentElement.classList.remove('os-gesture');
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // keep the focused column in view (niri: scroll the minimum needed)
  useEffect(() => {
    const i = ws.focus;
    if (widths[i] === undefined) return setScroll(0);
    setScroll((s) => {
      let next = s;
      if (lefts[i] < next) next = lefts[i];
      if (lefts[i] + widths[i] > next + vw) next = lefts[i] + widths[i] - vw;
      return Math.max(0, Math.min(next, maxScroll));
    });
  }, [ws.focus, ws.columns.length, vw]);

  // move keyboard focus into the focused column when it changes
  useEffect(() => {
    if (ws.floatFocus) return;
    const key = ws.columns[ws.focus]?.key;
    if (!key) return;
    host.current
      ?.querySelector<HTMLElement>(`[data-col="${key}"]`)
      ?.focus({ preventScroll: true });
  }, [ws.focus, ws.columns[ws.focus]?.key, ws.floatFocus]);

  const onWheel = (e: WheelEvent) => {
    const dx =
      Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : e.shiftKey
          ? e.deltaY
          : 0;
    if (!dx) return;
    e.preventDefault();
    setScroll((s) => Math.max(0, Math.min(s + dx, maxScroll)));
  };

  const close = (col: number, win: number) => {
    const c = ws.columns[col];
    if (c.windows.length > 1) return onClose(col, win);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setClosing(c.key);
    setTimeout(
      () => {
        setClosing(null);
        onClose(col, win);
      },
      reduce ? 0 : CLOSE_MS
    );
  };

  const popOut = (col: number, key: string) => {
    const el = host.current?.querySelector<HTMLElement>(`[data-col="${key}"]`);
    if (!el) return;
    const r = floatRectFrom(el);
    onFloat(col, {
      ...r,
      x: r.x + 40,
      y: r.y + 30,
      w: Math.min(r.w, 640),
      h: Math.min(r.h, 520),
    });
  };

  const colFocused = (ci: number) => ci === ws.focus && !ws.floatFocus;

  return (
    <div
      class={cx('os-strip', hidden && 'os-strip--hidden')}
      ref={host}
      onWheel={onWheel}
    >
      <div class="os-track" style={{ transform: `translateX(${-scroll}px)` }}>
        {ws.columns.map((c, ci) => {
          const first = byId.get(c.windows[0]);
          const dragging = drag?.key === c.key;
          return (
            <section
              key={c.key}
              data-col={c.key}
              tabIndex={-1}
              role="region"
              aria-label={first?.title ?? first?.name ?? 'Window'}
              class={cx(
                'os-col',
                dragging && 'is-dragging',
                colFocused(ci) && 'is-focused',
                closing === c.key && 'is-closing'
              )}
              style={{
                width: `${widths[ci]}px`,
                transform: dragging
                  ? `translate(${drag.dx}px, ${drag.dy}px)`
                  : undefined,
              }}
              onMouseDown={() => !colFocused(ci) && onFocus(ci)}
              onPointerDown={(e) => e.altKey && startDrag(e, c.key)}
              onFocusIn={() => !colFocused(ci) && onFocus(ci)}
            >
              {c.windows.map((id, wi) => {
                const node = byId.get(id);
                if (!node) return null;
                return (
                  <div class="os-win" key={`${id}-${wi}`}>
                    <WinHead
                      name={node.name}
                      mode="tiled"
                      onDragStart={(e) => startDrag(e, c.key)}
                      onToggle={() => popOut(ci, c.key)}
                      onClose={() => close(ci, wi)}
                    />
                    <div class="os-win-scroll">
                      <WindowBody
                        node={node}
                        byId={byId}
                        go={(to) => onGo(ci, wi, to)}
                        openBeside={(to) => onOpenBeside(ci, to)}
                      />
                    </div>
                  </div>
                );
              })}
              <div
                class="os-col-resize"
                title="Drag to resize"
                aria-hidden="true"
                onPointerDown={(e) => startResize(e, ci)}
              />
            </section>
          );
        })}
      </div>

      {ws.columns.length > 1 && (
        <nav class="os-minimap" aria-label="Columns">
          {ws.columns.map((c, ci) => (
            <button
              key={c.key}
              class={ci === ws.focus ? 'is-focused' : ''}
              style={{ width: `${Math.max(10, widths[ci] / 24)}px` }}
              aria-label={`Focus ${byId.get(c.windows[0])?.name ?? 'column'}`}
              aria-current={ci === ws.focus}
              onClick={() => onFocus(ci)}
            />
          ))}
          <span
            class="os-minimap-view"
            aria-hidden="true"
            style={{ left: `${6 + scroll / 24}px`, width: `${vw / 24}px` }}
          />
        </nav>
      )}
    </div>
  );
}
