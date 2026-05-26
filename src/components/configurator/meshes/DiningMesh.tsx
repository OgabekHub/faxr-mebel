import React from 'react';

interface MeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const DiningMesh: React.FC<MeshProps> = ({
  fabricColor,
  woodColor,
  roughness,
  metalness,
}) => {
  // Chair helper component to render 4 identical chairs
  const Chair = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Chair Backrest */}
      <mesh position={[0, 0.6, -0.18]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.42, 0.08]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Chair Legs (wood color) */}
      <mesh position={[-0.17, 0.12, 0.17]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.28, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.17, 0.12, 0.17]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.28, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-0.17, 0.12, -0.17]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.28, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.17, 0.12, -0.17]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.28, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, -0.4, 0]}>
      {/* ── TABLE ── */}
      {/* Table Top (Wood Color) */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.05, 1.0]} />
        <meshStandardMaterial color={woodColor} roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Table Legs (Wood Color) */}
      <mesh position={[-0.75, 0.35, 0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.7, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.75, 0.35, 0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.7, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-0.75, 0.35, -0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.7, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.75, 0.35, -0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.7, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Center Table Runner/Tray (Decorative) */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.8, 0.01, 0.35]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>

      {/* ── CHAIRS ── */}
      <Chair position={[-0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Chair position={[0.6, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Chair position={[-0.2, 0, 0.48]} rotation={[0, 0, 0]} />
      <Chair position={[0.2, 0, -0.48]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};
