export type Placement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export function placeCow(anchorX: number, anchorY: number, aspectRatio: number): Placement {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const safeRatio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1;

  const margin = clamp(Math.min(viewportWidth, viewportHeight) * 0.04, 14, 34);
  const topInset = clamp(viewportHeight * 0.08, 44, 78);
  const maxWidth = Math.max(viewportWidth - margin * 2, 1);
  const maxHeight = Math.max(viewportHeight - topInset - margin, 1);

  const preferredWidth = Math.min(viewportWidth * 0.62, viewportHeight * 0.56, 620);
  const width = clamp(
    Math.min(preferredWidth, maxWidth, maxHeight * safeRatio),
    1,
    maxWidth,
  );
  const height = Math.min(width / safeRatio, maxHeight);

  const maxX = Math.max(viewportWidth - width - margin, margin);
  const maxY = Math.max(viewportHeight - height - margin, topInset);

  return {
    x: clamp(anchorX - width / 2, margin, maxX),
    y: clamp(anchorY - height / 2, topInset, maxY),
    width,
    height,
  };
}
