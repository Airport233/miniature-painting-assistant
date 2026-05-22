import React from 'react';

interface MaterialControlsProps {
  color: string;
  roughness: number;
  metalness: number;
  onColorChange: (color: string) => void;
  onRoughnessChange: (value: number) => void;
  onMetalnessChange: (value: number) => void;
  onApplyMixColor: () => void;
  hasMixColor: boolean;
}

export default function MaterialControls({
  color,
  roughness,
  metalness,
  onColorChange,
  onRoughnessChange,
  onMetalnessChange,
  onApplyMixColor,
  hasMixColor,
}: MaterialControlsProps) {
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
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
    label: {
      color: '#b5bac1',
      fontSize: '12px',
      fontWeight: 600,
      minWidth: '80px',
    },
    colorInput: {
      width: '40px',
      height: '32px',
      padding: '0',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
    },
    slider: {
      flex: 1,
      accentColor: '#5865f2',
    },
    sliderValue: {
      color: '#dbdee1',
      fontSize: '12px',
      width: '32px',
      textAlign: 'right',
    },
    roughnessLabel: {
      color: '#b5bac1',
      fontSize: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '-4px',
      marginBottom: '4px',
    },
    applyBtn: {
      width: '100%',
      padding: '8px',
      backgroundColor: '#5865f2',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '8px',
    },
    applyBtnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>材质</h4>

      <div style={styles.row}>
        <span style={styles.label}>颜色</span>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          style={styles.colorInput}
        />
        <span style={{ color: '#dbdee1', fontSize: '12px' }}>{color}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>粗糙度</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={roughness}
          onChange={(e) => onRoughnessChange(parseFloat(e.target.value))}
          style={styles.slider}
        />
        <span style={styles.sliderValue}>{roughness.toFixed(2)}</span>
      </div>
      <div style={styles.roughnessLabel}>
        <span>光泽</span>
        <span>消光</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>金属度</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={metalness}
          onChange={(e) => onMetalnessChange(parseFloat(e.target.value))}
          style={styles.slider}
        />
        <span style={styles.sliderValue}>{metalness.toFixed(2)}</span>
      </div>
      <div style={styles.roughnessLabel}>
        <span>非金属</span>
        <span>金属</span>
      </div>

      <button
        onClick={onApplyMixColor}
        disabled={!hasMixColor}
        style={{
          ...styles.applyBtn,
          ...(!hasMixColor ? styles.applyBtnDisabled : {}),
        }}
      >
        应用混色结果
      </button>
    </div>
  );
}
