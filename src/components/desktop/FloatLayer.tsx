/**
 * Floating windows (niri's floating layer): move by the title strip, resize from any edge or corner,
 * click to bring to the front, "Tile" to put back in the strip. Positions are px inside the desktop.
 */
import { useRef } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import type { Floating } from '../../lib/desktop/state';
import { WindowBody } from './Window';
import { WinHead } from './WinHead';
import { cx } from './Strip';

const MIN_W = 300;
const MIN_H = 200;
const BAR = 34; // keep windows below the top bar
const EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type Edge = (typeof EDGES)[number];

interface Props {
  floating: Floating[];
  focus: string | null;
  byId: Map<string, FsNode>;
  hidden: boolean;
  onChange: (key: string, patch: Partial<Floating>) => void;
  onRaise: (key: string) => void;
  onTile: (key: string) => void;
  onClose: (key: string) => void;
  onGo: (key: string, id: string) => void;
  onOpenBeside: (id: string) => void;
}

export function FloatLayer(props: Props) {
  const {
    floating,
    focus,
    byId,
    hidden,
    onChange,
    onRaise,
    onTile,
    onClose,
    onGo,
    onOpenBeside,
  } = props;
  const layer = useRef<HTMLDivElement>(null);

  /** One pointer gesture: moving (edge = null) or resizing from an edge/corner. */
  const gesture = (e: PointerEvent, f: Floating, edge: Edge | null) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    onRaise(f.key);
    const area = layer.current!.getBoundingClientRect();
    const x0 = e.clientX;
    const y0 = e.clientY;
    const start = { ...f };
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - x0;
      const dy = ev.clientY - y0;
      let { x, y, w, h } = start;
      if (!edge) {
        x += dx;
        y += dy;
      } else {
        if (edge.includes('e')) w = Math.max(MIN_W, start.w + dx);
        if (edge.includes('s')) h = Math.max(MIN_H, start.h + dy);
        if (edge.includes('w')) {
          w = Math.max(MIN_W, start.w - dx);
          x = start.x + start.w - w;
        }
        if (edge.includes('n')) {
          h = Math.max(MIN_H, start.h - dy);
          y = start.y + start.h - h;
        }
      }
      if (edge) {
        // resizing never grows a window past the screen edges
        if (edge.includes('e')) w = Math.min(w, area.width - x);
        if (edge.includes('s')) h = Math.min(h, area.height - y);
        if (edge.includes('n') && y < BAR) {
          h -= BAR - y;
          y = BAR;
        }
        if (edge.includes('w') && x < 0) {
          w += x;
          x = 0;
        }
      } else {
        // moving keeps the title strip reachable: never above the bar, never fully off screen
        x = Math.max(80 - w, Math.min(x, area.width - 80));
        y = Math.max(BAR, Math.min(y, area.height - 40));
      }
      onChange(f.key, {
        x: Math.round(x),
        y: Math.round(y),
        w: Math.round(w),
        h: Math.round(h),
      });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  return (
    <div class={cx('os-float-layer', hidden && 'os-strip--hidden')} ref={layer}>
      {floating.map((f) => {
        const node = byId.get(f.id);
        if (!node) return null;
        return (
          <section
            key={f.key}
            role="dialog"
            aria-label={node.title ?? node.name}
            class={cx('os-float', focus === f.key && 'is-focused')}
            style={{
              left: `${f.x}px`,
              top: `${f.y}px`,
              width: `${f.w}px`,
              height: `${f.h}px`,
            }}
            onMouseDown={() => focus !== f.key && onRaise(f.key)}
          >
            <div class="os-win">
              <WinHead
                name={node.name}
                mode="floating"
                onDragStart={(e) => gesture(e, f, null)}
                onToggle={() => onTile(f.key)}
                onClose={() => onClose(f.key)}
              />
              <div class="os-win-scroll">
                <WindowBody
                  node={node}
                  byId={byId}
                  go={(to) => onGo(f.key, to)}
                  openBeside={onOpenBeside}
                />
              </div>
            </div>
            {EDGES.map((edge) => (
              <div
                key={edge}
                class={cx('os-rz', `os-rz-${edge}`)}
                aria-hidden="true"
                onPointerDown={(e) => gesture(e, f, edge)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
