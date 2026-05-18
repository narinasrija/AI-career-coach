import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, BookOpen, Clock, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { aiAPI } from '../utils/api';

const goalOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Mobile Developer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Product Manager',
];

const experienceLevels = [
  { label: 'Beginner', desc: '0-1 years', emoji: '🌱' },
  { label: 'Intermediate', desc: '1-3 years', emoji: '🌿' },
  { label: 'Advanced', desc: '3-5 years', emoji: '🌳' },
  { label: 'Expert', desc: '5+ years', emoji: '🏔️' },
];

const RoadmapGenerator = () => {
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');
  const [completedWeeks, setCompletedWeeks] = useState(new Set());

  const handleGenerate = async () => {
    const finalGoal = goal === 'custom' ? customGoal : goal;
    if (!finalGoal || !experience) {
      setError('Please select a goal and experience level');
      return;
    }
    setLoading(true);
    setError('');
    setRoadmap(null);
    setCompletedWeeks(new Set());

    try {
      const { data } = await aiAPI.generateRoadmap({ goal: finalGoal, experience });
      setRoadmap(data.roadmap || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWeekComplete = (week) => {
    setCompletedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(week)) {
        next.delete(week);
      } else {
        next.add(week);
      }
      return next;
    });
  };

  const handleReset = () => {
    setGoal('');
    setExperience('');
    setCustomGoal('');
    setRoadmap(null);
    setError('');
    setCompletedWeeks(new Set());
  };

  const progress = roadmap ? Math.round((completedWeeks.size / roadmap.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="glow-orb glow-orb-3" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold" id="roadmap-title">Learning Roadmap</h1>
            </div>
            <p className="text-gray-400 ml-14">Get a personalized week-by-week learning path to reach your career goal.</p>
          </div>
          {roadmap && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Roadmap</span>
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!roadmap && !loading ? (
          /* Configuration Form */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Goal Selection */}
            <div className="glass-panel p-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-400" />
                <span>What's your dream role?</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {goalOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => { setGoal(option); setError(''); }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      goal === option
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 border shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => { setGoal('custom'); setError(''); }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    goal === 'custom'
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 border shadow-lg shadow-violet-500/10'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ✏️ Custom
                </button>
              </div>
              {goal === 'custom' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="e.g., Blockchain Developer"
                  className="mt-4 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
                />
              )}
            </div>

            {/* Experience Level */}
            <div className="glass-panel p-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                <span>Your experience level</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {experienceLevels.map((level) => (
                  <button
                    key={level.label}
                    onClick={() => { setExperience(level.label); setError(''); }}
                    className={`p-5 rounded-xl text-center transition-all ${
                      experience === level.label
                        ? 'bg-secondary/20 border-secondary/50 border shadow-lg shadow-secondary/10'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-2">{level.emoji}</div>
                    <div className={`font-semibold text-sm ${experience === level.label ? 'text-secondary' : 'text-gray-300'}`}>{level.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Generate Button */}
            <button
              id="roadmap-generate-btn"
              onClick={handleGenerate}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
            >
              <Sparkles className="h-5 w-5" />
              <span>Generate My Roadmap</span>
            </button>
          </motion.div>
        ) : loading ? (
          /* Loading State */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-16 flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <Target className="h-8 w-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold mb-2">Generating your personalized roadmap...</p>
              <p className="text-gray-400 text-sm">Our AI is crafting the perfect learning path for you</p>
            </div>
            <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full shimmer" style={{ width: '70%' }} />
            </div>
          </motion.div>
        ) : (
          /* Roadmap Results */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-gray-300">Your Progress</h3>
                <span className="text-sm font-bold text-blue-400">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-secondary rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{completedWeeks.size} of {roadmap?.length} weeks completed</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/5" />

              {roadmap?.map((item, idx) => {
                const isCompleted = completedWeeks.has(idx);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex items-start space-x-6 mb-6"
                  >
                    {/* Timeline Dot */}
                    <button
                      onClick={() => toggleWeekComplete(idx)}
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-secondary shadow-lg shadow-secondary/30'
                          : 'bg-surface border-2 border-white/10 hover:border-blue-500/50'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : (
                        <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                      )}
                    </button>

                    {/* Content Card */}
                    <div className={`flex-1 glass-panel p-6 transition-all ${
                      isCompleted ? 'border-secondary/30 opacity-80' : 'hover:border-white/20'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{item.week}</span>
                        </span>
                        {isCompleted && (
                          <span className="text-xs text-secondary font-medium">✓ Completed</span>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                        {item.topic}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.details}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapGenerator;
