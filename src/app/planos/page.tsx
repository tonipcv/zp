'use client';

import { AppLayout } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Basic Plan",
    price: "$29",
    period: "month",
    popular: false,
    features: [
      "Up to 3 WhatsApp instances",
      "1 AI agent per instance",
      "Email support",
      "Basic dashboard",
    ],
  },
  {
    name: "Pro Plan",
    price: "$79",
    period: "month",
    popular: true,
    features: [
      "Up to 10 WhatsApp instances",
      "Unlimited AI agents",
      "Advanced knowledge base",
      "Priority support",
      "Advanced analytics",
      "Custom webhooks",
    ],
  },
  {
    name: "Enterprise Plan",
    price: "$199",
    period: "month",
    popular: false,
    features: [
      "Unlimited instances",
      "Unlimited AI agents",
      "Full API access",
      "24/7 support",
      "Customizations",
      "Dedicated onboarding",
    ],
  },
];

export default function PlanosPage() {
  return (
    <AppLayout>
      <div className="min-h-[100dvh] bg-[#1c1d20] pt-4 pb-8 px-2">
        <div className="container mx-auto pl-1 sm:pl-2 md:pl-4 lg:pl-8 max-w-[99%] sm:max-w-[97%] md:max-w-[95%] lg:max-w-[92%]">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-lg sm:text-base md:text-lg font-bold text-[#f5f5f7] tracking-[-0.03em] font-inter">
              Plans & Pricing
            </h1>
            <p className="text-xs sm:text-xs md:text-xs text-[#f5f5f7]/70 tracking-[-0.03em] font-inter">
              Choose the ideal plan for your needs
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-[#2a2b2d] border-[#3a3b3d]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-2xl relative ${
                  plan.popular ? 'ring-2 ring-[#4a6bbd]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#4a6bbd] text-[#f5f5f7] px-3 py-1 text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-[#f5f5f7] tracking-[-0.03em] font-inter text-lg">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-[#f5f5f7]">{plan.price}</span>
                    <span className="text-[#f5f5f7]/70 text-sm">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-[#f5f5f7]/90">
                        <Check className="h-4 w-4 text-[#6de67d] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-[#4a6bbd] hover:bg-[#5a7bcd] text-[#f5f5f7] shadow-lg' 
                        : 'bg-[#3a3b3d] border-[#4a4b4d]/30 hover:bg-[#4a4b4d] text-[#f5f5f7]'
                    }`}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <Card className="bg-[#2a2b2d] border-[#3a3b3d]/30 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#f5f5f7] mb-2 tracking-[-0.03em] font-inter">
                  All plans include:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#f5f5f7]/90">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#6de67d]" />
                    <span>7-day guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#6de67d]" />
                    <span>Free updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#6de67d]" />
                    <span>Complete documentation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 