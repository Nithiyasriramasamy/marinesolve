import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle, Fuel, MapPin, Star, Share2 } from 'lucide-react'

const Summary = ({ userData, recommendations }) => {
  const bestZone = recommendations.length > 0 ? recommendations[0] : null;
  const isFuelEnough = bestZone && parseFloat(userData.fuel) > (bestZone.distance * 0.5); // Simple 0.5L/km estimate
  const formatScore = (score) => Math.round((parseFloat(score) || 0) * 100);

  return (
    <div className="mobile-container summary-page">
      <div className="glass-nav">
        <Shield size={24} color="#0088ff" />
        <h2 style={{ fontSize: '1rem', margin: 0 }}>Trip Summary</h2>
      </div>

      <div className="page" style={{ paddingTop: 80, paddingBottom: 24 }}>
        {bestZone ? (
          <>
            <div className="card" style={{ textAlign: 'center', borderColor: '#16a34a', borderWidth: 2, borderStyle: 'solid' }}>
              <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 15px' }} />
              <h3>AI Best Zone Found</h3>
              <p style={{ color: '#047857' }}>Optimal Zone Identified {bestZone.distance} km Away</p>
            </div>

            <div className="card" style={{ background: '#f8fafc', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                <div style={{ background: '#0ea5e9', padding: 8, borderRadius: 8 }}>
                  <MapPin size={24} color="white" />
                </div>
                <div>
                   <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Distance to Zone</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{bestZone.distance} km</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                <div style={{ background: '#f59e0b', padding: 8, borderRadius: 8 }}>
                  <Shield size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>AI Safety Verdict</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatScore(bestZone.safety_score)}%</div>
                   </div>
                   <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${formatScore(bestZone.safety_score)}%`, background: '#f59e0b' }}></div>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                <div style={{ background: '#8b5cf6', padding: 8, borderRadius: 8 }}>
                  <Star size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Algorithm Final Score</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatScore(bestZone.final_score)}/100</div>
                   </div>
                   <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${formatScore(bestZone.final_score)}%`, background: '#8b5cf6' }}></div>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ background: '#10b981', padding: 8, borderRadius: 8 }}>
                  <Fuel size={24} color="white" />
                </div>
                <div>
                   <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Estimated Fuel Safety</div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 600, color: isFuelEnough ? '#059669' : '#dc2626' }}>
                     {isFuelEnough ? "Sufficient Supply" : "Refuel Required"}
                   </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: '#ecfdf5', borderColor: '#6ee7b7' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#065f46', fontSize: '1.1rem' }}>
                “Best zone is {bestZone.distance} km away and safe for your {userData.boat_type} boat.”
              </p>
            </div>
          </>
        ) : (
          <div className="card" style={{ background: '#fef2f2', borderColor: '#f87171' }}>
             <p style={{ color: '#b91c1c' }}>No recommendations could be generated for your current location and vessel constraints.</p>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => alert("Sharing coordinates to navigation!")}>
            <Share2 size={20} /> Share Zone Coords
          </button>
          <Link to="/" className="btn btn-secondary">
            Restart Planning
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Summary
