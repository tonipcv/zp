-- Migration: add-api-keys-tables
-- Safe to run multiple times (IF NOT EXISTS guards)

BEGIN;

-- api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT,
  keyHash TEXT NOT NULL,
  salt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | revoked
  expiresAt TIMESTAMPTZ,
  ipAllowlist TEXT,
  rateLimitPerMinute INTEGER,
  last8 TEXT,
  lastUsedAt TIMESTAMPTZ,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT api_keys_user_fkey FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Unique and indexes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'api_keys_keyhash_key'
  ) THEN
    CREATE UNIQUE INDEX api_keys_keyhash_key ON api_keys (keyHash);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'api_keys_userid_idx'
  ) THEN
    CREATE INDEX api_keys_userid_idx ON api_keys (userId);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'api_keys_status_idx'
  ) THEN
    CREATE INDEX api_keys_status_idx ON api_keys (status);
  END IF;
END $$;

-- api_key_instances table
CREATE TABLE IF NOT EXISTS api_key_instances (
  id TEXT PRIMARY KEY,
  apiKeyId TEXT NOT NULL,
  instanceId TEXT NOT NULL,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT api_key_instances_apikey_fkey FOREIGN KEY (apiKeyId) REFERENCES api_keys(id) ON DELETE CASCADE,
  CONSTRAINT api_key_instances_instance_fkey FOREIGN KEY (instanceId) REFERENCES whatsapp_instances(id) ON DELETE CASCADE
);

-- Unique and indexes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'api_key_instances_unique_apikey_instance'
  ) THEN
    CREATE UNIQUE INDEX api_key_instances_unique_apikey_instance ON api_key_instances (apiKeyId, instanceId);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'api_key_instances_apikeyid_idx'
  ) THEN
    CREATE INDEX api_key_instances_apikeyid_idx ON api_key_instances (apiKeyId);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'api_key_instances_instanceid_idx'
  ) THEN
    CREATE INDEX api_key_instances_instanceid_idx ON api_key_instances (instanceId);
  END IF;
END $$;

COMMIT;
