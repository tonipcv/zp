/**
 * Script para verificar e corrigir a estrutura das tabelas de API keys
 * 
 * Este script:
 * 1. Verifica se as tabelas api_keys e api_key_instances existem
 * 2. Verifica se as colunas necessárias existem com os tipos corretos
 * 3. Corrige problemas de nomenclatura entre camelCase e snake_case
 * 4. Verifica as relações e constraints
 */

const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
const { Client } = require('pg')

// Configuração esperada das tabelas
const expectedSchema = {
  api_keys: {
    columns: [
      { name: 'id', type: 'text', nullable: false },
      { name: 'user_id', type: 'text', nullable: false },
      { name: 'name', type: 'text', nullable: true },
      { name: 'key_hash', type: 'text', nullable: false },
      { name: 'salt', type: 'text', nullable: false },
      { name: 'status', type: 'text', nullable: false },
      { name: 'expires_at', type: 'timestamp with time zone', nullable: true },
      { name: 'ip_allowlist', type: 'text', nullable: true },
      { name: 'rate_limit_per_minute', type: 'integer', nullable: true },
      { name: 'last8', type: 'text', nullable: true },
      { name: 'last_used_at', type: 'timestamp with time zone', nullable: true },
      { name: 'created_at', type: 'timestamp with time zone', nullable: false },
      { name: 'updated_at', type: 'timestamp with time zone', nullable: false }
    ],
    constraints: [
      { name: 'api_keys_pkey', type: 'PRIMARY KEY', columns: ['id'] },
      { name: 'api_keys_user_fkey', type: 'FOREIGN KEY', columns: ['user_id'], references: { table: 'User', columns: ['id'] } }
    ],
    indexes: [
      { name: 'api_keys_keyhash_key', columns: ['key_hash'], unique: true },
      { name: 'api_keys_userid_idx', columns: ['user_id'], unique: false },
      { name: 'api_keys_status_idx', columns: ['status'], unique: false }
    ]
  },
  api_key_instances: {
    columns: [
      { name: 'id', type: 'text', nullable: false },
      { name: 'api_key_id', type: 'text', nullable: false },
      { name: 'instance_id', type: 'text', nullable: false },
      { name: 'created_at', type: 'timestamp with time zone', nullable: false }
    ],
    constraints: [
      { name: 'api_key_instances_pkey', type: 'PRIMARY KEY', columns: ['id'] },
      { name: 'api_key_instances_apikey_fkey', type: 'FOREIGN KEY', columns: ['api_key_id'], references: { table: 'api_keys', columns: ['id'] } },
      { name: 'api_key_instances_instance_fkey', type: 'FOREIGN KEY', columns: ['instance_id'], references: { table: 'whatsapp_instances', columns: ['id'] } }
    ],
    indexes: [
      { name: 'api_key_instances_unique_apikey_instance', columns: ['api_key_id', 'instance_id'], unique: true },
      { name: 'api_key_instances_apikeyid_idx', columns: ['api_key_id'], unique: false },
      { name: 'api_key_instances_instanceid_idx', columns: ['instance_id'], unique: false }
    ]
  }
}

// Mapeamento entre camelCase e snake_case
const columnMapping = {
  'userId': 'user_id',
  'keyHash': 'key_hash',
  'expiresAt': 'expires_at',
  'ipAllowlist': 'ip_allowlist',
  'rateLimitPerMinute': 'rate_limit_per_minute',
  'lastUsedAt': 'last_used_at',
  'createdAt': 'created_at',
  'updatedAt': 'updated_at',
  'apiKeyId': 'api_key_id',
  'instanceId': 'instance_id'
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('Conectado ao banco de dados.')

    // 1. Verificar se as tabelas existem
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('api_keys', 'api_key_instances')
    `)
    
    const existingTables = tablesResult.rows.map(row => row.table_name)
    console.log('Tabelas encontradas:', existingTables.join(', ') || 'nenhuma')

    if (existingTables.length < 2) {
      console.log('Algumas tabelas estão faltando. Executando script de migração...')
      const fs = require('fs')
      const sqlPath = path.resolve(process.cwd(), 'scripts/migrations/add-api-keys-tables.sql')
      const sql = fs.readFileSync(sqlPath, 'utf8')
      await client.query(sql)
      console.log('Script de migração executado.')
    }

    // 2. Verificar colunas das tabelas
    for (const tableName of Object.keys(expectedSchema)) {
      if (!existingTables.includes(tableName)) {
        console.log(`Tabela ${tableName} não encontrada. Pulando verificação de colunas.`)
        continue
      }

      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
      `, [tableName])

      const existingColumns = columnsResult.rows.map(row => ({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES'
      }))

      console.log(`\nTabela ${tableName} tem ${existingColumns.length} colunas:`)
      existingColumns.forEach(col => {
        console.log(`- ${col.name} (${col.type}, ${col.nullable ? 'nullable' : 'not null'})`)
      })

      // Verificar colunas faltantes ou com nomenclatura errada
      const expectedColumns = expectedSchema[tableName].columns
      const missingColumns = []
      const wrongCaseColumns = []

      for (const expected of expectedColumns) {
        const found = existingColumns.find(col => col.name === expected.name)
        if (!found) {
          // Verificar se existe com nomenclatura diferente (camelCase vs snake_case)
          const camelCaseName = Object.keys(columnMapping).find(key => columnMapping[key] === expected.name)
          const snakeCaseName = columnMapping[expected.name]
          
          const altFound = existingColumns.find(col => 
            (camelCaseName && col.name === camelCaseName) || 
            (snakeCaseName && col.name === snakeCaseName)
          )
          
          if (altFound) {
            wrongCaseColumns.push({
              current: altFound.name,
              expected: expected.name
            })
          } else {
            missingColumns.push(expected.name)
          }
        }
      }

      if (missingColumns.length) {
        console.log(`\nColunas faltantes em ${tableName}:`, missingColumns.join(', '))
      }

      if (wrongCaseColumns.length) {
        console.log(`\nColunas com nomenclatura diferente em ${tableName}:`)
        wrongCaseColumns.forEach(col => {
          console.log(`- ${col.current} (esperado: ${col.expected})`)
        })
        
        // Corrigir nomenclatura
        console.log('\nCorrigindo nomenclatura das colunas...')
        for (const col of wrongCaseColumns) {
          try {
            await client.query(`
              ALTER TABLE ${tableName} 
              RENAME COLUMN "${col.current}" TO "${col.expected}"
            `)
            console.log(`✓ Coluna ${col.current} renomeada para ${col.expected}`)
          } catch (e) {
            console.error(`✗ Erro ao renomear coluna ${col.current}:`, e.message)
          }
        }
      }
    }

    // 3. Verificar se o Prisma Client está atualizado
    console.log('\nVerificando se o Prisma Client está atualizado...')
    const { execSync } = require('child_process')
    try {
      console.log(execSync('npx prisma generate', { encoding: 'utf8' }))
      console.log('✓ Prisma Client atualizado com sucesso.')
    } catch (e) {
      console.error('✗ Erro ao atualizar o Prisma Client:', e.message)
    }

    console.log('\nVerificação concluída.')
  } catch (err) {
    console.error('Erro:', err)
  } finally {
    await client.end()
  }
}

main()
