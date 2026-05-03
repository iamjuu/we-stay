"use client";

import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { RoomId } from "./tourHotspots";
import { hotspotPosition } from "./tourHotspots";

const ACCENT = "#5fb3b3";

/**
 * World units at ~420 from camera — large enough to see, small enough not to dominate the view.
 */
const DISC_R = 18;
const RING_IN = 8;
const RING_OUT = 14;
const CENTER_R = 4;
const LABEL_W = 44;
const LABEL_H = 12;
const LABEL_Y = 26;

type PanoramaHotspotProps = {
  azimuthDeg: number;
  elevationDeg: number;
  onNavigate: (to: RoomId) => void;
  to: RoomId;
  labelTexture: THREE.CanvasTexture | null;
};

export function PanoramaHotspot({
  azimuthDeg,
  elevationDeg,
  onNavigate,
  to,
  labelTexture,
}: PanoramaHotspotProps) {
  const pos = hotspotPosition(azimuthDeg, elevationDeg);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = pulseRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const s = 1 + 0.12 * Math.sin(t * 2.4);
    mesh.scale.setScalar(s);
  });

  const go = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onNavigate(to);
  };

  const hover = () => {
    document.body.style.cursor = "pointer";
  };
  const leave = () => {
    document.body.style.cursor = "auto";
  };

  const overlayMatProps = {
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  } as const;

  return (
    <group position={pos} renderOrder={50} frustumCulled={false}>
      <Billboard follow>
        <mesh renderOrder={51} onClick={(e) => go(e)} onPointerOver={hover} onPointerOut={leave}>
          <circleGeometry args={[DISC_R, 48]} />
          <meshBasicMaterial
            color={ACCENT}
            {...overlayMatProps}
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh
          ref={pulseRef}
          renderOrder={52}
          onClick={(e) => go(e)}
          onPointerOver={hover}
          onPointerOut={leave}
        >
          <ringGeometry args={[RING_IN, RING_OUT, 40]} />
          <meshBasicMaterial
            color={ACCENT}
            {...overlayMatProps}
            opacity={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh renderOrder={53} onClick={(e) => go(e)} onPointerOver={hover} onPointerOut={leave}>
          <circleGeometry args={[CENTER_R, 24]} />
          <meshBasicMaterial
            color="#ffffff"
            {...overlayMatProps}
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {labelTexture ? (
          <mesh position={[0, LABEL_Y, 0]} renderOrder={54} raycast={() => null}>
            <planeGeometry args={[LABEL_W, LABEL_H, 1, 1]} />
            <meshBasicMaterial
              map={labelTexture}
              transparent
              depthTest
              depthWrite={false}
              side={THREE.DoubleSide}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </mesh>
        ) : null}
      </Billboard>
    </group>
  );
}
