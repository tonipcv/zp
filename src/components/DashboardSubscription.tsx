import React, { useEffect, useState } from 'react';
import { SubscriptionStatus } from './SubscriptionStatus';
import { SubscriptionTier } from '@/lib/subscription-manager';
import { Loader2 } from 'lucide-react';

export function DashboardSubscription() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<{
    tier: SubscriptionTier;
    resources: {
      instances: {
        used: number;
        limit: number;
      };
      agents: {
        used: number;
        limit: number;
      };
      tokens: {
        used: number;
        limit: number;
      };
    };
    expiresAt: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/subscription');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription data');
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setSubscriptionData(data);
      } catch (err: any) {
        console.error('Error fetching subscription data:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Error: {error}</p>
        <p className="text-sm text-red-600 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">No subscription data available</p>
      </div>
    );
  }

  return (
    <SubscriptionStatus 
      tier={subscriptionData.tier}
      resources={subscriptionData.resources}
      expiresAt={subscriptionData.expiresAt ? new Date(subscriptionData.expiresAt) : undefined}
    />
  );
}
