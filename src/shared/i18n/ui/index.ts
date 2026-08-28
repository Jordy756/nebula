import { blog } from './blog.ts';
import { docs } from './docs.ts';
import { home } from './home.ts';
import { nav } from './nav.ts';
import { notFound } from './notFound.ts';
import { shared } from './shared.ts';

export const ui = {
  en: { ...nav.en, ...shared.en, ...docs.en, ...blog.en, ...home.en, ...notFound.en },
  es: { ...nav.es, ...shared.es, ...docs.es, ...blog.es, ...home.es, ...notFound.es },
} as const;
