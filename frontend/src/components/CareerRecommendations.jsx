import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';

export default function CareerRecommendations({ recommendations, currentCareer, onSelectCareer }) {
  const [selectedCareer, setSelectedCareer] = useState(recommendations?.[0] || null);

  if (!recommendations || recommendations.length === 0) return null;

  const handleCareerClick = (rec) => {
    setSelectedCareer(rec);
    if (onSelectCareer) {
      onSelectCareer(rec.career);
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Target style={{ width: '20px', height: '20px', color: 'var(--neon-purple)' }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>AI Career Match & Skill Gaps</h3>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        We parsed your skill vocabulary against thousands of job listings. Select a career profile to map your alignment and identify key missing terms.
      </p>

      {/* Career listing cards */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {recommendations.map((rec) => {
          const isSelected = selectedCareer?.career === rec.career;
          const strokeDash = 2 * Math.PI * 18;
          const strokeOffset = strokeDash - (rec.matchPercentage / 100) * strokeDash;

          return (
            <div
              key={rec.career}
              onClick={() => handleCareerClick(rec)}
              className="glass-card"
              style={{
                flexShrink: 0,
                width: '150px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                borderWidth: isSelected ? '1.5px' : '1px',
                borderColor: isSelected ? 'var(--neon-purple)' : 'var(--card-border)',
                background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'var(--card-bg)',
                boxShadow: isSelected ? 'var(--neon-shadow)' : 'none',
                transform: isSelected ? 'scale(1.03)' : 'none'
              }}
            >
              {/* SVG circular match progress ring */}
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    fill="transparent"
                    stroke="var(--neon-purple)"
                    strokeWidth="3.5"
                    strokeDasharray={strokeDash}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)'
                }}>
                  {rec.matchPercentage}%
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                  {rec.career}
                </div>
                {currentCareer === rec.career && (
                  <span style={{
                    fontSize: '0.65rem',
                    color: 'var(--neon-cyan)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Primary Fit
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCareer && (
        <div className="glass-card" style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          padding: '16px',
          borderRadius: 'var(--border-radius-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '4px' }}>
              {selectedCareer.career} Diagnostics
            </h4>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--card-border)', borderRadius: '2px', overflow: 'hidden', marginTop: '8px' }}>
              <div style={{
                width: `${selectedCareer.matchPercentage}%`,
                height: '100%',
                background: 'var(--gradient-neon)',
                borderRadius: '2px'
              }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Matched skills */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-strong)', marginBottom: '8px', textTransform: 'uppercase' }}>
                <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                Matched ({selectedCareer.matchedSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedCareer.matchedSkills.length > 0 ? (
                  selectedCareer.matchedSkills.map(skill => (
                    <span key={skill} style={{
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--color-strong)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      textTransform: 'capitalize'
                    }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None found</span>
                )}
              </div>
            </div>

            {/* Missing skills */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-improve)', marginBottom: '8px', textTransform: 'uppercase' }}>
                <XCircle style={{ width: '14px', height: '14px' }} />
                Gaps to Fill ({selectedCareer.missingSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedCareer.missingSkills.length > 0 ? (
                  selectedCareer.missingSkills.map(skill => (
                    <span key={skill} style={{
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: 'var(--color-improve)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      textTransform: 'capitalize'
                    }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-strong)', fontWeight: 600 }}>All keywords covered!</span>
                )}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(139, 92, 246, 0.1)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <Zap style={{ color: 'var(--neon-purple)', width: '16px', height: '16px', flexShrink: 0 }} />
            <span>
              {selectedCareer.missingSkills.length > 0 ? (
                <>Ready to align? Select <strong>Optimize Resume</strong> below to see suggested resume rewrites embedding these missing keywords.</>
              ) : (
                <>Excellent match! Download your resume updates or connect your portfolio directly to compare placement rates.</>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
