/**
 * Hotspots sit slightly inside the panorama sphere so they track with the view when the user drags.
 * Tune `azimuthDeg` / `elevationDeg` per room until each marker lines up with a doorway or feature.
 *
 * Convention:
 * - `azimuthDeg`: 0° = straight ahead (-Z). Positive = turn head to the right.
 * - `elevationDeg`: 0° = horizon. Positive = look up.
 */
export type RoomId = "kitchen" | "hall" | "bedroom" | "washroom";

export const ROOM_ORDER: RoomId[] = ["kitchen", "hall", "bedroom", "washroom"];

export const ROOM_LABEL: Record<RoomId, string> = {
  kitchen: "Kitchen",
  hall: "Hall",
  bedroom: "Bedroom",
  washroom: "Washroom",
};

export const ROOM_PATH: Record<RoomId, string> = {
  kitchen: "/3dimages/kitchen.png",
  hall: "/3dimages/hall.png",
  bedroom: "/3dimages/bedroom.png",
  washroom: "/3dimages/washroom.png",
};

export type HotspotDef = {
  to: RoomId;
  azimuthDeg: number;
  elevationDeg: number;
};

/** Distance from origin — keep slightly < EquirectSphere radius (500). */
const HOTSPOT_R = 420;

export function hotspotPosition(
  azimuthDeg: number,
  elevationDeg: number,
  radius: number = HOTSPOT_R,
): [number, number, number] {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  const cosEl = Math.cos(el);
  const sinEl = Math.sin(el);
  const x = radius * cosEl * Math.sin(az);
  const y = radius * sinEl;
  const z = -radius * cosEl * Math.cos(az);
  return [x, y, z];
}

/** Starting guesses — adjust until markers sit on doorways in each panorama. */
export const ROOM_HOTSPOTS: Record<RoomId, HotspotDef[]> = {
  hall: [
    { to: "kitchen", azimuthDeg: 0, elevationDeg: -5 },
    { to: "bedroom", azimuthDeg: 52, elevationDeg: 0 },
    { to: "washroom", azimuthDeg: -118, elevationDeg: -8 },
  ],
  kitchen: [
    { to: "hall", azimuthDeg: 165, elevationDeg: 0 },
    { to: "bedroom", azimuthDeg: -55, elevationDeg: -4 },
  ],
  bedroom: [
    { to: "hall", azimuthDeg: -28, elevationDeg: -2 },
    { to: "washroom", azimuthDeg: 72, elevationDeg: -8 },
    { to: "kitchen", azimuthDeg: 140, elevationDeg: -5 },
  ],
  washroom: [
    { to: "hall", azimuthDeg: -95, elevationDeg: -5 },
    { to: "bedroom", azimuthDeg: 48, elevationDeg: 0 },
  ],
};
