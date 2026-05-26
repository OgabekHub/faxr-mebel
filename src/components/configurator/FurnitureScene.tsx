import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Stage } from '@react-three/drei';
import { SofaMesh } from './meshes/SofaMesh';
import { BedMesh } from './meshes/BedMesh';
import { DiningMesh } from './meshes/DiningMesh';
import { KitchenMesh } from './meshes/KitchenMesh';
import { TVUnitMesh } from './meshes/TVUnitMesh';

interface FurnitureSceneProps {
  typeId: string;
  fabricColor: string;
  woodColor: string;
  fabricTag: string; // 'Velvet' | 'Leather' | 'Linen'
  finishId: string; // 'matte' | 'satin' | 'gloss'
  sizeId: string; // 'S' | 'M' | 'XL'
  isRotating?: boolean;
}

export const FurnitureScene: React.FC<FurnitureSceneProps> = ({
  typeId,
  fabricColor,
  woodColor,
  fabricTag,
  finishId,
  sizeId,
  isRotating = false,
}) => {
  // Determine scale based on size selection
  const scaleMultiplier = sizeId === 'M' ? 1.15 : sizeId === 'XL' ? 1.35 : 1.0;
  const scale: [number, number, number] = [scaleMultiplier, scaleMultiplier, scaleMultiplier];

  // Map fabric & finish selection to PBR material properties
  let baseRoughness = 0.6;
  let baseMetalness = 0.0;

  if (fabricTag === 'Leather') {
    baseRoughness = 0.35;
    baseMetalness = 0.12;
  } else if (fabricTag === 'Linen') {
    baseRoughness = 0.95;
    baseMetalness = 0.0;
  } else if (fabricTag === 'Velvet') {
    baseRoughness = 0.65;
    baseMetalness = 0.05;
  }

  // Adjust roughness based on surface sheen (Finish)
  let finalRoughness = baseRoughness;
  if (finishId === 'matte') {
    finalRoughness = Math.min(1.0, baseRoughness + 0.15);
  } else if (finishId === 'satin') {
    finalRoughness = Math.max(0.3, baseRoughness - 0.1);
  } else if (finishId === 'gloss') {
    finalRoughness = Math.max(0.08, baseRoughness - 0.25);
  }

  // Helper to render the active mesh
  const renderMesh = () => {
    const props = {
      fabricColor,
      woodColor,
      roughness: finalRoughness,
      metalness: baseMetalness,
    };

    switch (typeId) {
      case 'sofa':
        return <SofaMesh {...props} />;
      case 'bedroom':
        return <BedMesh {...props} />;
      case 'dining':
        return <DiningMesh {...props} />;
      case 'kitchen':
        return <KitchenMesh {...props} />;
      case 'tv':
        return <TVUnitMesh {...props} />;
      default:
        return <SofaMesh {...props} />;
    }
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing" style={{ minHeight: '350px' }}>
      <Canvas
        shadows
        camera={{ position: [2.5, 1.5, 3.2], fov: 42 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        {/* Soft studio ambient light */}
        <ambientLight intensity={1.8} />

        {/* Directional light simulating window/sunlight for casting shadows */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
          shadow-bias={-0.0005}
        />

        {/* Fill light to soften harsh shadows */}
        <directionalLight position={[-5, 3, -2]} intensity={0.8} />
        <pointLight position={[0, 4, 0]} intensity={0.5} />

        <Suspense fallback={null}>
          <group scale={scale} position={[0, 0, 0]}>
            {renderMesh()}
          </group>

          {/* Premium soft ground contact shadows */}
          <ContactShadows
            position={[0, -0.4, 0]}
            opacity={0.65}
            scale={4.5}
            blur={2.4}
            far={1.5}
          />
        </Suspense>

        {/* Orbit Controls to rotate, pan, zoom the furniture */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1.8}
          maxDistance={6.0}
          maxPolarAngle={Math.PI / 2.1} // Prevent looking completely underneath floor
          autoRotate={isRotating}
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
};
