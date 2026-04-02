import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { MapPin, Navigation, MousePointer, Search, ArrowRight, Loader2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Internal component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const Location = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gps');
  const [loading, setLoading] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
  const [error, setError] = useState(null);

  const handleLocationSelect = (lat, lon) => {
    setUserData({
      ...userData,
      location: { lat, lon }
    });
    setError(null);
  };

  const handleGetGPS = () => {
    setLoading(true);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationSelect(position.coords.latitude, position.coords.longitude);
          setLoading(false);
        },
        (err) => {
          setError("GPS access denied. Use Manual selection.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!addressSearch) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        handleLocationSelect(parseFloat(lat), parseFloat(lon));
      } else {
        setError("Location not found. Try tapping on map.");
      }
    } catch (err) {
      setError("Search failed. Try map selection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container location-page">
      <div className="glass-nav">
        <MapPin size={24} color="#0088ff" />
        <h2 style={{ fontSize: '1rem', margin: 0 }}>Select Fishing Area</h2>
      </div>

      <div className="page" style={{ paddingTop: 80 }}>
        <div className="card">
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'gps' ? 'active' : ''}`} onClick={() => setActiveTab('gps')}>
              <Navigation size={18} /> GPS
            </button>
            <button className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
              <MousePointer size={18} /> Map
            </button>
            <button className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
              <Search size={18} /> Search
            </button>
          </div>

          {activeTab === 'gps' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: 15 }}>Automatically detect your current vessel position.</p>
              <button onClick={handleGetGPS} className="btn btn-secondary" style={{ width: '100%' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Use My Location"}
              </button>
            </div>
          )}

          {activeTab === 'map' && (
            <div style={{ textAlign: 'center' }}>
              <div className="help-text">Tap anywhere on the map to set your fishing location.</div>
              <div className="mini-map">
                <MapContainer center={[userData.location.lat || 12.97, userData.location.lon || 74.8]} zoom={10} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  {userData.location.lat && <Marker position={[userData.location.lat, userData.location.lon]} />}
                </MapContainer>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="e.g. Mangalore, India" 
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="btn-primary" style={{ padding: '0 15px', borderRadius: 8 }}>
                  <Search size={20} />
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Enter a town, port, or landmark name.</p>
            </div>
          )}

          {userData.location.lat && (
            <div style={{ marginTop: 15, padding: '10px 15px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
              <div style={{ color: '#166534', fontWeight: 600, fontSize: '0.9rem' }}>Location Selected:</div>
              <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                Lat: {userData.location.lat.toFixed(4)}, Lon: {userData.location.lon.toFixed(4)}
              </div>
            </div>
          )}

          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 10 }}>{error}</p>}
        </div>

        {userData.location.lat && (
          <button onClick={() => navigate('/map')} className="btn btn-primary" style={{ marginTop: 'auto' }}>
            Find Best Fishing Zones <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Location
