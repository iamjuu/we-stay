"use client";

import { Billboard, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { EquirectSphere } from "@/app/components/interiorTour/EquirectSphere";
import { INTERIOR_THEMES } from "@/app/components/interiorTour/interiorThemes";

// ─── types ───────────────────────────────────────────────────────────────────

type Pin = {
  id: number;
  label: string;
  azimuthDeg: number;
  elevationDeg: number;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function getCameraAngles(camera: THREE.Camera) {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const az = (Math.atan2(dir.x, -dir.z) * 180) / Math.PI;
  const el = (Math.asin(Math.max(-1, Math.min(1, dir.y))) * 180) / Math.PI;
  return { az: Math.round(az * 10) / 10, el: Math.round(el * 10) / 10 };
}

function pinPosition(az: number, el: number): [number, number, number] {
  const azR = (az * Math.PI) / 180;
  const elR = (el * Math.PI) / 180;
  const r = 420;
  return [
    r * Math.cos(elR) * Math.sin(azR),
    r * Math.sin(elR),
    -r * Math.cos(elR) * Math.cos(azR),
  ];
}

// ─── sub-components (inside Canvas) ─────────────────────────────────────────

function LiveAngles({
  onChange,
}: {
  onChange: (az: number, el: number) => void;
}) {
  const { camera } = useThree();
  const prev = useRef({ az: 0, el: 0 });

  useFrame(() => {
    const { az, el } = getCameraAngles(camera);
    if (az !== prev.current.az || el !== prev.current.el) {
      prev.current = { az, el };
      onChange(az, el);
    }
  });

  return null;
}

function PinMarker({ pin, onRemove }: { pin: Pin; onRemove: (id: number) => void }) {
  const pos = pinPosition(pin.azimuthDeg, pin.elevationDeg);
  return (
    <group position={pos} renderOrder={50} frustumCulled={false}>
      <Billboard follow>
        <mesh renderOrder={51}>
          <circleGeometry args={[10, 32]} />
          <meshBasicMaterial color="#f05c4a" transparent opacity={0.9} side={THREE.DoubleSide} depthTest={false} />
        </mesh>
        <mesh renderOrder={52}>
          <ringGeometry args={[12, 16, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} depthTest={false} />
        </mesh>
        <Html position={[0, 28, 0]} center>
          <div
            style={{
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              fontSize: 11,
              padding: "3px 7px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              fontFamily: "monospace",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => onRemove(pin.id)}
            title="Click to remove"
          >
            {pin.label} ({pin.azimuthDeg}°, {pin.elevationDeg}°) ✕
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// ─── main client component ───────────────────────────────────────────────────

export function HotspotCalibratorClient() {
  // panorama selection
  const allPanos = INTERIOR_THEMES.flatMap((t) =>
    t.panoramaPaths.map((p, i) => ({ label: `${t.label} #${i + 1}`, url: p }))
  );
  const [panoIdx, setPanoIdx] = useState(0);
  const panoUrl = encodeURI(allPanos[panoIdx]?.url ?? "");

  // live angles
  const [liveAz, setLiveAz] = useState(0);
  const [liveEl, setLiveEl] = useState(0);
  const handleAngles = useCallback((az: number, el: number) => {
    setLiveAz(az);
    setLiveEl(el);
  }, []);

  // pins
  const [pins, setPins] = useState<Pin[]>([]);
  const [nextLabel, setNextLabel] = useState("bedroom");
  const pinCounter = useRef(0);

  const addPin = () => {
    const id = ++pinCounter.current;
    setPins((p) => [
      ...p,
      { id, label: nextLabel, azimuthDeg: liveAz, elevationDeg: liveEl },
    ]);
  };

  const removePin = (id: number) => setPins((p) => p.filter((x) => x.id !== id));

  // copy code
  const codeOutput = pins
    .map((p) => `  { to: "${p.label}", azimuthDeg: ${p.azimuthDeg}, elevationDeg: ${p.elevationDeg} },`)
    .join("\n");

  const copyCode = () => navigator.clipboard.writeText(codeOutput);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0c1b2a", color: "#fff", fontFamily: "monospace" }}>
      {/* ── top bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#111d2b", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#f05c4a" }}>Hotspot Calibrator</span>

        {/* panorama picker */}
        <select
          value={panoIdx}
          onChange={(e) => { setPanoIdx(Number(e.target.value)); setPins([]); }}
          style={{ background: "#1e2f40", color: "#fff", border: "1px solid #3a5068", borderRadius: 6, padding: "4px 8px", fontSize: 13 }}
        >
          {allPanos.map((p, i) => (
            <option key={i} value={i}>{p.label}</option>
          ))}
        </select>

        {/* live angles badge */}
        <div style={{ background: "#1e2f40", border: "1px solid #3a5068", borderRadius: 6, padding: "4px 12px", fontSize: 13 }}>
          az: <b style={{ color: "#5fb3b3" }}>{liveAz}°</b> &nbsp; el: <b style={{ color: "#5fb3b3" }}>{liveEl}°</b>
        </div>

        {/* add pin */}
        <input
          value={nextLabel}
          onChange={(e) => setNextLabel(e.target.value)}
          placeholder="label (e.g. bedroom)"
          style={{ background: "#1e2f40", color: "#fff", border: "1px solid #3a5068", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 160 }}
        />
        <button
          onClick={addPin}
          style={{ background: "#f05c4a", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 13, cursor: "pointer", fontWeight: 700 }}
        >
          + Pin here
        </button>

        <span style={{ fontSize: 12, color: "#7a9ab5" }}>Drag to look around → center crosshair shows current angles → click "Pin here" to drop a marker</span>
      </div>

      {/* ── canvas ── */}
      <div style={{ position: "relative", flex: 1 }}>
        {/* crosshair */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 10 }}>
          <svg width={40} height={40} style={{ opacity: 0.85 }}>
            <line x1={20} y1={4} x2={20} y2={36} stroke="#f05c4a" strokeWidth={2} />
            <line x1={4} y1={20} x2={36} y2={20} stroke="#f05c4a" strokeWidth={2} />
            <circle cx={20} cy={20} r={4} fill="none" stroke="#f05c4a" strokeWidth={2} />
          </svg>
        </div>

        <Canvas
          key={panoUrl}
          style={{ width: "100%", height: "100%" }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 0.052], fov: 108, near: 0.078, far: 8000 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <EquirectSphere key={panoUrl} imageUrl={panoUrl} />
          </Suspense>

          <LiveAngles onChange={handleAngles} />

          {pins.map((pin) => (
            <PinMarker key={pin.id} pin={pin} onRemove={removePin} />
          ))}

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

      {/* ── bottom panel ── */}
      <div style={{ background: "#111d2b", borderTop: "1px solid #1e2f40", padding: "10px 16px", maxHeight: 200, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f05c4a" }}>Placed pins ({pins.length})</span>
          {pins.length > 0 && (
            <>
              <button
                onClick={copyCode}
                style={{ background: "#1e2f40", color: "#5fb3b3", border: "1px solid #3a5068", borderRadius: 6, padding: "3px 12px", fontSize: 12, cursor: "pointer" }}
              >
                Copy code
              </button>
              <button
                onClick={() => setPins([])}
                style={{ background: "#1e2f40", color: "#e87070", border: "1px solid #3a5068", borderRadius: 6, padding: "3px 12px", fontSize: 12, cursor: "pointer" }}
              >
                Clear all
              </button>
            </>
          )}
        </div>

        {pins.length === 0 ? (
          <p style={{ fontSize: 12, color: "#4a6880", margin: 0 }}>No pins yet. Drag to look at a doorway, then click "+ Pin here".</p>
        ) : (
          <pre style={{ fontSize: 12, color: "#c8dce8", margin: 0, lineHeight: 1.6 }}>
            {codeOutput}
          </pre>
        )}
      </div>
    </div>
  );
}
