import React from 'react';
import { Link2, Linkedin, Github, Globe, CheckCircle, AlertTriangle } from 'lucide-react';

export default function LinkAnalyzer({ links, linkTips }) {
  if (!links) return null;

  const items = [
    {
      name: 'LinkedIn',
      url: links.linkedin,
      tip: linkTips?.linkedin,
      icon: Linkedin,
      color: '#0a66c2',
      fallback: 'LinkedIn profile not detected in resume text'
    },
    {
      name: 'GitHub',
      url: links.github,
      tip: linkTips?.github,
      icon: Github,
      color: '#171515',
      fallback: 'GitHub profile not detected in resume text'
    },
    {
      name: 'Portfolio',
      url: links.portfolio,
      tip: linkTips?.portfolio,
      icon: Globe,
      color: 'var(--neon-cyan)',
      fallback: 'Personal portfolio URL not detected in resume text'
    }
  ];

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link2 style={{ width: '20px', height: '20px', color: 'var(--neon-cyan)' }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Portfolio & LinkedIn Analyzer</h3>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        Linking active professional profiles increases interview callback rates by up to 71%. Here is our validation status and optimization checklist.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isLinked = !!item.url;

          return (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--card-border)',
                backgroundColor: isLinked ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon style={{ width: '18px', height: '18px', color: item.color }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name} Link</span>
                  {isLinked ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--color-strong)', fontWeight: 700 }}>
                      <CheckCircle style={{ width: '12px', height: '12px' }} />
                      DETECTED
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--color-improve)', fontWeight: 700 }}>
                      <AlertTriangle style={{ width: '12px', height: '12px' }} />
                      MISSING
                    </span>
                  )}
                </div>

                {isLinked ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--neon-cyan)',
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '220px',
                      display: 'block'
                    }}
                  >
                    {item.url}
                  </a>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.fallback}
                  </span>
                )}

                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  paddingTop: '6px',
                  borderTop: '1px solid rgba(255,255,255,0.04)'
                }}>
                  {item.tip}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
