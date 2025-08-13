'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { AppLayout } from '@/components/AppSidebar';

interface TrialStatus {
  trialActivated: boolean;
  trialActive: boolean;
  trialExpired: boolean;
  trialStartDate: string | null;
  trialEndDate: string | null;
  credits: number;
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
      return;
    }

    // Check trial status for authenticated users
    const checkTrialStatus = async () => {
      try {
        const response = await fetch('/api/user/trial-status');
        if (!response.ok) {
          throw new Error('Failed to fetch trial status');
        }
        
        const trialStatus: TrialStatus = await response.json();
        
        if (trialStatus.trialActive) {
          // User has an active trial - redirect to WhatsApp with trial limitations
          router.push('/whatsapp');
        } else if (!trialStatus.trialActivated) {
          // User hasn't activated a trial yet - redirect to plans page
          router.push('/plans');
        } else {
          // Trial has expired or other cases - redirect to plans page
          router.push('/plans');
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
        // Default to WhatsApp page on error
        router.push('/whatsapp');
      } finally {
        setIsChecking(false);
      }
    };

    checkTrialStatus();
  }, [router, session, status]);

  // Show loading while redirecting
  return (
    <AppLayout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    </AppLayout>
  );
}
