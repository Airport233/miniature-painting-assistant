import React from 'react';

interface LightingControlsProps {
  lightPosition: [number, number, number];
  lightIntensity: number;
  onPositionChange: (pos: [number, number, number]) => void;
  onIntensityChange: (intensity: number) => void;
}

function tempToRgb(temp: number): string {
  const t = temp / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  const clamp = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)));
  return `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`;
}

const PRESETS: { label: string; pos: [number, number, number] }[] = [
  { label: '顶光', pos: [0, 5, 0] },
  { label: '侧光', pos: [5, 2, 0] },
  { label: '正光', pos: [0, 2, 5] },
];

export default function LightingControls({
  lightPosition,
  lightIntensity,
  onPositionChange,
  onIntensityChange,
}: LightingControlsProps) {
  const handleSlider = (
    axis: 0 | 1 | 2,
    value: number
  ) => {
    const newPos: [number, number, number] = [...lightPosition];
    newPos[axis] = value;
    onPositionChange(newPos);
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
      textTransform: 'uppercase',
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
    presets: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
    },
    presetBtn: {
      flex: 1,
      padding: '6px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'center',
    },
    colorPreview: {
      width: '100%',
      height: '4px',
      borderRadius: '2px',
      marginTop: '8px',
      backgroundColor: tempToRgb(5500),
    },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>光照</h4>

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
            value={lightPosition[axis]}
            onChange={(e) =>
              handleSlider(axis, parseFloat(e.target.value))
            }
            style={styles.slider}
          />
          <span style={styles.sliderValue}>
            {lightPosition[axis].toFixed(1)}
          </span>
        </div>
      ))}

      <div style={styles.sliderRow}>
        <span style={styles.sliderLabel}>I</span>
        <input
          type="range"
          min={0}
          max={3}
          step={0.1}
          value={lightIntensity}
          onChange={(e) =>
            onIntensityChange(parseFloat(e.target.value))
          }
          style={styles.slider}
        />
        <span style={styles.sliderValue}>
          {lightIntensity.toFixed(1)}
        </span>
      </div>

      <div style={styles.presets}>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onPositionChange(preset.pos)}
            style={styles.presetBtn}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
