'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { translations } from '@/lib/i18n';
import Image from 'next/image';

export default function Login() {
  // Login steps: 1=email/password, 2=verification code
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState('pt-BR');
  const router = useRouter();
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Verification code state
  const [codeSent, setCodeSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Detecta o idioma do navegador
    const browserLang = navigator.language;
    // Verifica se temos tradução para o idioma, senão usa inglês como fallback
    const supportedLocale = translations[browserLang] ? browserLang : 
                          browserLang.startsWith('pt') ? 'pt-BR' :
                          browserLang.startsWith('es') ? 'es' : 'en';
    setLocale(supportedLocale);
  }, []);
  
  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const t = translations[locale];

  // Step 1: Submit email/password and send verification code
  const handleEmailPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!email || !email.includes('@') || !password) {
        setError('Please enter a valid email and password');
        setIsSubmitting(false);
        return;
      }

      // Send verification code to email
      const response = await fetch('/api/auth/login-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      // Move to verification code step
      setCodeSent(true);
      setStep(2);
      
      // Start countdown for resend
      setResendDisabled(true);
      setCountdown(60);
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }

      // Reset countdown
      setResendDisabled(true);
      setCountdown(60);
    } catch (err) {
      console.error('Error resending verification code:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify code and complete login
  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!verificationCode || verificationCode.length < 6) {
      setError('Please enter a valid verification code');
      setIsSubmitting(false);
      return;
    }

    try {
      // Verify the code
      const response = await fetch('/api/auth/verify-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      // Complete login with NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.ok) {
        // Redirect to WhatsApp page
        router.push('/whatsapp');
        router.refresh();
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1d20] font-normal tracking-[-0.01em]">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[380px] bg-[#1c1d20] p-8">
          <div className="text-center mb-8">
            <h1 className="text-xl font-medium text-[#f5f5f7] tracking-tight">
              {step === 1 && 'Sign in to your account'}
              {step === 2 && 'Verify your email'}
            </h1>
            {step === 2 && (
              <p className="text-sm text-[#f5f5f7]/60 mt-2">
                We sent a verification code to {email}
              </p>
            )}
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          {/* Step 1: Email/Password Form */}
          {step === 1 && (
          <form onSubmit={handleEmailPasswordSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                {t.login.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                className="w-full px-3 py-2.5 text-sm bg-[#2a2b2d] border-none rounded focus:outline-none focus:ring-1 focus:ring-[#f5f5f7]/20 text-[#f5f5f7] placeholder-[#f5f5f7]/40"
                placeholder={t.login.emailPlaceholder}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                {t.login.password}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-3 py-2.5 text-sm bg-[#2a2b2d] border-none rounded focus:outline-none focus:ring-1 focus:ring-[#f5f5f7]/20 text-[#f5f5f7] placeholder-[#f5f5f7]/40"
                placeholder={t.login.passwordPlaceholder}
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 px-4 text-sm font-medium text-[#f5f5f7] bg-[#2a2b2d] hover:bg-[#3a3b3d] rounded transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          )}
          
          {/* Step 2: Verification Code Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6" autoComplete="off">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                  Verification code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2.5 text-sm bg-[#2a2b2d] border-none rounded focus:outline-none focus:ring-1 focus:ring-[#f5f5f7]/20 text-[#f5f5f7] placeholder-[#f5f5f7]/40"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 px-4 text-sm font-medium text-[#f5f5f7] bg-[#2a2b2d] hover:bg-[#3a3b3d] rounded transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendDisabled}
                  className={`text-sm ${resendDisabled ? 'text-[#f5f5f7]/30' : 'text-[#f5f5f7]/60 hover:text-[#f5f5f7]/90'} transition-colors duration-200`}
                >
                  {resendDisabled ? `Resend code in ${countdown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <div>
              <Link 
                href="/forgot-password" 
                className="text-sm text-[#f5f5f7]/60 hover:text-[#f5f5f7]/90 transition-colors duration-200"
              >
                {t.login.forgotPassword}
              </Link>
            </div>
            <div>
              <Link 
                href="/register" 
                className="text-sm text-[#f5f5f7]/60 hover:text-[#f5f5f7]/90 transition-colors duration-200"
              >
                {t.login.createAccount || "Don't have an account? Create one"}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer minimalista */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#f5f5f7]/40">
            Secure authentication powered by HTPS.io
          </p>
        </div>
      </div>
    </div>
  );
}
