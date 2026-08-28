import type { CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '@shared/i18n/utils.ts';
import { navConfig } from '@features/docs/nav.config.ts';

export type Doc = CollectionEntry<'docs'>;

export type NavNode = {
  title: string;
  href?: string;
  items?: NavNode[];
};

export const buildNavTree = (entries: Doc[], locale: Locale): NavNode[] => {
  const sections = navConfig[locale] ?? navConfig[defaultLocale];

  return sections.map(({ slug: sectionSlug, title: sectionTitle }) => {
    const filesInSection = entries
      .filter((entry) => {
        const [entryLocale, folderSlug] = entry.id.split('/');
        return entryLocale === locale && folderSlug === sectionSlug;
      })
      .sort((a, b) => a.id.localeCompare(b.id));

    return {
      title: sectionTitle,
      items: filesInSection.map((entry) => ({
        title: entry.data.title,
        href: `/${locale}/docs/${entry.id.split('/').slice(1).join('/')}`,
      })),
    };
  });
};
