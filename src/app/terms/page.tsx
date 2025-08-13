'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Terms() {
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
        <h1 className="text-3xl font-bold mb-6 text-center">Termos de Serviço</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-4">
            Ao acessar e usar a plataforma Futuros Tech, você concorda com estes termos de serviço e todas as leis e regulamentos aplicáveis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Descrição do Serviço</h2>
          <p className="mb-4">
            A Futuros Tech é uma plataforma educacional focada em criptomoedas que oferece:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Conteúdo educacional sobre criptomoedas</li>
            <li>Análises de mercado</li>
            <li>Sinais de trading</li>
            <li>Material didático especializado</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Responsabilidades do Usuário</h2>
          <p className="mb-4">Os usuários devem:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Fornecer informações precisas e atualizadas</li>
            <li>Manter a confidencialidade de sua conta</li>
            <li>Não compartilhar conteúdo protegido</li>
            <li>Usar a plataforma de forma ética e legal</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Riscos e Isenções</h2>
          <p className="mb-4">
            O mercado de criptomoedas é volátil e de alto risco. Todo o conteúdo fornecido é apenas educacional e não constitui aconselhamento financeiro. Os usuários são responsáveis por suas próprias decisões de investimento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Propriedade Intelectual</h2>
          <p className="mb-4">
            Todo o conteúdo disponibilizado na plataforma é protegido por direitos autorais e não pode ser reproduzido sem autorização expressa.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Cancelamento e Reembolso</h2>
          <p className="mb-4">
            Detalhes sobre políticas de cancelamento e reembolso estão disponíveis em nossa seção de suporte ao cliente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Modificações dos Termos</h2>
          <p className="mb-4">
            Reservamo-nos o direito de modificar estes termos a qualquer momento, notificando os usuários sobre mudanças significativas.
          </p>
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