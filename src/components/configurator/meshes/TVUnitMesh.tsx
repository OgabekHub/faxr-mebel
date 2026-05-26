import React from 'react';

interface MeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const TVUnitMesh: React.FC<MeshProps> = ({
  fabricColor,
  woodColor,
  roughness,
  metalness,
}) => {
  return (
    <group position={[0, -0.4, 0]}>
      {/* ── LOWER CONSOLE TABLE ── */}
      {/* Console Frame (Wood Color) */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.35, 0.45]} />
        <meshStandardMaterial color={woodColor} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Drawer Fronts (fabricColor or custom finish accent) */}
      {/* Left Drawer */}
      <mesh position={[-0.65, 0.28, 0.23]} castShadow>
        <boxGeometry args={[0.6, 0.27, 0.02]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Middle Open Shelf (Inside black slot) */}
      <mesh position={[0, 0.28, 0.21]} castShadow>
        <boxGeometry args={[0.6, 0.25, 0.01]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0.1]} castShadow>
        <boxGeometry args={[0.56, 0.02, 0.3]} />
        <meshStandardMaterial color="#8E8E93" roughness={0.2} metalness={0.8} /> {/* Media device (e.g. console) */}
      </mesh>
      {/* Right Drawer */}
      <mesh position={[0.65, 0.28, 0.23]} castShadow>
        <boxGeometry args={[0.6, 0.27, 0.02]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Drawer Handles (Gold Accent) */}
      <mesh position={[-0.65, 0.28, 0.245]} castShadow>
        <boxGeometry args={[0.08, 0.015, 0.015]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.9} />
      </mesh>
      <mesh position={[0.65, 0.28, 0.245]} castShadow>
        <boxGeometry args={[0.08, 0.015, 0.015]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* ── BACK WALL PANEL (Wood Color) ── */}
      <mesh position={[0, 0.9, -0.21]} receiveShadow>
        <boxGeometry args={[2.0, 0.9, 0.03]} />
        <meshStandardMaterial color={woodColor} roughness={0.45} metalness={0.0} />
      </mesh>

      {/* ── FLOATING UPPER SHELF (Wood Color) ── */}
      <mesh position={[0.4, 1.25, -0.05]} castShadow>
        <boxGeometry args={[1.0, 0.03, 0.25]} />
        <meshStandardMaterial color={woodColor} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Small Decorative Books on Shelf */}
      <mesh position={[0.2, 1.33, -0.05]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.04, 0.12, 0.18]} />
        <meshStandardMaterial color={fabricColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.25, 1.33, -0.05]} rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.05, 0.14, 0.18]} />
        <meshStandardMaterial color="#A8844E" roughness={0.8} />
      </mesh>

      {/* ── TELEVISION (Sleek glossy screen) ── */}
      <group position={[-0.2, 0.8, -0.15]}>
        {/* TV Screen */}
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.6, 0.04]} />
          <meshStandardMaterial color="#111827" roughness={0.1} metalness={0.9} /> {/* TV screen color */}
        </mesh>
        {/* TV Stand Base */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.3, 0.02, 0.25]} />
          <meshStandardMaterial color="#1E1E1E" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* TV Stand Neck */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
          <meshStandardMaterial color="#1E1E1E" roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* ── LEGS ── */}
      <mesh position={[-0.88, 0.05, 0.18]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.1, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.88, 0.05, 0.18]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.1, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-0.88, 0.05, -0.18]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.1, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.88, 0.05, -0.18]} castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.1, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
};
