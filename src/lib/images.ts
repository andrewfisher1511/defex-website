/**
 * Static image registry for astro:assets. Content files reference images by
 * string key (e.g. image: 'project-1', screenshot: 'defex-command-board');
 * these maps resolve those keys to imported ImageMetadata so sharp can process
 * them at build time. All imports are local — no remote sources.
 */
import type { ImageMetadata } from 'astro';

import heroArchitecture from '../assets/hero-architecture.jpg';
import project1 from '../assets/project-1.jpg';
import project2 from '../assets/project-2.jpg';
import project3 from '../assets/project-3.jpg';

import commandBoard from '../assets/screenshots/defex-command-board.png';
import timesheets from '../assets/screenshots/defex-timesheets.png';
import captureSettings from '../assets/screenshots/defex-capture-settings.png';

export const projectImages: Record<string, ImageMetadata> = {
  'project-1': project1,
  'project-2': project2,
  'project-3': project3,
  hero: heroArchitecture,
};

export const heroImage = heroArchitecture;

export const screenshots: Record<string, ImageMetadata> = {
  'defex-command-board': commandBoard,
  'defex-timesheets': timesheets,
  'defex-capture-settings': captureSettings,
};

export function getProjectImage(key: string): ImageMetadata {
  const img = projectImages[key];
  if (!img) throw new Error(`Unknown project image key: ${key}`);
  return img;
}

export function getScreenshot(key: string): ImageMetadata {
  const img = screenshots[key];
  if (!img) throw new Error(`Unknown screenshot key: ${key}`);
  return img;
}
