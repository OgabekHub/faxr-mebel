import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SofaMeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const SofaMesh: React.FC<SofaMeshProps> = ({
  fabricColor,
  woodColor,
  roughness,
  metalness,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const fab = new THREE.Color(fabricColor);
  const wood = new THREE.Color(woodColor);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* ── Seat base ── */}
      <mesh position={[0, 0.18, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.28, 1.05]} />
        <meshStandardMaterial
          color={fab}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* ── Seat cushions (3 sections with gaps) ── */}
      {[-0.88, 0, 0.88].map((x, i) => (
        <mesh key={i} position={[x, 0.38, 0.05]} castShadow>
          <boxGeometry args={[0.82, 0.18, 0.98]} />
          <meshStandardMaterial
            color={fab}
            roughness={Math.min(roughness + 0.1, 1)}
            metalness={metalness * 0.5}
          />
        </mesh>
      ))}

      {/* ── Back rest ── */}
      <mesh position={[0, 0.72, -0.42]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.72, 0.22]} />
        <meshStandardMaterial
          color={fab}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* ── Back cushions (3 sections) ── */}
      {[-0.88, 0, 0.88].map((x, i) => (
        <mesh key={i} position={[x, 0.72, -0.3]} castShadow>
          <boxGeometry args={[0.82, 0.68, 0.14]} />
          <meshStandardMaterial
            color={fab}
            roughness={Math.min(roughness + 0.05, 1)}
            metalness={metalness * 0.3}
          />
        </mesh>
      ))}

      {/* ── Left armrest ── */}
      <mesh position={[-1.3, 0.52, 0.0]} castShadow>
        <boxGeometry args={[0.2, 0.58, 1.1]} />
        <meshStandardMaterial color={fab} roughness={roughness} metalness={metalness} />
      </mesh>
      {/* armrest top pad */}
      <mesh position={[-1.3, 0.84, 0.0]} castShadow>
        <boxGeometry args={[0.22, 0.1, 1.1]} />
        <meshStandardMaterial color={fab} roughness={Math.min(roughness + 0.1, 1)} metalness={0} />
      </mesh>

      {/* ── Right armrest ── */}
      <mesh position={[1.3, 0.52, 0.0]} castShadow>
        <boxGeometry args={[0.2, 0.58, 1.1]} />
        <meshStandardMaterial color={fab} roughness={roughness} metalness={metalness} />
      </mesh>
      {/* armrest top pad */}
      <mesh position={[1.3, 0.84, 0.0]} castShadow>
        <boxGeometry args={[0.22, 0.1, 1.1]} />
        <meshStandardMaterial color={fab} roughness={Math.min(roughness + 0.1, 1)} metalness={0} />
      </mesh>

      {/* ── Legs (6 legs — tapered cylinder) ── */}
      {[
        [-1.1, -0.4],
        [0, -0.4],
        [1.1, -0.4],
        [-1.1, 0.45],
        [0, 0.45],
        [1.1, 0.45],
      ].map(([lx, lz], i) => (
        <mesh key={i} position={[lx as number, -0.14, lz as number]} castShadow>
          <cylinderGeometry args={[0.045, 0.035, 0.28, 8]} />
          <meshStandardMaterial
            color={wood}
            roughness={0.55}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
};
