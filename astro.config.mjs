// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      provider: fontProviders.google(),
      display: 'swap',
      subsets: ['latin'],
      styles: ['normal'],
      weights: [300],
      formats: ['woff2'],
      unicodeRange: ['U+0000-00FF'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Space Mono',
      cssVariable: '--font-space-mono',
      provider: fontProviders.google(),
      display: 'swap',
      subsets: ['latin'],
      styles: ['normal'],
      weights: [400, 700],
      formats: ['woff2'],
      unicodeRange: ['U+0000-00FF'],
      fallbacks: ['monospace'],
    },
  ],
});
