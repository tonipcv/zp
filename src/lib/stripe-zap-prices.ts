// After running /api/setup-stripe-products-zap,
// replace these IDs with those generated in Stripe

export const ZAP_PRICE_IDS = {
  BASIC: {
    MONTHLY: 'price_1RtbivCodiLHkuBGyNaEKFx8', // Basic plan monthly subscription
  },
  ADDITIONAL: 'price_1RtbiwCodiLHkuBGF2is9BDU', // Additional instance + agent
  EXTRA_TOKENS: 'price_1RtbixCodiLHkuBGbOY2haxz', // Extra tokens per 1,000
};

// Limites associados a cada plano
export const ZAP_PLAN_LIMITS = {
  BASIC: {
    instances: 1,
    agents: 1,
    tokens: 100000,
  },
  // Você pode adicionar mais planos aqui no futuro
};

// Preço por recursos adicionais
export const ZAP_ADDITIONAL_RESOURCES = {
  instanceAndAgent: 8, // $8 por instância + agente adicional
  tokensPerThousand: 0.2, // $0.20 por 1.000 tokens adicionais
};
