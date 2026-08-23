export interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string; [key: string]: string | undefined };
  sub_results: PagefindSubResult[];
}

export interface PagefindSubResult {
  url: string;
  excerpt: string;
}

export interface PagefindClient {
  search: (term: string) => Promise<{ results: Array<{ data: () => Promise<PagefindResultData> }> }>;
  init: () => Promise<void>;
  destroy: () => Promise<void>;
  options: (options: Record<string, unknown>) => Promise<void>;
  preload?: (term: string) => Promise<void>;
}

const url = `${(import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')}/pagefind/pagefind.js`;

let instance: PagefindClient | null = null;

export const getPagefind = async (): Promise<PagefindClient | null> => {
  if (instance) return instance;
  try {
    instance = (await import(/* @vite-ignore */ url)) as PagefindClient;
    return instance;
  } catch (error) {
    console.error('Failed to load Pagefind', error);
    return null;
  }
};

export const setPagefindLanguage = async (language: string): Promise<void> => {
  const pf = await getPagefind();
  if (!pf) return;
  await pf.destroy();
  await pf.options({ language });
  await pf.init();
};
