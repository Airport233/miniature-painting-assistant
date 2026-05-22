import React, { useState } from 'react';
import { usePaintStore } from '../../store/paintStore';
import PhotoColorPicker from './PhotoColorPicker';
import type { PaintRequest, PaintResponse } from '../../types';

interface PaintFormProps {
  paint?: PaintResponse | null;
  onClose: () => void;
}

const BRAND_OPTIONS = ['GW', 'AV', 'AK', 'GSW', 'Scale75', 'Other'];
const STANDARD_BRANDS = ['GW', 'AV', 'AK', 'GSW', 'Scale75', 'Other'];

function initBrand(paint?: PaintResponse | null): string {
  if (!paint) return 'GW';
  return STANDARD_BRANDS.includes(paint.brand) ? paint.brand : 'Other';
}

function initBrandOther(paint?: PaintResponse | null): string {
  if (!paint) return '';
  if (paint.brand === 'Other') return paint.brandOther ?? '';
  if (!STANDARD_BRANDS.includes(paint.brand)) return paint.brand;
  return '';
}

export default function PaintForm({ paint, onClose }: PaintFormProps) {
  const { create, update } = usePaintStore();
  const isEditing = !!paint;

  const [brand, setBrand] = useState(initBrand(paint));
  const [brandOther, setBrandOther] = useState(initBrandOther(paint));
  const [colorName, setColorName] = useState(paint?.colorName ?? '');
  const [colorCode, setColorCode] = useState(paint?.colorCode ?? '');
  const [r, setR] = useState(paint?.r ?? 0);
  const [g, setG] = useState(paint?.g ?? 0);
  const [b, setB] = useState(paint?.b ?? 0);
  const [notes, setNotes] = useState(paint?.notes ?? '');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!colorName.trim()) {
      setFormError('请填写颜色名称');
      return;
    }
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      setFormError('RGB值必须在0到255之间');
      return;
    }
    if (brand === 'Other' && !brandOther.trim()) {
      setFormError('请填写自定义品牌名称');
      return;
    }

    const data: PaintRequest = {
      brand: brand === 'Other' ? 'Other' : brand,
      ...(brand === 'Other' && brandOther.trim() ? { brandOther: brandOther.trim() } : {}),
      colorName: colorName.trim(),
      ...(colorCode.trim() ? { colorCode: colorCode.trim() } : {}),
      r,
      g,
      b,
    };
    if (notes.trim()) {
      data.notes = notes.trim();
    }

    setSubmitting(true);
    if (isEditing) {
      await update(paint!.id, data);
    } else {
      await create(data);
    }
    setSubmitting(false);

    const storeError = usePaintStore.getState().error;
    if (storeError) {
      setFormError(storeError);
    } else {
      onClose();
    }
  };

  const handleColorPicked = (pr: number, pg: number, pb: number) => {
    setR(pr);
    setG(pg);
    setB(pb);
  };

  const previewColor = `rgb(${r},${g},${b})`;

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    card: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
      maxWidth: '520px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    },
    title: {
      color: '#dbdee1',
      fontSize: '20px',
      fontWeight: 600,
      marginBottom: '20px',
    },
    label: {
      color: '#b5bac1',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      marginBottom: '6px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '14px',
    },
    numberRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '14px',
    },
    numberField: {
      flex: 1,
    },
    numberInput: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    previewBox: {
      width: '40px',
      height: '40px',
      borderRadius: '6px',
      border: '1px solid #4e5058',
      backgroundColor: previewColor,
      flexShrink: 0,
    },
    previewRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      marginBottom: '6px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      resize: 'vertical' as const,
      minHeight: '60px',
      fontFamily: 'inherit',
      marginBottom: '14px',
    },
    select: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '14px',
    },
    error: {
      color: '#da373c',
      fontSize: '13px',
      marginBottom: '12px',
      textAlign: 'center' as const,
    },
    buttonRow: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      marginTop: '8px',
    },
    primaryButton: {
      padding: '10px 20px',
      backgroundColor: '#5865f2',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 600,
      cursor: submitting ? 'not-allowed' : 'pointer',
      opacity: submitting ? 0.6 : 1,
    },
    cancelButton: {
      padding: '10px 20px',
      backgroundColor: '#4e5058',
      border: 'none',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    photoPickerSection: {
      marginTop: '8px',
      marginBottom: '14px',
      padding: '12px',
      backgroundColor: '#1e1f22',
      borderRadius: '6px',
      border: '1px dashed #4e5058',
    },
    photoPickerLabel: {
      color: '#b5bac1',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      marginBottom: '6px',
      display: 'block',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>
          {isEditing ? '编辑漆料' : '添加漆料'}
        </h2>

        {formError && <div style={styles.error}>{formError}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>品牌</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={styles.select}
          >
            {BRAND_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {brand === 'Other' && (
            <>
              <label style={styles.label}>自定义品牌名称</label>
              <input
                type="text"
                value={brandOther}
                onChange={(e) => setBrandOther(e.target.value)}
                placeholder="输入品牌名称"
                style={styles.input}
              />
            </>
          )}

          <label style={styles.label}>颜色名称</label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="例如 阿巴顿黑"
            style={styles.input}
            required
          />

          <label style={styles.label}>色号（选填）</label>
          <input
            type="text"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            placeholder="例如 AB001"
            style={styles.input}
          />

          <div style={styles.previewRow}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>RGB值</label>
              <div style={styles.numberRow}>
                <div style={styles.numberField}>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={r}
                    onChange={(e) => setR(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                    style={styles.numberInput}
                    placeholder="R"
                  />
                </div>
                <div style={styles.numberField}>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={g}
                    onChange={(e) => setG(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                    style={styles.numberInput}
                    placeholder="G"
                  />
                </div>
                <div style={styles.numberField}>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={b}
                    onChange={(e) => setB(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
                    style={styles.numberInput}
                    placeholder="B"
                  />
                </div>
              </div>
            </div>
            <div style={styles.previewBox} title={previewColor} />
          </div>

          <div style={styles.photoPickerSection}>
            <span style={styles.photoPickerLabel}>从照片取色</span>
            <PhotoColorPicker onColorPicked={handleColorPicked} />
          </div>

          <label style={styles.label}>备注（选填）</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="关于这瓶漆料的备注..."
            style={styles.textarea}
          />

          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={styles.primaryButton}
            >
              {submitting ? '保存中...' : isEditing ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
