"use client";

import { ConfiguratorCanvas } from "@/app/components/aduConfigurator/ConfiguratorCanvas";
import { type PlanId, PLAN_MODEL_URL } from "@/app/components/aduConfigurator/planModelUrls";
import { type SidingId } from "@/app/components/aduConfigurator/ConfiguratorModel";
import { Home, Layers, Maximize2, User } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useBuildPath } from "@/app/context/build-path-session";
import kaiInterior from "@/content/interior/kai interior.png";
import ainaInterior from "@/content/interior/aina interior.png";
import laniInterior from "@/content/interior/lani interior.png";
import anuInterior from "@/content/interior/Anu interior.png";

type RoofStyle = "asphalt" | "metal";

type OptionalFeatures = {
  deck: boolean;
  lanai: boolean;
  shower: boolean;
};

/** Teal accent aligned with layout reference */
const ACCENT = "#5fb3b3";
const PANEL_BG = "#f7f9f8";
const CARD_BORDER = "#e8ebea";

const PLANS: {
  id: PlanId;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    id: "studio",
    title: "Studio",
    description: "Compact, efficient, and ideal for flexible uses.",
    icon: <Home className="h-5 w-5" strokeWidth={1.65} aria-hidden />,
  },
  {
    id: "one-bedroom",
    title: "One Bedroom",
    description: "Balanced layout with separation and comfort.",
    icon: <User className="h-5 w-5" strokeWidth={1.65} aria-hidden />,
  },
  {
    id: "two-bedroom",
    title: "Two Bedroom",
    description: "A practical plan for family or guests.",
    icon: <Layers className="h-5 w-5" strokeWidth={1.65} aria-hidden />,
  },
  {
    id: "two-office",
    title: "Two Bedroom with Office",
    description: "More room for custom living and add-ons.",
    icon: <Maximize2 className="h-5 w-5" strokeWidth={1.65} aria-hidden />,
  },
];

const SIDING_OPTIONS: { id: SidingId; title: string; sub: string }[] = [
  { id: "default-stucco", title: "Default stucco", sub: "Cladding material" },
  { id: "board-batten", title: "Board & Batten", sub: "Cladding material" },
  { id: "vertical-tg", title: "Vertical T&G", sub: "Cladding material" },
  { id: "horizontal-lap", title: "Horizontal lap", sub: "Cladding material" },
];

type CladdingId =
  | "original"
  | "coastal"
  | "soft-sage"
  | "stormwood"
  | "brushed-sandstorm"
  | "deep-umber";

const CLADDING: {
  id: CladdingId;
  tint: string | null;
  swatchBg: string;
  label: string;
  description: string;
}[] = [
  {
    id: "original",
    tint: null,
    swatchBg: "#ffffff",
    label: "Imported (GLB)",
    description: "No cladding override — textures and colors straight from your model file.",
  },
  {
    id: "coastal",
    tint: "#EDE7E1",
    swatchBg: "#EDE7E1",
    label: "Coastal milky white",
    description: "A warm, soft white with a hint of cream.",
  },
  {
    id: "soft-sage",
    tint: "#CBC7B5",
    swatchBg: "#CBC7B5",
    label: "Soft sage",
    description: "Muted sage-grey that sits quietly on the exterior.",
  },
  {
    id: "stormwood",
    tint: "#A28D71",
    swatchBg: "#A28D71",
    label: "Stormwood drift",
    description: "Weathered wood tone with depth and warmth.",
  },
  {
    id: "brushed-sandstorm",
    tint: "#D9CBBB",
    swatchBg: "#D9CBBB",
    label: "Brushed sandstorm",
    description: "Light sand with a brushed, natural feel.",
  },
  {
    id: "deep-umber",
    tint: "#423E38",
    swatchBg: "#423E38",
    label: "Deep umber",
    description: "Rich dark brown-grey for strong contrast and curb appeal.",
  },
];

type UpgradesPick = {
  solar: boolean;
  premiumAppliances: boolean;
  ac: boolean;
  smartHome: boolean;
  evCharging: boolean;
};

type FundingId = "cash" | "financing" | "exploring";

type InteriorId = "kai" | "aina" | "lani" | "anu";

const FEATURE_LABELS: { key: keyof OptionalFeatures; label: string }[] = [
  { key: "deck", label: "Deck" },
  { key: "lanai", label: "Covered Lanai" },
  { key: "shower", label: "Outdoor Shower" },
];

const UPGRADE_DEFS: { key: keyof UpgradesPick; title: string; sub: string }[] = [
  { key: "solar", title: "Solar", sub: "Energy-minded roof package" },
  {
    key: "premiumAppliances",
    title: "Premium Appliances",
    sub: "Elevated daily use",
  },
  { key: "ac", title: "AC", sub: "Comfort-first climate control" },
  { key: "smartHome", title: "Smart Home", sub: "Quiet automation features" },
  { key: "evCharging", title: "EV Charging", sub: "Future-ready garage power" },
];

const FUNDING_OPTS: {
  id: FundingId;
  title: string;
  sub: string;
  snapshotBuildPath: string;
}[] = [
  {
    id: "cash",
    title: "Cash",
    sub: "Funding path",
    snapshotBuildPath: "Straightforward build path with phased advisor check-ins.",
  },
  {
    id: "financing",
    title: "Need Financing",
    sub: "Funding path",
    snapshotBuildPath: "Financing introductions and lender-aligned milestones.",
  },
  {
    id: "exploring",
    title: "Exploring Options",
    sub: "Funding path",
    snapshotBuildPath: "Explore options with advisor support.",
  },
];

const INTERIOR: {
  id: InteriorId;
  hex: string;
  swatchBg: string;
  label: string;
  description: string;
}[] = [
  {
    id: "kai",
    hex: "#8B6B52",
    swatchBg: "#8B6B52",
    label: "Kai",
    description: "A warm and simple material.",
  },
  {
    id: "aina",
    hex: "#5C4434",
    swatchBg: "#5C4434",
    label: "Aina",
    description: "A grounded, rich interior tone.",
  },
  {
    id: "lani",
    hex: "#C7AF8D",
    swatchBg: "#C7AF8D",
    label: "Lani",
    description: "Light and calm finish for open, airy interiors.",
  },
  {
    id: "anu",
    hex: "#907D6B",
    swatchBg: "#907D6B",
    label: "Anu",
    description: "Balanced earthy finish with soft depth.",
  },
];

const INTERIOR_PREVIEW: Record<InteriorId, StaticImageData> = {
  kai: kaiInterior,
  aina: ainaInterior,
  lani: laniInterior,
  anu: anuInterior,
};

function SidebarSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(15,36,56,0.04)] sm:p-6">
      <h3 className="text-[17px] font-semibold tracking-tight text-[#141a18]">{title}</h3>
      {subtitle ? (
        <p className="mt-2 text-[13px] leading-relaxed font-normal text-[#6f7673]">{subtitle}</p>
      ) : null}
      {children}
    </section>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-3.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87908c]">
        {label}
      </span>
      <span className="max-w-[220px] text-right text-[13px] font-medium leading-snug text-[#1c2321]">
        {value}
      </span>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative h-14 w-14 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${ACCENT} ${v * 3.6}deg, #e8eceb 0deg)`,
        }}
      >
        <span className="absolute inset-[6px] flex items-center justify-center rounded-full bg-white text-[12px] font-semibold tracking-tight text-[#141a18]">
          {v}%
        </span>
      </div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[14px] border bg-white px-4 py-[14px] text-left transition-colors ${
        selected ? "border-2 shadow-[0_4px_16px_rgba(95,179,179,0.14)]" : "border hover:border-[#cfd6d4]"
      }`}
      style={
        selected
          ? { borderColor: ACCENT }
          : { borderWidth: "1px", borderColor: CARD_BORDER }
      }
    >
      <div className="text-[14px] font-semibold leading-snug text-[#141a18]">{title}</div>
      {sub ? <div className="mt-1 text-[12px] font-normal leading-snug text-[#7a837f]">{sub}</div> : null}
    </button>
  );
}

export function AduConfiguratorClient() {
  const router = useRouter();
  const { setConfiguratorSummary } = useBuildPath();
  const [viewportReady, setViewportReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const handleLoadIdle = useCallback(() => setViewportReady(true), []);
  const handleLoadProgress = useCallback((p: number) => setLoadProgress(p), []);

  const [planId, setPlanId] = useState<PlanId>("two-office");
  const [sidingId, setSidingId] = useState<SidingId>("default-stucco");
  const [claddingId, setCladdingId] = useState<CladdingId>("coastal");
  const [roofId, setRoofId] = useState<RoofStyle>("asphalt");
  const [features, setFeatures] = useState<OptionalFeatures>({
    deck: true,
    lanai: false,
    shower: false,
  });
  const [interiorId, setInteriorId] = useState<InteriorId>("kai");
  const [upgrades, setUpgrades] = useState<UpgradesPick>({
    solar: true,
    premiumAppliances: false,
    ac: false,
    smartHome: false,
    evCharging: false,
  });
  const [fundingId, setFundingId] = useState<FundingId>("cash");

  const cladding = CLADDING.find((c) => c.id === claddingId)!;
  const interior = INTERIOR.find((i) => i.id === interiorId)!;
  const interiorPreview = INTERIOR_PREVIEW[interiorId];
  const selectedPlan = PLANS.find((p) => p.id === planId)!;
  const selectedSiding = SIDING_OPTIONS.find((s) => s.id === sidingId)!;
  const fundingSel = FUNDING_OPTS.find((f) => f.id === fundingId)!;

  const yourAduChips = useMemo(() => {
    const chips: string[] = [selectedPlan.title, selectedSiding.title, cladding.label, interior.label];

    chips.push(roofId === "asphalt" ? "Asphalt shingle roof" : "Metal roof");

    for (const { key, label } of FEATURE_LABELS) {
      if (features[key]) chips.push(label);
    }
    for (const u of UPGRADE_DEFS) {
      if (upgrades[u.key]) chips.push(u.title);
    }

    return chips;
  }, [selectedPlan.title, selectedSiding.title, cladding.label, interior.label, roofId, features, upgrades]);

  const addonCount = FEATURE_LABELS.filter(({ key }) => features[key]).length;
  const upgradeCount = UPGRADE_DEFS.filter((u) => upgrades[u.key]).length;

  const toggleFeature = (key: keyof OptionalFeatures) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleUpgrade = (key: keyof UpgradesPick) => {
    setUpgrades((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinish = () => {
    setConfiguratorSummary({
      planId,
      sidingId,
      claddingId,
      roofStyle: roofId,
      interiorId,
      fundingId,
      features: { deck: features.deck, lanai: features.lanai, shower: features.shower },
      upgrades: { ...upgrades },
      chipLabels: [...yourAduChips],
    });
    router.push("/steps/thank-you");
  };

  return (
    <div
      className="font-dm-sans flex min-h-screen flex-col text-[#0f1412] lg:flex-row"
      style={{ background: "#0f1412" }}
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 lg:hidden">
        <Link
          href="/"
          className="text-sm font-medium tracking-wide text-white/90 underline-offset-4 hover:underline"
        >
          ← WeStay home
        </Link>
        <span className="truncate text-[13px] text-white/60">ADU configurator</span>
      </header>

      <aside
        className="order-2 flex w-full flex-1 flex-col gap-5 lg:order-2 lg:h-screen lg:w-[min(472px,40vw)] lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-white/10 lg:pb-12"
        style={{ background: PANEL_BG }}
      >
        <div className="hidden px-8 pb-2 pt-8 lg:block">
          <Link
            href="/"
            className="text-[13px] font-medium tracking-wide text-[#5f6663] underline-offset-4 hover:underline"
          >
            ← Back to site
          </Link>
        </div>

        <div className="flex flex-col gap-5 px-4 py-8 sm:px-6 lg:gap-6 lg:px-8 lg:pb-12">
          <SidebarSection title="Choose Your Starting Plan" subtitle="UI only for now — will drive the model when plan assets are ready.">
            <div className="mt-4 flex flex-col gap-2">
              {PLANS.map((plan) => {
                const selected = plan.id === planId;
                return (
                  <button
                    type="button"
                    key={plan.id}
                    onClick={() => setPlanId(plan.id)}
                    className={`flex gap-4 rounded-[14px] border bg-white px-4 py-[14px] text-left transition-all ${
                      selected ? "border-2 shadow-md" : ""
                    }`}
                    style={
                      selected ? { borderColor: ACCENT } : { borderColor: CARD_BORDER, borderWidth: "1px" }
                    }
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
                      style={{
                        borderColor: selected ? ACCENT : "#dfe4e2",
                        color: selected ? ACCENT : "#3d4542",
                      }}
                    >
                      {plan.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#141a18]">{plan.title}</div>
                      <p className="mt-0.5 text-[12px] leading-snug text-[#6f7673]">{plan.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SidebarSection>

          <SidebarSection
            title="Siding options"
            subtitle="Choose the options that feel most aligned."
          >
            <div className="mt-4 flex flex-col gap-3">
              {SIDING_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.id}
                  selected={sidingId === opt.id}
                  onClick={() => setSidingId(opt.id)}
                  title={opt.title}
                  sub={opt.sub}
                />
              ))}
            </div>
          </SidebarSection>

          <SidebarSection title="Choose your cladding color">
            <div className="mt-5 flex flex-wrap gap-3">
              {CLADDING.map((c) => {
                const selected = c.id === claddingId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    onClick={() => setCladdingId(c.id)}
                    className="relative h-12 w-12 shrink-0 rounded-full border-2 transition-transform hover:scale-[1.04] active:scale-[0.98]"
                    style={{
                      borderColor: selected ? ACCENT : "transparent",
                      boxShadow: selected ? `0 0 0 1px ${ACCENT}40` : "inset 0 0 0 1px rgba(0,0,0,0.06)",
                      background:
                        c.id === "original"
                          ? "repeating-conic-gradient(from 0deg, #f8f8f8 0deg 8deg, #ececec 8deg 16deg)"
                          : c.swatchBg,
                    }}
                    aria-label={c.label}
                    aria-pressed={selected}
                  />
                );
              })}
            </div>
            <hr className="my-5 border-0 border-t border-[#e6ebea]" />
            <div>
              <div className="text-[14px] font-semibold text-[#141a18]">{cladding.label}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-[#6f7673]">{cladding.description}</p>
            </div>
          </SidebarSection>

          <SidebarSection title="Choose your roof">
            <div className="mt-4 flex flex-col gap-3">
              <OptionCard
                selected={roofId === "asphalt"}
                onClick={() => setRoofId("asphalt")}
                title="Asphalt shingle roof"
              />
              <OptionCard
                selected={roofId === "metal"}
                onClick={() => setRoofId("metal")}
                title="Metal roof"
              />
            </div>
          </SidebarSection>

          <SidebarSection
            title="Optional Features"
            subtitle="Choose the options that feel most aligned — 3D updates will be wired in a later pass."
          >
            <div className="mt-4 flex flex-col gap-3">
              <OptionCard
                selected={features.deck}
                onClick={() => toggleFeature("deck")}
                title="Deck"
                sub="Simple outdoor extension"
              />
              <OptionCard
                selected={features.lanai}
                onClick={() => toggleFeature("lanai")}
                title="Covered Lanai"
                sub="Sheltered outdoor living"
              />
              <OptionCard
                selected={features.shower}
                onClick={() => toggleFeature("shower")}
                title="Outdoor Shower"
                sub="Rinse-off convenience"
              />
            </div>
          </SidebarSection>

          <section className="overflow-hidden rounded-[20px] border border-white bg-white p-3 shadow-[0_12px_40px_rgba(15,36,56,0.04)] sm:p-4">
            <Image
              src={interiorPreview}
              alt={`${interior.label} interior preview`}
              className="h-auto w-full object-cover"
              priority
            />
          </section>

          <SidebarSection title="Interior Mood / Finish">
            <div className="mt-5 flex flex-wrap gap-3">
              {INTERIOR.map((row) => {
                const selected = row.id === interiorId;
                return (
                  <button
                    key={row.id}
                    type="button"
                    title={row.label}
                    onClick={() => setInteriorId(row.id)}
                    className="relative h-12 w-12 shrink-0 rounded-full border-2 transition-transform hover:scale-[1.04] active:scale-[0.98]"
                    style={{
                      borderColor: selected ? ACCENT : "transparent",
                      boxShadow: selected ? `0 0 0 1px ${ACCENT}40` : "inset 0 0 0 1px rgba(0,0,0,0.08)",
                      background: row.swatchBg,
                    }}
                    aria-label={row.label}
                    aria-pressed={selected}
                  />
                );
              })}
            </div>
            <hr className="my-5 border-0 border-t border-[#e6ebea]" />
            <div>
              <div className="text-[14px] font-semibold text-[#141a18]">{interior.label}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-[#6f7673]">{interior.description}</p>
            </div>
          </SidebarSection>

          <SidebarSection
            title="Upgrades"
            subtitle="Choose the options that feel most aligned — previews only until backend wiring lands."
          >
            <div className="mt-4 flex flex-col gap-3">
              {UPGRADE_DEFS.map((u) => (
                <OptionCard
                  key={u.key}
                  selected={upgrades[u.key]}
                  onClick={() => toggleUpgrade(u.key)}
                  title={u.title}
                  sub={u.sub}
                />
              ))}
            </div>
          </SidebarSection>

          <SidebarSection title="Your ADU" subtitle="Selected model, finishes, site options, and add-ons.">
            <div className="mt-4 grid grid-cols-3 gap-2">
              {yourAduChips.map((label, chipIndex) => (
                <span
                  key={`${label}-${chipIndex}`}
                  className="truncate rounded-full border border-[#d8dfe0] bg-[#f9fbfa] px-2.5 py-1.5 text-center text-[10px] font-medium leading-snug tracking-tight text-[#3d4945] sm:text-[11px]"
                  title={label}
                >
                  {label}
                </span>
              ))}
            </div>
          </SidebarSection>

          <SidebarSection
            title="How Are You Planning to Fund Your ADU?"
            subtitle="Choose the path that best reflects your timeline and budget strategy."
          >
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {FUNDING_OPTS.map((opt) => {
                const sel = fundingId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFundingId(opt.id)}
                    className={`rounded-[14px] border bg-white px-3 py-3 text-center transition-colors ${
                      sel ? "border-2 shadow-[0_4px_16px_rgba(95,179,179,0.12)]" : "border"
                    }`}
                    style={
                      sel
                        ? { borderColor: ACCENT }
                        : { borderWidth: "1px", borderColor: CARD_BORDER }
                    }
                  >
                    <div className="text-[13px] font-semibold text-[#141a18]">{opt.title}</div>
                    <div className="mt-1 text-[11px] font-normal text-[#7a837f]">{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </SidebarSection>

          <SidebarSection title="Your ADU Snapshot" subtitle="A quick overview of the configuration you’ve assembled so far.">
            <div className="mt-6 space-y-0 divide-y divide-[#e8ebe9] rounded-[14px] border border-[#e8ebe9] bg-[#fafcfb] px-4">
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87908c]">
                  Score
                </span>
                <ScoreRing value={80} />
              </div>
              <SnapshotRow label="Intended Use" value="Primary residence extension" />
              <SnapshotRow label="Selected ADU Type" value={selectedPlan.title} />
              <SnapshotRow label="Selected Build Path" value={fundingSel.snapshotBuildPath} />
              <SnapshotRow label="Plan Summary" value={selectedPlan.description} />
              <SnapshotRow
                label="Customization Summary"
                value={`${addonCount} site add-ons · ${upgradeCount} upgrades`}
              />
              <SnapshotRow label="Estimated Starting Range" value="$3,400 – $3,600" />
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="font-dm-sans mt-6 w-full rounded-[14px] bg-[#ff6b5c] py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#ef5d4f] active:bg-[#e55548]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Finish &amp; Book Discovery Call
            </button>
          </SidebarSection>
        </div>
      </aside>

      <main className="relative order-1 h-[52svh] min-h-[300px] w-full shrink-0 bg-[#eaecea] lg:order-1 lg:h-auto lg:min-h-0 lg:flex-1 lg:self-stretch">
        {!viewportReady ? (
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-[#eaecea] px-6"
          >
            <div
              className="h-11 w-11 shrink-0 rounded-full border-2 border-[#d8dfe0] border-t-[#5fb3b3] motion-safe:animate-spin"
              aria-hidden
            />
            <div className="flex flex-col items-center gap-2 text-center">
              <p
                className="text-[15px] font-semibold tracking-tight text-[#1c2321]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Loading your ADU model
              </p>
              <p className="max-w-[280px] text-[13px] leading-snug text-[#6f7673]">
                Preparing the 3D preview — this may take a moment on slower connections.
              </p>
            </div>
            <div className="h-1.5 w-full max-w-[240px] overflow-hidden rounded-full bg-[#e8ebe9]">
              <div
                className="h-full rounded-full bg-[#5fb3b3] transition-[width] duration-300 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(0, Math.round(loadProgress)))}%`,
                }}
              />
            </div>
          </div>
        ) : null}
        <ConfiguratorCanvas
          modelUrl={PLAN_MODEL_URL[planId]}
          roofStyle={roofId}
          wallTint={cladding.tint}
          sidingId={sidingId}
          showDeckSlab={features.deck}
          showLanaiMeshes={features.lanai}
          showShowerPortion={features.shower}
          onLoadIdle={handleLoadIdle}
          onLoadProgress={handleLoadProgress}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-24 bg-linear-to-t from-[#eaecea] via-[#eaecea]/75 to-transparent"
        />
      </main>
    </div>
  );
}
