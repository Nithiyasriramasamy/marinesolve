import React from 'react'
import { Link } from 'react-router-dom'
import { Anchor, Shield, Fish } from 'lucide-react'

const Welcome = ({ authData }) => {
  return (
    <div className="mobile-container welcome-page">
      <div className="page" style={{ justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(135deg, #4c92f4ff, #071b3eff)', color: 'white' }}>
        <div className="logo-container" style={{ marginBottom: 40 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Shield size={100} color="#0088ff" strokeWidth={1} style={{ opacity: 0.3 }} />
            <Anchor size={48} color="#00cfd5" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>
        </div>

        <h1 style={{ color: 'white', marginBottom: 10 }}>SeaGuard AI</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: 60 }}>
          Precision Fishing Intelligence for Modern Fishermen
        </p>

        <Link to={authData ? "/setup" : "/login"} className="btn btn-primary" style={{ width: '100%', maxWidth: 280, margin: '0 auto' }}>
          Start Now <Shield size={20} />
        </Link>

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            <Fish size={16} /> Satellite Tracking
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            <Shield size={16} /> AI Predictions
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
