/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useState } from 'react'
import { Navigation } from '../components/Navigation'
import { PlayIcon, Dumbbell, Sparkles, Timer, Scale, LockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PLANS = [
  {
    id: 'facekorean-protocol',
    title: "FaceKorean Protocol",
    description: "Premium Korean skincare and facial exercise techniques",
    duration: "8 weeks",
    level: "All Levels",
    icon: Sparkles,
    thumbnail: "/thumbnails/facekorean.jpg",
    color: "from-[#4FACFE] to-[#00F2FE]",
    blocked: false
  },
  {
    id: 'pilates-performance',
    title: "Pilates Performance",
    description: "Advanced techniques for strength, flexibility and body control",
    duration: "12 weeks",
    level: "All Levels",
    icon: Dumbbell,
    thumbnail: "/thumbnails/pilates-performance.jpg",
    color: "from-[#FF6B6B] to-[#FF8E8E]",
    blocked: true
  },
  {
    id: 'advanced-aesthetics',
    title: "Advanced Aesthetics",
    description: "Comprehensive beauty and wellness transformation program",
    duration: "16 weeks",
    level: "Advanced",
    icon: Timer,
    thumbnail: "/thumbnails/aesthetics.jpg",
    color: "from-[#43E97B] to-[#38F9D7]",
    blocked: true
  },
  {
    id: '28days-transformation',
    title: "28 Days Transformation",
    description: "Lose 5kg through scientific approach and personalized guidance",
    duration: "4 weeks",
    level: "All Levels",
    icon: Scale,
    thumbnail: "/thumbnails/transformation.jpg",
    color: "from-[#FA709A] to-[#FEE140]",
    blocked: true
  }
]

export default function SeriesRestrito() {
  const router = useRouter()

  const handlePlanClick = (planId: string, blocked: boolean) => {
    if (blocked) return
    router.push(`/series-restrito/${planId}`)
  }

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
        <h1 className="text-3xl font-bold mb-3 text-[#35426A]">
          Premium Programs
        </h1>
        <p className="text-[#7286B2] mb-12 text-lg">
          Choose your transformation journey
        </p>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => {
            const IconComponent = plan.icon
            return (
              <div 
                key={plan.id}
                onClick={() => handlePlanClick(plan.id, plan.blocked)}
                className={`bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ${plan.blocked ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer group'}`}
              >
                {/* Thumbnail */}
                <div className={`relative h-48 bg-gradient-to-r ${plan.color}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className="w-16 h-16 text-white opacity-90" />
                  </div>
                  {plan.blocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                        <LockIcon className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Coming Soon</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-8">
                  <h2 className={`text-xl font-bold mb-3 ${plan.blocked ? 'text-[#35426A]/70' : 'text-[#35426A] group-hover:text-[#7286B2]'} transition-colors`}>
                    {plan.title}
                  </h2>
                  <p className={`${plan.blocked ? 'text-[#7286B2]/70' : 'text-[#7286B2]'} mb-6`}>
                    {plan.description}
                  </p>

                  {/* Metadados */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`text-sm ${plan.blocked ? 'text-[#7286B2]/70' : 'text-[#7286B2]'}`}>
                      {plan.duration}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full ${plan.blocked ? 'bg-[#35426A]/5 text-[#35426A]/70' : 'bg-[#35426A]/10 text-[#35426A]'} font-medium`}>
                      {plan.level}
                    </span>
                  </div>

                  {/* Botão */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                      plan.blocked 
                        ? 'bg-[#35426A]/50 cursor-not-allowed'
                        : 'bg-[#35426A] hover:bg-[#7286B2] transition-all duration-300'
                    }`}
                    disabled={plan.blocked}
                  >
                    {plan.blocked ? (
                      <>
                        Coming Soon
                        <LockIcon className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Start Program
                        <PlayIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Navigation />
    </div>
  )
} 