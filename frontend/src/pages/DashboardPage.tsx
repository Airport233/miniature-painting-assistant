import React, { useState, useCallback } from 'react';
import PaintList from '../components/paint/PaintList';
import TargetColorPicker from '../components/mix/TargetColorPicker';
import MixResultList from '../components/mix/MixResultList';
import MaterialBall from '../components/preview3d/MaterialBall';
import LightingControls from '../components/preview3d/LightingControls';
import MaterialControls from '../components/preview3d/MaterialControls';
import GeometrySelector from '../components/preview3d/GeometrySelector';
import StlUploader from '../components/preview3d/StlUploader';
import type { MixResponse } from '../types';

type GeometryType = 'sphere' | 'cube' | 'cylinder';

export default function DashboardPage() {
  const [mixResult, setMixResult] = useState<MixResponse | null>(null);
  const [previewColor, setPreviewColor] = useState('#808080');
  const [roughness, setRoughness] = useState(0.5);
  const [metalness, setMetalness] = useState(0.0);
  const [geometry, setGeometry] = useState<GeometryType>('sphere');
  const [lightPosition, setLightPosition] = useState<[number, number, number]>([5, 5, 5]);
  const [lightIntensity, setLightIntensity] = useState(1.5);
  const [hasMixColor, setHasMixColor] = useState(false);
  const [showPaintList, setShowPaintList] = useState(true);

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
    togglePaintBtn: {
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
      gridTemplateColumns: showPaintList ? '280px 1fr 400px' : '0px 1fr 400px',
      gap: '16px',
      flex: 1,
      minHeight: 0,
      transition: 'grid-template-columns 0.2s ease',
    },
    leftColumn: {
      overflowY: 'auto',
      minHeight: 0,
    },
    centerColumn: {
      overflowY: 'auto',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    rightColumn: {
      overflowY: 'auto',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Dashboard</h1>
          <p style={styles.subtitle}>Mix paints and preview in 3D</p>
        </div>
        <button
          onClick={() => setShowPaintList(!showPaintList)}
          style={styles.togglePaintBtn}
        >
          {showPaintList ? 'Hide Paint List' : 'Show Paint List'}
        </button>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Paint List */}
        <div
          style={styles.leftColumn}
          hidden={!showPaintList}
        >
          <PaintList />
        </div>

        {/* Center Column: Target Color + Mix Results */}
        <div style={styles.centerColumn}>
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
        <div style={styles.rightColumn}>
          <MaterialBall
            color={previewColor}
            roughness={roughness}
            metalness={metalness}
            lightPosition={lightPosition}
            geometry={geometry}
            onColorSampled={handleColorSampled}
          />
          <LightingControls
            lightPosition={lightPosition}
            lightIntensity={lightIntensity}
            onPositionChange={setLightPosition}
            onIntensityChange={setLightIntensity}
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
          <GeometrySelector
            value={geometry}
            onChange={setGeometry}
          />
          <StlUploader
            onModelLoaded={handleModelLoaded}
          />
        </div>
      </div>
    </div>
  );
}
