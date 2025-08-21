/*
Generate API keys for all users, respecting existing keys.

Usage:
  node scripts/generate-api-keys-all.js [--force] [--add-missing-instances] [--rate 60] [--expires YYYY-MM-DD] [--ips ip1,ip2] [--name "Default Key"]

Behavior:
  - For each User:
    - Collect all WhatsAppInstance IDs owned by user.
    - If no instances, skip.
    - If there is an active ApiKey:
      - If --add-missing-instances: link missing instances to the existing key.
      - If --force: create a new key (leave the old one active) and link all instances to the new key.
      - Otherwise: skip user.
    - If no active key: create a new key and link all instances.

Output:
  - Prints per-user action and for created keys shows token (zap_<id>_<secret>) and last8.
  - IMPORTANT: Token is shown ONCE on creation. Store it securely.
*/

const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')

const prisma = new PrismaClient()

function parseArgs() {
  const args = { force: false, addMissing: false }
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i]
    if (k === '--force') args.force = true
    else if (k === '--add-missing-instances') args.addMissing = true
    else if (k === '--rate') args.rate = parseInt(argv[++i], 10)
    else if (k === '--expires') args.expires = argv[++i]
    else if (k === '--ips') args.ips = argv[++i]
    else if (k === '--name') args.name = argv[++i]
  }
  return args
}

function deriveHash(secret, salt) {
  const key = crypto.scryptSync(secret, salt, 32)
  return key.toString('hex')
}

function parseExpires(expires) {
  if (!expires) return null
  const d = new Date(expires)
  return isNaN(d.getTime()) ? null : d
}

function parseIps(ips) {
  if (!ips) return null
  const list = ips.split(',').map((s) => s.trim()).filter(Boolean)
  return list.length ? JSON.stringify(list) : null
}

async function ensureKeyForUser(user, instances, opts) {
  const userId = user.id
  const instanceIds = instances.map((i) => i.id)
  if (instanceIds.length === 0) {
    return { userId, action: 'skip:no_instances' }
  }

  // Find active key usando SQL direto para evitar problemas com o Prisma
  const existingResult = await prisma.$queryRaw`
    SELECT ak.*, array_agg(aki.instance_id) as instance_ids
    FROM api_keys ak
    LEFT JOIN api_key_instances aki ON aki.api_key_id = ak.id
    WHERE ak.user_id = ${userId} AND ak.status = 'active'
    GROUP BY ak.id
    ORDER BY ak.created_at ASC
    LIMIT 1
  `
  
  const existing = existingResult[0] || null
  if (existing) {
    existing.instances = (existing.instance_ids || []).filter(Boolean).map(id => ({ instanceId: id }))
  }

  if (existing && !opts.force) {
    // Optionally link missing instances
    const existingSet = new Set(existing.instances.map((x) => x.instanceId))
    const missing = instanceIds.filter((id) => !existingSet.has(id))
    if (missing.length && opts.addMissing) {
      await prisma.apiKeyInstance.createMany({
        data: missing.map((instanceId) => ({ apiKeyId: existing.id, instanceId })),
        skipDuplicates: true,
      })
      return { userId, action: 'updated:add_missing_instances', keyId: existing.id, added: missing }
    }
    return { userId, action: 'skip:active_key_exists', keyId: existing.id }
  }

  // Create new key usando SQL direto
  const secret = crypto.randomBytes(24).toString('base64url')
  const salt = crypto.randomBytes(16).toString('hex')
  const keyHash = deriveHash(secret, salt)
  const last8 = secret.slice(-8)
  const keyId = crypto.randomBytes(16).toString('hex') // Gerar ID único
  
  // Inserir na tabela api_keys
  await prisma.$executeRaw`
    INSERT INTO api_keys (
      id, user_id, name, key_hash, salt, status, expires_at, 
      ip_allowlist, rate_limit_per_minute, last8, created_at, updated_at
    ) VALUES (
      ${keyId}, ${userId}, ${opts.name || null}, ${keyHash}, ${salt}, 'active',
      ${parseExpires(opts.expires)}, ${parseIps(opts.ips)}, 
      ${Number.isFinite(opts.rate) ? opts.rate : null}, ${last8},
      now(), now()
    )
  `
  
  // Inserir relações na tabela api_key_instances
  for (const instanceId of instanceIds) {
    const instanceKeyId = crypto.randomBytes(16).toString('hex')
    await prisma.$executeRaw`
      INSERT INTO api_key_instances (id, api_key_id, instance_id, created_at)
      VALUES (${instanceKeyId}, ${keyId}, ${instanceId}, now())
      ON CONFLICT (api_key_id, instance_id) DO NOTHING
    `
  }

  const token = `zap_${keyId}_${secret}`
  return { userId, action: 'created', keyId: keyId, token, last8, instances: instanceIds }
}

async function main() {
  const opts = parseArgs()
  console.log('Starting bulk API key generation with options:', opts)

  const users = await prisma.user.findMany({ select: { id: true } })
  console.log(`Found ${users.length} users`)

  let created = 0, updated = 0, skipped = 0
  for (const user of users) {
    const instances = await prisma.whatsAppInstance.findMany({
      where: { userId: user.id },
      select: { id: true },
    })
    const res = await ensureKeyForUser(user, instances, opts)
    if (res.action === 'created') {
      created++
      console.log(`\n[CREATED] user=${res.userId} key=${res.keyId} instances=${res.instances.length}`)
      console.log('token:', res.token)
      console.log('last8:', res.last8)
    } else if (res.action === 'updated:add_missing_instances') {
      updated++
      console.log(`\n[UPDATED] user=${res.userId} key=${res.keyId} addedInstances=${res.added.length}`)
    } else {
      skipped++
      console.log(`[SKIP] user=${res.userId} reason=${res.action}${res.keyId ? ` key=${res.keyId}` : ''}`)
    }
  }

  console.log(`\nSummary: created=${created}, updated=${updated}, skipped=${skipped}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
