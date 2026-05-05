'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FullEligibilityResult } from '@/lib/eligibility-gates';
import type { EligibilityRentalPayload } from '@/lib/eligibility-pipeline';

const STORAGE_KEY = 'westay-eligibility-snapshot';

export type EligibilitySnapshot = {
  address: string;
  eligibilityResult: FullEligibilityResult;
  rentalData: EligibilityRentalPayload | null;
  computedAt: number;
};

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

  useEffect(() => {
    setSnapshotState(loadStoredSnapshot());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (snapshot) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* quota / private mode */
    }
  }, [snapshot]);

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
