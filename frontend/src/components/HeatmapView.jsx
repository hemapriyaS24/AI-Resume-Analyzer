import React, { useState } from 'react';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function HeatmapView({ segments }) {
  const [selectedSeg, setSelectedSeg] = useState(null);

  if (!segments || segments.length === 0) return null;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles style={{ width: '20px', height: '20px', color: 'var(--neon-cyan)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Interactive Resume Heatmap</h3>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-strong)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-strong)' }} />
            Strong
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-improve)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-improve)' }} />
            Needs Work
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-weak)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-weak)' }} />
            Weak
          </span>
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        Hover or click on highlighted segments to view detailed NLP feedback, grammar insights, and recommended fixes.
      </p>

      {/* Renders segments styled via index.css heatmap classes */}
      <div className="glass-card" style={{ 
        backgroundColor: 'rgba(0,0,0,0.15)', 
        maxHeight: '380px', 
        overflowY: 'auto', 
        padding: '16px',
        borderRadius: 'var(--border-radius-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        lineHeight: '1.8'
      }}>
        {segments.map((seg) => (
          <div
            key={seg.id}
            onClick={() => setSelectedSeg(seg)}
            className={`heatmap-span ${seg.score}`}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            {seg.text}
          </div>
        ))}
      </div>

      {selectedSeg && (
        <div className="glass-card" style={{
          borderColor: selectedSeg.score === 'green' ? 'rgba(16, 185, 129, 0.2)' : selectedSeg.score === 'yellow' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          background: selectedSeg.score === 'green' ? 'rgba(16, 185, 129, 0.04)' : selectedSeg.score === 'yellow' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(239, 68, 68, 0.04)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          animation: 'pulseGlow 1.5s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
              {selectedSeg.score === 'green' && (
                <>
                  <CheckCircle style={{ width: '16px', height: '16px', color: 'var(--color-strong)' }} />
                  <span style={{ color: 'var(--color-strong)' }}>STRONG PARAGRAPH</span>
                </>
              )}
              {selectedSeg.score === 'yellow' && (
                <>
                  <AlertTriangle style={{ width: '16px', height: '16px', color: 'var(--color-improve)' }} />
                  <span style={{ color: 'var(--color-improve)' }}>OPPORTUNITY TO IMPROVE</span>
                </>
              )}
              {selectedSeg.score === 'red' && (
                <>
                  <AlertOctagon style={{ width: '16px', height: '16px', color: 'var(--color-weak)' }} />
                  <span style={{ color: 'var(--color-weak)' }}>WEAK CONTENT</span>
                </>
              )}
            </div>
            <button 
              onClick={() => setSelectedSeg(null)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Dismiss
            </button>
          </div>
          
          <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--card-border)', paddingLeft: '10px' }}>
            "{selectedSeg.text.substring(0, 100)}{selectedSeg.text.length > 100 ? '...' : ''}"
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {selectedSeg.reason}
          </div>
        </div>
      )}
    </div>
  );
}
