/**
 * A fake shell with real feeling: prompt, history (up/down), Tab completion over the file tree,
 * and commands that act on the desktop (open, sudo hire nilson). Paths are forgiving for people who
 * don't live in shells: "case-studies", "Case studies" and case\ studies all resolve.
 */
import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import type { WindowApi } from './Window';

/** Desktop actions the terminal can trigger; NilsonOS listens for this event. */
export const osEvent = (detail: { type: 'control' | 'open'; id?: string }) =>
  window.dispatchEvent(new CustomEvent('nilson-os', { detail }));

const LOGO = [
  '███╗   ██╗',
  '████╗  ██║',
  '██╔██╗ ██║',
  '██║╚██╗██║',
  '██║ ╚████║',
  '╚═╝  ╚═══╝',
];
const FACTS: [string, string][] = [
  ['Role', 'Senior Product Designer'],
  ['Focus', 'developer tools, observability, data infra'],
  ['Uptime', '14 years (8 in technical products)'],
  ['Previous', 'Dynatrace, Grafana Labs'],
  ['Side project', 'Keystrok (keystrok.dev)'],
  ['WM', 'niri, Noctalia'],
  ['Location', 'Lisbon, PT'],
  ['Contact', 'hello@nilsongaspar.com'],
];
const SWATCHES = [
  '#0a1626',
  '#182e49',
  '#54e0a6',
  '#1abc9c',
  '#ffd84d',
  '#ff7a59',
  '#ff3d77',
  '#b07cff',
];

/** Career as commits, newest first. Roles and dates from Nilson's CV (2026). */
const GIT_LOG: [string, string][] = [
  [
    'a1f3c09',
    'feat(dynatrace): Senior Product Designer · Spaces, Settings Platform · Oct 2025 to Apr 2026',
  ],
  [
    '9e41d2a',
    'feat(keystrok): designer and developer, open source secrets hygiene · Jul 2024 to now',
  ],
  [
    '7c2e4b1',
    'feat(grafana-labs): Senior Product Designer · APM, Frontend Observability, onboarding · May 2022 to Jul 2024',
  ],
  [
    '5d80f3e',
    'feat(ki-challengers): Senior Product Designer · data driven products for Fortune 500 clients · Aug 2020 to May 2022',
  ],
  [
    '4b1a7c6',
    'feat(jungle): Lead Product Designer · Jungle.AI end to end · Sep 2019 to Aug 2020',
  ],
  [
    '3f2e9b0',
    'feat(comparamais): UX lead · price comparison platform · 2018 to Sep 2019',
  ],
  [
    '2c7d4a1',
    'feat(aptoide): UX/UI Designer · Android app store · Jan 2016 to Dec 2017',
  ],
  ['0000001', 'init: the comic book kid starts drawing'],
];

const HELP: [string, string][] = [
  ['whoami', 'who is this'],
  ['ls [path]', 'list a folder'],
  ['cd <path>', 'change folder (cd .. goes up, cd ~ goes home)'],
  ['cat <file>', 'print a document'],
  ['open <path>', 'open it as a window'],
  ['pwd', 'where am I'],
  ['git log --oneline', 'the career, as commits'],
  ['clear', 'clear the screen'],
  ['sudo hire nilson', 'try it'],
];

type Line = { key: number; node: ComponentChildren };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-|-$/g, '');

/** Split a command line into words, honouring quotes and backslash-escaped spaces. */
function words(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '\\' && line[i + 1] === ' ') {
      cur += ' ';
      i++;
    } else if (ch === ' ') {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

export function Terminal({ byId }: WindowApi) {
  const roots = [...byId.values()].filter((n) => !n.id.includes('/'));
  const [cwd, setCwd] = useState(''); // '' = home
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const seq = useRef(0);

  const kids = (dir: string): FsNode[] =>
    dir ? (byId.get(dir)?.children ?? []) : roots;

  /** Resolve a path relative to cwd; matches names exactly, case-insensitively or by slug. */
  const resolve = (path: string): string | null | undefined => {
    let dir: string | null =
      path.startsWith('~') || path.startsWith('/') ? '' : cwd;
    for (const part of path
      .replace(/^[~/]+/, '')
      .split('/')
      .filter(Boolean)) {
      if (part === '.') continue;
      if (part === '..') {
        dir = dir
          ? dir.includes('/')
            ? dir.slice(0, dir.lastIndexOf('/'))
            : ''
          : '';
        continue;
      }
      const list = kids(dir ?? '');
      const hit =
        list.find((n) => n.name === part) ??
        list.find((n) => n.name.toLowerCase() === part.toLowerCase()) ??
        list.find((n) => slug(n.name) === slug(part)) ??
        list.find((n) => slug(n.name.replace(/\.\w+$/, '')) === slug(part));
      if (!hit) return findAnywhere(path);
      dir = hit.id;
    }
    return dir;
  };

  /** Forgiving fallback for a bare name ("cat about"): the one node anywhere that matches. */
  const findAnywhere = (path: string): string | undefined => {
    if (path.includes('/')) return undefined;
    const want = slug(path.replace(/\.\w+$/, ''));
    const hits = [...byId.values()].filter(
      (n) =>
        slug(n.name.replace(/\.\w+$/, '')) === want ||
        slug(n.name) === slug(path)
    );
    return hits.length === 1 ? hits[0].id : undefined;
  };

  const print = (...nodes: ComponentChildren[]) =>
    setLines((l) => [
      ...l,
      ...nodes.map((node) => ({ key: seq.current++, node })),
    ]);

  const whoami = () => (
    <div class="os-term-fetch">
      <pre class="os-term-logo">{LOGO.join('\n')}</pre>
      <div class="os-term-facts">
        <span class="os-term-accent">nilson@portfolio</span>
        <span class="os-term-faint">────────────────</span>
        {FACTS.map(([k, v]) => (
          <span key={k}>
            <span class="os-term-accent">{k}:</span> {v}
          </span>
        ))}
        <span class="os-term-swatches">
          {SWATCHES.map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </span>
      </div>
    </div>
  );

  const run = (raw: string) => {
    const prompt = (
      <span>
        <span class="os-term-dim">{cwd ? `~/${cwd}` : '~'}</span>{' '}
        <span class="os-term-accent">❯</span> {raw}
      </span>
    );
    if (raw.trim()) setHistory((h) => [...h.filter((x) => x !== raw), raw]);
    setHIdx(-1);
    const [cmd, ...args] = words(raw.trim());
    const arg = args.join(' ');
    if (!cmd) return print(prompt);
    if (cmd === 'clear') return setLines([]);
    const out: ComponentChildren[] = [prompt];
    switch (cmd) {
      case 'help':
        out.push(
          <div class="os-term-help">
            {HELP.map(([c, d]) => (
              <span key={c}>
                <span class="os-term-accent">{c.padEnd(20)}</span>
                {d}
              </span>
            ))}
          </div>
        );
        break;
      case 'whoami':
      case 'fastfetch':
      case 'neofetch':
        out.push(whoami());
        break;
      case 'pwd':
        out.push(cwd ? `/home/nilson/${cwd}` : '/home/nilson');
        break;
      case 'ls': {
        const target = arg ? resolve(arg) : cwd;
        if (target === undefined)
          out.push(`ls: ${arg}: no such file or folder`);
        else {
          const node = target ? byId.get(target) : null;
          const list = node && !node.children ? [node] : kids(target ?? '');
          out.push(
            <div class="os-term-ls">
              {list.map((n) => (
                <span
                  key={n.id}
                  class={
                    n.children
                      ? 'os-term-dir'
                      : n.locked
                        ? 'os-term-locked'
                        : ''
                  }
                >
                  {n.name}
                  {n.children ? '/' : ''}
                </span>
              ))}
            </div>
          );
        }
        break;
      }
      case 'cd': {
        const target = arg ? resolve(arg) : '';
        const node = target ? byId.get(target) : null;
        if (target === undefined) out.push(`cd: ${arg}: no such folder`);
        else if (node && !node.children)
          out.push(`cd: ${arg}: not a folder (try: open ${arg})`);
        else setCwd(target ?? '');
        break;
      }
      case 'cat': {
        const target = arg ? resolve(arg) : undefined;
        const node = target ? byId.get(target) : undefined;
        if (!node) out.push(`cat: ${arg || '(nothing)'}: no such file`);
        else if (node.children)
          out.push(`cat: ${node.name}: is a folder (try: ls ${arg})`);
        else {
          out.push(
            <span class="os-term-strong">{node.title ?? node.name}</span>
          );
          for (const b of node.body ?? [])
            out.push(b.heading ? `\n## ${b.heading}\n${b.text}` : b.text);
          if (!node.body && node.summary) out.push(node.summary);
          if (node.killed) out.push(`killed because: ${node.killed.because}`);
          if (node.url)
            out.push(
              <span class="os-term-dim">
                open {node.name} to read the whole thing
              </span>
            );
        }
        break;
      }
      case 'open':
      case 'xdg-open': {
        const target = arg ? resolve(arg) : undefined;
        if (!target)
          out.push(`open: ${arg || '(nothing)'}: no such file or folder`);
        else {
          osEvent({ type: 'open', id: target });
          out.push(
            <span class="os-term-dim">opening {byId.get(target)?.name}…</span>
          );
        }
        break;
      }
      case 'git':
        if (args[0] === 'log')
          out.push(
            <div class="os-term-help">
              {GIT_LOG.map(([h, m], i) => (
                <span key={h}>
                  <span class="os-term-yellow">{h}</span>
                  {i === 0 && (
                    <span class="os-term-accent"> (HEAD → career)</span>
                  )}{' '}
                  {m}
                </span>
              ))}
            </div>
          );
        else out.push(`git: try "git log --oneline"`);
        break;
      case 'sudo':
        if (/^hire\s+nilson/i.test(arg)) {
          out.push(
            '[sudo] password for recruiter: ********',
            <span class="os-term-accent">
              Access granted. Opening the contact card…
            </span>
          );
          osEvent({ type: 'control' });
        } else
          out.push(`${arg || 'sudo'}: permission denied. Nice try, though.`);
        break;
      case 'rm':
        if (/-\w*r\w*f|-\w*f\w*r/.test(arg) && /(^|\s)\/(\s|$)|~/.test(arg)) {
          out.push(
            'nice try. The bad ideas are already in the Trash, have a look.'
          );
          const t = roots.find((n) => n.kind === 'trash');
          if (t) osEvent({ type: 'open', id: t.id });
        } else out.push('rm: this desktop is read-only');
        break;
      case 'echo':
        out.push(arg);
        break;
      case 'date':
        out.push(
          new Date().toLocaleString('en-GB', { timeZone: 'Europe/Lisbon' }) +
            ' (Lisbon)'
        );
        break;
      case 'exit':
        out.push('there is no escape. (Close the window with the × above.)');
        break;
      default:
        out.push(`${cmd}: command not found. Type help.`);
    }
    print(...out);
  };

  /** Tab: complete the last word against the folder it points into. */
  const complete = () => {
    const ws = words(input);
    const endsWithSpace = input.endsWith(' ') && !input.endsWith('\\ ');
    const last = endsWithSpace ? '' : (ws.pop() ?? '');
    const cmd = ws[0] ?? '';
    if (!ws.length && !endsWithSpace) {
      const cmds = [
        'help',
        'whoami',
        'ls',
        'cd',
        'cat',
        'open',
        'pwd',
        'git',
        'clear',
        'sudo',
      ];
      const m = cmds.filter((c) => c.startsWith(last));
      if (m.length === 1) setInput(`${m[0]} `);
      else if (m.length) print(m.join('  '));
      return;
    }
    const slash = last.lastIndexOf('/');
    const dirPart = slash >= 0 ? last.slice(0, slash + 1) : '';
    const stem = last.slice(slash + 1).toLowerCase();
    const dir = dirPart ? resolve(dirPart) : cwd;
    if (dir === undefined) return;
    const pool = kids(dir ?? '').filter((n) =>
      cmd === 'cd' ? n.children : true
    );
    const m = pool.filter(
      (n) =>
        n.name.toLowerCase().startsWith(stem) ||
        slug(n.name).startsWith(slug(stem))
    );
    const esc = (s: string) => s.replace(/ /g, '\\ ');
    const prefix = input.slice(
      0,
      input.length - (endsWithSpace ? 0 : last.length)
    );
    if (m.length === 1) {
      const n = m[0];
      setInput(`${prefix}${esc(dirPart + n.name)}${n.children ? '/' : ' '}`);
    } else if (m.length > 1)
      print(m.map((n) => n.name + (n.children ? '/' : '')).join('  '));
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'Tab') complete();
    else if (e.key === 'ArrowUp') {
      if (!history.length) return;
      const i = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(i);
      setInput(history[i]);
    } else if (e.key === 'ArrowDown') {
      if (hIdx < 0) return;
      const i = hIdx + 1;
      if (i >= history.length) {
        setHIdx(-1);
        setInput('');
      } else {
        setHIdx(i);
        setInput(history[i]);
      }
    } else if (e.key === 'l' && e.ctrlKey) setLines([]);
    else return;
    e.preventDefault();
  };

  useEffect(() => {
    print(
      whoami(),
      <span class="os-term-dim">
        Type help to see what this shell can do. Tab completes paths.
      </span>
    );
  }, []);
  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines]);

  return (
    <div class="os-term" ref={box} onClick={() => field.current?.focus()}>
      {lines.map((l) => (
        <div class="os-term-line" key={l.key}>
          {l.node}
        </div>
      ))}
      <label class="os-term-input">
        <span class="os-term-dim">{cwd ? `~/${cwd}` : '~'}</span>{' '}
        <span class="os-term-accent">❯</span>
        <input
          ref={field}
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={onKey}
          aria-label="Terminal command"
          spellcheck={false}
          autocomplete="off"
          autocapitalize="off"
        />
      </label>
    </div>
  );
}
