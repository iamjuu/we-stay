import { INTERIOR_THEMES, type InteriorThemeId } from "./interiorThemes";

export type FolderHotspotDef = {
  /** Another panorama in the same theme folder (`panoramaPaths[toIndex]`). */
  toIndex: number;
  azimuthDeg: number;
  elevationDeg: number;
};

/** Starting directions for up to three “other” panos — repeat if a folder grows beyond four. */
const BASE_ANGLES: [number, number][] = [
  [38, -5],
  [125, -4],
  [-88, -6],
];

/**
 * Hotspots from the current panorama to every other image in the same theme folder only.
 * Convention matches `tourHotspots.ts`. Angles skew slightly per pano so markers don’t overlap
 * in the HUD; tune per asset if needed.
 */
export function getFolderHotspotsForPano(
  themeId: InteriorThemeId,
  panoIndex: number
): FolderHotspotDef[] {
  const paths = INTERIOR_THEMES.find((t) => t.id === themeId)?.panoramaPaths;
  const n = paths?.length ?? 0;
  if (n <= 1) return [];

  const targets: number[] = [];
  for (let j = 0; j < n; j++) {
    if (j !== panoIndex) targets.push(j);
  }

  return targets.map((toIndex, i) => {
    const [az0, el0] = BASE_ANGLES[i % BASE_ANGLES.length];
    const skew = panoIndex * 19 + toIndex * 11;
    return {
      toIndex,
      azimuthDeg: az0 + skew,
      elevationDeg: el0,
    };
  });
}
