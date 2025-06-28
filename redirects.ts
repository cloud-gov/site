// src/redirects.ts
import type { RedirectConfig } from 'astro';

export const redirects: Record<string, RedirectConfig> = {
  // TODO: Add redirects for removed pages
  // '/old': '/new',
  // '/blog/[...slug]': '/articles/[...slug]',
  // '/about': 'https://example.com/about',
  // '/news': {
  //   status: 302, // Specify exact status code
  //   destination: 'https://example.com/news'
  // },
}
export default redirects;