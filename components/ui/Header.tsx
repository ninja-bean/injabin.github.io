'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, SectionId } from '@/lib/store';
import { siteConfig } from '@/content';
import { scrollToSection } from '@/lib/scroll';

export const Header: React.FC = () => {
  const { theme, toggleTheme, scrollProgress, activeSection } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks: { id: SectionId; label: string; activeColor: string }[] = [
    { id: 'about', label: 'About', activeColor: 'text-red underline' },
    { id: 'projects', label: 'Projects', activeColor: 'text-blue underline' },
    { id: 'skills', label: 'Skills', activeColor: 'text-ink underline' },
    { id: 'honors', label: 'Honors', activeColor: 'text-yellow underline' },
    { id: 'experience', label: 'Experience', activeColor: 'text-red underline' },
    { id: 'contact', label: 'Contact', activeColor: 'text-blue underline' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-paper border-b-2 border-ink transition-colors duration-200">
      {/* Reversible Scrubbed Bauhaus Scroll Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[3px] bg-blue transition-[width] duration-75 ease-out z-50 pointer-events-none"
        style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Monogram & Title */}
        <div className="flex items-center space-x-3">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center space-x-2 group focus-visible:ring-0"
            aria-label={`${siteConfig.name} - Return to top`}
          >
            {/* Bauhaus Monogram: Square with sharp geometry */}
            <div className="w-9 h-9 bg-ink text-paper flex items-center justify-center font-display font-black text-xl tracking-tighter border-2 border-ink group-hover:bg-red group-hover:text-white transition-colors duration-150 ease-mechanical">
              IA
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight leading-none text-ink">
                {siteConfig.name}
              </span>
              <span className="font-body text-xs text-grey tracking-wide uppercase mt-0.5">
                {siteConfig.role}
              </span>
            </div>
          </a>
        </div>

        {/* Navigation & Theme Control */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <nav className="hidden md:flex items-center space-x-5 font-mono text-xs uppercase tracking-wider text-ink/80">
            {navLinks.map(({ id, label, activeColor }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className={`transition-colors decoration-2 underline-offset-4 hover:underline ${
                    isActive ? activeColor : 'hover:text-ink'
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-3 py-1.5 border-2 border-ink font-body text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors duration-150 ease-mechanical ${
              mounted && theme === 'dark'
                ? 'bg-paper text-ink hover:bg-yellow hover:text-ink'
                : 'bg-ink text-paper hover:bg-blue hover:text-white'
            }`}
            aria-label={`Switch to ${mounted && theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span
              className={`w-2.5 h-2.5 border border-ink ${
                mounted && theme === 'dark' ? 'bg-yellow' : 'bg-red'
              }`}
            />
            <span>{mounted ? (theme === 'dark' ? 'Light' : 'Dark') : 'Theme'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
