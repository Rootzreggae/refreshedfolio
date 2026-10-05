/** The niri strip: columns on an infinite horizontal track, the focused one kept in view. */
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import type { Workspace } from '../../lib/desktop/state';
import { WindowBody } from './Window';

/** Join class names (kept out of template strings: the Tailwind Prettier plugin trims their spaces). */
const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(' ');

const GAP = 4;
const CLOSE_MS = 180;

interface Props {
  ws: Workspace;
  byId: Map<string, FsNode>;
  hidden: boolean;
  onFocus: (col: number) => void;
  onClose: (col: number, win: number) => void;
  onGo: (col: number, win: number, id: string) => void;
  onOpenBeside: (col: number, id: string) => void;
}

/** niri-like preset widths: folders a third, documents half the screen. */
const widthOf = (node: FsNode | undefined, vw: number) =>
  Math.round((node?.children ? 1 / 3 : 1 / 2) * vw - GAP);

export function Strip({
  ws,
  byId,
  hidden,
  onFocus,
  onClose,
  onGo,
  onOpenBeside,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1280);
  const [scroll, setScroll] = useState(0);
  const [closing, setClosing] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setVw(el.clientWidth));
    ro.observe(el);
    setVw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const widths = ws.columns.map((c) => widthOf(byId.get(c.windows[0]), vw));
  const lefts = widths.map((_, i) =>
    widths.slice(0, i).reduce((a, w) => a + w + GAP, 0)
  );
  const total = widths.reduce((a, w) => a + w + GAP, 0) - GAP;
  const maxScroll = Math.max(0, total - vw);

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
    const key = ws.columns[ws.focus]?.key;
    if (!key) return;
    host.current
      ?.querySelector<HTMLElement>(`[data-col="${key}"]`)
      ?.focus({ preventScroll: true });
  }, [ws.focus, ws.columns[ws.focus]?.key]);

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

  return (
    <div
      class={cx('os-strip', hidden && 'os-strip--hidden')}
      ref={host}
      onWheel={onWheel}
    >
      <div class="os-track" style={{ transform: `translateX(${-scroll}px)` }}>
        {ws.columns.map((c, ci) => {
          const first = byId.get(c.windows[0]);
          return (
            <section
              key={c.key}
              data-col={c.key}
              tabIndex={-1}
              role="region"
              aria-label={first?.title ?? first?.name ?? 'Window'}
              class={cx(
                'os-col',
                ci === ws.focus && 'is-focused',
                closing === c.key && 'is-closing'
              )}
              style={{ width: `${widths[ci]}px` }}
              onMouseDown={() => ci !== ws.focus && onFocus(ci)}
              onFocusIn={() => ci !== ws.focus && onFocus(ci)}
            >
              {c.windows.map((id, wi) => {
                const node = byId.get(id);
                if (!node) return null;
                return (
                  <div class="os-win" key={`${id}-${wi}`}>
                    <button
                      class="os-close"
                      aria-label={`Close ${node.name}`}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => close(ci, wi)}
                    >
                      ×
                    </button>
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
