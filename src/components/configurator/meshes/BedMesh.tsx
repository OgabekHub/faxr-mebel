import React from 'react';

interface MeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const BedMesh: React.FC<MeshProps> = ({
  fabricColor,
  woodColor,
  roughness,
  metalness,
}) => {
  return (
    <group position={[0, -0.4, 0]}>
      {/* Headboard (large upholstered backboard) */}
      <mesh position={[0, 0.75, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.2, 0.18]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Headboard Wooden Border (Luxury trim) */}
      <mesh position={[0, 0.75, -0.99]} castShadow>
        <boxGeometry args={[2.08, 1.28, 0.15]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Bed Base / Frame */}
      <mesh position={[0, 0.28, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.88, 0.35, 1.8]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Mattress */}
      <mesh position={[0, 0.53, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.25, 1.72]} />
        <meshStandardMaterial
          color="#F9F9FB"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Blanket/Duvet (covering bottom half of mattress) */}
      <mesh position={[0, 0.55, 0.25]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.26, 1.25]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Pillows */}
      {/* Left Pillow */}
      <mesh position={[-0.45, 0.64, -0.6]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.12, 0.45]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      {/* Right Pillow */}
      <mesh position={[0.45, 0.64, -0.6]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.12, 0.45]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>

      {/* Small Accent Cushion (fabricColor) */}
      <mesh position={[0, 0.67, -0.45]} rotation={[-0.15, 0.2, 0]} castShadow>
        <boxGeometry args={[0.45, 0.1, 0.3]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Legs (Wood Color) */}
      {/* Front Left Leg */}
      <mesh position={[-0.9, 0.05, 0.88]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.15, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Front Right Leg */}
      <mesh position={[0.9, 0.05, 0.88]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.15, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Back Left Leg */}
      <mesh position={[-0.9, 0.05, -0.88]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.15, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Back Right Leg */}
      <mesh position={[0.9, 0.05, -0.88]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.15, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
};
