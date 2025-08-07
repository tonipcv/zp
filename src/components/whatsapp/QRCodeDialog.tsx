'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppInstance {
  id: string;
  instanceName: string;
  status: string;
  qrCode?: string;
  connectedNumber?: string;
}

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: WhatsAppInstance | null;
  onStatusChange?: () => void;
}

export function QRCodeDialog({ 
  open, 
  onOpenChange, 
  instance,
  onStatusChange 
}: QRCodeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(instance?.status || '');
  const [qrCode, setQrCode] = useState(instance?.qrCode || '');
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (instance) {
      setCurrentStatus(instance.status);
      setQrCode(instance.qrCode || '');
    }
  }, [instance]);

  // Polling para verificar status automaticamente
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (open && instance && (currentStatus === 'CONNECTING' || currentStatus === 'CREATED')) {
      setPolling(true);
      interval = setInterval(async () => {
        await checkStatus();
      }, 3000); // Verificar a cada 3 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      setPolling(false);
    };
  }, [open, instance, currentStatus]);

  const refreshQRCode = async () => {
    if (!instance) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/qrcode`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao obter QR Code');
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      
      // Atualizar instância com código de pareamento se disponível
      if (data.pairingCode && instance) {
        (instance as any).pairingCode = data.pairingCode;
      }
      
      toast.success('QR Code atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar QR Code:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar QR Code');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!instance) return;

    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/status`);
      if (!response.ok) return;

      const data = await response.json();
      const newStatus = data.status;
      
      if (newStatus !== currentStatus) {
        setCurrentStatus(newStatus);
        
        if (newStatus === 'CONNECTED') {
          toast.success('WhatsApp conectado com sucesso!');
          onStatusChange?.();
        } else if (newStatus === 'DISCONNECTED') {
          toast.error('WhatsApp desconectado');
          onStatusChange?.();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return {
          color: 'bg-[#4a9eff]',
          icon: CheckCircle,
          text: 'Connected',
          description: 'WhatsApp connected and ready to use'
        };
      case 'CONNECTING':
        return {
          color: 'bg-[#f5ca4a]',
          icon: RefreshCw,
          text: 'Connecting',
          description: 'Waiting for QR Code scan'
        };
      case 'DISCONNECTED':
        return {
          color: 'bg-[#ff4a4a]',
          icon: XCircle,
          text: 'Disconnected',
          description: 'WhatsApp disconnected'
        };
      default:
        return {
          color: 'bg-[#3a3b3d]',
          icon: Smartphone,
          text: status || 'Created',
          description: 'Instance created'
        };
    }
  };

  if (!instance) return null;

  const statusInfo = getStatusInfo(currentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-[#1a1b1d] border-[#3a3b3d] text-[#f5f5f7] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-[#f5f5f7] text-lg font-medium">Connect WhatsApp</DialogTitle>
          <DialogDescription className="text-[#f5f5f7]/60 text-sm">
            Scan the QR Code with your WhatsApp to connect instance "{instance.instanceName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-1">
          {/* Status Card */}
          <Card className="bg-[#2a2b2d] border-[#3a3b3d] rounded-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 text-[#f5f5f7] font-medium">
                  <StatusIcon className={`h-4 w-4 ${polling && statusInfo.icon === RefreshCw ? 'animate-spin' : ''}`} />
                  Connection Status
                </CardTitle>
                <Badge className={`${statusInfo.color} text-white text-xs px-2 py-1 rounded-md border-0`}>
                  {statusInfo.text}
                </Badge>
              </div>
              <CardDescription className="text-[#f5f5f7]/60 text-xs">
                {statusInfo.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* QR Code Display */}
          {currentStatus !== 'CONNECTED' && (
            <Card className="bg-[#2a2b2d] border-[#3a3b3d] rounded-md">
              <CardContent className="p-4">
                {instance.qrCode ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="bg-white p-3 rounded-md border border-[#3a3b3d]">
                      <img 
                        src={instance.qrCode} 
                        alt="WhatsApp QR Code" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <p className="text-xs text-[#f5f5f7]/80">
                        1. Open WhatsApp on your phone
                      </p>
                      <p className="text-xs text-[#f5f5f7]/80">
                        2. Tap Menu or Settings and select Linked Devices
                      </p>
                      <p className="text-xs text-[#f5f5f7]/80">
                        3. Tap on Link a Device
                      </p>
                      <p className="text-xs text-[#f5f5f7]/80">
                        4. Point your phone to this screen to capture the code
                      </p>
                    </div>

                    {(instance as any)?.pairingCode && (
                      <div className="text-center p-3 bg-[#2a2b2d] rounded-md border border-[#3a3b3d]">
                        <p className="text-xs text-[#4a9eff] font-medium">
                          Pairing Code (alternative):
                        </p>
                        <p className="text-sm font-mono font-bold text-[#f5f5f7]">
                          {(instance as any).pairingCode}
                        </p>
                        <p className="text-xs text-[#f5f5f7]/60 mt-1">
                          Enter this code in WhatsApp if you can't scan the QR
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={refreshQRCode}
                      disabled={loading}
                      className="h-7 text-xs bg-transparent border-[#3a3b3d] text-[#f5f5f7]/80 hover:bg-[#3a3b3d] hover:text-[#f5f5f7] rounded-sm"
                    >
                      {loading ? (
                        <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1.5" />
                      )}
                      Refresh QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 py-6">
                    <Smartphone className="h-12 w-12 text-[#f5f5f7]/40" />
                    <p className="text-[#f5f5f7]/60 text-center text-xs">
                      QR Code not available. Click "Generate QR Code" to create a new one.
                    </p>
                    <Button 
                      onClick={refreshQRCode} 
                      disabled={loading}
                      className="h-7 bg-[#2a2b2d] border-0 hover:bg-[#3a3b3d] text-[#f5f5f7]/80 hover:text-[#f5f5f7] text-xs rounded-sm"
                    >
                      {loading ? (
                        <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1.5" />
                      )}
                      Generate QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {currentStatus === 'CONNECTED' && (
            <Card className="border-[#3a3b3d] bg-[#2a2b2d] rounded-md">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 text-[#4a9eff]">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium text-xs">
                    WhatsApp connected successfully!
                  </span>
                </div>
                {instance.connectedNumber && (
                  <p className="text-xs text-[#f5f5f7]/80 mt-1">
                    Connected number: {instance.connectedNumber}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-[#1a1b1d] p-4 -m-6 mt-4 border-t border-[#3a3b3d] flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-7 bg-transparent border-[#2a2b2d] hover:bg-[#2a2b2d] text-[#f5f5f7]/60 hover:text-[#f5f5f7] text-xs rounded-sm"
          >
            {currentStatus === 'CONNECTED' ? 'Done' : 'Close'}
          </Button>
          {(currentStatus === 'CONNECTING' || currentStatus === 'CREATED') && (
            <Button 
              onClick={checkStatus} 
              disabled={loading || polling}
              className="h-7 bg-[#2a2b2d] border-0 hover:bg-[#3a3b3d] text-[#f5f5f7]/80 hover:text-[#f5f5f7] text-xs rounded-sm"
            >
              {polling ? (
                <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1.5" />
              )}
              Check Status
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 