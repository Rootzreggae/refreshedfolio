/** Stroke icons for Nilson OS (paths from the design canvas). */
import type { NodeKind } from '../../lib/desktop/tree';

const P = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-3.5-3.5',
  folder:
    'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  video: 'M3 5h18v14H3zM10 9.5v5l4.5-2.5z',
  file: 'M6 3h9l4 4v14H6zM14 3v5h5',
  doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
  app: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4',
  menu: 'M4 6h16M4 12h16M4 18h10',
  classic: 'M3 4h18v16H3zM3 9h18',
  mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
  github:
    'M9 19c-4 1.5-4-2-6-2.5M15 22v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12 12 0 0 0-6.4 0C6.1 2.1 5 2.4 5 2.4a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 3.5 9.5c0 5 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V22',
  bluesky:
    'M12 11c-1.5-3-5-6.5-7-6.5-1.5 0-1.5 2-1 4.5.6 2.8 3 3 5 2.8-3 .6-4 2.4-2 4.4 3 3 4.5-1.5 5-3.4.5 1.9 2 6.4 5 3.4 2-2 1-3.8-2-4.4 2 .2 4.4 0 5-2.8.5-2.5.5-4.5-1-4.5-2 0-5.5 3.5-7 6.5',
  sun: 'M12 3v2M12 19v2M5 12H3M21 12h-2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4',
};
export type IconName = keyof typeof P;

export function Icon({
  name,
  size = 13,
  width = 2,
}: {
  name: IconName;
  size?: number;
  width?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={width}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d={P[name]} />
    </svg>
  );
}

export function kindIcon(kind: NodeKind, name = ''): IconName {
  if (kind === 'folder') return 'folder';
  if (kind === 'video') return 'video';
  if (kind === 'trash') return 'trash';
  if (kind === 'app') return 'app';
  if (kind === 'md' || name.endsWith('.md')) return 'doc';
  return 'file';
}
