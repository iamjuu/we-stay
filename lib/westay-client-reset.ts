/**
 * Clears all westay client keys after a successful `/3dpage` finish.
 * Mongo already holds the full journey; the next visit starts with a new journeyId.
 */

const LOCAL_KEYS = [
  "westay-journey-user-id",
  "westay-active-journey-id",
  "westay-journey-address",
] as const;

const SESSION_KEYS = [
  "westay-eligibility-snapshot",
  "westay-build-path-session",
  "westay-report-contact",
] as const;

export function clearWestayClientStorage(): void {
  if (typeof window === "undefined") return;
  try {
    for (const k of LOCAL_KEYS) localStorage.removeItem(k);
    for (const k of SESSION_KEYS) sessionStorage.removeItem(k);
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(new Event("westay-clear-build-path"));
  } catch {
    /* ignore */
  }
}
