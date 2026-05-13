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
  /** Side-room variant (scene graph name from GLB export). */
  "Asphalt_Roof_For_Side_Room",
] as const;

const METAL_ROOF_NAMES = [
  "Metal_Roof_Sheet",
  "Metal_Roof_Sheet_For_Side_Room",
  "Metal_Roof_Base_For_Side_Room",
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
const SURF_BOARD_NAME = "Surf_Board";

/**
 * Solar assembly roots in `public/3dmodels/*.glb` — toggling these shows/hides
 * all child geometry (panels, holder, hardware). Do not rely on leaf mesh names only.
 */
const SOLAR_ASSEMBLY_ROOT_NAMES = ["Solar_Panel", "Solar_Panel1"] as const;

/** EV charging meshes in the same GLBs. */
const EV_CHARGING_MESH_NAMES = ["BMW_Charger", "EV_Charge_Port", "EV_Charge_Port1"] as const;

/** Outdoor AC unit — “AC” upgrade in sidebar. */
const AC_MESH_NAMES = ["Ac_Outer", "Ac_Outer_Shield", "Ac_Top"] as const;

/** Deck/surf prop — hidden while outdoor shower is on (same area in the GLB). */
const SURF_BOARD_NAMES = ["Surf_Board", "Surfboard", "surf_board"] as const;

function isSurfBoardMeshName(name: string): boolean {
  if ((SURF_BOARD_NAMES as readonly string[]).includes(name)) return true;
  return /^surf_?board$/i.test(name.replace(/\s+/g, "_"));
}

type ConfiguratorModelProps = {
  url: string;
  roofStyle: RoofStyle;
  /** Hex e.g. `#EDE7E1`, or `null` to restore GLB-authored wall colors. */
  wallTint: string | null;
  sidingId: SidingId;
  showDeckSlab: boolean;
  showLanaiMeshes: boolean;
  showShowerPortion: boolean;
  showSolarMeshes: boolean;
  showEvChargingMeshes: boolean;
  showAcMeshes: boolean;
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
  showSolarMeshes,
  showEvChargingMeshes,
  showAcMeshes,
}: ConfiguratorModelProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const wallColorBaseRef = useRef<Map<THREE.Material, THREE.Color>>(new Map());

  useLayoutEffect(() => {
    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
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

  /** One traversal so roof / siding / upgrades never overwrite each other across effects. */
  useLayoutEffect(() => {
    const showAsphalt = roofStyle === "asphalt";
    const showMetal = roofStyle === "metal";
    const patternVisible = sidingPatternVisibleNames(sidingId);

    cloned.traverse((o) => {
      const n = o.name;
      if ((ASPHALT_ROOF_NAMES as readonly string[]).includes(n)) o.visible = showAsphalt;
      if ((METAL_ROOF_NAMES as readonly string[]).includes(n)) o.visible = showMetal;

      if ((DECK_SLAB_NAMES as readonly string[]).includes(n)) o.visible = showDeckSlab;
      if ((LANAI_MESH_NAMES as readonly string[]).includes(n)) o.visible = showLanaiMeshes;
      if (n === SHOWER_PORTION_NAME) o.visible = showShowerPortion;
      if (isSurfBoardMeshName(n)) o.visible = !showShowerPortion;
      if ((WALL_PATTERN_MESH_NAMES as readonly string[]).includes(n)) {
        o.visible = patternVisible.has(n);
      }

      if ((SOLAR_ASSEMBLY_ROOT_NAMES as readonly string[]).includes(n)) o.visible = showSolarMeshes;
      if ((EV_CHARGING_MESH_NAMES as readonly string[]).includes(n)) o.visible = showEvChargingMeshes;
      if ((AC_MESH_NAMES as readonly string[]).includes(n)) o.visible = showAcMeshes;
    });
  }, [
    cloned,
    roofStyle,
    sidingId,
    showDeckSlab,
    showLanaiMeshes,
    showShowerPortion,
    showSolarMeshes,
    showEvChargingMeshes,
    showAcMeshes,
  ]);

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
