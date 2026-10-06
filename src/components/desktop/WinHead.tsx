/**
 * The slim title strip every window gets: the visible, familiar handle for people who don't know niri.
 * Drag it to move the window; the buttons pop the window out (float) or put it back (tile), and close it.
 */
interface Props {
  name: string;
  mode: 'tiled' | 'floating';
  /** Phones: no dragging, no pop-out, just the name and close. */
  compact?: boolean;
  onDragStart: (e: PointerEvent) => void;
  onToggle: () => void;
  onClose: () => void;
}

const stop = (e: Event) => e.stopPropagation();

export function WinHead({
  name,
  mode,
  compact,
  onDragStart,
  onToggle,
  onClose,
}: Props) {
  return (
    <div
      class={compact ? 'os-head os-head--compact' : 'os-head'}
      onPointerDown={compact ? undefined : onDragStart}
      title={compact ? undefined : 'Drag to move this window'}
    >
      <span class="os-head-name">{name}</span>
      <span class="os-head-btns">
        {!compact && (
          <button
            class="os-head-btn"
            onPointerDown={stop}
            onMouseDown={stop}
            onClick={onToggle}
            aria-label={
              mode === 'tiled'
                ? `Pop out ${name} as a floating window`
                : `Put ${name} back in the row of windows`
            }
            title={
              mode === 'tiled' ? 'Pop out (float)' : 'Tile (back in the row)'
            }
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              {mode === 'tiled' ? (
                <path d="M9 4h11v11M20 4 10 14M15 20H4V9" />
              ) : (
                <path d="M4 4h7v16H4zM13 4h7v16h-7z" />
              )}
            </svg>
          </button>
        )}
        <button
          class="os-head-btn os-head-btn--close"
          onPointerDown={stop}
          onMouseDown={stop}
          onClick={onClose}
          aria-label={`Close ${name}`}
          title="Close"
        >
          ×
        </button>
      </span>
    </div>
  );
}
