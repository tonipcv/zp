'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Smartphone, QrCode, Trash2, RefreshCw, MessageSquare, Send, Eye, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { CreateInstanceDialog } from './CreateInstanceDialog';
import { QRCodeDialog } from './QRCodeDialog';
import { SendMessageDialog } from './SendMessageDialog';
import { WhatsAppSyncDialog } from './WhatsAppSyncDialog';
import { WhatsAppDataViewer } from './WhatsAppDataViewer';
import { toast } from 'sonner';

interface WhatsAppInstance {
  id: string;
  instanceName: string;
  status: string;
  connectedNumber?: string;
  lastConnectedAt?: string;
  lastDisconnectedAt?: string;
  reconnectAttempts: number;
  qrCode?: string;
  webhookEnabled: boolean;
  webhookUrl?: string;
  _count: {
    messages: number;
  };
}

export function WhatsAppInstances() {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [dataViewerOpen, setDataViewerOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<WhatsAppInstance | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<{[key: string]: any}>({});
  const [planType, setPlanType] = useState<'free' | 'trial' | 'premium' | 'enterprise' | 'unlimited' | string>('free');
  const [instanceLimit, setInstanceLimit] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

  // URL correta do webhook
  const CORRECT_WEBHOOK_URL = 'https://zp-bay.vercel.app/api/ai-agent/webhook';

  useEffect(() => {
    loadInstances();
    loadProfileLimits();
  }, []);

  const loadProfileLimits = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        const limit = data?.instances?.limit ?? 1;
        const type = data?.plan?.type ?? 'free';
        const name = data?.user?.name ?? '';
        const trialEnd = data?.trialEndDate ?? data?.plan?.trialEndDate ?? null;
        setInstanceLimit(typeof limit === 'number' ? limit : 1);
        setPlanType(type);
        if (typeof name === 'string') setUserName(name);
        if (trialEnd) {
          const end = new Date(trialEnd);
          const now = new Date();
          const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          setTrialDaysLeft(diff > 0 ? diff : 0);
        } else {
          // Fallback if API doesn't return trial end
          setTrialDaysLeft(7);
        }
      }
    } catch (e) {
      console.warn('Não foi possível carregar limites do perfil, usando padrão 1:', e);
      setInstanceLimit(1);
      setPlanType('free');
      setTrialDaysLeft(7);
    }
  };

  const loadInstances = async () => {
    try {
      const response = await fetch('/api/whatsapp/instances');
      if (!response.ok) throw new Error('Erro ao carregar instâncias');
      
      const data = await response.json();
      setInstances(data.instances);
    } catch (error) {
      console.error('Erro ao carregar instâncias:', error);
      toast.error('Erro ao carregar instâncias');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstance = async (data: {
    instanceName?: string;
    sessionToken?: string;
    webhookUrl?: string;
    autoReconnect?: boolean;
  }) => {
    try {
      const response = await fetch('/api/whatsapp/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar instância');
      }

      const result = await response.json();
      toast.success('Instância criada com sucesso!');
      setCreateDialogOpen(false);
      
      // Se tem QR Code, abrir dialog do QR
      if (result.instance.qrCode) {
        setSelectedInstance(result.instance);
        setQrDialogOpen(true);
      }
      
      loadInstances();
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar instância');
    }
  };

  const handleShowQRCode = async (instance: WhatsAppInstance) => {
    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/qrcode`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao obter QR Code');
      }

      const data = await response.json();
      setSelectedInstance({ ...instance, qrCode: data.qrCode });
      setQrDialogOpen(true);
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao obter QR Code');
    }
  };

  const handleCheckStatus = async (instance: WhatsAppInstance) => {
    try {
      // Usar o novo endpoint de sincronização
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/sync-status`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao sincronizar status');
      }

      const result = await response.json();
      toast.success(`Status sincronizado: ${result.data.status}`);
      loadInstances(); // Recarregar para atualizar status
    } catch (error) {
      console.error('Erro ao sincronizar status:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao sincronizar status');
    }
  };

  const handleRestart = async (instance: WhatsAppInstance) => {
    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/restart`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao reiniciar instância');
      }

      const result = await response.json();
      toast.success('Instância reiniciada com sucesso!');
      loadInstances(); // Recarregar para atualizar status
    } catch (error) {
      console.error('Erro ao reiniciar instância:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao reiniciar instância');
    }
  };

  const handleDeleteInstance = async (instance: WhatsAppInstance) => {
    if (!confirm(`Tem certeza que deseja deletar a instância "${instance.instanceName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar instância');
      }

      toast.success('Instância deletada com sucesso!');
      loadInstances();
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar instância');
    }
  };

  const handleSendMessage = (instance: WhatsAppInstance) => {
    setSelectedInstance(instance);
    setMessageDialogOpen(true);
  };

  const handleSync = (instance: WhatsAppInstance) => {
    setSelectedInstance(instance);
    setSyncDialogOpen(true);
  };

  const handleViewData = (instance: WhatsAppInstance) => {
    setSelectedInstance(instance);
    setDataViewerOpen(true);
  };

  const handleConfigureWebhook = async (instance: WhatsAppInstance) => {
    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: CORRECT_WEBHOOK_URL,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao configurar webhook');
      }

      const result = await response.json();
      toast.success('Webhook configurado com sucesso!');
      loadInstances(); // Recarregar para atualizar status
      checkAllWebhooks(); // Verificar webhooks novamente
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao configurar webhook');
    }
  };

  /**
   * Verificar status dos webhooks de todas as instâncias
   */
  const checkAllWebhooks = async () => {
    try {
      const response = await fetch('/api/whatsapp/webhooks/check-all', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setWebhookStatus(data.webhooks || {});
      }
    } catch (error) {
      console.error('Erro ao verificar webhooks:', error);
    }
  };

  /**
   * Corrigir webhook de uma instância específica
   */
  const fixWebhook = async (instanceName: string) => {
    try {
      // Encontrar a instância pelo nome para obter o ID
      const instance = instances.find(inst => inst.instanceName === instanceName);
      if (!instance) {
        toast.error(`Instância ${instanceName} não encontrada`);
        return;
      }

      const response = await fetch(`/api/whatsapp/instances/${instance.id}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: CORRECT_WEBHOOK_URL,
        }),
      });

      if (response.ok) {
        toast.success(`Webhook configurado para ${instanceName}!`);
        // Atualizar status local
        setWebhookStatus(prev => ({
          ...prev,
          [instanceName]: {
            ...prev[instanceName],
            isCorrect: true,
            url: CORRECT_WEBHOOK_URL,
          }
        }));
        // Recarregar instâncias
        loadInstances();
      } else {
        const errorData = await response.json();
        toast.error(`Erro ao configurar webhook: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      toast.error('Erro ao configurar webhook');
    }
  };

  // Verificar webhooks automaticamente ao carregar
  useEffect(() => {
    if (instances.length > 0) {
      checkAllWebhooks();
    }
  }, [instances]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-[#10b981]';
      case 'CONNECTING': return 'bg-[#8b5cf6]';
      case 'DISCONNECTED': return 'bg-[#a78bfa]';
      default: return 'bg-[#c4b5fd]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'Conectado';
      case 'CONNECTING': return 'Conectando';
      case 'DISCONNECTED': return 'Desconectado';
      case 'CREATED': return 'Criado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5f5f7]/60"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Trial Banner */}
      {planType === 'trial' && (
        <div className="mb-3 rounded-md border border-white/10 bg-[#2a2b2d]/60 px-3 py-2 text-xs text-[#f5f5f7] tracking-[-0.02em]">
          <span className="opacity-90">
            {`Hello${userName ? ` ${userName}` : ''}, you’re on the Free Trial. You can use 1 agent, 1 WhatsApp connection, and 200 credits`}
            {typeof trialDaysLeft === 'number' ? ` within ${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'}.` : '.'}
          </span>
        </div>
      )}
      {/* Action Button */}
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              const canCreate = instances.length < instanceLimit;
              if (!canCreate) {
                toast.info('Plan limit reached: you cannot create more instances.');
                return;
              }
              setCreateDialogOpen(true);
            }}
            className="h-9 w-9 p-0 bg-[#2a2b2d] border-0 transition-all duration-200 rounded-md text-[#f5f5f7] hover:bg-[#2a2b2d]/80"
            title="New Instance"
            disabled={instances.length >= instanceLimit}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Instances Grid */}
      {instances.length === 0 ? (
        <Card className="bg-[#2a2b2d]/50 border-0 transition-all duration-200 rounded-md">
          <CardContent className="p-4 text-center">
            <Smartphone className="h-6 w-6 text-[#f5f5f7]/60 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-[#f5f5f7] mb-2 tracking-[-0.03em]">
              No instances yet
            </h3>
            <p className="text-[#f5f5f7]/60 mb-3 text-xs tracking-[-0.03em]">
              Create your first WhatsApp Business instance to start managing your conversations
            </p>
            <Button 
              onClick={() => {
                const canCreate = instances.length < instanceLimit;
                if (!canCreate) {
                  toast.info('Plan limit reached: you cannot create more instances.');
                  return;
                }
                setCreateDialogOpen(true);
              }}
              className="bg-[#2a2b2d] border-0 transition-all duration-200 rounded-md text-[#f5f5f7] hover:bg-[#2a2b2d]/80 h-7 text-xs"
              disabled={instances.length >= instanceLimit}
            >
              <Plus className="h-3 w-3 mr-1.5" />
              Create First Instance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {instances.map((instance) => {
            const webhookInfo = webhookStatus[instance.instanceName];
            
            return (
              <Card 
                key={instance.id} 
                className="bg-[#2a2b2d]/50 border-0 transition-all duration-200 rounded-md"
              >
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-[#1c1d20] rounded-md flex items-center justify-center">
                        <Smartphone className="h-3 w-3 text-[#f5f5f7]/60" />
                      </div>
                      <div>
                        <CardTitle className="text-[#f5f5f7] text-xs font-medium tracking-[-0.03em]">
                          {instance.instanceName}
                        </CardTitle>
                        {instance.connectedNumber && (
                          <CardDescription className="text-[#f5f5f7]/60 text-xs tracking-[-0.03em]">
                            {instance.connectedNumber}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <Badge 
                      className={`${getStatusColor(instance.status)} text-[#f5f5f7] text-xs px-2 py-0.5 rounded-md border-0`}
                    >
                      {getStatusText(instance.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2 px-3 py-2">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#1c1d20] p-2 rounded-md text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <MessageSquare className="h-3 w-3 text-[#f5f5f7]/60" />
                        <span className="text-xs font-medium text-[#f5f5f7]">
                          {instance._count.messages}
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#1c1d20] p-2 rounded-md text-center">
                      <div className="text-xs font-medium text-[#f5f5f7]">
                        {instance.status === 'CONNECTED' ? 'Online' : 'Offline'}
                      </div>
                      <div className="text-xs text-[#f5f5f7]/60">Status</div>
                    </div>
                  </div>

                  {/* Webhook Status */}
                  {webhookInfo && (
                    <div className="bg-[#1c1d20] p-2 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#f5f5f7]/60">Webhook:</div>
                        {webhookInfo.isCorrect ? (
                          <div className="flex items-center text-[#6ee7b7] text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Configurado
                          </div>
                        ) : (
                          <div className="flex items-center text-[#fcd34d] text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Incorreto
                          </div>
                        )}
                      </div>
                      
                      {!webhookInfo.isCorrect && (
                        <div className="mt-1">
                          <Button 
                            size="sm" 
                            onClick={() => fixWebhook(instance.instanceName)}
                            className="w-full h-6 text-[10px] bg-[#2a2b2d] hover:bg-[#2a2b2d]/80 text-[#f5f5f7]"
                          >
                            Corrigir Webhook
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {instance.status !== 'CONNECTED' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleShowQRCode(instance)}
                        className="h-8 w-8 p-0 bg-[#1c1d20] border-0 transition-all duration-200 rounded-md text-[#f5f5f7]/80 hover:bg-[#1c1d20]/80 hover:text-[#f5f5f7]"
                        title="QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleCheckStatus(instance)}
                      className="h-8 w-8 p-0 bg-[#1c1d20] border-0 transition-all duration-200 rounded-md text-[#f5f5f7]/80 hover:bg-[#1c1d20]/80 hover:text-[#f5f5f7]"
                      title="Check Status"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage(instance)}
                      className="h-8 w-8 p-0 bg-[#1c1d20] border-0 transition-all duration-200 rounded-md text-[#f5f5f7]/80 hover:bg-[#1c1d20]/80 hover:text-[#f5f5f7]"
                      disabled={instance.status !== 'CONNECTED'}
                      title="Send Message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleViewData(instance)}
                      className="h-8 w-8 p-0 bg-[#1c1d20] border-0 transition-all duration-200 rounded-md text-[#f5f5f7]/80 hover:bg-[#1c1d20]/80 hover:text-[#f5f5f7]"
                      title="View Data"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleSync(instance)}
                      className="h-8 w-8 p-0 bg-[#1c1d20] border-0 transition-all duration-200 rounded-md text-[#f5f5f7]/80 hover:bg-[#1c1d20]/80 hover:text-[#f5f5f7]"
                      title="Sync"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleRestart(instance)}
                      className="h-8 w-8 p-0 bg-[#1c1d20] border-0 transition-all duration-200 rounded-md text-[#f5f5f7]/80 hover:bg-[#1c1d20]/80 hover:text-[#f5f5f7]"
                      title="Restart"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleDeleteInstance(instance)}
                      className="h-8 w-8 p-0 bg-[#1c1d20] border-0 transition-all duration-200 rounded-md text-[#f44336]/80 hover:bg-[#1c1d20]/80 hover:text-[#f44336]"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-200">
                    <div>Mensagens: {instance._count.messages}</div>
                    {instance.lastConnectedAt && (
                      <div>Último acesso: {new Date(instance.lastConnectedAt).toLocaleDateString('pt-BR')}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateInstanceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateInstance}
      />

      {selectedInstance && (
        <>
          <QRCodeDialog
            open={qrDialogOpen}
            onOpenChange={setQrDialogOpen}
            instance={selectedInstance}
            onStatusChange={loadInstances}
          />

          <SendMessageDialog
            open={messageDialogOpen}
            onOpenChange={setMessageDialogOpen}
            instance={selectedInstance}
          />

          <WhatsAppSyncDialog
            open={syncDialogOpen}
            onOpenChange={setSyncDialogOpen}
            instanceId={selectedInstance.id}
            instanceName={selectedInstance.instanceName}
          />

          <WhatsAppDataViewer
            open={dataViewerOpen}
            onOpenChange={setDataViewerOpen}
            instanceId={selectedInstance.id}
            instanceName={selectedInstance.instanceName}
          />
        </>
      )}
    </div>
  );
} 