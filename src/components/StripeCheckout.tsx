'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';

// Implementação simples de toast para evitar dependências externas
const useToast = () => {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`);
      // Aqui você pode implementar uma notificação visual se necessário
      alert(`${title}\n${description}`);
    }
  };
};

// Certifique-se de substituir pela sua chave pública do Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  userId: string;
  planType?: string;
  buttonText?: string;
  className?: string;
  isAdditionalResource?: boolean;
  resourceType?: 'instance_agent' | 'tokens';
  quantity?: number;
}

export function StripeCheckout({
  userId,
  planType = 'basic',
  buttonText = 'Assinar Plano',
  className = '',
  isAdditionalResource = false,
  resourceType,
  quantity = 1,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = () => {
    setIsLoading(true);

    // Determinar qual endpoint usar com base no tipo de recurso
    const endpoint = isAdditionalResource
      ? '/api/add-resources'
      : '/api/create-zap-checkout';

    // Preparar os dados para a requisição
    const data = isAdditionalResource
      ? { userId, resourceType, quantity }
      : { userId, planType };

    // Usar promises em vez de async/await
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(({ sessionId, error }) => {
        if (error) {
          throw new Error(error);
        }
        
        return stripePromise.then(stripe => {
          if (!stripe) throw new Error('Falha ao carregar Stripe');
          
          return stripe.redirectToCheckout({
            sessionId,
          });
        });
      })
      .then(({ error: stripeError }) => {
        if (stripeError) {
          throw new Error(stripeError.message || 'Erro ao redirecionar para o checkout');
        }
      })
      .catch(error => {
        console.error('Erro no checkout:', error);
        toast({
          title: 'Erro no checkout',
          description: error.message || 'Ocorreu um erro ao processar o pagamento',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Processando...' : buttonText}
    </Button>
  );
}
