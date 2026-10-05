/**
 * The launcher (Ctrl K / Cmd K), modelled on Noctalia's: fuzzy search across every file, folder and
 * stat. Enter opens as a column, Shift+Enter in another workspace. Empty query shows recent items.
 * Accessible pattern: dialog > combobox input + listbox of options.
 */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import { Icon, kindIcon } from './icons';

export interface LaunchItem {
  /** node id, or "stat:<n>" for impact numbers */
  id: string;
  title: string;
  sub: string;
  icon: ReturnType<typeof kindIcon> | 'lock';
  haystack: string;
}

interface Props {
  nodes: FsNode[];
  recent: string[];
  onOpen: (id: string, newWorkspace: boolean) => void;
  onStats: () => void;
  onClose: () => void;
}

const STATS = [
  { title: 'Time-to-insight −20%', sub: 'About › Impact · Grafana APM' },
  { title: 'Support requests −40%', sub: 'About › Impact · Cloud Onboarding' },
  { title: 'User adoption +25%', sub: 'About › Impact · Cloud Onboarding' },
];

function describe(n: FsNode): string {
  const where = n.id.includes('/')
    ? n.id.slice(0, n.id.lastIndexOf('/')).replace(/\//g, ' › ')
    : 'Home';
  const what =
    n.kind === 'case'
      ? 'Case study'
      : n.kind === 'md'
        ? 'Document'
        : n.children
          ? 'Folder'
          : n.kind === 'app'
            ? 'App'
            : 'File';
  return `${what} · ${where}${n.summary && !n.todo ? ` · ${n.summary}` : ''}`;
}

/** Subsequence match with bonuses for word starts and runs; 0 = no match. */
export function fuzzy(q: string, text: string): number {
  if (!q) return 1;
  const t = text.toLowerCase();
  const idx = t.indexOf(q);
  if (idx >= 0)
    return 1000 - idx + (idx === 0 || /[\s/›·-]/.test(t[idx - 1]) ? 200 : 0);
  let score = 0;
  let ti = 0;
  let run = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found < 0) return 0;
    run = found === ti ? run + 1 : 0;
    score +=
      10 +
      run * 5 +
      (found === 0 || /[\s/›·-]/.test(t[found - 1]) ? 15 : 0) -
      (found - ti);
    ti = found + 1;
  }
  // scattered letters across a long string are noise, not a match
  return score >= q.length * 9 ? score : 0;
}

export function Launcher({ nodes, recent, onOpen, onStats, onClose }: Props) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const items = useMemo<LaunchItem[]>(
    () => [
      ...nodes.map((n) => ({
        id: n.id,
        title: n.title && !n.todo ? n.title : n.name,
        sub: describe(n),
        icon: n.locked ? ('lock' as const) : kindIcon(n.kind, n.name),
        haystack: `${n.title ?? ''} ${n.name} ${n.id} ${n.summary ?? ''}`,
      })),
      ...STATS.map((s, i) => ({
        id: `stat:${i}`,
        title: s.title,
        sub: s.sub,
        icon: 'app' as const,
        haystack: `${s.title} ${s.sub} impact`,
      })),
    ],
    [nodes]
  );

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      const byId = new Map(items.map((i) => [i.id, i]));
      const rec = recent
        .map((id) => byId.get(id))
        .filter((x): x is LaunchItem => !!x);
      return rec.length
        ? rec
        : items
            .filter((i) => nodes.find((n) => n.id === i.id)?.kind === 'case')
            .slice(0, 6);
    }
    return items
      .map((i) => ({
        i,
        s: Math.max(fuzzy(query, i.title) * 2, fuzzy(query, i.haystack)),
      }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.i);
  }, [q, items, recent]);

  useEffect(() => input.current?.focus(), []);
  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    list.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const choose = (item: LaunchItem | undefined, newWs: boolean) => {
    if (!item) return;
    if (item.id.startsWith('stat:')) onStats();
    else onOpen(item.id, newWs);
    onClose();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown')
      setSel((s) => Math.min(s + 1, results.length - 1));
    else if (e.key === 'ArrowUp') setSel((s) => Math.max(s - 1, 0));
    else if (e.key === 'Enter') choose(results[sel], e.shiftKey);
    else if (e.key === 'Escape') onClose();
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      class="os-launcher-scrim"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        class="os-launcher"
        role="dialog"
        aria-modal="true"
        aria-label="Launcher"
      >
        <label class="os-launcher-field">
          <Icon name="search" />
          <input
            ref={input}
            value={q}
            onInput={(e) => setQ((e.target as HTMLInputElement).value)}
            onKeyDown={onKey}
            role="combobox"
            aria-expanded="true"
            aria-controls="os-launcher-list"
            aria-activedescendant={results[sel] ? `os-opt-${sel}` : undefined}
            aria-autocomplete="list"
            aria-label="Search the desktop"
            placeholder="Search cases, essays, projects…"
            spellcheck={false}
            autocomplete="off"
          />
          {q && (
            <button aria-label="Clear" onClick={() => setQ('')}>
              ×
            </button>
          )}
        </label>
        <ul
          class="os-launcher-list"
          id="os-launcher-list"
          role="listbox"
          ref={list}
          aria-label="Results"
        >
          {!q.trim() && results.length > 0 && (
            <li class="os-launcher-group" role="presentation">
              {recent.length ? 'Recent' : 'Start with a case study'}
            </li>
          )}
          {results.map((r, i) => (
            <li
              key={r.id}
              id={`os-opt-${i}`}
              role="option"
              aria-selected={i === sel}
              class="os-launcher-row"
              onMouseMove={() => setSel(i)}
              onClick={(e) => choose(r, e.shiftKey)}
            >
              <Icon name={r.icon} size={16} width={1.7} />
              <span class="os-launcher-text">
                <span class="os-launcher-title">{r.title}</span>
                <span class="os-launcher-sub">{r.sub}</span>
              </span>
              {i === sel && <span class="os-launcher-hint">↵</span>}
            </li>
          ))}
          {!results.length && (
            <li class="os-launcher-empty" role="presentation">
              Nothing matches "{q}".
            </li>
          )}
        </ul>
        <div class="os-launcher-foot">
          {results.length} results · ↵ open as a window · Shift ↵ in another
          workspace · Esc close
        </div>
      </div>
    </div>
  );
}
