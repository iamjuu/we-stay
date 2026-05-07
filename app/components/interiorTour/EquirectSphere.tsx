"use client";

import { useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";
import * as THREE from "three";

type EquirectSphereProps = {
  imageUrl: string;
  /** Inverted sphere radius — large so parallax is subtle. */
  radius?: number;
};

export function EquirectSphere({ imageUrl, radius = 500 }: EquirectSphereProps) {
  const map = useTexture(imageUrl);

  useLayoutEffect(() => {
    map.wrapS = THREE.ClampToEdgeWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    // SphereGeometry UVs are already equirectangular — use UV mapping, not reflection mapping.
    map.mapping = THREE.UVMapping;
    map.colorSpace = THREE.SRGBColorSpace;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.magFilter = THREE.LinearFilter;
    map.generateMipmaps = true;
    map.needsUpdate = true;
  }, [map]);

  return (
    <mesh scale={[-1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[radius, 64, 32]} />
      <meshBasicMaterial map={map} side={THREE.BackSide} depthWrite depthTest />
    </mesh>
  );
}
