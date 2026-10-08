/**
 * What a window shows, by node kind:
 * - folders: the Files list
 * - cases, essays, Keystrok: the real page, embedded (same origin), with the site nav hidden
 * - about / principles: native text from the homepage copy
 * - the intro video: a player with captions and chapters; chapters can open the case they talk about
 * - placeholders: a short card until Nilson supplies the content
 */
import { useRef, useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import { FileIcon } from './FileIcon';
import { Terminal } from './Terminal';

export interface WindowApi {
  node: FsNode;
  byId: Map<string, FsNode>;
  /** Replace this window's content (in-place navigation). */
  go: (id: string) => void;
  /** Open as a new column beside this one. */
  openBeside: (id: string) => void;
}

const parentOf = (id: string) =>
  id.includes('/') ? id.slice(0, id.lastIndexOf('/')) : null;

/** Styles injected into embedded pages: the desktop already has a bar, so the site nav goes. */
const EMBED_CSS = 'body > nav.nav { display: none !important; }';

function Back({ node, byId, go }: WindowApi) {
  const parent = parentOf(node.id);
  if (!parent) return null;
  const p = byId.get(parent)!;
  return (
    <button class="os-back" onClick={() => go(parent)}>
      ← {p.name.toLowerCase().replace(/ /g, '-')}
    </button>
  );
}

function Files(api: WindowApi) {
  const { node } = api;
  const kids = node.children ?? [];
  return (
    <div class="os-files">
      <div class="os-files-head">
        <Back {...api} />
        <h2 class="os-files-path">~/{node.id}</h2>
        {node.summary && <p class="os-sub">{node.summary}</p>}
      </div>
      <ul class="os-files-list">
        {kids.map((k) => (
          <li key={k.id}>
            <button
              class="os-file"
              onClick={() => (k.children ? api.go(k.id) : api.openBeside(k.id))}
              title={k.children ? 'Open folder' : 'Open beside'}
            >
              <span class="os-file-icon">
                <FileIcon node={k} size={30} />
              </span>
              <span class="os-file-text">
                <span class="os-file-name">{k.name}</span>
                {(k.title || k.summary) && (
                  <span class="os-file-meta">{k.title ?? k.summary}</span>
                )}
              </span>
              <span class="os-file-go" aria-hidden="true">
                {k.children ? '›' : '→'}
              </span>
            </button>
          </li>
        ))}
        {!kids.length && <li class="os-sub">Empty.</li>}
      </ul>
    </div>
  );
}

/** The real case/essay page inside the window. Same origin, so the nav can be hidden on load. */
function PageFrame(api: WindowApi) {
  const { node } = api;
  const [loaded, setLoaded] = useState(false);
  const onLoad = (e: Event) => {
    try {
      const doc = (e.currentTarget as HTMLIFrameElement).contentDocument;
      if (doc && !doc.getElementById('os-embed')) {
        const style = doc.createElement('style');
        style.id = 'os-embed';
        style.textContent = EMBED_CSS;
        doc.head.appendChild(style);
      }
    } catch {
      /* cross-origin page (password gate redirect etc.): show it as is */
    }
    setLoaded(true);
  };
  return (
    <div class="os-frame">
      <div class="os-frame-bar">
        <Back {...api} />
        <span class="os-frame-actions">
          {node.external && (
            <a href={node.external} target="_blank" rel="noopener">
              {new URL(node.external).host} ↗
            </a>
          )}
          <a href={node.url} target="_blank" rel="noopener">
            Open in a new tab ↗
          </a>
        </span>
      </div>
      {!loaded && (
        <p class="os-frame-loading" role="status">
          Loading {node.title ?? node.name}…
        </p>
      )}
      <iframe
        class="os-frame-page"
        src={node.url}
        title={node.title ?? node.name}
        loading="lazy"
        onLoad={onLoad}
      />
    </div>
  );
}

/** Trash: explorations that didn't ship, with the reason. Evidence of judgement, not just output. */
function TrashView(api: WindowApi) {
  const { node } = api;
  const [restored, setRestored] = useState<string | null>(null);
  return (
    <div class="os-files">
      <div class="os-files-head">
        <h2 class="os-files-path">~/Trash</h2>
        <p class="os-sub">{node.summary}</p>
      </div>
      <ul class="os-trash">
        {(node.children ?? []).map((k) => (
          <li class="os-trash-card" key={k.id}>
            <div class="os-trash-thumb" aria-hidden="true">
              <FileIcon node={k} size={40} />
            </div>
            <div class="os-trash-body">
              <span class="os-label">{k.killed?.project}</span>
              <h3 class="os-trash-title">{k.title}</h3>
              <p class="os-body">{k.summary}</p>
              <p class="os-body">
                <strong class="os-trash-why">Killed because</strong>{' '}
                {k.killed?.because}
              </p>
              {k.killed?.learned && (
                <p class="os-body">
                  <strong class="os-trash-why">Learned</strong>{' '}
                  {k.killed.learned}
                </p>
              )}
              <button class="os-btn" onClick={() => setRestored(k.id)}>
                Restore
              </button>
              {restored === k.id && (
                <p class="os-trash-joke" role="status">
                  Some ideas should stay in the trash.
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const mmss = (t: number) =>
  `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/** The intro: native controls and captions, plus chapters that seek, and open the case each one is about. */
function VideoPlayer(api: WindowApi) {
  const { node } = api;
  const video = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);
  const chapters = node.chapters ?? [];
  const current = chapters.reduce((c, ch, i) => (now >= ch.at ? i : c), 0);
  const seek = (t: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = t;
    v.play().catch(() => {});
  };
  return (
    <div class="os-video">
      <video
        ref={video}
        class="os-video-el"
        src={node.url}
        poster={node.poster}
        controls
        playsInline
        preload="metadata"
        onTimeUpdate={(e) =>
          setNow((e.currentTarget as HTMLVideoElement).currentTime)
        }
      >
        {node.captions && (
          <track
            kind="captions"
            src={node.captions}
            srclang="en"
            label="English"
            default
          />
        )}
      </video>
      {chapters.length > 0 && (
        <ol class="os-chapters" aria-label="Chapters">
          {chapters.map((ch, i) => (
            <li
              key={ch.at}
              class={i === current && now > 0 ? 'is-current' : ''}
            >
              <button class="os-chapter" onClick={() => seek(ch.at)}>
                <span class="os-chapter-time">{mmss(ch.at)}</span>
                <span>{ch.label}</span>
              </button>
              {ch.open && api.byId.get(ch.open) && (
                <button
                  class="os-chapter-open"
                  onClick={() => api.openBeside(ch.open!)}
                  title={`Open ${api.byId.get(ch.open)!.name} beside the video`}
                >
                  open {api.byId.get(ch.open)!.name} →
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Doc(api: WindowApi) {
  const { node } = api;
  return (
    <article class="os-doc">
      <Back {...api} />
      <h1 class="os-doc-title">{node.title ?? node.name}</h1>
      {node.body
        ? node.body.map((b, i) => (
            <section class="os-doc-block" key={i}>
              {b.heading && <h2 class="os-doc-h">{b.heading}</h2>}
              <p class="os-doc-lede">{b.text}</p>
            </section>
          ))
        : node.summary && <p class="os-doc-lede">{node.summary}</p>}
      {node.external && (
        <div class="os-doc-actions">
          <a class="os-btn" href={node.external} target="_blank" rel="noopener">
            {new URL(node.external).host} ↗
          </a>
        </div>
      )}
      {node.todo && <p class="os-todo">Placeholder: content coming soon.</p>}
    </article>
  );
}

export function WindowBody(api: WindowApi) {
  const { node } = api;
  if (node.kind === 'terminal') return <Terminal {...api} />;
  if (node.kind === 'trash') return <TrashView {...api} />;
  if (node.kind === 'video' && node.url) return <VideoPlayer {...api} />;
  if (node.children) return <Files {...api} />;
  if (node.url && !node.todo) return <PageFrame {...api} />;
  return <Doc {...api} />;
}
