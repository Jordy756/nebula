const initTocObserver = () => {
  const tocLinks = document.querySelectorAll('[data-toc-link]');
  if (!tocLinks.length) return;

  const slugToLink = new Map(
    Array.from(tocLinks)
      .map((l) => [l.dataset.headingSlug ?? '', l])
      .filter(([slug]) => slug),
  );

  const headings = document.querySelectorAll('h2[id], h3[id]');
  if (!headings.length) return;

  let currentLink = null;

  const setActive = (link) => {
    if (link === currentLink) return;
    currentLink?.removeAttribute('aria-current');
    link?.setAttribute('aria-current', 'true');
    currentLink = link;
  };

  const getNearestHeading = () => {
    let nearest = null;
    let nearestTop = Infinity;

    for (const h of headings) {
      const top = h.getBoundingClientRect().top;
      if (top >= 0 && top < nearestTop) {
        nearestTop = top;
        nearest = h;
      }
    }

    if (!nearest) nearest = headings[headings.length - 1];
    return nearest;
  };

  const updateNearest = () => {
    const nearest = getNearestHeading();
    if (!nearest) return;
    const link = slugToLink.get(nearest.id);
    if (link) setActive(link);
  };

  window.addEventListener('scroll', updateNearest, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        let el = entry.target;
        while (el && el !== document.body) {
          const tag = el.tagName.toLowerCase();
          if (tag === 'h2' || tag === 'h3') {
            const link = slugToLink.get(el.id);
            if (link) {
              setActive(link);
              return;
            }
          }
          el = el.parentElement;
        }
      }
    },
    { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
  );

  headings.forEach((h) => observer.observe(h));
  updateNearest();
};

document.addEventListener('DOMContentLoaded', initTocObserver);
