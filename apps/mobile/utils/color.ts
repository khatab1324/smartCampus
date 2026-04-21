export function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const safeAlpha = Math.max(0, Math.min(1, alpha));

  if (normalized.length !== 6) {
    return hex;
  }

  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
}
