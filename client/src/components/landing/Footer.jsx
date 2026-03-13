import React from 'react';
import { Leaf, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Ayurveda AI', href: '#demo' },
      { name: 'Symptom Tracker', href: '#' },
    ],
    resources: [
      { name: 'Blog', href: '#articles' },
      { name: 'Herbal Database', href: '#' },
      { name: 'Community', href: '#' },
    ],
    developer: [
      { name: 'Portfolio', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Contact Me', href: '#' },
    ],
  };

  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-muted)] py-12 border-t border-[var(--border-color)]" id="footer">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Top Section: Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                <Leaf className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
                Prakriti<span className="text-emerald-500">AI</span>
              </span>
            </a>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
              Bridging the gap between ancient Ayurvedic wisdom and modern artificial intelligence.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-[var(--text-main)] font-semibold mb-6">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--text-main)] font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Column */}
          <div>
            <h4 className="text-[var(--text-main)] font-semibold mb-6">Developer</h4>
            <ul className="space-y-3">
              {links.developer.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    {link.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* --- Bottom Section: Simple Copyright --- */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            &copy; {currentYear} PrakritiAI. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;