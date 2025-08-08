import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SubscriptionTier } from '@/lib/subscription-manager';

interface ResourceUsageProps {
  used: number;
  limit: number;
  label: string;
}

const ResourceUsage = ({ used, limit, label }: ResourceUsageProps) => {
  const percentage = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0;
  const isUnlimited = limit === Number.MAX_SAFE_INTEGER;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {isUnlimited ? (
            <span className="text-green-600">Unlimited</span>
          ) : (
            `${used} / ${limit}`
          )}
        </span>
      </div>
      {isUnlimited ? (
        <Progress value={20} className="h-2 bg-green-100" />
      ) : (
        <Progress value={percentage} className={`h-2 ${percentage > 90 ? 'bg-red-100' : 'bg-slate-100'}`} />
      )}
    </div>
  );
};

interface SubscriptionStatusProps {
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
  expiresAt?: Date;
}

export function SubscriptionStatus({ tier, resources, expiresAt }: SubscriptionStatusProps) {
  const tierLabels = {
    [SubscriptionTier.FREE]: 'Free',
    [SubscriptionTier.PREMIUM]: 'Premium',
    [SubscriptionTier.UNLIMITED]: 'Unlimited'
  };
  
  const tierColors = {
    [SubscriptionTier.FREE]: 'bg-slate-100 text-slate-800',
    [SubscriptionTier.PREMIUM]: 'bg-blue-100 text-blue-800',
    [SubscriptionTier.UNLIMITED]: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Subscription Status</CardTitle>
          <Badge className={tierColors[tier]}>{tierLabels[tier]}</Badge>
        </div>
        <CardDescription>
          {tier === SubscriptionTier.FREE && 'Basic access with limited resources'}
          {tier === SubscriptionTier.PREMIUM && 'Standard subscription with premium features'}
          {tier === SubscriptionTier.UNLIMITED && 'Full access to all features and resources'}
          
          {expiresAt && tier === SubscriptionTier.PREMIUM && (
            <div className="mt-2">
              Renews on {expiresAt.toLocaleDateString()}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResourceUsage 
          used={resources.instances.used} 
          limit={resources.instances.limit} 
          label="WhatsApp Instances" 
        />
        <ResourceUsage 
          used={resources.agents.used} 
          limit={resources.agents.limit} 
          label="AI Agents" 
        />
        <ResourceUsage 
          used={resources.tokens.used} 
          limit={resources.tokens.limit} 
          label="Tokens" 
        />
      </CardContent>
      {tier === SubscriptionTier.FREE && (
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Upgrade to Premium for more resources and features
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
