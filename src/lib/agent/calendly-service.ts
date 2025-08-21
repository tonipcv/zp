import { prisma } from '@/lib/prisma'
import { withCalendlyAccessToken } from '@/lib/calendly'

/**
 * Serviço para o agente de IA interagir com o Calendly
 */
export class CalendlyService {
  /**
   * Verifica se o usuário tem uma conexão ativa com o Calendly
   * @param userId ID do usuário
   * @returns true se o usuário tem uma conexão ativa
   */
  static async hasActiveConnection(userId: string): Promise<boolean> {
    const connection = await prisma.calendlyConnection.findUnique({
      where: { userId }
    })
    return !!connection
  }

  /**
   * Obtém os tipos de evento disponíveis para o usuário
   * @param userId ID do usuário
   * @returns Lista de tipos de evento
   */
  static async getAvailableEventTypes(userId: string) {
    const connection = await prisma.calendlyConnection.findUnique({
      where: { userId }
    })
    
    if (!connection) {
      throw new Error('Usuário não tem conexão com o Calendly')
    }
    
    const result = await withCalendlyAccessToken(userId, async (token) => {
      const url = `https://api.calendly.com/event_types?user=${connection.ownerUri}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar tipos de evento: ${response.statusText}`)
      }
      
      return response.json()
    })
    
    // Formatar para uso pelo agente
    return result.collection.map((item: any) => ({
      name: item.name,
      description: item.description || '',
      duration: item.duration,
      url: item.scheduling_url,
      uri: item.uri
    }))
  }

  /**
   * Gera um link de agendamento para um tipo de evento específico
   * @param userId ID do usuário
   * @param eventTypeUri URI do tipo de evento
   * @param inviteeInfo Informações do convidado (opcional)
   * @returns URL para agendamento
   */
  static async getSchedulingLink(
    userId: string, 
    eventTypeUri: string, 
    inviteeInfo?: { name?: string; email?: string; }
  ) {
    const connection = await prisma.calendlyConnection.findUnique({
      where: { userId }
    })
    
    if (!connection) {
      throw new Error('Usuário não tem conexão com o Calendly')
    }
    
    // Buscar detalhes do tipo de evento
    const eventTypes = await this.getAvailableEventTypes(userId)
    const eventType = eventTypes.find((et: any) => et.uri === eventTypeUri)
    
    if (!eventType) {
      throw new Error('Tipo de evento não encontrado')
    }
    
    // Construir URL com parâmetros
    let url = eventType.url
    const params = new URLSearchParams()
    
    if (inviteeInfo?.name) {
      params.append('name', inviteeInfo.name)
    }
    
    if (inviteeInfo?.email) {
      params.append('email', inviteeInfo.email)
    }
    
    // Adicionar parâmetros à URL se existirem
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return url
  }

  /**
   * Cancela um evento agendado
   * @param userId ID do usuário
   * @param eventUri URI do evento
   * @param reason Motivo do cancelamento (opcional)
   */
  static async cancelEvent(userId: string, eventUri: string, reason?: string) {
    const connection = await prisma.calendlyConnection.findUnique({
      where: { userId }
    })
    
    if (!connection) {
      throw new Error('Usuário não tem conexão com o Calendly')
    }
    
    // Verificar se o evento existe no banco
    const event = await prisma.calendlyEvent.findFirst({
      where: { 
        eventUri,
        userId
      }
    })
    
    if (!event) {
      throw new Error('Evento não encontrado')
    }
    
    // Cancelar evento na API do Calendly
    await withCalendlyAccessToken(userId, async (token) => {
      const url = `https://api.calendly.com/scheduled_events/${eventUri.split('/').pop()}/cancellation`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: reason || 'Cancelado pelo sistema'
        })
      })
      
      if (!response.ok) {
        throw new Error(`Erro ao cancelar evento: ${response.statusText}`)
      }
      
      // Atualizar status no banco
      await prisma.calendlyEvent.update({
        where: { id: event.id },
        data: { status: 'canceled' }
      })
      
      return response.json()
    })
    
    return { success: true, message: 'Evento cancelado com sucesso' }
  }

  /**
   * Lista os próximos eventos agendados para o usuário
   * @param userId ID do usuário
   * @returns Lista de eventos
   */
  static async getUpcomingEvents(userId: string) {
    const now = new Date()
    
    const events = await prisma.calendlyEvent.findMany({
      where: {
        userId,
        status: 'scheduled',
        startTime: {
          gte: now
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })
    
    return events.map((event: any) => ({
      id: event.id,
      uri: event.eventUri,
      inviteeName: event.inviteeName,
      inviteeEmail: event.inviteeEmail,
      startTime: event.startTime,
      endTime: event.endTime,
      timezone: event.timezone
    }))
  }
}
