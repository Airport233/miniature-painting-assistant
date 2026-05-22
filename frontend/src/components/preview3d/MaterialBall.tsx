import React, { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type GeometryType = 'sphere' | 'cube' | 'cylinder';

interface SceneProps {
  color: string;
  roughness: number;
  metalness: number;
  lightPos: [number, number, number];
  geometry: GeometryType;
  onColorSampled: (r: number, g: number, b: number) => void;
}

function Scene({
  color,
  roughness,
  metalness,
  lightPos,
  geometry,
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

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={lightPos}
        intensity={1.5}
        castShadow
      />
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
  lightPosition?: [number, number, number];
  geometry?: GeometryType;
  onColorSampled?: (r: number, g: number, b: number) => void;
}

export default function MaterialBall({
  color,
  roughness = 0.5,
  metalness = 0.0,
  lightPosition = [5, 5, 5],
  geometry = 'sphere',
  onColorSampled,
}: MaterialBallProps) {
  const styles: Record<string, React.CSSProperties> = {
    container: {
      width: '100%',
      height: '400px',
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
          lightPos={lightPosition}
          geometry={geometry}
          onColorSampled={
            onColorSampled ?? (() => {})
          }
        />
      </Canvas>
    </div>
  );
}
