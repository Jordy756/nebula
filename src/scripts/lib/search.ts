import { getPagefind, setPagefindLanguage, type PagefindResultData } from '@scripts/config/pagefind.ts';
import { debounce } from '@scripts/utils/debounce.ts';
import { useTranslations } from '@i18n/utils.ts';

const escape = (s: string | null | undefined): string =>
  (s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

const renderSub = (sub: PagefindResultData['sub_results'][number]): string => `
  <li class="relative pl-4 before:absolute before:top-0 before:left-0 before:h-[calc(100%+16px)] before:w-px before:bg-neutral-400 after:absolute after:top-1/2 after:left-0 after:h-px after:w-3 after:bg-neutral-400 last:before:h-1/2">
    <a href="${escape(sub.url)}" class="text-sm text-neutral-600 dark:text-neutral-400">${sub.excerpt}</a>
  </li>`;

const renderResult = (r: PagefindResultData): string => {
  if (!r.sub_results) return '';
  const children = r.sub_results.length
    ? `<ul class="ml-4 flex flex-col gap-2">${r.sub_results.map(renderSub).join('')}</ul>`
    : '';
  return `<li class="flex flex-col gap-2"><h3 class="text-base font-semibold">${escape(r.meta.title)}</h3>${children}</li>`;
};

const formatCount = (count: number, locale: string, t: ReturnType<typeof useTranslations>): string => {
  const templates = t('search.resultsCount') as unknown as Record<Intl.LDMLPluralRule, string>;
  const rule = new Intl.PluralRules(locale).select(count) as Intl.LDMLPluralRule;
  return (templates[rule] ?? templates.other).replace('{count}', String(count));
};

export const setupSearch = async (): Promise<void> => {
  const dialog = document.getElementById('search-modal') as HTMLDialogElement | null;
  if (!dialog) return;
  const input = dialog.querySelector<HTMLInputElement>('input');
  const status = dialog.querySelector<HTMLElement>('#search-status');
  const list = dialog.querySelector<HTMLElement>('#search-results');
  if (!input || !status || !list) return;

  const locale = document.documentElement.lang || 'en';
  const t = useTranslations(locale as 'en' | 'es');

  const pagefind = await getPagefind();
  if (!pagefind) {
    status.textContent = t('search.unavailable').toString();
    return;
  }
  await setPagefindLanguage(locale);

  const controller = new AbortController();

  const render = async (term: string) => {
    if (term === '') {
      list.innerHTML = '';
      status.textContent = formatCount(0, locale, t);
      return;
    }
    const search = await pagefind.search(term);
    const data = await Promise.all(search.results.map((r) => r.data()));
    const total = data.reduce((s, r) => s + r.sub_results.length, 0);
    status.textContent = formatCount(total, locale, t);
    list.innerHTML = data.map(renderResult).join('');
  };

  const debouncedRender = debounce(render, 300);

  input.addEventListener('input', (e) => {
    debouncedRender((e.currentTarget as HTMLInputElement).value.trim());
  }, { signal: controller.signal });

  list.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (link) dialog.close();
  }, { signal: controller.signal });
};
