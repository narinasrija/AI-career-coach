import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, MessageSquare, TrendingUp, ArrowRight, Clock, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const stats = [
    { name: 'Resume Score', value: '—', icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10', link: '/resume' },
    { name: 'Interview Readiness', value: '—', icon: MessageSquare, color: 'text-secondary', bgColor: 'bg-secondary/10', link: '/interview' },
    { name: 'Roadmap Progress', value: '—', icon: Target, color: 'text-blue-400', bgColor: 'bg-blue-400/10', link: '/roadmap' },
    { name: 'Overall Status', value: 'Start', icon: TrendingUp, color: 'text-violet-400', bgColor: 'bg-violet-400/10', link: '/resume' },
  ];

  const quickActions = [
    {
      title: 'Analyze Your Resume',
      description: 'Upload your PDF and get an instant ATS score with improvement suggestions.',
      icon: FileText,
      color: 'primary',
      gradient: 'from-indigo-600 to-violet-600',
      link: '/resume',
    },
    {
      title: 'Practice Interview',
      description: 'Start a mock interview with our AI and sharpen your answers.',
      icon: MessageSquare,
      color: 'secondary',
      gradient: 'from-emerald-600 to-teal-600',
      link: '/interview',
    },
    {
      title: 'Generate Roadmap',
      description: 'Get a personalized weekly learning path to reach your dream role.',
      icon: Target,
      color: 'blue-400',
      gradient: 'from-blue-600 to-cyan-600',
      link: '/roadmap',
    },
  ];

  const tips = [
    { icon: '💡', text: 'Quantify achievements in your resume with numbers and percentages' },
    { icon: '🎯', text: 'Tailor your resume for each job application using keywords from the listing' },
    { icon: '🗣️', text: 'Use the STAR method for behavioral interview questions' },
    { icon: '📚', text: 'Dedicate at least 1 hour daily to skill development' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold mb-2" id="dashboard-title">
          {greeting}, <span className="gradient-text">{user?.name || 'User'}</span>! 👋
        </h1>
        <p className="text-gray-400">Here's your career progress at a glance. Let's keep the momentum going!</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link to={stat.link} className="block glass-panel p-6 hover:border-white/20 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">{stat.name}</p>
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="mt-3 flex items-center space-x-1 text-xs text-gray-500 group-hover:text-gray-300 transition">
                  <span>Get started</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span>Quick Actions</span>
            </h2>
            <div className="space-y-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <Link to={action.link} className="block glass-panel p-6 hover:border-white/20 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl bg-${action.color}/10`}>
                            <Icon className={`h-6 w-6 text-${action.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-white transition">{action.title}</h3>
                            <p className="text-sm text-gray-400 mt-0.5">{action.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pro Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Career Tips</span>
            </h2>
            <div className="space-y-3">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition">
                  <span className="text-lg flex-shrink-0">{tip.icon}</span>
                  <p className="text-sm text-gray-400 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>Recent Activity</span>
            </h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">No activity yet</p>
              <p className="text-gray-600 text-xs mt-1">Start by analyzing a resume!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
