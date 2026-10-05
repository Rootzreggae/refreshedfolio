/** Nilson OS shell (phase 1): bar, desktop icons, control center. Windows/strip arrive in phase 2. */
import { useEffect, useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
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
  const [ws, setWs] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [panel, setPanel] = useState<null | 'control'>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanel(null);
        setSelected(null);
      }
      if (e.ctrlKey && e.altKey && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        setWs(Number(e.key) as 1 | 2 | 3);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
          <span
            class="os-pill os-pill--mono"
            aria-label="14 years, 3 companies, case study count"
          >
            <span>14y</span>
            <span>3 co</span>
            <span>{caseCount} cases</span>
          </span>
        </div>
        <nav class="os-ws" aria-label="Workspaces">
          {WORKSPACES.map((w) => (
            <button
              key={w.id}
              aria-current={ws === w.id}
              aria-label={`Workspace ${w.id}: ${w.name}`}
              title={w.name}
              onClick={() => setWs(w.id)}
            >
              {ws === w.id ? w.id : ''}
            </button>
          ))}
        </nav>
        <div class="os-bar-group">
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

      <div class="os-hint" role="note">
        <span class="os-kbd">Ctrl K</span>
        search everything · double-click a folder to open it as a column
      </div>

      {panel === 'control' && <ControlCenter contact={contact} />}
    </>
  );
}
