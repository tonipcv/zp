'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/components/AppSidebar';
import { 
  Bot, 
  Settings, 
  Webhook, 
  Activity, 
  MessageSquare, 
  Clock, 
  Users, 
  AlertTriangle,
  Zap,
  Copy,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface AIAgentConfig {
  id: string;
  instanceId: string;
  isActive: boolean;
  model: string;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
  maxMessagesPerMinute: number;
  maxConsecutiveResponses: number;
  cooldownMinutes: number;
  fallbackMessage: string;
  // Campos do formulário guiado (Camada 1)
  companyName?: string;
  product?: string;
  mainPain?: string;
  successCase?: string;
  priceObjection?: string;
  goal: 'SALES' | 'SUPPORT' | 'LEAD_GENERATION' | 'QUALIFICATION' | 'RETENTION' | 'EDUCATION';
  instance: {
    id: string;
    instanceName: string;
    status: string;
    connectedNumber: string;
  };
}

interface WebhookReadiness {
  isReady: boolean;
  issues: string[];
  webhook?: any;
  settings?: any;
}

interface Stats {
  totalMessages: number;
  aiResponses: number;
  avgResponseTime: number;
  activeConversations: number;
  errorsToday: number;
  uptime: number;
  tokensUsedToday: number;
  tokensUsedThisMonth: number;
  freeTokensRemaining: number;
}

export default function AIAgentPage() {
  const [agents, setAgents] = useState<AIAgentConfig[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [usingNgrok, setUsingNgrok] = useState(false);
  const [ngrokConfigured, setNgrokConfigured] = useState(false);
  const [configuringWebhook, setConfiguringWebhook] = useState<string | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<Record<string, WebhookReadiness>>({});
  const [webhookSetupLoading, setWebhookSetupLoading] = useState<Record<string, boolean>>({});
  const [agentLimit, setAgentLimit] = useState<number>(1);
  const [planType, setPlanType] = useState<'free' | 'trial' | 'premium' | 'enterprise' | 'unlimited' | string>('free');

  // Estados para templates
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [promptMode, setPromptMode] = useState<'auto' | 'template' | 'custom'>('auto');
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    instanceId: '',
    isActive: true,
    model: 'gpt-3.5-turbo',
    systemPrompt: '',
    maxTokens: 150,
    temperature: 0.7,
    maxMessagesPerMinute: 5,
    maxConsecutiveResponses: 3,
    cooldownMinutes: 30,
    fallbackMessage: 'Desculpe, não posso responder no momento.',
    autoConfigureWebhook: true,
    // Campos do formulário guiado (Camada 1)
    companyName: '',
    product: '',
    mainPain: '',
    successCase: '',
    priceObjection: '',
    goal: 'SALES' as 'SALES' | 'SUPPORT' | 'LEAD_GENERATION' | 'QUALIFICATION' | 'RETENTION' | 'EDUCATION'
  });

  // Edit state
  const [editingAgent, setEditingAgent] = useState<AIAgentConfig | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    isActive: true,
    model: 'gpt-3.5-turbo',
    systemPrompt: '',
    maxTokens: 150,
    temperature: 0.7,
    maxMessagesPerMinute: 5,
    maxConsecutiveResponses: 3,
    cooldownMinutes: 30,
    fallbackMessage: '',
    // Campos do formulário guiado (Camada 1)
    companyName: '',
    product: '',
    mainPain: '',
    successCase: '',
    priceObjection: '',
    goal: 'SALES' as 'SALES' | 'SUPPORT' | 'LEAD_GENERATION' | 'QUALIFICATION' | 'RETENTION' | 'EDUCATION'
  });

  // Estados para templates no formulário de edição
  const [editTemplates, setEditTemplates] = useState<any[]>([]);
  const [editSelectedTemplate, setEditSelectedTemplate] = useState<string>('');
  const [editPromptMode, setEditPromptMode] = useState<'auto' | 'template' | 'custom'>('auto');
  const [editLoadingTemplates, setEditLoadingTemplates] = useState(false);

  useEffect(() => {
    loadData();
    loadInstances();
    loadWebhookUrl();
  }, []);

  // Carregar templates quando o objetivo mudar
  useEffect(() => {
    if (formData.goal) {
      loadTemplates(formData.goal);
    }
  }, [formData.goal]);

  // Carregar templates quando o objetivo mudar no formulário de edição
  useEffect(() => {
    if (editFormData.goal && showEditForm) {
      loadEditTemplates(editFormData.goal);
    }
  }, [editFormData.goal, showEditForm]);

  const loadData = async () => {
    try {
      const [agentsRes, statsRes] = await Promise.all([
        fetch('/api/ai-agent/configs'),
        fetch('/api/ai-agent/stats')
      ]);

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        const agentsList = agentsData.agents || [];
        setAgents(agentsList);
        
        // Verificar status do webhook para cada agente
        await checkWebhookStatusForAgents(agentsList);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const checkWebhookStatusForAgents = async (agentsList: AIAgentConfig[]) => {
    const statusMap: Record<string, WebhookReadiness> = {};
    
    for (const agent of agentsList) {
      try {
        const response = await fetch(`/api/ai-agent/webhook/setup?instanceId=${agent.instanceId}`);
        if (response.ok) {
          const data = await response.json();
          statusMap[agent.id] = data.readiness;
        }
      } catch (error) {
        console.error(`Erro ao verificar webhook para ${agent.instance.instanceName}:`, error);
        statusMap[agent.id] = {
          isReady: false,
          issues: ['Erro ao verificar status']
        };
      }
    }
    
    setWebhookStatus(statusMap);
  };

  const setupWebhook = async (agentId: string, instanceId: string) => {
    try {
      setWebhookSetupLoading(prev => ({ ...prev, [agentId]: true }));
      
      const response = await fetch('/api/ai-agent/webhook/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceId })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Webhook configurado com sucesso!');
        loadData();
      } else {
        // Mostrar mensagem de erro mais específica
        if (result.error?.includes('não encontrada') || result.error?.includes('não está conectada')) {
          toast.error('Instância não encontrada ou desconectada. Verifique se a instância está criada e conectada no WhatsApp.');
        } else if (result.error?.includes('404')) {
          toast.error('Instância não existe na Evolution API. Verifique o nome da instância.');
        } else {
          toast.error(result.error || 'Erro ao configurar webhook');
        }
        
        // Log detalhado para debug
        console.error('Erro detalhado do webhook:', result);
      }
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      toast.error('Erro de conexão ao configurar webhook');
    } finally {
      setWebhookSetupLoading(prev => ({ ...prev, [agentId]: false }));
    }
  };

  const loadInstances = async () => {
    try {
      const response = await fetch('/api/whatsapp/instances');
      if (response.ok) {
        const data = await response.json();
        setInstances(data.instances || []);
      }
    } catch (error) {
      console.error('Erro ao carregar instâncias:', error);
    }
  };

  const loadWebhookUrl = async () => {
    try {
      const response = await fetch('/api/ai-agent/webhook-url');
      if (response.ok) {
        const data = await response.json();
        setWebhookUrl(data.webhookUrl);
        setUsingNgrok(data.usingNgrok);
        setNgrokConfigured(data.ngrokConfigured);
      } else {
        // Fallback para URL local
        setWebhookUrl(`${window.location.origin}/api/ai-agent/webhook/messages-upsert`);
      }
    } catch (error) {
      console.error('Erro ao carregar URL do webhook:', error);
      // Fallback para URL local
      setWebhookUrl(`${window.location.origin}/api/ai-agent/webhook/messages-upsert`);
    }
  };

  const createAgent = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/ai-agent/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        let message = 'Agente criado com sucesso!';
        if (result.webhookConfigured) {
          message += ' Webhook configurado automaticamente.';
        } else if (formData.autoConfigureWebhook && formData.isActive) {
          message += ' Webhook não foi configurado automaticamente - configure manualmente.';
        }
        
        toast.success(message);
        setShowCreateModal(false);
        loadData();
        // Reset form
        setFormData({
          instanceId: '',
          isActive: true,
          model: 'gpt-3.5-turbo',
          systemPrompt: '',
          maxTokens: 150,
          temperature: 0.7,
          maxMessagesPerMinute: 5,
          maxConsecutiveResponses: 3,
          cooldownMinutes: 30,
          fallbackMessage: 'Desculpe, não posso responder no momento.',
          autoConfigureWebhook: true,
          // Campos do formulário guiado (Camada 1)
          companyName: '',
          product: '',
          mainPain: '',
          successCase: '',
          priceObjection: '',
          goal: 'SALES' as 'SALES' | 'SUPPORT' | 'LEAD_GENERATION' | 'QUALIFICATION' | 'RETENTION' | 'EDUCATION'
        });
        // Reset template states
        setPromptMode('auto');
        setSelectedTemplate('');
        setTemplates([]);
      } else {
        toast.error(result.error || 'Erro ao criar agente');
      }
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      toast.error('Erro ao criar agente');
    } finally {
      setCreating(false);
    }
  };

  const toggleAgent = async (agentId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/ai-agent/configs/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (!response.ok) throw new Error('Erro ao atualizar agente');

      await loadData();
      toast.success(`Agente ${isActive ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      toast.error('Erro ao atualizar agente');
    }
  };

  const editAgent = async () => {
    if (!editingAgent) return;
    
    console.log('🔄 Iniciando edição do agente:', editingAgent.id);
    console.log('📝 Dados a serem enviados:', JSON.stringify(editFormData, null, 2));
    
    setLoading(true);
    try {
      const response = await fetch(`/api/ai-agent/configs/${editingAgent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });

      console.log('📡 Resposta da API:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erro da API:', errorData);
        throw new Error(errorData.error || 'Erro ao atualizar agente');
      }

      const result = await response.json();
      console.log('✅ Agente atualizado com sucesso:', result);

      await loadData();
      setShowEditForm(false);
      setEditingAgent(null);
      toast.success('Agente atualizado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar agente:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar agente');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgent = (agent: AIAgentConfig) => {
    setEditingAgent(agent);
    setEditFormData({
      isActive: agent.isActive,
      model: agent.model,
      systemPrompt: agent.systemPrompt,
      maxTokens: agent.maxTokens,
      temperature: agent.temperature,
      maxMessagesPerMinute: agent.maxMessagesPerMinute,
      maxConsecutiveResponses: agent.maxConsecutiveResponses,
      cooldownMinutes: agent.cooldownMinutes,
      fallbackMessage: agent.fallbackMessage,
      companyName: agent.companyName || '',
      product: agent.product || '',
      mainPain: agent.mainPain || '',
      successCase: agent.successCase || '',
      priceObjection: agent.priceObjection || '',
      goal: agent.goal
    });

    // Determinar modo do prompt
    if (agent.systemPrompt && agent.systemPrompt.trim() !== '' && 
        agent.systemPrompt !== 'Você é um assistente virtual útil e amigável.') {
      setEditPromptMode('custom');
    } else {
      setEditPromptMode('auto');
    }

    // Carregar templates para o objetivo
    loadEditTemplates(agent.goal);
    
    setShowEditForm(true);
  };

  const deleteAgent = async (agentId: string, instanceName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o agente ${instanceName}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/ai-agent/configs/${agentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir agente');

      await loadData();
      toast.success('Agente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir agente:', error);
      toast.error('Erro ao excluir agente');
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL do webhook copiada!');
  };

  const availableInstances = instances.filter(instance => 
    !agents.some(agent => agent.instanceId === instance.id)
  );

  const loadTemplates = async (goal: string) => {
    try {
      setLoadingTemplates(true);
      const response = await fetch(`/api/ai-agent/templates?goal=${goal}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const applyTemplate = async (templateId: string) => {
    try {
      const variables = {
        companyName: formData.companyName || '[Nome da Empresa]',
        product: formData.product || '[Produto/Serviço]',
        mainPain: formData.mainPain || '[Principal Problema]',
        successCase: formData.successCase || '[Case de Sucesso]',
        priceObjection: formData.priceObjection || '[Resposta para Objeção de Preço]'
      };

      const response = await fetch('/api/ai-agent/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, variables })
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, systemPrompt: data.prompt }));
        toast.success('Template aplicado com sucesso!');
      } else {
        toast.error('Erro ao aplicar template');
      }
    } catch (error) {
      console.error('Erro ao aplicar template:', error);
      toast.error('Erro ao aplicar template');
    }
  };

  const loadEditTemplates = async (goal: string) => {
    try {
      setEditLoadingTemplates(true);
      const response = await fetch(`/api/ai-agent/templates?goal=${goal}`);
      if (response.ok) {
        const data = await response.json();
        setEditTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Erro ao carregar templates de edição:', error);
    } finally {
      setEditLoadingTemplates(false);
    }
  };

  const applyEditTemplate = async (templateId: string) => {
    try {
      const variables = {
        companyName: editFormData.companyName || '[Nome da Empresa]',
        product: editFormData.product || '[Produto/Serviço]',
        mainPain: editFormData.mainPain || '[Principal Problema]',
        successCase: editFormData.successCase || '[Case de Sucesso]',
        priceObjection: editFormData.priceObjection || '[Resposta para Objeção de Preço]'
      };

      const response = await fetch('/api/ai-agent/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, variables })
      });

      if (response.ok) {
        const data = await response.json();
        setEditFormData(prev => ({ ...prev, systemPrompt: data.prompt }));
        toast.success('Template aplicado com sucesso!');
      } else {
        toast.error('Erro ao aplicar template');
      }
    } catch (error) {
      console.error('Erro ao aplicar template:', error);
      toast.error('Erro ao aplicar template');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[100px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5f5f7]/60"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Title */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
            <div>
              <h1 className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">
                AI Agents
              </h1>
              <p className="text-xs text-[#f5f5f7]/60 tracking-[-0.03em]">
                Configure and manage your intelligent WhatsApp bots
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-2 mt-2 md:mt-0">
              <Button 
                onClick={() => {
                  const canCreate = agents.length < agentLimit;
                  if (!canCreate) {
                    toast.info('Limite atingido no seu plano: não é possível criar mais agentes.');
                    return;
                  }
                  setShowCreateModal(true);
                }}
                disabled={availableInstances.length === 0 || agents.length >= agentLimit}
                className="h-7 bg-[#2a2b2d] border-0 hover:bg-[#3a3b3d] text-[#f5f5f7]/80 hover:text-[#f5f5f7] text-xs rounded-sm"
              >
                New Agent
              </Button>
              
              <Link href="/ai-agent/knowledge">
                <Button 
                  variant="outline"
                  className="h-7 bg-transparent border-[#2a2b2d] hover:bg-[#2a2b2d] text-[#f5f5f7]/60 hover:text-[#f5f5f7] text-xs rounded-sm"
                >
                  Knowledge Base
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs (labels removed) */}
          <Tabs defaultValue="agents" className="space-y-4">

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-4">
              {stats && (
                <>
                  {/* Token Usage Card */}
                  <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-gray-900 tracking-[-0.03em] font-inter text-base">
                        Uso de Tokens OpenAI
                      </CardTitle>
                      <CardDescription className="text-gray-600 tracking-[-0.03em] font-inter text-xs">
                        Acompanhe seu consumo mensal de tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-[#2a2b2d] rounded-md border border-[#3a3b3d]/30">
                          <div className="text-lg font-bold text-[#4a9eff] mb-1">
                            {stats.tokensUsedToday.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#f5f5f7]/70">Tokens today</div>
                        </div>
                        <div className="text-center p-3 bg-[#2a2b2d] rounded-md border border-[#3a3b3d]/30">
                          <div className="text-lg font-bold text-[#ff9f4a] mb-1">
                            {stats.tokensUsedThisMonth.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#f5f5f7]/70">Tokens this month</div>
                        </div>
                        <div className="text-center p-3 bg-[#2a2b2d] rounded-md border border-[#3a3b3d]/30">
                          <div className="text-lg font-bold text-[#4aff9f] mb-1">
                            {stats.freeTokensRemaining.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#f5f5f7]/70">Tokens remaining</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-[#f5f5f7]">
                          <span>Monthly usage</span>
                          <span>{Math.round((stats.tokensUsedThisMonth / 100000) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(stats.tokensUsedThisMonth / 100000) * 100} 
                          className="h-2 bg-[#3a3b3d]"
                        />
                        <div className="text-xs text-[#f5f5f7]/70">
                          Limit: 100,000 free tokens per month
                        </div>
                      </div>

                      {stats.freeTokensRemaining < 10000 && (
                        <Alert className="bg-[#3a3b3d]/50 border-[#ff9f4a]/30 rounded-md">
                          <AlertDescription className="text-[#ff9f4a] text-xs">
                            Warning: You have less than 10,000 tokens remaining this month.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Card className="bg-[#2a2b2d]/50 border border-[#3a3b3d]/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#f5f5f7]/70">Messages Today</p>
                            <p className="text-lg font-bold text-[#f5f5f7]">{stats.totalMessages}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2a2b2d]/50 border border-[#3a3b3d]/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#f5f5f7]/70">AI Responses</p>
                            <p className="text-lg font-bold text-[#f5f5f7]">{stats.aiResponses}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2a2b2d]/50 border border-[#3a3b3d]/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#f5f5f7]/70">Average Time</p>
                            <p className="text-lg font-bold text-[#f5f5f7]">{stats.avgResponseTime}s</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#2a2b2d]/50 border border-[#3a3b3d]/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#f5f5f7]/70">Active Conversations</p>
                            <p className="text-lg font-bold text-[#f5f5f7]">{stats.activeConversations}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Knowledge Base Card */}
                  <Card className="bg-[#2a2b2d]/50 border border-[#3a3b3d]/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-[#f5f5f7] mb-2 flex items-center gap-2 tracking-[-0.03em] font-inter">
                            Knowledge Base
                          </h3>
                          <p className="text-[#f5f5f7]/70 mb-3 tracking-[-0.03em] font-inter text-xs">
                            Make your agents smarter with specific knowledge about objections, FAQs, case studies and more.
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <Badge variant="secondary" className="text-xs bg-[#3a3b3d] text-[#f5f5f7]/80 hover:bg-[#4a4b4d]">Objections</Badge>
                            <Badge variant="secondary" className="text-xs bg-[#3a3b3d] text-[#f5f5f7]/80 hover:bg-[#4a4b4d]">FAQs</Badge>
                            <Badge variant="secondary" className="text-xs bg-[#3a3b3d] text-[#f5f5f7]/80 hover:bg-[#4a4b4d]">Cases</Badge>
                            <Badge variant="secondary" className="text-xs bg-[#3a3b3d] text-[#f5f5f7]/80 hover:bg-[#4a4b4d]">Processes</Badge>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link href="/ai-agent/knowledge">
                            <Button className="bg-[#3a3b3d] border border-[#4a4b4d]/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-md text-[#f5f5f7] hover:bg-[#4a4b4d] h-8 text-xs">
                              Manage Knowledge
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="space-y-4">
              {/* Create Form - Old inline version */}
              {false && (
                <Card className="bg-[#2a2b2d]/50 border border-[#3a3b3d]/30 shadow-sm rounded-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#f5f5f7] tracking-[-0.03em] text-sm">Create New Agent</CardTitle>
                    <CardDescription className="text-[#f5f5f7]/60 tracking-[-0.03em] text-xs">
                      Configure a new virtual assistant for a WhatsApp instance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="instance" className="text-[#f5f5f7] text-xs">WhatsApp Instance</Label>
                        <Select 
                          value={formData.instanceId} 
                          onValueChange={(value) => setFormData({...formData, instanceId: value})}
                        >
                          <SelectTrigger className="h-8 bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-sm">
                            <SelectValue placeholder="Select an instance" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80">
                            {availableInstances.map((instance) => (
                              <SelectItem key={instance.id} value={instance.id} className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">
                                {instance.instanceName} ({instance.connectedNumber || 'Not connected'})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="model" className="text-[#f5f5f7] text-xs">OpenAI Model</Label>
                        <Select 
                          value={formData.model} 
                          onValueChange={(value) => setFormData({...formData, model: value})}
                        >
                          <SelectTrigger className="h-8 bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-sm">
                            <SelectItem value="gpt-3.5-turbo" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">GPT-3.5 Turbo (Fast & Economical)</SelectItem>
                            <SelectItem value="gpt-4" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">GPT-4 (More Intelligent)</SelectItem>
                            <SelectItem value="gpt-4-turbo" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">GPT-4 Turbo (Balanced)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Formulário Guiado - Camada 1 */}
                    <div className="space-y-3 p-3 bg-[#2a2b2d]/50 rounded-md border border-[#3a3b3d]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-[#4a9eff] text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                        <h3 className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">Main Context</h3>
                      </div>
                      <p className="text-xs text-[#f5f5f7]/70 mb-2 tracking-[-0.03em]">
                        Fill in this information so the agent has intelligent context about your business.
                        The prompt will be automatically generated based on this information.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-[#f5f5f7] text-xs">Company Name</Label>
                          <Input
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            placeholder="Ex: TechSolutions"
                            className="h-8 bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-sm placeholder:text-[#f5f5f7]/40"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[#f5f5f7] text-xs">Product/Service</Label>
                          <Input
                            value={formData.product}
                            onChange={(e) => setFormData({...formData, product: e.target.value})}
                            placeholder="Ex: Business Management System"
                            className="h-8 bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-sm placeholder:text-[#f5f5f7]/40"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[#f5f5f7] text-xs">Main Problem it Solves</Label>
                          <Input
                            value={formData.mainPain}
                            onChange={(e) => setFormData({...formData, mainPain: e.target.value})}
                            placeholder="Ex: Internal process disorganization"
                            className="h-8 bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-md placeholder:text-[#f5f5f7]/40"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[#f5f5f7] text-xs">Agent Goal</Label>
                          <Select 
                            value={formData.goal} 
                            onValueChange={(value: 'SALES' | 'SUPPORT' | 'LEAD_GENERATION' | 'QUALIFICATION' | 'RETENTION' | 'EDUCATION') => 
                              setFormData({...formData, goal: value})
                            }
                          >
                            <SelectTrigger className="h-8 bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-md">
                              <SelectItem value="SALES" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">Sales</SelectItem>
                              <SelectItem value="SUPPORT" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">Support</SelectItem>
                              <SelectItem value="LEAD_GENERATION" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">Lead Generation</SelectItem>
                              <SelectItem value="QUALIFICATION" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">Qualification</SelectItem>
                              <SelectItem value="RETENTION" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">Retention</SelectItem>
                              <SelectItem value="EDUCATION" className="text-[#f5f5f7]/80 hover:text-[#f5f5f7]">Education</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-[#f5f5f7] text-xs">Success Case (Optional)</Label>
                          <Textarea
                            value={formData.successCase}
                            onChange={(e) => setFormData({...formData, successCase: e.target.value})}
                            placeholder="Ex: Company X reduced administrative process time by 50%..."
                            rows={2}
                            className="text-xs bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-md placeholder:text-[#f5f5f7]/40"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[#f5f5f7] text-xs">Price Objection Response (Optional)</Label>
                          <Textarea
                            value={formData.priceObjection}
                            onChange={(e) => setFormData({...formData, priceObjection: e.target.value})}
                            placeholder="Ex: I understand your concern about the investment, but..."
                            rows={2}
                            className="text-xs bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/80 rounded-md placeholder:text-[#f5f5f7]/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-[#3a3b3d] text-[#f5f5f7] rounded-full flex items-center justify-center text-sm font-normal">2</div>
                        <Label className="text-[#f5f5f7] font-normal text-sm">Prompt Configuration</Label>
                      </div>

                      {/* Seletor de Modo */}
                      <div className="space-y-2">
                        <Label className="text-[#f5f5f7]/80 font-normal text-xs">Configuration Mode</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPromptMode('auto')}
                            className={`p-2 text-xs rounded-md border transition-all ${
                              promptMode === 'auto' 
                                ? 'bg-[#4a9eff]/20 border-[#4a9eff]/30 text-[#f5f5f7]' 
                                : 'bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]'
                            }`}
                          >
                            <div className="font-medium">Automatic</div>
                            <div className="text-xs opacity-75">Based on fields</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPromptMode('template')}
                            className={`p-2 text-xs rounded-md border transition-all ${
                              promptMode === 'template' 
                                ? 'bg-[#4a9eff]/20 border-[#4a9eff]/30 text-[#f5f5f7]' 
                                : 'bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]'
                            }`}
                          >
                            <div className="font-medium">Template</div>
                            <div className="text-xs opacity-75">Pre-configured</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPromptMode('custom')}
                            className={`p-2 text-xs rounded-md border transition-all ${
                              promptMode === 'custom' 
                                ? 'bg-[#4a9eff]/20 border-[#4a9eff]/30 text-[#f5f5f7]' 
                                : 'bg-[#2a2b2d] border-[#3a3b3d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]'
                            }`}
                          >
                            <div className="font-medium">Custom</div>
                            <div className="text-xs opacity-75">Write your own</div>
                          </button>
                        </div>
                      </div>

                      {/* Seleção de Template */}
                      {promptMode === 'template' && (
                        <div className="space-y-3">
                          <Label className="text-[#f5f5f7]/80 font-normal text-xs">Choose a Template</Label>
                          {loadingTemplates ? (
                            <div className="flex items-center gap-2 text-xs text-[#f5f5f7]/60">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#f5f5f7]/40"></div>
                              Loading templates...
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {templates.map((template) => (
                                <div
                                  key={template.id}
                                  className={`p-3 rounded-md border-0 cursor-pointer transition-all ${
                                    selectedTemplate === template.id
                                      ? 'bg-[#4a9eff]/20 border-0'
                                      : 'bg-[#2a2b2d] hover:bg-[#3a3b3d]'
                                  }`}
                                  onClick={() => {
                                    setSelectedTemplate(template.id);
                                    setFormData(prev => ({ ...prev, systemPrompt: template.prompt }));
                                  }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-normal text-xs text-[#f5f5f7]">{template.name}</h4>
                                      <p className="text-xs text-[#f5f5f7]/70 mt-1">{template.description}</p>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {template.variables.map((variable: string) => (
                                          <span key={variable} className="px-2 py-1 bg-[#3a3b3d] text-[#f5f5f7]/80 rounded-sm text-xs">
                                            {variable}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    {selectedTemplate === template.id && (
                                      <CheckCircle className="h-4 w-4 text-[#4a9eff] flex-shrink-0 ml-2" />
                                    )}
                                  </div>
                                </div>
                              ))}
                              {templates.length === 0 && (
                                <p className="text-xs text-[#f5f5f7]/60 text-center py-4">
                                  No templates available for this goal
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Campo de Prompt Customizado */}
                      {promptMode === 'custom' && (
                        <div className="space-y-2">
                          <Label className="text-[#f5f5f7]/80 font-normal text-xs">Custom Prompt</Label>
                          <Textarea
                            value={formData.systemPrompt}
                            onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
                            placeholder="Write your custom prompt here..."
                            className="min-h-[120px] text-xs bg-[#2a2b2d] border-0 text-[#f5f5f7] rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                          />
                        </div>
                      )}

                      {/* Modo Automático - Apenas informativo */}
                      {promptMode === 'auto' && (
                        <div className="p-3 bg-[#2a2b2d] border-0 rounded-md">
                          <p className="text-xs text-[#4a9eff] flex items-start gap-2">
                            <span className="text-[#4a9eff]">✅</span>
                            <span>The prompt will be automatically generated based on the information filled above. Complete the company fields for best results.</span>
                          </p>
                        </div>
                      )}

                      {/* Preview do Prompt (quando template ou custom) */}
                      {formData.systemPrompt && ['template', 'custom'].includes(promptMode) && (
                        <div className="space-y-2">
                          <Label className="text-[#f5f5f7]/80 font-normal text-xs">Prompt Preview</Label>
                          <div className="p-3 bg-[#2a2b2d] border-0 rounded-md max-h-32 overflow-y-auto">
                            <pre className="text-xs text-[#f5f5f7]/80 whitespace-pre-wrap font-mono">
                              {formData.systemPrompt.substring(0, 500)}
                              {formData.systemPrompt.length > 500 && '...'}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#f5f5f7]/80 font-normal text-xs">Max Tokens</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        value={formData.maxTokens}
                        onChange={(e) => setFormData({...formData, maxTokens: parseInt(e.target.value)})}
                        min={50}
                        max={1000}
                        className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#f5f5f7]/80 font-normal text-xs">Temperature (0-1)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                        min={0}
                        max={1}
                        className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[#f5f5f7]/80 font-normal text-xs">Messages per Minute</Label>
                      <Input
                        id="maxMessagesPerMinute"
                        type="number"
                        value={formData.maxMessagesPerMinute}
                        onChange={(e) => setFormData({...formData, maxMessagesPerMinute: parseInt(e.target.value)})}
                        min={1}
                        max={20}
                        className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoConfigureWebhook"
                        checked={formData.autoConfigureWebhook}
                        onCheckedChange={(checked) => setFormData({...formData, autoConfigureWebhook: checked})}
                        className="data-[state=checked]:bg-[#4a9eff] data-[state=unchecked]:bg-[#3a3b3d]"
                      />
                      <Label className="text-[#f5f5f7] font-normal text-xs">
                        Configure webhook automatically
                        <span className="text-xs text-[#f5f5f7]/60 block">
                          Will attempt to automatically configure settings and webhook in Evolution API
                        </span>
                      </Label>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={createAgent} 
                        disabled={creating || !formData.instanceId}
                        className="bg-[#4a9eff]/20 border-0 hover:bg-[#4a9eff]/30 transition-all duration-300 rounded-md text-[#f5f5f7] flex items-center gap-1.5 h-8 text-xs"
                      >
                        {creating ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#f5f5f7]"></div>
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                        {creating ? 'Creating...' : 'Create Agent'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCreateModal(false)}
                        className="bg-[#2a2b2d] border border-[#3a3b3d] hover:bg-[#3a3b3d] transition-all duration-300 rounded-md text-[#f5f5f7] h-8 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agents List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {agents.map((agent) => (
                  <Card key={agent.id} className="bg-[#2a2b2d]/50 border border-[#3a3b3d]/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-md">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <h3 className="font-semibold text-[#f5f5f7] tracking-[-0.03em] font-inter text-sm">
                            {agent.instance.instanceName}
                          </h3>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAgent(agent)}
                            className="h-6 w-6 p-0 text-[#f5f5f7]/70 hover:bg-[#3a3b3d] hover:text-[#f5f5f7]"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAgent(agent.id, agent.instance.instanceName)}
                            className="h-6 w-6 p-0 text-[#f5f5f7]/70 hover:bg-[#3a3b3d]/80 hover:text-[#ff6b6b]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#f5f5f7]/70">
                          <Bot className="h-3 w-3" />
                          <span>{agent.model}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#f5f5f7]/70">
                          <Zap className="h-3 w-3" />
                          <span>Max: {agent.maxTokens} tokens</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#f5f5f7]/70">
                          <Clock className="h-3 w-3" />
                          <span>Temp: {agent.temperature}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#3a3b3d]/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Switch
                              checked={agent.isActive}
                              onCheckedChange={(checked) => toggleAgent(agent.id, checked)}
                              className="data-[state=checked]:bg-green-500"
                            />
                            <span className={`text-xs font-medium ${agent.isActive ? 'text-green-400' : 'text-[#f5f5f7]/70'}`}>
                              {agent.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <Badge 
                            variant={agent.isActive ? "default" : "secondary"}
                            className={`text-xs ${agent.isActive ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-[#3a3b3d] text-[#f5f5f7]/70'}`}
                          >
                            {agent.isActive ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Knowledge Tab */}
            <TabsContent value="knowledge" className="space-y-6">
              {/* Knowledge Base Card */}
              <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2 tracking-[-0.03em] font-inter">
                        Base de Conhecimento
                      </h3>
                      <p className="text-gray-600 mb-4 tracking-[-0.03em] font-inter">
                        Torne seus agentes mais inteligentes com conhecimento específico sobre objeções, FAQs, cases e muito mais.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">Objeções</Badge>
                        <Badge variant="secondary">FAQs</Badge>
                        <Badge variant="secondary">Cases</Badge>
                        <Badge variant="secondary">Processos</Badge>
                      </div>
                    </div>
                    <div className="ml-6">
                      <Link href="/ai-agent/knowledge">
                        <Button className="bg-gray-800/5 border-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-2xl text-gray-700 hover:bg-gray-800/10">
                          Gerenciar Conhecimento
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Knowledge Types Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 mb-2 tracking-[-0.03em] font-inter">Objeções</h4>
                    <p className="text-sm text-gray-600 tracking-[-0.03em] font-inter">Respostas para objeções de preço, tempo, autoridade</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 mb-2 tracking-[-0.03em] font-inter">FAQs</h4>
                    <p className="text-sm text-gray-600 tracking-[-0.03em] font-inter">Perguntas frequentes sobre produtos e serviços</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 mb-2 tracking-[-0.03em] font-inter">Cases</h4>
                    <p className="text-sm text-gray-600 tracking-[-0.03em] font-inter">Histórias de sucesso e resultados alcançados</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 mb-2 tracking-[-0.03em] font-inter">Features</h4>
                    <p className="text-sm text-gray-600 tracking-[-0.03em] font-inter">Funcionalidades e benefícios do produto</p>
                  </CardContent>
                </Card>
              </div>

              {/* How it Works */}
              <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 tracking-[-0.03em] font-inter">Como Funciona</CardTitle>
                  <CardDescription className="text-gray-600 tracking-[-0.03em] font-inter">
                    Sistema de conhecimento em duas camadas para máxima inteligência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 tracking-[-0.03em] font-inter">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">1</div>
                        Camada 1: Contexto Principal
                      </h4>
                      <p className="text-sm text-gray-600 ml-8 tracking-[-0.03em] font-inter">
                        Informações básicas sobre sua empresa, produto, dores e objetivos. 
                        Sempre usado para gerar contexto inteligente automaticamente.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 tracking-[-0.03em] font-inter">
                        <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm">2</div>
                        Camada 2: Base de Conhecimento
                      </h4>
                      <p className="text-sm text-gray-600 ml-8 tracking-[-0.03em] font-inter">
                        Conhecimento específico adicional como objeções, FAQs, cases. 
                        Usado quando relevante para a conversa através de busca semântica.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Webhook Tab */}
            <TabsContent value="webhook" className="space-y-6">
              <Card className="bg-gray-800/5 border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 tracking-[-0.03em] font-inter">
                    Configuração do Webhook
                  </CardTitle>
                  <CardDescription className="text-gray-600 tracking-[-0.03em] font-inter">
                    Configure o webhook na Evolution API para receber mensagens automaticamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-900">URL do Webhook</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={webhookUrl} 
                        readOnly 
                        className="font-mono text-sm bg-white border-gray-300 text-gray-900"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={copyWebhookUrl}
                        className="bg-gray-800/5 border-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-2xl text-gray-700 hover:bg-gray-800/10"
                      >
                        Copiar
                      </Button>
                    </div>
                    {usingNgrok ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span>Usando NGROK_URL configurada no .env.local</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <span>Usando URL local - configure NGROK_URL no .env.local para desenvolvimento</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      Use esta URL como webhook na configuração da sua instância Evolution API
                    </p>
                  </div>

                  {!ngrokConfigured && (
                    <Alert className="bg-amber-50/50 border-amber-200">
                      <AlertDescription className="text-amber-800">
                        <strong>Dica para Desenvolvimento:</strong><br />
                        Configure a variável <code className="bg-white border border-gray-300 px-1 rounded text-gray-900">NGROK_URL</code> no seu arquivo .env.local<br />
                        Exemplo: <code className="bg-white border border-gray-300 px-1 rounded text-gray-900">NGROK_URL=https://abc123.ngrok-free.app</code><br />
                        Assim o webhook será configurado automaticamente com a URL pública!
                      </AlertDescription>
                    </Alert>
                  )}

                  <Alert className="bg-blue-50/50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <strong>Configuração Automática:</strong><br />
                      Use os botões "Auto-Config" nos seus agentes para configurar automaticamente!<br />
                      Ou configure manualmente seguindo as instruções abaixo.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-green-50/50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-2 text-green-800">Checklist de Configuração:</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Instância deve estar CONNECTED</li>
                      <li>• Settings configurados (always_online, read_messages, reject_call)</li>
                      <li>• Webhook configurado com URL pública e evento MESSAGES_UPSERT</li>
                      <li>• Agente IA ativo na instância</li>
                      <li>• OPENAI_API_KEY configurada no ambiente</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-800">
                      Para usar com ngrok (desenvolvimento):
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                      <li>Instale o ngrok: <code className="bg-white border border-gray-300 px-1 rounded text-gray-900">npm install -g ngrok</code></li>
                      <li>Execute: <code className="bg-white border border-gray-300 px-1 rounded text-gray-900">ngrok http 3000</code></li>
                      <li>Use a URL HTTPS fornecida pelo ngrok + /api/ai-agent/webhook/messages-upsert</li>
                      <li>Configure na Evolution API usando os comandos de configuração automática</li>
                    </ol>
                  </div>

                  <div className="bg-red-50/50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-red-800">
                      Problemas Comuns e Soluções:
                    </h4>
                    <div className="space-y-3 text-sm text-red-700">
                      <div>
                        <strong>"Instância não encontrada":</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Verifique se a instância foi criada na Evolution API</li>
                          <li>Confirme se o nome da instância está correto</li>
                          <li>Certifique-se que a instância está no estado "CONNECTED"</li>
                        </ul>
                      </div>
                      <div>
                        <strong>"Erro 404 - Not Found":</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>A instância não existe na Evolution API</li>
                          <li>Verifique a URL base da Evolution API</li>
                          <li>Confirme se a API Key está correta</li>
                        </ul>
                      </div>
                      <div>
                        <strong>"Webhook não configurado":</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Use a configuração automática ou configure manualmente</li>
                          <li>Certifique-se que a URL do webhook é acessível publicamente</li>
                          <li>Para desenvolvimento, use ngrok para expor localhost</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1c1d20] border-0 shadow-md rounded-md">
          <DialogHeader className="bg-[#2a2b2d] text-[#f5f5f7] p-4 -m-6 mb-6 rounded-t-md">
            <DialogTitle className="flex items-center gap-2 text-[#f5f5f7] tracking-[-0.03em] font-normal">
              <Edit className="h-4 w-4" />
              Edit Agent: {editingAgent?.instance.instanceName}
            </DialogTitle>
            <DialogDescription className="text-[#f5f5f7]/60 tracking-[-0.03em] text-xs">
              Modify your AI agent settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-1">
            {/* Status */}
            <div className="flex items-center space-x-2 p-3 bg-[#2a2b2d]/50 rounded-sm border border-[#3a3b3d]/30">
              <Switch
                id="edit-active"
                checked={editFormData.isActive}
                onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isActive: checked }))}
                className="data-[state=checked]:bg-[#4a9eff]"
              />
              <Label htmlFor="edit-active" className="text-[#f5f5f7] text-xs">
                Agent Active
              </Label>
            </div>

            {/* Formulário Guiado - Camada 1 */}
            <div className="space-y-4 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#3a3b3d] text-[#f5f5f7] rounded-full flex items-center justify-center text-sm font-normal">1</div>
                <h3 className="text-sm font-normal text-[#f5f5f7] tracking-[-0.03em]">Main Context</h3>
              </div>
              <p className="text-xs text-[#f5f5f7]/70 mb-4 tracking-[-0.03em]">
                Fill in this information so the agent has intelligent context about your business.
                The prompt will be automatically generated based on this information.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Company Name</Label>
                  <Input
                    value={editFormData.companyName}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Ex: TechSolutions"
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Product/Service</Label>
                  <Input
                    value={editFormData.product}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, product: e.target.value }))}
                    placeholder="Ex: Business management system"
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Main Problem it Solves</Label>
                  <Input
                    value={editFormData.mainPain}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, mainPain: e.target.value }))}
                    placeholder="Ex: Disorganized internal processes"
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Agent Goal</Label>
                  <Select 
                    value={editFormData.goal} 
                    onValueChange={(value: 'SALES' | 'SUPPORT' | 'LEAD_GENERATION' | 'QUALIFICATION' | 'RETENTION' | 'EDUCATION') => {
                      setEditFormData(prev => ({ ...prev, goal: value }));
                      // Carregar templates para o novo objetivo se estiver no modo template
                      if (editPromptMode === 'template') {
                        loadEditTemplates(value);
                        setEditSelectedTemplate(''); // Reset template selection
                      }
                    }}
                  >
                    <SelectTrigger className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm">
                      <SelectItem value="SALES" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Sales</SelectItem>
                      <SelectItem value="SUPPORT" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Support</SelectItem>
                      <SelectItem value="LEAD_GENERATION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Lead Generation</SelectItem>
                      <SelectItem value="QUALIFICATION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Qualification</SelectItem>
                      <SelectItem value="RETENTION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Retention</SelectItem>
                      <SelectItem value="EDUCATION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Success Case (Optional)</Label>
                  <Textarea
                    value={editFormData.successCase}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, successCase: e.target.value }))}
                    placeholder="Ex: Company X reduced administrative process time by 50%..."
                    rows={2}
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40 min-h-[60px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Price Objection Response (Optional)</Label>
                  <Textarea
                    value={editFormData.priceObjection}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, priceObjection: e.target.value }))}
                    placeholder="Ex: Our investment pays for itself within 3 months through generated savings..."
                    rows={2}
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40 min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            {/* Configuração do Prompt - Seção 2 */}
            <div className="space-y-4 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#3a3b3d] text-[#f5f5f7] rounded-full flex items-center justify-center text-sm font-normal">2</div>
                <Label className="text-[#f5f5f7] font-normal text-sm">Prompt Configuration</Label>
              </div>

              {/* Seletor de Modo */}
              <div className="space-y-2">
                <Label className="text-[#f5f5f7]/80 font-normal text-xs">Configuration Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditPromptMode('auto')}
                    className={`p-2 text-xs rounded-md border-0 transition-all ${
                      editPromptMode === 'auto' 
                        ? 'bg-[#3a3b3d] text-[#f5f5f7]' 
                        : 'bg-[#2a2b2d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]/50 hover:text-[#f5f5f7]'
                    }`}
                  >
                    <div className="font-normal">Automatic</div>
                    <div className="text-xs opacity-75">Based on fields</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditPromptMode('template');
                      loadEditTemplates(editFormData.goal);
                    }}
                    className={`p-2 text-xs rounded-md border-0 transition-all ${
                      editPromptMode === 'template' 
                        ? 'bg-[#3a3b3d] text-[#f5f5f7]' 
                        : 'bg-[#2a2b2d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]/50 hover:text-[#f5f5f7]'
                    }`}
                  >
                    <div className="font-normal">Template</div>
                    <div className="text-xs opacity-75">Pre-configured</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPromptMode('custom')}
                    className={`p-2 text-xs rounded-md border-0 transition-all ${
                      editPromptMode === 'custom' 
                        ? 'bg-[#3a3b3d] text-[#f5f5f7]' 
                        : 'bg-[#2a2b2d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]/50 hover:text-[#f5f5f7]'
                    }`}
                  >
                    <div className="font-normal">Custom</div>
                    <div className="text-xs opacity-75">Write your own</div>
                  </button>
                </div>
              </div>

              {/* Seleção de Template */}
              {editPromptMode === 'template' && (
                <div className="space-y-3">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Select a Template</Label>
                  {editLoadingTemplates ? (
                    <div className="flex items-center gap-2 text-xs text-[#f5f5f7]/70">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#f5f5f7]/40"></div>
                      Loading templates...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {editTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-3 rounded-md border-0 cursor-pointer transition-all ${
                            editSelectedTemplate === template.id
                              ? 'bg-[#3a3b3d] text-[#f5f5f7]'
                              : 'bg-[#2a2b2d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]/50'
                          }`}
                          onClick={() => {
                            setEditSelectedTemplate(template.id);
                            setEditFormData(prev => ({ ...prev, systemPrompt: template.prompt }));
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-normal text-xs text-[#f5f5f7]">{template.name}</h4>
                              <p className="text-xs text-[#f5f5f7]/70 mt-1">{template.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {template.variables.map((variable: string) => (
                                  <span key={variable} className="px-2 py-1 bg-[#3a3b3d] text-[#f5f5f7]/80 rounded text-xs">
                                    {variable}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {editSelectedTemplate === template.id && (
                              <CheckCircle className="h-4 w-4 text-[#4a9eff] flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                      {editTemplates.length === 0 && (
                        <p className="text-xs text-[#f5f5f7]/60 text-center py-4">
                          No templates available for this goal
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Campo de Prompt Customizado */}
              {editPromptMode === 'custom' && (
                <div className="space-y-3 mt-3">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Custom Prompt</Label>
                  <Textarea
                    value={editFormData.systemPrompt}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    placeholder="Write your custom prompt here..."
                    rows={8}
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                  />
                </div>
              )}

              {/* Modo Automático - Apenas informativo */}
              {editPromptMode === 'auto' && (
                <div className="p-3 bg-[#2a2b2d] border-0 rounded-md">
                  <p className="text-xs text-[#4a9eff] flex items-start gap-2">
                    <span className="text-[#4a9eff]">✅</span>
                    <span>The prompt will be automatically generated based on the information filled above. Complete the company fields for best results.</span>
                  </p>
                </div>
              )}

              {/* Preview do Prompt (quando template ou custom) */}
              {editFormData.systemPrompt && ['template', 'custom'].includes(editPromptMode) && (
                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Prompt Preview</Label>
                  <div className="p-3 bg-[#2a2b2d] border-0 rounded-md max-h-32 overflow-y-auto">
                    <pre className="text-xs text-[#f5f5f7]/80 whitespace-pre-wrap font-mono">
                      {editFormData.systemPrompt.substring(0, 500)}
                      {editFormData.systemPrompt.length > 500 && '...'}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modelo */}
            <div className="space-y-2 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <Label className="text-[#f5f5f7]/80 font-normal text-xs">AI Model</Label>
              <Select value={editFormData.model} onValueChange={(value) => setEditFormData(prev => ({ ...prev, model: value }))}>
                <SelectTrigger className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm">
                  <SelectItem value="gpt-3.5-turbo" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">GPT-3.5 Turbo (Fast & Economical)</SelectItem>
                  <SelectItem value="gpt-4" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">GPT-4 (More Intelligent)</SelectItem>
                  <SelectItem value="gpt-4-turbo" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">GPT-4 Turbo (Balanced)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Configurações Avançadas */}
            <div className="space-y-4 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#3a3b3d] text-[#f5f5f7] rounded-full flex items-center justify-center text-sm font-normal">3</div>
                <Label className="text-[#f5f5f7] font-normal text-sm">Advanced Settings</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Max Tokens</Label>
                  <Input
                    type="number"
                    value={editFormData.maxTokens}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 150 }))}
                    min="50"
                    max="4000"
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Temperature (0-1)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editFormData.temperature}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0.7 }))}
                    min="0"
                    max="1"
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Messages per Minute</Label>
                  <Input
                    type="number"
                    value={editFormData.maxMessagesPerMinute}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, maxMessagesPerMinute: parseInt(e.target.value) || 5 }))}
                    min="1"
                    max="60"
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Cooldown (minutes)</Label>
                  <Input
                    type="number"
                    value={editFormData.cooldownMinutes}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, cooldownMinutes: parseInt(e.target.value) || 30 }))}
                    min="0"
                    max="1440"
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs h-8 rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>
              </div>
            </div>

            {/* Mensagem de Fallback */}
            <div className="space-y-2 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <Label className="text-[#f5f5f7]/80 font-normal text-xs">Fallback Message</Label>
              <Textarea
                value={editFormData.fallbackMessage}
                onChange={(e) => setEditFormData(prev => ({ ...prev, fallbackMessage: e.target.value }))}
                placeholder="Message sent when there is an error or limit reached..."
                className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40 min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowEditForm(false)}
              className="bg-transparent hover:bg-[#2a2b2d] text-[#f5f5f7]/70 border-[#3a3b3d] text-xs rounded-sm h-7"
            >
              Cancel
            </Button>
            <Button 
              onClick={editAgent}
              className="bg-[#4a9eff] hover:bg-[#3a8eff] text-white text-xs rounded-sm h-7"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Agent Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-[#1a1b1d] border-[#3a3b3d] text-[#f5f5f7] max-w-3xl max-h-[90vh] overflow-y-auto rounded-md">
          <DialogHeader>
            <DialogTitle className="text-[#f5f5f7] text-lg font-medium">Create New Agent</DialogTitle>
            <DialogDescription className="text-[#f5f5f7]/60 text-sm">
              Configure a new virtual assistant for a WhatsApp instance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* WhatsApp Instance Selection */}
            <div className="space-y-2">
              <Label htmlFor="instance" className="text-[#f5f5f7]/80 font-normal text-xs">WhatsApp Instance</Label>
              <Select 
                value={formData.instanceId} 
                onValueChange={(value) => setFormData({...formData, instanceId: value})}
              >
                <SelectTrigger className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]">
                  <SelectValue placeholder="Select an instance" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm">
                  {availableInstances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id} className="text-[#f5f5f7] hover:bg-[#3a3b3d]">
                      {instance.instanceName} ({instance.connectedNumber || 'Not connected'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Configuração Guiada - Seção 1 */}
            <div className="space-y-4 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#3a3b3d] text-[#f5f5f7] rounded-full flex items-center justify-center text-sm font-normal">1</div>
                <h3 className="text-[#f5f5f7] text-sm font-medium">Agent Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Company Name (Optional)</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Ex: Acme Inc."
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Product/Service (Optional)</Label>
                  <Input
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder="Ex: Project Management Software"
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Main Problem it Solves</Label>
                  <Input
                    value={formData.mainPain}
                    onChange={(e) => setFormData({...formData, mainPain: e.target.value})}
                    placeholder="Ex: Internal process disorganization"
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Agent Goal</Label>
                  <Select 
                    value={formData.goal} 
                    onValueChange={(value: 'SALES' | 'SUPPORT' | 'LEAD_GENERATION' | 'QUALIFICATION' | 'RETENTION' | 'EDUCATION') => 
                      setFormData({...formData, goal: value})
                    }
                  >
                    <SelectTrigger className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm">
                      <SelectItem value="SALES" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Sales</SelectItem>
                      <SelectItem value="SUPPORT" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Support</SelectItem>
                      <SelectItem value="LEAD_GENERATION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Lead Generation</SelectItem>
                      <SelectItem value="QUALIFICATION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Qualification</SelectItem>
                      <SelectItem value="RETENTION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Retention</SelectItem>
                      <SelectItem value="EDUCATION" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Success Case (Optional)</Label>
                  <Textarea
                    value={formData.successCase}
                    onChange={(e) => setFormData({...formData, successCase: e.target.value})}
                    placeholder="Ex: Company X reduced administrative process time by 50%..."
                    rows={2}
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40 min-h-[60px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Price Objection Response (Optional)</Label>
                  <Textarea
                    value={formData.priceObjection}
                    onChange={(e) => setFormData({...formData, priceObjection: e.target.value})}
                    placeholder="Ex: Our investment pays for itself within 3 months through generated savings..."
                    rows={2}
                    className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40 min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            {/* Configuração do Prompt - Seção 2 */}
            <div className="space-y-4 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#3a3b3d] text-[#f5f5f7] rounded-full flex items-center justify-center text-sm font-normal">2</div>
                <h3 className="text-[#f5f5f7] text-sm font-medium">Prompt Configuration</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">OpenAI Model</Label>
                  <Select 
                    value={formData.model} 
                    onValueChange={(value) => setFormData({...formData, model: value})}
                  >
                    <SelectTrigger className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm">
                      <SelectItem value="gpt-3.5-turbo" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">GPT-3.5 Turbo (Fast & Economical)</SelectItem>
                      <SelectItem value="gpt-4" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">GPT-4 (More Intelligent)</SelectItem>
                      <SelectItem value="gpt-4-turbo" className="text-[#f5f5f7] hover:bg-[#3a3b3d]">GPT-4 Turbo (Balanced)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Configuration Mode</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="grid grid-cols-3 gap-1 bg-[#2a2b2d] p-0.5 rounded-sm">
                        <Button 
                          type="button" 
                          onClick={() => setPromptMode('auto')} 
                          className={`text-xs h-7 rounded-sm ${promptMode === 'auto' ? 'bg-[#3a3b3d] text-[#f5f5f7]' : 'bg-transparent text-[#f5f5f7]/60 hover:text-[#f5f5f7]/80'}`}
                        >
                          Automatic
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => {
                            setPromptMode('template');
                            loadTemplates(formData.goal);
                          }} 
                          className={`text-xs h-7 rounded-sm ${promptMode === 'template' ? 'bg-[#3a3b3d] text-[#f5f5f7]' : 'bg-transparent text-[#f5f5f7]/60 hover:text-[#f5f5f7]/80'}`}
                        >
                          Template
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => setPromptMode('custom')} 
                          className={`text-xs h-7 rounded-sm ${promptMode === 'custom' ? 'bg-[#3a3b3d] text-[#f5f5f7]' : 'bg-transparent text-[#f5f5f7]/60 hover:text-[#f5f5f7]/80'}`}
                        >
                          Custom
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {promptMode === 'auto' && (
                  <div className="p-3 bg-[#2a2b2d] rounded-sm border-0">
                    <p className="text-xs text-[#4a9eff] mb-2">Automatic Mode</p>
                    <p className="text-xs text-[#f5f5f7]/70">
                      The system will automatically generate a prompt based on the agent information you provided.
                      This is the simplest way to get started.
                    </p>
                  </div>
                )}

                {promptMode === 'template' && (
                  <div className="space-y-3">
                    <Label className="text-[#f5f5f7]/80 font-normal text-xs">Select a Template</Label>
                    {loadingTemplates ? (
                      <div className="flex items-center gap-2 text-xs text-[#f5f5f7]/70">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#f5f5f7]/40"></div>
                        Loading templates...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className={`p-3 rounded-md border-0 cursor-pointer transition-all ${
                              selectedTemplate === template.id
                                ? 'bg-[#3a3b3d] text-[#f5f5f7]'
                                : 'bg-[#2a2b2d] text-[#f5f5f7]/70 hover:bg-[#3a3b3d]/50'
                            }`}
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              applyTemplate(template.id);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-normal text-xs text-[#f5f5f7]">{template.name}</h4>
                                <p className="text-xs text-[#f5f5f7]/70 mt-1">{template.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.variables && template.variables.map((variable: string) => (
                                    <span key={variable} className="px-2 py-1 bg-[#3a3b3d] text-[#f5f5f7]/80 rounded text-xs">
                                      {variable}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {selectedTemplate === template.id && (
                                <CheckCircle className="h-4 w-4 text-[#4a9eff] flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </div>
                        ))}
                        {templates.length === 0 && (
                          <p className="text-xs text-[#f5f5f7]/60 text-center py-4">
                            No templates available for this goal
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {(promptMode === 'custom' || promptMode === 'template') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#f5f5f7]/80 font-normal text-xs">System Prompt</Label>
                      <span className="text-[#f5f5f7]/40 text-[10px]">Use variables: {'{companyName}'}, {'{product}'}, {'{mainPain}'}, {'{successCase}'}, {'{priceObjection}'}</span>
                    </div>
                    <Textarea
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
                      placeholder="You are an AI assistant for [Company Name]..."
                      rows={6}
                      className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40 min-h-[120px] font-mono"
                    />
                  </div>
                )}

                {/* Prompt Preview */}
                {formData.systemPrompt && (
                  <div className="space-y-2">
                    <Label className="text-[#f5f5f7]/80 font-normal text-xs">Prompt Preview</Label>
                    <div className="p-3 bg-[#2a2b2d] rounded-sm border border-[#3a3b3d]/30 text-xs text-[#f5f5f7]/70 font-mono whitespace-pre-wrap">
                      {formData.systemPrompt
                        .replace(/{companyName}/g, formData.companyName || '[Company Name]')
                        .replace(/{product}/g, formData.product || '[Product/Service]')
                        .replace(/{mainPain}/g, formData.mainPain || '[Main Problem]')
                        .replace(/{successCase}/g, formData.successCase || '[Success Case]')
                        .replace(/{priceObjection}/g, formData.priceObjection || '[Price Objection Response]')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Settings - Seção 3 */}
            <div className="space-y-4 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#3a3b3d] text-[#f5f5f7] rounded-full flex items-center justify-center text-sm font-normal">3</div>
                <h3 className="text-[#f5f5f7] text-sm font-medium">Advanced Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Max Tokens</Label>
                  <Input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({...formData, maxTokens: parseInt(e.target.value) || 150})}
                    min="10"
                    max="4000"
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Temperature</Label>
                  <Input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value) || 0.7})}
                    min="0"
                    max="2"
                    step="0.1"
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Max Messages/Minute</Label>
                  <Input
                    type="number"
                    value={formData.maxMessagesPerMinute}
                    onChange={(e) => setFormData({...formData, maxMessagesPerMinute: parseInt(e.target.value) || 5})}
                    min="1"
                    max="60"
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Max Consecutive Responses</Label>
                  <Input
                    type="number"
                    value={formData.maxConsecutiveResponses}
                    onChange={(e) => setFormData({...formData, maxConsecutiveResponses: parseInt(e.target.value) || 3})}
                    min="1"
                    max="10"
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Cooldown (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.cooldownMinutes}
                    onChange={(e) => setFormData({...formData, cooldownMinutes: parseInt(e.target.value) || 30})}
                    min="0"
                    max="1440"
                    className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#f5f5f7]/80 font-normal text-xs">Auto-configure Webhook</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.autoConfigureWebhook}
                      onCheckedChange={(checked) => setFormData({...formData, autoConfigureWebhook: checked})}
                      className="bg-[#3a3b3d] data-[state=checked]:bg-[#4a9eff]"
                    />
                    <span className="text-xs text-[#f5f5f7]/70">
                      {formData.autoConfigureWebhook ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem de Fallback */}
            <div className="space-y-2 p-4 bg-[#2a2b2d]/70 rounded-md border-0">
              <Label className="text-[#f5f5f7]/80 font-normal text-xs">Fallback Message</Label>
              <Textarea
                value={formData.fallbackMessage}
                onChange={(e) => setFormData({...formData, fallbackMessage: e.target.value})}
                placeholder="Message sent when there is an error or limit reached..."
                className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-sm focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40 min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
              className="bg-transparent hover:bg-[#2a2b2d] text-[#f5f5f7]/70 border-[#3a3b3d] text-xs rounded-sm h-7"
            >
              Cancel
            </Button>
            <Button 
              onClick={createAgent}
              className="bg-[#4a9eff] hover:bg-[#3a8eff] text-white text-xs rounded-sm h-7"
              disabled={creating || !formData.instanceId}
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#f5f5f7] mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Agent'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
} 