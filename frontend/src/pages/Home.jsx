import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Target, MessageSquare, Sparkles, Shield, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: FileText,
    title: 'AI Resume Analyzer',
    description: 'Get an instant ATS score and tailored suggestions to improve your resume with AI-powered bullet point rewrites.',
    color: 'primary',
    gradient: 'from-indigo-500 to-violet-500',
    link: '/resume',
  },
  {
    icon: Target,
    title: 'Personalized Roadmap',
    description: 'Generate a step-by-step weekly learning path based on your dream role and current experience level.',
    color: 'secondary',
    gradient: 'from-emerald-500 to-teal-500',
    link: '/roadmap',
  },
  {
    icon: MessageSquare,
    title: 'Mock Interview Bot',
    description: 'Practice behavioral and technical questions with our AI interviewer and get real-time conversational feedback.',
    color: 'blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    link: '/interview',
  },
];

const stats = [
  { value: '10K+', label: 'Resumes Analyzed' },
  { value: '95%', label: 'User Satisfaction' },
  { value: '50+', label: 'Career Paths' },
  { value: '24/7', label: 'AI Available' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32" id="hero-section">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>Powered by OpenAI GPT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Supercharge your career{' '}
            <br className="hidden md:block" />
            with <span className="gradient-text">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Your personal 24/7 AI career coach. Analyze your resume, practice interviews,
            and get a personalized roadmap to land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              to={user ? '/dashboard' : '/register'}
              id="hero-cta"
              className="bg-primary hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition flex items-center space-x-2 shadow-xl shadow-primary/30 pulse-glow"
            >
              <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to={user ? '/resume' : '/login'}
              className="text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition flex items-center space-x-2 border border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <span>{user ? 'Analyze Resume' : 'Sign In'}</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32" id="features-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span className="gradient-text">level up</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Three powerful AI tools designed to accelerate your career growth and help you land interviews.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link to={user ? feature.link : '/register'} className="block">
                  <div className="glass-panel p-8 group hover:-translate-y-2 transition-all duration-300 hover:border-white/20 cursor-pointer h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, opacity: 0.2 }}
                    >
                      <Icon className={`h-7 w-7 text-${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-white transition">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                    <div className={`inline-flex items-center space-x-1 text-${feature.color} text-sm font-medium opacity-0 group-hover:opacity-100 transition`}>
                      <span>Try it now</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Get started in three simple steps.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create Account', desc: 'Sign up for free in seconds. No credit card required.', icon: Shield },
            { step: '02', title: 'Choose Your Tool', desc: 'Pick from resume analysis, mock interviews, or roadmap generation.', icon: Zap },
            { step: '03', title: 'Get AI Insights', desc: 'Receive personalized, actionable career coaching powered by GPT.', icon: Sparkles },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to accelerate your career?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of professionals using AI to land their dream jobs faster.
            </p>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition shadow-xl shadow-primary/30"
            >
              <span>{user ? 'Go to Dashboard' : 'Start for Free'}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2026 AI Career Coach. Built with ❤️ and AI.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300 transition">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms</a>
            <a href="#" className="hover:text-gray-300 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
