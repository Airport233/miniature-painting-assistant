import React, { useState } from 'react';
import PaintList from '../components/paint/PaintList';
import PaintForm from '../components/paint/PaintForm';

export default function PaintsPage() {
  const [showForm, setShowForm] = useState(false);

  const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    heading: {
      color: '#dbdee1',
      fontSize: '28px',
      fontWeight: 700,
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#5865f2',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    content: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.heading}>漆料库</h1>
        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          + 添加漆料
        </button>
      </div>
      <div style={styles.content}>
        <PaintList />
      </div>
      {showForm && <PaintForm paint={null} onClose={() => setShowForm(false)} />}
    </div>
  );
}
