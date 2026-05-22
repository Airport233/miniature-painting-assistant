import React, { useState } from 'react';
import * as modelsApi from '../../api/models';

interface StlUploaderProps {
  onModelLoaded: (url: string, filename: string) => void;
}

export default function StlUploader({ onModelLoaded }: StlUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('请选择.stl文件');
      return;
    }

    setUploading(true);
    setError(null);
    setFilename(file.name);

    try {
      const result = await modelsApi.upload(file);
      setModelUrl(result.filePath);
      onModelLoaded(result.filePath, file.name);
    } catch {
      setError('上传模型失败。');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setFilename(null);
    setModelUrl(null);
    setError(null);
    onModelLoaded('', '');
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: '#2b2d31',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '12px',
    },
    heading: {
      color: '#dbdee1',
      fontSize: '14px',
      fontWeight: 700,
      marginBottom: '10px',
    },
    fileInput: {
      color: '#dbdee1',
      fontSize: '13px',
      marginBottom: '8px',
    },
    statusRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      backgroundColor: '#1e1f22',
      borderRadius: '4px',
      marginTop: '8px',
    },
    filename: {
      color: '#dbdee1',
      fontSize: '13px',
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
    uploading: {
      color: '#b5bac1',
      fontSize: '13px',
      marginTop: '8px',
    },
    error: {
      color: '#da373c',
      fontSize: '12px',
      marginTop: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.heading}>STL模型</h4>

      <input
        type="file"
        accept=".stl"
        onChange={handleFileChange}
        disabled={uploading}
        style={styles.fileInput}
      />

      {uploading && <div style={styles.uploading}>上传中...</div>}

      {error && <div style={styles.error}>{error}</div>}

      {modelUrl && filename && (
        <div style={styles.statusRow}>
          <span style={styles.filename}>已加载: {filename}</span>
          <button onClick={handleDelete} style={styles.deleteBtn}>
            删除
          </button>
        </div>
      )}
    </div>
  );
}
