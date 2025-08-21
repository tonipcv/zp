# Integração com Calendly

Este documento descreve como utilizar a integração com o Calendly no sistema.

## Visão Geral

A integração com o Calendly permite que cada usuário conecte sua própria conta do Calendly via OAuth e permite que o agente de IA crie, cancele e modifique reuniões programaticamente.

## Configuração

### Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias:

```
CALENDLY_CLIENT_ID=seu_client_id
CALENDLY_CLIENT_SECRET=seu_client_secret
CALENDLY_REDIRECT_URI=https://seu-dominio.com/api/calendly/oauth/callback
CALENDLY_SIGNING_KEY=chave_para_assinar_webhooks
BASE_URL=https://seu-dominio.com
```

### Fluxo de Autenticação

1. O usuário acessa a página de integração em `/settings/integrations/calendly`
2. Clica em "Conectar com Calendly"
3. É redirecionado para a página de autorização do Calendly
4. Após autorizar, é redirecionado de volta para o sistema
5. O sistema salva os tokens de acesso e informações do usuário

### Configuração de Webhooks

Para receber notificações de eventos criados/cancelados, é necessário configurar webhooks:

1. Na página de integração, após conectar a conta, clique em "Configurar Webhooks"
2. O sistema irá criar uma assinatura de webhook no Calendly
3. Os eventos serão recebidos no endpoint `/api/calendly/webhook`

## Uso pelo Agente de IA

### Importação

```typescript
import { CalendlyService } from '@/lib/agent/calendly-service'
```

### Verificar se o Usuário tem Conexão Ativa

```typescript
const hasConnection = await CalendlyService.hasActiveConnection(userId)
if (!hasConnection) {
  // Informar ao usuário que ele precisa conectar sua conta Calendly
}
```

### Listar Tipos de Evento Disponíveis

```typescript
try {
  const eventTypes = await CalendlyService.getAvailableEventTypes(userId)
  // eventTypes = [{ name, description, duration, url, uri }]
} catch (error) {
  // Tratar erro
}
```

### Gerar Link de Agendamento

```typescript
try {
  const schedulingLink = await CalendlyService.getSchedulingLink(
    userId,
    eventTypeUri,
    { name: 'Nome do Convidado', email: 'email@exemplo.com' }
  )
  
  // Enviar link para o usuário
  // "Você pode agendar uma reunião aqui: {schedulingLink}"
} catch (error) {
  // Tratar erro
}
```

### Cancelar um Evento

```typescript
try {
  await CalendlyService.cancelEvent(
    userId,
    eventUri,
    'Cancelado a pedido do usuário'
  )
  
  // Informar ao usuário que o evento foi cancelado
} catch (error) {
  // Tratar erro
}
```

### Listar Próximos Eventos

```typescript
try {
  const events = await CalendlyService.getUpcomingEvents(userId)
  
  // Formatar e apresentar os eventos para o usuário
  const formattedEvents = events.map(event => {
    const date = new Date(event.startTime).toLocaleDateString()
    const time = new Date(event.startTime).toLocaleTimeString()
    return `${date} às ${time} com ${event.inviteeName}`
  })
  
  // "Seus próximos eventos são: {formattedEvents.join('\n')}"
} catch (error) {
  // Tratar erro
}
```

## Exemplos de Uso em Diálogos

### Exemplo 1: Oferecer Agendamento

```
Usuário: Preciso agendar uma reunião com você.

Agente: Posso ajudar com isso! Vou verificar os tipos de evento disponíveis.

[O agente busca os tipos de evento]

Agente: Encontrei os seguintes tipos de reunião disponíveis:
- Reunião de 30 minutos
- Reunião de 60 minutos
- Consulta inicial

Qual você prefere?

Usuário: A de 30 minutos.

Agente: Ótimo! Aqui está o link para agendar sua reunião de 30 minutos:
[Link de agendamento]

Você pode selecionar o horário que for mais conveniente para você.
```

### Exemplo 2: Cancelar Reunião

```
Usuário: Preciso cancelar a reunião que agendei para amanhã.

Agente: Vou verificar suas próximas reuniões.

[O agente busca os próximos eventos]

Agente: Encontrei uma reunião agendada para amanhã às 14:00. Deseja cancelar esta reunião?

Usuário: Sim, por favor.

Agente: Reunião cancelada com sucesso. Um e-mail de confirmação foi enviado para você.
```

## Solução de Problemas

### Tokens Expirados

Os tokens de acesso do Calendly expiram após um tempo. O sistema tenta renovar automaticamente usando o refresh token, mas se houver falha, o usuário precisará reconectar sua conta.

### Webhooks não Recebidos

Se os eventos não estiverem sendo recebidos:

1. Verifique se os webhooks estão configurados na página de integração
2. Verifique se a URL do webhook é acessível publicamente
3. Verifique os logs do servidor para erros de assinatura

## Limitações

- A API do Calendly não permite criar eventos diretamente, apenas gerar links de agendamento
- Algumas funcionalidades avançadas como reagendamento programático não estão disponíveis
- O usuário precisa ter uma conta Calendly válida (gratuita ou paga)
