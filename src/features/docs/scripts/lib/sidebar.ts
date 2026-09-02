import type { CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '@shared/i18n/utils.ts';

export type Doc = CollectionEntry<'docs'>;

export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  isOpen?: boolean;
}

export type NavNode = NavItem | NavGroup;

export interface SidebarItem {
  slug: string;
  title: string;
  isOpen?: boolean;
}

export const sidebar: Record<Locale, SidebarItem[]> = {
  en: [
    { slug: '01-getting-started', title: 'Getting Started', isOpen: true },
    { slug: '02-components', title: 'Components' },
  ],
  es: [
    { slug: '01-getting-started', title: 'Primeros pasos', isOpen: true },
    { slug: '02-components', title: 'Componentes' },
  ],
} as const;

export function buildSidebar(entries: Doc[], locale: Locale): NavNode[] {
  const sections = sidebar[locale] ?? sidebar[defaultLocale];

  return sections.map(({ slug, title, isOpen }) => {
    const filesInSection = entries
      .filter((entry) => {
        const [entryLocale, folderSlug] = entry.id.split('/');
        return entryLocale === locale && folderSlug === slug;
      })
      .sort((a, b) => a.id.localeCompare(b.id));

    return {
      title,
      items: filesInSection.map<NavItem>((entry) => ({
        title: entry.data.title,
        href: `/${locale}/docs/${entry.id.split('/').slice(1).join('/')}`,
      })),
      isOpen,
    };
  });
}
