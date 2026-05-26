import React from 'react';
import * as THREE from 'three';

interface KitchenMeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const KitchenMesh: React.FC<KitchenMeshProps> = ({ fabricColor, woodColor, roughness, metalness }) => {
  const cab = new THREE.Color(fabricColor);   // cabinet color = fabric choice
  const wood = new THREE.Color(woodColor);    // countertop / accents

  // Slightly lighter version for upper cabinets
  const cabLight = cab.clone().lerp(new THREE.Color('#ffffff'), 0.12);

  return (
    <group position={[0, -0.85, 0]}>

      {/* ════ LOWER CABINETS ════ */}
      {/* Main lower cabinet body — L-shape left wall */}
      <mesh position={[-0.6, 0.44, -0.62]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.88, 0.62]} />
        <meshStandardMaterial color={cab} roughness={roughness} metalness={metalness * 0.3} />
      </mesh>

      {/* Lower cabinet doors — 4 panels */}
      {[-1.3, -0.65, 0, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0.44, -0.3]} castShadow>
          <boxGeometry args={[0.56, 0.82, 0.04]} />
          <meshStandardMaterial color={cab} roughness={Math.max(roughness - 0.1, 0)} metalness={metalness * 0.5} />
        </mesh>
      ))}

      {/* Door handles */}
      {[-1.3, -0.65, 0, 0.65].map((x, i) => (
        <mesh key={i} position={[x + 0.2, 0.44, -0.27]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
          <meshStandardMaterial color={new THREE.Color('#c0c0c0')} roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ════ COUNTERTOP ════ */}
      <mesh position={[-0.6, 0.9, -0.58]} castShadow receiveShadow>
        <boxGeometry args={[2.42, 0.06, 0.68]} />
        <meshStandardMaterial color={wood} roughness={0.25} metalness={0.12} />
      </mesh>

      {/* Countertop overhang edge */}
      <mesh position={[-0.6, 0.87, -0.24]} castShadow>
        <boxGeometry args={[2.42, 0.04, 0.04]} />
        <meshStandardMaterial color={new THREE.Color(wood).multiplyScalar(0.9)} roughness={0.2} metalness={0.15} />
      </mesh>

      {/* ════ SINK ════ */}
      <mesh position={[0.55, 0.91, -0.55]} castShadow>
        <boxGeometry args={[0.52, 0.04, 0.4]} />
        <meshStandardMaterial color={new THREE.Color('#e8e8e8')} roughness={0.15} metalness={0.6} />
      </mesh>
      {/* Faucet */}
      <mesh position={[0.55, 1.04, -0.56]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
        <meshStandardMaterial color={new THREE.Color('#d0d0d0')} roughness={0.1} metalness={0.95} />
      </mesh>

      {/* ════ UPPER CABINETS ════ */}
      <mesh position={[-0.6, 1.56, -0.72]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.72, 0.42]} />
        <meshStandardMaterial color={cabLight} roughness={roughness} metalness={metalness * 0.3} />
      </mesh>

      {/* Upper cabinet doors */}
      {[-1.3, -0.65, 0, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 1.56, -0.5]} castShadow>
          <boxGeometry args={[0.56, 0.66, 0.04]} />
          <meshStandardMaterial color={cabLight} roughness={Math.max(roughness - 0.1, 0)} metalness={metalness * 0.5} />
        </mesh>
      ))}

      {/* Upper handles */}
      {[-1.3, -0.65, 0, 0.65].map((x, i) => (
        <mesh key={i} position={[x + 0.2, 1.3, -0.47]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.16, 8]} />
          <meshStandardMaterial color={new THREE.Color('#c0c0c0')} roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* ════ FLOOR BASE ════ */}
      <mesh position={[-0.6, 0.04, -0.62]} receiveShadow>
        <boxGeometry args={[2.4, 0.08, 0.62]} />
        <meshStandardMaterial color={new THREE.Color('#111')} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
};
