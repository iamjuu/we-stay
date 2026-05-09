export type JourneyContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type JourneyBuildSelections = {
  goalId: string | null;
  timelineId: string | null;
  aduTypeId: string | null;
  buildPreferenceId: string | null;
};

export type JourneyConfiguratorSummary = {
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

export type JourneyDocument = {
  /** One Mongo document per property / eligibility run; primary key for upserts. */
  journeyId: string;
  /** Stable anonymous browser id (`westay-journey-user-id`); same person across journeys. */
  browserUserId: string;
  /** @deprecated Old rows used `userId` as the browser id. Prefer `browserUserId`. */
  userId?: string;
  /** After completing WIZARD_FLOW[i], set to i + 1 so user can open the next route. */
  maxNavIndex: number;
  eligibilitySnapshot?: unknown;
  contact?: JourneyContact | null;
  buildSelections?: JourneyBuildSelections | null;
  configuratorSummary?: JourneyConfiguratorSummary | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JourneyPatch = Partial<
  Pick<JourneyDocument, "maxNavIndex" | "eligibilitySnapshot" | "contact" | "buildSelections" | "configuratorSummary">
>;
