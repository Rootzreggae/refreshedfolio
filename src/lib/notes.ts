import { getCollection, type CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';

export type Note = CollectionEntry<'notes'>;

export async function getPublishedNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return notes.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

export function groupByYear(notes: Note[]): Array<[number, Note[]]> {
  const map = new Map<number, Note[]>();
  for (const note of notes) {
    const year = note.data.publishDate.getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(note);
  }
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

export function getAllTags(notes: Note[]): string[] {
  const tags = new Set<string>();
  for (const note of notes) {
    for (const tag of note.data.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

export function getNoteStats(body: string): { minutes: number; words: number } {
  const stats = readingTime(body);
  return { minutes: Math.max(1, Math.ceil(stats.minutes)), words: stats.words };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}
