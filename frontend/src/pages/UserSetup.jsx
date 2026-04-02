import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, Battery, MapPin } from 'lucide-react'

const UserSetup = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/location');
  };

  return (
    <div className="mobile-container setup-page">
      <div className="glass-nav">
        <Anchor size={24} color="#0088ff" />
        <h2 style={{ fontSize: '1rem', margin: 0 }}>Vessel Configuration</h2>
      </div>

      <div className="page" style={{ paddingTop: 80 }}>
        <div className="card">
          <h3>Setup Vessel Details</h3>
          <p>Please enter your boat and trip parameters for accurate AI recommendations.</p>
          
          <div className="input-group">
            <label>Boat Type</label>
            <select 
              value={userData.boat_type} 
              onChange={(e) => setUserData({ ...userData, boat_type: e.target.value })}
            >
              <option value="small">Small (Max 10km)</option>
              <option value="medium">Medium (Max 30km)</option>
              <option value="large">Large (No Limit)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Fuel Capacity (Liters)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                placeholder="e.g. 50"
                value={userData.fuel}
                onChange={(e) => setUserData({ ...userData, fuel: e.target.value })}
              />
              <Battery size={20} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            </div>
          </div>

          <div className="input-group">
            <label>Trip Max Distance (km)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                placeholder="e.g. 25"
                value={userData.max_distance}
                onChange={(e) => setUserData({ ...userData, max_distance: e.target.value })}
              />
              <MapPin size={20} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            </div>
          </div>
        </div>

        <button onClick={handleContinue} className="btn btn-primary" style={{ marginTop: 'auto' }}>
          Continue to Location
        </button>
      </div>
    </div>
  )
}

export default UserSetup
