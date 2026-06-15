const initTocObserver = () => {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');

  console.log('Found TOC links:', tocLinks);

  if (!tocLinks.length) return;

  const slugToLink = new Map<string, HTMLAnchorElement>(
    Array.from(tocLinks)
      .map((link) => [link.dataset.headingSlug ?? '', link] as [string, HTMLAnchorElement])
      .filter(([slug]) => slug),
  );

  console.log('Slug to link mapping:', slugToLink);

  const headings = document.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]');

  console.log('Found headings:', headings);

  if (!headings.length) return;

  let currentLink: HTMLAnchorElement | null = null;

  const setActive = (link: HTMLAnchorElement | null) => {
    if (link === currentLink) return;
    currentLink?.removeAttribute('aria-current');
    link?.setAttribute('aria-current', 'true');
    currentLink = link;
  };

  const getNearestHeading = (): HTMLHeadingElement | null => {
    let nearest: HTMLHeadingElement | null = null;
    let nearestTop = Infinity;

    for (const heading of headings) {
      const top = heading.getBoundingClientRect().top;

      if (top < 0 || top >= nearestTop) continue;

      nearestTop = top;
      nearest = heading;
    }

    return nearest ?? headings[headings.length - 1] ?? null;
  };

  const updateNearest = () => {
    const nearest = getNearestHeading();

    if (!nearest) return;

    const link = slugToLink.get(nearest.id);

    if (link) setActive(link);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      console.log('Intersection entries:', entries);
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        let el: Element | null = entry.target;

        while (el) {
          const tag = el.tagName.toLowerCase();
          const link = slugToLink.get(el.id);

          if ((tag !== 'h2' && tag !== 'h3') || !link) {
            el = el.parentElement;
            continue;
          }

          setActive(link);
          return;
        }
      }
    },
    { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
  );

  window.addEventListener('scroll', updateNearest, { passive: true });
  headings.forEach((heading) => observer.observe(heading));
  updateNearest();
};

document.addEventListener('DOMContentLoaded', initTocObserver);
