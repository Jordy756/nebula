const initTocObserver = (): void => {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
  if (tocLinks.length === 0) return;

  const slugToLink = new Map<string, HTMLAnchorElement>(
    Array.from(tocLinks)
      .map((link) => [link.dataset.headingSlug ?? '', link] as const)
      .filter(([slug]) => slug !== ''),
  );

  const headings = document.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]');
  if (headings.length === 0) return;

  let currentLink: HTMLAnchorElement | null = null;

  const setActiveLink = (link: HTMLAnchorElement | null): void => {
    if (link === currentLink) return;
    currentLink?.removeAttribute('aria-current');
    link?.setAttribute('aria-current', 'true');
    currentLink = link;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      let topEntry: IntersectionObserverEntry | null = null;
      let topOffset = Infinity;

      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const offset = entry.boundingClientRect.top;
        if (offset < topOffset) {
          topOffset = offset;
          topEntry = entry;
        }
      }

      if (!topEntry) return;

      const heading = topEntry.target as HTMLHeadingElement;
      const link = slugToLink.get(heading.id);
      if (link) setActiveLink(link);
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    },
  );

  headings.forEach((h) => observer.observe(h));

  const content = document.querySelector('article') ?? document.querySelector('main');
  if (!content) return;

  const walkDOM = (element: Element): void => {
    for (const child of element.children) {
      const tag = child.tagName.toLowerCase();
      if (tag === 'h2' || tag === 'h3') continue;
      if (!child.querySelector('h2') && !child.querySelector('h3')) {
        observer.observe(child);
      } else {
        walkDOM(child);
      }
    }
  };

  walkDOM(content);
};

document.addEventListener('DOMContentLoaded', initTocObserver);
