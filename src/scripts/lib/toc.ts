interface TocLink {
  slug: string;
  depth: number;
  index: number;
  element: HTMLAnchorElement;
}

const initTocObserver = () => {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');

  if (!tocLinks.length) return;

  const tocContainer = document.querySelector('[data-toc-container]');
  if (!tocContainer) return;

  const tocItems: TocLink[] = Array.from(tocLinks).map((link) => ({
    slug: link.dataset.headingSlug ?? '',
    depth: parseInt(link.dataset.depth ?? '2', 10),
    index: parseInt(link.dataset.index ?? '0', 10),
    element: link,
  }));

  if (!tocItems.length) return;

  const headingElements = new Map<string, HTMLElement>();
  for (const item of tocItems) {
    const heading = document.getElementById(item.slug);
    if (heading) headingElements.set(item.slug, heading);
  }

  const setActive = (links: HTMLAnchorElement[]) => {
    const currentlyActive = tocContainer.querySelectorAll('[data-active="true"]');
    currentlyActive.forEach((el) => el.setAttribute('data-active', 'false'));

    links.forEach((link) => link.setAttribute('data-active', 'true'));
  };

  const getVisibleHeadings = (): TocLink[] => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const viewportTop = scrollY + 80;
    const viewportBottom = scrollY + viewportHeight;

    const visible: TocLink[] = [];

    for (const item of tocItems) {
      const heading = headingElements.get(item.slug);
      if (!heading) continue;

      const rect = heading.getBoundingClientRect();
      const headingTop = scrollY + rect.top;
      const headingBottom = headingTop + rect.height;

      if (headingBottom > viewportTop && headingTop < viewportBottom) {
        visible.push(item);
      }
    }

    return visible;
  };

  const updateActiveByScroll = () => {
    const visible = getVisibleHeadings();
    if (visible.length > 0) {
      setActive(visible.map((v) => v.element));
    }
  };

  const observerOptions = {
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    const visible: TocLink[] = [];

    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = (entry.target as HTMLElement).id;
      const item = tocItems.find((t) => t.slug === id);
      if (item) visible.push(item);
    }

    if (visible.length > 0) {
      setActive(visible.map((v) => v.element));
    }
  }, observerOptions);

  const resizeObserver = new ResizeObserver(() => {
    updateActiveByScroll();
  });
  resizeObserver.observe(document.body);

  window.addEventListener('scroll', updateActiveByScroll, { passive: true });

  for (const item of tocItems) {
    const heading = headingElements.get(item.slug);
    if (heading) observer.observe(heading);
  }

  updateActiveByScroll();
};

document.addEventListener('astro:page-load', initTocObserver);