import React from 'react';

interface MeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const KitchenMesh: React.FC<MeshProps> = ({
  fabricColor,
  woodColor,
  roughness,
  metalness,
}) => {
  return (
    <group position={[0, -0.4, 0]}>
      {/* ── LOWER CABINETS (fabricColor) ── */}
      {/* Main Bottom Base Box */}
      <mesh position={[0, 0.4, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.76, 0.65]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Kickplate (bottom dark recess) */}
      <mesh position={[0, 0.06, -0.18]} castShadow>
        <boxGeometry args={[2.2, 0.12, 0.6]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>

      {/* ── COUNTERTOP (Marble or Solid Luxury Slab) ── */}
      <mesh position={[0, 0.8, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[2.24, 0.05, 0.67]} />
        <meshStandardMaterial color="#F4F4F6" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Sink Cutout Area / Metallic sink basin */}
      <mesh position={[-0.5, 0.81, -0.15]} castShadow>
        <boxGeometry args={[0.5, 0.01, 0.45]} />
        <meshStandardMaterial color="#8E8E93" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Faucet (cylinder curve representation) */}
      <group position={[-0.5, 0.82, -0.32]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} /> {/* Gold faucet */}
        </mesh>
        <mesh position={[0, 0.1, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* ── BACKSPLASH / BACKGROUND WALL (Wood Color Panel) ── */}
      <mesh position={[0, 1.25, -0.48]} receiveShadow>
        <boxGeometry args={[2.2, 0.84, 0.04]} />
        <meshStandardMaterial color={woodColor} roughness={0.4} metalness={0.0} />
      </mesh>

      {/* ── UPPER CABINETS (fabricColor or WoodColor for premium two-tone look) ── */}
      <mesh position={[0, 1.8, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.6, 0.38]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Cabinet Door Dividers / Panels (subtle lines) */}
      {/* Upper doors */}
      <mesh position={[-0.55, 1.8, -0.1]} castShadow>
        <boxGeometry args={[0.01, 0.58, 0.02]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 1.8, -0.1]} castShadow>
        <boxGeometry args={[0.01, 0.58, 0.02]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>
      {/* Lower doors */}
      <mesh position={[-0.55, 0.4, 0.13]} castShadow>
        <boxGeometry args={[0.01, 0.72, 0.02]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 0.4, 0.13]} castShadow>
        <boxGeometry args={[0.01, 0.72, 0.02]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.9} />
      </mesh>

      {/* Premium Metallic Handles (Gold/Brass Accent) */}
      {/* Lower Handles */}
      <mesh position={[-0.6, 0.65, 0.14]} castShadow>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.65, 0.14]} castShadow>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Upper Handles */}
      <mesh position={[-0.6, 1.58, -0.09]} castShadow>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0.6, 1.58, -0.09]} castShadow>
        <boxGeometry args={[0.02, 0.12, 0.02]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
};
