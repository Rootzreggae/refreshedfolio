/**
 * What a window shows, by node kind:
 * - folders: the Files list
 * - cases, essays, Keystrok: the real page, embedded (same origin), with the site nav hidden
 * - about / principles: native text from the homepage copy
 * - placeholders: a short card until Nilson supplies the content
 */
import { useState } from 'preact/hooks';
import type { FsNode } from '../../lib/desktop/tree';
import { Icon, kindIcon } from './icons';

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
                <Icon
                  name={k.locked ? 'lock' : kindIcon(k.kind, k.name)}
                  size={18}
                  width={1.6}
                />
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
  if (node.children) return <Files {...api} />;
  if (node.url && !node.todo) return <PageFrame {...api} />;
  return <Doc {...api} />;
}
