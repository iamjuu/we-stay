"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Link from "next/link";
import { Suspense, useState } from "react";
import { RoomTourScene } from "./RoomTourScene";
import type { RoomId } from "./tourHotspots";
import { ROOM_LABEL } from "./tourHotspots";

const STAGE_BG = "#eaecea";

export function InteriorTourClient() {
  const [roomId, setRoomId] = useState<RoomId>("hall");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="mx-auto max-w-7xl  2xl:max-w-none">
        <div className="font-dm-sans grid min-h-[100dvh] w-full grid-rows-[auto_minmax(0,1fr)]  py-10  text-[#141a18]">
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
          
         
          </header>

          <main
            className="relative min-h-0 w-full overflow-hidden rounded-[20px]"
            style={{ background: STAGE_BG }}
          >
            <div className="absolute inset-0 h-full min-h-0 w-full">
              <Canvas
                className="!block h-full w-full touch-none [&>div]:h-full [&>div]:w-full [&>div]:outline-none"
                style={{ width: "100%", height: "100%" }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 0.024], fov: 92, near: 0.078, far: 8000 }}
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
                  <RoomTourScene roomId={roomId} onGoTo={setRoomId} />
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
            <p className="pointer-events-none absolute bottom-3 left-1/2 z-1 max-w-[92%] -translate-x-1/2 rounded-full bg-black/45 px-3 py-1.5 text-center text-[11px] font-medium text-white/95 backdrop-blur-sm">
              Drag to look around · Tap teal “Tap here” spots to move to another area
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
