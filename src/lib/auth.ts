import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
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
          trialActivated: user.trialActivated || false
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      console.log('NextAuth JWT - Initial token:', JSON.stringify(token));
      console.log('NextAuth JWT - User data:', JSON.stringify(user || 'No user'));
      
      if (user) {
        token.trialActivated = user.trialActivated;
        token.id = user.id;
        console.log('NextAuth JWT - Updated token with user data:', JSON.stringify(token));
      }
      
      // Fetch latest user data including credits for existing tokens
      if (token.id) {
        console.log('NextAuth JWT - Fetching latest user data for ID:', token.id);
        const userData = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { credits: true, maxCredits: true, trialActivated: true, trialStartDate: true, trialEndDate: true }
        });
        
        console.log('NextAuth JWT - User data from DB:', JSON.stringify(userData || 'No data'));
        
        if (userData) {
          token.credits = userData.credits;
          token.maxCredits = userData.maxCredits;
          token.trialActivated = userData.trialActivated;
          token.trialStartDate = userData.trialStartDate;
          token.trialEndDate = userData.trialEndDate;
          console.log('NextAuth JWT - Final token with credits and trial info:', JSON.stringify(token));
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.trialActivated = token.trialActivated as boolean;
        session.user.trialStartDate = token.trialStartDate as Date | null;
        session.user.trialEndDate = token.trialEndDate as Date | null;
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
        session.user.maxCredits = token.maxCredits as number;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
} 