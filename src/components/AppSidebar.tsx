'use client';

import { useState } from 'react';
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
        title: "Instances",
        url: "/whatsapp",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "AI",
    items: [
      {
        title: "AI Agent",
        url: "/ai-agent",
        icon: Bot,
      },
      {
        title: "Knowledge",
        url: "/ai-agent/knowledge",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Plans",
        url: "/planos",
        icon: CreditCard,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <Sidebar variant="sidebar" className="border-none bg-[#1c1d20]" style={{"--sidebar-width": "11rem"} as React.CSSProperties}>
      <SidebarHeader className="border-none bg-[#1c1d20]">
        <div className="flex items-center px-3 py-3">
          <div className="flex items-center">
            <span className="text-xs font-medium text-[#f5f5f7] tracking-tight">
              Cxlus AI
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-transparent py-1">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title} className="px-1.5 py-1.5">
            <SidebarGroupLabel className="text-[10px] font-medium text-[#f5f5f7]/60 px-2 pb-1">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={pathname ? (pathname === item.url || pathname.startsWith(item.url + '/')) : false}
                      className="h-7 w-full flex items-center px-2 rounded-md text-xs transition-all duration-200 data-[active=true]:bg-[#2a2b2d] data-[active=true]:text-[#f5f5f7] hover:bg-[#2a2b2d]/50 text-[#f5f5f7]/80"
                      aria-label={item.title}
                    >
                      <Link href={item.url} className="flex items-center w-full">
                        <item.icon className="h-3.5 w-3.5 stroke-[1.5] flex-shrink-0 mr-2" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-none bg-[#1c1d20] p-1.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="h-7 w-full flex items-center px-2 rounded-md text-xs text-[#f5f5f7]/80 hover:bg-[#2a2b2d]/50 hover:text-[#f5f5f7] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
            >
              <LogOut className="h-3.5 w-3.5 stroke-[1.5] mr-2" />
              <span>Logout</span>
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
        <main className="flex-1 flex flex-col">
          <header className="flex h-8 items-center gap-1 border-none bg-[#1c1d20] px-2">
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
          <div className="flex-1 bg-[#1c1d20]">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 