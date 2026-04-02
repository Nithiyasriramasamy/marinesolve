import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { MapPin, Shield, Star, ArrowRight } from 'lucide-react'

// Fix generic icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Internal Heatmap mapping logic
function HeatmapLayer({ points }) {
    const map = useMap();
    useEffect(() => {
        if (!points || points.length === 0) return;
        
        const heatLayer = L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            gradient: {
                0.2: 'red',
                0.5: 'yellow',
                0.8: 'green'
            }
        }).addTo(map);
        
        return () => {
            map.removeLayer(heatLayer);
        };
    }, [points, map]);
    return null;
}

// Helper to auto-fit bounds
function SetBounds({ userLoc, recs }) {
    const map = useMap();
    useEffect(() => {
        if (!userLoc.lat || recs.length === 0) return;
        
        const bounds = L.latLngBounds([userLoc.lat, userLoc.lon]);
        recs.forEach(r => bounds.extend([r.lat, r.lon]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [userLoc, recs, map]);
    return null;
}

const RecommendationMap = ({ userData, authData, recommendations, setRecommendations }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [displayRecs, setDisplayRecs] = useState([]);
    
    // Heatmap states
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [heatmapData, setHeatmapData] = useState([]);

    const getRankBadge = (rank) => {
        if (rank === 1) return { icon: '🥇', label: '1st', color: '#fbbf24', bg: '#fef3c7' };
        if (rank === 2) return { icon: '🥈', label: '2nd', color: '#9ca3af', bg: '#f3f4f6' };
        if (rank === 3) return { icon: '🥉', label: '3rd', color: '#b45309', bg: '#fef3c7' };
        return { icon: '🎯', label: rank + 'th', color: '#3b82f6', bg: '#eff6ff' };
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'SAFE': return '#4caf50';
            case 'MODERATE': return '#f59e0b';
            case 'HIGH_RISK': return '#ef4444';
            case 'LOW_AVAILABILITY': return '#94a3b8';
            default: return '#64748b';
        }
    };

    useEffect(() => {
        // Load initial large map data asynchronously for fast toggle access
        const fetchHeatmap = async () => {
            try {
                const response = await axios.get('https://marinesolve-1.onrender.com/heatmap');
                setHeatmapData(response.data.heatmap_points);
            } catch(e) {
                console.error("Heatmap load error:", e);
            }
        }
        fetchHeatmap();
        
        const fetchRecommendations = async () => {
            try {
                const response = await axios.post('https://marinesolve-1.onrender.com/recommend', {
                    lat: userData.location.lat,
                    lon: userData.location.lon,
                    boat_type: userData.boat_type,
                    fuel: userData.fuel,
                    max_distance: userData.max_distance
                });
                setRecommendations(response.data.recommendations);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setLoading(false);
            }
        };

        if (userData.location.lat && userData.location.lon) {
            fetchRecommendations();
        }
    }, [userData, setRecommendations]);

    // Apply age-based personalization logic
    useEffect(() => {
        if (!recommendations || recommendations.length === 0) {
            setDisplayRecs([]);
            return;
        }
        
        const age = authData?.age || 25; // default if not logged in
        let processedRecs = [...recommendations];
        
        if (age < 18) {
            // Under 18: Only SAFE zones
            processedRecs = processedRecs.filter(r => r.status === 'SAFE');
        } else if (age >= 40) {
            // 40+: Sort SAFE zones first
            processedRecs.sort((a, b) => {
                if (a.status === 'SAFE' && b.status !== 'SAFE') return -1;
                if (b.status === 'SAFE' && a.status !== 'SAFE') return 1;
                return 0; // maintain original relative order
            });
        }
        setDisplayRecs(processedRecs);
    }, [recommendations, authData]);

    const handleContinue = () => {
        navigate('/summary');
    };

    if (loading) {
        return (
            <div className="mobile-container">
                <div className="page" style={{ justifyContent: 'center', textAlign: 'center' }}>
                    <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #0088ff', borderRadius: '50%', width: 50, height: 50, margin: '0 auto 20px', animation: 'spin 2s linear infinite' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <h3>AI Analyzing Data...</h3>
                    <p>Processing satellite imagery and boat patterns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mobile-container map-page">
            <div className="glass-nav">
              <Shield size={24} color="#0088ff" />
              <h2 style={{ fontSize: '1rem', margin: 0 }}>SeaGuard AI Results</h2>
            </div>
            
            <div className="page" style={{ paddingTop: 70 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <h3 style={{ margin: 0 }}>Map Visualization</h3>
                    <button onClick={() => setShowHeatmap(!showHeatmap)} className={`btn ${showHeatmap ? 'btn-secondary' : 'btn-primary'}`} style={{ padding: '8px 15px', borderRadius: 20, fontSize: '0.85rem' }}>
                        {showHeatmap ? "Switch to Marker View" : "Toggle Heatmap"}
                    </button>
                </div>

                <div style={{ height: '400px', width: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <MapContainer 
                        center={[userData.location.lat || 12.97, userData.location.lon || 77.59]} 
                        zoom={12} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                        <SetBounds userLoc={userData.location} recs={displayRecs} />

                        {userData.location.lat && (
                            <Marker position={[userData.location.lat, userData.location.lon]}>
                                <Popup>Your Current Vessel Position</Popup>
                            </Marker>
                        )}

                        {showHeatmap ? (
                            <HeatmapLayer points={heatmapData} />
                        ) : (
                            displayRecs.map((rec, idx) => (
                                <CircleMarker 
                                    key={idx} 
                                    center={[rec.lat, rec.lon]} 
                                    radius={10}
                                    pathOptions={{ 
                                        color: getStatusColor(rec.status),
                                        fillColor: getStatusColor(rec.status),
                                        fillOpacity: 0.8 
                                    }}
                                >
                                    <Popup>
                                        <div style={{ minWidth: 150 }}>
                                            <h4 style={{ margin: '0 0 5px', color: '#0369a1' }}>{getRankBadge(rec.rank).icon} Rank #{rec.rank}</h4>
                                            <p style={{ margin: '2px 0' }}>Status: <b style={{ color: getStatusColor(rec.status) }}>{rec.status}</b></p>
                                            <p style={{ margin: '2px 0' }}>Distance: <b>{rec.distance} km</b></p>
                                            <p style={{ margin: '2px 0', fontSize: '0.8rem' }}>Safety: <b>{Math.round(rec.safety_score * 100)}%</b></p>
                                            <p style={{ margin: '2px 0', fontSize: '0.8rem' }}>Total Rank Score: <b>{Math.round(rec.final_score * 100)}/100</b></p>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))
                        )}
                    </MapContainer>
                </div>

                {showHeatmap && (
                    <div style={{ padding: '10px 15px', background: '#f8fafc', borderRadius: 8, marginTop: 15, display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                       <strong style={{ fontSize: '0.9rem', color: '#334155' }}>Legend:</strong>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#475569' }}><div style={{width: 12, height: 12, borderRadius: '50%', background: '#4caf50'}}></div> Safe</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#475569' }}><div style={{width: 12, height: 12, borderRadius: '50%', background: '#f59e0b'}}></div> Moderate</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#475569' }}><div style={{width: 12, height: 12, borderRadius: '50%', background: '#ef4444'}}></div> High Risk</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#475569' }}><div style={{width: 12, height: 12, borderRadius: '50%', background: '#94a3b8'}}></div> Low Availability</div>
                    </div>
                )}

                <div style={{ marginTop: 20 }}>
                    {authData && <h3 style={{ color: '#0088ff', marginBottom: 5 }}>Welcome, {authData.name.split(' ')[0]}!</h3>}
                    
                    {authData?.age < 18 && (
                        <div style={{ background: '#fffbeb', color: '#b45309', padding: '10px 15px', borderRadius: 8, marginBottom: 15, fontSize: '0.9rem', borderLeft: '4px solid #f59e0b', fontWeight: 500 }}>
                            ⚠️ Safe zones recommended for your age ({authData.age}). Deep sea zones are hidden.
                        </div>
                    )}
                    {authData?.age >= 18 && authData?.age < 40 && (
                        <div style={{ background: '#f0fdf4', color: '#166534', padding: '8px 12px', borderRadius: 8, marginBottom: 15, fontSize: '0.85rem', display: 'inline-block' }}>
                            ✓ Advanced Deep-Sea Tracking Enabled 
                        </div>
                    )}
                    {authData?.age >= 40 && (
                        <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '10px 15px', borderRadius: 8, marginBottom: 15, fontSize: '0.9rem', borderLeft: '4px solid #3b82f6', fontWeight: 500 }}>
                            🛡️ High comfort and safety zones are prioritized for you.
                        </div>
                    )}

                    <h3>Top Zones</h3>
                    <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: 15}}>Best zone selected based on safety and travel distance</p>
                    {displayRecs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {displayRecs.slice(0, 3).map((rec, idx) => {
                                const rankDisplay = getRankBadge(rec.rank);
                                return (
                                    <div key={idx} className="card" style={{ padding: 15, borderLeft: `4px solid ${rankDisplay.color}`, background: rankDisplay.bg }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <h4 style={{ margin: 0 }}>{rankDisplay.icon} Zone #{rec.rank}</h4>
                                                <p style={{ margin: 0, fontSize: '0.8rem' }}>{rec.distance} km away • {rec.status}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '4px 8px', borderRadius: 8 }}>
                                                <Star size={16} color={rankDisplay.color} fill={rankDisplay.color} />
                                                <span style={{ fontWeight: 600, color: '#1e293b', marginLeft: 5 }}>{Math.round(rec.final_score * 100)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p>No suitable zones found for your boat parameters.</p>
                    )}
                </div>

                <button onClick={handleContinue} className="btn btn-primary" style={{ marginTop: 'auto' }}>
                    View Trip Summary <ArrowRight size={20} />
                </button>
            </div>
        </div>
    )
}

export default RecommendationMap
