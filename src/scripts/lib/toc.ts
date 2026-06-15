const initTocObserver = () => {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
  if (!tocLinks.length) return;

  const slugToLink = new Map<string, HTMLAnchorElement>(
    Array.from(tocLinks)
      .map((link) => [link.dataset.headingSlug ?? '', link] as [string, HTMLAnchorElement])
      .filter(([slug]) => slug),
  );

  if (!slugToLink.size) return;

  let currentLink: HTMLAnchorElement | null = null;

  const setActive = (link: HTMLAnchorElement | null) => {
    if (link === currentLink) return;
    currentLink?.removeAttribute('aria-current');
    link?.setAttribute('aria-current', 'true');
    currentLink = link;
  };

  // Cache de posiciones absolutas: slug → posición
  const headingTops = new Map<string, number>();

  const updateHeadingPositions = () => {
    for (const slug of slugToLink.keys()) {
      const heading = document.getElementById(slug);
      if (heading) headingTops.set(slug, heading.getBoundingClientRect().top + window.scrollY);
    }
  };

  const getNearestHeading = (): string | null => {
    const scrollY = window.scrollY + 80;
    let nearestSlug: string | null = null;
    let nearestDistance = Infinity;

    for (const [slug, top] of headingTops) {
      const distance = scrollY - top;
      if (distance >= 0 && distance < nearestDistance) {
        nearestDistance = distance;
        nearestSlug = slug;
      }
    }

    return nearestSlug ?? [...headingTops.keys()].at(-1) ?? null;
  };

  const updateNearest = () => {
    const slug = getNearestHeading();
    if (!slug) return;
    const link = slugToLink.get(slug);
    if (link) setActive(link);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const link = slugToLink.get((entry.target as HTMLElement).id);
        if (link) {
          setActive(link);
          return;
        }
      }
    },
    { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
  );

  const resizeObserver = new ResizeObserver(updateHeadingPositions);
  resizeObserver.observe(document.body);

  window.addEventListener('scroll', updateNearest, { passive: true });

  // observe desde el Map directamente
  for (const slug of slugToLink.keys()) {
    const heading = document.getElementById(slug);
    if (heading) observer.observe(heading);
  }

  updateHeadingPositions();
  updateNearest();
};

initTocObserver();
