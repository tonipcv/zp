'use client'

import { useState } from 'react'
import { signOut } from "next-auth/react"
import { Navigation } from '../components/Navigation'
import { satoshi } from '../fonts/fonts'
import {
  UserCircle,
  Bell,
  CreditCard,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react'

interface MenuItem {
  icon: any
  label: string
  value?: string
  action?: () => void
  highlight?: boolean
}

export default function Perfil() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const menuItems: MenuItem[] = [
    {
      icon: UserCircle,
      label: 'Nome',
      value: 'João Silva'
    },
    {
      icon: Bell,
      label: 'Notificações',
      action: () => console.log('Notificações')
    },
    {
      icon: CreditCard,
      label: 'Assinatura',
      value: 'Premium',
      highlight: true
    },
    {
      icon: ShieldCheck,
      label: 'Privacidade',
      action: () => console.log('Privacidade')
    },
    {
      icon: LogOut,
      label: 'Sair da Conta',
      action: () => setShowLogoutModal(true),
      highlight: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D6D2D3] to-[#F8FFFF] font-normal tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed w-full top-0 bg-[#D6D2D3]/80 backdrop-blur-lg z-50 border-b border-gray-100/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="p-2">
              <span className="text-[#1B2541] text-2xl font-light tracking-[-0.03em] uppercase">
                VUOM
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        {/* Perfil Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[#35426A] mx-auto mb-4 flex items-center justify-center">
            <UserCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#35426A]">
            Meu Perfil
          </h1>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className={`
                bg-white rounded-2xl border border-gray-100 shadow-lg
                p-4 flex items-center justify-between
                ${item.action ? 'cursor-pointer hover:shadow-xl' : ''}
                transition-all duration-300
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.highlight ? 'text-[#35426A]' : 'text-[#7286B2]'}`} />
                <span className={`font-medium ${item.highlight ? 'text-[#35426A]' : 'text-[#7286B2]'}`}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className={`text-sm ${item.highlight ? 'text-[#35426A]' : 'text-[#7286B2]'}`}>
                    {item.value}
                  </span>
                )}
                {item.action && <ChevronRight className="w-4 h-4 text-[#7286B2]" />}
              </div>
            </div>
          ))}
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-4">
            <span className="text-sm text-[#7286B2]">Dias Ativos</span>
            <p className="text-2xl font-bold text-[#35426A]">
              15
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-4">
            <span className="text-sm text-[#7286B2]">Séries Completas</span>
            <p className="text-2xl font-bold text-[#35426A]">
              8
            </p>
          </div>
        </div>
      </main>

      {/* Modal de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-[#35426A]">
              Confirmar Saída
            </h3>
            <p className="text-[#7286B2] mb-6">
              Você tem certeza que deseja sair do aplicativo?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium text-[#7286B2] hover:text-[#35426A] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#35426A] hover:bg-[#7286B2] transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  )
} 