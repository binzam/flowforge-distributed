export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectFromElement(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
}

/**
 * The part of an element that's actually on screen (its box intersected with
 * the viewport). Anchoring the tour card to this instead of the full box keeps
 * the card in view when the target is taller or wider than the viewport.
 * Falls back to the real box when the element is entirely off screen.
 */
export function visibleRectFromElement(el: Element): DOMRect {
  const r = el.getBoundingClientRect();
  const left = Math.max(r.left, 0);
  const top = Math.max(r.top, 0);
  const right = Math.min(r.right, document.documentElement.clientWidth);
  const bottom = Math.min(r.bottom, document.documentElement.clientHeight);
  if (right <= left || bottom <= top) return r;
  return new DOMRect(left, top, right - left, bottom - top);
}

/**
 * Polls for an element to appear in the DOM. Tour steps often flip a tab or
 * switch a view before the target exists, so a single querySelector isn't
 * reliable — this gives React a few render cycles to catch up.
 */
export function waitForElement(
  selector: string,
  {
    timeout = 2000,
    interval = 40,
  }: { timeout?: number; interval?: number } = {},
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        resolve(el);
        return;
      }
      if (performance.now() - start >= timeout) {
        resolve(null);
        return;
      }
      window.setTimeout(tick, interval);
    };
    tick();
  });
}

/**
 * Builds an SVG path (evenodd) that covers the full viewport with a rounded
 * rectangular hole cut out. Used as a `clip-path: path(...)` value so the
 * dark, blurred backdrop reveals the spotlighted element untouched.
 *
 * The command structure is identical between calls (same operators, only
 * coordinates differ), which lets the browser animate `clip-path`
 * transitions smoothly as the spotlight moves from step to step.
 */
export function buildSpotlightPath(
  viewportWidth: number,
  viewportHeight: number,
  rect: Rect,
  padding: number,
  radius: number,
): string {
  const x = clamp(rect.x - padding, 0, viewportWidth);
  const y = clamp(rect.y - padding, 0, viewportHeight);
  const w = Math.min(rect.width + padding * 2, viewportWidth - x);
  const h = Math.min(rect.height + padding * 2, viewportHeight - y);
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));

  const outer = `M0 0 H${viewportWidth} V${viewportHeight} H0 Z`;
  const inner = [
    `M${x + r} ${y}`,
    `H${x + w - r}`,
    `A${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V${y + h - r}`,
    `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
    `H${x + r}`,
    `A${r} ${r} 0 0 1 ${x} ${y + h - r}`,
    `V${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");

  return `path(evenodd, "${outer} ${inner}")`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
