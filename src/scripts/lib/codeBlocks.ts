import { copyCode } from '@scripts/utils/copy.ts';

const COPY_ICON = `
  <svg viewBox="0 0 15 15" class="h-6 w-6" fill="currentColor" aria-hidden="true">
    <path d="M10 4V2.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5H4V5.5A1.5 1.5 0 0 1 5.5 4zM5.5 5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zm7-1A1.5 1.5 0 0 1 14 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 4 12.5V11H2.5A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5V4z"/>
  </svg>
`;

const WRAPPER_CLASSES =
  'code-block-wrapper group relative rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden';
const BUTTON_CLASSES =
  'absolute top-4 right-4 flex items-center justify-center rounded-xs border border-neutral-200 dark:border-neutral-800 p-1 opacity-0 transition-[background-color,opacity] duration-300 ease-in-out group-hover:opacity-100';
const POPOVER_CLASSES =
  'relative inset-auto mr-4 overflow-visible rounded-sm bg-green-600 px-2 py-1 text-neutral-50 position-area-left after:absolute after:top-1/2 after:left-full after:h-3 after:w-3 after:-translate-x-1.5 after:-translate-y-1/2 after:rotate-45 after:rounded-tr-sm after:bg-green-600';
const PRE_EXTRA_CLASSES = ['overflow-x-auto', 'p-4', 'font-mono', 'leading-relaxed'];

const getLabels = () => {
  const lang = document.documentElement.lang || 'en';
  return lang.startsWith('es') ? { copy: 'Copiar código', copied: 'Copiado' } : { copy: 'Copy code', copied: 'Copied' };
};

const applyLabels = (labels: { copy: string; copied: string }) => {
  document
    .querySelectorAll<HTMLButtonElement>('.code-block-wrapper button[popovertarget^="copy-popover-"]')
    .forEach((button) => {
      button.setAttribute('aria-label', labels.copy);
      button.setAttribute('data-copy-label', labels.copy);
    });
  document.querySelectorAll<HTMLElement>('.code-block-wrapper [data-copied-label]').forEach((popover) => {
    popover.textContent = labels.copied;
  });
};

const wrapCodeBlocks = () => {
  const labels = getLabels();

  document.querySelectorAll<HTMLPreElement>('pre.astro-code').forEach((pre) => {
    if (pre.closest('.code-block-wrapper')) {
      applyLabels(labels);
      return;
    }

    pre.classList.add(...PRE_EXTRA_CLASSES);
    const popoverId = `copy-popover-${crypto.randomUUID()}`;

    const template = document.createElement('template');
    template.innerHTML = `
      <div class="${WRAPPER_CLASSES}">
        ${pre.outerHTML}
        <button
          type="button"
          popovertarget="${popoverId}"
          aria-label="${labels.copy}"
          data-copy-label="${labels.copy}"
          class="${BUTTON_CLASSES}"
        >
          ${COPY_ICON}
        </button>
        <div
          id="${popoverId}"
          popover
          data-copied-label="${labels.copied}"
          class="${POPOVER_CLASSES}"
        >${labels.copied}</div>
      </div>
    `;

    pre.replaceWith(template.content.firstElementChild!);
  });

  applyLabels(labels);
};

let clickBound = false;

const setupCodeBlocks = () => {
  wrapCodeBlocks();

  if (clickBound) return;
  clickBound = true;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const button = target.closest<HTMLButtonElement>('button[popovertarget^="copy-popover-"]');
    if (!button) return;
    copyCode({ currentTarget: button } as unknown as MouseEvent);
  });
};

document.addEventListener('astro:page-load', setupCodeBlocks);
