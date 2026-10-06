/**
 * Mobile (≤768px): the strip becomes a swipe deck. One full-width card per column, the next one
 * peeking, native scroll-snap for the swipe, dots for position. Focus follows the visible card.
 */
import { useEffect, useRef } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import type { Workspace } from '../../lib/desktop/state';
import { WindowBody } from './Window';
import { WinHead } from './WinHead';

interface Props {
  ws: Workspace;
  byId: Map<string, FsNode>;
  onFocus: (col: number) => void;
  onClose: (col: number, win: number) => void;
  onGo: (col: number, win: number, id: string) => void;
  onOpenBeside: (col: number, id: string) => void;
}

export function Deck({
  ws,
  byId,
  onFocus,
  onClose,
  onGo,
  onOpenBeside,
}: Props) {
  const deck = useRef<HTMLDivElement>(null);
  const settle = useRef<number>();

  const cardAt = (i: number) =>
    deck.current?.children[i] as HTMLElement | undefined;

  // bring the focused card into view when focus changes (open, dock tap, dot tap)
  useEffect(() => {
    const el = deck.current;
    const card = cardAt(ws.focus);
    if (!el || !card) return;
    const want = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
    if (Math.abs(el.scrollLeft - want) > 4)
      el.scrollTo({ left: want, behavior: 'smooth' });
  }, [ws.focus, ws.columns.length]);

  // after a swipe settles, the card in the middle becomes the focused one
  const onScroll = () => {
    clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const el = deck.current;
      if (!el) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      [...el.children].forEach((c, i) => {
        const h = c as HTMLElement;
        const d = Math.abs(h.offsetLeft + h.clientWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      if (best !== ws.focus) onFocus(best);
    }, 90);
  };

  if (!ws.columns.length)
    return (
      <p class="os-deck-empty" role="note">
        Tap a folder below to open it.
      </p>
    );

  return (
    <>
      <div class="os-deck" ref={deck} onScroll={onScroll}>
        {ws.columns.map((c, ci) => {
          const first = byId.get(c.windows[0]);
          return (
            <section
              key={c.key}
              class="os-deckcard"
              role="region"
              aria-label={first?.title ?? first?.name ?? 'Window'}
            >
              {c.windows.map((id, wi) => {
                const node = byId.get(id);
                if (!node) return null;
                return (
                  <div class="os-win" key={`${id}-${wi}`}>
                    <WinHead
                      name={node.name}
                      mode="tiled"
                      compact
                      onDragStart={() => {}}
                      onToggle={() => {}}
                      onClose={() => onClose(ci, wi)}
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
            </section>
          );
        })}
      </div>
      {ws.columns.length > 1 && (
        <nav class="os-dots" aria-label="Windows">
          {ws.columns.map((c, ci) => (
            <button
              key={c.key}
              aria-current={ci === ws.focus}
              aria-label={`Show ${byId.get(c.windows[0])?.name ?? 'window'}`}
              onClick={() => onFocus(ci)}
            />
          ))}
        </nav>
      )}
    </>
  );
}
