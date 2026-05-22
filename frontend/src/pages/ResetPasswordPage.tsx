import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../api/auth';

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#313338',
  },
  card: {
    backgroundColor: '#2b2d31',
    padding: '32px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  title: {
    color: '#dbdee1',
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '24px',
    textAlign: 'center',
  },
  label: {
    color: '#b5bac1',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
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
    marginBottom: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5865f2',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '12px',
  },
  link: {
    color: '#00a8fc',
    fontSize: '13px',
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
    marginTop: '8px',
  },
  message: {
    color: '#949ba0',
    fontSize: '14px',
    marginBottom: '12px',
    textAlign: 'center',
  },
};

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('密码不匹配。');
      return;
    }

    if (!token) {
      setError('重置令牌无效或缺失。');
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch {
      setError('重置密码失败，链接可能已过期。');
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>密码已重置</h1>
          <p style={styles.message}>
            密码已成功重置。
          </p>
          <Link to="/login" style={styles.link}>
            返回登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>重置密码</h1>
        {error && <div style={{ ...styles.message, color: '#da373c' }}>{error}</div>}
        <label style={styles.label}>新密码</label>
        <input
          style={styles.input}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label style={styles.label}>确认密码</label>
        <input
          style={styles.input}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          重置密码
        </button>
        <Link to="/login" style={styles.link}>
          返回登录
        </Link>
      </form>
    </div>
  );
}
