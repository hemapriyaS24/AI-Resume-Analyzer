import React from 'react';

export default function MetricCard({ title, score, max = 100, icon: Icon, color, info }) {
  const ratingColor = score >= 80 ? 'var(--color-strong)' : score >= 50 ? 'var(--color-improve)' : 'var(--color-weak)';
  const ratingGlow = score >= 80 ? 'var(--color-strong-glow)' : score >= 50 ? 'var(--color-improve-glow)' : 'var(--color-weak-glow)';

  return (
    <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && <Icon style={{ width: '20px', height: '20px', color: color || 'var(--neon-purple)' }} />}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0' }}>
        <span style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          fontFamily: 'var(--font-heading)',
          color: ratingColor,
          textShadow: ratingGlow
        }}>
          {score}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ {max}</span>
      </div>

      <div style={{ 
        width: '100%', 
        height: '6px', 
        backgroundColor: 'rgba(255,255,255,0.06)', 
        borderRadius: '3px',
        overflow: 'hidden' 
      }}>
        <div style={{ 
          width: `${(score / max) * 100}%`, 
          height: '100%', 
          backgroundColor: ratingColor,
          boxShadow: ratingGlow,
          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>

      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{info}</span>
    </div>
  );
}
