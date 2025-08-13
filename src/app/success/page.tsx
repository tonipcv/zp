'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Success() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAssinar = () => {
    setIsSubmitting(true);
    // Redireciona para a página de assinatura
    router.push('/assinatura');
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-black-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <Image
              src="/ft-icone.png"
              alt="Logo da Empresa"
              width={100}
              height={50}
            />
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Parabéns, sua conta foi criada com sucesso!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Assine a tecnologia e comece lucrar hoje mesmo:
            </p>
            
            <button 
              onClick={handleAssinar}
              className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline transition duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Assinar tecnologia'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
