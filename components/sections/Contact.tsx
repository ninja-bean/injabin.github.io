'use client';

import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/content';
import { ContactForm } from '@/components/ui/ContactForm';

export const Contact: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleMotion);

    if (mediaQuery.matches) {
      setHasEntered(true);
      return () => mediaQuery.removeEventListener('change', handleMotion);
    }

    // Single-trigger entrance observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  const coordinateRows = [
    {
      label: 'EMAIL',
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      hoverClass: 'hover:bg-red hover:text-white focus-visible:bg-red focus-visible:text-white',
      accent: 'red',
    },
    {
      label: 'LINKEDIN',
      value: `linkedin.com/in/${siteConfig.linkedin.username}`,
      href: siteConfig.linkedin.url,
      hoverClass: 'hover:bg-blue hover:text-white focus-visible:bg-blue focus-visible:text-white',
      accent: 'blue',
    },
    {
      label: 'GITHUB',
      value: `github.com/${siteConfig.github.username}`,
      href: siteConfig.github.url,
      hoverClass: 'hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink focus-visible:bg-ink focus-visible:text-paper',
      accent: 'ink',
    },
    {
      label: 'HACKERRANK',
      value: 'hackerrank.com/profile/malam2330344',
      href: 'https://www.hackerrank.com/profile/malam2330344',
      hoverClass: 'hover:bg-yellow hover:text-ink focus-visible:bg-yellow focus-visible:text-ink',
      accent: 'yellow',
    },
    {
      label: 'LOCATION',
      value: 'Dhaka, Bangladesh // UTC+6',
      href: 'https://maps.google.com/?q=Dhaka,Bangladesh',
      hoverClass: 'hover:bg-blue/15 dark:hover:bg-paper/15 focus-visible:bg-blue/15',
      accent: 'grey',
    },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 border-b-4 border-ink bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-3 h-3 bg-red border border-ink" />
              <span className="font-mono text-xs text-grey uppercase tracking-widest">
                section 07 // initiate contact &amp; coordinates
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-ink lowercase tracking-tight">
              contact // get in touch
            </h2>
          </div>
          <p className="font-mono text-xs text-grey">
            DIRECT INBOX ROUTING TO {siteConfig.email}
          </p>
        </div>

        {/* Both cards in one CSS grid row with align-items: stretch (equal height).
            On 820 tablet and 390 mobile: stacked with form first. */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT CARD: Direct Coordinates (5/12 width on desktop, full height) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div
              className={`border-2 border-ink p-6 sm:p-8 bg-paper flex flex-col justify-between h-full min-h-[580px] sm:min-h-[620px] transition-all duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                hasEntered ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
              }`}
            >
              {/* Header Registration Bar */}
              <div className="flex items-center justify-between border-b-2 border-ink pb-3 mb-4 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-red border border-ink" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    Direct Coordinates
                  </span>
                </div>
                <span className="font-mono text-[10px] text-grey uppercase tracking-wider px-2 py-0.5 border border-ink/30 bg-paper">
                  Available // 2026
                </span>
              </div>

              {/* Intro Text */}
              <div className="shrink-0 mb-2">
                <h3 className="font-display font-black text-xl sm:text-2xl text-ink uppercase tracking-tight mb-2">
                  Let&apos;s Build Systems Together
                </h3>
                <p className="font-body text-xs sm:text-sm text-ink/85 leading-relaxed">
                  I am open to software engineering internships and junior full-stack / backend roles.
                  Reach out directly through these verified channels.
                </p>
              </div>

              {/* Plain Rows Separated by 2px Rules (NO individual boxed rows!) */}
              <div
                className="flex-1 flex flex-col justify-between divide-y-2 divide-ink border-y-2 border-ink my-4 select-none"
                role="list"
                aria-label="Direct contact channels"
              >
                {coordinateRows.map((row, idx) => {
                  const transitionDelay = prefersReduced ? '0ms' : `${idx * 60 + 350}ms`;

                  return (
                    <a
                      key={row.label}
                      href={row.href}
                      target={row.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={row.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                      role="listitem"
                      style={{
                        transitionDelay: hasEntered ? transitionDelay : '0ms',
                      }}
                      className={`group flex-1 flex items-center justify-between px-3 sm:px-4 py-2.5 transition-colors duration-150 ease-mechanical focus:outline-none focus:ring-2 focus:ring-blue ${
                        row.hoverClass
                      } ${
                        hasEntered || prefersReduced
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-4'
                      } transition-[opacity,transform,background-color,color] duration-300 ease-[cubic-bezier(0.7,0,0.2,1)]`}
                    >
                      <div className="flex flex-col min-w-0 pr-3">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-grey group-hover:text-inherit">
                          {row.label}
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-bold text-ink truncate group-hover:text-inherit">
                          {row.value}
                        </span>
                      </div>

                      {/* Square Arrow Box at the Right */}
                      <div className="w-8 h-8 border-2 border-ink group-hover:border-current flex items-center justify-center shrink-0 font-mono text-sm transition-colors duration-150 ease-mechanical">
                        &rarr;
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Square Outlined "Download resume (PDF)" Button linking to /resume.pdf */}
              <a
                href="/resume.pdf"
                download="Injabin_Alam_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[52px] border-2 border-ink bg-paper font-display font-black text-xs sm:text-sm uppercase tracking-wider text-ink hover:bg-red hover:text-white flex items-center justify-between px-5 transition-colors duration-150 ease-mechanical group shrink-0 focus:outline-none focus:ring-2 focus:ring-blue"
                aria-label="Download resume in PDF format"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 bg-red border border-ink group-hover:bg-white group-hover:border-white transition-colors" />
                  <span>Download resume (PDF)</span>
                </div>
                <div className="w-6 h-6 border-2 border-ink group-hover:border-white flex items-center justify-center font-mono text-xs transition-colors">
                  &darr;
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT CARD: Message Form (7/12 width on desktop, full height) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <ContactForm hasEntered={hasEntered || prefersReduced} className="h-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
