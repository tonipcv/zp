'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <Image
          src="/ft-icone.png"
          alt="Logo da Empresa"
          width={100}
          height={50}
        />
      </div>

      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Política de Privacidade</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introdução</h2>
          <p className="mb-4">
            A Futuros Tech está comprometida em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Coleta de Informações</h2>
          <p className="mb-4">Coletamos as seguintes informações:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Informações de registro (nome, e-mail)</li>
            <li>Dados de uso da plataforma</li>
            <li>Informações de pagamento (processadas de forma segura)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Uso das Informações</h2>
          <p className="mb-4">Utilizamos suas informações para:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Fornecer acesso aos nossos serviços educacionais</li>
            <li>Melhorar nossa plataforma</li>
            <li>Enviar atualizações sobre o mercado de criptomoedas</li>
            <li>Comunicar sobre mudanças em nossos serviços</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Proteção de Dados</h2>
          <p className="mb-4">
            Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Compartilhamento de Dados</h2>
          <p className="mb-4">
            Não vendemos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Seus Direitos</h2>
          <p className="mb-4">Você tem o direito de:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir informações imprecisas</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Optar por não receber comunicações de marketing</li>
          </ul>
        </section>

        <div className="text-center mt-8">
          <Link href="/" className="text-green-300 hover:text-green-400">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
} 