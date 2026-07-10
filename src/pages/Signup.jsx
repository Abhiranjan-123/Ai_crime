import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../services/api';

const Signup = () => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signupUser(userData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subheading}>Register a new officer profile</p>
        
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" required onChange={handleChange} style={styles.input} placeholder="Officer Name" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" name="email" required onChange={handleChange} style={styles.input} placeholder="officer@department.gov" />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" required onChange={handleChange} style={styles.input} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
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
  input: { width: '100%', padding: '10px 14px', boxSizing: 'border-box', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  button: { width: '100%', padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#38a169', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  errorBox: { padding: '12px', marginBottom: '16px', borderRadius: '6px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', fontSize: '13px' },
  successBox: { padding: '12px', marginBottom: '16px', borderRadius: '6px', backgroundColor: '#e6fffa', border: '1px solid #b2f5ea', color: '#234e52', fontSize: '13px' },
  footerText: { marginTop: '20px', fontSize: '13px', color: '#718096', textAlign: 'center' },
  link: { color: '#3182ce', textDecoration: 'none', fontWeight: '500' }
};

export default Signup;