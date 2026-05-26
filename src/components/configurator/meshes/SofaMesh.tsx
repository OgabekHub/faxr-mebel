import React from 'react';

interface MeshProps {
  fabricColor: string;
  woodColor: string;
  roughness: number;
  metalness: number;
}

export const SofaMesh: React.FC<MeshProps> = ({
  fabricColor,
  woodColor,
  roughness,
  metalness,
}) => {
  return (
    <group position={[0, -0.4, 0]}>
      {/* Base Frame */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.15, 0.9]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Seat Cushions */}
      {/* Left Seat */}
      <mesh position={[-0.51, 0.4, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.2, 0.8]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
      {/* Right Seat */}
      <mesh position={[0.51, 0.4, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.2, 0.8]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Back Rest */}
      <mesh position={[0, 0.8, -0.35]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.6, 0.2]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Left Armrest */}
      <mesh position={[-1.15, 0.55, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.5, 0.85]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Right Armrest */}
      <mesh position={[1.15, 0.55, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.5, 0.85]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Back Cushions (Soft pillows for backing) */}
      <mesh position={[-0.51, 0.7, -0.2]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.95, 0.45, 0.15]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness + 0.05}
          metalness={metalness}
        />
      </mesh>
      <mesh position={[0.51, 0.7, -0.2]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.95, 0.45, 0.15]} />
        <meshStandardMaterial
          color={fabricColor}
          roughness={roughness + 0.05}
          metalness={metalness}
        />
      </mesh>

      {/* Legs (Wood Color) */}
      {/* Front Left Leg */}
      <mesh position={[-1.0, 0.08, 0.35]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.18, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Front Right Leg */}
      <mesh position={[1.0, 0.08, 0.35]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.18, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Back Left Leg */}
      <mesh position={[-1.0, 0.08, -0.35]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.18, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Back Right Leg */}
      <mesh position={[1.0, 0.08, -0.35]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.18, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
};
