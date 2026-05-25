import React from 'react';
import { Sun, Moon, LogOut, Cpu, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, toggleTheme, onOpenAuth, onShowDashboard }) {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-card" style={{
      borderRadius: '0px', 
      borderLeft: 'none', 
      borderRight: 'none', 
      borderTop: 'none',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '16px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.75)'
    }}>
      <div 
        onClick={onShowDashboard} 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <Cpu className="text-neon-gradient" style={{ width: '28px', height: '28px' }} />
        <span 
          className="text-neon-gradient" 
          style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}
        >
          ATS.AI
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={toggleTheme} 
          className="btn-secondary" 
          style={{ padding: '8px 12px', border: 'none' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun style={{ width: '18px', height: '18px', color: 'var(--neon-cyan)' }} />
          ) : (
            <Moon style={{ width: '18px', height: '18px', color: 'var(--neon-purple)' }} />
          )}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
            </span>
            <button 
              onClick={logout} 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth} 
            className="btn-primary" 
            style={{ padding: '8px 20px' }}
          >
            Access Dashboard
          </button>
        )}
      </div>
    </nav>
  );
}
