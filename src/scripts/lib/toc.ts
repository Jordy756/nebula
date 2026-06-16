const initTocObserver = () => {
  const tocContainer = document.querySelector('[data-toc-container]');
  if (!tocContainer) return;

  const tocLinks = tocContainer.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
  if (!tocLinks.length) return;

  const linkBySlug = new Map<string, HTMLAnchorElement>();
  const slugByHeading = new Map<HTMLElement, string>();

  tocLinks.forEach((link) => {
    const slug = link.dataset.headingSlug ?? '';
    linkBySlug.set(slug, link);
    const heading = document.getElementById(slug);
    if (heading) slugByHeading.set(heading, slug);
  });

  const activeLinks = new Set<HTMLAnchorElement>();

  const updateActive = () => {
    tocLinks.forEach((link) => {
      if (activeLinks.has(link)) {
        link.setAttribute('data-active', 'true');
      } else {
        link.removeAttribute('data-active');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const slug = (entry.target as HTMLElement).id;
        const link = linkBySlug.get(slug);
        if (!link) return;

        if (entry.isIntersecting) {
          activeLinks.add(link);
        } else {
          activeLinks.delete(link);
        }
      });

      updateActive();
    },
    { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
  );

  const fallbackToNearest = () => {
    if (activeLinks.size > 0) return;

    const scrollY = window.scrollY + 80;
    let nearestSlug: string | null = null;
    let nearestDistance = Infinity;

    for (const [heading] of slugByHeading) {
      const top = heading.getBoundingClientRect().top + window.scrollY;
      const distance = scrollY - top;
      if (distance >= 0 && distance < nearestDistance) {
        nearestDistance = distance;
        nearestSlug = heading.id;
      }
    }

    if (nearestSlug) {
      const link = linkBySlug.get(nearestSlug);
      if (link) {
        activeLinks.add(link);
        updateActive();
      }
    }
  };

  window.addEventListener('scroll', fallbackToNearest, { passive: true });

  slugByHeading.forEach((_, heading) => observer.observe(heading));

  fallbackToNearest();
};

document.addEventListener('astro:page-load', initTocObserver);
