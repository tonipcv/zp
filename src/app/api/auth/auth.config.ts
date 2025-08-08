import { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        verificationCode: { label: 'Verification Code', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.verificationCode) {
          throw new Error('Credenciais inválidas')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          throw new Error('Usuário não encontrado')
        }

        // Verificar o código de verificação
        const verificationRecord = await prisma.loginVerificationCode.findFirst({
          where: {
            email: credentials.email,
            code: credentials.verificationCode,
            expiresAt: {
              gt: new Date() // Código não expirado
            }
          }
        })

        if (!verificationRecord) {
          throw new Error('Código de verificação inválido ou expirado')
        }
        
        // Marcar o código como verificado
        await prisma.loginVerificationCode.update({
          where: { id: verificationRecord.id },
          data: { verified: true }
        })

        const isCorrectPassword = await compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Senha incorreta')
        }

        return {
          id: user.id,
          name: user.name || "",
          email: user.email,
          image: user.image,
          isPremium: user.isPremium || false
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isPremium = user.isPremium;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isPremium = token.isPremium as boolean;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
} 