'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FullEligibilityResult } from '@/lib/eligibility-gates';
import type { EligibilityRentalPayload } from '@/lib/eligibility-pipeline';

const STORAGE_KEY = 'westay-eligibility-snapshot';

export type EligibilitySnapshot = {
  address: string;
  /** Trimmed hero input used for this run — match before re-fetching formatted `address`. */
  submittedAddress?: string;
  eligibilityResult: FullEligibilityResult;
  rentalData: EligibilityRentalPayload | null;
  computedAt: number;
};

/** True when trimmed input equals the cached query (preferred) or legacy formatted-only snapshot. */
export function eligibilityInputMatchesSnapshot(
  trimmedInput: string,
  snapshot: EligibilitySnapshot | null
): boolean {
  if (!snapshot?.address) return false;
  const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
  const query = norm(trimmedInput);
  const baseline =
    snapshot.submittedAddress != null && snapshot.submittedAddress.trim() !== ''
      ? snapshot.submittedAddress
      : snapshot.address;
  return query === norm(baseline);
}

type EligibilitySessionContextValue = {
  snapshot: EligibilitySnapshot | null;
  /** False until sessionStorage has been read on the client */
  hydrated: boolean;
  setSnapshot: (next: EligibilitySnapshot | null) => void;
  clearSnapshot: () => void;
};

const EligibilitySessionContext = createContext<EligibilitySessionContextValue | null>(null);

function loadStoredSnapshot(): EligibilitySnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EligibilitySnapshot;
    if (
      parsed &&
      typeof parsed.address === 'string' &&
      parsed.eligibilityResult &&
      typeof parsed.computedAt === 'number'
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function EligibilitySessionProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshotState] = useState<EligibilitySnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setSnapshotState(loadStoredSnapshot());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hydrated) return;
    try {
      if (snapshot) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* quota / private mode */
    }
  }, [snapshot, hydrated]);

  const setSnapshot = useCallback((next: EligibilitySnapshot | null) => {
    setSnapshotState(next);
  }, []);

  const clearSnapshot = useCallback(() => {
    setSnapshotState(null);
  }, []);

  const value = useMemo(
    () => ({
      snapshot,
      hydrated,
      setSnapshot,
      clearSnapshot,
    }),
    [snapshot, hydrated, setSnapshot, clearSnapshot]
  );

  return (
    <EligibilitySessionContext.Provider value={value}>{children}</EligibilitySessionContext.Provider>
  );
}

export function useEligibilitySession(): EligibilitySessionContextValue {
  const ctx = useContext(EligibilitySessionContext);
  if (!ctx) {
    throw new Error('useEligibilitySession must be used within EligibilitySessionProvider');
  }
  return ctx;
}
