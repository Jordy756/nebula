export const copyCode = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLButtonElement;
  const pre = button.closest('.group')?.querySelector<HTMLPreElement>('pre');

  if (!pre) return;

  navigator.clipboard.writeText(pre.textContent || '').then(() => {
    const popoverId = button.getAttribute('popovertarget');
    if (!popoverId) return;

    const popover = document.getElementById(popoverId);
    if (!popover) return;

    setTimeout(() => {
      popover.matches(':popover-open') && popover.hidePopover();
    }, 1000);
  });
};
