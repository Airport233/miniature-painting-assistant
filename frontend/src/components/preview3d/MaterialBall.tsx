import React, { useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
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
  modelUrl?: string | null;
  modelRotation?: [number, number, number];
  selectedLightId: string | null;
  onLightSelect: (id: string | null) => void;
  onLightUpdate: (id: string, updates: Partial<Omit<LightConfig, 'id'>>) => void;
  onColorSampled: (r: number, g: number, b: number) => void;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
}

function Scene({
  color,
  roughness,
  metalness,
  lights,
  geometry,
  modelUrl,
  modelRotation,
  selectedLightId,
  onLightSelect,
  onLightUpdate,
  onColorSampled,
  cameraRef,
}: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const { camera, gl } = useThree();

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

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

  const dragRef = useRef<{ lightId: string; startPos: THREE.Vector3 } | null>(null);
  const planeRef = useRef(new THREE.Plane());
  const raycasterRef = useRef(new THREE.Raycaster());

  const enabledLights = lights.filter((l) => l.enabled);

  // Custom drag using raycasting against camera-facing plane
  useEffect(() => {
    const canvas = gl.domElement;

    const getMouseNDC = (e: MouseEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const getIntersection = (mouse: { x: number; y: number }, point: THREE.Vector3): THREE.Vector3 | null => {
      const normal = camera.getWorldDirection(new THREE.Vector3()).normalize();
      planeRef.current.setFromNormalAndCoplanarPoint(normal, point);
      raycasterRef.current.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), camera);
      return raycasterRef.current.ray.intersectPlane(planeRef.current, new THREE.Vector3());
    };

    const onMouseDown = (e: MouseEvent) => {
      const mouse = getMouseNDC(e);
      raycasterRef.current.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), camera);

      // Hit-test light markers
      let closest: { id: string; point: THREE.Vector3 } | null = null;
      let closestDist = Infinity;

      for (const light of enabledLights) {
        const lightPos = new THREE.Vector3(...light.position);
        const sphere = new THREE.Sphere(lightPos, 0.25);
        const hitPoint = new THREE.Vector3();
        const hit = raycasterRef.current.ray.intersectSphere(sphere, hitPoint);
        if (hit) {
          const dist = hitPoint.distanceTo(raycasterRef.current.ray.origin);
          if (dist < closestDist) {
            closestDist = dist;
            closest = { id: light.id, point: lightPos.clone() };
          }
        }
      }

      if (closest) {
        e.stopPropagation();
        onLightSelect(closest.id);
        dragRef.current = { lightId: closest.id, startPos: closest.point };
        setIsDragging(true);
      } else {
        onLightSelect(null);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const mouse = getMouseNDC(e);
      const p = getIntersection(mouse, dragRef.current.startPos);
      if (p) {
        onLightUpdate(dragRef.current.lightId, { position: [p.x, p.y, p.z] });
      }
    };

    const onMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };

    canvas.addEventListener('pointerdown', onMouseDown);
    window.addEventListener('pointermove', onMouseMove);
    window.addEventListener('pointerup', onMouseUp);

    return () => {
      canvas.removeEventListener('pointerdown', onMouseDown);
      window.removeEventListener('pointermove', onMouseMove);
      window.removeEventListener('pointerup', onMouseUp);
    };
  }, [camera, gl, enabledLights, onLightSelect, onLightUpdate]);

  return (
    <>
      <ambientLight intensity={0.25} />
      <gridHelper args={[10, 10, '#4e5058', '#3c3f45']} />

      {enabledLights.map((light) => (
        <directionalLight
          key={light.id}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
          castShadow
        />
      ))}

      {/* Light markers */}
      {enabledLights.map((light) => (
        <mesh
          key={`marker-${light.id}`}
          position={light.position}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={light.color}
            emissive={light.id === selectedLightId ? light.color : '#000000'}
            emissiveIntensity={light.id === selectedLightId ? 0.8 : 0}
          />
        </mesh>
      ))}

      {/* Main model */}
      {modelUrl ? (
        <StlModel
          url={modelUrl}
          color={color}
          roughness={roughness}
          metalness={metalness}
          rotationDeg={modelRotation}
        />
      ) : (
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
      )}


      <OrbitControls
        enabled={!isDragging}
        enableDamping
        dampingFactor={0.1}
        minDistance={0.5}
        maxDistance={20}
      />
    </>
  );
}

function StlModel({
  url,
  color,
  roughness,
  metalness,
  rotationDeg,
}: {
  url: string;
  color: string;
  roughness: number;
  metalness: number;
  rotationDeg?: [number, number, number];
}) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return;

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.0 / maxDim;
    meshRef.current.scale.setScalar(scale);

    const center = box.getCenter(new THREE.Vector3());
    meshRef.current.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );
  }, [geometry]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      castShadow
      receiveShadow
      rotation={rotationDeg ? rotationDeg.map((d) => d * Math.PI / 180) as [number, number, number] : [0, 0, 0]}
    >
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
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
  modelUrl?: string | null;
  modelRotation?: [number, number, number];
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
  modelUrl,
  modelRotation,
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

  const lightsRef = useRef(lights);
  lightsRef.current = lights;
  const cameraRef = useRef<THREE.Camera | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intercept wheel on canvas to prevent OrbitControls zoom when light selected
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = container.querySelector('canvas');
    if (!canvas) return;

    const onWheelCapture = (e: WheelEvent) => {
      if (!selectedLightId || !onLightUpdate || !cameraRef.current) return;
      const current = lightsRef.current.find((l) => l.id === selectedLightId);
      if (!current) return;
      e.preventDefault();
      e.stopPropagation();
      const forward = new THREE.Vector3();
      cameraRef.current.getWorldDirection(forward);
      forward.normalize();
      const step = e.deltaY > 0 ? -0.3 : 0.3;
      onLightUpdate(selectedLightId, {
        position: [
          current.position[0] + forward.x * step,
          current.position[1] + forward.y * step,
          current.position[2] + forward.z * step,
        ],
      });
    };

    canvas.addEventListener('wheel', onWheelCapture, { capture: true });
    return () => canvas.removeEventListener('wheel', onWheelCapture, { capture: true });
  }, [selectedLightId, onLightUpdate, lightsRef]);

  return (
    <div style={styles.container} ref={containerRef}>
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
          modelUrl={modelUrl}
          modelRotation={modelRotation}
          selectedLightId={selectedLightId}
          onLightSelect={onLightSelect ?? (() => {})}
          onLightUpdate={onLightUpdate ?? (() => {})}
          onColorSampled={
            onColorSampled ?? (() => {})
          }
          cameraRef={cameraRef}
        />
      </Canvas>
    </div>
  );
}
