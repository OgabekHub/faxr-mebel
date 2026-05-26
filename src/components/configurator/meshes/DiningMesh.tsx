import React from 'react';
import * as THREE from 'three';

interface DiningMeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const DiningMesh: React.FC<DiningMeshProps> = ({ fabricColor, woodColor, roughness, metalness }) => {
  const fab = new THREE.Color(fabricColor);
  const wood = new THREE.Color(woodColor);

  return (
    <group position={[0, -0.65, 0]}>

      {/* ════ TABLE ════ */}
      {/* Table top */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.08, 1.1]} />
        <meshStandardMaterial color={wood} roughness={0.4} metalness={0.08} />
      </mesh>
      {/* Table top edge detail */}
      <mesh position={[0, 0.74, 0]} castShadow>
        <boxGeometry args={[2.38, 0.06, 1.08]} />
        <meshStandardMaterial color={new THREE.Color(wood).multiplyScalar(0.85)} roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Table legs (4) */}
      {[[-1.0, -0.38], [1.0, -0.38], [-1.0, 0.38], [1.0, 0.38]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx as number, 0.36, lz as number]} castShadow>
          <boxGeometry args={[0.07, 0.76, 0.07]} />
          <meshStandardMaterial color={wood} roughness={0.45} metalness={0.05} />
        </mesh>
      ))}

      {/* Table cross support */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[2.05, 0.05, 0.07]} />
        <meshStandardMaterial color={wood} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* ════ CHAIRS (4 around table) ════ */}
      {/* Front-left */}
      <ChairMesh position={[-0.72, 0, 0.88]} rotation={[0, 0, 0]} fab={fab} wood={wood} roughness={roughness} metalness={metalness} />
      {/* Front-right */}
      <ChairMesh position={[0.72, 0, 0.88]} rotation={[0, 0, 0]} fab={fab} wood={wood} roughness={roughness} metalness={metalness} />
      {/* Back-left */}
      <ChairMesh position={[-0.72, 0, -0.88]} rotation={[0, Math.PI, 0]} fab={fab} wood={wood} roughness={roughness} metalness={metalness} />
      {/* Back-right */}
      <ChairMesh position={[0.72, 0, -0.88]} rotation={[0, Math.PI, 0]} fab={fab} wood={wood} roughness={roughness} metalness={metalness} />
    </group>
  );
};

interface ChairProps {
  position: [number, number, number];
  rotation: [number, number, number];
  fab: THREE.Color;
  wood: THREE.Color;
  roughness: number;
  metalness: number;
}

const ChairMesh: React.FC<ChairProps> = ({ position, rotation, fab, wood, roughness, metalness }) => (
  <group position={position} rotation={rotation}>
    {/* Seat */}
    <mesh position={[0, 0.42, 0]} castShadow>
      <boxGeometry args={[0.44, 0.08, 0.44]} />
      <meshStandardMaterial color={fab} roughness={roughness} metalness={metalness} />
    </mesh>
    {/* Seat cushion */}
    <mesh position={[0, 0.48, 0]} castShadow>
      <boxGeometry args={[0.40, 0.06, 0.40]} />
      <meshStandardMaterial color={fab} roughness={Math.min(roughness + 0.1, 1)} metalness={0} />
    </mesh>
    {/* Back */}
    <mesh position={[0, 0.72, -0.18]} castShadow>
      <boxGeometry args={[0.42, 0.44, 0.06]} />
      <meshStandardMaterial color={fab} roughness={roughness} metalness={metalness} />
    </mesh>
    {/* Legs (4) */}
    {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([lx, lz], i) => (
      <mesh key={i} position={[lx as number, 0.2, lz as number]} castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.44, 6]} />
        <meshStandardMaterial color={wood} roughness={0.5} metalness={0.05} />
      </mesh>
    ))}
    {/* Back support legs */}
    {[-0.17, 0.17].map((lx, i) => (
      <mesh key={i} position={[lx, 0.65, -0.18]} castShadow>
        <cylinderGeometry args={[0.022, 0.018, 0.56, 6]} />
        <meshStandardMaterial color={wood} roughness={0.5} metalness={0.05} />
      </mesh>
    ))}
  </group>
);
