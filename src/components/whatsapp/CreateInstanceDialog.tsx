'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  instanceName: z.string().optional(),
  sessionToken: z.string().optional(),
  webhookUrl: z.string().url().optional().or(z.literal('')),
  autoReconnect: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface CreateInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export function CreateInstanceDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateInstanceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [checkingName, setCheckingName] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: '',
      sessionToken: '',
      webhookUrl: '',
      autoReconnect: true,
    },
  });

  const instanceName = form.watch('instanceName');

  // Verificar disponibilidade do nome em tempo real
  useEffect(() => {
    const checkNameAvailability = async () => {
      if (!instanceName || instanceName.trim().length < 2) {
        setNameAvailable(null);
        setSuggestedNames([]);
        return;
      }

      setCheckingName(true);
      try {
        const response = await fetch('/api/whatsapp/instances/check-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instanceName: instanceName.trim() }),
        });

        const data = await response.json();
        setNameAvailable(data.available);

        if (!data.available && data.suggestions) {
          setSuggestedNames(data.suggestions);
        } else {
          setSuggestedNames([]);
        }
      } catch (error) {
        console.error('Erro ao verificar nome:', error);
        setNameAvailable(null);
        setSuggestedNames([]);
      } finally {
        setCheckingName(false);
      }
    };

    const timeoutId = setTimeout(checkNameAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [instanceName]);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Verificar nome antes de enviar se foi informado
      if (data.instanceName && data.instanceName.trim()) {
        if (nameAvailable === false) {
          toast.error('Nome da instância já está em uso', {
            description: 'Escolha um nome diferente ou use uma das sugestões'
          });
          setLoading(false);
          return;
        }
      }

      // Limpar campos vazios
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return value !== undefined;
        })
      ) as FormData;

      await onSubmit(cleanData);
      form.reset();
      setNameAvailable(null);
      setSuggestedNames([]);
    } catch (error) {
      // Erro já é tratado no componente pai
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.reset();
      setNameAvailable(null);
      setSuggestedNames([]);
      onOpenChange(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('instanceName', suggestion);
  };

  const renderNameStatus = () => {
    if (!instanceName || instanceName.trim().length < 2) return null;

    if (checkingName) {
      return (
        <div className="flex items-center space-x-2 text-xs text-[#f5f5f7]/70">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Checking availability...</span>
        </div>
      );
    }

    if (nameAvailable === true) {
      return (
        <div className="flex items-center space-x-2 text-xs text-[#4a9eff]">
          <CheckCircle className="h-3 w-3" />
          <span>Name available</span>
        </div>
      );
    }

    if (nameAvailable === false) {
      return (
        <div className="flex items-center space-x-2 text-xs text-[#ff4a4a]">
          <XCircle className="h-3 w-3" />
          <span>Name already in use</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-[#1a1b1d] border-[#3a3b3d] text-[#f5f5f7] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-[#f5f5f7] text-lg font-medium">New WhatsApp Instance</DialogTitle>
          <DialogDescription className="text-[#f5f5f7]/60 text-sm">
            Create a new WhatsApp Business instance. Leave the name blank
            for automatic generation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 px-1">
            <FormField
              control={form.control}
              name="instanceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f5f5f7]/80 font-normal text-xs">Instance Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: my-company-wa"
                      {...field}
                      disabled={loading}
                      className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-md focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                    />
                  </FormControl>
                  {renderNameStatus()}
                  <FormDescription className="text-[#f5f5f7]/60 text-xs">
                    If not provided, it will be generated automatically
                  </FormDescription>
                  <FormMessage />
                  
                  {/* Sugestões de nomes */}
                  {suggestedNames.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-[#f5f5f7]/70">
                        <Lightbulb className="h-3 w-3" />
                        <span>Available name suggestions:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestedNames.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-[#3a3b3d] hover:text-[#f5f5f7] border-[#3a3b3d] text-[#f5f5f7]/80 text-xs px-2 py-1 rounded-md"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f5f5f7]/80 font-normal text-xs">Session Token (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste a token from a previous session to reconnect without QR Code"
                      rows={3}
                      {...field}
                      disabled={loading}
                      className="bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-md focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                    />
                  </FormControl>
                  <FormDescription className="text-[#f5f5f7]/60 text-xs">
                    Use to reconnect an existing session without scanning QR Code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f5f5f7]/80 font-normal text-xs">Webhook URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-site.com/webhook/whatsapp"
                      type="url"
                      {...field}
                      disabled={loading}
                      className="h-8 bg-[#2a2b2d] border-0 text-[#f5f5f7] text-xs rounded-md focus:ring-1 focus:ring-[#3a3b3d] placeholder:text-[#f5f5f7]/40"
                    />
                  </FormControl>
                  <FormDescription className="text-[#f5f5f7]/60 text-xs">
                    URL to receive WhatsApp events in real-time
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoReconnect"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border border-[#3a3b3d] p-3 bg-[#2a2b2d]">
                  <div className="space-y-0.5">
                    <FormLabel className="text-xs text-[#f5f5f7] font-normal">Auto Reconnect</FormLabel>
                    <FormDescription className="text-[#f5f5f7]/60 text-xs">
                      Automatically try to reconnect when disconnected
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                      className="data-[state=checked]:bg-[#4a9eff]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="bg-[#1a1b1d] p-4 -m-6 mt-4 border-t border-[#3a3b3d] flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="h-7 bg-transparent border-[#2a2b2d] hover:bg-[#2a2b2d] text-[#f5f5f7]/60 hover:text-[#f5f5f7] text-xs rounded-sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || (!!instanceName && nameAvailable === false)}
                className="h-7 bg-[#2a2b2d] border-0 hover:bg-[#3a3b3d] text-[#f5f5f7]/80 hover:text-[#f5f5f7] text-xs rounded-sm"
              >
                {loading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                Create Instance
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 