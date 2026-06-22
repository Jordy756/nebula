import { PAGEFIND_URL } from '@scripts/constants/pagefind';

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

let pagefind: Pagefind | null = null;

export const getPagefind = async (): Promise<Pagefind | null> => {
  if (pagefind) return pagefind;

  try {
    pagefind = (await import(/* @vite-ignore */ PAGEFIND_URL)) as unknown as Pagefind;
    return pagefind;
  } catch (error) {
    console.error('Failed to load Pagefind', error);
    pagefind = null;
    return null;
  }
};

export const reinitializePagefind = async (): Promise<Pagefind | null> => {
  try {
    const pagefind = await getPagefind();
    if (!pagefind) throw new Error('Pagefind is not available');

    await pagefind.destroy();
    await pagefind.init();

    return pagefind;
  } catch (error) {
    console.error('Failed to reinitialize Pagefind', error);
    return null;
  }
};
