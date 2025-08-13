'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import PremiumModal from './PremiumModal';
import LoadingScreen from './LoadingScreen';
import { Navigation } from '@/app/components/Navigation';

interface PremiumAccessOptions {
  blurContent?: boolean;
  showModal?: boolean;
}

export function withPremiumAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: PremiumAccessOptions = {}
) {
  const { blurContent = true, showModal = true } = options;

  return function WithPremiumCheck(props: P) {
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [trialStatus, setTrialStatus] = useState<{
      trialActivated: boolean;
      trialActive: boolean;
      trialStartDate?: string | null;
      trialEndDate?: string | null;
    } | null>(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkTrialStatus = async () => {
      try {
        const response = await fetch('/api/user/premium-status');
        const data = await response.json();
        
        // For backward compatibility, we still use isPremium from the API
        setHasAccess(data.isPremium || false);
        
        setTrialStatus({
          trialActivated: data.trialActivated || false,
          trialActive: data.trialActive || false,
          trialStartDate: data.trialStartDate,
          trialEndDate: data.trialEndDate
        });
        
        if (!data.isPremium) {
          setShowPremiumModal(true);
        }
      } catch (error) {
        console.error('Erro ao verificar status do trial:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      checkTrialStatus();
    }, []);

    if (isLoading) {
      return <LoadingScreen />;
    }

    return (
      <div className="min-h-screen bg-[#111] text-gray-200">
        <header className="fixed top-0 w-full bg-[#111]/90 backdrop-blur-sm z-50 px-4 py-3">
          <div className="flex justify-center lg:justify-start">
            <Link href="/" className="flex items-center">
              <Image src="/ft-icone.png" alt="Futuros Tech Logo" width={40} height={40} />
            </Link>
          </div>
        </header>

        <div className={blurContent && !hasAccess ? 'filter blur-[4px]' : ''}>
          <main className="pt-14 pb-24">
            <WrappedComponent {...props} />
          </main>
        </div>

        <Navigation />

        {showModal && showPremiumModal && !hasAccess && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} />
        )}
      </div>
    );
  };
} 