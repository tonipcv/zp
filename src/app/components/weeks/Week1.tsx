import { useState } from 'react'
import { PlayCircle, Clock, ChevronDown } from 'lucide-react'

interface Exercise {
  name: string
  duration: string
  steps: string[]
}

interface Skincare {
  title: string
  treatment?: string
  recipe?: string
  application?: string
  steps?: {
    name: string
    instructions: string
    application?: string
  }[]
  note?: string
}

interface Challenge {
  title: string
  task: string
}

interface LessonContent {
  objective: string
  exercises: Exercise[]
  skincare: Skincare
  challenge: Challenge
}

interface Lesson {
  title: string
  duration: string
  content: LessonContent
}

export function Week1() {
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})

  const lessons: Lesson[] = [
    {
      title: 'Dia 1 - Redução Imediata de Inchaço',
      duration: '25 min',
      content: {
        objective: 'Iniciar o estímulo linfático e a ativação muscular leve',
        exercises: [
          {
            name: 'Exercícios de Face Yoga',
            duration: '5 min',
            steps: [
              'Com os dedos médios, pressione os lados do nariz, deslizando para as orelhas (10x)',
              'Do queixo para as orelhas (10x)',
              'De baixo da mandíbula para o pescoço e clavícula (15x)'
            ]
          },
          {
            name: 'Ativação Orbicular dos Lábios',
            duration: '3 séries',
            steps: [
              'Faça biquinho e empurre os lábios o mais para frente possível',
              'Segure por 10 segundos',
              'Sorria forçado com a boca fechada, mantendo a tensão nas bochechas',
              'Repita o ciclo 3x'
            ]
          },
          {
            name: 'Rolamento dos Olhos + Acupressão',
            duration: '3 min',
            steps: [
              'Olhe lentamente para cima, esquerda, baixo, direita (em círculo), depois inverta',
              'Pressione levemente com o dedo anelar o canto interno dos olhos e mova para o canto externo por 10x'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural',
          treatment: 'Compressa gelada de chá verde ou camomila + cubo de gelo enrolado no pano',
          application: 'Aplicar com movimentos circulares no rosto por 2 min'
        },
        challenge: {
          title: 'Mini Desafio',
          task: 'Tire 1 foto frontal e lateral. Escreva 1 frase: "Minha transformação começou"'
        }
      }
    },
    {
      title: 'Dia 2 - Acordar e Energizar os Músculos',
      duration: '30 min',
      content: {
        objective: 'Estimular circulação profunda + tonificar área dos olhos e bochechas',
        exercises: [
          {
            name: 'Face Tap (Estimulação rítmica)',
            duration: '2 min',
            steps: [
              'Use os dedos para "batucar" de forma leve e rítmica por toda a face',
              '30 segundos por área: testa, olhos, bochechas, queixo e pescoço',
              'Aumenta fluxo sanguíneo e oxigenação'
            ]
          },
          {
            name: 'Exercício do Leão (Lion Face)',
            duration: '3 séries',
            steps: [
              'Inspire fundo',
              'Expire com a língua toda para fora, olhos bem abertos e som forte "haaaa"',
              'Trabalha tensão acumulada + ativa musculatura do pescoço'
            ]
          },
          {
            name: 'Inflar bochechas com ar alternado',
            duration: '4 min',
            steps: [
              'Encha as bochechas de ar',
              'Mova o ar lentamente de uma bochecha para a outra (1 min)',
              'Depois, segure só de um lado por 10 seg. Troque. Repita 5x',
              'Ativa contorno e musculatura interna'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural',
          treatment: 'Máscara de aveia + mel',
          recipe: '1 colher de aveia fina + 1 de mel puro',
          application: 'Deixe por 10 min. Remove toxinas e acalma'
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🎧 Faça os exercícios ouvindo uma música calma e escreva: "Como me sinto após o ritual?"'
        }
      }
    },
    {
      title: 'Dia 3 - Ativação do Contorno + Zona Ocular',
      duration: '35 min',
      content: {
        objective: 'Firmar contorno facial, ativar músculos orbitais e suavizar o olhar cansado',
        exercises: [
          {
            name: 'Lifting Zigomático',
            duration: '3 séries de 10 repetições',
            steps: [
              'Sorria com a boca fechada',
              'Com os dedos médios, pressione levemente os ossos da bochecha',
              'Levante os músculos das bochechas como se estivesse "empurrando o rosto pra cima"',
              'Segure 5 segundos por repetição'
            ]
          },
          {
            name: 'Olhos de Coruja',
            duration: '10 repetições',
            steps: [
              'Posicione os dedos indicadores acima das sobrancelhas',
              'Olhe para frente e tente abrir os olhos o máximo possível enquanto os dedos pressionam suavemente para baixo',
              'Segure por 5 segundos',
              'Estimula a região orbital e levanta o olhar'
            ]
          },
          {
            name: 'Contorno do Pescoço (Kiss the Sky)',
            duration: '3 séries',
            steps: [
              'Olhe para cima, estique o pescoço',
              'Faça um biquinho em direção ao teto e segure por 10 segundos',
              'Ajuda a reduzir a papada e ativa o músculo platisma'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 1',
          treatment: 'Rotina diária com 3 etapas simples',
          steps: [
            {
              name: 'Limpeza',
              instructions: 'Use chá verde frio ou água com algumas gotas de vinagre de maçã como tônico natural'
            },
            {
              name: 'Hidratação',
              instructions: 'Misture 1 colher de sopa de gel de babosa (aloe vera) com 1 colher de chá de óleo vegetal leve (como óleo de coco ou girassol prensado a frio)',
              application: 'Espalhe no rosto com movimentos suaves de baixo para cima'
            },
            {
              name: 'Proteção',
              instructions: 'Use protetor solar natural ou físico após o ritual'
            }
          ],
          note: 'Essa rotina pode ser feita após os exercícios, manhã ou noite'
        },
        challenge: {
          title: 'Mini Desafio do Dia',
          task: 'Escreva: "Qual região do meu rosto mais quero transformar?" E complete com: "Por que essa transformação é importante para mim?"'
        }
      }
    },
    {
      title: 'Dia 4 - Afinar e Esculpir o Maxilar',
      duration: '30 min',
      content: {
        objective: 'Ativar músculos profundos do rosto e afinar visualmente o contorno do maxilar',
        exercises: [
          {
            name: 'Resistência no Queixo',
            duration: '3 séries de 10 seg',
            steps: [
              'Posicione os punhos fechados sob o queixo',
              'Tente empurrar o queixo para baixo enquanto os punhos resistem',
              'Ativa músculos do pescoço e região inferior do rosto'
            ]
          },
          {
            name: 'Mastigação Tensa',
            duration: '30 repetições',
            steps: [
              'Simule uma mastigação exagerada com a boca fechada',
              'Concentre a tensão no maxilar',
              'Em seguida, massageie a lateral do rosto com os dedos (30 segundos)'
            ]
          },
          {
            name: 'Deslizar da Língua',
            duration: '2 minutos',
            steps: [
              'Com a boca fechada, faça a língua contornar por dentro os lábios lentamente (10x para cada lado)',
              'Tonifica lábios, bochechas e contorno labial'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 1',
          treatment: 'Rotina diária com 3 etapas simples',
          steps: [
            {
              name: 'Tônico',
              instructions: 'Chá verde gelado ou vinagre de maçã diluído'
            },
            {
              name: 'Hidratação',
              instructions: 'Babosa + óleo vegetal leve'
            },
            {
              name: 'Proteção',
              instructions: 'Protetor solar (de manhã)'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '📏 Meça com os dedos ou fita o espaço entre queixo e bochecha. Registre. → Acompanhe se esse espaço reduz ao longo do protocolo.'
        }
      }
    },
    {
      title: 'Dia 5 - Levantar o Olhar e Ativar a Testa',
      duration: '25 min',
      content: {
        objective: 'Trabalhar elevação natural da parte superior do rosto e suavizar linhas da testa',
        exercises: [
          {
            name: 'Pressão + Elevação',
            duration: '3 séries',
            steps: [
              'Posicione os dedos acima das sobrancelhas',
              'Tente levantar as sobrancelhas enquanto pressiona para baixo com os dedos',
              'Segure por 10 segundos'
            ]
          },
          {
            name: 'Franzir e Relaxar',
            duration: '10 repetições',
            steps: [
              'Franza a testa com força por 3 segundos, depois relaxe totalmente',
              'Alivia tensão e estimula o músculo frontal'
            ]
          },
          {
            name: 'Piscadas Controladas',
            duration: '3 séries de 10',
            steps: [
              'Posicione os dedos sob os olhos',
              'Pisque com força contra a leve resistência dos dedos'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 1',
          treatment: 'Rotina diária com 3 etapas simples',
          steps: [
            {
              name: 'Tônico',
              instructions: 'Chá verde gelado ou vinagre de maçã diluído'
            },
            {
              name: 'Hidratação',
              instructions: 'Babosa + óleo vegetal leve'
            },
            {
              name: 'Proteção',
              instructions: 'Protetor solar (de manhã)'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🪞 Pratique sorrir suavemente com os olhos. Observe como o rosto responde. → Treinar o "olhar expressivo" natural, sem depender de procedimentos estéticos.'
        }
      }
    },
    {
      title: 'Dia 6 - Reconectar Corpo e Rosto',
      duration: '30 min',
      content: {
        objective: 'Ampliar controle muscular e reforçar simetria facial',
        exercises: [
          {
            name: 'Isometria do Sorriso',
            duration: '3x 30 segundos',
            steps: [
              'Sorria com a boca fechada, tensão nas bochechas',
              'Segure por 30 segundos',
              'Mentalize "meu rosto está ativo"'
            ]
          },
          {
            name: 'Elevação Alternada das Sobrancelhas',
            duration: '2 minutos',
            steps: [
              'Tente levantar uma sobrancelha por vez',
              'Se não conseguir, use os dedos para treinar o movimento com ajuda'
            ]
          },
          {
            name: 'Bochechas de Ar com Pressão',
            duration: '3 séries de 30 seg',
            steps: [
              'Encha as bochechas de ar e pressione levemente com os dedos enquanto segura'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 1',
          treatment: 'Rotina diária com 3 etapas simples',
          steps: [
            {
              name: 'Tônico',
              instructions: 'Chá verde gelado ou vinagre de maçã diluído'
            },
            {
              name: 'Hidratação',
              instructions: 'Babosa + óleo vegetal leve'
            },
            {
              name: 'Proteção',
              instructions: 'Protetor solar (de manhã)'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🧘‍♀️ Feche os olhos por 2 minutos e visualize seu rosto mais firme, jovem e simétrico. → Conexão mente-músculo aumenta os resultados.'
        }
      }
    },
    {
      title: 'Dia 7 - Ritual Completo + Autoavaliação',
      duration: '45 min',
      content: {
        objective: 'Aplicar todos os estímulos da semana, revisar evolução e criar consciência de progresso',
        exercises: [
          {
            name: 'Ritual Completo de Face Yoga',
            duration: '15 minutos',
            steps: [
              'Drenagem linfática (2 min)',
              'Lifting zigomático (2 min)',
              'Lion Face (2 min)',
              'Olhos de coruja (2 min)',
              'Kiss the Sky (2 min)',
              'Deslizar da língua (2 min)',
              'Pressão com elevação (testa) (2 min)',
              'Cada exercício: 2 minutos com foco na respiração e intenção'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 1',
          treatment: 'Rotina diária com 3 etapas simples',
          steps: [
            {
              name: 'Tônico',
              instructions: 'Chá verde gelado ou vinagre de maçã diluído'
            },
            {
              name: 'Hidratação',
              instructions: 'Babosa + óleo vegetal leve'
            },
            {
              name: 'Proteção',
              instructions: 'Protetor solar (de manhã)'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio - Avaliação Semanal',
          task: '📸 Tire uma nova selfie frontal e lateral na mesma posição do Dia 1.\n\n📝 Compare e responda:\n- O que mudou?\n- Onde sente mais ativação?\n- O que foi mais difícil?\n- O que mais gostou?'
        }
      }
    }
  ]

  const toggleLesson = (index: number) => {
    setExpandedLessons(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-[#35426A]">
        Semana 1 - Drenar, Ativar e Descongestionar
      </h2>

      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const isExpanded = expandedLessons[index]
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleLesson(index)}
                className="w-full flex items-center justify-between p-4 bg-[#F8F9FB] hover:bg-[#F0F2F5] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-[#35426A] group-hover:text-[#7286B2] transition-colors" />
                  <span className="text-sm font-medium text-[#35426A] group-hover:text-[#7286B2] transition-colors">
                    {lesson.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#7286B2]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{lesson.duration}</span>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Objective */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#35426A] mb-2">
                      Objetivo
                    </h4>
                    <p className="text-sm text-[#7286B2]">
                      {lesson.content.objective}
                    </p>
                  </div>

                  {/* Exercises */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#35426A] mb-3">
                      Exercícios
                    </h4>
                    <div className="space-y-4">
                      {lesson.content.exercises.map((exercise, i) => (
                        <div key={i} className="bg-[#F8F9FB] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-[#35426A]">
                              {exercise.name}
                            </h4>
                            <span className="text-xs text-[#7286B2] px-2 py-1 bg-[#35426A]/5 rounded-full">
                              {exercise.duration}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {exercise.steps.map((step, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-[#7286B2]">
                                <span className="text-[#35426A] mt-1">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skincare */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#35426A] mb-3">
                      Skincare
                    </h4>
                    <div className="bg-[#F8F9FB] rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-[#35426A] mb-3">
                        {lesson.content.skincare.title}
                      </h5>
                      {lesson.content.skincare.treatment && (
                        <p className="text-sm text-[#7286B2] mb-2">
                          {lesson.content.skincare.treatment}
                        </p>
                      )}
                      {lesson.content.skincare.recipe && (
                        <p className="text-sm text-[#7286B2] mb-2">
                          Receita: {lesson.content.skincare.recipe}
                        </p>
                      )}
                      {lesson.content.skincare.application && (
                        <p className="text-sm text-[#7286B2] mb-2">
                          {lesson.content.skincare.application}
                        </p>
                      )}
                      {lesson.content.skincare.steps && (
                        <div className="space-y-3">
                          {lesson.content.skincare.steps.map((step, i) => (
                            <div key={i} className="text-sm text-[#7286B2]">
                              <span className="font-semibold text-[#35426A]">{step.name}:</span>{' '}
                              {step.instructions}
                              {step.application && (
                                <p className="text-xs mt-1 text-[#7286B2]/80">{step.application}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {lesson.content.skincare.note && (
                        <p className="text-xs mt-3 text-[#7286B2]/80 italic">
                          {lesson.content.skincare.note}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Challenge */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#35426A] mb-3">
                      {lesson.content.challenge.title}
                    </h4>
                    <div className="bg-gradient-to-r from-[#35426A] to-[#7286B2] rounded-lg p-4">
                      <p className="text-sm text-white whitespace-pre-line">
                        {lesson.content.challenge.task}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 