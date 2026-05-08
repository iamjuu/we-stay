/**
 * Hawaiian-direction interior 360 assets under /public/imageinterior/
 * Use encodeURI(...) when passing paths to Three loaders (spaces in folder names).
 */
export type InteriorThemeId = "aina" | "anu" | "kai" | "lani";

export type InteriorTheme = {
  id: InteriorThemeId;
  label: string;
  /**
   * All equirect images for this style (one folder). Order = stable tour order;
   * indices match “Tap here” targets within the same theme only.
   */
  panoramaPaths: string[];
};

export const INTERIOR_THEMES: InteriorTheme[] = [
  {
    id: "aina",
    label: "aina",
    panoramaPaths: [
      "/imageinterior/Interior Aina 360/Interior Aina 378.png",
      "/imageinterior/Interior Aina 360/Interior Aina 379.png",
      "/imageinterior/Interior Aina 360/Interior Aina 381.png",
      "/imageinterior/Interior Aina 360/Interior Aina 382 (1).png",
    ],
  },
  {
    id: "anu",
    label: "anu",
    panoramaPaths: [
      "/imageinterior/Interior ANU 360/Interior ANU 366.png",
      "/imageinterior/Interior ANU 360/Interior ANU 367.png",
      "/imageinterior/Interior ANU 360/Interior ANU 368.png",
      "/imageinterior/Interior ANU 360/Interior ANU 369.png",
    ],
  },
  {
    id: "kai",
    label: "kai",
    panoramaPaths: [
      "/imageinterior/Interior Kai 360/Interior Kai 374.png",
      "/imageinterior/Interior Kai 360/Interior Kai 375.png",
      "/imageinterior/Interior Kai 360/Interior Kai 376.png",
      "/imageinterior/Interior Kai 360/Interior Kai 377.png",
    ],
  },
  {
    id: "lani",
    label: "lani",
    panoramaPaths: [
      "/imageinterior/Interior Lani 360/Interior Lani 370.png",
      "/imageinterior/Interior Lani 360/Interior Lani 371.png",
      "/imageinterior/Interior Lani 360/Interior Lani 372.png",
      "/imageinterior/Interior Lani 360/Interior Lani 373.png",
    ],
  },
];
