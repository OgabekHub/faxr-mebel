import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { SofaMesh } from './meshes/SofaMesh';
import { BedMesh } from './meshes/BedMesh';
import { DiningMesh } from './meshes/DiningMesh';
import { KitchenMesh } from './meshes/KitchenMesh';
import { TVUnitMesh } from './meshes/TVUnitMesh';
import * as THREE from 'three';

// ─── Camera presets per furniture type ───────────────────────────
const cameraPresets: Record<string, [number, number, number]> = {
  sofa:    [3.2, 1.8, 3.5],
  bedroom: [3.5, 2.2, 4.0],
  dining:  [4.0, 2.8, 4.0],
  kitchen: [3.8, 2.0, 3.8],
  tv:      [3.5, 1.8, 3.5],
};

// ─── Finish → roughness map ───────────────────────────────────────
export const finishRoughness: Record<string, number> = {
  matte: 0.95,
  satin: 0.42,
  gloss: 0.08,
};

export const finishMetalness: Record<string, number> = {
  matte:  0.0,
  satin:  0.04,
  gloss:  0.12,
};

// ─── Animated camera reset on furniture change ────────────────────
const CameraRig: React.FC<{ furnitureId: string }> = ({ furnitureId }) => {
  const { camera } = useThree();
  const target = cameraPresets[furnitureId] || [3.2, 1.8, 3.5];
  const lerp = 0.045;

  useFrame(() => {
    camera.position.x += (target[0] - camera.position.x) * lerp;
    camera.position.y += (target[1] - camera.position.y) * lerp;
    camera.position.z += (target[2] - camera.position.z) * lerp;
  });
  return null;
};

// ─── The 3D scene content ─────────────────────────────────────────
const SceneContent: React.FC<{
  furnitureId: string;
  fabricColor: string;
  woodColor: string;
  finishId: string;
}> = ({ furnitureId, fabricColor, woodColor, finishId }) => {
  const roughness = finishRoughness[finishId] ?? 0.95;
  const metalness = finishMetalness[finishId] ?? 0.0;

  const meshProps = { fabricColor, woodColor, roughness, metalness };

  return (
    <>
      {/* ── Mesh switcher ── */}
      {furnitureId === 'sofa'    && <SofaMesh    {...meshProps} />}
      {furnitureId === 'bedroom' && <BedMesh     {...meshProps} />}
      {furnitureId === 'dining'  && <DiningMesh  {...meshProps} />}
      {furnitureId === 'kitchen' && <KitchenMesh {...meshProps} />}
      {furnitureId === 'tv'      && <TVUnitMesh  {...meshProps} />}

      {/* ── Soft contact shadows ── */}
      <ContactShadows
        position={[0, -0.99, 0]}
        opacity={0.45}
        scale={7}
        blur={2.5}
        far={3}
        color="#000000"
      />

      {/* ── Floor plane (subtle) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f3ef" roughness={1} metalness={0} />
      </mesh>
    </>
  );
};

// ─── Loading fallback ─────────────────────────────────────────────
const SceneLoader: React.FC = () => (
  <mesh>
    <boxGeometry args={[0.1, 0.1, 0.1]} />
    <meshBasicMaterial color="transparent" />
  </mesh>
);

// ─── Main exported component ──────────────────────────────────────
export interface FurnitureSceneProps {
  furnitureId: string;
  fabricColor: string;
  woodColor: string;
  finishId: string;
  className?: string;
}

export const FurnitureScene: React.FC<FurnitureSceneProps> = ({
  furnitureId,
  fabricColor,
  woodColor,
  finishId,
  className,
}) => {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      camera={{
        position: cameraPresets[furnitureId] || [3.2, 1.8, 3.5],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ background: 'transparent' }}
    >
      {/* ── Ambient lighting ── */}
      <ambientLight intensity={0.55} />

      {/* ── Main directional light (sun) ── */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.001}
      />

      {/* ── Fill light (soften shadows) ── */}
      <directionalLight position={[-3, 3, -3]} intensity={0.45} />

      {/* ── Rim light for premium look ── */}
      <pointLight position={[0, 4, -4]} intensity={0.6} color="#fff8ee" />

      {/* ── HDRI-like environment (studio preset) ── */}
      <Environment preset="studio" />

      {/* ── Smooth camera lerp on furniture change ── */}
      <CameraRig furnitureId={furnitureId} />

      {/* ── OrbitControls — user can orbit, zoom, pan ── */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2.5}
        maxDistance={7}
        autoRotate={false}
        dampingFactor={0.08}
        enableDamping={true}
      />

      {/* ── Scene content ── */}
      <Suspense fallback={<SceneLoader />}>
        <SceneContent
          furnitureId={furnitureId}
          fabricColor={fabricColor}
          woodColor={woodColor}
          finishId={finishId}
        />
      </Suspense>
    </Canvas>
  );
};
