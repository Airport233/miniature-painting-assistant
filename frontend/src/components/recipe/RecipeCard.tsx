import React, { useState } from 'react';
import type { RecipeResponse } from '../../types';

interface RecipeCardProps {
  recipe: RecipeResponse;
  onDelete: (id: number) => void;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const [confirming, setConfirming] = useState(false);

  const targetHex =
    recipe.targetR !== undefined && recipe.targetG !== undefined && recipe.targetB !== undefined
      ? rgbToHex(recipe.targetR, recipe.targetG, recipe.targetB)
      : null;

  const handleDeleteClick = () => {
    if (confirming) {
      onDelete(recipe.id);
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  const handleCancel = () => {
    setConfirming(false);
  };

  const styles: Record<string, React.CSSProperties> = {
    card: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #3c3f45',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    name: {
      color: '#dbdee1',
      fontSize: '15px',
      fontWeight: 700,
      lineHeight: 1.3,
      flex: 1,
      marginRight: '8px',
    },
    description: {
      color: '#949ba0',
      fontSize: '12px',
      marginBottom: '12px',
      lineHeight: 1.4,
    },
    targetRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
    },
    swatch: {
      width: 28,
      height: 28,
      borderRadius: '4px',
      border: '1px solid #4e5058',
      flexShrink: 0,
    },
    targetLabel: {
      color: '#b5bac1',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.3px',
    },
    componentsHeading: {
      color: '#b5bac1',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.3px',
      marginBottom: '6px',
    },
    componentList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    componentRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
    },
    componentDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      flexShrink: 0,
    },
    componentName: {
      color: '#dbdee1',
      flex: 1,
    },
    componentRatio: {
      color: '#949ba0',
      fontSize: '12px',
      whiteSpace: 'nowrap' as const,
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '12px',
      paddingTop: '10px',
      borderTop: '1px solid #3c3f45',
    },
    dateText: {
      color: '#949ba0',
      fontSize: '11px',
    },
    deleteBtn: {
      padding: '4px 10px',
      backgroundColor: '#da373c',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    confirmGroup: {
      display: 'flex',
      gap: '6px',
    },
    confirmBtn: {
      padding: '4px 10px',
      backgroundColor: '#da373c',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    cancelBtn: {
      padding: '4px 10px',
      backgroundColor: '#4e5058',
      border: 'none',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.name}>{recipe.name}</span>
        {confirming ? (
          <div style={styles.confirmGroup}>
            <button onClick={handleDeleteClick} style={styles.confirmBtn}>
              确认
            </button>
            <button onClick={handleCancel} style={styles.cancelBtn}>
              取消
            </button>
          </div>
        ) : (
          <button onClick={handleDeleteClick} style={styles.deleteBtn}>
            删除
          </button>
        )}
      </div>

      {/* Description */}
      {recipe.description && (
        <div style={styles.description}>{recipe.description}</div>
      )}

      {/* Target color */}
      {targetHex && (
        <div style={styles.targetRow}>
          <div style={{ ...styles.swatch, backgroundColor: targetHex }} />
          <span style={styles.targetLabel}>目标色: {targetHex.toUpperCase()}</span>
        </div>
      )}

      {/* Components */}
      {recipe.components.length > 0 && (
        <>
          <div style={styles.componentsHeading}>组成</div>
          <div style={styles.componentList}>
            {recipe.components.map((comp, idx) => (
              <div key={idx} style={styles.componentRow}>
                <div style={{ ...styles.componentDot, backgroundColor: '#5865f2' }} />
                <span style={styles.componentName}>
                  {comp.paintName || `Paint #${comp.paintId}`}
                </span>
                <span style={styles.componentRatio}>
                  {Math.round(comp.ratio * 100)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.dateText}>创建于 {formatDate(recipe.createdAt)}</span>
      </div>
    </div>
  );
}
