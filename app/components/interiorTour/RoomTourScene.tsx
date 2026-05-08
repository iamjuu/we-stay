"use client";

import { useEffect, useMemo } from "react";
import { EquirectSphere } from "./EquirectSphere";
import { PanoramaHotspot } from "./PanoramaHotspot";
import { createTapHereLabelTexture } from "./tapHereTexture";
import type { RoomId } from "./tourHotspots";
import { ROOM_HOTSPOTS } from "./tourHotspots";

type RoomTourSceneProps = {
  /** Equirectangular image URL (already encoded if needed). */
  panoramaUrl: string;
  /** Legacy kitchen/hall/bedroom/washroom tour hotspots. */
  interactiveRoom?: RoomId | null;
  onGoTo?: (to: RoomId) => void;
  /**
   * Hotspots within one theme folder: each jumps to another `panoramaPaths[index]`
   * (same interior style).
   */
  panoHotspots?: FolderHotspotDef[];
  onGoToPanoramaIndex?: (index: number) => void;
};

export function RoomTourScene({
  panoramaUrl,
  interactiveRoom = null,
  onGoTo,
  panoHotspots,
  onGoToPanoramaIndex,
}: RoomTourSceneProps) {
  const useInteriorHotspots =
    Boolean(panoHotspots?.length && onGoToPanoramaIndex);

  const interiorSpots = useInteriorHotspots ? (panoHotspots ?? []) : [];
  const roomSpots =
    !useInteriorHotspots && interactiveRoom && onGoTo
      ? (ROOM_HOTSPOTS[interactiveRoom] ?? [])
      : [];

  const labelTexture = useMemo(() => createTapHereLabelTexture(), []);

  useEffect(() => {
    return () => labelTexture.dispose();
  }, [labelTexture]);

  return (
    <>
      <EquirectSphere key={panoramaUrl} imageUrl={panoramaUrl} />
      {useInteriorHotspots
        ? interiorSpots.map((h, i) => (
            <PanoramaHotspot
              key={`${panoramaUrl.slice(-24)}-${i}-${h.toIndex}`}
              azimuthDeg={h.azimuthDeg}
              elevationDeg={h.elevationDeg}
              to={String(h.toIndex)}
              onNavigate={(toKey) => {
                const idx = Number.parseInt(toKey, 10);
                if (!Number.isFinite(idx)) return;
                onGoToPanoramaIndex!(idx);
              }}
              labelTexture={labelTexture}
            />
          ))
        : roomSpots.map((h, i) => (
            <PanoramaHotspot
              key={`${panoramaUrl.slice(-24)}-${i}-${h.to}`}
              azimuthDeg={h.azimuthDeg}
              elevationDeg={h.elevationDeg}
              to={h.to}
              onNavigate={(toKey) => onGoTo?.(toKey as RoomId)}
              labelTexture={labelTexture}
            />
          ))}
    </>
  );
}
