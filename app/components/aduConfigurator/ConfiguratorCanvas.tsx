"use client";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ConfiguratorModel, type RoofStyle, type SidingId } from "./ConfiguratorModel";
import { PLAN_MODEL_URL } from "./planModelUrls";

for (const url of Object.values(PLAN_MODEL_URL)) {
  useGLTF.preload(url);
}

type ConfiguratorCanvasProps = {
  modelUrl: string;
  roofStyle: RoofStyle;
  wallTint: string | null;
  sidingId: SidingId;
  showDeckSlab: boolean;
  showLanaiMeshes: boolean;
  showShowerPortion: boolean;
};

export function ConfiguratorCanvas({
  modelUrl,
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
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#eaecea"]} />
        {/* Low fill so the directional “sun” casts readable shadows */}
        <ambientLight intensity={0.22} />
        <directionalLight
          castShadow
          color="#fff8f0"
          intensity={2.35}
          position={[14, 28, 10]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
        />
        <Suspense fallback={null}>
          <ConfiguratorModel
            key={modelUrl}
            url={modelUrl}
            roofStyle={roofStyle}
            wallTint={wallTint}
            sidingId={sidingId}
            showDeckSlab={showDeckSlab}
            showLanaiMeshes={showLanaiMeshes}
            showShowerPortion={showShowerPortion}
          />
          {/* Softer IBL so the sun direction reads more clearly */}
          <Environment preset="city" environmentIntensity={0.55} />
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
