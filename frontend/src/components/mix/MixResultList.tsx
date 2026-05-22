import React from 'react';
import type { MixResponse } from '../../types';
import MixResultCard from './MixResultCard';

interface MixResultListProps {
  mixResult: MixResponse | null;
  loading: boolean;
  error: string | null;
  onPreview3d: (hex: string) => void;
}

export default function MixResultList({
  mixResult,
  loading,
  error,
  onPreview3d,
}: MixResultListProps) {
  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '20px',
    },
    heading: {
      color: '#dbdee1',
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '16px',
    },
    tricolorRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#1e1f22',
      borderRadius: '6px',
    },
    tricolorItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    tricolorLabel: {
      color: '#b5bac1',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    tricolorValue: {
      color: '#dbdee1',
      fontSize: '14px',
      fontWeight: 600,
    },
    loadingText: {
      color: '#b5bac1',
      fontSize: '14px',
      padding: '20px 0',
      textAlign: 'center',
    },
    errorText: {
      color: '#da373c',
      fontSize: '14px',
      padding: '20px 0',
      textAlign: 'center',
    },
    emptyText: {
      color: '#949ba0',
      fontSize: '14px',
      padding: '30px 0',
      textAlign: 'center',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>混色结果</h3>
        <div style={styles.loadingText}>正在计算混色...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>混色结果</h3>
        <div style={styles.errorText}>{error}</div>
      </div>
    );
  }

  if (!mixResult) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>混色结果</h3>
        <div style={styles.emptyText}>
          选择目标色并点击"计算混色"
        </div>
      </div>
    );
  }

  const sorted = [...mixResult.candidates].sort((a, b) => a.deltaE - b.deltaE);

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Mix Results</h3>

      <div style={styles.tricolorRow}>
        <div style={styles.tricolorItem}>
          <span style={styles.tricolorLabel}>C</span>
          <span style={styles.tricolorValue}>
            {(mixResult.tricolor.cyan * 100).toFixed(0)}%
          </span>
        </div>
        <div style={styles.tricolorItem}>
          <span style={styles.tricolorLabel}>M</span>
          <span style={styles.tricolorValue}>
            {(mixResult.tricolor.magenta * 100).toFixed(0)}%
          </span>
        </div>
        <div style={styles.tricolorItem}>
          <span style={styles.tricolorLabel}>Y</span>
          <span style={styles.tricolorValue}>
            {(mixResult.tricolor.yellow * 100).toFixed(0)}%
          </span>
        </div>
        <div style={styles.tricolorItem}>
          <span style={styles.tricolorLabel}>W</span>
          <span style={styles.tricolorValue}>
            {(mixResult.tricolor.white * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {sorted.map((candidate, idx) => (
        <MixResultCard
          key={idx}
          candidate={candidate}
          onPreview3d={onPreview3d}
        />
      ))}
    </div>
  );
}
