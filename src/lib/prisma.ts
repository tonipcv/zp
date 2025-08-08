import { PrismaClient } from '@prisma/client'

// Evita múltiplas instâncias do Prisma Client em desenvolvimento
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Verifica se estamos no lado do servidor
const isServer = typeof window === 'undefined'

// Só inicializa o Prisma no lado do servidor
const prisma = isServer ? (globalThis.prisma ?? prismaClientSingleton()) : (null as any)

// Mantém a instância do Prisma em desenvolvimento para hot-reloading
if (process.env.NODE_ENV !== 'production' && isServer) {
  globalThis.prisma = prisma
}

export { prisma }

// Teste a conexão apenas no lado do servidor durante inicialização
if (isServer) {
  // Opcional: Você pode descomentar isso para testar a conexão durante a inicialização
  // prisma.$connect()
  //   .then(() => console.log('Conectado ao banco de dados'))
  //   .catch((error) => console.error('Erro ao conectar ao banco de dados:', error))
}