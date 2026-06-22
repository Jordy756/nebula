import { getPagefind, reinitializePagefind, type PagefindResultData } from '@scripts/config/pagefind';
import { debounce } from '@scripts/utils/debounce';

let lastLocale: string | null = null;
let searchAbortController: AbortController | null = null;

const escape = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

const renderSubResult = (sub: PagefindResultData['sub_results'][number]): string => `
  <li class="relative pl-4 before:absolute before:top-0 before:left-0 before:h-[calc(100%+16px)] before:w-px before:bg-neutral-400 after:absolute after:top-1/2 after:left-0 after:h-px after:w-3 after:bg-neutral-400 last:before:h-1/2">
    <a href="${sub.url}" class="flex flex-col">
      <h4 class="text-lg text-neutral-50">${escape(sub.title)}</h4>
      <p class="text-sm text-neutral-400">${sub.excerpt}</p>
    </a>
  </li>`;

const renderResult = (result: PagefindResultData): string => {
  const [parent, ...children] = result.sub_results;
  if (!parent) return '';

  const section = result.meta.title ? `<span class="text-xs text-neutral-400">${escape(result.meta.title)}</span>` : '';

  const childrenList = children.length
    ? `<ul class="ml-4 flex flex-col gap-4">${children.map(renderSubResult).join('')}</ul>`
    : '';

  return `
    <li class="flex flex-col gap-2">
      ${section}
      <a href="${parent.url}" class="flex flex-col gap-1">
        <h3 class="text-xl">${escape(parent.title)}</h3>
        <p class="text-sm text-neutral-400">${parent.excerpt}</p>
      </a>
      ${childrenList}
    </li>`;
};

const renderList = (results: PagefindResultData[]): string => results.map(renderResult).join('');

const setup = async () => {
  const dialog = document.getElementById('search-modal') as HTMLDialogElement | null;
  if (!dialog) return;

  const input = dialog.querySelector<HTMLInputElement>('input');
  const status = dialog.querySelector<HTMLElement>('#search-status');
  const list = dialog.querySelector<HTMLElement>('#search-results');
  if (!input || !status || !list) return;

  const currentLocale = document.documentElement.lang;
  const pagefind = await getPagefind().catch(() => null);

  if (!pagefind) {
    status.textContent = 'La búsqueda no está disponible. Ejecutá pnpm build para generarla.';
    return;
  }

  if (lastLocale !== currentLocale) {
    await reinitializePagefind();
    lastLocale = currentLocale;
    input.value = '';
    list.innerHTML = '';
    status.textContent = '0 resultados';
  }

  searchAbortController?.abort();
  searchAbortController = new AbortController();

  const render = async (term: string) => {
    if (term === '') {
      list.innerHTML = '';
      status.textContent = '0 resultados';
      return;
    }

    const search = await pagefind.search(term);
    if (!search) return;

    const data = await Promise.all(search.results.map((r) => r.data()));
    const totalItems = data.reduce((sum, r) => sum + r.sub_results.length, 0);

    status.textContent = `${totalItems} resultado${totalItems === 1 ? '' : 's'}`;
    list.innerHTML = renderList(data);
  };

  const debouncedRender = debounce(render, 300);

  const handleInput = (e: Event) => {
    const term = (e.currentTarget as HTMLInputElement).value.trim();
    debouncedRender(term);
  };

  const handleClick = (e: Event) => {
    const link = (e.target as HTMLElement).closest('a');
    link && dialog.close();
  };

  input.addEventListener('input', handleInput, { signal: searchAbortController.signal });
  list.addEventListener('click', handleClick, { signal: searchAbortController.signal });
};

document.addEventListener('astro:page-load', setup);
