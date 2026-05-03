import * as THREE from "three";

/** Bitmap label — works without Troika/font network; safe to build only on the client. */
export function createTapHereLabelTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 140;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, w, h);
  const m = 10;
  const bw = w - m * 2;
  const bh = h - m * 2;
  const r = 22;

  ctx.fillStyle = "#5fb3b3";
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(m, m, bw, bh, r);
  } else {
    ctx.rect(m, m, bw, bh);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 52px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Tap here", w / 2, h / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
