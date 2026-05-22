import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/auth';

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
    textAlign: 'center',
  },
  title: {
    color: '#dbdee1',
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '24px',
  },
  message: {
    color: '#949ba0',
    fontSize: '14px',
    marginBottom: '12px',
  },
  link: {
    color: '#00a8fc',
    fontSize: '13px',
    textDecoration: 'none',
    display: 'block',
    marginTop: '16px',
  },
};

export default function EmailVerifiedPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' && (
          <>
            <h1 style={styles.title}>Verifying Email</h1>
            <p style={styles.message}>Please wait while we verify your email address...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1 style={styles.title}>Email Verified</h1>
            <p style={styles.message}>Your email has been successfully verified. You can now sign in.</p>
            <Link to="/login" style={styles.link}>
              Go to Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 style={styles.title}>Verification Failed</h1>
            <p style={styles.message}>
              The verification link is invalid or has expired. Please try registering again.
            </p>
            <Link to="/register" style={styles.link}>
              Back to Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
