"use client";

import { Bounds, useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type RoofStyle = "asphalt" | "metal";

/** Matches sidebar “Siding options” — drives wall pattern meshes in the GLB. */
export type SidingId = "default-stucco" | "board-batten" | "vertical-tg" | "horizontal-lap";

/** Main + side-room pattern overlays — only the pair for the selected siding stays visible. */
const WALL_PATTERN_MESH_NAMES = [
  "Horizontal_Wall_Pattern",
  "Batten_Wall_Pattern",
  "Vertical_Wall_Pattern",
  "Horizontal_Wall_Pattern_For_Side_Room",
  "Batten_Wall_Pattern_For_Side_Room",
  "Vertical_Wall_Pattern_For_Side_Room",
] as const;

function sidingPatternVisibleNames(sidingId: SidingId): ReadonlySet<string> {
  switch (sidingId) {
    case "default-stucco":
      return new Set();
    case "vertical-tg":
      return new Set(["Vertical_Wall_Pattern", "Vertical_Wall_Pattern_For_Side_Room"]);
    case "horizontal-lap":
      return new Set(["Horizontal_Wall_Pattern", "Horizontal_Wall_Pattern_For_Side_Room"]);
    case "board-batten":
      return new Set(["Batten_Wall_Pattern", "Batten_Wall_Pattern_For_Side_Room"]);
    default:
      return new Set();
  }
}

/** Exact `object.name` from GLB — include aliases if exports differ (case/underscores). */
const ASPHALT_ROOF_NAMES = [
  "Asphalt_Roof",
  "Asphalt_Side_Room_Roof",
  "Asphalt_Side_Roof",
] as const;

const METAL_ROOF_NAMES = [
  "Metal_Roof_Sheet",
  "SideRoom_Meatal_Root_Sheet",
  "SideRoom_Metal_Roof_Base",
  "SideRoom__Metal_Roof_Base",
  "Sideroom_Meatal_Root_sheet",
  "Sideroom_Metal_Root_Base",
] as const;
const OUTER_WALL_NAME = "Outer_Wall";

/** Right sidebar “Deck” — only these meshes (under Deck_Portion in GLB). */
const DECK_SLAB_NAMES = ["Base_Support", "Wooden_Base", "Wooden_Step"] as const;
/** Right sidebar “Covered Lanai”. */
const LANAI_MESH_NAMES = ["Frontal_Roof", "Pillars"] as const;
const SHOWER_PORTION_NAME = "Shower_Portion";

type ConfiguratorModelProps = {
  url: string;
  roofStyle: RoofStyle;
  /** Hex e.g. `#EDE7E1`, or `null` to restore GLB-authored wall colors. */
  wallTint: string | null;
  sidingId: SidingId;
  showDeckSlab: boolean;
  showLanaiMeshes: boolean;
  showShowerPortion: boolean;
};

function wallMaterials(mesh: THREE.Mesh): THREE.Material[] {
  const m = mesh.material;
  if (!m) return [];
  return Array.isArray(m) ? m : [m];
}

/** GLB meshes named in Blender/GLTF — roof + wall tint from sidebar. */
export function ConfiguratorModel({
  url,
  roofStyle,
  wallTint,
  sidingId,
  showDeckSlab,
  showLanaiMeshes,
  showShowerPortion,
}: ConfiguratorModelProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const wallColorBaseRef = useRef<Map<THREE.Material, THREE.Color>>(new Map());

  useLayoutEffect(() => {
    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) mesh.castShadow = true;
    });

    const map = new Map<THREE.Material, THREE.Color>();
    const wallRoot = cloned.getObjectByName(OUTER_WALL_NAME);
    if (wallRoot) {
      wallRoot.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        for (const mat of wallMaterials(mesh)) {
          if ("color" in mat && mat.color instanceof THREE.Color) {
            map.set(mat, mat.color.clone());
          }
        }
      });
    }
    wallColorBaseRef.current = map;
  }, [cloned]);

  useLayoutEffect(() => {
    const showAsphalt = roofStyle === "asphalt";
    const showMetal = roofStyle === "metal";
    cloned.traverse((o) => {
      if ((ASPHALT_ROOF_NAMES as readonly string[]).includes(o.name)) o.visible = showAsphalt;
      if ((METAL_ROOF_NAMES as readonly string[]).includes(o.name)) o.visible = showMetal;
    });
  }, [cloned, roofStyle]);

  useLayoutEffect(() => {
    const patternVisible = sidingPatternVisibleNames(sidingId);

    cloned.traverse((o) => {
      if ((DECK_SLAB_NAMES as readonly string[]).includes(o.name)) o.visible = showDeckSlab;
      if ((LANAI_MESH_NAMES as readonly string[]).includes(o.name)) o.visible = showLanaiMeshes;
      if (o.name === SHOWER_PORTION_NAME) o.visible = showShowerPortion;
      if ((WALL_PATTERN_MESH_NAMES as readonly string[]).includes(o.name)) {
        o.visible = patternVisible.has(o.name);
      }
    });
  }, [cloned, sidingId, showDeckSlab, showLanaiMeshes, showShowerPortion]);

  useLayoutEffect(() => {
    const wallRoot = cloned.getObjectByName(OUTER_WALL_NAME);
    const baseMap = wallColorBaseRef.current;
    if (!wallRoot || baseMap.size === 0) return;

    wallRoot.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      for (const mat of wallMaterials(mesh)) {
        if (!("color" in mat) || !(mat.color instanceof THREE.Color)) continue;
        const m = mat as THREE.MeshStandardMaterial;
        if (wallTint === null) {
          const base = baseMap.get(mat);
          if (base) m.color.copy(base);
        } else {
          m.color.setStyle(wallTint);
        }
        m.needsUpdate = true;
      }
    });
  }, [cloned, wallTint]);

  return (
    <Bounds fit observe={false} margin={1.06}>
      <primitive object={cloned} />
    </Bounds>
  );
}
