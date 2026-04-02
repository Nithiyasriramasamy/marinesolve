import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

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
      alert("Please enter a valid age.");
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
    <div className="mobile-container">
      <div className="glass-nav">
        <Shield size={24} color="#0088ff" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Register</h2>
      </div>
      <div className="page">
        <div className="card" style={{ padding: '20px', width: '100%', maxWidth: '350px', margin: '20px auto 0' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#94a3b8' }}>Full Name *</label>
              <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} placeholder="e.g. Nithiya" required={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }} />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#94a3b8' }}>Age *</label>
              <input type="number" name="age" className="input-field" value={formData.age} onChange={handleChange} placeholder="e.g. 25" required={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }} />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#94a3b8' }}>Location (Port/City) *</label>
              <input type="text" name="location" list="locations" className="input-field" value={formData.location} onChange={handleChange} placeholder="Start typing..." required={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }} />
              <datalist id="locations">
                <option value="Karwar" />
                <option value="Mangalore" />
                <option value="Udupi" />
                <option value="Bhatkal" />
                <option value="Kundapura" />
              </datalist>
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#94a3b8' }}>Fishing Experience (Optional)</label>
              <select name="experience" className="input-field" value={formData.experience} onChange={handleChange} style={{ width: '100%', padding: '12px', background: '#0a192f', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
                <option value="Beginner">Beginner (&lt; 2 years)</option>
                <option value="Intermediate">Intermediate (2-5 years)</option>
                <option value="Expert">Expert (5+ years)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Account <ArrowRight size={20} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: '#94a3b8' }}>
            Already registered? <Link to="/login" style={{ color: '#0088ff', textDecoration: 'none' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
