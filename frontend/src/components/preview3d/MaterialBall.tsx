import React, { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, DragControls } from '@react-three/drei';
import * as THREE from 'three';

type GeometryType = 'sphere' | 'cube' | 'cylinder';

export interface LightConfig {
  id: string;
  position: [number, number, number];
  intensity: number;
  color: string;
  enabled: boolean;
}

interface SceneProps {
  color: string;
  roughness: number;
  metalness: number;
  lights: LightConfig[];
  geometry: GeometryType;
  selectedLightId: string | null;
  onLightSelect: (id: string | null) => void;
  onLightUpdate: (id: string, updates: Partial<Omit<LightConfig, 'id'>>) => void;
  onColorSampled: (r: number, g: number, b: number) => void;
}

function Scene({
  color,
  roughness,
  metalness,
  lights,
  geometry,
  selectedLightId,
  onLightSelect,
  onLightUpdate,
  onColorSampled,
}: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const getGeometry = () => {
    switch (geometry) {
      case 'cube':
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />;
      case 'sphere':
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  const handleClick = useCallback(
    (e: { stopPropagation: () => void; point: THREE.Vector3 }) => {
      e.stopPropagation();
      if (!meshRef.current) return;
      const mesh = meshRef.current;
      const localPoint = mesh.worldToLocal(e.point.clone());
      const uv = getUvFromLocalPoint(localPoint);
      if (!uv) return;
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      onColorSampled(
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16)
      );
    },
    [color, geometry, onColorSampled]
  );

  const enabledLights = lights.filter((l) => l.enabled);

  return (
    <>
      <ambientLight intensity={0.3} />

      {enabledLights.map((light) => (
        <React.Fragment key={light.id}>
          <directionalLight
            position={light.position}
            intensity={light.intensity}
            color={light.color}
            castShadow
          />
        </React.Fragment>
      ))}

      {/* Light markers */}
      {enabledLights.map((light) => (
        <DragControls
          key={light.id}
          onDrag={(_, __, worldMatrix) => {
            const pos = new THREE.Vector3().setFromMatrixPosition(worldMatrix);
            onLightUpdate(light.id, { position: [pos.x, pos.y, pos.z] });
          }}
        >
          <mesh
            position={light.position}
            onClick={(e) => {
              e.stopPropagation();
              onLightSelect(light.id);
            }}
          >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={light.color}
              emissive={light.id === selectedLightId ? light.color : '#000000'}
              emissiveIntensity={light.id === selectedLightId ? 0.8 : 0}
            />
          </mesh>
        </DragControls>
      ))}

      {/* Main model */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        {getGeometry()}
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#444444"
          roughness={0.8}
          metalness={0.2}
          opacity={0.6}
          transparent
        />
      </mesh>

      <gridHelper args={[10, 10, '#4e5058', '#3c3f45']} />

      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        minDistance={2}
        maxDistance={8}
      />
    </>
  );
}

function getUvFromLocalPoint(
  point: THREE.Vector3,
): { u: number; v: number } | null {
  const normalized = point.clone().normalize();
  const u = 0.5 + Math.atan2(normalized.z, normalized.x) / (2 * Math.PI);
  const v = 0.5 - Math.asin(normalized.y) / Math.PI;
  return { u, v };
}

interface MaterialBallProps {
  color: string;
  roughness?: number;
  metalness?: number;
  lights: LightConfig[];
  geometry?: GeometryType;
  selectedLightId?: string | null;
  onLightSelect?: (id: string | null) => void;
  onLightUpdate?: (id: string, updates: Partial<Omit<LightConfig, 'id'>>) => void;
  onColorSampled?: (r: number, g: number, b: number) => void;
}

export default function MaterialBall({
  color,
  roughness = 0.5,
  metalness = 0.0,
  lights,
  geometry = 'sphere',
  selectedLightId = null,
  onLightSelect,
  onLightUpdate,
  onColorSampled,
}: MaterialBallProps) {
  const styles: Record<string, React.CSSProperties> = {
    container: {
      width: '100%',
      flex: 1,
      minHeight: '300px',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1e1f22',
      border: '1px solid #3c3f45',
    },
  };

  return (
    <div style={styles.container}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Scene
          color={color}
          roughness={roughness}
          metalness={metalness}
          lights={lights}
          geometry={geometry}
          selectedLightId={selectedLightId}
          onLightSelect={onLightSelect ?? (() => {})}
          onLightUpdate={onLightUpdate ?? (() => {})}
          onColorSampled={
            onColorSampled ?? (() => {})
          }
        />
      </Canvas>
    </div>
  );
}
