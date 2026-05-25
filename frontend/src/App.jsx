import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthCard from './components/AuthCard';
import DragDropUpload from './components/DragDropUpload';
import MetricCard from './components/MetricCard';
import HeatmapView from './components/HeatmapView';
import CareerRecommendations from './components/CareerRecommendations';
import LinkAnalyzer from './components/LinkAnalyzer';
import RankingSystem from './components/RankingSystem';
import ResumeImprover from './components/ResumeImprover';

import { 
  FileText, Sparkles, Languages, CheckSquare, History, 
  ChevronRight, Info, AlertTriangle, ShieldCheck 
} from 'lucide-react';

function DashboardContent() {
  const { user, token } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [authOpen, setAuthOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Keep tracked target career state for real-time rewrites synchronization
  const [selectedCareer, setSelectedCareer] = useState('Web Developer');

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.className = `${nextTheme}-theme`;
  };

  // Sync historical reports if user logs in
  const fetchHistory = async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const response = await fetch('/api/resume/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to sync history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, token]);

  const handleUploadSuccess = (data) => {
    setActiveAnalysis(data);
    if (data.analysis?.career) {
      setSelectedCareer(data.analysis.career);
    }
    // Update history list
    fetchHistory();
  };

  const handleSelectHistoryItem = async (id) => {
    try {
      const response = await fetch(`/api/resume/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setActiveAnalysis(data);
        if (data.analysis?.career) {
          setSelectedCareer(data.analysis.career);
        }
      }
    } catch (err) {
      console.error('Failed to retrieve history item:', err);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenAuth={() => setAuthOpen(true)}
        onShowDashboard={() => setActiveAnalysis(null)}
      />

      {/* Main Landing / Uploader view */}
      {!activeAnalysis ? (
        <main style={{ flex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '3rem', 
              fontWeight: '800', 
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              Supercharge Your Job Search with <br />
              <span className="text-neon-gradient">AI-Powered Resume Analytics</span>
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1.1rem', 
              maxWidth: '650px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Upload your resume and immediately retrieve a complete ATS match scorecard, vocabulary breakdown, link audits, and color-coded interactive heatmap corrections.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <DragDropUpload onUploadSuccess={handleUploadSuccess} />

            {/* Authenticated user history panel */}
            {user && (
              <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <History style={{ color: 'var(--neon-purple)', width: '20px', height: '20px' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>Your Historic Analyses</h3>
                </div>

                {historyLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                    <div className="spinner" style={{ width: '24px', height: '24px' }} />
                  </div>
                ) : history.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectHistoryItem(item.id)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--neon-purple)';
                          e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--card-border)';
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <FileText style={{ color: 'var(--neon-cyan)', width: '18px', height: '18px' }} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.originalName}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {item.career} • {item.language} • {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: item.atsScore >= 80 ? 'var(--color-strong)' : item.atsScore >= 50 ? 'var(--color-improve)' : 'var(--color-weak)'
                          }}>
                            {item.atsScore} pts
                          </span>
                          <ChevronRight style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '10px 0' }}>
                    No reports saved yet. Upload a resume above to catalog your first analysis!
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      ) : (
        /* Full dashboard analytics workspace */
        <main style={{ flex: 1, padding: '24px 20px', backgroundColor: 'rgba(0,0,0,0.05)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header section with score summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <button 
                  onClick={() => setActiveAnalysis(null)} 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', marginBottom: '8px' }}
                >
                  ← Upload New Resume
                </button>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText style={{ color: 'var(--neon-cyan)', width: '28px', height: '28px' }} />
                  {activeAnalysis.originalName} Dashboard
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Extracted language: <strong>{activeAnalysis.language}</strong> • Primary career alignment: <strong>{selectedCareer}</strong>
                </p>
              </div>

              {activeAnalysis.ranking && (
                <div className="glass-card" style={{ padding: '10px 16px', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
                  <ShieldCheck style={{ width: '20px', height: '20px', color: 'var(--neon-cyan)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Anonymously Ranked: <strong style={{ color: 'var(--neon-cyan)' }}>{activeAnalysis.ranking.rankText}</strong> ({activeAnalysis.ranking.percentile}th percentile)
                  </span>
                </div>
              )}
            </div>

            {/* Row 1: Metrics summary dashboard */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <MetricCard 
                title="Overall ATS Score" 
                score={activeAnalysis.atsScore} 
                icon={Sparkles} 
                color="var(--neon-pink)"
                info="Combined algorithmic weight of skills, structure, grammar, and link validation."
              />
              <MetricCard 
                title="Technical & Core Skills" 
                score={Math.min(100, Math.round((activeAnalysis.analysis?.extractedSkills?.length || 0) * 12.5))} 
                icon={CheckSquare} 
                color="var(--neon-purple)"
                info={`${activeAnalysis.analysis?.extractedSkills?.length || 0} matching industry terms detected across profile.`}
              />
              <MetricCard 
                title="Language & Parsing Quality" 
                score={activeAnalysis.analysis?.language === 'English' ? 95 : 85} 
                icon={Languages} 
                color="var(--neon-cyan)"
                info={`Localized Multi-Language dictionary validation index successfully set.`}
              />
            </div>

            {/* Row 2: Analysis breakdown split grids */}
            <div className="dashboard-grid" style={{ padding: '0px', width: '100%', maxWidth: 'none' }}>
              {/* Left Column: Heatmap visualizer */}
              <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <HeatmapView segments={activeAnalysis.analysis?.heatmapSegments} />
              </div>

              {/* Right Column: Skill matches & profiles analyzer */}
              <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CareerRecommendations 
                  recommendations={activeAnalysis.analysis?.careerRecommendations} 
                  currentCareer={selectedCareer}
                  onSelectCareer={(career) => setSelectedCareer(career)}
                />
                
                <LinkAnalyzer 
                  links={activeAnalysis.analysis?.links} 
                  linkTips={activeAnalysis.analysis?.linkTips} 
                />
              </div>
            </div>

            {/* Row 3: Leaderboard rank & Bullet Optimizer */}
            <div className="dashboard-grid" style={{ padding: '0px', width: '100%', maxWidth: 'none', marginTop: '10px' }}>
              {/* Leaderboard widget */}
              <div style={{ gridColumn: 'span 4' }}>
                <RankingSystem 
                  ranking={activeAnalysis.ranking} 
                  career={selectedCareer}
                />
              </div>

              {/* Smart optimizer and markdown editor */}
              <div style={{ gridColumn: 'span 8' }}>
                <ResumeImprover 
                  resumeId={activeAnalysis.resumeId || activeAnalysis.id}
                  currentCareer={selectedCareer}
                  parsedText={activeAnalysis.parsedText}
                />
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Auth overlay popup */}
      {authOpen && <AuthCard onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
