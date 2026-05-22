import React from 'react';
import type { MixCandidate } from '../../types';
import * as recipeApi from '../../api/recipes';

interface MixResultCardProps {
  candidate: MixCandidate;
  onPreview3d: (hex: string) => void;
}

export default function MixResultCard({
  candidate,
  onPreview3d,
}: MixResultCardProps) {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const handleSaveRecipe = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await recipeApi.create({
        name: `Mix ΔE=${candidate.deltaE.toFixed(1)}`,
        targetR: candidate.mixedR,
        targetG: candidate.mixedG,
        targetB: candidate.mixedB,
        components: candidate.components.map((c) => ({
          paintId: c.paintId,
          ratio: c.ratio,
        })),
      });
      setSaved(true);
    } catch {
      setSaveError('保存配方失败。');
    } finally {
      setSaving(false);
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    card: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #3c3f45',
      marginBottom: '12px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    swatch: {
      width: '48px',
      height: '48px',
      borderRadius: '6px',
      border: '1px solid #4e5058',
      flexShrink: 0,
    },
    info: {
      flex: 1,
      marginLeft: '12px',
    },
    deltaE: {
      color: candidate.deltaE <= 1 ? '#3ba55d' : candidate.deltaE <= 3 ? '#faa81a' : '#da373c',
      fontSize: '18px',
      fontWeight: 700,
    },
    deltaLabel: {
      color: '#949ba0',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    badges: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '12px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      backgroundColor: '#1e1f22',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '13px',
    },
    ratio: {
      color: '#b5bac1',
      fontSize: '11px',
      fontWeight: 600,
    },
    traceLabel: {
      color: '#faa81a',
      fontSize: '11px',
      fontWeight: 600,
      marginLeft: '4px',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    btn: {
      padding: '6px 14px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    previewBtn: {
      backgroundColor: '#5865f2',
      color: '#fff',
    },
    saveBtn: {
      backgroundColor: '#3ba55d',
      color: '#fff',
    },
    saveBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    savedText: {
      color: '#3ba55d',
      fontSize: '12px',
      fontWeight: 600,
    },
    saveError: {
      color: '#da373c',
      fontSize: '12px',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div
          style={{
            ...styles.swatch,
            backgroundColor: candidate.previewHex,
          }}
        />
        <div style={styles.info}>
          <div style={styles.deltaE}>{candidate.deltaE.toFixed(2)}</div>
          <div style={styles.deltaLabel}>色差值</div>
        </div>
      </div>

      <div style={styles.badges}>
        {candidate.components.map((comp, idx) => (
          <div key={idx} style={styles.badge}>
            <span>{comp.paintName}</span>
            <span style={styles.ratio}>
              {comp.ratio}
              {comp.traceAmount ? '' : ''}
            </span>
            {comp.traceAmount && (
              <span style={styles.traceLabel}>少量</span>
            )}
          </div>
        ))}
      </div>

      <div style={styles.actions}>
        <button
          onClick={() => onPreview3d(candidate.previewHex)}
          style={{ ...styles.btn, ...styles.previewBtn }}
        >
          3D预览
        </button>
        {saved ? (
          <span style={styles.savedText}>已保存！</span>
        ) : (
          <button
            onClick={handleSaveRecipe}
            disabled={saving}
            style={{
              ...styles.btn,
              ...styles.saveBtn,
              ...(saving ? styles.saveBtnDisabled : {}),
            }}
          >
            {saving ? '保存中...' : '保存为配方'}
          </button>
        )}
      </div>

      {saveError && <div style={styles.saveError}>{saveError}</div>}
    </div>
  );
}
