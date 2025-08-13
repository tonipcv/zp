'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import XLogo from '@/components/XLogo';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação não encontrado');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verificado com sucesso!');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          const data = await response.json();
          setStatus('error');
          setMessage(data.error || 'Erro ao verificar email');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erro ao verificar email');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] px-4">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-lg border border-zinc-800">
        <div className="flex justify-center">
          <XLogo />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Verificação de Email
          </h2>
          
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            </div>
          )}
          
          {status === 'success' && (
            <p className="text-green-400">{message}</p>
          )}
          
          {status === 'error' && (
            <>
              <p className="text-red-400 mb-4">{message}</p>
              <Link 
                href="/login" 
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
              >
                Voltar para o login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
} 