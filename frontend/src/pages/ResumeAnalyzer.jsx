import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, CheckCircle, AlertCircle, XCircle, Sparkles, RotateCcw, FileUp } from 'lucide-react';
import { aiAPI } from '../utils/api';

const ScoreRing = ({ score, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring-circle"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400">ATS Score</span>
      </div>
    </div>
  );
};

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await aiAPI.analyzeResume(formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="glow-orb glow-orb-1" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold" id="resume-title">AI Resume Analyzer</h1>
        </div>
        <p className="text-gray-400 ml-14">Upload your resume and get instant ATS scoring with AI-powered improvement suggestions.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-panel p-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-gray-400" />
              <span>Upload Resume</span>
            </h2>

            {/* Drop Zone */}
            <div
              id="resume-dropzone"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : file
                  ? 'border-secondary/50 bg-secondary/5'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/10">
                    <CheckCircle className="h-7 w-7 text-secondary" />
                  </div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5">
                    <FileUp className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-gray-300 font-medium">Drop your PDF here or click to browse</p>
                  <p className="text-gray-500 text-sm">Supports PDF files up to 10MB</p>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center space-x-2 text-red-400 text-sm"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                id="resume-analyze-btn"
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="flex-1 bg-primary hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shadow-lg shadow-primary/25"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
              {(file || result) && (
                <button
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-400 font-medium">AI is analyzing your resume...</p>
                <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full shimmer" style={{ width: '60%' }} />
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* ATS Score */}
                <div className="glass-panel p-8 flex flex-col items-center">
                  <ScoreRing score={result.atsScore || 0} />
                  <p className="mt-4 text-gray-400 text-sm">
                    {result.atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized.' :
                     result.atsScore >= 60 ? '👍 Good, but there\'s room for improvement.' :
                     '⚠️ Needs improvement to pass ATS filters.'}
                  </p>
                </div>

                {/* Missing Skills */}
                {result.missingSkills?.length > 0 && (
                  <div className="glass-panel p-6">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-amber-400" />
                      <span>Missing Skills</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {result.improvements?.length > 0 && (
                  <div className="glass-panel p-6">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Suggestions</span>
                    </h3>
                    <ul className="space-y-2">
                      {result.improvements.map((item, i) => (
                        <li key={i} className="flex items-start space-x-3 text-gray-300 text-sm">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rewritten Bullets */}
                {result.rewrittenBullets?.length > 0 && (
                  <div className="glass-panel p-6">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <span>Improved Bullet Points</span>
                    </h3>
                    <ul className="space-y-2">
                      {result.rewrittenBullets.map((bullet, i) => (
                        <li key={i} className="flex items-start space-x-3 text-gray-300 text-sm">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Results Yet</h3>
                <p className="text-gray-500 text-sm max-w-xs">Upload your resume PDF and click "Analyze" to get your ATS score and AI-powered suggestions.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
