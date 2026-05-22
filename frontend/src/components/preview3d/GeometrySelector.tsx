import React from 'react';

type GeometryType = 'sphere' | 'cube' | 'cylinder';

interface GeometrySelectorProps {
  value: GeometryType;
  onChange: (value: GeometryType) => void;
  modelName?: string | null;
}

const OPTIONS: { value: GeometryType; label: string }[] = [
  { value: 'sphere', label: '球体' },
  { value: 'cube', label: '立方体' },
  { value: 'cylinder', label: '圆柱体' },
];

export default function GeometrySelector({
  value,
  onChange,
  modelName,
}: GeometrySelectorProps) {
  const isModelSelected = !!modelName;

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
      marginBottom: '10px',
    },
    radioGroup: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#dbdee1',
      fontSize: '13px',
      cursor: 'pointer',
      padding: '6px 12px',
      backgroundColor: '#1e1f22',
      borderRadius: '4px',
      border: '1px solid #4e5058',
    },
    radioLabelActive: {
      backgroundColor: '#5865f2',
      borderColor: '#5865f2',
    },
    radio: {
      accentColor: '#5865f2',
    },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>几何体</h4>
      <div style={styles.radioGroup}>
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            style={{
              ...styles.radioLabel,
              ...(!isModelSelected && value === opt.value ? styles.radioLabelActive : {}),
            }}
          >
            <input
              type="radio"
              name="geometry"
              value={opt.value}
              checked={!isModelSelected && value === opt.value}
              onChange={() => onChange(opt.value)}
              style={styles.radio}
            />
            {opt.label}
          </label>
        ))}
        {modelName && (
          <label
            style={{
              ...styles.radioLabel,
              ...(isModelSelected ? styles.radioLabelActive : {}),
            }}
          >
            <input
              type="radio"
              name="geometry"
              value="model"
              checked={isModelSelected}
              onChange={() => {}}
              style={styles.radio}
            />
            {modelName}
          </label>
        )}
      </div>
    </div>
  );
}

export type { GeometryType };
