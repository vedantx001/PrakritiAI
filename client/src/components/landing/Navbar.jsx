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
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-primary)] backdrop-blur-md shadow-sm border-b border-[var(--border-color)] py-6"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* --- Left: Brand Logo (Bigger & Cleaner) --- */}
        <Link to="/" className="flex items-center gap-3 group isolate">
          <img
            src="/LogoNoBg.png"
            alt="PrakritiAI"
            className="w-12 h-12 scale-[2] translate-x-[2px] object-contain bg-transparent"
          />

          <span className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] leading-none group-hover:text-emerald-700 transition-colors">
            Prakriti<span className="text-emerald-600">AI</span>
          </span>
        </Link>

        {/* --- Center/Right: Desktop Navigation --- */}
        <div className="hidden md:flex items-center gap-10">
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
          className="md:hidden p-2 text-[var(--text-main)] hover:text-emerald-700 transition-colors bg-[var(--bg-card)] rounded-lg backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[var(--bg-primary)] backdrop-blur-xl border-t border-[var(--border-color)] shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center justify-between p-3 rounded-xl text-lg text-[var(--text-main)] font-medium hover:bg-[var(--bg-secondary)] hover:text-emerald-700 transition-all group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          ))}
          
          <div className="h-px w-full bg-[var(--border-color)] my-4"></div>
          
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-3.5 rounded-xl text-lg font-semibold text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  Log Out
                </button>
                <button
                  onClick={toggleTheme}
                  className="w-full py-3.5 rounded-xl text-lg font-semibold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-2"
                  aria-label="Toggle theme"
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
                  className="w-full text-center py-3.5 rounded-xl text-lg font-semibold text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-xl text-lg font-semibold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Sign Up
                </Link>
                <button
                  onClick={toggleTheme}
                  className="w-full py-3.5 rounded-xl text-lg font-semibold border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-2"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;