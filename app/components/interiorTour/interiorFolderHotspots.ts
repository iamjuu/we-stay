import { INTERIOR_THEMES, type InteriorThemeId } from "./interiorThemes";

export type FolderHotspotDef = {
  /** Another panorama in the same theme folder (`panoramaPaths[toIndex]`). */
  toIndex: number;
  /** Room name taken from `InteriorTheme.roomNames[toIndex]` — shown on the hotspot marker. */
  label: string;
  azimuthDeg: number;
  elevationDeg: number;
};

type ManualEntry = { toIndex: number; azimuthDeg: number; elevationDeg: number };

/**
 * Calibrated hotspot angles per theme and source panorama index.
 * MANUAL_FOLDER_HOTSPOTS[themeId][panoIndex] = list of destinations with exact angles.
 * Add entries here after using /hotspot-calibrator to find precise positions.
 * Any panoIndex not listed falls back to auto-generated angles.
 */
const MANUAL_FOLDER_HOTSPOTS: Partial<Record<InteriorThemeId, Record<number, ManualEntry[]>>> = {
  lani: {
    // pano 0 — Living Room (Interior Lani 370.png)
    0: [
      { toIndex: 1, azimuthDeg:  -56.7, elevationDeg:  -4.3 }, // → Bedroom (371)
      { toIndex: 3, azimuthDeg:  -96.2, elevationDeg:  -5.2 }, // → Bathroom (373)
      { toIndex: 2, azimuthDeg: -156.9, elevationDeg:  -5.8 }, // → Hall (372)
    ],
    // pano 1 — Bedroom (Interior Lani 371.png)
    1: [
      { toIndex: 3, azimuthDeg: -146.2, elevationDeg:   0.9 }, // → Bathroom (373)
      { toIndex: 0, azimuthDeg:  115.2, elevationDeg:  -5.2 }, // → Living Room (370)
    ],
    // pano 2 — Hall (Interior Lani 372.png)
    2: [
      { toIndex: 1, azimuthDeg:  -82.2, elevationDeg:   0.3 }, // → Bedroom (371)
      { toIndex: 1, azimuthDeg:  103.7, elevationDeg:  -5   }, // → Bedroom (371)
    ],
    // pano 3 — Bathroom (Interior Lani 373.png)
    3: [
      { toIndex: 2, azimuthDeg:  103.6, elevationDeg: -12.8 }, // → Hall (372)
      { toIndex: 1, azimuthDeg:   82.8, elevationDeg: -11.8 }, // → Bedroom (371)
    ],
  },
  kai: {
    // pano 0 — Living Room (Interior Kai 374.png)
    0: [
      { toIndex: 1, azimuthDeg:  -59.7, elevationDeg:   3.5 }, // → Bedroom (375)
      { toIndex: 3, azimuthDeg:  -97.9, elevationDeg:   4.7 }, // → Bathroom (377)
      { toIndex: 2, azimuthDeg: -158.7, elevationDeg:   1.8 }, // → Hall (376)
    ],
    // pano 1 — Bedroom (Interior Kai 375.png)
    1: [
      { toIndex: 3, azimuthDeg: -142.2, elevationDeg:  -3.4 }, // → Bathroom (377)
      { toIndex: 0, azimuthDeg:  110.6, elevationDeg:   0.5 }, // → Living Room (374)
    ],
    // pano 2 — Hall (Interior Kai 376.png)
    2: [
      { toIndex: 1, azimuthDeg:  -80.6, elevationDeg:   5.3 }, // → Bedroom (375)
    ],
    // pano 3 — Bathroom (Interior Kai 377.png)
    3: [
      { toIndex: 0, azimuthDeg:  105.4, elevationDeg: -12.7 }, // → Living Room (374)
      { toIndex: 1, azimuthDeg:   79.9, elevationDeg:  -2.9 }, // → Bedroom (375)
    ],
  },
  anu: {
    // pano 0 — Living Room (Interior ANU 374.png)
    0: [
      { toIndex: 1, azimuthDeg:  -55.9, elevationDeg:  4.9 }, // → Bedroom (375)
      { toIndex: 3, azimuthDeg:  -99.3, elevationDeg:  8.2 }, // → Bathroom (377)
      { toIndex: 2, azimuthDeg: -158.2, elevationDeg:  5   }, // → Hall (376)
    ],
    // pano 1 — Bedroom (Interior ANU 375.png)
    1: [
      { toIndex: 0, azimuthDeg:  108.8, elevationDeg:  1.8 }, // → Living Room (374)
      { toIndex: 3, azimuthDeg: -143.5, elevationDeg: -4   }, // → Bathroom (377)
    ],
    // pano 2 — Hall (Interior ANU 376.png)
    2: [
      { toIndex: 1, azimuthDeg:   83.8, elevationDeg:  6   }, // → Bedroom (375)
    ],
    // pano 3 — Bathroom (Interior ANU 377.png)
    3: [
      { toIndex: 2, azimuthDeg:  102.2, elevationDeg: -8.2 }, // → Hall (376)
      { toIndex: 1, azimuthDeg:   81.3, elevationDeg: -2.7 }, // → Bedroom (375)
    ],
  },
  aina: {
    // pano 0 — Living Room (Interior Aina 378.png)
    0: [
      { toIndex: 2, azimuthDeg:  -91.6, elevationDeg:  9.3  }, // → Bathroom (381)
      { toIndex: 1, azimuthDeg:  -54.4, elevationDeg: 10.2  }, // → Bedroom (379)
      { toIndex: 3, azimuthDeg: -162.7, elevationDeg: 11.1  }, // → Hall (382)
    ],
    // pano 1 — Bedroom (Interior Aina 379.png)
    1: [
      { toIndex: 2, azimuthDeg: -142.8, elevationDeg: -0.3  }, // → Bathroom (381)
      { toIndex: 0, azimuthDeg:  109.1, elevationDeg:  0    }, // → Living Room (378)
    ],
    // pano 2 — Bathroom (Interior Aina 381.png)
    2: [
      { toIndex: 1, azimuthDeg:   84.2, elevationDeg: -4    }, // → Bedroom (379)
      { toIndex: 0, azimuthDeg:  106.3, elevationDeg: -5.7  }, // → Living Room (378)
    ],
    // pano 3 — Hall (Interior Aina 382 (1).png)
    3: [
      { toIndex: 1, azimuthDeg:  -80.5, elevationDeg:  3.5  }, // → Bedroom (379)
      { toIndex: 1, azimuthDeg:   76.3, elevationDeg: -4.4  }, // → Bedroom (379)
      { toIndex: 1, azimuthDeg:  102.7, elevationDeg: -5.7  }, // → Bedroom (379)
    ],
  },
};

/**
 * Initial camera direction when arriving at a panorama via a hotspot.
 * ARRIVAL_ANGLES[themeId][panoIndex] = [azimuthDeg, elevationDeg] the camera faces on entry.
 * Leave out a pano to keep the default forward-facing direction.
 */
export const ARRIVAL_ANGLES: Partial<Record<InteriorThemeId, Record<number, [number, number]>>> = {
  aina: {
    3: [-171.1, -6.3], // arriving at Hall (382)
  },
  anu: {
    2: [-174.1,  1.2], // arriving at Hall (376)
  },
  kai: {
    2: [-147.1, -7.5],  // arriving at Hall (376)
  },
  lani: {
    2: [-165.6, -0.5],  // arriving at Hall (372)
  },
};

/** Fallback angles when a pano has not been manually calibrated yet. */
const BASE_ANGLES: [number, number][] = [
  [38,  -5],
  [125, -4],
  [-88, -6],
];

/**
 * Returns hotspots from the current panorama to every other image in the same theme folder.
 * Uses manually calibrated angles when available, auto-generated angles otherwise.
 */
export function getFolderHotspotsForPano(
  themeId: InteriorThemeId,
  panoIndex: number
): FolderHotspotDef[] {
  const theme = INTERIOR_THEMES.find((t) => t.id === themeId);
  const paths = theme?.panoramaPaths;
  const n = paths?.length ?? 0;
  if (n <= 1) return [];

  const themeManual = MANUAL_FOLDER_HOTSPOTS[themeId];
  const manual = themeManual?.[panoIndex];

  // If this theme has ANY manual entries, only use manual data.
  // Panos not yet calibrated get no hotspots (no auto-generated guesses).
  if (themeManual) {
    if (!manual) return [];
    return manual.map((entry) => ({
      toIndex: entry.toIndex,
      label: theme?.roomNames[entry.toIndex] ?? `Room ${entry.toIndex + 1}`,
      azimuthDeg: entry.azimuthDeg,
      elevationDeg: entry.elevationDeg,
    }));
  }

  // Auto-generate only for themes with no manual calibration at all.
  const targets: number[] = [];
  for (let j = 0; j < n; j++) {
    if (j !== panoIndex) targets.push(j);
  }

  return targets.map((toIndex, i) => {
    const [az0, el0] = BASE_ANGLES[i % BASE_ANGLES.length];
    const skew = panoIndex * 19 + toIndex * 11;
    return {
      toIndex,
      label: theme?.roomNames[toIndex] ?? `Room ${toIndex + 1}`,
      azimuthDeg: az0 + skew,
      elevationDeg: el0,
    };
  });
}
