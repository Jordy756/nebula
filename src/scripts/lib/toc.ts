type TocLink = {
  slug: string;
  link: HTMLAnchorElement;
  section: HTMLElement;
};

const initTocObserver = () => {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
  if (!links.length) return;

  const tocLinks: TocLink[] = [];
  const visibleSlugs = new Set<string>();

  const setLinkActive = (link: HTMLAnchorElement, isActive: boolean) =>
    isActive ? link.setAttribute('data-active', 'true') : link.removeAttribute('data-active');

  const findSlugAboveViewport = () => {
    let closestSlug = '';
    let maxTop = -Infinity;

    for (const { slug, section } of tocLinks) {
      const { top } = section.getBoundingClientRect();
      if (top <= 0 && top > maxTop) {
        maxTop = top;
        closestSlug = slug;
      }
    }

    return closestSlug;
  };

  const updateActiveLinks = () => {
    const fallbackSlug = visibleSlugs.size > 0 ? null : findSlugAboveViewport() || tocLinks[0]?.slug;

    for (const { slug, link } of tocLinks) {
      const isActive = visibleSlugs.has(slug) || slug === fallbackSlug;
      setLinkActive(link, isActive);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const slug = entry.target.id;
        entry.isIntersecting ? visibleSlugs.add(slug) : visibleSlugs.delete(slug);
      }
      updateActiveLinks();
    },
    { threshold: 0 },
  );

  for (const link of links) {
    const slug = link.dataset.headingSlug;
    const section = slug ? document.getElementById(slug) : null;
    if (!slug || !section) continue;

    tocLinks.push({ slug, link, section });
    observer.observe(section);
  }

  if (!tocLinks.length) observer.disconnect();
};

document.addEventListener('astro:page-load', initTocObserver);
