export function humanize(segment: string): string {
  const stripped = segment.replace(/^\d+-/, '').replace(/[-_]/g, ' ');
  return stripped.replace(/\b\w/g, (c) => c.toUpperCase());
}

function slug(segment: string): string {
  return segment.replace(/^\d+-/, '');
}

export const CATEGORY_FILTERS: Record<string, string> = {
  'getting-started': 'Primeros pasos',
  components: 'Componentes',
  button: 'Botón',
  input: 'Entrada',
};

export function getCategoryLabels(segments: string[]): {
  category: string | null;
  subcategory: string | null;
  section: string;
} {
  const category = segments[0] ? CATEGORY_FILTERS[slug(segments[0])] ?? null : null;
  const subcategory = segments[1] ? CATEGORY_FILTERS[slug(segments[1])] ?? null : null;
  const section = category
    ? subcategory
      ? `${category} › ${subcategory}`
      : category
    : '';
  return { category, subcategory, section };
}
