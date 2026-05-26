// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx({
      optimize: true,
      gfm: true,
    }),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: false,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            class: 'anchor-link',
            ariaHidden: 'true',
            tabIndex: -1,
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
    ],
  },
  fonts: [
    {
      name: 'Host Grotesk',
      cssVariable: '--font-host-grotesk',
      provider: fontProviders.google(),
      display: 'swap',
      subsets: ['latin'],
      styles: ['normal'],
      weights: [300, 400, 600],
      formats: ['woff2'],
      unicodeRange: ['U+0000-00FF'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.google(),
      display: 'swap',
      subsets: ['latin'],
      styles: ['normal'],
      weights: [400, 500],
      formats: ['woff2'],
      unicodeRange: ['U+0000-00FF'],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
