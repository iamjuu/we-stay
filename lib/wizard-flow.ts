/** Ordered wizard routes after eligibility (step-4 is skipped in UX). */
export const WIZARD_FLOW = [
  "/steps/step-1",
  "/steps/step-2",
  "/steps/step-3",
  "/steps/step-5",
  "/steps/step-6",
  "/3dpage",
] as const;

export type WizardFlowIndex = 0 | 1 | 2 | 3 | 4 | 5;

export function normalizePath(pathname: string): string {
  const p = pathname.replace(/\/$/, "");
  return p === "" ? "/" : p;
}

/** Map URL path to index in WIZARD_FLOW, or null if not a wizard step. */
export function flowIndexFromPath(pathname: string): number | null {
  const p = normalizePath(pathname);
  for (let i = 0; i < WIZARD_FLOW.length; i++) {
    const route = WIZARD_FLOW[i];
    if (p === route || p.startsWith(`${route}/`)) return i;
  }
  return null;
}

export function prevWizardPath(flowIndex: number): string {
  if (flowIndex <= 0) return "/";
  return WIZARD_FLOW[flowIndex - 1] as string;
}

export function nextWizardPath(flowIndex: number): string | null {
  if (flowIndex < 0 || flowIndex >= WIZARD_FLOW.length - 1) return null;
  return WIZARD_FLOW[flowIndex + 1] as string;
}
