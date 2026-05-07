"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { EquirectSphere } from "./EquirectSphere";
import { PanoramaHotspot } from "./PanoramaHotspot";
import { createTapHereLabelTexture } from "./tapHereTexture";
import type { RoomId } from "./tourHotspots";
import { ROOM_HOTSPOTS, ROOM_PATH } from "./tourHotspots";

type RoomTourSceneProps = {
  roomId: RoomId;
  onGoTo: (to: RoomId) => void;
};

export function RoomTourScene({ roomId, onGoTo }: RoomTourSceneProps) {
  const path = ROOM_PATH[roomId];
  const spots = ROOM_HOTSPOTS[roomId] ?? [];

  const [labelTexture, setLabelTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const tex = createTapHereLabelTexture();
    setLabelTexture(tex);
    return () => {
      tex.dispose();
    };
  }, []);

  return (
    <>
      <EquirectSphere key={path} imageUrl={path} />
      {spots.map((h, i) => (
        <PanoramaHotspot
          key={`${roomId}-${i}-${h.to}`}
          azimuthDeg={h.azimuthDeg}
          elevationDeg={h.elevationDeg}
          to={h.to}
          onNavigate={onGoTo}
          labelTexture={labelTexture}
        />
      ))}
    </>
  );
}
