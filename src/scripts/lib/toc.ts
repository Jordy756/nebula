type TocLink = {
  link: HTMLAnchorElement;
  section: HTMLElement;
};

const initTocObserver = () => {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
  if (!links.length) return;

  const orderedSlugs: string[] = [];
  const tocLinkBySlug: Record<string, TocLink> = {};

  for (const link of links) {
    const slug = link.dataset.headingSlug;
    const section = slug ? document.getElementById(slug) : null;
    if (!slug || !section) continue;

    orderedSlugs.push(slug);
    tocLinkBySlug[slug] = { link, section };
  }

  if (!orderedSlugs.length) return;

  const visibleSlugs = new Set<string>();

  const setLinkActive = (link: HTMLAnchorElement, isActive: boolean) => {
    if (isActive) link.setAttribute('data-active', 'true');
    else link.removeAttribute('data-active');
  };

  const findSlugAboveViewport = () => {
    let closestSlug = '';
    let maxTop = -Infinity;

    for (const slug of orderedSlugs) {
      const { top } = tocLinkBySlug[slug].section.getBoundingClientRect();
      if (top <= 0 && top > maxTop) {
        maxTop = top;
        closestSlug = slug;
      }
    }

    return closestSlug;
  };

  const updateActiveLinks = () => {
    const fallbackSlug = visibleSlugs.size > 0 ? null : findSlugAboveViewport() || orderedSlugs[0];

    for (const slug of orderedSlugs) {
      const isActive = visibleSlugs.has(slug) || slug === fallbackSlug;
      setLinkActive(tocLinkBySlug[slug].link, isActive);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const slug = entry.target.id;
        if (entry.isIntersecting) visibleSlugs.add(slug);
        else visibleSlugs.delete(slug);
      }
      updateActiveLinks();
    },
    { threshold: 0 }
  );

  for (const { section } of Object.values(tocLinkBySlug)) {
    observer.observe(section);
  }
};

document.addEventListener('astro:page-load', initTocObserver);
