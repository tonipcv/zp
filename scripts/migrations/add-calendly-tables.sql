-- Migração para adicionar tabelas do Calendly

-- Tabela de conexões do Calendly
CREATE TABLE IF NOT EXISTS "calendly_connections" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "ownerUri" TEXT NOT NULL,
  "ownerEmail" TEXT,
  "organizationUri" TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "refreshToken" TEXT,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "calendly_connections_pkey" PRIMARY KEY ("id")
);

-- Tabela de assinaturas de webhook
CREATE TABLE IF NOT EXISTS "calendly_webhook_subscriptions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "subscriptionUri" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "events" TEXT NOT NULL,
  "signingKey" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "calendly_webhook_subscriptions_pkey" PRIMARY KEY ("id")
);

-- Tabela de eventos do Calendly
CREATE TABLE IF NOT EXISTS "calendly_events" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "eventUri" TEXT NOT NULL,
  "eventTypeUri" TEXT,
  "inviteeEmail" TEXT,
  "inviteeName" TEXT,
  "startTime" TIMESTAMP(3),
  "endTime" TIMESTAMP(3),
  "timezone" TEXT,
  "status" TEXT NOT NULL DEFAULT 'scheduled',
  "payload" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "calendly_events_pkey" PRIMARY KEY ("id")
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS "calendly_connections_userId_key" ON "calendly_connections"("userId");
CREATE INDEX IF NOT EXISTS "calendly_connections_ownerUri_idx" ON "calendly_connections"("ownerUri");
CREATE INDEX IF NOT EXISTS "calendly_connections_organizationUri_idx" ON "calendly_connections"("organizationUri");

CREATE UNIQUE INDEX IF NOT EXISTS "calendly_webhook_subscriptions_subscriptionUri_key" ON "calendly_webhook_subscriptions"("subscriptionUri");
CREATE INDEX IF NOT EXISTS "calendly_webhook_subscriptions_userId_idx" ON "calendly_webhook_subscriptions"("userId");

CREATE UNIQUE INDEX IF NOT EXISTS "calendly_events_eventUri_key" ON "calendly_events"("eventUri");
CREATE INDEX IF NOT EXISTS "calendly_events_userId_idx" ON "calendly_events"("userId");
CREATE INDEX IF NOT EXISTS "calendly_events_startTime_idx" ON "calendly_events"("startTime");

-- Chaves estrangeiras
ALTER TABLE "calendly_connections" ADD CONSTRAINT "calendly_connections_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "calendly_webhook_subscriptions" ADD CONSTRAINT "calendly_webhook_subscriptions_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "calendly_events" ADD CONSTRAINT "calendly_events_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
