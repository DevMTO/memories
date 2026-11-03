import type { APIRoute } from 'astro';
import { robotsTxt } from '#kit/site/robots.ts';

export const GET: APIRoute = ({ site }) => robotsTxt(site);
