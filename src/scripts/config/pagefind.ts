export type PagefindSubResult = {
  title: string;
  url: string;
  excerpt: string;
};

export type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    image?: string;
    [key: string]: string | undefined;
  };
  sub_results: PagefindSubResult[];
};

export type PagefindResult = {
  id: string;
  data: () => Promise<PagefindResultData>;
};

export type PagefindSearchResponse = {
  results: PagefindResult[];
};

export type Pagefind = {
  init: () => Promise<void>;
  search: (term: string) => Promise<PagefindSearchResponse>;
  debouncedSearch: (term: string) => Promise<PagefindSearchResponse | null>;
  preload: (term: string) => Promise<void>;
  filters: () => Promise<Record<string, Record<string, number>>>;
  destroy: () => Promise<void>;
  options: (options: Record<string, unknown>) => Promise<void>;
};

const PAGEFIND_URL = '/pagefind/pagefind.js';

let instance: Pagefind | null = null;

export const getPagefind = async (): Promise<Pagefind | null> => {
  if (instance) return instance;

  try {
    instance = (await import(/* @vite-ignore */ PAGEFIND_URL)) as unknown as Pagefind;
    return instance;
  } catch (error) {
    instance = null;
    console.error('Failed to load Pagefind', error);
    return null;
  }
};
