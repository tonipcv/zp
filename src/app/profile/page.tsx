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
  plan: string;
  tokensUsed: number;
  tokensLimit: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Simular dados do perfil
    if (session?.user) {
      setProfile({
        id: '1',
        name: session.user.name || 'Usuário',
        email: session.user.email || '',
        phone: '+55 11 99999-9999',
        plan: 'Pro',
        tokensUsed: 1250,
        tokensLimit: 5000
      });
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
      <div className="space-y-6 bg-[#1c1d20]">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f7] tracking-tight">Profile</h1>
          <p className="text-[#f5f5f7]/70">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Pessoais */}
          <div className="lg:col-span-2">
            <Card className="bg-[#2a2b2d] border-[#3a3b3d]/30 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#f5f5f7]">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-[#f5f5f7]/70">
                      Update your personal data
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-[#4a4b4d] text-[#f5f5f7] hover:bg-[#3a3b3d] hover:border-[#5a5b5d]"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-[#f5f5f7]">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      disabled={!isEditing}
                      className="mt-1 bg-[#3a3b3d] border-[#4a4b4d]/30 text-[#f5f5f7] placeholder:text-[#f5f5f7]/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#f5f5f7]">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      className="mt-1 bg-[#3a3b3d] border-[#4a4b4d]/30 text-[#f5f5f7] placeholder:text-[#f5f5f7]/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#f5f5f7]">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      disabled={!isEditing}
                      className="mt-1 bg-[#3a3b3d] border-[#4a4b4d]/30 text-[#f5f5f7] placeholder:text-[#f5f5f7]/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan" className="text-[#f5f5f7]">Plan</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#f5f5f7] border-[#4a4b4d]/30">
                        {profile.plan}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="bg-[#3a3b3d] hover:bg-[#4a4b4d] text-[#f5f5f7]">Save</Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="border-[#4a4b4d] text-[#f5f5f7] hover:bg-[#3a3b3d] hover:border-[#5a5b5d]">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas */}
          <div className="space-y-6">
            <Card className="bg-[#2a2b2d] border-[#3a3b3d]/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#f5f5f7]">
                  Token Usage
                </CardTitle>
                <CardDescription className="text-[#f5f5f7]/70">
                  Monthly AI consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#f5f5f7]/70">Used</span>
                    <span className="font-medium text-[#f5f5f7]">{profile.tokensUsed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#f5f5f7]/70">Limit</span>
                    <span className="font-medium text-[#f5f5f7]">{profile.tokensLimit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#3a3b3d] rounded-full h-2">
                    <div 
                      className="bg-[#4a6bbd] h-2 rounded-full" 
                      style={{ width: `${(profile.tokensUsed / profile.tokensLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#f5f5f7]/70">
                    {Math.round((profile.tokensUsed / profile.tokensLimit) * 100)}% used
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2b2d] border-[#3a3b3d]/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#f5f5f7]">
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#f5f5f7]/70">Active Instances</span>
                  <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#6de67d] border-[#4a4b4d]/30">
                    3
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f5f5f7]/70">AI Agents</span>
                  <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#6d9ee6] border-[#4a4b4d]/30">
                    5
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f5f5f7]/70">Messages Today</span>
                  <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#c76de6] border-[#4a4b4d]/30">
                    127
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
