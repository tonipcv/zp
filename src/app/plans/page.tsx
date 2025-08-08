'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ZAP_PRICE_IDS } from '@/lib/stripe-zap-prices';

export default function PlansPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] text-[#333] dark:text-[#e1e1e1]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl mb-3">Choose your plan</h1>
          <p className="text-[#666] dark:text-[#999] max-w-lg mx-auto text-sm">
            Get access to WhatsApp automation and AI agents with our subscription plans
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Basic Plan */}
          <div className="border border-[#e1e1e1] dark:border-[#333] rounded-lg p-6 bg-white dark:bg-[#1f1f1f] transition-all hover:shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg mb-1">Basic</h2>
              <p className="text-[#666] dark:text-[#999] text-xs mb-4">Perfect for getting started</p>
              <div className="flex items-baseline">
                <span className="text-2xl">$11</span>
                <span className="text-[#666] dark:text-[#999] text-xs ml-1">/month</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">1 WhatsApp Instance</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">1 AI Agent</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">100,000 tokens included</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">Email support</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-[#000] hover:bg-[#333] text-white text-xs py-2 h-auto rounded" 
              onClick={() => handleCheckout(ZAP_PRICE_IDS.BASIC.MONTHLY)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Subscribe'}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="border border-[#e1e1e1] dark:border-[#333] rounded-lg p-6 bg-white dark:bg-[#1f1f1f] transition-all hover:shadow-sm relative">
            <div className="absolute top-3 right-3">
              <div className="text-xs text-[#666] dark:text-[#999] border border-[#e1e1e1] dark:border-[#444] rounded-full px-2 py-0.5">
                Popular
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg mb-1">Premium</h2>
              <p className="text-[#666] dark:text-[#999] text-xs mb-4">For growing businesses</p>
              <div className="flex items-baseline">
                <span className="text-2xl">$27</span>
                <span className="text-[#666] dark:text-[#999] text-xs ml-1">/month</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">3 WhatsApp Instances</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">3 AI Agents</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">300,000 tokens included</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-[#000] hover:bg-[#333] text-white text-xs py-2 h-auto rounded" 
              onClick={() => handleCheckout(ZAP_PRICE_IDS.ADDITIONAL)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Subscribe'}
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-[#666] dark:text-[#999] text-xs">Need more resources? Contact us for custom pricing.</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              className="text-xs text-[#666] dark:text-[#999] hover:underline flex items-center"
              onClick={() => router.push('/profile')}
            >
              Back to profile
            </button>
            
            <button 
              className="text-xs text-[#666] dark:text-[#999] hover:underline flex items-center"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="h-3 w-3 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
