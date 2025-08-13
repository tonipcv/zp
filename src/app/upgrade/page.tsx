"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Check, LogOut } from "lucide-react";
import { ZAP_PRICE_IDS } from "@/lib/stripe-zap-prices";

export default function UpgradePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout failed:", data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] text-[#333] dark:text-[#e1e1e1]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl mb-3">Upgrade your plan</h1>
          <p className="text-[#666] dark:text-[#999] max-w-lg mx-auto text-sm">
            Unlock more instances, agents and message credits by upgrading your plan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Current (Free) Plan Summary */}
          <div className="border border-[#e1e1e1] dark:border-[#333] rounded-lg p-6 bg-white dark:bg-[#1f1f1f]">
            <div className="mb-6">
              <h2 className="text-lg mb-1">Free</h2>
              <p className="text-[#666] dark:text-[#999] text-xs mb-4">Your current plan</p>
              <div className="flex items-baseline">
                <span className="text-2xl">$0</span>
                <span className="text-[#666] dark:text-[#999] text-xs ml-1">/month</span>
              </div>
            </div>
            <div className="space-y-2 mb-2">
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
            </div>
          </div>

          {/* Upgrade Option */}
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
            <Button
              className="w-full bg-[#000] hover:bg-[#333] text-white text-xs py-2 h-auto"
              onClick={() => handleCheckout(ZAP_PRICE_IDS.BASIC.MONTHLY)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Subscribe"}
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-[#666] dark:text-[#999] text-xs">Need more resources? Contact us for custom pricing.</p>
          <div className="mt-6 flex justify-center">
            <button
              className="text-xs text-[#666] dark:text-[#999] hover:underline flex items-center"
              onClick={() => router.push("/profile")}
              type="button"
            >
              Back to profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
