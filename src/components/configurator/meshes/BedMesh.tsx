import React from 'react';
import * as THREE from 'three';

interface BedMeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const BedMesh: React.FC<BedMeshProps> = ({ fabricColor, woodColor, roughness, metalness }) => {
  const fab = new THREE.Color(fabricColor);
  const wood = new THREE.Color(woodColor);

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Bed frame base ── */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.18, 3.0]} />
        <meshStandardMaterial color={wood} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* ── Mattress ── */}
      <mesh position={[0, 0.36, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.28, 2.6]} />
        <meshStandardMaterial color={new THREE.Color('#f5f0e8')} roughness={0.95} metalness={0} />
      </mesh>

      {/* ── Bedding / blanket ── */}
      <mesh position={[0, 0.52, 0.35]} castShadow>
        <boxGeometry args={[1.98, 0.12, 2.1]} />
        <meshStandardMaterial color={fab} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* ── Pillows (2) ── */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.54, -0.95]} castShadow>
          <boxGeometry args={[0.78, 0.16, 0.52]} />
          <meshStandardMaterial color={fab} roughness={Math.min(roughness + 0.1, 1)} metalness={0} />
        </mesh>
      ))}

      {/* ── Headboard ── */}
      <mesh position={[0, 0.88, -1.42]} castShadow>
        <boxGeometry args={[2.2, 1.0, 0.14]} />
        <meshStandardMaterial color={fab} roughness={roughness} metalness={metalness} />
      </mesh>
      {/* Headboard frame (wood border) */}
      <mesh position={[0, 0.88, -1.48]} castShadow>
        <boxGeometry args={[2.28, 1.08, 0.08]} />
        <meshStandardMaterial color={wood} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* ── Footboard ── */}
      <mesh position={[0, 0.46, 1.52]} castShadow>
        <boxGeometry args={[2.2, 0.44, 0.12]} />
        <meshStandardMaterial color={wood} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* ── Legs (4 corners) ── */}
      {[[-1.02, -1.36], [1.02, -1.36], [-1.02, 1.42], [1.02, 1.42]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx as number, -0.08, lz as number]} castShadow>
          <cylinderGeometry args={[0.055, 0.045, 0.22, 8]} />
          <meshStandardMaterial color={wood} roughness={0.55} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
};
