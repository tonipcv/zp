'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, Calendar, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function CalendlyIntegrationClient() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<{
    connected: boolean
    user?: {
      name: string
      email: string
      schedulingUrl: string
      timezone: string
    }
    webhooksConfigured?: boolean
    error?: string
    message?: string
  }>({ connected: false })
  const [eventTypes, setEventTypes] = useState<any[]>([])
  const [loadingEventTypes, setLoadingEventTypes] = useState(false)
  const [setupWebhookLoading, setSetupWebhookLoading] = useState(false)
  const [disconnectLoading, setDisconnectLoading] = useState(false)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/calendly/status')
      const data = await res.json()
      setStatus(data)
    } catch (error) {
      console.error('Erro ao buscar status:', error)
      setStatus({ connected: false, error: 'Erro ao verificar conexão com Calendly' })
    } finally {
      setLoading(false)
    }
  }

  const fetchEventTypes = async () => {
    if (!status.connected) return
    setLoadingEventTypes(true)
    try {
      const res = await fetch('/api/calendly/event-types')
      const data = await res.json()
      setEventTypes(data.eventTypes || [])
    } catch (error) {
      console.error('Erro ao buscar tipos de evento:', error)
    } finally {
      setLoadingEventTypes(false)
    }
  }

  const setupWebhook = async () => {
    setSetupWebhookLoading(true)
    try {
      const res = await fetch('/api/calendly/webhooks/setup', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        await fetchStatus()
      } else {
        console.error('Erro ao configurar webhook:', data.error)
      }
    } catch (error) {
      console.error('Erro ao configurar webhook:', error)
    } finally {
      setSetupWebhookLoading(false)
    }
  }

  const disconnect = async () => {
    if (!confirm('Tem certeza que deseja desconectar sua conta do Calendly?')) return
    setDisconnectLoading(true)
    try {
      const res = await fetch('/api/calendly/disconnect', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        await fetchStatus()
        setEventTypes([])
      } else {
        console.error('Erro ao desconectar:', data.error)
      }
    } catch (error) {
      console.error('Erro ao desconectar:', error)
    } finally {
      setDisconnectLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  useEffect(() => {
    if (status.connected) fetchEventTypes()
  }, [status.connected])

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="mb-4">
          <h1 className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">
            Calendly Integration
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#f5f5f7]/80" />
          </div>
        ) : (
          <>
            <Card className="mb-4 bg-[#2a2b2d]/50 border-0 transition-all duration-200 rounded-md shadow-sm shadow-black/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-[#f5f5f7] tracking-[-0.03em]">Connection Status</CardTitle>
                  {status.connected ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                      <CheckCircle className="h-3 w-3 mr-1" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                      <XCircle className="h-3 w-3 mr-1" /> Disconnected
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {status.error && (
                  <Alert variant="destructive" className="mb-4 border-0 bg-[#2a2b2d]/60 text-[#f5f5f7] shadow-sm shadow-black/20">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="text-[#f5f5f7]/90">{status.error}</AlertDescription>
                  </Alert>
                )}

                {status.connected && status.message && (
                  <Alert className="mb-4 border-0 bg-[#1c1d20] text-[#f5f5f7] shadow-sm shadow-black/20">
                    <AlertDescription className="text-[#f5f5f7]/90">{status.message}</AlertDescription>
                  </Alert>
                )}

                {!status.connected && null}

                {status.connected && status.user && (
                  <div className="space-y-3 text-[#f5f5f7]/90">
                    <p className="text-xs">Account: <span className="text-[#f5f5f7]">{status.user.name} ({status.user.email})</span></p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#f5f5f7]/70">{status.user.timezone}</span>
                      {status.user.schedulingUrl && (
                        <Link href={status.user.schedulingUrl} target="_blank" className="text-[#9ecbff] hover:underline flex items-center">
                          Scheduling URL <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      {status.webhooksConfigured ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                          <CheckCircle className="h-3 w-3 mr-1" /> Webhooks configured
                        </Badge>
                      ) : (
                        <>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px]">
                            <XCircle className="h-3 w-3 mr-1" /> Webhooks not configured
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={setupWebhook}
                            disabled={setupWebhookLoading}
                            className="border-white/10 text-[#f5f5f7]/90 h-7 px-3"
                          >
                            {setupWebhookLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                            Setup
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                {status.connected ? (
                  <Button
                    variant="destructive"
                    onClick={disconnect}
                    disabled={disconnectLoading}
                  >
                    {disconnectLoading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    Disconnect Calendly
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => (window.location.href = '/api/calendly/oauth/start')}
                    className="bg-white/5 hover:bg-white/10 text-[#f5f5f7] text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Connect Calendly
                  </Button>
                )}

                {status.connected && (
                  <Button
                    variant="outline"
                    onClick={fetchStatus}
                    disabled={loading}
                    className="border-white/10 text-[#f5f5f7]/90"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Status
                  </Button>
                )}
              </CardFooter>
            </Card>

            {status.connected && (
              <Card className="bg-[#2a2b2d]/50 border-0 transition-all duration-200 rounded-md shadow-sm shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-sm text-[#f5f5f7] tracking-[-0.03em]">Event Types</CardTitle>
                </CardHeader>

                <CardContent>
                  {loadingEventTypes ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#f5f5f7]/80" />
                    </div>
                  ) : eventTypes.length > 0 ? (
                    <div className="space-y-3">
                      {eventTypes.map((eventType) => (
                        <div
                          key={eventType.uri}
                          className="p-4 bg-[#1c1d20] border-0 rounded-md shadow-sm shadow-black/20 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm text-[#f5f5f7] font-medium">{eventType.name}</p>
                            <p className="text-xs text-[#f5f5f7]/60">
                              {eventType.duration} minutes
                            </p>
                            {eventType.description && (
                              <p className="text-xs text-[#f5f5f7]/80 mt-1">{eventType.description}</p>
                            )}
                          </div>
                          <div>
                            <Link
                              href={eventType.schedulingUrl}
                              target="_blank"
                              className="text-xs text-[#9ecbff] hover:underline flex items-center"
                            >
                              View <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-[#f5f5f7]/60">
                      No event types found
                    </p>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={fetchEventTypes}
                    disabled={loadingEventTypes}
                    className="border-white/10 text-[#f5f5f7]/90"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loadingEventTypes ? 'animate-spin' : ''}`} />
                    Refresh Event Types
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
