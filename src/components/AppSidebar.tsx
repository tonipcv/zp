'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Bot,
  MessageSquare,
  ShoppingCart,
  BookOpen,
  User,
  Settings,
  CreditCard,
  BarChart3,
  Users,
  Zap,
  Home,
  Menu,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  {
    title: "WhatsApp",
    items: [
      {
        title: "Instâncias",
        url: "/whatsapp",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "IA",
    items: [
      {
        title: "Agente IA",
        url: "/ai-agent",
        icon: Bot,
      },
    ],
  },
  {
    title: "Configurações",
    items: [
      {
        title: "Perfil",
        url: "/profile",
        icon: User,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setIsLoggingOut(false);
    }
  };

  // Determine admin by comparing session email with NEXT_PUBLIC_EMAIL_ADMIN
  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) return;
        const data = await res.json();
        const sessionEmail: string | undefined = data?.user?.email;
        const adminEmail = process.env.NEXT_PUBLIC_EMAIL_ADMIN;
        if (mounted) {
          setIsAdmin(
            !!sessionEmail && !!adminEmail && sessionEmail.toLowerCase() === adminEmail.toLowerCase()
          );
        }
      } catch (e) {
        // silent fail, no admin
      }
    };
    checkAdmin();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Sidebar
      variant="inset"
      className="bg-[#1c1d20] border-r border-white/10 w-14 md:w-48"
    >
      <SidebarHeader className="border-b border-white/10 bg-[#1c1d20] px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-sm bg-white/10" />
          <span className="hidden md:inline text-[10px] font-medium text-[#f5f5f7]/80 tracking-tight">
            Xase AI
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-transparent py-2">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title} className="px-2 py-2">
            <SidebarGroupLabel className="hidden md:block px-2 pb-1 text-[9px] uppercase tracking-wide text-[#f5f5f7]/40">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname ? (pathname === item.url || pathname.startsWith(item.url + '/')) : false;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="h-7 w-full px-2 gap-2 rounded-md justify-start text-xs transition-colors data-[active=true]:bg-white/10 data-[active=true]:text-white hover:bg-white/5 text-[#f5f5f7]/80"
                        aria-label={item.title}
                      >
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 stroke-[1.6] flex-shrink-0" />
                          <span className="hidden md:inline">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {isAdmin && (
          <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="hidden md:block px-2 pb-1 text-[9px] uppercase tracking-wide text-[#6de67d]/70">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {[{ title: 'Users', url: '/admin/users', icon: Users }, { title: 'AI Models', url: '/admin/models', icon: Settings }].map((item) => {
                  const active = pathname ? (pathname === item.url || pathname.startsWith(item.url + '/')) : false;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="h-7 w-full px-2 gap-2 rounded-md justify-start text-xs transition-colors data-[active=true]:bg-white/10 data-[active=true]:text-white hover:bg-white/5 text-[#f5f5f7]/80"
                        aria-label={item.title}
                      >
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 stroke-[1.6] flex-shrink-0" />
                          <span className="hidden md:inline">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-[#1c1d20] p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-7 w-full px-2 gap-2 rounded-md justify-start text-xs text-[#f5f5f7]/70 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4 stroke-[1.6]" />
              <span className="hidden md:inline">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#1c1d20]">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-8 flex items-center border-none bg-[#1c1d20] px-2">
            <SidebarTrigger className="md:hidden text-[#f5f5f7]/60 hover:text-[#f5f5f7]" />
            
            {/* Logo no mobile */}
            <div className="flex items-center md:hidden">
              <span className="text-xs font-medium text-[#f5f5f7] tracking-tight">
                -
              </span>
            </div>
            
            <div className="flex-1" />
            <Button variant="ghost" size="icon" className="hover:bg-[#2a2b2d]/50 h-5 w-5 text-[#f5f5f7]/60 hover:text-[#f5f5f7]">
              <Settings className="h-3 w-3" />
            </Button>
          </header>
          <div className="flex-1 flex bg-[#1c1d20]">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
 