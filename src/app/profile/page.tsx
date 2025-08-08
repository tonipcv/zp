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
        
        // Try the test API first to verify basic functionality
        const testResponse = await fetch('/api/user/test');
        console.log('Test API response status:', testResponse.status);
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Test API response data:', testData);
        }
        
        // Now try the actual profile API
        const response = await fetch('/api/user/profile');
        console.log('Profile API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Profile API response data:', data);
        
        // Use real data from API
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use fallback data if API fails
        setProfile({
          id: session?.user?.email || 'user-id',
          name: session?.user?.name || 'User Name',
          email: session?.user?.email || 'user@example.com',
          phone: '',
          plan: {
            name: session?.user?.email === 'xppsalvador@gmail.com' ? 'Unlimited' : 'Free',
            type: session?.user?.email === 'xppsalvador@gmail.com' ? 'unlimited' : 'free'
          },
          tokensUsed: 0,
          tokensLimit: session?.user?.email === 'xppsalvador@gmail.com' ? 999999 : 10000,
          instances: {
            count: 0,
            limit: session?.user?.email === 'xppsalvador@gmail.com' ? 999 : 1
          },
          agents: {
            count: 0,
            limit: session?.user?.email === 'xppsalvador@gmail.com' ? 999 : 1
          },
          subscription: null
        });
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
                      <Badge 
                        variant="outline" 
                        className={`bg-[#3a3b3d]/50 border-[#4a4b4d]/30 ${profile.plan.type === 'unlimited' ? 'text-[#6de67d]' : profile.plan.type === 'premium' ? 'text-[#e6c86d]' : 'text-[#f5f5f7]'}`}
                      >
                        {profile.plan.name}
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
                    <span className="font-medium text-[#f5f5f7]">
                      {profile.plan.type === 'unlimited' ? 'Unlimited' : profile.tokensLimit.toLocaleString()}
                    </span>
                  </div>
                  {profile.plan.type !== 'unlimited' && (
                    <>
                      <div className="w-full bg-[#3a3b3d] rounded-full h-2">
                        <div 
                          className="bg-[#4a6bbd] h-2 rounded-full" 
                          style={{ width: `${Math.min((profile.tokensUsed / profile.tokensLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#f5f5f7]/70">
                        {Math.round((profile.tokensUsed / profile.tokensLimit) * 100)}% used
                      </p>
                    </>
                  )}
                  {profile.subscription && (
                    <div className="mt-2 pt-2 border-t border-[#3a3b3d]/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#f5f5f7]/70">Renewal</span>
                        <span className="font-medium text-[#f5f5f7]">
                          {new Date(profile.subscription.currentPeriodEnd).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#f5f5f7]/70">Status</span>
                        <Badge 
                          variant="outline" 
                          className={`bg-[#3a3b3d]/50 border-[#4a4b4d]/30 ${profile.subscription.status === 'active' ? 'text-[#6de67d]' : 'text-[#e67d6d]'}`}
                        >
                          {profile.subscription.status}
                        </Badge>
                      </div>
                    </div>
                  )}
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
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#6de67d] border-[#4a4b4d]/30">
                      {profile.instances.count}
                    </Badge>
                    {profile.plan.type !== 'unlimited' && (
                      <span className="text-xs text-[#f5f5f7]/50">
                        / {profile.instances.limit}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f5f5f7]/70">AI Agents</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-[#3a3b3d]/50 text-[#6d9ee6] border-[#4a4b4d]/30">
                      {profile.agents.count}
                    </Badge>
                    {profile.plan.type !== 'unlimited' && (
                      <span className="text-xs text-[#f5f5f7]/50">
                        / {profile.agents.limit}
                      </span>
                    )}
                  </div>
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
