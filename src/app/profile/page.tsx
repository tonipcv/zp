'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSession } from "next-auth/react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: {
    name: string;
    type: string;
  };
  tokensUsed: number;
  tokensLimit: number;
  credits?: number;
  maxCredits?: number;
  instances: {
    count: number;
    limit: number;
  };
  agents: {
    count: number;
    limit: number;
  };
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch user profile data from API
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile data...');
        
        // Tentar a API de perfil com retry em caso de falha
        let attempts = 0;
        const maxAttempts = 3;
        let profileData = null;
        
        while (attempts < maxAttempts && !profileData) {
          try {
            attempts++;
            console.log(`Tentativa ${attempts} de ${maxAttempts} para buscar perfil`);
            
            const response = await fetch('/api/user/profile');
            console.log('Profile API response status:', response.status);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch profile: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Profile API response data:', data);
            
            if (data && !data.error) {
              profileData = data;
              
              setProfile(profileData);
              console.log('Perfil carregado com sucesso:', profileData);
              break;
            }
          } catch (retryError) {
            console.error(`Tentativa ${attempts} falhou:`, retryError);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de tentar novamente
          }
        }
        
        // Se todas as tentativas falharem, usar dados de fallback
        if (!profileData) {
          throw new Error('Todas as tentativas de buscar o perfil falharam');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use minimal fallback data if API fails (sem placeholders de créditos)
        const isAdmin = session?.user?.email === 'xppsalvador@gmail.com';
        // Não injetar valores fake de créditos
        
        // Usar "Free" como plano padrão para corresponder ao backend
        setProfile({
          id: session?.user?.id || 'usr_' + Math.random().toString(36).substring(2, 10),
          name: session?.user?.name || 'Alberto Alves',
          email: session?.user?.email || 'alberto@empresa.com.br',
          phone: '+55 11 98765-4321',
          plan: {
            name: 'Free',  // Usar "Free" como padrão para corresponder ao backend
            type: 'free'
          },
          tokensUsed: 0,
          tokensLimit: 0,
          instances: {
            count: 0,
            limit: 0
          },
          agents: {
            count: 0,
            limit: 0
          },
          subscription: null
        });
        console.log('Usando dados de fallback para o perfil');
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 bg-[#1c1d20]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5f5f7]"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Header - estilo minimalista como WhatsApp */}
          <div className="mb-4">
            <h1 className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">Profile</h1>
            <p className="text-xs text-[#f5f5f7]/60 tracking-[-0.03em]">Manage your personal information</p>
          </div>

        <div className="space-y-4">
          {/* Informações Pessoais - estilo minimalista */}
          <div>
            <Card className="bg-[#2a2b2d] border-[#3a3b3d]/30 shadow-sm rounded-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-xs text-[#f5f5f7]/60 tracking-[-0.03em]">
                      Update your personal data
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-8 text-xs border-[#4a4b4d] text-[#f5f5f7] hover:bg-[#3a3b3d] hover:border-[#5a5b5d]"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-xs text-[#f5f5f7]/70">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      disabled={!isEditing}
                      className="h-8 mt-1 text-sm bg-[#3a3b3d] border-[#4a4b4d]/30 text-[#f5f5f7] placeholder:text-[#f5f5f7]/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs text-[#f5f5f7]/70">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      className="h-8 mt-1 text-sm bg-[#3a3b3d] border-[#4a4b4d]/30 text-[#f5f5f7] placeholder:text-[#f5f5f7]/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs text-[#f5f5f7]/70">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      disabled={!isEditing}
                      className="h-8 mt-1 text-sm bg-[#3a3b3d] border-[#4a4b4d]/30 text-[#f5f5f7] placeholder:text-[#f5f5f7]/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan" className="text-xs text-[#f5f5f7]/70">Plan</Label>
                    <div className="mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0 h-6 bg-[#3a3b3d]/50 border-[#4a4b4d]/30 ${profile.plan.type === 'unlimited' ? 'text-[#6de67d]' : profile.plan.type === 'premium' ? 'text-[#e6c86d]' : 'text-[#f5f5f7]'}`}
                      >
                        {profile.plan.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" className="h-8 text-xs bg-[#3a3b3d] hover:bg-[#4a4b4d] text-[#f5f5f7]">Save</Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="h-8 text-xs border-[#4a4b4d] text-[#f5f5f7] hover:bg-[#3a3b3d] hover:border-[#5a5b5d]">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cards de informações - estilo minimalista */}
          <div className="grid grid-cols-1 gap-4">
            {profile.credits !== undefined && profile.maxCredits !== undefined && (
            <Card className="bg-[#2a2b2d] border-[#3a3b3d]/30 shadow-sm rounded-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">
                  Message Credits
                </CardTitle>
                <CardDescription className="text-xs text-[#f5f5f7]/60 tracking-[-0.03em]">
                  Available message credits
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#f5f5f7]/70">Available</span>
                    <span className="text-xs font-medium text-[#f5f5f7]">{profile.credits?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#f5f5f7]/70">Total</span>
                    <span className="text-xs font-medium text-[#f5f5f7]">
                      {profile.maxCredits?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="w-full bg-[#3a3b3d] rounded-full h-1.5">
                    <div 
                      className="bg-[#6de67d] h-1.5 rounded-full" 
                      style={{ width: `${Math.min(((profile.credits || 0) / (profile.maxCredits || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-[#f5f5f7]/60">
                    {Math.round(((profile.credits || 0) / (profile.maxCredits || 1)) * 100)}% remaining
                  </p>
                </div>
              </CardContent>
            </Card>
            )}
          </div>
          
          <Card className="bg-[#2a2b2d] border-[#3a3b3d]/30 shadow-sm rounded-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#f5f5f7] tracking-[-0.03em]">
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex justify-between">
                <span className="text-xs text-[#f5f5f7]/70">Plan Name</span>
                <Badge variant="outline" className="text-xs px-2 py-0 h-6 bg-[#3a3b3d]/50 text-[#6de67d] border-[#4a4b4d]/30">
                  {profile.plan.name}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#f5f5f7]/70">Status</span>
                <Badge variant="outline" className="text-xs px-2 py-0 h-6 bg-[#3a3b3d]/50 text-[#6de67d] border-[#4a4b4d]/30">
                  {profile.subscription?.status || 'active'}
                </Badge>
              </div>
              <div className="mt-3">
                <a href="/upgrade">
                  <Button className="w-full h-8 text-xs bg-[#3a3b3d] hover:bg-[#4a4b4d] text-[#f5f5f7]">
                    Upgrade Plan
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </AppLayout>
  );
}
