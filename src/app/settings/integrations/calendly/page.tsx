import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/AppSidebar'
import CalendlyIntegrationClient from '@/components/integrations/CalendlyIntegrationClient'

export const metadata: Metadata = {
  title: 'Cxlus AI',
  description: 'Calendly Integration',
}

export default async function CalendlyIntegrationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout>
      <CalendlyIntegrationClient />
    </AppLayout>
  )
}
