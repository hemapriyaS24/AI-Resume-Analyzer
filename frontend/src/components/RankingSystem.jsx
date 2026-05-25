import React from 'react';
import { Award, TrendingUp, Users, Info } from 'lucide-react';

export default function RankingSystem({ ranking, career }) {
  if (!ranking) return null;

  const getRankBadgeColor = () => {
    if (ranking.percentile >= 85) return { text: 'var(--color-strong)', bg: 'rgba(16, 185, 129, 0.1)', shadow: 'var(--color-strong-glow)' };
    if (ranking.percentile >= 70) return { text: 'var(--neon-purple)', bg: 'rgba(139, 92, 246, 0.1)', shadow: 'var(--neon-shadow)' };
    if (ranking.percentile >= 40) return { text: 'var(--color-improve)', bg: 'rgba(245, 158, 11, 0.1)', shadow: 'var(--color-improve-glow)' };
    return { text: 'var(--color-weak)', bg: 'rgba(239, 68, 68, 0.1)', shadow: 'var(--color-weak-glow)' };
  };

  const styling = getRankBadgeColor();

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Award style={{ width: '20px', height: '20px', color: 'var(--neon-pink)' }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Anonymous Talent Pool Placement</h3>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        Compare your score percentile anonymously against all parsed profiles under the <strong>{career}</strong> pool.
      </p>

      {/* Main Placement Badge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '24px',
        borderRadius: 'var(--border-radius-sm)',
        background: styling.bg,
        border: '1px solid var(--card-border)',
        textAlign: 'center',
        boxShadow: styling.shadow
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Your Position
        </span>
        <span style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          color: styling.text,
          lineHeight: '1'
        }}>
          {ranking.rankText}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Better than <strong>{ranking.percentile}%</strong> of all evaluated resumes
        </span>
      </div>

      {/* Percentile bar visual */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span>Entry Level</span>
          <span>Average</span>
          <span>Elite Placement</span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: '5px',
          position: 'relative'
        }}>
          {/* Glowing cursor showing placement */}
          <div style={{
            position: 'absolute',
            left: `${ranking.percentile}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'var(--gradient-neon)',
            boxShadow: 'var(--neon-shadow)',
            border: '2.5px solid #ffffff',
            transition: 'left 1s ease'
          }} />
        </div>
      </div>

      {/* Sub statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Users style={{ width: '18px', height: '18px', color: 'var(--neon-cyan)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pool Volume</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{ranking.totalCompared} candidates</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <TrendingUp style={{ width: '18px', height: '18px', color: 'var(--neon-pink)', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Average Score</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{ranking.careerAverage} points</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--card-border)',
        paddingTop: '10px'
      }}>
        <Info style={{ width: '12px', height: '12px', flexShrink: 0 }} />
        <span>Rankings update dynamically as other candidates submit resumes. All matching is strictly anonymous.</span>
      </div>
    </div>
  );
}
