/** GLB per “Choose Your Starting Plan” (sqft family in `public/3dmodels/`). */
export const PLAN_MODEL_URL = {
  studio: "/3dmodels/400Sqft.glb",
  "one-bedroom": "/3dmodels/600Sqft.glb",
  "two-bedroom": "/3dmodels/660Sqft.glb",
  "two-office": "/3dmodels/800Sqft.glb",
} as const;

export type PlanId = keyof typeof PLAN_MODEL_URL;
