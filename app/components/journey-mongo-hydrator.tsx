"use client";

import { useEffect, useRef } from "react";
import { useBuildPath, type ConfiguratorSummary } from "@/app/context/build-path-session";
import { parseEligibilitySnapshotFromUnknown, useEligibilitySession } from "@/app/context/eligibility-session";
import { useJourneyProgress } from "@/app/context/journey-progress";
import { useReportContact } from "@/app/context/report-contact";
import type { JourneyBuildSelections, JourneyConfiguratorSummary, JourneyContact } from "@/lib/journey-types";

function parseConfiguratorSummary(raw: unknown): ConfiguratorSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<JourneyConfiguratorSummary>;
  if (typeof o.planId !== "string" || typeof o.sidingId !== "string") return null;
  return raw as ConfiguratorSummary;
}

function coerceBuildSelections(raw: unknown): {
  goalId: string | null;
  timelineId: string | null;
  aduTypeId: string | null;
  buildPreferenceId: string | null;
} | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<JourneyBuildSelections>;
  return {
    goalId: typeof s.goalId === "string" ? s.goalId : null,
    timelineId: typeof s.timelineId === "string" ? s.timelineId : null,
    aduTypeId: typeof s.aduTypeId === "string" ? s.aduTypeId : null,
    buildPreferenceId: typeof s.buildPreferenceId === "string" ? s.buildPreferenceId : null,
  };
}

/** One GET /api/journey per journeyId: sync eligibility, build path, and contact from Mongo after refresh. */
export function JourneyMongoHydrator() {
  const { hydrated: jpHydrated, journeyId, userId } = useJourneyProgress();
  const { hydrated: elHydrated, setSnapshot } = useEligibilitySession();
  const { hydrated: bpHydrated, hydrateFromMongo } = useBuildPath();
  const { hydrated: rcHydrated, setContact } = useReportContact();
  const appliedJourneyIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!journeyId || !userId) {
      appliedJourneyIdRef.current = null;
      return;
    }
    if (!jpHydrated || !elHydrated || !bpHydrated || !rcHydrated) return;
    if (appliedJourneyIdRef.current === journeyId) return;

    let cancelled = false;

    void (async () => {
      try {
        const r = await fetch(
          `/api/journey?journeyId=${encodeURIComponent(journeyId)}&browserUserId=${encodeURIComponent(userId)}`
        );
        if (!r.ok || cancelled) {
          if (!cancelled) appliedJourneyIdRef.current = journeyId;
          return;
        }
        const data = (await r.json()) as {
          error?: string;
          eligibilitySnapshot?: unknown;
          buildSelections?: unknown;
          configuratorSummary?: unknown;
          contact?: JourneyContact | null;
        };
        if (data.error || cancelled) return;

        const snap = parseEligibilitySnapshotFromUnknown(data.eligibilitySnapshot);
        if (snap) setSnapshot(snap);

        const selections = coerceBuildSelections(data.buildSelections);
        if (selections) {
          const cfg = parseConfiguratorSummary(data.configuratorSummary);
          hydrateFromMongo(selections, cfg);
        }

        const c = data.contact;
        if (
          c &&
          typeof c.firstName === "string" &&
          typeof c.lastName === "string" &&
          typeof c.email === "string" &&
          typeof c.phone === "string"
        ) {
          setContact({
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone,
            savedAt: Date.now(),
          });
        }

        if (!cancelled) appliedJourneyIdRef.current = journeyId;
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [jpHydrated, elHydrated, bpHydrated, rcHydrated, journeyId, userId, setSnapshot, hydrateFromMongo, setContact]);

  return null;
}
