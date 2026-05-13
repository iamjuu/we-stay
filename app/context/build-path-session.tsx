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

const STORAGE_KEY = 'westay-build-path-session';

/** Choices captured after eligibility — wizard steps 3→6 */
export type BuildPathSelections = {
  goalId: string | null;
  timelineId: string | null;
  aduTypeId: string | null;
  buildPreferenceId: string | null;
};

/** Persisted after Finish on `/3dpage` */
export type ConfiguratorSummary = {
  planId: string;
  sidingId: string;
  claddingId: string;
  roofStyle: string;
  interiorId: string;
  fundingId: string;
  features: { deck: boolean; lanai: boolean; shower: boolean };
  upgrades: Record<string, boolean>;
  chipLabels: string[];
};

export type BuildPathSnapshot = BuildPathSelections & {
  configuratorSummary: ConfiguratorSummary | null;
  updatedAt: number;
};

const emptySelections = (): BuildPathSelections => ({
  goalId: null,
  timelineId: null,
  aduTypeId: null,
  buildPreferenceId: null,
});

function coerceSelections(raw: Partial<BuildPathSelections> | undefined): BuildPathSelections {
  const s = raw ?? {};
  return {
    goalId: typeof s.goalId === 'string' ? s.goalId : null,
    timelineId: typeof s.timelineId === 'string' ? s.timelineId : null,
    aduTypeId: typeof s.aduTypeId === 'string' ? s.aduTypeId : null,
    buildPreferenceId: typeof s.buildPreferenceId === 'string' ? s.buildPreferenceId : null,
  };
}

function loadStored(): BuildPathSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      selections?: Partial<BuildPathSelections>;
      configuratorSummary?: ConfiguratorSummary | null;
      updatedAt?: number;
    };
    const selections = coerceSelections(parsed.selections);
    const cfg = parsed.configuratorSummary;
    const configuratorSummary =
      cfg !== null && cfg !== undefined && typeof cfg === 'object' ? cfg : null;
    return {
      ...selections,
      configuratorSummary,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

type BuildPathContextValue = {
  hydrated: boolean;
  selections: BuildPathSelections;
  configuratorSummary: ConfiguratorSummary | null;
  setSelections: (next: Partial<BuildPathSelections>) => void;
  setConfiguratorSummary: (next: ConfiguratorSummary | null) => void;
  /** Replace wizard selections + optional summary from Mongo (resume after refresh). */
  hydrateFromMongo: (selections: BuildPathSelections, summary: ConfiguratorSummary | null) => void;
  clearBuildPath: () => void;
};

const BuildPathContext = createContext<BuildPathContextValue | null>(null);

export function BuildPathProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [selections, setSelectionsState] = useState<BuildPathSelections>(emptySelections);
  const [configuratorSummary, setConfiguratorSummaryState] = useState<ConfiguratorSummary | null>(null);

  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setSelectionsState({
        goalId: stored.goalId,
        timelineId: stored.timelineId,
        aduTypeId: stored.aduTypeId,
        buildPreferenceId: stored.buildPreferenceId,
      });
      setConfiguratorSummaryState(stored.configuratorSummary ?? null);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onClear = () => {
      setSelectionsState(emptySelections());
      setConfiguratorSummaryState(null);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('westay-clear-build-path', onClear);
    return () => window.removeEventListener('westay-clear-build-path', onClear);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          selections,
          configuratorSummary,
          updatedAt: Date.now(),
        })
      );
    } catch {
      /* ignore */
    }
  }, [hydrated, selections, configuratorSummary]);

  const setSelections = useCallback((next: Partial<BuildPathSelections>) => {
    setSelectionsState(prev => ({ ...prev, ...next }));
  }, []);

  const setConfiguratorSummary = useCallback((next: ConfiguratorSummary | null) => {
    setConfiguratorSummaryState(next);
  }, []);

  const hydrateFromMongo = useCallback((nextSelections: BuildPathSelections, summary: ConfiguratorSummary | null) => {
    setSelectionsState(coerceSelections(nextSelections));
    setConfiguratorSummaryState(summary);
  }, []);

  const clearBuildPath = useCallback(() => {
    setSelectionsState(emptySelections());
    setConfiguratorSummaryState(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      selections,
      configuratorSummary,
      setSelections,
      setConfiguratorSummary,
      hydrateFromMongo,
      clearBuildPath,
    }),
    [hydrated, selections, configuratorSummary, setSelections, setConfiguratorSummary, hydrateFromMongo, clearBuildPath]
  );

  return <BuildPathContext.Provider value={value}>{children}</BuildPathContext.Provider>;
}

export function useBuildPath(): BuildPathContextValue {
  const ctx = useContext(BuildPathContext);
  if (!ctx) throw new Error('useBuildPath must be used within BuildPathProvider');
  return ctx;
}
