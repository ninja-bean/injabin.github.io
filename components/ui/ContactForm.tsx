'use client';

import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { siteConfig } from '@/content';
import { useAppStore } from '@/lib/store';

// Zod validation schema
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your name.')
    .max(80, 'Name must be under 80 characters.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(120, 'Email must be under 120 characters.'),
  message: z
    .string()
    .trim()
    .min(1, 'Please enter your message.')
    .max(2000, 'Message cannot exceed 2000 characters.'),
  botcheck: z.string().optional(),
});

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

export interface ContactFormProps {
  className?: string;
  hasEntered?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  className = '',
  hasEntered = true,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    botcheck: '',
  });

  const [submittedData, setSubmittedData] = useState({
    name: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const { theme, setContactSent } = useAppStore();
  const hCaptchaContainerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Manage 60-second cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Load hCaptcha script per Web3Forms instructions, but only once the
  // contact section is reached so it never blocks the initial page load.
  useEffect(() => {
    if (!hasEntered || typeof window === 'undefined') return;
    const existingScript = document.querySelector('script[src*="hcaptcha.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [hasEntered]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cooldown > 0) {
      setErrorMessage(`Please wait ${cooldown} seconds before sending another message.`);
      setStatus('error');
      return;
    }

    // 1. Zod Validation
    const validationResult = contactSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      let firstErrorField = '';
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          const field = String(err.path[0]);
          errors[field] = err.message;
          if (!firstErrorField) firstErrorField = field;
        }
      });
      setFormErrors(errors);
      setStatus('error');
      setErrorMessage('Please correct the highlighted fields before submitting.');

      // Move focus to first invalid field
      if (firstErrorField === 'name') nameInputRef.current?.focus();
      else if (firstErrorField === 'email') emailInputRef.current?.focus();
      else if (firstErrorField === 'message') messageInputRef.current?.focus();
      return;
    }

    // 2. Honeypot check (silently trap bots)
    if (formData.botcheck) {
      setSubmittedData({ name: formData.name, email: formData.email });
      setStatus('sent');
      setContactSent(true);
      setCooldown(60);
      return;
    }

    setStatus('sending');
    setErrorMessage('');
    setFormErrors({});

    try {
      const apiKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

      // Extract hCaptcha response token if rendered
      let hCaptchaResponse = '';
      if (typeof window !== 'undefined') {
        const hCaptchaInput = document.querySelector<HTMLTextAreaElement>(
          'textarea[name="h-captcha-response"], input[name="h-captcha-response"]'
        );
        if (hCaptchaInput) {
          hCaptchaResponse = hCaptchaInput.value;
        }
      }

      const payload: Record<string, unknown> = {
        access_key: apiKey || 'test-key',
        from_name: 'Portfolio',
        subject: `Portfolio message from ${formData.name}`,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        botcheck: '',
      };

      if (hCaptchaResponse) {
        payload['h-captcha-response'] = hCaptchaResponse;
      }

      // If no API key is configured yet in local development, provide a graceful test response
      if (!apiKey || apiKey === 'your_access_key_here') {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSubmittedData({ name: formData.name, email: formData.email });
        setStatus('sent');
        setContactSent(true);
        setCooldown(60);
        setFormData({ name: '', email: '', message: '', botcheck: '' });
        return;
      }

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setSubmittedData({ name: formData.name, email: formData.email });
        setStatus('sent');
        setContactSent(true);
        setCooldown(60);
        setFormData({ name: '', email: '', message: '', botcheck: '' });
      } else {
        setStatus('error');
        setErrorMessage(
          data?.message || 'Could not send message. Please email me directly.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Network error while dispatching message. Please email me directly.'
      );
    }
  };

  const handleResetForm = () => {
    setStatus('idle');
    setErrorMessage('');
    setFormErrors({});
    setCooldown(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`border-2 border-ink p-6 sm:p-8 bg-paper flex flex-col justify-between h-full min-h-[580px] sm:min-h-[620px] transition-all duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
        hasEntered ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
      } ${className}`}
    >
      {/* 1. Header Registration Strip */}
      <div className="flex items-center justify-between border-b-2 border-ink pb-3 mb-4 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-blue border border-ink" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
            Dispatch Message
          </span>
        </div>
        <span className="font-mono text-[10px] text-grey uppercase tracking-wider px-2 py-0.5 border border-ink/30 bg-paper">
          Web3Forms Route
        </span>
      </div>

      {/* 2. Error Banner */}
      {status === 'error' && errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-red text-white p-3 border-2 border-ink font-body text-xs sm:text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 shrink-0"
        >
          <span>{errorMessage}</span>
          <a
            href={`mailto:${siteConfig.email}`}
            className="underline hover:text-ink shrink-0 font-mono text-xs"
          >
            Email directly ({siteConfig.email}) &rarr;
          </a>
        </div>
      )}

      {/* 3. Success State: Same container height, zero layout jump */}
      {status === 'sent' ? (
        <div
          role="status"
          aria-live="polite"
          className="flex-1 flex flex-col justify-between py-6"
        >
          <div className="space-y-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-ink text-paper flex items-center justify-center font-mono font-bold text-lg border-2 border-ink">
                &check;
              </div>
              <h4 className="font-display font-black text-2xl sm:text-3xl text-ink uppercase tracking-tight">
                Message sent.
              </h4>
            </div>

            <p className="font-body text-base text-ink/90 leading-relaxed max-w-lg">
              Thanks, <span className="font-bold text-ink">{submittedData.name || 'there'}</span>. I&apos;ll reply to{' '}
              <span className="font-bold text-blue underline">{submittedData.email || siteConfig.email}</span>.
            </p>

            {/* Small stack of 3 Bauhaus shapes (circle, square, triangle) snapping together */}
            <div className="py-4">
              <span className="font-mono text-[10px] text-grey uppercase tracking-wider block mb-2">
                Bauhaus Primary Stack
              </span>
              <div className="flex items-center space-x-3">
                {/* Circle in Bauhaus Blue */}
                <div
                  className="w-8 h-8 rounded-full bg-blue border-2 border-ink"
                  title="Bauhaus Blue Circle"
                />
                {/* Square in Bauhaus Red */}
                <div
                  className="w-8 h-8 bg-red border-2 border-ink"
                  title="Bauhaus Red Square"
                />
                {/* Triangle in Bauhaus Yellow */}
                <div
                  className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-yellow"
                  title="Bauhaus Yellow Triangle"
                  style={{ filter: 'drop-shadow(0 0 1px #000)' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-ink flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetForm}
              className="font-mono text-xs font-bold uppercase tracking-wider text-ink underline hover:text-blue focus:outline-none focus:ring-2 focus:ring-blue px-2 py-1"
            >
              &larr; Send another message
            </button>
            <span className="font-mono text-[11px] text-grey">
              COOLDOWN: {cooldown > 0 ? `${cooldown}s` : 'READY'}
            </span>
          </div>
        </div>
      ) : (
        /* 4. Active Form: flex column filling vertical space with zero empty gaps */
        <div className="flex-1 flex flex-col justify-between">
          {/* Hidden Botcheck Honeypot Field */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
          >
            <label htmlFor="botcheck">Do not fill this field</label>
            <input
              id="botcheck"
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              value="checked"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  botcheck: e.target.checked ? 'bot' : '',
                }))
              }
            />
          </div>

          {/* Form Inputs Container */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Name & Email Fields Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-body text-xs font-bold uppercase tracking-wider text-ink mb-1"
                >
                  Your name *
                </label>
                <input
                  ref={nameInputRef}
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  required
                  disabled={status === 'sending'}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ada Lovelace"
                  className={`w-full rounded-none bg-paper border-2 px-3 py-2 font-body text-sm text-ink placeholder:text-grey/60 focus:outline-none focus:ring-[3px] focus:ring-blue focus:border-blue transition-colors ${
                    formErrors.name ? 'border-red ring-1 ring-red' : 'border-ink'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 font-mono text-xs text-red font-bold">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-body text-xs font-bold uppercase tracking-wider text-ink mb-1"
                >
                  Your email address *
                </label>
                <input
                  ref={emailInputRef}
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={120}
                  required
                  disabled={status === 'sending'}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. ada@example.com"
                  className={`w-full rounded-none bg-paper border-2 px-3 py-2 font-body text-sm text-ink placeholder:text-grey/60 focus:outline-none focus:ring-[3px] focus:ring-blue focus:border-blue transition-colors ${
                    formErrors.email ? 'border-red ring-1 ring-red' : 'border-ink'
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 font-mono text-xs text-red font-bold">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Message Textarea with flex-grow: 1 and counter inside bottom-right */}
            <div className="flex-1 flex flex-col min-h-[200px]">
              <label
                htmlFor="contact-message"
                className="block font-body text-xs font-bold uppercase tracking-wider text-ink mb-1"
              >
                Your message *
              </label>
              <div className="relative flex-1 flex flex-col">
                <textarea
                  ref={messageInputRef}
                  id="contact-message"
                  name="message"
                  maxLength={2000}
                  required
                  disabled={status === 'sending'}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Inquire about software engineering opportunities, backend systems, or technical collaboration..."
                  className={`w-full flex-1 min-h-[200px] resize-none rounded-none bg-paper border-2 p-3 pb-8 font-body text-sm text-ink placeholder:text-grey/60 focus:outline-none focus:ring-[3px] focus:ring-blue focus:border-blue transition-colors ${
                    formErrors.message ? 'border-red ring-1 ring-red' : 'border-ink'
                  }`}
                />
                <span className="absolute bottom-2.5 right-3 font-mono text-[11px] text-grey pointer-events-none select-none">
                  {formData.message.length} / 2000
                </span>
              </div>
              {formErrors.message && (
                <p className="mt-1 font-mono text-xs text-red font-bold">
                  {formErrors.message}
                </p>
              )}
            </div>
          </div>

          {/* Directly under textarea with no gap: ONE action row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 shrink-0">
            {/* hCaptcha Widget Container on the left */}
            <div className="overflow-hidden flex items-center justify-start min-h-[78px] min-w-[300px]">
              <div
                ref={hCaptchaContainerRef}
                className="h-captcha"
                data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                data-theme={theme === 'dark' ? 'dark' : 'light'}
                data-size="normal"
              />
            </div>

            {/* Red Send message button: 56px high, min-width 220px, bold Jost text with arrow on the right */}
            <button
              type="submit"
              disabled={status === 'sending' || cooldown > 0}
              className="h-[56px] min-w-[220px] w-full sm:w-auto px-6 bg-red text-white font-display font-black text-sm uppercase tracking-wider border-2 border-ink hover:bg-ink hover:text-paper disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-mechanical flex items-center justify-center space-x-3 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue"
            >
              <span>
                {status === 'sending'
                  ? 'Sending'
                  : cooldown > 0
                  ? `Cooldown (${cooldown}s)`
                  : 'Send message'}
              </span>
              <div
                className={`w-6 h-6 border border-white flex items-center justify-center font-mono text-xs transition-transform ${
                  status === 'sending' ? 'animate-spin' : ''
                }`}
              >
                &rarr;
              </div>
            </button>
          </div>

          {/* Pinned at card bottom after thin 2px rule */}
          <div className="border-t-2 border-ink pt-3 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-grey shrink-0">
            <span>PRIVACY: Direct inbox routing via Web3Forms API. No tracking cookies.</span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline font-bold text-ink hover:text-blue shrink-0"
            >
              Or mail: {siteConfig.email}
            </a>
          </div>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
