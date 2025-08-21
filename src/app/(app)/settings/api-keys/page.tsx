"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { AppLayout } from '@/components/AppSidebar'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogTrigger } from '@/components/ui/dialog'

type ApiKey = {
  id: string
  name: string | null
  status: string
  expiresAt: string | null
  last8: string | null
  lastUsedAt: string | null
  createdAt: string
  instances: string[]
}

export default function ApiKeysPage() {
  const { data: session, status } = useSession()
  const [userId, setUserId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [instances, setInstances] = useState<{ id: string; instanceName: string }[]>([])
  const [open, setOpen] = useState(false)

  // Create form state
  const [name, setName] = useState<string>("")
  const [selectedInstances, setSelectedInstances] = useState<string[]>([])
  const [expiresAt, setExpiresAt] = useState<string>("")
  const [ips, setIps] = useState<string>("")
  const [rate, setRate] = useState<string>("")

  const [oneTimeToken, setOneTimeToken] = useState<string>("")
  const [oneTimeLast8, setOneTimeLast8] = useState<string>("")

  const canLoad = useMemo(() => userId.trim().length > 0, [userId])

  async function apiGet(path: string) {
    const res = await fetch(path, { headers: { 'x-user-id': userId } })
    if (!res.ok) throw new Error(`Erro ${res.status}`)
    return res.json()
  }

  async function apiPost(path: string, body: any) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j?.error || `Erro ${res.status}`)
    }
    return res.json()
  }

  async function loadAll() {
    if (!canLoad) return
    setLoading(true)
    setError("")
    try {
      const [k, i] = await Promise.all([
        apiGet('/api/my/api-keys'),
        apiGet('/api/my/api-keys/instances'),
      ])
      setKeys(k.items || [])
      setInstances((i.items || []).map((r: any) => ({ id: r.id, instanceName: r.instanceName || r.id })))
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  function toggleInstance(id: string) {
    setSelectedInstances((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function createKey(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setOneTimeToken("")
    setOneTimeLast8("")
    try {
      const ipAllowlist = ips
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const payload: any = {
        name: name || null,
        instanceIds: selectedInstances,
        expiresAt: expiresAt || null,
        ipAllowlist: ipAllowlist.length ? ipAllowlist : undefined,
        rateLimitPerMinute: rate ? Number(rate) : undefined,
      }
      const res = await apiPost('/api/my/api-keys', payload)
      setOneTimeToken(res.token)
      setOneTimeLast8(res.last8)
      // refresh
      setName("")
      setSelectedInstances([])
      setExpiresAt("")
      setIps("")
      setRate("")
      await loadAll()
      setOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Erro ao criar chave')
    }
  }

  async function revokeKey(id: string) {
    setError("")
    try {
      await apiPost('/api/my/api-keys/revoke', { id })
      await loadAll()
    } catch (e: any) {
      setError(e?.message || 'Erro ao revogar chave')
    }
  }

  async function rotateKey(id: string) {
    setError("")
    setOneTimeToken("")
    setOneTimeLast8("")
    try {
      const res = await apiPost('/api/my/api-keys/rotate', { id, revokeOld: true })
      setOneTimeToken(res.token)
      setOneTimeLast8(res.last8)
      await loadAll()
    } catch (e: any) {
      setError(e?.message || 'Erro ao rotacionar chave')
    }
  }

  useEffect(() => {
    setKeys([])
    setInstances([])
    setOneTimeToken("")
    setOneTimeLast8("")
    if (canLoad) loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Preencher automaticamente o userId pela sessão quando logado
  useEffect(() => {
    if (status === 'authenticated') {
      const sid = (session?.user as any)?.id || ''
      if (sid && sid !== userId) {
        setUserId(sid)
        return
      }
      // Fallback: buscar via /api/user/profile quando a sessão não contém id
      if (!sid) {
        ;(async () => {
          try {
            const res = await fetch('/api/user/profile')
            if (res.ok) {
              const p = await res.json()
              if (p?.id && p.id !== userId) {
                setUserId(p.id)
              }
            }
          } catch {}
        })()
      }
    }
  }, [status, session, userId])

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-6 text-[#f5f5f7]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-base md:text-lg font-semibold">API Keys</h1>
              <p className="text-xs md:text-sm text-white/70">Crie, gerencie, rotacione e revogue suas chaves de API.</p>
            </div>
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 text-xs" disabled={!canLoad}>
                    Criar chave
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#161719] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Criar nova chave</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Defina nome, escopo por instância e políticas de segurança.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={createKey} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-1 text-white/80">Nome</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-md px-3 py-2 w-full bg-[#0f1012] border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20" />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-1 text-white/80">Expira em (YYYY-MM-DD)</label>
                        <input value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="rounded-md px-3 py-2 w-full bg-[#0f1012] border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20" />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-1 text-white/80">IPs permitidos (separados por vírgula)</label>
                        <input value={ips} onChange={(e) => setIps(e.target.value)} className="rounded-md px-3 py-2 w-full bg-[#0f1012] border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20" />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium mb-1 text-white/80">Rate limit por minuto</label>
                        <input value={rate} onChange={(e) => setRate(e.target.value)} className="rounded-md px-3 py-2 w-full bg-[#0f1012] border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-medium mb-2 text-white">Selecione as instâncias</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-auto rounded-md border border-white/10 p-2 bg-[#0f1012]">
                        {instances.map((inst) => (
                          <label key={inst.id} className="flex items-center gap-2 text-xs md:text-sm text-white/90">
                            <input
                              type="checkbox"
                              checked={selectedInstances.includes(inst.id)}
                              onChange={() => toggleInstance(inst.id)}
                            />
                            <span>{inst.instanceName} <span className="text-white/50">({inst.id})</span></span>
                          </label>
                        ))}
                        {instances.length === 0 && <div className="text-xs md:text-sm text-white/60">Nenhuma instância encontrada.</div>}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" size="sm" className="h-8 text-xs" disabled={!canLoad || selectedInstances.length === 0}>
                        Criar chave
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quando autenticado, usamos o ID da sessão automaticamente e ocultamos o campo */}
          {status !== 'authenticated' && (
            <div className="mb-6 rounded-md border border-white/10 bg-[#161719] p-4">
              <label className="block text-xs md:text-sm font-medium mb-1 text-white/80">User ID</label>
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Digite o ID do usuário"
                className="rounded-md px-3 py-2 w-full bg-[#0f1012] border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
              <p className="text-[11px] text-white/50 mt-1">Temporário: este valor vai no header x-user-id nas requisições.</p>
              <button
                onClick={loadAll}
                disabled={!canLoad || loading}
                className="mt-3 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs disabled:opacity-50"
              >{loading ? 'Carregando...' : 'Carregar'}</button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-md border border-red-500/20 bg-red-500/10 text-red-300 text-xs">{error}</div>
          )}

          {/* One-time token box */}
          {oneTimeToken && (
            <div className="mb-6 rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="text-sm font-medium mb-2 text-white">Token gerado (exibido uma única vez):</div>
              <code className="block break-all p-2 rounded-md bg-[#0f1012] border border-white/10 text-white/90">{oneTimeToken}</code>
              <div className="text-xs text-white/70 mt-1">last8: {oneTimeLast8}</div>
            </div>
          )}


          {/* Listagem */}
          <div className="rounded-md border border-white/10 bg-[#161719] p-4">
            <h2 className="text-sm font-medium mb-3 text-white">Minhas chaves</h2>
            {keys.length === 0 ? (
              <div className="text-xs md:text-sm text-white/60">Nenhuma chave encontrada.</div>
            ) : (
              <div className="space-y-3">
                {keys.map((k) => (
                  <div key={k.id} className="rounded-md border border-white/10 bg-[#0f1012] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{k.name || '(sem nome)'} <span className="text-white/40 text-[10px]">{k.id}</span></div>
                        <div className="text-xs text-white/70">Status: <span className={k.status === 'active' ? 'text-green-400' : 'text-red-400'}>{k.status}</span></div>
                        <div className="text-xs text-white/70">last8: {k.last8 || '-'}</div>
                        <div className="text-xs text-white/70">expiresAt: {k.expiresAt || '-'}</div>
                        <div className="text-xs text-white/70">lastUsedAt: {k.lastUsedAt || '-'}</div>
                        <div className="text-xs text-white/70">createdAt: {k.createdAt}</div>
                        <div className="text-xs text-white/70 mt-1">Escopo: {k.instances?.length || 0} instância(s)</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => rotateKey(k.id)}
                          className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs disabled:opacity-50"
                          disabled={k.status !== 'active'}
                        >Rotacionar</button>
                        <button
                          onClick={() => revokeKey(k.id)}
                          className="px-3 py-2 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs disabled:opacity-50"
                          disabled={k.status !== 'active'}
                        >Revogar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
