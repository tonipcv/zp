import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      trialActivated: boolean
      trialStartDate?: Date | null
      trialEndDate?: Date | null
      credits?: number
      maxCredits?: number
    }
  }

  interface User {
    id: string
    email: string
    name: string
    trialActivated: boolean
    trialStartDate?: Date | null
    trialEndDate?: Date | null
    credits?: number
    maxCredits?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    trialActivated?: boolean
    trialStartDate?: Date | null
    trialEndDate?: Date | null
    credits?: number
    maxCredits?: number
  }
} 