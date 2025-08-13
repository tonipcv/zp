import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface CreditsInfo {
  credits: number;
  maxCredits: number;
  trialActivated: boolean;
  trialActive: boolean;
  trialStartDate?: Date | null;
  trialEndDate?: Date | null;
}

interface UseCreditsReturn {
  credits: number;
  maxCredits: number;
  trialActivated: boolean;
  trialActive: boolean;
  trialStartDate?: Date | null;
  trialEndDate?: Date | null;
  loading: boolean;
  error: string | null;
  percentage: number;
  useCredits: (amount?: number) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
}

export function useCredits(): UseCreditsReturn {
  const { data: session } = useSession();
  const [creditsInfo, setCreditsInfo] = useState<CreditsInfo>({
    credits: 0,
    maxCredits: 0,
    trialActivated: false,
    trialActive: false,
    trialStartDate: null,
    trialEndDate: null
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/credits');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch credits: ${response.status}`);
      }
      
      const data = await response.json();
      setCreditsInfo({
        credits: data.credits,
        maxCredits: data.maxCredits,
        trialActivated: data.trialActivated || false,
        trialActive: data.trialActive || false,
        trialStartDate: data.trialStartDate || null,
        trialEndDate: data.trialEndDate || null
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      console.error('Error fetching credits:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const useCredits = useCallback(async (amount = 1): Promise<boolean> => {
    if (!session?.user) {
      setError('User not authenticated');
      return false;
    }

    try {
      const response = await fetch('/api/user/credits/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to use credits');
        return false;
      }

      // Update local state with new credits value
      setCreditsInfo(prev => ({
        ...prev,
        credits: data.credits
      }));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to use credits');
      console.error('Error using credits:', err);
      return false;
    }
  }, [session]);

  // Initial fetch
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Calculate percentage
  const percentage = creditsInfo.maxCredits > 0 
    ? Math.round((creditsInfo.credits / creditsInfo.maxCredits) * 100) 
    : 0;

  return {
    credits: creditsInfo.credits,
    maxCredits: creditsInfo.maxCredits,
    trialActivated: creditsInfo.trialActivated,
    trialActive: creditsInfo.trialActive,
    trialStartDate: creditsInfo.trialStartDate,
    trialEndDate: creditsInfo.trialEndDate,
    loading,
    error,
    percentage,
    useCredits,
    refreshCredits: fetchCredits
  };
}
