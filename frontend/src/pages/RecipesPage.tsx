import React from 'react';
import RecipeList from '../components/recipe/RecipeList';

export default function RecipesPage() {
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
    content: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.heading}>配方库</h1>
      </div>
      <div style={styles.content}>
        <RecipeList />
      </div>
    </div>
  );
}
