'use client';

import React, { useEffect } from 'react';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Research } from '@/components/sections/Research';
import { Contact } from '@/components/sections/Contact';
import { siteConfig } from '@/content';
import { initSmoothScroll, scrollToSection } from '@/lib/scroll';

export default function HomePage() {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return () => cleanup();
  }, []);

  return (
    <div className="relative w-full">
      {/* 1. Hero Section (Includes 3D Canvas Anchored Beside Name) */}
      <Hero />

      {/* 2. About Section */}
      <About />

      {/* 3. Featured Projects Section */}
      <Projects />

      {/* 4. Skills & Capabilities Section */}
      <Skills />

      {/* 5. Accreditations & Honors Section */}
      <Research />

      {/* 6. Career & Academic Experience Section */}
      <Experience />

      {/* 7. Contact Section */}
      <Contact />

      {/* Global Bauhaus Footer */}
      <footer className="border-t-4 border-ink py-12 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
              className="w-10 h-10 bg-ink text-paper flex items-center justify-center font-display font-black text-xl border-2 border-ink hover:bg-red hover:text-white transition-colors duration-150 ease-mechanical"
              aria-label="Return to top"
            >
              IA
            </a>
            <div>
              <p className="font-display font-extrabold text-sm uppercase text-ink">
                {siteConfig.name}
              </p>
              <p className="font-body text-xs text-grey">
                Full-stack systems and software engineering.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            {/* Social Logos in Bauhaus Square Frames */}
            <div className="flex items-center space-x-2.5" role="list" aria-label="Social profiles and contact">
              {/* GitHub Logo */}
              <a
                href={siteConfig.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-10 h-10 border-2 border-ink bg-paper flex items-center justify-center text-ink hover:bg-ink hover:text-paper transition-colors duration-150 ease-mechanical focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>

              {/* LinkedIn Logo */}
              <a
                href={siteConfig.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-10 h-10 border-2 border-ink bg-paper flex items-center justify-center text-ink hover:bg-blue hover:text-white transition-colors duration-150 ease-mechanical focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* HackerRank Logo */}
              <a
                href={siteConfig.hackerRank.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HackerRank Profile"
                className="w-10 h-10 border-2 border-ink bg-paper flex items-center justify-center text-ink hover:bg-yellow hover:text-ink transition-colors duration-150 ease-mechanical focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm3.84 17.5h-2.18v-4.22h-3.32v4.22H8.16V6.5h2.18v4.28h3.32V6.5h2.18z" />
                </svg>
              </a>

              {/* Email Envelope Logo */}
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Send Email"
                className="w-10 h-10 border-2 border-ink bg-paper flex items-center justify-center text-ink hover:bg-red hover:text-white transition-colors duration-150 ease-mechanical focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="0" />
                  <polyline points="3,7 12,13 21,7" />
                </svg>
              </a>
            </div>

            {/* Bauhaus Copyright Notice */}
            <div className="flex items-center space-x-2 font-mono text-xs text-grey uppercase tracking-wider">
              <span className="w-2 h-2 bg-red inline-block border border-ink" />
              <span>&copy; {new Date().getFullYear()} INJABIN ALAM // ALL RIGHTS RESERVED.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
