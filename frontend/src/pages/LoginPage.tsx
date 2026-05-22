import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { login as loginApi } from '../api/auth';

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
  error: {
    color: '#da373c',
    fontSize: '13px',
    marginBottom: '12px',
    textAlign: 'center',
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginApi({ email, password });
      loginStore(res.token, res.user);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Sign In</h1>
        {error && <div style={styles.error}>{error}</div>}
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          Sign In
        </button>
        <Link to="/register" style={styles.link}>
          Don't have an account? Register
        </Link>
        <Link to="/forgot-password" style={styles.link}>
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
