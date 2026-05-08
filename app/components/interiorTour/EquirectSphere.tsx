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
    const img = map.image as { width?: number; height?: number } | undefined;
    const w = img?.width ?? 0;
    const h = img?.height ?? 0;
    /** NPOT (e.g. 7680×4320) textures must not use mipmaps or the GPU often shows nothing. */
    const isPot =
      w > 0 && h > 0 && THREE.MathUtils.isPowerOfTwo(w) && THREE.MathUtils.isPowerOfTwo(h);

    map.wrapS = THREE.ClampToEdgeWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    map.mapping = THREE.UVMapping;
    map.colorSpace = THREE.SRGBColorSpace;
    if (isPot) {
      map.generateMipmaps = true;
      map.minFilter = THREE.LinearMipmapLinearFilter;
      map.magFilter = THREE.LinearFilter;
    } else {
      map.generateMipmaps = false;
      map.minFilter = THREE.LinearFilter;
      map.magFilter = THREE.LinearFilter;
    }
    map.needsUpdate = true;
  }, [map]);

  return (
    <mesh scale={[-1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[radius, 64, 32]} />
      <meshBasicMaterial map={map} side={THREE.BackSide} depthWrite depthTest />
    </mesh>
  );
}
