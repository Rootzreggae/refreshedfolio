/** What a window shows, by node kind. Phase 2: simple viewers; phase 3 brings full case/essay reading. */
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

function Doc(api: WindowApi) {
  const { node } = api;
  const company = node.id.startsWith('Case studies/')
    ? node.id.split('/')[1]
    : null;
  return (
    <article class="os-doc">
      <Back {...api} />
      <h1 class="os-doc-title">{node.title ?? node.name}</h1>
      {company && (
        <dl class="os-details">
          <div class="os-details-head">Project details</div>
          <dt>Company</dt>
          <dd>{company}</dd>
          <dt>Access</dt>
          <dd>{node.locked ? 'Password protected (NDA)' : 'Public'}</dd>
        </dl>
      )}
      {node.summary && <p class="os-doc-lede">{node.summary}</p>}
      <div class="os-doc-actions">
        {node.url && (
          <a class="os-cta" href={node.url}>
            {node.kind === 'md' ? 'Read the essay' : 'Read the full case'} →
          </a>
        )}
        {node.external && (
          <a class="os-btn" href={node.external} target="_blank" rel="noopener">
            {new URL(node.external).host} ↗
          </a>
        )}
      </div>
      {node.todo && <p class="os-todo">Placeholder: content coming soon.</p>}
    </article>
  );
}

export function WindowBody(api: WindowApi) {
  return api.node.children ? <Files {...api} /> : <Doc {...api} />;
}
