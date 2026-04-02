import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, User, Waves } from 'lucide-react';

const Login = ({ setAuthData }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem('marine_tracker_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.name.toLowerCase() === name.toLowerCase()) {
        setAuthData(parsed);
        navigate('/setup');
        return;
      }
    }
    setError('User not found. Please register.');
  };

  return (
    <div className="mobile-container auth-container">
      <div className="glass-nav">
        <Shield size={24} color="#0088ff" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>MarineSolve</h2>
      </div>

      <div className="page auth-page">
        {/* Decorative glow */}
        <div className="auth-glow-bg" style={{
          top: '15%', right: '-30px',
          background: 'radial-gradient(circle, rgba(0,136,255,0.12) 0%, transparent 70%)'
        }} />

        {/* Logo */}
        <div className="auth-icon-logo">
          <Waves size={36} color="white" />
        </div>

        {/* Card */}
        <div className="auth-card" style={{ padding: '36px 28px', width: '100%', maxWidth: '360px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1.6rem', fontWeight: 700 }}>
            Welcome Back
          </h2>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '28px', marginTop: 0 }}>
            Sign in to your marine advisory
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label className="auth-label">Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{
                  position: 'absolute', left: '14px', color: '#475569', pointerEvents: 'none'
                }} />
                <input
                  type="text"
                  className="auth-input"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Enter your registered name"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <p>{error}</p>
              </div>
            )}

            <button type="submit" className="auth-btn">
              Login <ArrowRight size={20} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
            New user?{' '}
            <Link to="/register" className="auth-link">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
