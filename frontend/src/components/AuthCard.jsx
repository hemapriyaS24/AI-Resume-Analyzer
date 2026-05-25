import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cpu, Mail, Lock, User, AlertCircle, RefreshCw } from 'lucide-react';

export default function AuthCard({ onClose }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!username.trim()) throw new Error('Username is required.');
        await register(username, email, password);
      }
      onClose(); // Switch back to Dashboard view upon successful authentication
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-card" 
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '32px',
          boxShadow: 'var(--neon-shadow)',
          borderColor: 'rgba(139, 92, 246, 0.25)',
          animation: 'pulseGlow 3s infinite ease'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Cpu className="text-neon-gradient" style={{ width: '36px', height: '36px' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', textAlign: 'center' }}>
            {isLogin ? 'Welcome Back Officer' : 'Establish Agent Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center' }}>
            {isLogin ? 'Sign in to access your secure ATS diagnostics history.' : 'Register to save analysis profiles & tracking percentiles.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMsg && (
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              padding: '10px 12px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              color: 'var(--color-weak)',
              fontSize: '0.8rem'
            }}>
              <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Agent Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Registry</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="agent@agency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Security Key</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            {loading ? (
              <RefreshCw className="spinner" style={{ width: '16px', height: '16px' }} />
            ) : (
              isLogin ? 'Acknowledge Credentials' : 'Create Agent Account'
            )}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? "Need a profile? Establish a new account" : "Already registered? Login directly"}
          </button>
          
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Go Back as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
