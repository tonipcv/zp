# Enviar uma mensagem pelo WhatsApp (Passo a passo)

Este guia mostra, de ponta a ponta, como enviar uma mensagem de texto usando uma instância do WhatsApp da aplicação.

- Base URL: use a URL da sua aplicação (por exemplo, `https://seu-dominio`).
- Autenticação: todos os endpoints requerem que você esteja logado (NextAuth). Em cURL, inclua o cookie de sessão.

## 1) Criar uma instância

Endpoint:
- Método: POST
- URL: `/api/whatsapp/instances`

Payload mínimo:
```json
{
  "instanceName": "minha-instancia"
}
```

cURL:
```bash
curl -X POST \
  "$BASE_URL/api/whatsapp/instances" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<SESSAO>" \
  -d '{"instanceName":"minha-instancia"}'
```

fetch:
```js
fetch('/api/whatsapp/instances', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ instanceName: 'minha-instancia' })
}).then(r => r.json()).then(console.log)
```

Resposta esperada inclui o `id` da instância criada. Guarde esse `instanceId` ou utilize a listagem abaixo para localizar a instância correta.

Observações:
- Se o nome já existir, a API retorna 409 com uma sugestão.
- O plano Free permite apenas 1 instância.

## 2) Listar instâncias e escolher a correta

Use este passo para obter o `instanceId` da instância correta pelo nome ou pelo número conectado.

Endpoint:
- Método: GET
- URL: `/api/whatsapp/instances`

cURL:
```bash
curl -X GET \
  "$BASE_URL/api/whatsapp/instances" \
  -H "Cookie: next-auth.session-token=<SESSAO>"
```

fetch (filtrando por nome):
```js
const name = 'minha-instancia';
const instancias = await fetch('/api/whatsapp/instances', { credentials: 'include' }).then(r => r.json());
const escolhida = (instancias?.instances || instancias)?.find((i) => i.instanceName === name);
// pegue o ID correto
const instanceId = escolhida?.id;
```

fetch (filtrando por número conectado):
```js
const numeroComDDI = '5511999999999';
const instancias = await fetch('/api/whatsapp/instances', { credentials: 'include' }).then(r => r.json());
const escolhida = (instancias?.instances || instancias)?.find((i) => i.connectedNumber === numeroComDDI);
const instanceId = escolhida?.id;
```

fetch (preferindo conectadas):
```js
const instancias = await fetch('/api/whatsapp/instances', { credentials: 'include' }).then(r => r.json());
const lista = (instancias?.instances || instancias) || [];
const escolhida = lista.find(i => i.status === 'CONNECTED') || lista[0];
const instanceId = escolhida?.id;
```

Se `instanceId` estiver indefinido, verifique o nome/número e tente novamente.

## 3) Conectar a instância (ler QR Code)

Com a instância criada, gere o QR Code para autenticar no WhatsApp.

Endpoint:
- Método: GET
- URL: `/api/whatsapp/instances/[instanceId]/qrcode`

cURL:
```bash
curl -X GET \
  "$BASE_URL/api/whatsapp/instances/<INSTANCE_ID>/qrcode" \
  -H "Cookie: next-auth.session-token=<SESSAO>"
```

fetch:
```js
fetch(`/api/whatsapp/instances/${instanceId}/qrcode`, {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

Escaneie o QR Code com o app do WhatsApp do seu celular. Após conectar, prossiga.

## 4) Verificar status da conexão

Endpoint:
- Método: GET
- URL: `/api/whatsapp/instances/[instanceId]/status`

cURL:
```bash
curl -X GET \
  "$BASE_URL/api/whatsapp/instances/<INSTANCE_ID>/status" \
  -H "Cookie: next-auth.session-token=<SESSAO>"
```

fetch:
```js
fetch(`/api/whatsapp/instances/${instanceId}/status`, { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

Você deve ver algo como `CONNECTED` quando a sessão estiver ativa.

## 5) Enviar uma mensagem de texto

Endpoint:
- Método: POST
- URL: `/api/whatsapp/instances/[instanceId]/messages`

Payload:
```json
{
  "number": "5511999999999",
  "text": "Olá!"
}
```

Regras importantes para `number`:
- Use DDI + DDD + número, apenas dígitos. Ex: Brasil (55) + DDD 11 + número → `5511XXXXXXXX`.

cURL:
```bash
curl -X POST \
  "$BASE_URL/api/whatsapp/instances/<INSTANCE_ID>/messages" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<SESSAO>" \
  -d '{"number":"5511999999999","text":"Olá!"}'
```

fetch:
```js
fetch(`/api/whatsapp/instances/${instanceId}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ number: '5511999999999', text: 'Olá!' })
}).then(r => r.json()).then(console.log)
```

Se tudo estiver correto, você receberá uma resposta de sucesso e a mensagem será enviada para o número informado.

## (Opcional) Sincronizar dados e status

- Sincronizar dados (contatos/chats/mensagens):
  - POST `/api/whatsapp/instances/[instanceId]/sync`
  - Ex.: `{ "type": "full", "mode": "batch", "batchSize": 50 }`

- Sincronizar status (reconciliar com Evolution API):
  - POST `/api/whatsapp/instances/[instanceId]/sync-status`

## Erros comuns

- 401 Não autorizado: faça login antes de chamar os endpoints (cookies de sessão necessários).
- 403 Limite de plano: o plano Free permite somente 1 instância.
- 404 Instância não encontrada: cheque o `instanceId`.
- 409 Nome de instância em uso: escolha outro nome (a API pode sugerir um).
- Número inválido: envie o telefone com DDI + DDD + número apenas com dígitos.

## Dicas

- Se a conexão cair, utilize `POST /api/whatsapp/instances/[instanceId]/restart` para reiniciar/recriar a instância na Evolution API.
- Você pode configurar o webhook da instância via `POST /api/whatsapp/instances/[instanceId]/webhook` com `{ "url": "https://seu-dominio.com/api/ai-agent/webhook" }`.
- Em ambientes locais, garanta que sua aplicação esteja acessível publicamente (ex.: usando ngrok) para que os webhooks funcionem.
