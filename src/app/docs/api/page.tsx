"use client";

import React from "react";
import { AppLayout } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

export default function ApiDocsPage() {
  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-6 text-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">WhatsApp API</h1>
            <p className="text-sm text-white/60 mt-1">
              Endpoints REST para gerenciar instâncias do WhatsApp, QR Code, status, mensagens e sincronização.
            </p>
          </header>

          <section className="mb-8">
            <h2 className="text-base md:text-lg font-medium">Visão Geral</h2>
            <p className="text-sm text-white/70 mt-2">
              API RESTful em JSON. Requisições devem ser feitas sobre HTTPS.
            </p>
            <ul className="list-disc pl-5 mt-3 text-sm text-white/70 space-y-1">
              <li><span className="text-white/90">Base URL:</span> {process.env.NEXT_PUBLIC_APP_URL || "https://seu-dominio"}</li>
              <li><span className="text-white/90">Formato:</span> application/json</li>
              <li><span className="text-white/90">Autenticação:</span> sessão do usuário (NextAuth). Faça as chamadas autenticado pela aplicação (cookies de sessão).</li>
            </ul>
          </section>

          <Separator className="my-6 bg-white/10" />
          <section className="mb-8">
            <h2 className="text-base md:text-lg font-medium">Autenticação</h2>
            <p className="text-sm text-white/70 mt-2">
              A maioria dos endpoints requer usuário logado (NextAuth). No cURL, inclua o cookie de sessão.
            </p>
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-white/50 mb-2">Exemplo (cURL)</p>
              <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs">
{`curl -X GET \
  "$BASE_URL/api/whatsapp/instances" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<SESSAO>"`}
              </pre>
            </div>
          </section>

          <Separator className="my-6 bg-white/10" />

          <section className="mb-8">
            <h2 className="text-base md:text-lg font-medium">Endpoints: WhatsApp</h2>
            <div className="space-y-6 mt-3">
              <div>
                <h3 className="text-sm font-medium">Listar instâncias</h3>
                <p className="text-sm text-white/70">GET <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances', { credentials: 'include' })\n  .then(r => r.json())\n  .then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Criar instância</h3>
                <p className="text-sm text-white/70">POST <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  credentials: 'include',\n  body: JSON.stringify({ instanceName: 'minha-instancia' })\n}).then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Detalhes da instância</h3>
                <p className="text-sm text-white/70">GET <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>', { credentials: 'include' })\n  .then(r => r.json())\n  .then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Excluir instância</h3>
                <p className="text-sm text-white/70">DELETE <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>', { method: 'DELETE', credentials: 'include' })\n  .then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">QR Code</h3>
                <p className="text-sm text-white/70">GET <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/qrcode</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/qrcode', { credentials: 'include' })\n  .then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Status da conexão</h3>
                <p className="text-sm text-white/70">GET <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/status</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/status', { credentials: 'include' })\n  .then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Enviar mensagem de texto</h3>
                <p className="text-sm text-white/70">POST <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/messages</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/messages', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  credentials: 'include',\n  body: JSON.stringify({ number: '5511999999999', text: 'Olá!' })\n}).then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Reiniciar/Recriar instância</h3>
                <p className="text-sm text-white/70">POST <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/restart</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/restart', { method: 'POST', credentials: 'include' })\n  .then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Configurar webhook da instância</h3>
                <p className="text-sm text-white/70">POST <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/webhook</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/webhook', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  credentials: 'include',\n  body: JSON.stringify({ url: 'https://seu-dominio.com/api/ai-agent/webhook' })\n}).then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Dados (contatos/chats/mensagens)</h3>
                <p className="text-sm text-white/70">GET <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/data?type=contacts|chats|messages</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/data?type=contacts&limit=20&page=1', { credentials: 'include' })\n  .then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Sincronizar (full/contacts/chats/messages)</h3>
                <p className="text-sm text-white/70">POST <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/sync</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/sync', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  credentials: 'include',\n  body: JSON.stringify({ type: 'full', mode: 'batch', batchSize: 50 })\n}).then(r => r.json()).then(console.log)`}</pre>
              </div>

              <div>
                <h3 className="text-sm font-medium">Sincronizar status</h3>
                <p className="text-sm text-white/70">POST <code className="bg-white/10 px-1 rounded">/api/whatsapp/instances/[instanceId]/sync-status</code></p>
                <pre className="bg-[#0f1012] border border-white/10 rounded-md p-3 overflow-x-auto text-xs mt-2">{`fetch('/api/whatsapp/instances/<ID>/sync-status', { method: 'POST', credentials: 'include' })\n  .then(r => r.json()).then(console.log)`}</pre>
              </div>
            </div>
          </section>

          <Separator className="my-6 bg-white/10" />

          <section className="mb-12">
            <h2 className="text-base md:text-lg font-medium">Erros comuns</h2>
            <ul className="list-disc pl-5 mt-3 text-sm text-white/70 space-y-2">
              <li><span className="text-white/90">401 Não autorizado:</span> faça login antes de chamar os endpoints.</li>
              <li><span className="text-white/90">403 Limite de plano:</span> plano Free permite apenas 1 instância.</li>
              <li><span className="text-white/90">409 Nome de instância em uso:</span> escolha outro nome (a API pode sugerir um).</li>
              <li><span className="text-white/90">404 Não encontrado:</span> verifique o <code className="bg-white/10 px-1 rounded">[instanceId]</code>.</li>
            </ul>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}
