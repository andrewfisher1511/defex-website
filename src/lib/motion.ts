export const EASE_ENTRANCE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
