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
    <div className="font-dm-sans grid min-h-[100dvh] w-full grid-rows-[auto_minmax(0,1fr)] bg-[#0f1412] text-[#141a18]">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
            360° interior
          </span>
          <h1 className="truncate text-base font-semibold text-white sm:text-lg">
            1 BHK tour · {ROOM_LABEL[roomId]}
          </h1>
        </div>
        <div className="flex shrink-0 gap-2 sm:gap-3">
          <Link
            href="/3dpage"
            className="rounded-full border border-white/20 px-3 py-1.5 text-[12px] font-medium text-white/90 transition hover:bg-white/10"
          >
            Configurator
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-3 py-1.5 text-[12px] font-medium text-white/90 transition hover:bg-white/10"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="relative min-h-0 w-full" style={{ background: STAGE_BG }}>
        <div className="absolute inset-0 h-full min-h-0 w-full">
          <Canvas
            className="!block h-full w-full touch-none [&>div]:h-full [&>div]:w-full [&>div]:outline-none"
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 0.01], fov: 70, near: 0.01, far: 2000 }}
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
  );
}
