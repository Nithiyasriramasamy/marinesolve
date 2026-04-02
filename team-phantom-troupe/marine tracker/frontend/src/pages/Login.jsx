import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

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
    <div className="mobile-container">
      <div className="glass-nav">
        <Shield size={24} color="#0088ff" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Login</h2>
      </div>
      <div className="page" style={{ justifyContent: 'center' }}>
        <div className="card" style={{ padding: '30px 20px', width: '100%', maxWidth: '350px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Welcome Back</h2>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: '#94a3b8' }}>Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name" 
                required 
              />
            </div>
            
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 20, textAlign: 'center' }}>{error}</p>}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Login <ArrowRight size={20} />
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: '#94a3b8' }}>
            New user? <Link to="/register" style={{ color: '#0088ff', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
