import { getPagefind, setPagefindLanguage, type PagefindResultData } from '@shared/scripts/lib/pagefind.ts';
import { debounce } from '@shared/scripts/utils/debounce.ts';
import { useTranslations } from '@shared/i18n/utils.ts';

const escape = (s: string | null | undefined): string =>
  (s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );

const renderSub = (sub: PagefindResultData['sub_results'][number]): string => `
  <li class="relative pl-4 before:absolute before:top-0 before:left-0 before:h-[calc(100%+16px)] before:w-px before:bg-neutral-400 after:absolute after:top-1/2 after:left-0 after:h-px after:w-3 after:bg-neutral-400 last:before:h-1/2">
    <a href="${escape(sub.url)}" class="text-sm text-neutral-600 dark:text-neutral-400">${sub.excerpt}</a>
  </li>`;

const renderResult = (r: PagefindResultData): string => {
  const children = r.sub_results.length
    ? `<ul class="ml-4 flex flex-col gap-2">${r.sub_results.map(renderSub).join('')}</ul>`
    : '';

  return `<li class="flex flex-col gap-2"><h3 class="text-base font-semibold">${escape(r.meta.title)}</h3>${children}</li>`;
};

const formatCount = (count: number, locale: string, t: ReturnType<typeof useTranslations>): string => {
  const templates = t('docs.search.resultsCount') as Record<Intl.LDMLPluralRule, string>;
  const rule = new Intl.PluralRules(locale).select(count) as Intl.LDMLPluralRule;

  return (templates[rule] ?? templates.other).replace('{count}', String(count));
};

let activeController: AbortController | null = null;

export const setupSearch = async (): Promise<void> => {
  activeController?.abort();
  activeController = new AbortController();
  const signal = activeController.signal;

  const dialog = document.getElementById('search-modal') as HTMLDialogElement | null;

  if (!dialog) return;

  const input = dialog.querySelector<HTMLInputElement>('input');
  const status = dialog.querySelector<HTMLElement>('#search-status');
  const list = dialog.querySelector<HTMLElement>('#search-results');
  const spinner = dialog.querySelector<HTMLElement>('#search-spinner');

  if (!input || !status || !list || !spinner) return;

  const locale = (document.documentElement.lang || 'en') as Parameters<typeof useTranslations>[0];
  const t = useTranslations(locale);

  const pagefind = await getPagefind();

  if (!pagefind) {
    status.textContent = t('docs.search.unavailable') + '';
    return;
  }

  await setPagefindLanguage(locale);

  const render = async (term: string): Promise<void> => {
    if (signal.aborted) return;

    if (term === '') {
      list.innerHTML = '';
      status.textContent = formatCount(0, locale, t);
      return;
    }

    status.classList.add('hidden');
    spinner.classList.remove('hidden');

    try {
      const search = await pagefind.search(term);

      if (signal.aborted) return;

      const data = await Promise.all(search.results.map((r) => r.data()));
      const totalResults = data.reduce((s, r) => s + r.sub_results.length, 0);

      if (signal.aborted) return;

      status.textContent = formatCount(totalResults, locale, t);
      list.innerHTML = data.map(renderResult).join('');
    } catch (error) {
      if (signal.aborted) return;
      status.textContent = t('docs.search.unavailable') + '';
      list.innerHTML = '';
    } finally {
      if (signal.aborted) return;

      status.classList.remove('hidden');
      spinner.classList.add('hidden');
    }
  };

  const debouncedRender = debounce(render, 300);
  const handleInput = (e: Event) => debouncedRender((e.currentTarget as HTMLInputElement).value.trim());

  input.addEventListener('input', handleInput, { signal });
};

document.addEventListener('astro:page-load', setupSearch);
