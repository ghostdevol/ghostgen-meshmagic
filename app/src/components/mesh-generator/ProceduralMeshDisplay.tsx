import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BoxGeometry, CylinderGeometry, SphereGeometry, Group } from 'three';
import { getCityLayout } from './cityLayout';
import { setExportObject } from './exporter';

interface ProceduralMeshDisplayProps {
  meshType: string;
  parameters: Record<string, number>;
}

export function ProceduralMeshDisplay({ meshType, parameters }: ProceduralMeshDisplayProps) {
  const groupRef = useRef<Group>(null);

  // Register this group as the export source (whole scene would drag in
  // the grid helper, lights and environment — we only want the mesh).
  useEffect(() => {
    setExportObject(groupRef.current);
    return () => setExportObject(null);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const generateCity = () => {
    const layout = getCityLayout(parameters);

    const buildings = layout.buildings.map((b) => (
      <mesh
        key={b.name}
        name={b.name}
        position={[b.x, b.h / 2, b.z]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[b.w, b.h, b.d]} />
        <meshStandardMaterial
          color={b.color}
          emissive={b.dAppType ? b.color : '#000000'}
          emissiveIntensity={b.dAppType ? 0.35 : 0}
        />
      </mesh>
    ));

    const roadMeshes = layout.roads.map((r, i) => (
      <mesh
        key={`road-${i}`}
        name={`road-${i}`}
        position={[r.x, 0.01, r.z]}
        receiveShadow
      >
        <boxGeometry args={[r.w, 0.02, r.d]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    ));

    return [...buildings, ...roadMeshes];
  };

  const generateCharacter = () => {
    const scale = parameters.scale || 1;
    const parts = [];

    // Head
    parts.push(
      <mesh key="head" position={[0, 1.7 * scale, 0]} castShadow>
        <sphereGeometry args={[0.15 * scale, 16, 8]} />
        <meshStandardMaterial color="hsl(25, 60%, 70%)" />
      </mesh>
    );

    // Body
    parts.push(
      <mesh key="body" position={[0, 1 * scale, 0]} castShadow>
        <boxGeometry args={[0.4 * scale, 0.8 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="hsl(200, 60%, 50%)" />
      </mesh>
    );

    // Arms
    parts.push(
      <mesh key="arm-left" position={[-0.3 * scale, 1.2 * scale, 0]} castShadow>
        <boxGeometry args={[0.1 * scale, 0.6 * scale, 0.1 * scale]} />
        <meshStandardMaterial color="hsl(25, 60%, 70%)" />
      </mesh>
    );
    parts.push(
      <mesh key="arm-right" position={[0.3 * scale, 1.2 * scale, 0]} castShadow>
        <boxGeometry args={[0.1 * scale, 0.6 * scale, 0.1 * scale]} />
        <meshStandardMaterial color="hsl(25, 60%, 70%)" />
      </mesh>
    );

    // Legs
    parts.push(
      <mesh key="leg-left" position={[-0.1 * scale, 0.4 * scale, 0]} castShadow>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color="hsl(220, 60%, 30%)" />
      </mesh>
    );
    parts.push(
      <mesh key="leg-right" position={[0.1 * scale, 0.4 * scale, 0]} castShadow>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color="hsl(220, 60%, 30%)" />
      </mesh>
    );

    return parts;
  };

  const generateWeapon = () => {
    const weaponType = parameters.weaponType || 0;
    const scale = parameters.scale || 1;
    const parts = [];

    if (weaponType < 0.33) {
      // Sword
      parts.push(
        <mesh key="blade" position={[0, 0.8 * scale, 0]} castShadow>
          <boxGeometry args={[0.05 * scale, 1.5 * scale, 0.02 * scale]} />
          <meshStandardMaterial color="hsl(200, 20%, 80%)" metalness={0.8} roughness={0.2} />
        </mesh>
      );
      parts.push(
        <mesh key="handle" position={[0, -0.2 * scale, 0]} castShadow>
          <cylinderGeometry args={[0.03 * scale, 0.03 * scale, 0.4 * scale, 8]} />
          <meshStandardMaterial color="hsl(25, 40%, 30%)" />
        </mesh>
      );
      parts.push(
        <mesh key="guard" position={[0, 0 * scale, 0]} castShadow>
          <boxGeometry args={[0.3 * scale, 0.02 * scale, 0.02 * scale]} />
          <meshStandardMaterial color="hsl(40, 60%, 40%)" metalness={0.6} />
        </mesh>
      );
    } else if (weaponType < 0.66) {
      // Axe
      parts.push(
        <mesh key="handle" position={[0, -0.3 * scale, 0]} castShadow>
          <cylinderGeometry args={[0.03 * scale, 0.03 * scale, 0.8 * scale, 8]} />
          <meshStandardMaterial color="hsl(25, 40%, 30%)" />
        </mesh>
      );
      parts.push(
        <mesh key="blade" position={[0, 0.1 * scale, 0]} castShadow>
          <boxGeometry args={[0.4 * scale, 0.3 * scale, 0.05 * scale]} />
          <meshStandardMaterial color="hsl(200, 20%, 80%)" metalness={0.8} roughness={0.2} />
        </mesh>
      );
    } else {
      // Staff
      parts.push(
        <mesh key="staff" position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02 * scale, 0.02 * scale, 2 * scale, 8]} />
          <meshStandardMaterial color="hsl(25, 40%, 30%)" />
        </mesh>
      );
      parts.push(
        <mesh key="orb" position={[0, 1 * scale, 0]} castShadow>
          <sphereGeometry args={[0.1 * scale, 16, 8]} />
          <meshStandardMaterial color="hsl(250, 80%, 60%)" emissive="hsl(250, 80%, 20%)" />
        </mesh>
      );
    }

    return parts;
  };

  const generateVehicle = () => {
    const vehicleType = parameters.vehicleType || 0;
    const scale = parameters.scale || 1;
    const parts = [];

    if (vehicleType < 0.33) {
      // Car
      parts.push(
        <mesh key="body" position={[0, 0.3 * scale, 0]} castShadow>
          <boxGeometry args={[2 * scale, 0.5 * scale, 1 * scale]} />
          <meshStandardMaterial color="hsl(0, 80%, 50%)" metalness={0.6} roughness={0.3} />
        </mesh>
      );
      parts.push(
        <mesh key="roof" position={[0, 0.7 * scale, 0]} castShadow>
          <boxGeometry args={[1.2 * scale, 0.3 * scale, 0.8 * scale]} />
          <meshStandardMaterial color="hsl(0, 80%, 40%)" metalness={0.6} roughness={0.3} />
        </mesh>
      );
      
      // Wheels
      const wheelPositions = [
        [-0.7 * scale, 0, 0.4 * scale],
        [0.7 * scale, 0, 0.4 * scale],
        [-0.7 * scale, 0, -0.4 * scale],
        [0.7 * scale, 0, -0.4 * scale],
      ];
      
      wheelPositions.forEach((pos, i) => {
        parts.push(
          <mesh key={`wheel-${i}`} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.15 * scale, 0.15 * scale, 0.1 * scale, 8]} />
            <meshStandardMaterial color="hsl(0, 0%, 10%)" />
          </mesh>
        );
      });
    } else if (vehicleType < 0.66) {
      // Tank
      parts.push(
        <mesh key="body" position={[0, 0.2 * scale, 0]} castShadow>
          <boxGeometry args={[2.5 * scale, 0.4 * scale, 1.5 * scale]} />
          <meshStandardMaterial color="hsl(60, 20%, 30%)" metalness={0.4} roughness={0.7} />
        </mesh>
      );
      parts.push(
        <mesh key="turret" position={[0, 0.6 * scale, 0]} castShadow>
          <cylinderGeometry args={[0.4 * scale, 0.4 * scale, 0.3 * scale, 16]} />
          <meshStandardMaterial color="hsl(60, 20%, 25%)" metalness={0.4} roughness={0.7} />
        </mesh>
      );
      parts.push(
        <mesh key="cannon" position={[0.8 * scale, 0.6 * scale, 0]} castShadow rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.03 * scale, 0.03 * scale, 1 * scale, 8]} />
          <meshStandardMaterial color="hsl(60, 20%, 20%)" metalness={0.6} roughness={0.4} />
        </mesh>
      );
    } else {
      // Spaceship
      parts.push(
        <mesh key="body" position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2 * scale, 0.3 * scale, 0.8 * scale]} />
          <meshStandardMaterial color="hsl(200, 60%, 70%)" metalness={0.8} roughness={0.2} />
        </mesh>
      );
      parts.push(
        <mesh key="cockpit" position={[0.5 * scale, 0.2 * scale, 0]} castShadow>
          <sphereGeometry args={[0.3 * scale, 16, 8]} />
          <meshStandardMaterial color="hsl(200, 60%, 80%)" metalness={0.1} roughness={0.1} transparent opacity={0.8} />
        </mesh>
      );
      
      // Wings
      parts.push(
        <mesh key="wing-left" position={[-1 * scale, 0, 0]} castShadow>
          <boxGeometry args={[0.8 * scale, 0.1 * scale, 0.4 * scale]} />
          <meshStandardMaterial color="hsl(200, 60%, 60%)" metalness={0.8} roughness={0.2} />
        </mesh>
      );
      parts.push(
        <mesh key="wing-right" position={[1 * scale, 0, 0]} castShadow>
          <boxGeometry args={[0.8 * scale, 0.1 * scale, 0.4 * scale]} />
          <meshStandardMaterial color="hsl(200, 60%, 60%)" metalness={0.8} roughness={0.2} />
        </mesh>
      );
    }

    return parts;
  };

  const renderContent = () => {
    switch (meshType) {
      case 'city':
        return generateCity();
      case 'character':
        return generateCharacter();
      case 'weapon':
        return generateWeapon();
      case 'vehicle':
        return generateVehicle();
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef}>
      {renderContent()}
    </group>
  );
}