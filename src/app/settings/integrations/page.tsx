"use client"
import Link from 'next/link'
import { AppLayout } from '@/components/AppSidebar'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Calendar } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConnectedNotice() {
  const params = useSearchParams()
  const connected = params?.get('connected') === '1'
  if (!connected) return null
  return (
    <div className="mb-6 flex items-center gap-2 text-green-400 text-xs">
      <CheckCircle2 className="h-4 w-4" />
      <span>Calendly connected successfully.</span>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-6 text-[#f5f5f7]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-base md:text-lg font-semibold mb-2">Integrations</h1>
          <p className="text-xs md:text-sm text-white/70 mb-6">Connect your tools to automate your workflow.</p>

          <Suspense fallback={null}>
            <ConnectedNotice />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border border-white/10 p-4 bg-[#161719]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-white/80" />
                <h2 className="text-sm font-medium">Calendly</h2>
              </div>
              <p className="text-xs text-white/60 mb-3">Connect your Calendly to create, update and cancel meetings programmatically.</p>
              <div className="flex gap-2">
                <Link href="/settings/integrations/calendly">
                  <Button size="sm" className="h-7 text-xs">Open</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
