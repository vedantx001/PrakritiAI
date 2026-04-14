import React, { useState } from 'react';
import { Menu, X, ArrowRight, User, Sparkles, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Try AI Demo', href: '#symptoms' },
    { name: 'Articles', href: '#articles' },
    { name: 'About', href: '#about' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-primary)] backdrop-blur-md shadow-sm border-b border-[var(--border-color)] py-4 sm:py-5 md:py-6 overflow-x-clip"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-3">
        
        <Link to="/" className="flex items-center gap-3 group isolate">
          <img
            src="/LogoNoBg.png"
            alt="PrakritiAI"
            className="w-12 h-12 object-contain bg-transparent 
                      scale-[1.8] md:scale-[2] 
                      translate-x-[2px] md:translate-x-[3px]"
          />

          <span className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] leading-none group-hover:text-emerald-700 transition-colors">
            Prakriti<span className="text-emerald-600">AI</span>
          </span>
        </Link>

        {/* --- Center/Right: Desktop Navigation --- */}
        <div className="hidden lg:flex items-center gap-10">
          {/* Nav Links (Bigger Font) */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base font-medium text-[var(--text-muted)] hover:text-emerald-700 transition-colors relative group/link"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover/link:w-full" />
              </a>
            ))}
          </div>

          <div className="h-6 w-px bg-[var(--border-color)]"></div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              <>
                <span className="text-base font-semibold text-gray-700">Hi, {user?.fullName || 'User'}</span>
                <button
                  onClick={logout}
                  className="text-base font-semibold text-[var(--text-main)] hover:text-emerald-700 transition-colors"
                >
                  Log Out
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-base font-semibold text-[var(--text-main)] hover:text-emerald-700 transition-colors">
                  Log In
                </Link>
                <Link
                  to="/auth/signup"
                  className="group flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-full text-base font-medium shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 hover:shadow-emerald-700/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Sign Up</span>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-3 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- Mobile Menu Toggle --- */}
        <button
          className="lg:hidden min-w-[44px] min-h-[44px] p-2 text-[var(--text-main)] hover:text-emerald-700 transition-colors bg-[var(--bg-card)] rounded-lg backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      </nav>

      {/* --- Mobile Menu Overlay Backdrop --- */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* --- Mobile Menu Drawer --- */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-[85vw] max-w-[380px] h-[100dvh] z-[70] bg-[var(--bg-primary)] shadow-[-15px_0_40px_-15px_rgba(0,0,0,0.3)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="/LogoNoBg.png"
              alt="PrakritiAI"
              className="w-9 h-9 object-contain scale-[1.6] translate-x-[2px]"
            />
            <span className="text-xl font-bold tracking-tight text-[var(--text-main)] ml-1">
              Prakriti<span className="text-emerald-600">AI</span>
            </span>
          </Link>
          <button
            className="p-2 text-[var(--text-muted)] hover:text-emerald-600 hover:bg-[var(--bg-secondary)] transition-colors rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 pb-24">
          
          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 pl-2">Navigation</p>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center justify-between p-3.5 rounded-xl text-lg text-[var(--text-main)] font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 transition-all group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                <ArrowRight className="w-5 h-5 text-emerald-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="h-px w-full bg-[var(--border-color)]"></div>

          {/* Account Actions */}
          <div className="flex flex-col space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 pl-2">Account Settings</p>
            {isAuthenticated ? (
              <>
                <div className="px-3 py-3 mb-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                   <p className="text-xs font-medium text-[var(--text-muted)]">Signed in as</p>
                   <p className="text-lg font-bold text-[var(--text-main)] truncate">{user?.fullName || 'User'}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-4 rounded-xl text-[17px] font-bold text-[var(--text-main)] border-2 border-[var(--border-color)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] transition-all"
                >
                  Log Out
                </button>
                <button
                  onClick={toggleTheme}
                  className="w-full py-4 rounded-xl text-[17px] font-bold border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] transition-all flex items-center justify-center gap-2"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-4 rounded-xl text-[17px] font-bold text-[var(--text-main)] border-2 border-[var(--border-color)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-4 rounded-xl text-[17px] font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Sign Up
                </Link>
                <button
                  onClick={toggleTheme}
                  className="w-full py-4 mt-2 rounded-xl text-[17px] font-bold border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] transition-all flex items-center justify-center gap-2"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;