'use client';

import { useState } from 'react';

export default function SetupStripePage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/setup-stripe-products', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao configurar produtos no Stripe');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuração do Stripe
          </h1>
          <p className="mt-2 text-gray-600">
            Clique no botão abaixo para criar os produtos e preços no Stripe
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="w-full bg-rose-600 text-white rounded-md py-3 px-4 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Configurando...' : 'Configurar Stripe'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuração concluída!
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">IDs gerados:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.prices, null, 2)}
                </pre>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Copie esses IDs e atualize o arquivo{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  src/app/api/create-checkout-session/route.ts
                </code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 