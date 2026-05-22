import React, { useEffect, useState } from 'react';
import { usePaintStore } from '../../store/paintStore';
import PaintForm from './PaintForm';
import type { PaintResponse } from '../../types';

const BRANDS = ['GW', 'AV', 'AK', 'GSW', 'Scale75', 'Other'];

function displayBrand(paint: PaintResponse): string {
  if (paint.brand === 'Other' && paint.brandOther) {
    return paint.brandOther;
  }
  return paint.brand;
}

export default function PaintList() {
  const { paints, loading, error, fetch, remove } = usePaintStore();
  const [brandFilter, setBrandFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPaint, setEditingPaint] = useState<PaintResponse | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filtered = brandFilter
    ? paints.filter((p) => p.brand === brandFilter)
    : paints;

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this paint?')) {
      await remove(id);
    }
  };

  const handleAdd = () => {
    setEditingPaint(null);
    setShowForm(true);
  };

  const handleEdit = (paint: PaintResponse) => {
    setEditingPaint(paint);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPaint(null);
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      flexWrap: 'wrap' as const,
      gap: '10px',
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    filterLabel: {
      color: '#b5bac1',
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    filterSelect: {
      padding: '8px 10px',
      backgroundColor: '#1e1f22',
      border: '1px solid #4e5058',
      borderRadius: '4px',
      color: '#dbdee1',
      fontSize: '13px',
      outline: 'none',
    },
    addButton: {
      padding: '8px 16px',
      backgroundColor: '#5865f2',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      color: '#b5bac1',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      textAlign: 'left' as const,
      padding: '8px 10px',
      borderBottom: '2px solid #4e5058',
    },
    td: {
      color: '#dbdee1',
      fontSize: '14px',
      padding: '10px',
      borderBottom: '1px solid #3c3f45',
      verticalAlign: 'middle' as const,
    },
    swatch: {
      width: '32px',
      height: '32px',
      borderRadius: '4px',
      border: '1px solid #4e5058',
    },
    actionButton: {
      padding: '4px 10px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      marginRight: '6px',
    },
    editButton: {
      backgroundColor: '#5865f2',
      color: '#fff',
    },
    deleteButton: {
      backgroundColor: '#da373c',
      color: '#fff',
    },
    loadingText: {
      color: '#b5bac1',
      fontSize: '14px',
      padding: '20px 0',
      textAlign: 'center' as const,
    },
    errorText: {
      color: '#da373c',
      fontSize: '14px',
      padding: '20px 0',
      textAlign: 'center' as const,
    },
    emptyText: {
      color: '#949ba0',
      fontSize: '14px',
      padding: '30px 0',
      textAlign: 'center' as const,
    },
    emptySubtext: {
      color: '#b5bac1',
      fontSize: '13px',
      marginTop: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Brand</span>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAdd} style={styles.addButton}>
          + Add Paint
        </button>
      </div>

      {loading && paints.length === 0 && (
        <div style={styles.loadingText}>Loading paints...</div>
      )}

      {error && (
        <div style={styles.errorText}>{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.emptyText}>
          <div>No paints found.</div>
          <div style={styles.emptySubtext}>
            {brandFilter
              ? 'Try changing the brand filter or add a new paint.'
              : 'Click "+ Add Paint" to add your first paint.'}
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Color Name</th>
              <th style={styles.th}>Brand</th>
              <th style={styles.th}>Code</th>
              <th style={styles.th}>Swatch</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((paint) => (
              <tr key={paint.id}>
                <td style={styles.td}>{paint.colorName}</td>
                <td style={styles.td}>{displayBrand(paint)}</td>
                <td style={styles.td}>{paint.colorCode || '-'}</td>
                <td style={styles.td}>
                  <div
                    style={{
                      ...styles.swatch,
                      backgroundColor: `rgb(${paint.r},${paint.g},${paint.b})`,
                    }}
                  />
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(paint)}
                    style={{ ...styles.actionButton, ...styles.editButton }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(paint.id)}
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <PaintForm paint={editingPaint} onClose={handleCloseForm} />
      )}
    </div>
  );
}
