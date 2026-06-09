import { getPagefind, type PagefindResultData } from '@scripts/config/pagefind';

const generateList = (results: PagefindResultData[]) => {
  return results
    .map((result) => {
        const [parent, ...children] = result.sub_results;
        if (!parent) return '';

        const childrenList =
          children.length > 0
            ? `<ul class="ml-4 flex flex-col gap-4">${children
                .map(
                  (sub) => `
                <li class="relative pl-4 before:absolute before:top-0 before:left-0 before:h-[calc(100%+16px)] before:w-px before:bg-neutral-400 after:absolute after:top-1/2 after:left-0 after:h-px after:w-3 after:bg-neutral-400 last:before:h-1/2">
                  <a href="${sub.url}" class="flex flex-col">
                    <h4 class="text-lg text-neutral-50">${sub.title}</h4>
                    <p class="text-sm text-neutral-400">${sub.excerpt}</p>
                  </a>
                </li>`,
                )
                .join('')}</ul>`
            : '';

        return `
          <li class="flex flex-col gap-2">
          ${result.meta.title ? `<span class="text-xs text-neutral-400">${result.meta.title}</span>` : ''}
            <a href="${parent.url}" class="flex flex-col gap-1">
              <h3 class="text-xl">${parent.title}</h3>
              <p class="text-sm text-neutral-400">${parent.excerpt}</p>
            </a>
            ${childrenList}
          </li>
        `;
      })
      .join('');
};

const setup = () => {
  const dialog = document.getElementById('search-modal') as HTMLDialogElement | null;

  if (!dialog) return;

  const input = dialog.querySelector<HTMLInputElement>('input');
  const status = dialog.querySelector<HTMLElement>('#search-status');
  const list = dialog.querySelector<HTMLElement>('#search-results');

  if (!input || !status || !list) return;

  let lastTerm = '';

  const render = async (term: string) => {
    status.textContent = "0 resultados";
    if (term === lastTerm) return;
    lastTerm = term;

    if (!term) {
      list.innerHTML = '';
      return;
    }

    let pagefind;
    try {
      pagefind = await getPagefind();
    } catch {
      list.innerHTML = '';
      return;
    }

    const search = await pagefind.debouncedSearch(term);

    if (!search || lastTerm !== term) return;

    const data = await Promise.all(search.results.map((r) => r.data()));
    if (lastTerm !== term) return;

    const totalItems = data.reduce((sum, r) => sum + r.sub_results.length, 0);

    if(totalItems === 0) return;
    
      status.textContent = `${totalItems} resultado${totalItems === 1 ? '' : 's'}`;
      list.innerHTML = generateList(data);
    
  };

  input.addEventListener('input', (e) => {
    const term = (e.currentTarget as HTMLInputElement).value.trim();
    render(term);
  });
};

document.addEventListener('astro:page-load', setup);
