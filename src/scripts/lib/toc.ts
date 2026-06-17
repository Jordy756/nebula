const buildTocLinkBySlugMap = (links: NodeListOf<HTMLAnchorElement>) => {
  const tocLinkBySlug = new Map<string, HTMLAnchorElement>();

  for (const link of links) tocLinkBySlug.set(link.dataset.headingSlug ?? '', link);

  return tocLinkBySlug;
};

const findHeadingsToObserve = (tocLinkBySlug: Map<string, HTMLAnchorElement>) => {
  const headings: HTMLElement[] = [];

  for (const slug of tocLinkBySlug.keys()) {
    const heading = document.getElementById(slug);
    heading && headings.push(heading);
  }

  return headings;
};

const setLinkActive = (link: HTMLAnchorElement | undefined, isActive: boolean) => {
  if (!link) return;

  isActive ? link.setAttribute('data-active', 'true') : link.removeAttribute('data-active');
};

const handleIntersectionChanges = (
  entries: IntersectionObserverEntry[],
  tocLinkBySlug: Map<string, HTMLAnchorElement>,
) => {
  for (const entry of entries) {
    const slug = entry.target.id;
    const link = tocLinkBySlug.get(slug);
    setLinkActive(link, entry.isIntersecting);
  }
};

const initTocObserver = () => {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]');
  if (!tocLinks.length) return;

  const tocLinkBySlug = buildTocLinkBySlugMap(tocLinks);
  const headings = findHeadingsToObserve(tocLinkBySlug);
  if (!headings.length) return;

  const observer = new IntersectionObserver((entries) => handleIntersectionChanges(entries, tocLinkBySlug), {
    threshold: 0,
  });

  for (const heading of headings) observer.observe(heading);
};

document.addEventListener('astro:page-load', initTocObserver);
