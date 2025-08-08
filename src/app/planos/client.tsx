'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';
import { StripeCheckout } from '@/components/StripeCheckout';

const plans = [
  {
    name: "Basic Plan",
    price: "$11",
    period: "month",
    popular: true,
    planType: "basic",
    features: [
      "1 WhatsApp instance",
      "1 AI agent",
      "100,000 included tokens",
      "Email support",
      "Basic dashboard",
    ],
  },
];

const additionalResources = [
  {
    name: "Additional Instance + Agent",
    price: "$8",
    period: "month",
    resourceType: "instance_agent",
    description: "Add a new WhatsApp instance with an AI agent",
  },
  {
    name: "Additional Tokens",
    price: "$0.20",
    per: "1,000 tokens",
    resourceType: "tokens",
    description: "For usage beyond the plan's included limit",
  },
];

interface PlanosClientProps {
  userId: string;
}

export function PlanosClient({ userId }: PlanosClientProps) {
  return (
    <div className="min-h-[100dvh] bg-[#1c1d20] pt-4 pb-8 px-2">
      <div className="container mx-auto pl-1 sm:pl-2 md:pl-4 lg:pl-8 max-w-[99%] sm:max-w-[97%] md:max-w-[95%] lg:max-w-[92%]">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#f5f5f7] tracking-[-0.03em] font-inter">
            Choose Your Plan
          </h1>
          <p className="text-[#f5f5f7]/70 text-sm mt-1">
            Start with the basic plan and add resources as needed
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
                
                <StripeCheckout
                  userId={userId}
                  planType={plan.planType}
                  buttonText="Subscribe"
                  className={`w-full h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-[#4a6bbd] hover:bg-[#5a7bcd] text-[#f5f5f7] shadow-lg' 
                      : 'bg-[#3a3b3d] border-[#4a4b4d]/30 hover:bg-[#4a4b4d] text-[#f5f5f7]'
                  }`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 mb-8">
          <h2 className="text-lg font-bold text-[#f5f5f7] tracking-[-0.03em] font-inter mb-4">
            Recursos Adicionais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalResources.map((resource, index) => (
              <Card 
                key={index} 
                className="bg-[#2a2b2d] border-[#3a3b3d]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-2xl"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#f5f5f7] tracking-[-0.03em] font-inter text-md flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#6de67d]" />
                    {resource.name}
                  </CardTitle>
                  <CardDescription className="text-[#f5f5f7]/70">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-[#f5f5f7]">{resource.price}</span>
                      <span className="text-[#f5f5f7]/70 text-sm">{resource.per ? ` por ${resource.per}` : `/${resource.period}`}</span>
                    </div>
                    
                    <StripeCheckout
                      userId={userId}
                      isAdditionalResource={true}
                      resourceType={resource.resourceType as 'instance_agent' | 'tokens'}
                      buttonText="Add"
                      className="bg-[#3a3b3d] border-[#4a4b4d]/30 hover:bg-[#4a4b4d] text-[#f5f5f7] h-9 rounded-xl text-sm font-medium transition-all duration-300"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <Check className="h-4 w-4 text-[#6de67d] flex-shrink-0" />
                  <span>Free updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6de67d] flex-shrink-0" />
                  <span>Technical support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6de67d] flex-shrink-0" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
