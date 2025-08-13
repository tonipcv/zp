import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { ZAP_PRICE_IDS, ZAP_PLAN_LIMITS } from '@/lib/stripe-zap-prices';
import Stripe from 'stripe';

const relevantEvents = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'checkout.session.completed',
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      return new NextResponse('Missing signature or webhook secret', { status: 400 });
    }
    
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription;
          
          // Buscar o preço para determinar o tipo de plano
          const priceId = subscription.items.data[0].price.id;
          
          // Buscar o usuário pelo Stripe Customer ID
          const user = await prisma.user.findFirst({
            where: {
              stripeCustomerId: subscription.customer as string,
            },
          });

          if (!user) {
            throw new Error('User not found');
          }

          // Determinar o tipo de plano baseado no priceId
          const isBasicPlan = priceId === ZAP_PRICE_IDS.BASIC.MONTHLY;
          const isAdditionalResource = priceId === ZAP_PRICE_IDS.ADDITIONAL;
          
          // Salvar a assinatura no banco de dados
          await prisma.subscription.create({
            data: {
              userId: user.id,
              priceId: priceId,
              status: subscription.status,
              stripeId: subscription.id,
              currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
            },
          });

          // Atualizar status trial e limites do usuário
          if (isBasicPlan) {
            const now = new Date();
            const trialEndDate = new Date();
            trialEndDate.setDate(now.getDate() + 30); // 30-day subscription period
            
            await prisma.user.update({
              where: { id: user.id },
              data: {
                trialActivated: true,
                trialStartDate: now,
                trialEndDate: trialEndDate,
                freeTokensLimit: ZAP_PLAN_LIMITS.BASIC.tokens,
              },
            });
          }

          // Se for um recurso adicional (instância + agente), incrementar o limite
          if (isAdditionalResource) {
            // Obter a quantidade de instâncias adicionais
            const quantity = subscription.items.data[0].quantity || 1;
            
            // Buscar instâncias existentes
            const existingInstances = await prisma.whatsAppInstance.count({
              where: { userId: user.id },
            });
            
            // Atualizar o limite de instâncias (base + adicionais)
            const newLimit = ZAP_PLAN_LIMITS.BASIC.instances + quantity;
            
            console.log(`Atualizando limite de instâncias para ${newLimit} (usuário: ${user.id})`);
          }
          break;

        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as Stripe.Subscription;
          
          // Buscar o usuário pelo Stripe Customer ID
          const userToUpdate = await prisma.user.findFirst({
            where: {
              stripeCustomerId: deletedSubscription.customer as string,
            },
          });

          if (!userToUpdate) {
            throw new Error('User not found');
          }

          // Atualizar o status da assinatura no banco de dados
          await prisma.subscription.updateMany({
            where: { 
              stripeId: deletedSubscription.id,
              userId: userToUpdate.id 
            },
            data: {
              status: 'canceled',
            },
          });

          // Verificar se o usuário ainda tem alguma assinatura ativa
          const activeSubscriptions = await prisma.subscription.count({
            where: {
              userId: userToUpdate.id,
              status: 'active',
            },
          });

          // Se não houver mais assinaturas ativas, remover status trial
          if (activeSubscriptions === 0) {
            await prisma.user.update({
              where: { id: userToUpdate.id },
              data: {
                trialActivated: false,
                trialStartDate: null,
                trialEndDate: null,
                freeTokensLimit: 100000, // Resetar para o limite padrão
              },
            });
          }
          break;
          
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          
          // Verificar se é uma compra de recursos adicionais
          if (session.metadata?.resourceType) {
            const userId = session.metadata.userId;
            const resourceType = session.metadata.resourceType;
            const quantity = parseInt(session.metadata.quantity || '1');
            
            // Processar com base no tipo de recurso
            if (resourceType === 'instance_agent') {
              console.log(`Adicionando ${quantity} instância(s) + agente(s) para o usuário ${userId}`);
              // Aqui você pode implementar a lógica para incrementar o limite de instâncias
            } else if (resourceType === 'tokens') {
              console.log(`Adicionando ${quantity * 1000} tokens para o usuário ${userId}`);
              
              // Adicionar tokens ao limite do usuário
              const user = await prisma.user.findUnique({
                where: { id: userId },
              });
              
              if (user) {
                await prisma.user.update({
                  where: { id: userId },
                  data: {
                    freeTokensLimit: user.freeTokensLimit + (quantity * 1000),
                  },
                });
              }
            }
          }
          break;
      }

      return new NextResponse(JSON.stringify({ received: true }));
    } catch (error) {
      console.error('Webhook error:', error);
      return new NextResponse('Webhook handler failed', { status: 500 });
    }
  }

  return new NextResponse(JSON.stringify({ received: true }));
}
