/** Right-click menus: a short list at the pointer, kept on screen. Arrows, Enter and Escape work. */
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

/** null draws a separator. */
export type MenuItem = { label: string; hint?: string; run: () => void } | null;

export interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

export function Menu({
  x,
  y,
  items,
  onClose,
}: MenuState & { onClose: () => void }) {
  const el = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState({ x, y });

  useLayoutEffect(() => {
    const m = el.current!;
    setAt({
      x: Math.max(4, Math.min(x, innerWidth - m.offsetWidth - 4)),
      y: Math.max(4, Math.min(y, innerHeight - m.offsetHeight - 4)),
    });
    m.querySelector('button')?.focus();
  }, [x, y]);

  useEffect(() => {
    const away = (e: PointerEvent) =>
      !el.current?.contains(e.target as Node) && onClose();
    window.addEventListener('pointerdown', away, true);
    window.addEventListener('blur', onClose);
    window.addEventListener('resize', onClose);
    return () => {
      window.removeEventListener('pointerdown', away, true);
      window.removeEventListener('blur', onClose);
      window.removeEventListener('resize', onClose);
    };
  }, []);

  const onKey = (e: KeyboardEvent) => {
    const btns = [...el.current!.querySelectorAll('button')];
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') btns[(i + 1) % btns.length].focus();
    else if (e.key === 'ArrowUp')
      btns[(i - 1 + btns.length) % btns.length].focus();
    else if (e.key === 'Escape' || e.key === 'Tab') onClose();
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      class="os-menu"
      role="menu"
      ref={el}
      style={{ left: `${at.x}px`, top: `${at.y}px` }}
      onKeyDown={onKey}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((it, i) =>
        it ? (
          <button
            key={it.label}
            role="menuitem"
            class="os-menu-item"
            onClick={() => {
              onClose();
              it.run();
            }}
          >
            <span>{it.label}</span>
            {it.hint && <span class="os-menu-hint">{it.hint}</span>}
          </button>
        ) : (
          <hr key={`sep-${i}`} class="os-menu-sep" />
        )
      )}
    </div>
  );
}
