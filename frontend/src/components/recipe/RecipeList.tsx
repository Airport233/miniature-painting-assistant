import React, { useEffect } from 'react';
import { useRecipeStore } from '../../store/recipeStore';
import RecipeCard from './RecipeCard';

export default function RecipeList() {
  const { recipes, loading, error, fetch, remove } = useRecipeStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDelete = async (id: number) => {
    await remove(id);
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
    },
    heading: {
      color: '#dbdee1',
      fontSize: '16px',
      fontWeight: 700,
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
    grid: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.heading}>Recipes</h3>
      </div>

      {loading && recipes.length === 0 && (
        <div style={styles.loadingText}>Loading recipes...</div>
      )}

      {error && (
        <div style={styles.errorText}>{error}</div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <div style={styles.emptyText}>No recipes saved yet.</div>
      )}

      {recipes.length > 0 && (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
