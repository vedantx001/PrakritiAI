import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, BookOpen, Users } from 'lucide-react';

const Features = () => {
  // Feature Data
  const features = [
    {
      id: 1,
      icon: Sparkles,
      title: "Instant AI Remedies",
      description: "Describe your symptoms naturally, and our AI analyzes your inputs against ancient Ayurvedic texts to provide immediate, personalized herbal suggestions.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "group-hover:border-emerald-200"
    },
    {
      id: 2,
      icon: Activity,
      title: "Smart Health Tracking",
      description: "Unlock your personalized dashboard to log symptoms over time. Visualize your health journey and get evolving recommendations as you progress.",
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "group-hover:border-teal-200"
    },
    {
      id: 3,
      icon: BookOpen,
      title: "Curated Knowledge",
      description: "Dive into a vast library of verified Ayurvedic articles and blogs. Learn about herbs, doshas, and lifestyle practices without the noise of misinformation.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "group-hover:border-amber-200"
    },
    {
      id: 4,
      icon: Users,
      title: "Community Wisdom",
      description: "Don't just read—contribute. Join a community of practitioners and enthusiasts. Share your experiences, write blogs, and grow together.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200"
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-24 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-emerald-50/50 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-teal-50/50 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] mb-6 leading-tight">
              A Complete Suite for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Holistic Well-being
              </span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              Seamlessly integrate Ayurveda into your daily life with our powerful diagnostic tools, tracking systems, and verified knowledge base.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className={`group relative p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm hover:shadow-xl transition-all duration-300 ${feature.border}`}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                
                {/* Icon Box */}
                <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Features;