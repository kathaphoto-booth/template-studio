'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { wordmarkSvgMarkup, logomarkSvgMarkup } from './brand-geometry';

/**
 * ArchiveEntranceScene — "The Foundry Plate"
 * ------------------------------------------------------------------------
 * The Gilded Archive entrance, rebuilt as a real-material WebGL composition.
 * The five "katha" letterforms are extruded plates: Piña-Ecru faces with a
 * piña-fibre sheen, gilt-bronze extrusion walls (the one warm accent). They
 * rise out of the Kamagong void and settle like type being laid on a copy
 * stand while a single warm key light develops them — a print coming up in
 * the tray. The leaf-K logomark appears exactly once, small, beneath: the
 * foundry's seal. No photography, no spring, no bounce; every movement
 * decelerates with mass.
 *
 * Timeline (seconds from first frame):
 *   0.00–0.70  hairline ecru rule draws across the void
 *   0.45–2.20  letters rise + settle, staggered k → a₂
 *   1.20–2.60  key light develops the faces
 *   2.50–3.30  logomark seal fades in beneath
 *   3.80–      handoff — host fades the overlay and begins content entrance
 */

const VOID = '#161311'; // Kamagong obsidian (matches the prior entrance ground)
const ECRU = '#ECE7DB'; // Piña Ecru bone
const GILT_DARK = '#8A7350'; // gilt speaking on dark — extrusion walls + seal
const KEY_WARM = '#F0DCBC'; // champagne-warmed key light

const HANDOFF_AT = 3.8;

/* Deceleration-only easing — mass, not spring. */
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
/** Normalized phase of [start, start+dur], clamped to [0,1]. */
const phase = (t: number, start: number, dur: number) =>
  Math.min(1, Math.max(0, (t - start) / dur));

function useBrandAssembly() {
  return useMemo(() => {
    const loader = new SVGLoader();

    const buildGeoms = (markup: string, depth: number, bevel: number) => {
      const parsed = loader.parse(markup);
      return parsed.paths.map((p) => {
        const shapes = SVGLoader.createShapes(p);
        return new THREE.ExtrudeGeometry(shapes, {
          depth,
          bevelEnabled: true,
          bevelThickness: bevel,
          bevelSize: bevel,
          bevelSegments: 2,
          curveSegments: 10,
        });
      });
    };

    const center = (geos: THREE.ExtrudeGeometry[]) => {
      const box = new THREE.Box3();
      geos.forEach((g) => {
        g.computeBoundingBox();
        if (g.boundingBox) box.union(g.boundingBox);
      });
      const c = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      geos.forEach((g) => g.translate(-c.x, -c.y, -c.z));
      return size;
    };

    // Wordmark — one geometry per letter path (SVGLoader preserves order).
    const letterGeos = buildGeoms(wordmarkSvgMarkup(), 26, 2.5);
    const wmSize = center(letterGeos);

    // Letter materials: [0] faces + bevel (ecru piña sheen), [1] walls (gilt).
    const letterMats = letterGeos.map(() => {
      const face = new THREE.MeshPhysicalMaterial({
        color: ECRU,
        roughness: 0.55,
        metalness: 0.04,
        sheen: 1,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color('#DCCBB5'),
        clearcoat: 0.12,
        transparent: true,
        opacity: 0,
      });
      const wall = new THREE.MeshStandardMaterial({
        color: GILT_DARK,
        roughness: 0.32,
        metalness: 0.65,
        transparent: true,
        opacity: 0,
      });
      return [face, wall] as [THREE.MeshPhysicalMaterial, THREE.MeshStandardMaterial];
    });

    // Logomark seal — shallow extrusion, small, gilt.
    const sealGeos = buildGeoms(logomarkSvgMarkup(), 40, 4);
    const sealSize = center(sealGeos);
    const sealMat = new THREE.MeshStandardMaterial({
      color: GILT_DARK,
      roughness: 0.4,
      metalness: 0.55,
      transparent: true,
      opacity: 0,
    });

    return { letterGeos, letterMats, wmSize, sealGeos, sealMat, sealSize };
  }, []);
}

/** QA knob: ?tempo=0.25 slows the composition 4× for review. Defaults to 1. */
function qaTempo(): number {
  if (typeof window === 'undefined') return 1;
  const v = parseFloat(new URLSearchParams(window.location.search).get('tempo') || '1');
  return Number.isFinite(v) && v > 0 && v <= 1 ? v : 1;
}

function FoundryPlate({ onHandoff }: { onHandoff: () => void }) {
  const { letterGeos, letterMats, wmSize, sealGeos, sealMat, sealSize } = useBrandAssembly();
  const tempo = useMemo(() => qaTempo(), []);

  // Responsive fit: the wordmark takes 78% of the viewport width (capped for
  // ultrawide), everything else lays out proportionally to its world height.
  const viewport = useThree((s) => s.viewport);
  const layout = useMemo(() => {
    const wordW = Math.min(viewport.width * 0.78, 11);
    const scale = wordW / wmSize.x;
    const wordH = wmSize.y * scale;
    return {
      scale,
      wordW,
      ruleY: wordH * 0.95,
      ruleW: wordW * 1.15,
      rise: wordH * 0.85,
      sealY: -(wordH * 1.25),
      sealScale: (wordH * 0.45) / sealSize.y,
    };
  }, [viewport.width, wmSize, sealSize]);

  const letterRefs = useRef<Array<THREE.Group | null>>([]);
  const sealGroup = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const rule = useRef<THREE.Mesh>(null);
  const ruleMat = useRef<THREE.MeshBasicMaterial>(null);
  const handedOff = useRef(false);

  // Per-frame mutation of THREE objects/materials is the R3F idiom — React
  // never re-renders these; the react-hooks immutability rule can't know that.
  // eslint-disable-next-line react-hooks/immutability
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime() * tempo;

    // Beat 1 — the archive rule draws across.
    if (rule.current && ruleMat.current) {
      const draw = easeInOutCubic(phase(t, 0.0, 0.7));
      rule.current.scale.x = Math.max(draw, 0.0001);
      ruleMat.current.opacity = t < 0.7 ? 0.6 * draw : Math.max(0.18, 0.6 - (t - 0.7) * 0.35);
    }

    // Beat 2 — letters rise and settle, staggered, with mass.
    letterGeos.forEach((_, i) => {
      const g = letterRefs.current[i];
      const [face, wall] = letterMats[i];
      if (!g) return;
      const p = easeOutCubic(phase(t, 0.45 + i * 0.14, 1.15));
      // Inside the y-flipped group: positive y settles downward into place.
      g.position.y = (layout.rise / layout.scale) * (1 - p);
      g.rotation.x = -0.22 * (1 - p);
      face.opacity = p;
      wall.opacity = p;
    });

    // Beat 3 — the key light develops the print.
    if (keyLight.current) keyLight.current.intensity = 2.3 * easeInOutCubic(phase(t, 1.2, 1.4));
    if (ambient.current) ambient.current.intensity = 0.05 + 0.13 * easeInOutCubic(phase(t, 1.2, 1.4));

    // Beat 4 — the foundry seal, once.
    if (sealGroup.current) {
      const p = easeOutCubic(phase(t, 2.5, 0.8));
      // eslint-disable-next-line react-hooks/immutability -- R3F per-frame material mutation
      sealMat.opacity = p;
      sealGroup.current.position.y = layout.sealY - 0.18 * (1 - p);
    }

    // Slow, weighted dolly the whole way through.
    camera.position.z = 14 + 0.9 * easeInOutCubic(phase(t, 0.2, HANDOFF_AT));
    camera.lookAt(0, -0.35, 0);

    if (t >= HANDOFF_AT && !handedOff.current) {
      handedOff.current = true;
      onHandoff();
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.05} color={KEY_WARM} />
      <directionalLight ref={keyLight} position={[-4, 5, 7]} intensity={0} color={KEY_WARM} />
      {/* Faint warm-neutral rim from behind so the dark plates read before the key blooms. */}
      <pointLight position={[3, -2, -6]} intensity={0.5} color={'#4a4238'} />

      {/* The archive rule — a hairline above the wordmark. */}
      <mesh ref={rule} position={[0, layout.ruleY, -0.4]}>
        <boxGeometry args={[layout.ruleW, 0.012, 0.012]} />
        <meshBasicMaterial ref={ruleMat} color={ECRU} transparent opacity={0} />
      </mesh>

      {/* The wordmark — five extruded plates. SVG is y-down: flip Y. */}
      <group scale={[layout.scale, -layout.scale, layout.scale]}>
        {letterGeos.map((geo, i) => (
          <group key={i} ref={(el) => { letterRefs.current[i] = el; }}>
            <mesh geometry={geo} material={letterMats[i]} />
          </group>
        ))}
      </group>

      {/* The foundry seal — the leaf-K, exactly once, beneath. */}
      <group
        ref={sealGroup}
        position={[0, layout.sealY, 0]}
        scale={[layout.sealScale, -layout.sealScale, layout.sealScale]}
      >
        {sealGeos.map((g, i) => (
          <mesh key={i} geometry={g} material={sealMat} />
        ))}
      </group>
    </>
  );
}

export interface ArchiveEntranceSceneProps {
  /** First WebGL frame committed — the host can drop its poster. */
  onReady: () => void;
  /** The composition has resolved — the host fades the overlay. */
  onHandoff: () => void;
}

export default function ArchiveEntranceScene({ onReady, onHandoff }: ArchiveEntranceSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0, 14], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={() => onReady()}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[VOID]} />
      <fog attach="fog" args={[VOID, 13, 24]} />
      <FoundryPlate onHandoff={onHandoff} />
    </Canvas>
  );
}
