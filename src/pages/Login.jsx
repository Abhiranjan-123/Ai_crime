import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginUser(credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>FIR Management System</h2>
        <p style={styles.subheading}>Sign in to access your dashboard</p>
        
        {error && <div style={styles.errorBox}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" name="email" required onChange={handleChange} style={styles.input} placeholder="officer@department.gov" />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" required onChange={handleChange} style={styles.input} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account? <Link to="/signup" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Segoe UI, sans-serif' },
  card: { width: '100%', maxWidth: '420px', padding: '40px', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
  heading: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#1a202c', textAlign: 'center' },
  subheading: { margin: '0 0 24px 0', fontSize: '14px', color: '#718096', textAlign: 'center' },
  inputGroup: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#4a5568' },
  input: { width: '100%', padding: '10px 14px', boxSizing: 'border-box', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border 0.2s' },
  button: { width: '100%', padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#3182ce', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  errorBox: { padding: '12px', marginBottom: '16px', borderRadius: '6px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', fontSize: '13px' },
  footerText: { marginTop: '20px', fontSize: '13px', color: '#718096', textAlign: 'center' },
  link: { color: '#3182ce', textDecoration: 'none', fontWeight: '500' }
};

export default Login;