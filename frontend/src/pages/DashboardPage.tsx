import React, { useState, useCallback } from 'react';
import PaintList from '../components/paint/PaintList';
import TargetColorPicker from '../components/mix/TargetColorPicker';
import MixResultList from '../components/mix/MixResultList';
import ColorWheel from '../components/mix/ColorWheel';
import RecipeList from '../components/recipe/RecipeList';
import MaterialBall from '../components/preview3d/MaterialBall';
import LightingControls from '../components/preview3d/LightingControls';
import MaterialControls from '../components/preview3d/MaterialControls';
import GeometrySelector from '../components/preview3d/GeometrySelector';
import StlUploader from '../components/preview3d/StlUploader';
import type { MixResponse } from '../types';

type GeometryType = 'sphere' | 'cube' | 'cylinder';
type LeftTab = 'paints' | 'recipes';

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
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>('paints');

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
      display: 'flex',
      flexDirection: 'column',
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
    tabBar: {
      display: 'flex',
      gap: '0',
      backgroundColor: '#2b2d31',
      borderRadius: '8px 8px 0 0',
    },
    tab: {
      flex: 1,
      padding: '10px 16px',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid transparent',
      color: '#949ba0',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'color 0.15s, border-color 0.15s',
    },
    tabContent: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Dashboard</h1>
          <p style={styles.subtitle}>Mix paints and preview in 3D</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowColorWheel(!showColorWheel)}
            style={{
              ...styles.togglePaintBtn,
              backgroundColor: showColorWheel ? '#5865f2' : '#4e5058',
            }}
          >
            {showColorWheel ? 'Hide Color Wheel' : 'Color Wheel'}
          </button>
          <button
            onClick={() => setShowPaintList(!showPaintList)}
            style={styles.togglePaintBtn}
          >
            {showPaintList ? 'Hide Paint List' : 'Show Paint List'}
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Paint List / Recipes */}
        <div
          style={styles.leftColumn}
          hidden={!showPaintList}
        >
          <div style={styles.tabBar}>
            <button
              onClick={() => setLeftTab('paints')}
              style={{
                ...styles.tab,
                ...(leftTab === 'paints' ? { color: '#dbdee1', borderBottomColor: '#5865f2' } : {}),
              }}
            >
              Paints
            </button>
            <button
              onClick={() => setLeftTab('recipes')}
              style={{
                ...styles.tab,
                ...(leftTab === 'recipes' ? { color: '#dbdee1', borderBottomColor: '#5865f2' } : {}),
              }}
            >
              Recipes
            </button>
          </div>
          <div style={styles.tabContent}>
            {leftTab === 'paints' ? <PaintList /> : <RecipeList />}
          </div>
        </div>

        {/* Center Column: Color Wheel + Target Color + Mix Results */}
        <div style={styles.centerColumn}>
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
