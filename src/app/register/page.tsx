'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { REGION_NAMES, type Region } from '@/lib/prices';
import { detectUserRegion } from '@/lib/geo';
import { translations } from '@/lib/i18n';

export default function Register() {
  // Registration steps: 1=email, 2=verification code, 3=password setup
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>('OTHER');
  const [locale, setLocale] = useState('en');
  const router = useRouter();
  
  // Form data
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  // Verification code state
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Detect user region and language
    const detectedRegion = detectUserRegion();
    setRegion(detectedRegion);

    const browserLang = navigator.language;
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

  // Step 1: Submit email and send verification code
  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Send verification code to email
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  // Step 2: Verify code
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
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      // Move to password setup step
      setCodeVerified(true);
      setStep(3);
    } catch (err) {
      console.error('Error verifying code:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Complete registration with password
  const handleCompleteRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!name) {
      setError('Please enter your name');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      // Complete registration
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          region,
          verificationCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('Email already in use');
          return;
        }
        throw new Error(data.error || 'Error during registration');
      }

      // Sign in automatically
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
        // Redirect to plans page
        router.push('/plans');
        router.refresh();
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Error during registration');
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
              {step === 1 && 'Create your account'}
              {step === 2 && 'Verify your email'}
              {step === 3 && 'Complete your account'}
            </h1>
            {step === 2 && (
              <p className="text-sm text-[#f5f5f7]/60 mt-2">
                We sent a verification code to {email}
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6" autoComplete="off">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2.5 text-sm bg-[#2a2b2d] border-none rounded focus:outline-none focus:ring-1 focus:ring-[#f5f5f7]/20 text-[#f5f5f7] placeholder-[#f5f5f7]/40"
                  placeholder="Enter your email address"
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
                    Verify code
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
          
          {/* Step 3: Complete Registration Form */}
          {step === 3 && (
            <form onSubmit={handleCompleteRegistration} className="space-y-6" autoComplete="off">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2.5 text-sm bg-[#2a2b2d] border-none rounded focus:outline-none focus:ring-1 focus:ring-[#f5f5f7]/20 text-[#f5f5f7] placeholder-[#f5f5f7]/40"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 text-sm bg-[#2a2b2d] border-none rounded focus:outline-none focus:ring-1 focus:ring-[#f5f5f7]/20 text-[#f5f5f7] placeholder-[#f5f5f7]/40"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 text-sm bg-[#2a2b2d] border-none rounded focus:outline-none focus:ring-1 focus:ring-[#f5f5f7]/20 text-[#f5f5f7] placeholder-[#f5f5f7]/40"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium text-[#f5f5f7]/80 mb-1.5">
                  Region
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(REGION_NAMES).map(([key, name]) => (
                    <div 
                      key={key} 
                      className={`
                        flex items-center justify-center p-2 rounded cursor-pointer transition-colors
                        ${region === key ? 'bg-[#3a3b3d] text-[#f5f5f7]' : 'bg-[#2a2b2d] text-[#f5f5f7]/60 hover:bg-[#3a3b3d] hover:text-[#f5f5f7]/80'}
                      `}
                      onClick={() => setRegion(key as Region)}
                    >
                      <span className="text-xs font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 px-4 text-sm font-medium text-[#f5f5f7] bg-[#2a2b2d] hover:bg-[#3a3b3d] rounded transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Complete registration
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#f5f5f7]/60">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-[#f5f5f7]/80 hover:text-[#f5f5f7] transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#f5f5f7]/40">
            Secure authentication powered by HTPS.io
          </p>
        </div>
      </div>
    </div>
  );
}
