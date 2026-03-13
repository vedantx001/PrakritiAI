import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  History, 
  Heart, 
  PenTool, 
  CheckCircle2, 
  ArrowRight,
  User
} from 'lucide-react';

const DashboardPreview = () => {
  
  // Feature List
  const benefits = [
    {
      icon: History,
      title: "Symptom History",
      desc: "Track your health patterns over weeks and months."
    },
    {
      icon: Heart,
      title: "Save & Organize",
      desc: "Bookmark remedies and articles for quick access."
    },
    {
      icon: PenTool,
      title: "Write & Share",
      desc: "Publish your own Ayurvedic experiences and blogs."
    },
    {
      icon: User,
      title: "Personalized Profile",
      desc: "Get AI suggestions based on your specific Prakriti."
    }
  ];

  return (
    <section id="about" className="py-24 bg-[var(--bg-primary)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* --- Left Column: Content & CTA --- */}
          <motion.div 
            className="flex-1 max-w-xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              The Real Game
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] mb-6 leading-tight">
              Your Health Journey, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Centralized.
              </span>
            </h2>
            
            <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed">
              Guest access is just the beginning. Create your free account to unlock a personalized dashboard that learns with you, remembers your history, and connects you to the community.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-main)]">{item.title}</h4>
                    <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="group relative inline-flex items-center justify-center gap-3 bg-[var(--text-main)] text-[var(--bg-primary)] px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-1">
              Unlock Your Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* --- Right Column: Visual Mockup (Abstract Dashboard) --- */}
          <motion.div 
            className="flex-1 w-full relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-100/50 to-teal-50/50 rounded-full blur-3xl -z-10" />

            {/* The Dashboard Card */}
            <div className="relative bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              
              {/* Fake UI: Header */}
              <div className="flex items-center justify-between mb-8 border-b border-[var(--border-color)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">R</div>
                  <div>
                    <div className="h-2.5 w-24 bg-[var(--border-color)] rounded-full mb-1.5"></div>
                    <div className="h-2 w-16 bg-[var(--bg-secondary)] rounded-full"></div>
                  </div>
                </div>
                <LayoutDashboard className="text-[var(--text-muted)] w-6 h-6" />
              </div>

              {/* Fake UI: Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="text-emerald-600 text-xs font-bold uppercase mb-2">Health Score</div>
                  <div className="text-3xl font-bold text-[var(--text-main)]">85%</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <div className="text-orange-600 text-xs font-bold uppercase mb-2">Dominant Dosha</div>
                  <div className="text-2xl font-bold text-[var(--text-main)]">Pitta</div>
                </div>
              </div>

              {/* Fake UI: Recent Activity */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Recent History</div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                      <History className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-3/4 bg-[var(--border-color)] rounded-full mb-1.5"></div>
                      <div className="h-2 w-1/2 bg-[var(--bg-secondary)] rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Badge (Glass effect) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-20 bg-[var(--bg-card)] p-4 rounded-2xl shadow-xl border border-[var(--border-color)] hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-500">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] font-medium">Saved Remedy</div>
                    <div className="font-bold text-[var(--text-main)] text-sm">Ashwagandha Tea</div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;