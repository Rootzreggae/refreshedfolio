/** Nilson OS shell: bar, desktop icons, control center, and the niri strip per workspace. */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { flatten, type FsNode } from '../../lib/desktop/tree';
import {
  closeColumn,
  closeFloating,
  closeWindow,
  decode,
  emptyWorkspaces,
  encode,
  floatColumn,
  loadSession,
  moveColumn,
  navigate,
  navigateFloating,
  openBeside,
  raiseFloating,
  resizeColumn,
  saveSession,
  slugIndex,
  tileFloating,
  toggleMaximize,
  updateFloating,
  type Workspace,
  type Workspaces,
  type WsId,
} from '../../lib/desktop/state';
import { FloatLayer } from './FloatLayer';
import { FileIcon } from './FileIcon';
import { DesktopIcons } from './DesktopIcons';
import { Menu, type MenuItem, type MenuState } from './Menu';
import { Launcher } from './Launcher';
import { Deck } from './Deck';
import { cx, Strip } from './Strip';
import { Icon } from './icons';

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
        <a class="os-btn" href="/nilson-gaspar-cv.pdf" download>
          CV ↓
        </a>
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

interface Note {
  id: number;
  title: string;
  text?: string;
}

function NotificationCenter({
  log,
  onClear,
}: {
  log: Note[];
  onClear: () => void;
}) {
  return (
    <aside class="os-panel" aria-label="Notifications">
      <div class="os-row" style="padding:4px 4px 0">
        <span class="os-label">Notifications</span>
        {log.length > 0 && (
          <button class="os-link" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {log.length ? (
        log.map((n) => (
          <div class="os-card os-note" key={n.id}>
            <span class="os-name" style="font-size:13px">
              {n.title}
            </span>
            {n.text && <p class="os-body">{n.text}</p>}
          </div>
        ))
      ) : (
        <p class="os-sub" style="padding:4px">
          Nothing new.
        </p>
      )}
    </aside>
  );
}

const once = (key: string) => {
  try {
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, '1');
  } catch {
    /* storage blocked: show it anyway */
  }
  return true;
};

export default function NilsonOS({ tree, contact, caseCount }: Props) {
  const byId = useMemo(
    () => new Map(flatten(tree).map((n) => [n.id, n])),
    [tree]
  );
  const slugs = useMemo(() => slugIndex(tree), [tree]);
  const [active, setActive] = useState<WsId>(1);
  const [spaces, setSpaces] = useState<Workspaces>(emptyWorkspaces);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<null | 'control' | 'notes'>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [tidy, setTidy] = useState(0);
  const [toasts, setToasts] = useState<Note[]>([]);
  const [log, setLog] = useState<Note[]>([]);
  const [unread, setUnread] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [launcher, setLauncher] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [mac, setMac] = useState(false);
  const [mobile, setMobile] = useState(false);
  const allNodes = useMemo(() => flatten(tree), [tree]);

  const ws = spaces[active];
  const update = (fn: (w: Workspace) => Workspace) => {
    setShowDesktop(false);
    setSpaces((all) => ({ ...all, [active]: fn(all[active]) }));
  };
  const remember = (id: string) =>
    setRecent((r) => {
      const next = [id, ...r.filter((x) => x !== id)].slice(0, 6);
      try {
        sessionStorage.setItem('nilson-os:recent', JSON.stringify(next));
      } catch {
        /* storage blocked: recent list just won't survive a reload */
      }
      return next;
    });
  const notify = (title: string, text?: string) => {
    const n = { id: Date.now() + Math.random(), title, text };
    setToasts((t) => [...t, n]);
    setLog((l) => [n, ...l].slice(0, 20));
    setUnread(true);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== n.id)), 6000);
  };
  const open = (id: string) => {
    remember(id);
    update((w) => openBeside(w, id));
    if (!mobile && once('nilson-os:tip-windows'))
      setTimeout(
        () =>
          notify(
            'Tip',
            'Drag a window by its title to move it. Double-click the title to maximize, right-click it for more.'
          ),
        900
      );
  };
  const showMenu = (e: MouseEvent, items: MenuItem[]) =>
    setMenu({ x: e.clientX, y: e.clientY, items });
  const linkTo = (id: string) =>
    `${location.origin}${location.pathname}${encode(openBeside(emptyWorkspaces()[1], id), 1, slugs.toSlug)}`;
  const iconMenu = (e: MouseEvent, id: string | null) => {
    const busy = ws.columns.length > 0 || ws.floating.length > 0;
    if (!id)
      return showMenu(e, [
        { label: 'Open terminal', run: () => open('terminal') },
        {
          label: 'Search',
          hint: mac ? '⌘ K' : 'Ctrl K',
          run: () => setLauncher(true),
        },
        null,
        { label: 'Clean up icons', run: () => setTidy((n) => n + 1) },
        ...(busy
          ? [
              {
                label: showDesktop ? 'Show windows' : 'Show desktop',
                run: () => setShowDesktop((v) => !v),
              },
            ]
          : []),
        null,
        { label: 'Classic site', run: () => (location.href = '/') },
      ]);
    const node = byId.get(id)!;
    showMenu(e, [
      { label: 'Open', hint: 'double-click', run: () => open(id) },
      {
        label: 'Open in another workspace',
        run: () => openElsewhere(id),
      },
      null,
      {
        label: 'Copy link',
        run: () =>
          navigator.clipboard
            .writeText(linkTo(id))
            .then(() =>
              notify('Link copied', `Opens ${node.name} on this desktop.`)
            )
            .catch(() => notify('Could not copy the link')),
      },
      {
        label: 'Get info',
        run: () =>
          notify(
            node.title ?? node.name,
            node.summary ?? `${node.children?.length ?? 0} items inside.`
          ),
      },
    ]);
  };
  /** Shift+Enter in the launcher: the first empty workspace, else the next one. */
  const openElsewhere = (id: string) => {
    remember(id);
    const order = ([1, 2, 3] as WsId[]).filter((x) => x !== active);
    const target =
      order.find(
        (x) => !spaces[x].columns.length && !spaces[x].floating.length
      ) ?? order[0];
    setShowDesktop(false);
    setActive(target);
    setSpaces((all) => ({ ...all, [target]: openBeside(all[target], id) }));
  };

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
    try {
      setRecent(JSON.parse(sessionStorage.getItem('nilson-os:recent') || '[]'));
    } catch {
      /* no recent list */
    }
    setMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
    setReady(true);
    if (once('nilson-os:welcomed'))
      setTimeout(
        () =>
          notify(
            'Welcome to Nilson OS',
            'Double-click a folder to open it. Drag things around, right-click for more.'
          ),
        1800
      );
  }, []);

  // switching workspaces slides the windows vertically, like niri
  const lastWs = useRef(active);
  useEffect(() => {
    const dir = Math.sign(active - lastWs.current);
    lastWs.current = active;
    if (!dir || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document
      .querySelectorAll(
        '.os-strip:not(.os-strip--hidden), .os-float-layer:not(.os-strip--hidden), .os-deck'
      )
      .forEach((el) =>
        el.animate(
          [
            { transform: `translateY(${dir * 56}px)`, opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 300, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
        )
      );
  }, [active]);

  // phones get the swipe deck; floating windows don't exist there, so tile any that came along
  useEffect(() => {
    const mq = matchMedia('(max-width: 768px)');
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    if (!mobile || !ws.floating.length) return;
    update((w) => w.floating.reduce((acc, f) => tileFloating(acc, f.key), w));
  }, [mobile, ws.floating.length]);

  // the terminal asks the desktop to open things / show the contact card
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ type: string; id?: string }>).detail;
      if (d.type === 'control') setPanel('control');
      if (d.type === 'open' && d.id) openRef.current(d.id);
    };
    window.addEventListener('nilson-os', on);
    return () => window.removeEventListener('nilson-os', on);
  }, []);

  // clicks inside an embedded page never reach the desktop: focus its window when the page takes focus
  useEffect(() => {
    const onBlur = () =>
      setTimeout(() => {
        const el = document.activeElement;
        if (!(el instanceof HTMLIFrameElement)) return;
        const fl = el.closest<HTMLElement>('[data-float]')?.dataset.float;
        const colKey = el.closest<HTMLElement>('[data-col]')?.dataset.col;
        setSpaces((all) => {
          const w = all[active];
          if (fl) return { ...all, [active]: raiseFloating(w, fl) };
          const i = w.columns.findIndex((c) => c.key === colKey);
          return i < 0
            ? all
            : { ...all, [active]: { ...w, focus: i, floatFocus: null } };
        });
      });
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [active]);

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
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.altKey &&
        e.key.toLowerCase() === 'k'
      ) {
        e.preventDefault();
        setLauncher((v) => !v);
        return;
      }
      if (e.key === 'Escape') {
        if (launcher) setLauncher(false);
        else if (panel) setPanel(null);
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
      else if (k === 'q' && ws.floatFocus)
        update((w) => closeFloating(w, w.floatFocus!));
      else if (k === 'q' && ws.columns.length)
        update((w) => closeColumn(w, w.focus));
      else if (k === 'd') setShowDesktop((v) => !v);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel, active, ws, launcher]);

  const focused = ws.columns[ws.focus];
  const floatNode = ws.floatFocus
    ? byId.get(ws.floating.find((f) => f.key === ws.floatFocus)?.id ?? '')
    : undefined;
  const focusedNode = floatNode ?? (focused && byId.get(focused.windows[0]));

  return (
    <>
      <header class="os-bar">
        <div class="os-bar-group">
          <button
            class="os-tray"
            aria-label={`Search (${mac ? '⌘' : 'Ctrl'} K)`}
            title={`Search everything (${mac ? '⌘' : 'Ctrl'} K)`}
            aria-expanded={launcher}
            onClick={() => setLauncher(true)}
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
              class={
                spaces[w.id].columns.length || spaces[w.id].floating.length
                  ? 'is-busy'
                  : ''
              }
              aria-label={`Workspace ${w.id}: ${w.name}`}
              title={w.name}
              onClick={() => setActive(w.id)}
            >
              {active === w.id ? w.id : ''}
            </button>
          ))}
        </nav>
        <div class="os-bar-group">
          {(ws.columns.length > 0 || ws.floating.length > 0) && (
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
            class={cx('os-tray', unread && 'has-unread')}
            aria-label={unread ? 'Notifications, new' : 'Notifications'}
            title="Notifications"
            aria-pressed={panel === 'notes'}
            aria-expanded={panel === 'notes'}
            onClick={() => {
              setUnread(false);
              setPanel(panel === 'notes' ? null : 'notes');
            }}
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

      {!mobile && (
        <DesktopIcons
          nodes={tree}
          tidy={tidy}
          onOpen={open}
          onMenu={iconMenu}
          onMoved={() =>
            once('nilson-os:tip-icons') &&
            notify(
              'Icons stay where you put them',
              'Right-click the desktop and pick Clean up to put them back.'
            )
          }
        />
      )}

      {!ws.columns.length && !ws.floating.length && (
        <div class="os-hint" role="note">
          <span class="os-kbd">{mac ? '⌘ K' : 'Ctrl K'}</span>
          search · double-click to open · drag anything · right-click for more
        </div>
      )}

      {mobile ? (
        <>
          <Deck
            ws={ws}
            byId={byId}
            onFocus={(col) =>
              update((w) => ({ ...w, focus: col, floatFocus: null }))
            }
            onClose={(col, win) => update((w) => closeWindow(w, col, win))}
            onGo={(col, win, id) => update((w) => navigate(w, col, win, id))}
            onOpenBeside={(col, id) =>
              update((w) => openBeside({ ...w, focus: col }, id))
            }
          />
          <nav class="os-dock" aria-label="Folders">
            {tree.map((node) => (
              <button
                key={node.id}
                class="os-dock-item"
                aria-label={node.title ?? node.name}
                onClick={() => {
                  const i = ws.columns.findIndex(
                    (c) => c.windows[0] === node.id
                  );
                  if (i >= 0) update((w) => ({ ...w, focus: i }));
                  else open(node.id);
                }}
              >
                <FileIcon node={node} size={30} />
                <span>{node.name.replace(/ & CV$/, '')}</span>
              </button>
            ))}
          </nav>
        </>
      ) : (
        <>
          <Strip
            ws={ws}
            byId={byId}
            hidden={showDesktop}
            onFocus={(col) =>
              update((w) => ({ ...w, focus: col, floatFocus: null }))
            }
            onClose={(col, win) => update((w) => closeWindow(w, col, win))}
            onGo={(col, win, id) => update((w) => navigate(w, col, win, id))}
            onOpenBeside={(col, id) =>
              update((w) => openBeside({ ...w, focus: col }, id))
            }
            onMove={(from, to) => update((w) => moveColumn(w, from, to))}
            onFloat={(col, rect) => update((w) => floatColumn(w, col, rect))}
            onResize={(col, fraction) =>
              update((w) => resizeColumn(w, col, fraction))
            }
            onMaximize={(col) =>
              update((w) => ({ ...toggleMaximize(w, col), focus: col }))
            }
            onMenu={showMenu}
          />

          <FloatLayer
            floating={ws.floating}
            focus={ws.floatFocus}
            byId={byId}
            hidden={showDesktop}
            onChange={(key, patch) =>
              update((w) => updateFloating(w, key, patch))
            }
            onRaise={(key) => update((w) => raiseFloating(w, key))}
            onTile={(key) => update((w) => tileFloating(w, key))}
            onClose={(key) => update((w) => closeFloating(w, key))}
            onGo={(key, id) => update((w) => navigateFloating(w, key, id))}
            onOpenBeside={(id) => update((w) => openBeside(w, id))}
            onMenu={showMenu}
          />
        </>
      )}

      {panel === 'control' && <ControlCenter contact={contact} />}
      {panel === 'notes' && (
        <NotificationCenter log={log} onClear={() => setLog([])} />
      )}

      <div class="os-toasts" role="status" aria-live="polite">
        {panel !== 'notes' &&
          toasts.map((n) => (
            <button
              key={n.id}
              class="os-toast"
              onClick={() => setToasts((t) => t.filter((x) => x.id !== n.id))}
            >
              <span class="os-name" style="font-size:13px">
                {n.title}
              </span>
              {n.text && <span class="os-body">{n.text}</span>}
            </button>
          ))}
      </div>

      {menu && (
        <Menu
          key={`${menu.x},${menu.y}`}
          {...menu}
          onClose={() => setMenu(null)}
        />
      )}

      {launcher && (
        <Launcher
          nodes={allNodes}
          recent={recent}
          onOpen={(id, elsewhere) => (elsewhere ? openElsewhere(id) : open(id))}
          onStats={() => setPanel('control')}
          onClose={() => setLauncher(false)}
        />
      )}
    </>
  );
}
