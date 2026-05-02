'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

function EquirectSphere({ url }: { url: string }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const geometry = useMemo(() => new THREE.SphereGeometry(500, 64, 64), []);

  return (
    <mesh geometry={geometry} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

type PanoramaViewerProps = {
  imageUrl: string;
};

export default function PanoramaViewer({ imageUrl }: PanoramaViewerProps) {
  return (
    <div className="h-full w-full touch-none [&_canvas]:h-full [&_canvas]:w-full">
      <Canvas
        camera={{ position: [0, 0, 0.01], fov: 75, near: 0.01, far: 2000 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <EquirectSphere url={imageUrl} />
        </Suspense>
        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={-0.35}
          minDistance={0.01}
          maxDistance={0.01}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
}
