'use client';

import { useState, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VerificationCode() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join('');
    console.log('Código de verificação:', verificationCode);
    router.push('/change-password');
  };

  return (
    <div className="container mx-auto px-4 p-60">
      <div className="flex justify-center mb-8">
        <Image
          src="/ft-icone.png"
          alt="Logo da Empresa"
          width={100}
          height={50}
        />
      </div>
      
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Digite o código de verificação</h2>
        <p className="text-center text-white mb-6">
          Um código de 6 dígitos foi enviado para o seu e-mail.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-2xl font-bold text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <div className="mb-6 text-center">
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-gray-700 bg-green-300 rounded-full hover:bg-green-400 focus:outline-none focus:shadow-outline"
            >
              Verificar
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-white hover:text-green-300 pt-7">Não recebeu o código? Reenviar</a>
        </div>
      </div>
    </div>
  );
}
