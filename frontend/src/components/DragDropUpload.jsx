import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function DragDropUpload({ onUploadSuccess }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = async (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setErrorMsg('Unsupported file type. Please upload a PDF, DOCX or TXT resume.');
      return;
    }

    setFile(selectedFile);
    setErrorMsg('');
    setLoading(true);
    
    // Smooth progression steps for the "wow" loader experience
    const steps = [
      'Extracting raw document formatting...',
      'Running Multi-Language NLP text checks...',
      'Mapping contact detail indices...',
      'Scanning for 150+ core skill patterns...',
      'Running candidate database rankings...',
      'Generating custom career heatmaps...'
    ];

    let currentStep = 0;
    setProgressMsg(steps[0]);
    
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProgressMsg(steps[currentStep]);
      }
    }, 600);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      clearInterval(stepInterval);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'File processing failed.');
      }

      setProgressMsg('Complete!');
      setTimeout(() => {
        onUploadSuccess(data);
        setLoading(false);
        setFile(null);
      }, 500);

    } catch (err) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || 'Something went wrong while processing your resume.');
      setLoading(false);
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".pdf,.docx,.txt"
        onChange={handleChange}
      />

      <div
        className={`glass-card ${isDragActive ? 'drag-active' : ''} scanning-container`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: isDragActive ? '2px dashed var(--neon-cyan)' : '2px dashed var(--card-border)',
          borderRadius: 'var(--border-radius-md)',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'rgba(6, 182, 212, 0.05)' : 'var(--card-bg)',
          animation: isDragActive ? 'pulseGlow 2s infinite ease' : 'none',
          position: 'relative'
        }}
        onClick={!loading ? onButtonClick : undefined}
      >
        {loading && <div className="scan-line" />}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
            <div className="spinner" />
            <div style={{ color: 'var(--neon-cyan)', fontWeight: 600, fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
              Parsing Resume Content
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              {progressMsg}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--card-border)'
            }}>
              <Upload style={{ width: '28px', height: '28px', color: 'var(--neon-cyan)' }} />
            </div>
            
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
                Drag and Drop Resume
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Supports PDF, DOCX, and TXT (Max 10MB)
              </p>
            </div>

            <button 
              type="button"
              className="btn-primary" 
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            >
              Select File
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="glass-card" style={{
          marginTop: '16px',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.05)'
        }}>
          <AlertCircle style={{ color: 'var(--color-weak)', width: '20px', height: '20px', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
