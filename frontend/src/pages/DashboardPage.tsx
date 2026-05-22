import React from 'react';
import PaintList from '../components/paint/PaintList';

export default function DashboardPage() {
  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '24px',
      maxWidth: '960px',
      margin: '0 auto',
    },
    heading: {
      color: '#dbdee1',
      fontSize: '28px',
      fontWeight: 700,
      marginBottom: '8px',
    },
    subtitle: {
      color: '#949ba0',
      fontSize: '14px',
      marginBottom: '24px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.subtitle}>Manage your paint library</p>
      <PaintList />
    </div>
  );
}
