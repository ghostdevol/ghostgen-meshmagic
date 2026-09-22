import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { MeshDisplay } from './MeshDisplay';

interface MeshViewportProps {
  meshType: string;
  parameters: Record<string, number>;
}

export function MeshViewport({ meshType, parameters }: MeshViewportProps) {
  return (
    <div className="w-full h-full bg-viewport rounded-lg border border-border overflow-hidden">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 75 }}
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          
          <MeshDisplay meshType={meshType} parameters={parameters} />
          
          <Grid
            position={[0, -1, 0]}
            args={[10, 10]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="hsl(217, 91%, 60%)"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="hsl(259, 94%, 51%)"
            fadeDistance={25}
            fadeStrength={1}
          />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={1}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}