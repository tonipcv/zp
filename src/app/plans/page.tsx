'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, LogOut, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ZAP_PRICE_IDS } from '@/lib/stripe-zap-prices';
import { toast } from '@/components/ui/use-toast';

export default function PlansPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch user plan information and redirect if trial is already activated
  useEffect(() => {
    if (session?.user?.id) {
      // Check if user already has trial activated from session
      if (session?.user?.trialActivated) {
        console.log('Trial already activated, redirecting to WhatsApp');
        router.push('/whatsapp');
        return;
      }

      // Double-check with latest data from API
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setUserPlan(data.plan || null);
          
          // Redirect if user has an active plan or trial
          if (data.plan || data.trialActivated) {
            console.log('User has active plan or trial, redirecting to WhatsApp');
            router.push('/whatsapp');
            return;
          }
          
          setIsLoaded(true);
        })
        .catch(err => {
          console.error('Error fetching user plan:', err);
          setIsLoaded(true);
        });
    }
  }, [session, router]);

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
  
  // Função simplificada para ativar o trial diretamente
  const activateTrial = async () => {
    console.log('activateTrial called');
    setIsLoading(true);
    
    try {
      console.log('Sending POST request to /api/user/activate-trial');
      const response = await fetch('/api/user/activate-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (!response.ok) {
        console.log('Error response from API:', data.error);
        
        // If the error is "Trial already activated", redirect to WhatsApp page instead of showing error
        if (data.error === "Trial already activated") {
          console.log('Trial already activated, redirecting to WhatsApp');
          
          // Show success toast instead of error
          toast({
            title: 'Redirecting to WhatsApp',
            description: 'Your trial is already active. Redirecting to WhatsApp...',
            variant: 'default'
          });
          
          // Use window.location for a hard redirect instead of router.push
          // This forces a full page reload which will refresh the token
          setTimeout(() => {
            window.location.href = '/whatsapp';
          }, 1500);
          
          return;
        }
        
        // For other errors, show the error toast
        toast({
          title: 'Error',
          description: data.error || 'Failed to activate free trial',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      
      // Refresh user plan information
      console.log('Refreshing user plan information after successful activation');
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setUserPlan(data.plan || null);
        })
        .catch(err => {
          console.error('Error fetching updated user plan:', err);
        });
      
      toast({
        title: 'Free Trial Activated!',
        description: 'You now have 200 message credits to use.',
        variant: 'default'
      });
      
      // Reset loading state before redirect
      setIsLoading(false);
      
      // Use window.location for a hard redirect instead of router.push
      // This forces a full page reload which will refresh the token
      console.log('Redirecting to WhatsApp page after successful activation');
      setTimeout(() => {
        window.location.href = '/whatsapp';
      }, 1500);
    } catch (error) {
      console.error('Error activating free trial:', error);
      toast({
        title: 'Error',
        description: 'Failed to activate free trial. Please try again.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };
  
  const handleGetStartedClick = () => {
    console.log('handleGetStartedClick called');
    console.log('Current user plan:', userPlan);
    
    // If user already has an active plan, redirect directly to WhatsApp page
    if (userPlan === 'free' || userPlan === 'basic' || userPlan === 'premium') {
      console.log('User already has an active plan, redirecting to WhatsApp');
      toast({
        title: 'Plan Already Active',
        description: `Your ${userPlan} plan is already active.`,
        variant: 'default'
      });
      
      // Redirect to WhatsApp page after a short delay to ensure toast is visible
      setTimeout(() => {
        router.push('/whatsapp');
      }, 1000);
      return;
    }
    
    // Show confirmation modal
    console.log('Setting showConfirmModal to true');
    setShowConfirmModal(true);
    console.log('showConfirmModal should now be true');
  };
  
  const handleActivateFreePlan = async () => {
    console.log('handleActivateFreePlan called');
    setShowConfirmModal(false); // Close modal when starting activation
    await activateTrial(); // Use the simplified function
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] text-[#333] dark:text-[#e1e1e1]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl mb-3">Choose your plan</h1>
          <p className="text-[#666] dark:text-[#999] max-w-lg mx-auto text-sm">
            Get access to WhatsApp automation and AI agents with our subscription plans
          </p>
          
          {showUpgradePrompt && (
            <div className="mt-6 p-4 border border-yellow-400/30 bg-yellow-400/10 rounded-lg max-w-lg mx-auto">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-yellow-400">You've used all your free credits</h3>
                  <p className="text-sm text-[#666] dark:text-[#999]">
                    Your 200 free message credits have been used. Upgrade to the Basic plan to get 2,000 message credits and continue using the service.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="border border-[#e1e1e1] dark:border-[#333] rounded-lg p-6 bg-white dark:bg-[#1f1f1f] transition-all hover:shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg mb-1">Free</h2>
              <p className="text-[#666] dark:text-[#999] text-xs mb-4">Try it out</p>
              <div className="flex items-baseline">
                <span className="text-2xl">$0</span>
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
                <span className="text-sm">200 message credits</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">Community support</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-[#000] hover:bg-[#333] text-white text-xs py-2 h-auto rounded flex items-center justify-center" 
              onClick={() => activateTrial()}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? 'Processing...' : 'Get Started (Direct)'}
            </button>
          </div>

          {/* Basic Plan */}
          <div className="border border-[#e1e1e1] dark:border-[#333] rounded-lg p-6 bg-white dark:bg-[#1f1f1f] transition-all hover:shadow-sm relative">
            <div className="absolute top-3 right-3">
              <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded-full">Popular</span>
            </div>
            <div className="mb-6">
              <h2 className="text-lg mb-1">Basic</h2>
              <p className="text-[#666] dark:text-[#999] text-xs mb-4">For professionals</p>
              <div className="flex items-baseline">
                <span className="text-2xl">$19</span>
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
                <span className="text-sm">2,000 message credits</span>
              </div>
              <div className="flex items-center">
                <Check className="h-3 w-3 text-[#666] dark:text-[#999] mr-2" />
                <span className="text-sm">Email support</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-[#000] hover:bg-[#333] text-white text-xs py-2 h-auto rounded flex items-center justify-center" 
              onClick={() => handleCheckout(ZAP_PRICE_IDS.BASIC.MONTHLY)}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? 'Processing...' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-[#666] dark:text-[#999] text-xs">Need more resources? Contact us for custom pricing.</p>
          

          
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              className="text-xs text-[#666] dark:text-[#999] hover:underline flex items-center"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-3 w-3 mr-1" />
              Sign out
            </button>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Activate Free Plan</h3>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-[#666] hover:text-[#333] dark:text-[#999] dark:hover:text-[#e1e1e1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-[#666] dark:text-[#999] text-sm mb-6">
              You're about to activate your free plan with 200 message credits. This will give you access to:
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">1 WhatsApp Instance</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">1 AI Agent</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">200 message credits</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Community support</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 text-xs py-2 h-auto border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded"
                disabled={isLoading}
                type="button"
              >
                Cancel
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Activate Free Plan button clicked');
                  handleActivateFreePlan();
                }}
                className="flex-1 bg-[#000] hover:bg-[#333] text-white text-xs py-2 h-auto rounded"
                disabled={isLoading}
                type="button"
              >
                {isLoading ? 'Activating...' : 'Activate Free Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
