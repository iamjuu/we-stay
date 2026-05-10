"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Globe } from "lucide-react";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import CtaButton from "@/app/components/ctaButton/ctaButton";
import { getFolderHotspotsForPano } from "./interiorFolderHotspots";
import { INTERIOR_THEMES, type InteriorTheme, type InteriorThemeId } from "./interiorThemes";
import { RoomTourScene } from "./RoomTourScene";

const STAGE_BG = "#eaecea";
const ACCENT = "#F05C4A";

type Phase = "splash" | "pick" | "explore";

/** Wider default view — feels less tight than a high-zoom / narrow FOV framing. */
const PANORAMA_CAMERA_FOV = 104;
const PANORAMA_CAMERA_POS: [number, number, number] = [0, 0, 0.052];

const clientSnapshot = () => true;
const serverSnapshot = () => false;
/** No-op subscribe — snapshots are fixed per environment after hydration. */
const emptySubscribe = () => () => {};

export function InteriorTourClient() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [themeId, setThemeId] = useState<InteriorThemeId | null>(null);
  /** Which file inside the chosen theme folder (same folder only — not cross-theme). */
  const [panoIndex, setPanoIndex] = useState(0);
  const isClient = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

  const theme = useMemo(
    () => INTERIOR_THEMES.find((t) => t.id === themeId) ?? null,
    [themeId]
  );

  const panoramaUrl = useMemo(() => {
    if (!theme) return "";
    const path = theme.panoramaPaths[panoIndex];
    return path ? encodeURI(path) : "";
  }, [theme, panoIndex]);

  useEffect(() => {
    if (phase !== "explore") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  const openPicker = useCallback(() => {
    setPhase("pick");
  }, []);

  const selectTheme = useCallback((t: InteriorTheme) => {
    setThemeId(t.id);
    setPanoIndex(0);
    setPhase("explore");
  }, []);

  const goToPanoIndex = useCallback(
    (next: number) => {
      if (!themeId) return;
      const paths = INTERIOR_THEMES.find((x) => x.id === themeId)?.panoramaPaths;
      if (!paths || next < 0 || next >= paths.length) return;
      setPanoIndex(next);
    },
    [themeId]
  );

  const folderHotspots =
    themeId && theme && theme.panoramaPaths.length > 1
      ? getFolderHotspotsForPano(themeId, panoIndex)
      : [];

  const backToSplash = useCallback(() => {
    setPhase("splash");
    setThemeId(null);
    setPanoIndex(0);
  }, []);

  const exploreFullscreen =
    isClient &&
    phase === "explore" &&
    panoramaUrl &&
    themeId &&
    createPortal(
      <div className="fixed inset-0 z-[200] flex flex-col bg-black pt-[env(safe-area-inset-top,0px)]">
        <div className="relative min-h-0 flex-1">
          <Canvas
            key={panoramaUrl}
            className="!absolute inset-0 !block touch-none [&>div]:h-full [&>div]:w-full [&>div]:outline-none"
            style={{ width: "100%", height: "100%" }}
            dpr={[1, 2]}
            camera={{
              position: PANORAMA_CAMERA_POS,
              fov: PANORAMA_CAMERA_FOV,
              near: 0.078,
              far: 8000,
            }}
            gl={{ antialias: true, alpha: false }}
          >
            <Suspense
              fallback={
                <mesh>
                  <boxGeometry args={[0.1, 0.1, 0.1]} />
                  <meshBasicMaterial color="#b8bdb9" />
                </mesh>
              }
            >
              <RoomTourScene
                panoramaUrl={panoramaUrl}
                panoHotspots={folderHotspots.length > 0 ? folderHotspots : undefined}
                onGoToPanoramaIndex={
                  theme && theme.panoramaPaths.length > 1 ? goToPanoIndex : undefined
                }
              />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={-0.35}
              minPolarAngle={0.12}
              maxPolarAngle={Math.PI - 0.12}
            />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2 px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={backToSplash}
            className="pointer-events-auto rounded-full bg-black/50 px-4 py-2 text-[12px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:text-[13px]"
          >
            ← Return
          </button>
          <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
            {INTERIOR_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTheme(t)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-95 sm:text-[12px] ${
                  themeId === t.id ? "ring-2 ring-white/80" : "opacity-90"
                }`}
                style={{ background: ACCENT }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-3 z-10 mx-auto max-w-[92%] rounded-full bg-black/45 px-3 py-2 text-center text-[11px] font-medium text-white/95 backdrop-blur-sm pb-[calc(12px+env(safe-area-inset-bottom,0px))] sm:bottom-4">
          Tap here to jump to another 360° in this space · Drag to look around
        </p>
      </div>,
      document.body
    );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-50 mt-25 mb-25">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        <div className="font-dm-sans w-full py-10 text-[#141a18]">
          {(phase === "splash" || phase === "pick") && (
            <main
              className="relative min-h-[min(420px,90vh)] w-full overflow-hidden rounded-[20px] shadow-[0_12px_40px_rgba(12,27,42,0.12)] sm:min-h-[min(480px,75vh)] lg:min-h-[min(560px,78vh)]"
              style={{ background: STAGE_BG }}
            >
              <>
                {/* Four interior previews — one quadrant per theme (aina, anu, kai, lani) */}
                <div
                  className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2 gap-px bg-[#1a2430]"
                  aria-hidden
                >
                  {INTERIOR_THEMES.map((t, i) => (
                    <div key={t.id} className="relative min-h-0 min-w-0">
                      <Image
                        src={encodeURI(t.panoramaPaths[0] ?? "")}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 35vw"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 z-20 flex flex-col bg-gradient-to-b from-[#0C1B2A]/65 via-[#0C1B2A]/45 to-[#0C1B2A]/70">
                  <div className="flex flex-1 flex-col items-center justify-center px-6">
                    <p
                      className={`font-playfair-display text-center font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] ${
                        phase === "pick"
                          ? "text-[clamp(1.25rem,4vw,2rem)]"
                          : "text-[clamp(1.75rem,5vw,3rem)]"
                      }`}
                    >
                      {phase === "pick"
                        ? "Select to explore the four interior styles below."
                        : "Step inside."}
                    </p>

                    {phase === "pick" && (
                      <div
                        className="interior-chip-row mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-4"
                        role="list"
                      >
                        {INTERIOR_THEMES.map((t, i) => (
                          <button
                            key={t.id}
                            type="button"
                            role="listitem"
                            style={{ animationDelay: `${120 + i * 90}ms` }}
                            className="interior-game-chip uppercase"
                            onClick={() => selectTheme(t)}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center pb-8 pt-4 sm:pb-10">
                    {phase === "splash" && (
                      <CtaButton
                        buttonName="Experience Your Backyard Interior In 3D"
                        icon={<Globe className="size-[18px] shrink-0 text-white" aria-hidden />}
                        onClick={openPicker}
                      />
                    )}
                  </div>
                </div>
              </>
            </main>
          )}

          {exploreFullscreen}

          <style jsx global>{`
            @keyframes interiorChipDrop {
              0% {
                opacity: 0;
                transform: translateY(-140%) rotate(-14deg) scale(0.82);
              }
              55% {
                opacity: 1;
                transform: translateY(10px) rotate(3deg) scale(1.04);
              }
              100% {
                opacity: 1;
                transform: translateY(0) rotate(0deg) scale(1);
              }
            }
            .interior-game-chip {
              background: ${ACCENT};
              color: #fff;
              border: none;
              cursor: pointer;
              padding: 0.55rem 1.25rem;
              border-radius: 9999px;
              font-size: 0.8rem;
              font-weight: 700;
              letter-spacing: 0.06em;
              box-shadow:
                0 4px 0 rgba(0, 0, 0, 0.18),
                0 8px 24px rgba(240, 92, 74, 0.35),
                inset 0 1px 0 rgba(255, 255, 255, 0.25);
              animation: interiorChipDrop 0.65s cubic-bezier(0.34, 1.25, 0.64, 1) both;
            }
            .interior-game-chip:hover {
              filter: brightness(1.05);
            }
            .interior-game-chip:active {
              transform: translateY(2px) scale(0.98);
              box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
            }
            @media (prefers-reduced-motion: reduce) {
              .interior-game-chip {
                animation: none;
                opacity: 1;
                transform: none;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
