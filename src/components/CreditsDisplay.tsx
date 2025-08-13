'use client';

import { useCredits } from '@/hooks/useCredits';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface CreditsDisplayProps {
  variant?: 'compact' | 'full';
  showLabel?: boolean;
}

export function CreditsDisplay({ variant = 'compact', showLabel = true }: CreditsDisplayProps) {
  const { credits, maxCredits, loading, percentage } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-[#f5f5f7]/70" />
        <span className="text-sm text-[#f5f5f7]/70">Loading credits...</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {showLabel && <span className="text-sm text-[#f5f5f7]/70">Credits:</span>}
        <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#6de67d] border-[#4a4b4d]/30">
          {credits.toLocaleString()}
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        {showLabel && <span className="text-sm text-[#f5f5f7]/70">Message Credits:</span>}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#6de67d] border-[#4a4b4d]/30">
            {credits.toLocaleString()}
          </Badge>
          <span className="text-xs text-[#f5f5f7]/50">/ {maxCredits.toLocaleString()}</span>
        </div>
      </div>
      <Progress value={percentage} className="h-1.5 bg-[#3a3b3d]" />
      <p className="text-xs text-[#f5f5f7]/70 text-right">
        {percentage}% remaining
      </p>
    </div>
  );
}
