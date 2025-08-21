/**
 * Script para corrigir a nomenclatura das colunas nas tabelas de API keys
 * Converte de camelCase para snake_case para compatibilidade com o Prisma
 */

const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
const { Client } = require('pg')

// Mapeamento de colunas camelCase para snake_case
const columnMappings = {
  'api_keys': {
    'userid': 'user_id',
    'keyhash': 'key_hash',
    'expiresat': 'expires_at',
    'ipallowlist': 'ip_allowlist',
    'ratelimitperminute': 'rate_limit_per_minute',
    'lastusedat': 'last_used_at',
    'createdat': 'created_at',
    'updatedat': 'updated_at'
  },
  'api_key_instances': {
    'apikeyid': 'api_key_id',
    'instanceid': 'instance_id',
    'createdat': 'created_at'
  }
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('Conectado ao banco de dados.')

    // Verificar se as tabelas existem
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('api_keys', 'api_key_instances')
    `)
    
    const existingTables = tablesResult.rows.map(row => row.table_name)
    if (existingTables.length === 0) {
      console.error('Tabelas api_keys e api_key_instances não encontradas.')
      return
    }

    console.log('Tabelas encontradas:', existingTables.join(', '))

    // Iniciar transação
    await client.query('BEGIN')

    // Processar cada tabela
    for (const tableName of existingTables) {
      console.log(`\nProcessando tabela ${tableName}...`)
      
      // Obter colunas atuais
      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
      `, [tableName])
      
      const existingColumns = columnsResult.rows.map(row => row.column_name)
      console.log(`Colunas atuais: ${existingColumns.join(', ')}`)
      
      // Verificar e renomear colunas
      const mappings = columnMappings[tableName] || {}
      for (const [oldName, newName] of Object.entries(mappings)) {
        if (existingColumns.includes(oldName)) {
          try {
            console.log(`Renomeando coluna ${oldName} para ${newName}...`)
            await client.query(`
              ALTER TABLE ${tableName} 
              RENAME COLUMN "${oldName}" TO "${newName}"
            `)
            console.log(`✓ Coluna ${oldName} renomeada para ${newName}`)
          } catch (e) {
            console.error(`✗ Erro ao renomear coluna ${oldName}:`, e.message)
            // Rollback em caso de erro
            await client.query('ROLLBACK')
            return
          }
        } else if (existingColumns.includes(newName)) {
          console.log(`✓ Coluna ${newName} já existe com o nome correto`)
        } else {
          console.log(`! Coluna ${oldName} não encontrada`)
        }
      }
    }

    // Commit das alterações
    await client.query('COMMIT')
    console.log('\n✅ Todas as colunas foram renomeadas com sucesso!')

    // Atualizar o Prisma Client
    console.log('\nAtualizando o Prisma Client...')
    const { execSync } = require('child_process')
    try {
      console.log(execSync('npx prisma generate', { encoding: 'utf8' }))
      console.log('✓ Prisma Client atualizado com sucesso.')
    } catch (e) {
      console.error('✗ Erro ao atualizar o Prisma Client:', e.message)
    }

  } catch (err) {
    console.error('Erro:', err)
    // Garantir rollback em caso de erro
    try {
      await client.query('ROLLBACK')
    } catch (e) {}
  } finally {
    await client.end()
  }
}

main()
