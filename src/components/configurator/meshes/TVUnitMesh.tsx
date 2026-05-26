import React from 'react';
import * as THREE from 'three';

interface TVUnitMeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const TVUnitMesh: React.FC<TVUnitMeshProps> = ({ fabricColor, woodColor, roughness, metalness }) => {
  const cab = new THREE.Color(fabricColor);
  const wood = new THREE.Color(woodColor);

  return (
    <group position={[0, -0.52, 0]}>

      {/* ════ MAIN BODY ════ */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.6, 0.52]} />
        <meshStandardMaterial color={cab} roughness={roughness} metalness={metalness * 0.4} />
      </mesh>

      {/* ════ DRAWERS (3 sections) ════ */}
      {/* Left drawer section */}
      <mesh position={[-0.98, 0.3, 0.27]} castShadow>
        <boxGeometry args={[0.72, 0.54, 0.04]} />
        <meshStandardMaterial color={new THREE.Color(cab).multiplyScalar(1.08)} roughness={Math.max(roughness - 0.1, 0)} metalness={metalness * 0.6} />
      </mesh>

      {/* Right drawer section (2 drawers) */}
      {[0.14, 0.42].map((y, i) => (
        <mesh key={i} position={[0.98, y + 0.08, 0.27]} castShadow>
          <boxGeometry args={[0.72, 0.22, 0.04]} />
          <meshStandardMaterial color={new THREE.Color(cab).multiplyScalar(1.08)} roughness={Math.max(roughness - 0.1, 0)} metalness={metalness * 0.6} />
        </mesh>
      ))}

      {/* Center open shelf */}
      <mesh position={[0, 0.3, 0.26]} castShadow>
        <boxGeometry args={[0.82, 0.54, 0.02]} />
        <meshStandardMaterial color={wood} roughness={0.4} metalness={0.05} transparent opacity={0.35} />
      </mesh>

      {/* ════ HANDLES ════ */}
      {/* Left drawer handle */}
      <mesh position={[-0.98, 0.3, 0.3]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
        <meshStandardMaterial color={new THREE.Color('#c0c0c0')} roughness={0.15} metalness={0.95} />
      </mesh>
      {/* Right drawer handles */}
      {[0.22, 0.5].map((y, i) => (
        <mesh key={i} position={[0.98, y, 0.3]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
          <meshStandardMaterial color={new THREE.Color('#c0c0c0')} roughness={0.15} metalness={0.95} />
        </mesh>
      ))}

      {/* ════ TOP SURFACE (wood) ════ */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[2.82, 0.05, 0.54]} />
        <meshStandardMaterial color={wood} roughness={0.3} metalness={0.08} />
      </mesh>

      {/* ════ LEGS / BASE STRIP ════ */}
      {[-1.22, 0, 1.22].map((x, i) => (
        <mesh key={i} position={[x, 0.04, 0]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.48]} />
          <meshStandardMaterial color={wood} roughness={0.45} metalness={0.06} />
        </mesh>
      ))}

      {/* ════ TV SCREEN (decorative) ════ */}
      <mesh position={[0, 1.22, -0.01]} castShadow>
        <boxGeometry args={[1.9, 1.12, 0.06]} />
        <meshStandardMaterial color={new THREE.Color('#111111')} roughness={0.05} metalness={0.2} />
      </mesh>
      {/* Screen bezel */}
      <mesh position={[0, 1.22, 0.02]}>
        <boxGeometry args={[1.82, 1.04, 0.02]} />
        <meshStandardMaterial color={new THREE.Color('#050505')} roughness={0.02} metalness={0.1} />
      </mesh>
      {/* TV stand */}
      <mesh position={[0, 0.69, -0.01]} castShadow>
        <boxGeometry args={[0.18, 0.02, 0.06]} />
        <meshStandardMaterial color={new THREE.Color('#222')} roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
};
