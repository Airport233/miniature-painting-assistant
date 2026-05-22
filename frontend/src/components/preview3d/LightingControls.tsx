import React from 'react';
import type { LightConfig } from '../preview3d/MaterialBall';

interface LightingControlsProps {
  lights: LightConfig[];
  selectedLightId: string | null;
  onSelectLight: (id: string | null) => void;
  onUpdateLight: (id: string, updates: Partial<Omit<LightConfig, 'id'>>) => void;
  onAddLight: () => void;
  onRemoveLight: (id: string) => void;
}

const COLOR_PRESETS = [
  { label: '暖光 3200K', color: '#ffb878' },
  { label: '中性 5500K', color: '#ffe8cc' },
  { label: '冷光 6500K', color: '#ccddff' },
];

export default function LightingControls({
  lights,
  selectedLightId,
  onSelectLight,
  onUpdateLight,
  onAddLight,
  onRemoveLight,
}: LightingControlsProps) {
  const selectedLight = lights.find((l) => l.id === selectedLightId) ?? null;

  const handleSlider = (
    light: LightConfig,
    axis: 0 | 1 | 2,
    value: number
  ) => {
    const newPos: [number, number, number] = [...light.position];
    newPos[axis] = value;
    onUpdateLight(light.id, { position: newPos });
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '12px',
    },
    heading: {
      color: '#dbdee1',
      fontSize: '14px',
      fontWeight: 700,
      marginBottom: '12px',
    },
    lightList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      marginBottom: '12px',
    },
    lightItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 10px',
      borderRadius: '6px',
      backgroundColor: '#1e1f22',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'border-color 0.15s, background-color 0.15s',
    },
    lightItemSelected: {
      borderColor: '#5865f2',
      backgroundColor: '#23252a',
    },
    colorDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      flexShrink: 0,
      border: '1px solid #4e5058',
    },
    lightName: {
      color: '#dbdee1',
      fontSize: '13px',
      fontWeight: 500,
      flex: 1,
    },
    deleteBtn: {
      padding: '2px 8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#949ba0',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '4px',
      lineHeight: 1,
    },
    detailsSection: {
      borderTop: '1px solid #4e5058',
      paddingTop: '12px',
    },
    selectedHeading: {
      color: '#b5bac1',
      fontSize: '12px',
      fontWeight: 700,
      marginBottom: '10px',
    },
    sliderRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },
    sliderLabel: {
      color: '#b5bac1',
      fontSize: '12px',
      fontWeight: 600,
      width: '16px',
      textTransform: 'uppercase' as const,
    },
    slider: {
      flex: 1,
      accentColor: '#5865f2',
    },
    sliderValue: {
      color: '#dbdee1',
      fontSize: '12px',
      width: '32px',
      textAlign: 'right' as const,
    },
    colorPresets: {
      display: 'flex',
      gap: '8px',
      marginTop: '4px',
      marginBottom: '10px',
    },
    presetBtn: {
      flex: 1,
      padding: '6px 4px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '10px',
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'center' as const,
    },
    colorInputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },
    colorInput: {
      width: '36px',
      height: '28px',
      padding: '0',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
    },
    colorInputLabel: {
      color: '#b5bac1',
      fontSize: '11px',
      fontWeight: 600,
    },
    addBtn: {
      width: '100%',
      padding: '8px',
      backgroundColor: 'transparent',
      border: '1px dashed #4e5058',
      borderRadius: '6px',
      color: '#949ba0',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'border-color 0.15s, color 0.15s',
    },
    noSelection: {
      color: '#949ba0',
      fontSize: '12px',
      fontStyle: 'italic',
      paddingTop: '4px',
    },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>光照</h4>

      {/* Light list */}
      <div style={styles.lightList}>
        {lights.map((light, index) => (
          <div
            key={light.id}
            onClick={() => onSelectLight(light.id)}
            style={{
              ...styles.lightItem,
              ...(light.id === selectedLightId ? styles.lightItemSelected : {}),
            }}
          >
            <div
              style={{
                ...styles.colorDot,
                backgroundColor: light.color,
              }}
            />
            <span style={styles.lightName}>光源 {index + 1}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveLight(light.id);
              }}
              style={styles.deleteBtn}
              title="删除光源"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Selected light details */}
      {selectedLight ? (
        <div style={styles.detailsSection}>
          <div style={styles.selectedHeading}>位置与颜色</div>

          {([0, 1, 2] as const).map((axis) => (
            <div key={axis} style={styles.sliderRow}>
              <span style={styles.sliderLabel}>
                {['X', 'Y', 'Z'][axis]}
              </span>
              <input
                type="range"
                min={-10}
                max={10}
                step={0.5}
                value={selectedLight.position[axis]}
                onChange={(e) =>
                  handleSlider(selectedLight, axis, parseFloat(e.target.value))
                }
                style={styles.slider}
              />
              <span style={styles.sliderValue}>
                {selectedLight.position[axis].toFixed(1)}
              </span>
            </div>
          ))}

          {/* Color presets */}
          <div style={styles.colorPresets}>
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onUpdateLight(selectedLight.id, { color: preset.color })}
                style={{
                  ...styles.presetBtn,
                  ...(selectedLight.color === preset.color
                    ? { borderColor: '#5865f2', color: '#fff' }
                    : {}),
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom color */}
          <div style={styles.colorInputRow}>
            <span style={styles.colorInputLabel}>自定义</span>
            <input
              type="color"
              value={selectedLight.color}
              onChange={(e) =>
                onUpdateLight(selectedLight.id, { color: e.target.value })
              }
              style={styles.colorInput}
            />
            <span style={{ color: '#dbdee1', fontSize: '11px' }}>
              {selectedLight.color}
            </span>
          </div>

          {/* Intensity */}
          <div style={styles.sliderRow}>
            <span style={styles.sliderLabel}>I</span>
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={selectedLight.intensity}
              onChange={(e) =>
                onUpdateLight(selectedLight.id, {
                  intensity: parseFloat(e.target.value),
                })
              }
              style={styles.slider}
            />
            <span style={styles.sliderValue}>
              {selectedLight.intensity.toFixed(1)}
            </span>
          </div>
        </div>
      ) : (
        <div style={styles.noSelection}>
          选择一个光源查看详细设置
        </div>
      )}

      {/* Add light button */}
      <button onClick={onAddLight} style={{ ...styles.addBtn, marginTop: '12px' }}>
        + 添加光源
      </button>
    </div>
  );
}
