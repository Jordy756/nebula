export type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    description?: string;
  };
  sub_results: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
};

export type PagefindResult = {
  id: string;
  data: () => Promise<PagefindResultData>;
};

export type PagefindModule = {
  init: () => Promise<void>;
  search: (term: string) => Promise<{ results: PagefindResult[] }>;
  debouncedSearch: (term: string) => Promise<{ results: PagefindResult[] } | null>;
  preload: (term: string) => Promise<void>;
  filters: () => Promise<Record<string, Record<string, number>>>;
  destroy: () => Promise<void>;
};

const PAGEFIND_URL = '/pagefind/pagefind.js';

let instance: PagefindModule | null = null;

export const getPagefind = async (): Promise<PagefindModule> => {
  if (instance) return instance;
  const mod: unknown = await import(PAGEFIND_URL);
  instance = (mod as { default?: PagefindModule }).default ?? (mod as PagefindModule);
  return instance;
};
