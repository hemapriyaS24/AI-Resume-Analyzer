import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Download, Edit3, ArrowRight, Wand2, FileDown } from 'lucide-react';

export default function ResumeImprover({ resumeId, currentCareer, parsedText }) {
  const [targetCareer, setTargetCareer] = useState(currentCareer || 'Web Developer');
  const [optimization, setOptimization] = useState(null);
  const [editedText, setEditedText] = useState(parsedText || '');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appliedIndex, setAppliedIndex] = useState([]);

  const fetchOptimization = async (careerRole) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/resume/${resumeId}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career: careerRole })
      });
      if (response.ok) {
        const data = await response.json();
        setOptimization(data);
      }
    } catch (err) {
      console.error('Failed to load optimizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchOptimization(targetCareer);
    }
  }, [resumeId, targetCareer]);

  useEffect(() => {
    if (parsedText) {
      setEditedText(parsedText);
    }
  }, [parsedText]);

  const handleApplyRewrite = (idx, rewriteText) => {
    if (appliedIndex.includes(idx)) return;
    
    // Inject the optimized bullet point into the text area
    setEditedText(prev => {
      return prev + `\n\n[Optimized Achievement for ${targetCareer}]:\n• ${rewriteText}`;
    });
    setAppliedIndex(prev => [...prev, idx]);
  };

  const handleApplySummary = (summaryText) => {
    setEditedText(prev => {
      return `[Optimized Professional Summary for ${targetCareer}]:\n${summaryText}\n\n${prev}`;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Standard text blob export. Highly reliable across devices.
    const element = document.createElement("a");
    const file = new Blob([editedText], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${targetCareer.replace(/\s+/g, '_')}_Optimized_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wand2 style={{ width: '20px', height: '20px', color: 'var(--neon-pink)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Smart Resume Improver</h3>
        </div>

        {/* Career dropdown to trigger new optimizations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Role:</span>
          <select
            value={targetCareer}
            onChange={(e) => setTargetCareer(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--card-border)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="Web Developer">Web Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        Apply AI-suggested modifications tailored for a <strong>{targetCareer}</strong> role, refine text in our live editor, and copy or download the results.
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        optimization && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Summary Suggestion Card */}
            <div className="glass-card" style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neon-pink)', letterSpacing: '0.05em' }}>
                  AI PROFESSIONAL SUMMARY REWRITE
                </span>
                <button
                  onClick={() => handleApplySummary(optimization.profileDescriptionRewrite)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                >
                  Apply Summary
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                "{optimization.profileDescriptionRewrite}"
              </p>
            </div>

            {/* Bullet Point Rewrites */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neon-cyan)', letterSpacing: '0.05em' }}>
                SUGGESTED ACTION REWRITES
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {optimization.bulletPointRewrites.map((rewrite, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: 'rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--color-weak)', fontWeight: 700 }}>ORIGINAL:</span> {rewrite.before}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--color-strong)', fontWeight: 700 }}>REWRITE:</span> {rewrite.after}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleApplyRewrite(idx, rewrite.after)}
                      disabled={appliedIndex.includes(idx)}
                      className={appliedIndex.includes(idx) ? "btn-secondary" : "btn-primary"}
                      style={{
                        padding: '4px 12px',
                        fontSize: '0.7rem',
                        opacity: appliedIndex.includes(idx) ? 0.6 : 1,
                        width: '100%',
                        justifyContent: 'center'
                      }}
                    >
                      {appliedIndex.includes(idx) ? 'Rewrite Applied to Editor' : 'Apply Rewrite to Editor'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Text Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Edit3 style={{ width: '14px', height: '14px' }} />
                  LIVE RESUME TEXT EDITOR
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {editedText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                style={{
                  width: '100%',
                  height: '220px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  resize: 'vertical',
                  outline: 'none',
                  borderWidth: '1px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }}
              />

              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button
                  onClick={handleCopy}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {copied ? (
                    <>
                      <Check style={{ width: '16px', height: '16px', color: 'var(--color-strong)' }} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy style={{ width: '16px', height: '16px' }} />
                      Copy Document
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <FileDown style={{ width: '16px', height: '16px' }} />
                  Download Resume
                </button>
              </div>
            </div>
            
          </div>
        )
      )}
    </div>
  );
}
