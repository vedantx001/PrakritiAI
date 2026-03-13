import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Clock, 
  User, 
  MoreHorizontal, 
  ArrowRight,
  Lock
} from 'lucide-react';

// --- Mock Data ---
const ARTICLES = [
  {
    id: 1,
    title: "Understanding Pitta Dosha: The Fire Element",
    excerpt: "Pitta governs metabolism and energy production. Learn how to balance excess heat with cooling foods and lifestyle changes.",
    author: "Dr. A. Sharma",
    readTime: "5 min read",
    tags: ["Ayurveda Basics", "Doshas"],
    likes: 124,
    image: "bg-orange-50" // Placeholder for image logic
  },
  {
    id: 2,
    title: "Ashwagandha: The Ancient Stress Reliever",
    excerpt: "A deep dive into the adaptogenic properties of Ashwagandha and its clinical applications in modern stress management.",
    author: "Ved. P. Gupta",
    readTime: "8 min read",
    tags: ["Herbs", "Mental Health"],
    likes: 89,
    image: "bg-emerald-50"
  },
  {
    id: 3,
    title: "Dinacharya: The Daily Routine for Longevity",
    excerpt: "Aligning your biological clock with nature's rhythm. A step-by-step guide to the ideal Ayurvedic morning routine.",
    author: "Team Prakriti",
    readTime: "6 min read",
    tags: ["Lifestyle", "Wellness"],
    likes: 215,
    image: "bg-blue-50"
  }
];

const BLOGS = [
  {
    id: 1,
    author: "Sarah Jenks",
    handle: "@sarah_ayur",
    avatar: "S",
    color: "bg-purple-100 text-purple-600",
    content: "Just tried the Triphala tea recommendation from the AI assistant for my digestion issues. Honestly? Game changer. 🌱 #Ayurveda #GutHealth",
    time: "2h ago",
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    author: "Rahul Varma",
    handle: "@rahul_fit",
    avatar: "R",
    color: "bg-blue-100 text-blue-600",
    content: "Does anyone else feel heavier during Kapha season? The article on 'Spring Detox' suggested dry brushing. Giving it a go! 🧖‍♂️",
    time: "5h ago",
    likes: 28,
    comments: 8
  }
];

// --- Components ---

const AuthGuard = ({ children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(true)}
    >
      {children}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl z-50 text-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="font-semibold">Join the Inner Circle</span>
              <span className="text-gray-400">Sign up to like & save!</span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ArticleCard = ({ data }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="group bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
  >
    {/* Minimalist Header / Cover */}
    <div className={`h-32 ${data.image} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 flex gap-2">
        {data.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-[var(--bg-card)] backdrop-blur-sm text-xs font-semibold text-[var(--text-main)] rounded-md shadow-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
        {data.title}
      </h3>
      
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4 font-medium uppercase tracking-wide">
        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {data.author}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {data.readTime}</span>
      </div>

      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
        {data.excerpt}
      </p>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-auto">
        <button className="text-sm font-semibold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
          Read Article <ArrowRight className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-3">
          <AuthGuard>
            <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-[var(--text-muted)] transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </AuthGuard>
          <AuthGuard>
            <button className="p-2 hover:bg-red-50 rounded-full text-[var(--text-muted)] hover:text-red-400 transition-colors flex items-center gap-1">
              <Heart className="w-5 h-5" />
              <span className="text-xs">{data.likes}</span>
            </button>
          </AuthGuard>
        </div>
      </div>
    </div>
  </motion.div>
);

const BlogCard = ({ data }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex gap-4">
      {/* Avatar */}
      <div className={`shrink-0 w-12 h-12 rounded-full ${data.color} flex items-center justify-center font-bold text-lg`}>
        {data.avatar}
      </div>
      
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--text-main)]">{data.author}</span>
            <span className="text-[var(--text-muted)] text-sm">{data.handle}</span>
            <span className="text-[var(--text-muted)] text-sm">• {data.time}</span>
          </div>
          <button className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><MoreHorizontal className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <p className="text-[var(--text-main)] text-base leading-relaxed mb-4">
          {data.content}
        </p>

        {/* Social Actions */}
        <div className="flex items-center justify-between max-w-xs text-[var(--text-muted)]">
          <AuthGuard>
            <button className="flex items-center gap-2 text-sm hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span>{data.comments}</span>
            </button>
          </AuthGuard>

          <AuthGuard>
            <button className="flex items-center gap-2 text-sm hover:text-emerald-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-emerald-50 transition-colors">
                <Share2 className="w-4 h-4" />
              </div>
            </button>
          </AuthGuard>

          <AuthGuard>
            <button className="flex items-center gap-2 text-sm hover:text-pink-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <span>{data.likes}</span>
            </button>
          </AuthGuard>
        </div>
      </div>
    </div>
  </motion.div>
);

const ArticlesSnippets = () => {
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'blogs'
  const navigate = useNavigate();

  return (
    <section id="articles" className="py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-4">
              Explore the <span className="text-emerald-600">Library</span>
            </h2>
            <p className="text-[var(--text-muted)]">
              Read expert-curated articles or dive into community discussions. 
              Knowledge is free for everyone.
            </p>
          </div>

          {/* Custom Tab Switcher */}
          <div className="bg-[var(--bg-card)] p-1.5 rounded-xl border border-[var(--border-color)] shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'articles' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Expert Articles
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'blogs' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Community Blogs
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'articles' ? (
              <motion.div 
                key="articles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {ARTICLES.map(article => (
                  <ArticleCard key={article.id} data={article} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="blogs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              >
                {BLOGS.map(blog => (
                  <BlogCard key={blog.id} data={blog} />
                ))}
                
                {/* CTA Card for Blogs */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 flex flex-col justify-center items-center text-center text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-3">Join the Conversation</h3>
                  <p className="text-emerald-100 mb-6 max-w-xs">
                    Share your journey, ask questions, and connect with holistic health enthusiasts.
                  </p>
                  <button className="bg-white text-emerald-700 px-6 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                    Create Your Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'articles') {
                navigate('/articles');
              }
            }}
            className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:gap-3 transition-all"
          >
            View All {activeTab === 'articles' ? 'Articles' : 'Discussions'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ArticlesSnippets;