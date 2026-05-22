import React, { useRef, useState, useCallback } from 'react';
import * as mixApi from '../../api/mix';
import type { MixResponse } from '../../types';

interface TargetColorPickerProps {
  onMixResult: (result: MixResponse) => void;
  onColorSelected: (r: number, g: number, b: number) => void;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6 && cleaned.length !== 3) return null;
  const full =
    cleaned.length === 3
      ? cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2]
      : cleaned;
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function TargetColorPicker({
  onMixResult,
  onColorSelected,
}: TargetColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hexInput, setHexInput] = useState('#');
  const [rInput, setRInput] = useState('');
  const [gInput, setGInput] = useState('');
  const [bInput, setBInput] = useState('');
  const [selectedR, setSelectedR] = useState(128);
  const [selectedG, setSelectedG] = useState(128);
  const [selectedB, setSelectedB] = useState(128);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncFromRgb = useCallback(
    (r: number, g: number, b: number) => {
      setSelectedR(r);
      setSelectedG(g);
      setSelectedB(b);
      setHexInput(rgbToHex(r, g, b));
      setRInput(String(r));
      setGInput(String(g));
      setBInput(String(b));
      onColorSelected(r, g, b);
    },
    [onColorSelected]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const maxWidth = 300;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImageLoaded(true);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    syncFromRgb(pixel[0], pixel[1], pixel[2]);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      setSelectedR(rgb.r);
      setSelectedG(rgb.g);
      setSelectedB(rgb.b);
      setRInput(String(rgb.r));
      setGInput(String(rgb.g));
      setBInput(String(rgb.b));
      onColorSelected(rgb.r, rgb.g, rgb.b);
    }
  };

  const handleRgbInput = () => {
    const r = parseInt(rInput, 10);
    const g = parseInt(gInput, 10);
    const b = parseInt(bInput, 10);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return;
    syncFromRgb(
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b))
    );
  };

  const handleComputeMix = async () => {
    setComputing(true);
    setError(null);
    try {
      const result = await mixApi.mix({
        targetR: selectedR,
        targetG: selectedG,
        targetB: selectedB,
      });
      onMixResult(result);
    } catch {
      setError('计算混色失败，请重试。');
    } finally {
      setComputing(false);
    }
  };

  const previewColor = `rgb(${selectedR},${selectedG},${selectedB})`;

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
    section: {
      marginBottom: '16px',
    },
    sectionLabel: {
      color: '#b5bac1',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
      display: 'block',
    },
    previewBox: {
      width: '100%',
      height: '48px',
      borderRadius: '6px',
      backgroundColor: previewColor,
      border: '1px solid #4e5058',
      marginBottom: '16px',
    },
    hexInput: {
      padding: '8px 10px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '14px',
      width: '120px',
      outline: 'none',
    },
    rgbRow: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    rgbInput: {
      padding: '8px 10px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '13px',
      width: '64px',
      outline: 'none',
    },
    applyBtn: {
      padding: '6px 12px',
      backgroundColor: '#4e5058',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    mixButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#5865f2',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
    },
    mixButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    fileInput: {
      color: '#dbdee1',
      fontSize: '13px',
    },
    canvas: {
      maxWidth: '300px',
      cursor: imageLoaded ? 'crosshair' : 'default',
      borderRadius: '4px',
      border: imageLoaded ? '1px solid #4e5058' : 'none',
      display: 'block',
      marginTop: '8px',
    },
    instruction: {
      color: '#b5bac1',
      fontSize: '12px',
      marginTop: '6px',
    },
    error: {
      color: '#da373c',
      fontSize: '13px',
      marginTop: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>目标色</h3>

      <div style={styles.previewBox} />

      <div style={styles.section}>
        <span style={styles.sectionLabel}>从图片取色</span>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={styles.canvas}
        />
        {imageLoaded && (
          <p style={styles.instruction}>点击图片取色</p>
        )}
      </div>

      <div style={styles.section}>
        <span style={styles.sectionLabel}>十六进制</span>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#rrggbb"
          style={styles.hexInput}
        />
      </div>

      <div style={styles.section}>
        <span style={styles.sectionLabel}>RGB值</span>
        <div style={styles.rgbRow}>
          <input
            type="number"
            min={0}
            max={255}
            value={rInput}
            onChange={(e) => setRInput(e.target.value)}
            placeholder="R"
            style={styles.rgbInput}
          />
          <input
            type="number"
            min={0}
            max={255}
            value={gInput}
            onChange={(e) => setGInput(e.target.value)}
            placeholder="G"
            style={styles.rgbInput}
          />
          <input
            type="number"
            min={0}
            max={255}
            value={bInput}
            onChange={(e) => setBInput(e.target.value)}
            placeholder="B"
            style={styles.rgbInput}
          />
          <button onClick={handleRgbInput} style={styles.applyBtn}>
            应用
          </button>
        </div>
      </div>

      <button
        onClick={handleComputeMix}
        disabled={computing}
        style={{
          ...styles.mixButton,
          ...(computing ? styles.mixButtonDisabled : {}),
        }}
      >
        {computing ? '计算中...' : '计算混色'}
      </button>

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}
