import React from 'react';
import { Leaf, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = 2026;

  const developerLinks = [
    { name: 'Portfolio', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'Contact Me', href: '#' },
  ];

  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-muted)] py-12 border-t border-[var(--border-color)]" id="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* --- Top Section: Brand (Left) + Developer (Right) --- */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-12 mb-10 text-center md:text-left">

          {/* Brand */}
          <div className="space-y-4 md:w-1/2">
            <a href="/" className="flex items-center justify-center md:justify-start gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                <Leaf className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                Prakriti<span className="text-emerald-500">AI</span>
              </span>
            </a>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs md:max-w-none mx-auto md:mx-0">
              Bridging the gap between ancient Ayurvedic wisdom and modern artificial intelligence.
            </p>
          </div>

          {/* Developer */}
          <div className="flex flex-col items-center md:items-end md:w-1/2">
            <h4 className="text-[var(--text-main)] text-sm font-semibold mb-4 md:mb-5 mr-7">Developer</h4>
            <ul className="space-y-2">
              {developerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-emerald-400 transition-colors flex items-center justify-center md:justify-end gap-2 group min-h-[44px] px-3 py-2 rounded-lg w-full md:w-auto"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* --- Bottom Row: Copyright + Creator --- */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 text-center md:text-left">
          <p className="text-[var(--text-muted)] text-sm">
            &copy; {currentYear} PrakritiAI. All rights reserved.
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Created by <span className="font-semibold text-[var(--text-main)]">Vedant Patel</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;