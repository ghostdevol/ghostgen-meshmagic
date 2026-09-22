import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { ProceduralMeshDisplay } from './ProceduralMeshDisplay';
import { setExportObject } from './exporter';

interface MeshDisplayProps {
  meshType: string;
  parameters: Record<string, number>;
}

const PROCEDURAL_TYPES = ['city', 'character', 'weapon', 'vehicle'];

export function MeshDisplay({ meshType, parameters }: MeshDisplayProps) {
  const meshRef = useRef<Mesh>(null);

  // Basic shapes: register the mesh as the export source.
  // (Procedural types register their own group inside ProceduralMeshDisplay.)
  useEffect(() => {
    if (!PROCEDURAL_TYPES.includes(meshType)) {
      setExportObject(meshRef.current);
      return () => setExportObject(null);
    }
  }, [meshType]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const renderGeometry = () => {
    // Handle procedural mesh types
    if (PROCEDURAL_TYPES.includes(meshType)) {
      return <ProceduralMeshDisplay meshType={meshType} parameters={parameters} />;
    }

    // Handle basic geometric shapes
    switch (meshType) {
      case 'box':
        return (
          <boxGeometry
            args={[
              parameters.width || 1,
              parameters.height || 1,
              parameters.depth || 1,
              parameters.widthSegments || 1,
              parameters.heightSegments || 1,
              parameters.depthSegments || 1,
            ]}
          />
        );
      case 'sphere':
        return (
          <sphereGeometry
            args={[
              parameters.radius || 1,
              parameters.widthSegments || 16,
              parameters.heightSegments || 8,
              parameters.phiStart || 0,
              parameters.phiLength || Math.PI * 2,
              parameters.thetaStart || 0,
              parameters.thetaLength || Math.PI,
            ]}
          />
        );
      case 'cylinder':
        return (
          <cylinderGeometry
            args={[
              parameters.radiusTop || 1,
              parameters.radiusBottom || 1,
              parameters.height || 2,
              parameters.radialSegments || 16,
              parameters.heightSegments || 1,
              false,
              parameters.thetaStart || 0,
              parameters.thetaLength || Math.PI * 2,
            ]}
          />
        );
      case 'torus':
        return (
          <torusGeometry
            args={[
              parameters.radius || 1,
              parameters.tube || 0.4,
              parameters.radialSegments || 8,
              parameters.tubularSegments || 16,
              parameters.arc || Math.PI * 2,
            ]}
          />
        );
      case 'plane':
        return (
          <planeGeometry
            args={[
              parameters.width || 2,
              parameters.height || 2,
              parameters.widthSegments || 1,
              parameters.heightSegments || 1,
            ]}
          />
        );
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  // Only render mesh wrapper for basic geometric shapes
  if (PROCEDURAL_TYPES.includes(meshType)) {
    return renderGeometry() as JSX.Element;
  }

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
      {renderGeometry()}
      <meshStandardMaterial
        color="hsl(217, 91%, 60%)"
        metalness={0.3}
        roughness={0.4}
        wireframe={false}
      />
    </mesh>
  );
}