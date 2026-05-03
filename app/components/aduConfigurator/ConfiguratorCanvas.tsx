"use client";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ConfiguratorModel, type RoofStyle, type SidingId } from "./ConfiguratorModel";

const MODEL_URL = "/3dmodels/800Sqftbench.glb";

useGLTF.preload(MODEL_URL);

type ConfiguratorCanvasProps = {
  roofStyle: RoofStyle;
  wallTint: string | null;
  sidingId: SidingId;
  showDeckSlab: boolean;
  showLanaiMeshes: boolean;
  showShowerPortion: boolean;
};

export function ConfiguratorCanvas({
  roofStyle,
  wallTint,
  sidingId,
  showDeckSlab,
  showLanaiMeshes,
  showShowerPortion,
}: ConfiguratorCanvasProps) {
  return (
    <div className="h-full min-h-0 w-full max-lg:min-h-[260px]">
      <Canvas
        shadows
        className="h-full w-full touch-none [&>div]:outline-none"
        camera={{ position: [0, 3, 8], fov: 42, near: 0.05, far: 500 }}
      >
        <color attach="background" args={["#eaecea"]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          castShadow
          intensity={1.05}
          position={[8, 14, 6]}
          shadow-mapSize-width={1536}
          shadow-mapSize-height={1536}
        />
        <Suspense fallback={null}>
          <ConfiguratorModel
            url={MODEL_URL}
            roofStyle={roofStyle}
            wallTint={wallTint}
            sidingId={sidingId}
            showDeckSlab={showDeckSlab}
            showLanaiMeshes={showLanaiMeshes}
            showShowerPortion={showShowerPortion}
          />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          minDistance={0.15}
          maxDistance={160}
          maxPolarAngle={Math.PI / 2 - 0.08}
        />
      </Canvas>
    </div>
  );
}
