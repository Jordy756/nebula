import type { CollectionEntry } from 'astro:content';

export type Doc = CollectionEntry<'docs'>;

export type NavNode = {
  title: string;
  href?: string;
  items?: NavNode[];
};

export function buildNavTree(entries: Doc[], locale: string): NavNode[] {
  const levels = new Map<string, NavNode[]>([['', []]]);

  for (const {
    id,
    data: { title },
  } of entries) {
    const slugParts = id.split('/').slice(1);
    const segments = slugParts.slice();
    segments.pop();
    let parentPath = '';

    for (const segment of segments) {
      const path = `${parentPath}/${segment}`;
      if (!levels.has(path)) {
        const items: NavNode[] = [];
        levels.set(path, items);
        levels.get(parentPath)!.push({ title, items });
      }
      parentPath = path;
    }

    const slug = slugParts.join('/');
    levels.get(parentPath)!.push({ title, href: `/${locale}/docs/${slug}` });
  }

  return levels.get('')!;
}
