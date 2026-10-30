"use client";

import { Bounds, ContactShadows, Environment, Html, Lightformer, OrbitControls, RoundedBox, useBounds, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { GensetBrand } from "@/content/genset-types";
import { COLOURS, SILENCERS, type Config, type Enclosure } from "@/lib/configurator";

/** Stylised, dimensionally true generating set built from primitives (metres; +x = radiator end, y = up). */

const DARK = "#24272c";
const STEEL = "#3a3f47";
const RUBBER = "#141518";
const ENGINE: Record<GensetBrand, string> = { Perkins: "#22509a", Cummins: "#d9ccaa", Kubota: "#7b8591", Baudouin: "#2c66a5", "Lister Petter": "#3d6b4f" };
const LIGHT_PAINTS = new Set(["white", "grey", "beige", "yellow"]);

type V3 = [number, number, number];

function Box({ size, position, color = DARK, metal = 0.25, rough = 0.6, rotation, cast = true, emissive }: { size: V3; position: V3; color?: string; metal?: number; rough?: number; rotation?: V3; cast?: boolean; emissive?: string }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={cast} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} emissive={emissive ?? "#000"} emissiveIntensity={emissive ? 1.4 : 0} />
    </mesh>
  );
}

function Cyl({ r, len, position, color = STEEL, axis = "y", metal = 0.5, rough = 0.4, r2, seg = 28 }: { r: number; len: number; position: V3; color?: string; axis?: "x" | "y" | "z"; metal?: number; rough?: number; r2?: number; seg?: number }) {
  const rot: V3 = axis === "x" ? [0, 0, Math.PI / 2] : axis === "z" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  return (
    <mesh position={position} rotation={rot} castShadow receiveShadow>
      <cylinderGeometry args={[r2 ?? r, r, len, seg]} />
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} />
    </mesh>
  );
}

/** Row of louvre slats on a face. face "z+" / "z-" = long sides, "x+" / "x-" = ends. */
function Louvres({ face, span, y0, y1, at, offset }: { face: "z+" | "z-" | "x+" | "x-"; span: [number, number]; y0: number; y1: number; at: number; offset: number }) {
  const n = Math.max(3, Math.floor((y1 - y0) / 0.075));
  const width = Math.abs(span[1] - span[0]);
  const mid = (span[0] + span[1]) / 2;
  const sign = face.endsWith("+") ? 1 : -1;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const y = y0 + ((i + 0.5) * (y1 - y0)) / n;
        const p: V3 = face.startsWith("z") ? [mid, y, at + sign * offset] : [at + sign * offset, y, mid];
        const s: V3 = face.startsWith("z") ? [width, 0.022, 0.03] : [0.03, 0.022, width];
        const r: V3 = face.startsWith("z") ? [sign * -0.5, 0, 0] : [0, 0, sign * 0.5];
        return <Box key={i} size={s} position={p} rotation={r} color={DARK} cast={false} />;
      })}
      <Box size={face.startsWith("z") ? [width + 0.04, y1 - y0 + 0.04, 0.01] : [0.01, y1 - y0 + 0.04, width + 0.04]} position={face.startsWith("z") ? [mid, (y0 + y1) / 2, at + sign * 0.004] : [at + sign * 0.004, (y0 + y1) / 2, mid]} color="#101114" cast={false} />
    </group>
  );
}

function Logo({ position, rotation, height, onDark }: { position: V3; rotation: V3; height: number; onDark: boolean }) {
  const tex = useTexture(onDark ? "/brand/logo-mark-dark.png" : "/brand/logo-mark-light.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[height * (275 / 375), height]} />
      <meshStandardMaterial map={tex} transparent alphaTest={0.3} roughness={0.5} />
    </mesh>
  );
}

function BlinkLed({ position }: { position: V3 }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.emissiveIntensity = Math.sin(clock.elapsedTime * 4) > 0 ? 2.2 : 0.2;
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.025, 12, 12]} />
      <meshStandardMaterial ref={ref} color="#3ddc84" emissive="#3ddc84" />
    </mesh>
  );
}

function Antenna({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <Box size={[0.16, 0.08, 0.12]} position={[0, 0.04, 0]} color="#e8e8e8" />
      <Cyl r={0.012} len={0.42} position={[0.03, 0.29, 0]} color="#111" />
      <BlinkLed position={[-0.04, 0.09, 0.062]} />
    </group>
  );
}

function RoofSilencer({ x, y, z, len, scale, axis = "x" }: { x: number; y: number; z: number; len: number; scale: number; axis?: "x" | "z" }) {
  const r = 0.13 * Math.sqrt(scale);
  const l = len * scale;
  return (
    <group position={[x, y, z]}>
      <Box size={[0.08, 0.12, 0.08]} position={[axis === "x" ? -l * 0.35 : 0, 0.06, axis === "z" ? -l * 0.35 : 0]} />
      <Box size={[0.08, 0.12, 0.08]} position={[axis === "x" ? l * 0.35 : 0, 0.06, axis === "z" ? l * 0.35 : 0]} />
      <Cyl r={r} len={l} axis={axis} position={[0, 0.12 + r, 0]} color="#8c9097" metal={0.7} rough={0.35} />
      <Cyl r={r * 0.32} len={0.38} position={[axis === "x" ? l / 2 - 0.05 : 0, 0.12 + 2 * r + 0.15, axis === "z" ? l / 2 - 0.05 : 0]} color="#5d6168" />
      <Cyl r={r * 0.32} r2={r * 0.5} len={0.06} position={[axis === "x" ? l / 2 - 0.05 : 0, 0.12 + 2 * r + 0.37, axis === "z" ? l / 2 - 0.05 : 0]} color={DARK} />
    </group>
  );
}

function Canopy({ L, W, H, paint, onDark, silencer, remote }: { L: number; W: number; H: number; paint: string; onDark: boolean; silencer: number; remote: boolean }) {
  const base = Math.max(0.14, H * 0.12);
  const bodyH = H - base;
  const top = H;
  return (
    <group>
      <Box size={[L, base, W]} position={[0, base / 2, 0]} color={DARK} />
      <RoundedBox args={[L, bodyH, W]} radius={Math.min(0.05, W * 0.04)} smoothness={3} position={[0, base + bodyH / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={paint} metalness={0.35} roughness={0.42} />
      </RoundedBox>
      {/* air intake / discharge */}
      <Louvres face="z+" span={[L / 2 - L * 0.24, L / 2 - 0.12]} y0={base + bodyH * 0.18} y1={base + bodyH * 0.82} at={W / 2} offset={0.012} />
      <Louvres face="z-" span={[L / 2 - L * 0.24, L / 2 - 0.12]} y0={base + bodyH * 0.18} y1={base + bodyH * 0.82} at={-W / 2} offset={0.012} />
      <Louvres face="x-" span={[-W * 0.36, W * 0.36]} y0={base + bodyH * 0.15} y1={base + bodyH * 0.8} at={-L / 2} offset={0.012} />
      <Box size={[L * 0.2, 0.03, W * 0.7]} position={[L / 2 - L * 0.14, top + 0.015, 0]} color="#101114" />
      {/* doors */}
      {[-L * 0.12, L * 0.1].map((x) => (
        <group key={x}>
          <Box size={[0.012, bodyH * 0.78, 0.006]} position={[x, base + bodyH / 2, W / 2 + 0.004]} color="#2a2c30" cast={false} />
          <Box size={[0.012, bodyH * 0.78, 0.006]} position={[x, base + bodyH / 2, -W / 2 - 0.004]} color="#2a2c30" cast={false} />
          <Box size={[0.03, 0.12, 0.03]} position={[x - 0.06, base + bodyH * 0.55, W / 2 + 0.02]} color="#9aa0a6" metal={0.8} />
        </group>
      ))}
      {/* control window + e-stop */}
      <Box size={[0.46, 0.34, 0.012]} position={[-L / 2 + L * 0.2, base + bodyH * 0.6, W / 2 + 0.008]} color="#0d1b24" metal={0.1} rough={0.1} />
      <Box size={[0.2, 0.11, 0.004]} position={[-L / 2 + L * 0.2, base + bodyH * 0.62, W / 2 + 0.016]} color="#103040" emissive="#2fa4c9" cast={false} />
      <Cyl r={0.04} len={0.04} axis="z" position={[-L / 2 + L * 0.2 + 0.32, base + bodyH * 0.6, W / 2 + 0.02]} color="#d4211b" metal={0.1} />
      <Logo position={[L * 0.02, base + bodyH * 0.55, W / 2 + 0.006]} rotation={[0, 0, 0]} height={Math.min(0.55, bodyH * 0.42)} onDark={onDark} />
      <Logo position={[L * 0.02, base + bodyH * 0.55, -W / 2 - 0.006]} rotation={[0, Math.PI, 0]} height={Math.min(0.55, bodyH * 0.42)} onDark={onDark} />
      {/* lifting eyes */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (L / 2 - 0.12), top + 0.05, sz * (W / 2 - 0.12)]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.045, 0.014, 10, 20]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} />
          </mesh>
        )),
      )}
      <RoofSilencer x={-L * 0.05} y={top} z={0} len={Math.min(L * 0.3, 1.4)} scale={silencer} />
      {remote && <Antenna position={[-L / 2 + 0.25, top, -W / 2 + 0.2]} />}
    </group>
  );
}

function OpenSet({ L, W, H, engine, silencer, remote }: { L: number; W: number; H: number; engine: string; silencer: number; remote: boolean }) {
  const rail = 0.14;
  const tankH = H * 0.2;
  const deck = rail + tankH;
  const engH = H * 0.42;
  const altR = Math.min(W * 0.32, (H - deck) * 0.38);
  return (
    <group>
      {[-1, 1].map((s) => <Box key={s} size={[L, rail, 0.1]} position={[0, rail / 2, s * W * 0.4]} color={DARK} />)}
      <Box size={[L * 0.92, tankH, W * 0.82]} position={[0, rail + tankH / 2, 0]} color="#2f333a" />
      {/* radiator */}
      <Box size={[0.16, H - deck, W * 0.92]} position={[L / 2 - 0.1, deck + (H - deck) / 2, 0]} color={DARK} />
      <Louvres face="x+" span={[-W * 0.4, W * 0.4]} y0={deck + 0.08} y1={H - 0.08} at={L / 2 - 0.02} offset={0.01} />
      <mesh position={[L / 2 - 0.2, deck + (H - deck) / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[Math.min(W, H - deck) * 0.36, 0.02, 8, 40]} />
        <meshStandardMaterial color="#6b7078" metalness={0.6} />
      </mesh>
      {/* engine */}
      <Box size={[L * 0.36, engH, W * 0.5]} position={[L * 0.12, deck + engH / 2, 0]} color={engine} metal={0.35} rough={0.45} />
      <RoundedBox args={[L * 0.3, engH * 0.2, W * 0.34]} radius={0.03} position={[L * 0.12, deck + engH * 1.1, 0]} castShadow>
        <meshStandardMaterial color="#202226" metalness={0.5} roughness={0.35} />
      </RoundedBox>
      <Cyl r={W * 0.11} len={W * 0.2} axis="z" position={[L * 0.02, deck + engH * 0.85, W * 0.33]} color="#9aa0a6" metal={0.8} />
      <Cyl r={W * 0.1} len={L * 0.18} axis="x" position={[L * 0.2, deck + engH * 1.35, -W * 0.18]} color="#1b1d21" metal={0.2} rough={0.7} />
      {/* alternator */}
      <Cyl r={altR} len={L * 0.27} axis="x" position={[-L * 0.2, deck + altR + 0.06, 0]} color={STEEL} metal={0.55} />
      <Cyl r={altR * 0.9} len={0.06} axis="x" position={[-L * 0.2 - L * 0.135 - 0.03, deck + altR + 0.06, 0]} color="#1b1d21" />
      <Box size={[L * 0.12, altR * 0.5, W * 0.3]} position={[-L * 0.2, deck + 2 * altR + 0.06 + altR * 0.25, 0]} color={STEEL} />
      {/* control panel on stand */}
      <Box size={[0.05, H * 0.45, 0.05]} position={[-L / 2 + 0.2, deck + H * 0.22, W * 0.32]} color={DARK} />
      <Box size={[0.42, 0.4, 0.2]} position={[-L / 2 + 0.2, deck + H * 0.5, W * 0.32]} color="#d9dbde" metal={0.3} />
      <Box size={[0.2, 0.11, 0.01]} position={[-L / 2 + 0.2, deck + H * 0.52, W * 0.32 + 0.106]} color="#103040" emissive="#2fa4c9" cast={false} />
      <RoofSilencer x={L * 0.12} y={deck + engH * 1.25} z={0} len={Math.min(L * 0.26, 1.2)} scale={silencer} />
      {remote && <Antenna position={[-L / 2 + 0.2, deck + H * 0.7, W * 0.32]} />}
    </group>
  );
}

function Container({ L, W, H, paint, onDark, silencer, remote, forty }: { L: number; W: number; H: number; paint: string; onDark: boolean; silencer: number; remote: boolean; forty: boolean }) {
  const ribs = Math.floor(L / 0.28);
  return (
    <group>
      <Box size={[L, H, W]} position={[0, H / 2, 0]} color={paint} metal={0.3} rough={0.5} />
      {[-1, 1].map((s) =>
        Array.from({ length: ribs }, (_, i) => (
          <Box key={`${s}-${i}`} size={[0.1, H * 0.86, 0.03]} position={[-L / 2 + 0.2 + i * ((L - 0.4) / Math.max(1, ribs - 1)), H / 2, s * (W / 2 + 0.012)]} color={paint} metal={0.3} rough={0.5} cast={false} />
        )),
      )}
      {/* rails & corner castings */}
      {[0.06, H - 0.06].map((y) => [-1, 1].map((s) => <Box key={`${y}${s}`} size={[L, 0.12, 0.06]} position={[0, y, s * (W / 2 + 0.01)]} color={DARK} />))}
      {[-1, 1].flatMap((sx) => [-1, 1].flatMap((sz) => [0.09, H - 0.09].map((y) => <Box key={`${sx}${sz}${y}`} size={[0.18, 0.18, 0.18]} position={[sx * (L / 2 - 0.08), y, sz * (W / 2 - 0.08)]} color={DARK} />)))}
      {/* doors with locking bars at the rear end */}
      <Box size={[0.012, H * 0.9, 0.01]} position={[-L / 2 - 0.006, H / 2, 0]} color="#2a2c30" cast={false} />
      {[-0.75, -0.3, 0.3, 0.75].map((z) => <Cyl key={z} r={0.02} len={H * 0.86} position={[-L / 2 - 0.03, H / 2, z * (W / 2)]} color="#9aa0a6" metal={0.8} />)}
      {/* intake & discharge */}
      <Louvres face="x+" span={[-W * 0.4, W * 0.4]} y0={H * 0.15} y1={H * 0.85} at={L / 2} offset={0.012} />
      <Louvres face="z+" span={[-L / 2 + 0.5, -L / 2 + 1.6]} y0={H * 0.2} y1={H * 0.8} at={W / 2} offset={0.03} />
      <Louvres face="z-" span={[-L / 2 + 0.5, -L / 2 + 1.6]} y0={H * 0.2} y1={H * 0.8} at={-W / 2} offset={0.03} />
      <Box size={[1.4, 0.04, W * 0.8]} position={[L / 2 - 1, H + 0.02, 0]} color="#101114" />
      <Logo position={[0, H * 0.55, W / 2 + 0.03]} rotation={[0, 0, 0]} height={1.05} onDark={onDark} />
      <Logo position={[0, H * 0.55, -W / 2 - 0.03]} rotation={[0, Math.PI, 0]} height={1.05} onDark={onDark} />
      {(forty ? [-L * 0.18, L * 0.12] : [-L * 0.08]).map((x) => (
        <RoofSilencer key={x} x={x} y={H} z={0} len={1.6} scale={silencer} />
      ))}
      {remote && <Antenna position={[-L / 2 + 0.4, H, -W / 2 + 0.3]} />}
    </group>
  );
}

function Trailer({ L, W, lift }: { L: number; W: number; lift: number }) {
  const r = 0.34;
  const axles = L > 3.2 ? [-L * 0.12, L * 0.12] : [0];
  return (
    <group>
      {[-1, 1].map((s) => <Box key={s} size={[L * 1.02, 0.12, 0.1]} position={[0, lift - 0.06, s * W * 0.42]} color={DARK} />)}
      {axles.map((x) => (
        <group key={x}>
          <Cyl r={0.05} len={W + 0.5} axis="z" position={[x, r, 0]} color={DARK} />
          {[-1, 1].map((s) => (
            <group key={s}>
              <Cyl r={r} len={0.22} axis="z" position={[x, r, s * (W / 2 + 0.2)]} color={RUBBER} metal={0} rough={0.9} seg={36} />
              <Cyl r={r * 0.55} len={0.235} axis="z" position={[x, r, s * (W / 2 + 0.2)]} color="#b8bcc2" metal={0.8} />
              <Box size={[r * 2.6, 0.03, 0.3]} position={[x, 2 * r + 0.06, s * (W / 2 + 0.2)]} color={DARK} />
            </group>
          ))}
        </group>
      ))}
      {/* drawbar & jockey wheel */}
      {[-1, 1].map((s) => (
        <Box key={s} size={[1.45, 0.08, 0.08]} position={[L / 2 + 0.6, lift - 0.08, s * W * 0.2]} rotation={[0, s * 0.32, 0]} color={DARK} />
      ))}
      <Cyl r={0.06} len={0.12} axis="x" position={[L / 2 + 1.3, lift - 0.08, 0]} color="#9aa0a6" metal={0.8} />
      <Cyl r={0.025} len={lift - 0.12} position={[L / 2 + 1.0, (lift - 0.12) / 2 + 0.1, 0]} color={DARK} />
      <Cyl r={0.08} len={0.06} axis="z" position={[L / 2 + 1.0, 0.08, 0]} color={RUBBER} />
    </group>
  );
}

function AtsCabinet({ amps, sync, position }: { amps: number; sync: boolean; position: V3 }) {
  const h = amps > 1600 ? 2.2 : amps > 400 ? 2 : 1.8;
  const w = (amps > 1600 ? 1.2 : amps > 400 ? 0.8 : 0.6) * (sync ? 2 : 1);
  const d = amps > 1600 ? 0.8 : 0.6;
  return (
    <group position={position}>
      <Box size={[w + 0.04, 0.1, d + 0.04]} position={[0, 0.05, 0]} color={DARK} />
      <Box size={[w, h, d]} position={[0, 0.1 + h / 2, 0]} color="#c9ccce" metal={0.3} rough={0.5} />
      {Array.from({ length: sync ? 2 : 1 }, (_, i) => {
        const x = -w / 2 + (w / (sync ? 2 : 1)) * (i + 0.5);
        return (
          <group key={i}>
            <Box size={[0.01, h * 0.94, 0.006]} position={[x + w / (sync ? 4 : 2) - 0.01, 0.1 + h / 2, d / 2 + 0.004]} color="#2a2c30" cast={false} />
            <Box size={[0.03, 0.18, 0.03]} position={[x + w / (sync ? 4 : 2) - 0.08, 0.1 + h * 0.5, d / 2 + 0.02]} color="#2b2e33" />
            {["#3ddc84", "#e5484d", "#f5c518"].map((c, j) => (
              <mesh key={c} position={[x - 0.1 + j * 0.1, 0.1 + h * 0.82, d / 2 + 0.01]}>
                <sphereGeometry args={[0.025, 12, 12]} />
                <meshStandardMaterial color={c} emissive={c} emissiveIntensity={j === 0 ? 1.6 : 0.25} />
              </mesh>
            ))}
            <Box size={[0.22, 0.12, 0.008]} position={[x, 0.1 + h * 0.68, d / 2 + 0.006]} color="#103040" emissive="#2fa4c9" cast={false} />
          </group>
        );
      })}
    </group>
  );
}

/** Horizontal cylindrical day tank: diameter by size, length from the volume. */
function tankGeom(litres: number) {
  const d = litres >= 5000 ? 1.6 : litres >= 3000 ? 1.4 : litres >= 2000 ? 1.25 : litres >= 1000 ? 1.0 : 0.8;
  return { d, len: litres / 1000 / ((Math.PI * d * d) / 4) };
}

function FuelTank({ litres, position }: { litres: number; position: V3 }) {
  const { d, len } = tankGeom(litres);
  return (
    <group position={position}>
      {[-0.35, 0.35].map((f) => <Box key={f} size={[0.12, 0.3, d * 0.8]} position={[f * len, 0.15, 0]} color={DARK} />)}
      <Cyl r={d / 2} len={len} axis="x" position={[0, 0.3 + d / 2, 0]} color="#e9ecef" metal={0.4} rough={0.35} seg={40} />
      {[-0.5, 0.5].map((f) => (
        <mesh key={f} position={[f * len, 0.3 + d / 2, 0]} scale={[0.25, 1, 1]}>
          <sphereGeometry args={[d / 2, 28, 16]} />
          <meshStandardMaterial color="#e9ecef" metalness={0.4} roughness={0.35} />
        </mesh>
      ))}
      {[-0.2, 0.2].map((f) => <Cyl key={f} r={d / 2 + 0.005} len={0.05} axis="x" position={[f * len, 0.3 + d / 2, 0]} color="#f2bd1d" metal={0.2} />)}
      <Cyl r={0.08} len={0.18} position={[0, 0.3 + d + 0.08, 0]} color={DARK} />
      {/* feed pipe along the ground to the set */}
      <Cyl r={0.03} len={0.9} axis="x" position={[len / 2 + 0.45, 0.04, 0]} color={DARK} />
    </group>
  );
}

function Tag({ position, children }: { position: V3; children: string }) {
  return (
    <Html position={position} center zIndexRange={[20, 0]}>
      <span className="pointer-events-none whitespace-nowrap rounded-full bg-[#0b1022]/85 px-2.5 py-1 text-[11px] font-bold text-[#fff] shadow-lg ring-1 ring-[#fff]/20">{children}</span>
    </Html>
  );
}

function Refit({ deps }: { deps: string }) {
  const api = useBounds();
  useEffect(() => {
    const t = setTimeout(() => api.refresh().clip().fit(), 30);
    return () => clearTimeout(t);
  }, [deps, api]);
  return null;
}

export type SceneLabels = { ats: string; sync: string; tank: string; trailer: string; remote: string };

export type GeneratorSceneProps = {
  brand: GensetBrand;
  code: string;
  config: Config;
  /** outside dimensions in mm of the chosen enclosure */
  dims: { l: number; w: number; h: number };
  atsAmps: number;
  autoRotate: boolean;
  showLabels: boolean;
  labels: SceneLabels;
};

export const GeneratorScene = forwardRef<HTMLCanvasElement, GeneratorSceneProps>(function GeneratorScene({ brand, code, config, dims, atsAmps, autoRotate, showLabels, labels }, ref) {
  const L = dims.l / 1000;
  const W = dims.w / 1000;
  const H = dims.h / 1000;
  const enc: Enclosure = config.enclosure;
  const isContainer = enc === "container20" || enc === "container40";
  const lift = config.trailer ? 0.95 : 0;
  const paint = COLOURS[config.colour].hex;
  const onDark = !LIGHT_PAINTS.has(config.colour);
  const silencer = SILENCERS[config.silencer].scale;
  const gap = isContainer ? 1.6 : 1.1;
  const pitch = W + gap;
  const zs = useMemo(() => Array.from({ length: config.units }, (_, i) => (i - (config.units - 1) / 2) * pitch), [config.units, pitch]);
  const edgeZ = zs[zs.length - 1]! + W / 2;
  const key = JSON.stringify([config, dims]);
  const tank = tankGeom(config.tankL);
  const tankX = -L / 2 - 0.9 - tank.len / 2 - (config.trailer ? 0.4 : 0);
  const atsPos: V3 = [L / 2 - 0.3, 0, edgeZ + 1.6];

  return (
    <Canvas ref={ref} shadows dpr={[1, 2]} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 32, position: [L * 1.4 + 4, H * 1.3 + 2, W * 2 + 6] }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[9, 14, 7]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 6, -8]} scale={[14, 5, 1]} />
        <Lightformer intensity={1.2} position={[-8, 3, 4]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer intensity={1.2} position={[8, 3, 4]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer intensity={0.6} position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} color="#9aa4b4" />
      </Environment>
      <Bounds fit clip observe margin={1.08}>
        <Refit deps={key} />
        <group>
          {zs.map((z, i) => (
            <group key={i} position={[0, 0, z]}>
              {config.trailer && <Trailer L={L} W={W} lift={lift} />}
              <group position={[0, lift, 0]}>
                {enc === "open" && <OpenSet L={L} W={W} H={H} engine={ENGINE[brand]} silencer={silencer} remote={config.remote} />}
                {enc === "canopy" && <Canopy L={L} W={W} H={H} paint={paint} onDark={onDark} silencer={silencer} remote={config.remote} />}
                {isContainer && <Container L={L} W={W} H={H} paint={paint} onDark={onDark} silencer={silencer} remote={config.remote} forty={enc === "container40"} />}
              </group>
            </group>
          ))}
          {config.ats && <AtsCabinet amps={atsAmps} sync={config.units > 1} position={atsPos} />}
          {config.tankL > 0 && <FuelTank litres={config.tankL} position={[tankX, 0, zs[0]!]} />}
        </group>
      </Bounds>
      {showLabels && (
        <>
          <Tag position={[L * 0.15, H + lift + 1.15, zs[zs.length - 1]!]}>{config.units > 1 ? `${config.units} × ${code}` : code}</Tag>
          {config.ats && <Tag position={[atsPos[0], 2.6, atsPos[2]]}>{`${config.units > 1 ? labels.sync : labels.ats} · ${atsAmps} A`}</Tag>}
          {config.tankL > 0 && <Tag position={[tankX, tank.d + 0.75, zs[0]!]}>{`${labels.tank} ${config.tankL.toLocaleString("en")} L`}</Tag>}
          {config.trailer && <Tag position={[0, 0.2, edgeZ + 0.9]}>{labels.trailer}</Tag>}
          {config.remote && <Tag position={[-L / 2 + 0.3, H + lift + 0.75, zs[0]! - W / 2 + 0.2]}>{labels.remote}</Tag>}
        </>
      )}
      <ContactShadows position={[0, 0.001, 0]} scale={Math.max(L, edgeZ * 2) * 3 + 8} blur={2.4} opacity={0.55} far={6} resolution={1024} />
      <OrbitControls makeDefault autoRotate={autoRotate} autoRotateSpeed={0.8} enableDamping maxPolarAngle={Math.PI / 2 - 0.04} minDistance={2} maxDistance={60} />
    </Canvas>
  );
});
