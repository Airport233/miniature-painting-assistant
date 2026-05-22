import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/paints', icon: '🌈', label: '漆料库' },
  { path: '/workspace', icon: '🎨', label: '工作台' },
  { path: '/recipes', icon: '📁', label: '配方库' },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const close = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-sidebar]')) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded, close]);

  const handleNav = (path: string) => {
    navigate(path);
    close();
  };

  const isActive = (path: string) => location.pathname === path;

  const styles: Record<string, React.CSSProperties> = {
    sidebar: {
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: expanded ? 220 : 56,
      backgroundColor: '#2b2d31',
      borderRight: expanded ? '1px solid #4e5058' : '1px solid #4e5058',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 12,
      zIndex: expanded ? 1000 : 100,
      transition: 'width 0.2s ease',
      overflow: 'hidden',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: expanded ? 'flex-start' : 'center',
      width: expanded ? 'calc(100% - 8px)' : 48,
      padding: expanded ? '10px 12px' : '10px',
      marginBottom: 4,
      borderRadius: 8,
      border: 'none',
      backgroundColor: 'transparent',
      color: '#dbdee1',
      fontSize: 14,
      cursor: 'pointer',
      gap: 12,
      transition: 'background-color 0.15s',
      flexShrink: 0,
    },
    navItemActive: {
      backgroundColor: '#4e5058',
    },
    icon: {
      fontSize: 20,
      width: 24,
      textAlign: 'center' as const,
      flexShrink: 0,
    },
    label: {
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    spacer: {
      flex: 1,
    },
    toggleBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: expanded ? 'flex-start' : 'center',
      width: expanded ? 'calc(100% - 8px)' : 48,
      padding: expanded ? '10px 12px' : '10px',
      borderRadius: 8,
      border: 'none',
      backgroundColor: 'transparent',
      color: '#949ba0',
      fontSize: 20,
      cursor: 'pointer',
      gap: 12,
      transition: 'color 0.15s',
      flexShrink: 0,
    },
    closeBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: 'calc(100% - 8px)',
      padding: '10px 12px',
      borderRadius: 8,
      border: 'none',
      backgroundColor: 'transparent',
      color: '#949ba0',
      fontSize: 18,
      cursor: 'pointer',
      gap: 12,
      flexShrink: 0,
      marginBottom: 8,
    },
  };

  return (
    <nav style={styles.sidebar} data-sidebar>
      {expanded && (
        <button onClick={close} style={styles.closeBtn} title="收起侧栏">
          <span style={styles.icon}>✕</span>
          <span style={styles.label}>收起</span>
        </button>
      )}

      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          onClick={() => handleNav(item.path)}
          style={{
            ...styles.navItem,
            ...(isActive(item.path) ? styles.navItemActive : {}),
          }}
          title={item.label}
        >
          <span style={styles.icon}>{item.icon}</span>
          {expanded && <span style={styles.label}>{item.label}</span>}
        </button>
      ))}

      <div style={styles.spacer} />

      <button
        onClick={() => setExpanded(!expanded)}
        style={styles.toggleBtn}
        title={expanded ? '收起侧栏' : '展开侧栏'}
      >
        <span style={styles.icon}>{expanded ? '◀' : '☰'}</span>
        {expanded && <span style={styles.label}>收起侧栏</span>}
      </button>
    </nav>
  );
}
