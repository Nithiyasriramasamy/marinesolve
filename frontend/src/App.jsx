import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import UserSetup from './pages/UserSetup'
import Location from './pages/Location'
import RecommendationMap from './pages/RecommendationMap'
import Summary from './pages/Summary'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const [userData, setUserData] = useState({
    boat_type: 'small',
    fuel: 0,
    max_distance: 10,
    location: { lat: null, lon: null }
  });

  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem('marine_tracker_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [recommendations, setRecommendations] = useState([]);

  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Welcome authData={authData} />} />
          <Route path="/login" element={<Login setAuthData={setAuthData} />} />
          <Route path="/register" element={<Register setAuthData={setAuthData} />} />
          <Route path="/setup" element={<UserSetup userData={userData} setUserData={setUserData} />} />
          <Route path="/location" element={<Location userData={userData} setUserData={setUserData} />} />
          <Route path="/map" element={<RecommendationMap 
             userData={userData} 
             authData={authData}
             setRecommendations={setRecommendations} 
             recommendations={recommendations} 
          />} />
          <Route path="/summary" element={<Summary userData={userData} recommendations={recommendations} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
