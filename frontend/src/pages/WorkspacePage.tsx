import React, { useState, useCallback } from 'react';
import TargetColorPicker from '../components/mix/TargetColorPicker';
import MixResultList from '../components/mix/MixResultList';
import ColorWheel from '../components/mix/ColorWheel';
import MaterialBall from '../components/preview3d/MaterialBall';
import LightingControls from '../components/preview3d/LightingControls';
import MaterialControls from '../components/preview3d/MaterialControls';
import GeometrySelector from '../components/preview3d/GeometrySelector';
import StlUploader from '../components/preview3d/StlUploader';
import type { MixResponse } from '../types';

type GeometryType = 'sphere' | 'cube' | 'cylinder';

export interface LightConfig {
  id: string;
  position: [number, number, number];
  intensity: number;
  color: string;
  enabled: boolean;
}

let lightCounter = 0;
function createLight(
  position: [number, number, number],
  intensity = 1.5,
  color = '#ffffff'
): LightConfig {
  lightCounter += 1;
  return { id: `light-${lightCounter}`, position, intensity, color, enabled: true };
}

export default function WorkspacePage() {
  const [mixResult, setMixResult] = useState<MixResponse | null>(null);
  const [previewColor, setPreviewColor] = useState('#808080');
  const [roughness, setRoughness] = useState(0.5);
  const [metalness, setMetalness] = useState(0.0);
  const [geometry, setGeometry] = useState<GeometryType>('sphere');
  const [lights, setLights] = useState<LightConfig[]>([createLight([5, 5, 5])]);
  const [selectedLightId, setSelectedLightId] = useState<string | null>(lights[0]?.id ?? null);
  const [hasMixColor, setHasMixColor] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);

  const handleMixResult = useCallback((result: MixResponse) => {
    setMixResult(result);
  }, []);

  const handleColorSelected = useCallback((_r: number, _g: number, _b: number) => {
    // Target color selected - stored within TargetColorPicker
  }, []);

  const handlePreview3d = useCallback((hex: string) => {
    setPreviewColor(hex);
    setHasMixColor(true);
  }, []);

  const handleColorSampled = useCallback((_r: number, _g: number, _b: number) => {
    // Color sampled from 3D preview
  }, []);

  const handleApplyMixColor = useCallback(() => {
    // Re-apply the current mix color to ensure it stays active
  }, []);

  const handleModelLoaded = useCallback((_url: string) => {
    // Model URL stored for future use
  }, []);

  const handleUpdateLight = useCallback(
    (id: string, updates: Partial<Omit<LightConfig, 'id'>>) => {
      setLights((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
    },
    []
  );

  const handleAddLight = useCallback(() => {
    const newLight = createLight([0, 8, 0]);
    setLights((prev) => [...prev, newLight]);
    setSelectedLightId(newLight.id);
  }, []);

  const handleRemoveLight = useCallback((id: string) => {
    setLights((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      if (filtered.length === 0) {
        const fallback = createLight([5, 5, 5]);
        return [fallback];
      }
      return filtered;
    });
    setSelectedLightId((prev) => (prev === id ? null : prev));
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    heading: {
      color: '#dbdee1',
      fontSize: '28px',
      fontWeight: 700,
    },
    subtitle: {
      color: '#949ba0',
      fontSize: '14px',
      marginTop: '4px',
    },
    toggleBtn: {
      padding: '6px 14px',
      backgroundColor: '#4e5058',
      border: 'none',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: '16px',
      flex: 1,
      minHeight: 0,
    },
    mixColumn: {
      overflowY: 'auto',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    previewColumn: {
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    controlsPanel: {
      borderTop: '1px solid #3c3f45',
      paddingTop: '12px',
      marginTop: '12px',
      maxHeight: '200px',
      overflowY: 'auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>工作台</h1>
          <p style={styles.subtitle}>混色与3D预览</p>
        </div>
        <button
          onClick={() => setShowColorWheel(!showColorWheel)}
          style={{
            ...styles.toggleBtn,
            backgroundColor: showColorWheel ? '#5865f2' : '#4e5058',
          }}
        >
          {showColorWheel ? '隐藏色轮' : '色轮'}
        </button>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Mix panel */}
        <div style={styles.mixColumn}>
          {showColorWheel && (
            <ColorWheel onColorSelected={handleColorSelected} />
          )}
          <TargetColorPicker
            onMixResult={handleMixResult}
            onColorSelected={handleColorSelected}
          />
          <MixResultList
            mixResult={mixResult}
            loading={false}
            error={null}
            onPreview3d={handlePreview3d}
          />
        </div>

        {/* Right Column: 3D Preview + Controls */}
        <div style={styles.previewColumn}>
          <MaterialBall
            color={previewColor}
            roughness={roughness}
            metalness={metalness}
            lights={lights}
            geometry={geometry}
            selectedLightId={selectedLightId}
            onLightSelect={setSelectedLightId}
            onLightUpdate={handleUpdateLight}
            onColorSampled={handleColorSampled}
          />
          <div style={styles.controlsPanel}>
            <LightingControls
              lights={lights}
              selectedLightId={selectedLightId}
              onSelectLight={setSelectedLightId}
              onUpdateLight={handleUpdateLight}
              onAddLight={handleAddLight}
              onRemoveLight={handleRemoveLight}
            />
            <MaterialControls
              color={previewColor}
              roughness={roughness}
              metalness={metalness}
              onColorChange={setPreviewColor}
              onRoughnessChange={setRoughness}
              onMetalnessChange={setMetalness}
              onApplyMixColor={handleApplyMixColor}
              hasMixColor={hasMixColor}
            />
            <div>
              <GeometrySelector value={geometry} onChange={setGeometry} />
              <StlUploader onModelLoaded={handleModelLoaded} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
