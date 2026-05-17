"use client";

import { useEffect, useMemo } from "react";
import { EquirectSphere } from "./EquirectSphere";
import { PanoramaHotspot } from "./PanoramaHotspot";
import { createTapHereLabelTexture } from "./tapHereTexture";
import type { FolderHotspotDef } from "./interiorFolderHotspots";
import { ROOM_HOTSPOTS, ROOM_LABEL, type RoomId } from "./tourHotspots";

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
  const useInteriorHotspots = Boolean(panoHotspots?.length && onGoToPanoramaIndex);

  const interiorSpots = useInteriorHotspots ? (panoHotspots ?? []) : [];
  const roomSpots =
    !useInteriorHotspots && interactiveRoom && onGoTo
      ? (ROOM_HOTSPOTS[interactiveRoom] ?? [])
      : [];

  // One texture per unique room label so each hotspot shows the correct room name.
  const labelTextures = useMemo(() => {
    const labels = useInteriorHotspots
      ? interiorSpots.map((h) => h.label)
      : roomSpots.map((h) => ROOM_LABEL[h.to]);
    const unique = [...new Set(labels)];
    return Object.fromEntries(
      unique.map((text) => [text, createTapHereLabelTexture(text)])
    );
    // Re-create when the panorama changes (new set of hotspots).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panoramaUrl]);

  useEffect(() => {
    return () => {
      Object.values(labelTextures).forEach((t) => t.dispose());
    };
  }, [labelTextures]);

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
              labelTexture={labelTextures[h.label] ?? null}
            />
          ))
        : roomSpots.map((h, i) => (
            <PanoramaHotspot
              key={`${panoramaUrl.slice(-24)}-${i}-${h.to}`}
              azimuthDeg={h.azimuthDeg}
              elevationDeg={h.elevationDeg}
              to={h.to}
              onNavigate={(toKey) => onGoTo?.(toKey as RoomId)}
              labelTexture={labelTextures[ROOM_LABEL[h.to]] ?? null}
            />
          ))}
    </>
  );
}
