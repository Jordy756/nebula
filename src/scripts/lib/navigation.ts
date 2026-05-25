import { getCollection } from 'astro:content';

export interface NavItem {
  title: string;
  slug: string;
  href: string;
  order?: number;
}

export interface NavGroup {
  title: string;
  items: (NavItem | NavGroup)[];
  order?: number;
}

/**
 * Convierte un nombre de carpeta o archivo ('mi-carpeta' o 'mi-archivo')
 * en un título legible ('Mi Carpeta' o 'Mi Archivo').
 */
function formatTitle(text: string): string {
  return text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Lee la colección de docs y genera un árbol jerárquico infinito
 * basado en la estructura de carpetas (entry.id).
 */
export async function getSidebarNavigation(): Promise<(NavItem | NavGroup)[]> {
  const docs = await getCollection('docs');

  const tree: (NavItem | NavGroup)[] = [];

  for (const doc of docs) {
    // doc.id es la ruta completa, ej: "avanzado/configuracion/base" o "introduccion"
    const parts = doc.id.split('/');
    let currentLevel = tree;

    // Recorrer todas las partes excepto la última (que es el archivo)
    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      // Buscar si la carpeta ya existe en el nivel actual
      let existingFolder = currentLevel.find(
        (item): item is NavGroup =>
          'items' in item && item.title.toLowerCase() === folderName.replace(/-/g, ' ').toLowerCase(),
      );

      if (!existingFolder) {
        existingFolder = {
          title: formatTitle(folderName),
          items: [],
        };
        currentLevel.push(existingFolder);
      }
      currentLevel = existingFolder.items;
    }

    // El último elemento es el archivo real
    const fileName = parts[parts.length - 1];

    // Si el frontmatter tiene un 'title', lo usamos, si no formateamos el nombre del archivo
    const title = doc.data.title || formatTitle(fileName);

    currentLevel.push({
      title,
      slug: doc.id,
      href: `/docs/${doc.id}`,
    });
  }

  return tree;
}
