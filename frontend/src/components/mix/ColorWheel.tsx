import React, { useState, useCallback, useRef } from 'react';

/* ---------- color utilities ---------- */

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  return [
    Math.round(f(5) * 255),
    Math.round(f(3) * 255),
    Math.round(f(1) * 255),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslCss(hue: number): string {
  return `hsl(${hue}, 100%, 50%)`;
}

/* ---------- harmony helpers ---------- */

interface HarmonyInfo {
  label: string;
  hue: number;
  sat: number;
  val: number;
}

function getHarmonies(h: number, s: number, v: number): HarmonyInfo[] {
  return [
    { label: '互补色', hue: (h + 180) % 360, sat: s, val: v },
    { label: '三角色 1', hue: (h + 120) % 360, sat: s, val: v },
    { label: '三角色 2', hue: (h + 240) % 360, sat: s, val: v },
    { label: '类比色 1', hue: (h - 30 + 360) % 360, sat: s, val: v },
    { label: '类比色 2', hue: (h + 30) % 360, sat: s, val: v },
  ];
}

/* ---------- component ---------- */

interface ColorWheelProps {
  onColorSelected: (r: number, g: number, b: number) => void;
}

export default function ColorWheel({ onColorSelected }: ColorWheelProps) {
  const [hue, setHue] = useState(180);
  const [sat, setSat] = useState(0.8);
  const [val, setVal] = useState(0.9);
  const wheelRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  const selectedRgb = hsvToRgb(hue, sat, val);
  const selectedHex = rgbToHex(...selectedRgb);

  const harmonies = getHarmonies(hue, sat, val);

  const handleRingClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = wheelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      setHue(Math.round(angle));
    },
    [],
  );

  const handleSquareClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = squareRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setSat(Math.max(0, Math.min(1, x)));
      setVal(Math.max(0, Math.min(1, 1 - y)));
    },
    [],
  );

  const handleSetColor = useCallback(
    (r: number, g: number, b: number) => {
      onColorSelected(r, g, b);
    },
    [onColorSelected],
  );

  const WHEEL_SIZE = 260;
  const SQUARE_SIZE = 164;
  const CHIP_SIZE = 28;

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
    },
    heading: {
      color: '#dbdee1',
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '16px',
    },
    wheelWrapper: {
      position: 'relative' as const,
      width: WHEEL_SIZE,
      height: WHEEL_SIZE,
      margin: '0 auto 16px',
      cursor: 'crosshair',
    },
    ring: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background:
        'conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #0000ff, #8800ff, #ff0088, #ff0000)',
    },
    square: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: SQUARE_SIZE,
      height: SQUARE_SIZE,
      borderRadius: '6px',
      cursor: 'crosshair',
      background: `linear-gradient(to bottom, transparent, #000),
                   linear-gradient(to right, #fff, ${hslCss(hue)})`,
    },
    previewRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '14px',
    },
    swatch: {
      width: 36,
      height: 36,
      borderRadius: '6px',
      border: '1px solid #4e5058',
      backgroundColor: selectedHex,
      flexShrink: 0,
    },
    hexLabel: {
      color: '#dbdee1',
      fontSize: '14px',
      fontWeight: 600,
      fontFamily: 'monospace',
    },
    harmonyHeading: {
      color: '#b5bac1',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      marginBottom: '10px',
    },
    harmonyGrid: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    harmonyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    harmonyChip: {
      width: CHIP_SIZE,
      height: CHIP_SIZE,
      borderRadius: '4px',
      border: '1px solid #4e5058',
      flexShrink: 0,
    },
    harmonyLabel: {
      color: '#b5bac1',
      fontSize: '13px',
      flex: 1,
    },
    setTargetBtn: {
      padding: '4px 10px',
      backgroundColor: '#4e5058',
      border: 'none',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>色轮</h3>

      {/* Wheel */}
      <div style={styles.wheelWrapper}>
        <div
          ref={wheelRef}
          style={styles.ring}
          onClick={handleRingClick}
        />
        <div
          ref={squareRef}
          style={styles.square}
          onClick={handleSquareClick}
        />
      </div>

      {/* Selected color preview */}
      <div style={styles.previewRow}>
        <div style={styles.swatch} />
        <span style={styles.hexLabel}>{selectedHex.toUpperCase()}</span>
      </div>

      {/* Harmonies */}
      <div style={{ marginBottom: '12px' }}>
        <div style={styles.harmonyHeading}>配色方案</div>
        <div style={styles.harmonyGrid}>
          {harmonies.map((h) => {
            const chipRgb = hsvToRgb(h.hue, h.sat, h.val);
            const chipHex = rgbToHex(...chipRgb);
            return (
              <div key={h.label} style={styles.harmonyRow}>
                <div style={{ ...styles.harmonyChip, backgroundColor: chipHex }} />
                <span style={styles.harmonyLabel}>{h.label}</span>
                <button
                  onClick={() => handleSetColor(...chipRgb)}
                  style={styles.setTargetBtn}
                >
                  设为混色目标
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
