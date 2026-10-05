/** Nilson OS shell: bar, desktop icons, control center, and the niri strip per workspace. */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { flatten, type FsNode } from '../../lib/desktop/tree';
import {
  closeColumn,
  closeWindow,
  decode,
  emptyWorkspaces,
  encode,
  loadSession,
  moveColumn,
  navigate,
  openBeside,
  saveSession,
  slugIndex,
  type Workspace,
  type Workspaces,
  type WsId,
} from '../../lib/desktop/state';
import { Strip } from './Strip';
import { Icon, kindIcon } from './icons';

export interface Contact {
  email: string;
  github: { url: string };
  bluesky: { url: string };
  based: string;
}

interface Props {
  tree: FsNode[];
  contact: Contact;
  caseCount: number;
}

const WORKSPACES = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Side projects' },
  { id: 3, name: 'Playground' },
] as const;

function lisbonNow() {
  const d = new Date();
  const time = d.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/Lisbon',
    hour: '2-digit',
    minute: '2-digit',
  });
  const day = d.toLocaleDateString('en-US', {
    timeZone: 'Europe/Lisbon',
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  });
  return `${time} ${day}`;
}

function Clock() {
  const [now, setNow] = useState(lisbonNow);
  useEffect(() => {
    const t = setInterval(() => setNow(lisbonNow()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span class="os-pill" title="Lisbon time">
      <time>{now}</time>
    </span>
  );
}

const C = 2 * Math.PI * 18;
const GAUGES = [
  {
    pct: 20,
    value: '−20%',
    short: 'Time to insight',
    label: 'Time to insight on Grafana APM',
  },
  {
    pct: 40,
    value: '−40%',
    short: 'Support requests',
    label: 'Support requests, Cloud Onboarding',
  },
  {
    pct: 25,
    value: '+25%',
    short: 'Adoption',
    label: 'User adoption, Cloud Onboarding',
  },
];

function ControlCenter({ contact }: { contact: Contact }) {
  return (
    <aside class="os-panel" aria-label="About Nilson">
      <div class="os-card os-row">
        <div class="os-row" style="justify-content:flex-start">
          <div class="os-avatar" aria-hidden="true">
            NG
          </div>
          <div style="display:flex;flex-direction:column;gap:2px">
            <span class="os-name">Nilson Gaspar</span>
            <span class="os-sub">Uptime: 14 years in product design</span>
          </div>
        </div>
        <span class="os-btn" title="CV file coming soon">
          CV soon
        </span>
      </div>
      <nav class="os-card os-links" aria-label="Contact">
        <a class="os-link" href={`mailto:${contact.email}`}>
          <Icon name="mail" size={15} width={1.8} />
          Email
        </a>
        <a
          class="os-link"
          href={contact.github.url}
          rel="me noopener"
          target="_blank"
        >
          <Icon name="github" size={15} width={1.8} />
          GitHub
        </a>
        <a
          class="os-link"
          href={contact.bluesky.url}
          rel="me noopener"
          target="_blank"
        >
          <Icon name="bluesky" size={15} width={1.8} />
          Bluesky
        </a>
        <a class="os-link" href="/">
          <Icon name="classic" size={15} width={1.8} />
          Classic
        </a>
      </nav>
      <div class="os-card" style="display:flex;flex-direction:column;gap:8px">
        <div
          class="os-row"
          style="justify-content:flex-start;color:var(--os-accent)"
        >
          <Icon name="pin" size={20} width={1.6} />
          <span class="os-name" style="font-size:13px">
            {contact.based}
          </span>
        </div>
        <p class="os-body" style="margin:0">
          Open to remote roles in EU time zones.
        </p>
      </div>
      <div class="os-card" style="display:flex;flex-direction:column;gap:10px">
        <span class="os-label">Impact</span>
        <div class="os-gauges">
          {GAUGES.map((g) => (
            <div class="os-gauge" title={g.label} key={g.short}>
              <div class="os-gauge-dial">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  style="transform:rotate(-90deg)"
                  aria-hidden="true"
                >
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="var(--os-border)"
                    stroke-width="3"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="var(--os-accent)"
                    stroke-width="3"
                    stroke-dasharray={`${((C * g.pct) / 100).toFixed(1)} ${C.toFixed(1)}`}
                  />
                </svg>
                <span>{g.value}</span>
              </div>
              <span class="os-sub" style="font-size:10px">
                {g.short}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function NilsonOS({ tree, contact, caseCount }: Props) {
  const byId = useMemo(
    () => new Map(flatten(tree).map((n) => [n.id, n])),
    [tree]
  );
  const slugs = useMemo(() => slugIndex(tree), [tree]);
  const [active, setActive] = useState<WsId>(1);
  const [spaces, setSpaces] = useState<Workspaces>(emptyWorkspaces);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [panel, setPanel] = useState<null | 'control'>(null);
  const [showDesktop, setShowDesktop] = useState(false);

  const ws = spaces[active];
  const update = (fn: (w: Workspace) => Workspace) => {
    setShowDesktop(false);
    setSpaces((all) => ({ ...all, [active]: fn(all[active]) }));
  };
  const open = (id: string) => update((w) => openBeside(w, id));

  // restore: shared URL first, then this tab's session (client only, after hydration)
  useEffect(() => {
    const fromUrl = location.search.includes('open=')
      ? decode(location.search, slugs.toId)
      : null;
    const session = loadSession();
    if (session) setSpaces(session.spaces);
    if (fromUrl) {
      setActive(fromUrl.active);
      setSpaces((all) => ({
        ...(session?.spaces ?? all),
        [fromUrl.active]: fromUrl.ws,
      }));
    } else if (session) setActive(session.active);
    setReady(true);
  }, []);

  // keep the URL and the session in step with the layout
  useEffect(() => {
    if (!ready) return;
    history.replaceState(
      null,
      '',
      `${location.pathname}${encode(ws, active, slugs.toSlug)}`
    );
    saveSession(active, spaces);
  }, [spaces, active, ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = e.ctrlKey && e.altKey;
      if (e.key === 'Escape') {
        if (panel) setPanel(null);
        else setSelected(null);
        return;
      }
      if (!combo) return;
      const k = e.key.toLowerCase();
      if (['1', '2', '3'].includes(e.key)) setActive(Number(e.key) as WsId);
      else if (e.shiftKey && e.key === 'ArrowLeft')
        update((w) => moveColumn(w, w.focus, w.focus - 1));
      else if (e.shiftKey && e.key === 'ArrowRight')
        update((w) => moveColumn(w, w.focus, w.focus + 1));
      else if (e.key === 'ArrowLeft')
        update((w) => ({ ...w, focus: Math.max(0, w.focus - 1) }));
      else if (e.key === 'ArrowRight')
        update((w) => ({
          ...w,
          focus: Math.min(w.columns.length - 1, w.focus + 1),
        }));
      else if (k === 'q' && ws.columns.length)
        update((w) => closeColumn(w, w.focus));
      else if (k === 'd') setShowDesktop((v) => !v);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel, active, ws]);

  const focused = ws.columns[ws.focus];
  const focusedNode = focused && byId.get(focused.windows[0]);

  return (
    <>
      <header class="os-bar">
        <div class="os-bar-group">
          <button
            class="os-tray"
            aria-label="Open launcher (Ctrl K)"
            title="Launcher, coming in the next phase"
          >
            <Icon name="search" />
          </button>
          <Clock />
          {focusedNode && !showDesktop ? (
            <span class="os-pill" aria-label="Focused window">
              <span class="os-dot" aria-hidden="true" />
              {slugs.toSlug.get(focusedNode.id)}
            </span>
          ) : (
            <span
              class="os-pill os-pill--mono"
              aria-label="14 years, 3 companies, case study count"
            >
              <span>14y</span>
              <span>3 co</span>
              <span>{caseCount} cases</span>
            </span>
          )}
        </div>
        <nav class="os-ws" aria-label="Workspaces">
          {WORKSPACES.map((w) => (
            <button
              key={w.id}
              aria-current={active === w.id}
              class={spaces[w.id].columns.length ? 'is-busy' : ''}
              aria-label={`Workspace ${w.id}: ${w.name}`}
              title={w.name}
              onClick={() => setActive(w.id)}
            >
              {active === w.id ? w.id : ''}
            </button>
          ))}
        </nav>
        <div class="os-bar-group">
          {ws.columns.length > 0 && (
            <button
              class="os-pill"
              aria-pressed={showDesktop}
              onClick={() => setShowDesktop((v) => !v)}
              title="Show the desktop (Ctrl Alt D)"
            >
              Desktop
            </button>
          )}
          <a class="os-pill" href="/">
            Classic site
          </a>
          <button
            class="os-tray"
            aria-label="Notifications"
            title="Notifications"
          >
            <Icon name="bell" />
          </button>
          <button
            class="os-tray"
            aria-label="Control center"
            aria-pressed={panel === 'control'}
            aria-expanded={panel === 'control'}
            onClick={() => setPanel(panel === 'control' ? null : 'control')}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <ul class="os-icons" aria-label="Desktop">
        {tree.map((node) => (
          <li key={node.id}>
            <button
              class="os-icon"
              aria-pressed={selected === node.id}
              aria-label={
                node.title ? `${node.name}: ${node.title}` : node.name
              }
              onClick={() => setSelected(node.id)}
              onDblClick={() => open(node.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selected === node.id) {
                  e.preventDefault();
                  open(node.id);
                }
              }}
            >
              <span class="os-icon-tile">
                <Icon
                  name={kindIcon(node.kind, node.name)}
                  size={26}
                  width={1.6}
                />
              </span>
              <span class="os-icon-label">{node.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {!ws.columns.length && (
        <div class="os-hint" role="note">
          <span class="os-kbd">Ctrl K</span>
          search everything · double-click a folder to open it as a column
        </div>
      )}

      <Strip
        ws={ws}
        byId={byId}
        hidden={showDesktop}
        onFocus={(col) => update((w) => ({ ...w, focus: col }))}
        onClose={(col, win) => update((w) => closeWindow(w, col, win))}
        onGo={(col, win, id) => update((w) => navigate(w, col, win, id))}
        onOpenBeside={(col, id) =>
          update((w) => openBeside({ ...w, focus: col }, id))
        }
        onMove={(from, to) => update((w) => moveColumn(w, from, to))}
      />

      {panel === 'control' && <ControlCenter contact={contact} />}
    </>
  );
}
