"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { WIZARD_FLOW } from "@/lib/wizard-flow";
import type { JourneyBuildSelections, JourneyConfiguratorSummary, JourneyContact } from "@/lib/journey-types";

const STORAGE_USER_ID = "westay-journey-user-id";
const STORAGE_JOURNEY_ID = "westay-active-journey-id";
const STORAGE_JOURNEY_ADDRESS = "westay-journey-address";

function normalizeAddressKey(address: string): string {
  return address.trim().replace(/\s+/g, " ").toLowerCase();
}

type JourneyProgressContextValue = {
  /** Stable anonymous browser id (localStorage). */
  userId: string | null;
  /** Active property/journey document id (localStorage). Null until first persisted id. */
  journeyId: string | null;
  hydrated: boolean;
  maxNavIndex: number;
  refresh: () => Promise<void>;
  /** After completing the step at this flow index (0 = step-1, …). */
  recordFlowComplete: (completedFlowIndex: number, patch?: Record<string, unknown>) => Promise<void>;
  /** Save data without advancing (e.g. eligibility). Returns false if API unavailable. */
  mergeJourney: (patch: Record<string, unknown>) => Promise<boolean>;
  /**
   * Call after a successful eligibility run for `address`.
   * New normalized address vs last stored → new journey id and cleared build-path session.
   */
  syncJourneyForPropertyAddress: (address: string) => void;
  /** Ensures localStorage + state have a journey id (e.g. deep-linked configurator). */
  ensureActiveJourneyId: () => string;
};

const JourneyProgressContext = createContext<JourneyProgressContextValue | null>(null);

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE_USER_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_USER_ID, id);
  }
  return id;
}

function getOrCreateJourneyIdFromStorage(): string {
  let id = localStorage.getItem(STORAGE_JOURNEY_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_JOURNEY_ID, id);
  }
  return id;
}

function clearBuildPathSessionAndNotify(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem("westay-build-path-session");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("westay-clear-build-path"));
}

export function JourneyProgressProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [maxNavIndex, setMaxNavIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const load = useCallback(async (jid: string, browserUserId: string) => {
    try {
      const r = await fetch(
        `/api/journey?journeyId=${encodeURIComponent(jid)}&browserUserId=${encodeURIComponent(browserUserId)}`
      );
      if (!r.ok) return;
      const data = (await r.json()) as { maxNavIndex?: number };
      if (typeof data.maxNavIndex === "number") setMaxNavIndex(data.maxNavIndex);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const bid = getOrCreateUserId();
    setUserId(bid);
    const jid = localStorage.getItem(STORAGE_JOURNEY_ID);
    if (jid) {
      setJourneyId(jid);
      void load(jid, bid).finally(() => setHydrated(true));
    } else {
      setHydrated(true);
    }
  }, [load]);

  const refresh = useCallback(async () => {
    const bid = userId ?? getOrCreateUserId();
    const jid = journeyId ?? localStorage.getItem(STORAGE_JOURNEY_ID);
    if (!jid) return;
    await load(jid, bid);
  }, [userId, journeyId, load]);

  const ensureActiveJourneyId = useCallback(() => {
    const bid = userId ?? getOrCreateUserId();
    if (!userId) setUserId(bid);
    const jid = journeyId ?? localStorage.getItem(STORAGE_JOURNEY_ID) ?? getOrCreateJourneyIdFromStorage();
    if (!journeyId) setJourneyId(jid);
    return jid;
  }, [userId, journeyId]);

  const syncJourneyForPropertyAddress = useCallback((address: string) => {
    const key = normalizeAddressKey(address);
    const prevRaw = localStorage.getItem(STORAGE_JOURNEY_ADDRESS) ?? "";
    const prevKey = normalizeAddressKey(prevRaw);

    if (prevRaw.length > 0 && prevKey === key) {
      const jid = localStorage.getItem(STORAGE_JOURNEY_ID);
      if (jid) setJourneyId(jid);
      return;
    }

    if (prevRaw.length > 0 && prevKey !== key) {
      const newId = crypto.randomUUID();
      localStorage.setItem(STORAGE_JOURNEY_ID, newId);
      localStorage.setItem(STORAGE_JOURNEY_ADDRESS, address.trim());
      setJourneyId(newId);
      setMaxNavIndex(0);
      clearBuildPathSessionAndNotify();
      const bid = getOrCreateUserId();
      void load(newId, bid);
      return;
    }

    let jid = localStorage.getItem(STORAGE_JOURNEY_ID);
    if (!jid) {
      jid = crypto.randomUUID();
      localStorage.setItem(STORAGE_JOURNEY_ID, jid);
    }
    localStorage.setItem(STORAGE_JOURNEY_ADDRESS, address.trim());
    setJourneyId(jid);
    const bid = getOrCreateUserId();
    void load(jid, bid);
  }, [load]);

  const mergeJourney = useCallback(
    async (patch: Record<string, unknown>): Promise<boolean> => {
      const bid = userId ?? getOrCreateUserId();
      if (!userId) setUserId(bid);
      const jid = journeyId ?? localStorage.getItem(STORAGE_JOURNEY_ID) ?? getOrCreateJourneyIdFromStorage();
      if (!journeyId) setJourneyId(jid);
      try {
        const r = await fetch("/api/journey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ journeyId: jid, browserUserId: bid, ...patch }),
        });
        if (!r.ok) return false;
        await load(jid, bid);
        return true;
      } catch {
        return false;
      }
    },
    [userId, journeyId, load]
  );

  const recordFlowComplete = useCallback(
    async (completedFlowIndex: number, patch?: Record<string, unknown>) => {
      const next = completedFlowIndex + 1;
      const ok = await mergeJourney({ maxNavIndex: next, ...patch });
      if (!ok) setMaxNavIndex((m) => Math.max(m, next));
    },
    [mergeJourney]
  );

  const value = useMemo(
    () => ({
      userId,
      journeyId,
      hydrated,
      maxNavIndex,
      refresh,
      recordFlowComplete,
      mergeJourney,
      syncJourneyForPropertyAddress,
      ensureActiveJourneyId,
    }),
    [
      userId,
      journeyId,
      hydrated,
      maxNavIndex,
      refresh,
      recordFlowComplete,
      mergeJourney,
      syncJourneyForPropertyAddress,
      ensureActiveJourneyId,
    ]
  );

  return <JourneyProgressContext.Provider value={value}>{children}</JourneyProgressContext.Provider>;
}

export function useJourneyProgress(): JourneyProgressContextValue {
  const ctx = useContext(JourneyProgressContext);
  if (!ctx) throw new Error("useJourneyProgress must be used within JourneyProgressProvider");
  return ctx;
}

/** Stable anonymous id for journey API (localStorage). */
export function ensureJourneyUserId(): string {
  return getOrCreateUserId();
}

export function useWizardRouteGuard(flowIndex: number) {
  const router = useRouter();
  const { hydrated, maxNavIndex } = useJourneyProgress();

  useEffect(() => {
    if (!hydrated) return;
    if (flowIndex > maxNavIndex) {
      const safe = Math.min(Math.max(0, maxNavIndex), WIZARD_FLOW.length - 1);
      router.replace(WIZARD_FLOW[safe] as string);
    }
  }, [hydrated, flowIndex, maxNavIndex, router]);
}

export type { JourneyContact, JourneyBuildSelections, JourneyConfiguratorSummary };
