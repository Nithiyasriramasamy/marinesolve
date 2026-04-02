import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, User, MapPin, Calendar, Anchor, Waves } from 'lucide-react';

const Register = ({ setAuthData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    experience: 'Beginner'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      alert("Please enter a valid age (10-100).");
      return;
    }

    const newUser = {
      ...formData,
      age: ageNum
    };

    localStorage.setItem('marine_tracker_user', JSON.stringify(newUser));
    setAuthData(newUser);
    navigate('/setup');
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
          bottom: '20%', left: '-40px',
          background: 'radial-gradient(circle, rgba(0,207,213,0.10) 0%, transparent 70%)'
        }} />

        {/* Logo */}
        <div className="auth-icon-logo" style={{ width: '72px', height: '72px', marginBottom: '20px' }}>
          <Waves size={32} color="white" />
        </div>

        {/* Card */}
        <div className="auth-card" style={{ padding: '32px 24px', width: '100%', maxWidth: '380px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '6px', fontSize: '1.5rem', fontWeight: 700 }}>
            Create Account
          </h2>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '24px', marginTop: 0 }}>
            Join the marine advisory platform
          </p>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '18px' }}>
              <label className="auth-label">Full Name *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', color: '#475569', pointerEvents: 'none' }} />
                <input
                  type="text"
                  name="name"
                  className="auth-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Nithiya"
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div style={{ marginBottom: '18px' }}>
              <label className="auth-label">Age *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '14px', color: '#475569', pointerEvents: 'none' }} />
                <input
                  type="number"
                  name="age"
                  className="auth-input"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  required
                  min="10"
                  max="100"
                />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '18px' }}>
              <label className="auth-label">Location (Port/City) *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '14px', color: '#475569', pointerEvents: 'none' }} />
                <input
                  type="text"
                  name="location"
                  list="locations"
                  className="auth-input"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Start typing..."
                  required
                />
              </div>
              <datalist id="locations">
                <option value="Karwar" />
                <option value="Mangalore" />
                <option value="Udupi" />
                <option value="Bhatkal" />
                <option value="Kundapura" />
              </datalist>
            </div>

            {/* Fishing Experience */}
            <div style={{ marginBottom: '28px' }}>
              <label className="auth-label">Fishing Experience</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Anchor size={18} style={{ position: 'absolute', left: '14px', color: '#475569', pointerEvents: 'none' }} />
                <select
                  name="experience"
                  className="auth-select"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner (&lt; 2 years)</option>
                  <option value="Intermediate">Intermediate (2-5 years)</option>
                  <option value="Expert">Expert (5+ years)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="auth-btn">
              Create Account <ArrowRight size={20} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
            Already registered?{' '}
            <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
