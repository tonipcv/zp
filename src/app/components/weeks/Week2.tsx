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

export function Week2() {
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})

  const lessons: Lesson[] = [
    {
      title: 'Dia 8 - Tonificar e Levantar',
      duration: '30 min',
      content: {
        objective: 'Iniciar o trabalho de tonificação muscular e lifting natural',
        exercises: [
          {
            name: 'Elevação Facial Completa',
            duration: '3 séries de 15 seg',
            steps: [
              'Posicione os dedos nas têmporas',
              'Puxe suavemente a pele para cima e para trás',
              'Mantenha a tensão por 15 segundos',
              'Relaxe e repita'
            ]
          },
          {
            name: 'Resistência Zigomática',
            duration: '2 minutos',
            steps: [
              'Sorria amplamente mostrando os dentes',
              'Pressione os dedos contra os cantos da boca',
              'Tente manter o sorriso contra a resistência',
              'Repita 10 vezes'
            ]
          },
          {
            name: 'Yoga Facial para Papada',
            duration: '3 séries',
            steps: [
              'Estique o pescoço para trás',
              'Pressione a língua contra o céu da boca',
              'Mantenha por 10 segundos',
              'Relaxe e repita'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 2',
          treatment: 'Rotina de lifting natural',
          steps: [
            {
              name: 'Limpeza Energizante',
              instructions: 'Misture 1 colher de café de gengibre ralado em água morna, aplique com movimentos circulares'
            },
            {
              name: 'Máscara Tensora',
              instructions: 'Clara de ovo batida + 1 colher de chá de mel',
              application: 'Deixe agir por 15 minutos'
            },
            {
              name: 'Finalização',
              instructions: 'Aplique seu hidratante com movimentos firmes de baixo para cima'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🎯 Defina 3 áreas do rosto que você mais quer tonificar. Foque nelas durante os exercícios.'
        }
      }
    },
    {
      title: 'Dia 9 - Definir e Esculpir',
      duration: '35 min',
      content: {
        objective: 'Trabalhar definição muscular e contornos faciais',
        exercises: [
          {
            name: 'Esculpir Maçãs do Rosto',
            duration: '3x 20 segundos',
            steps: [
              'Sorria mantendo os lábios fechados',
              'Pressione as maçãs do rosto para cima com os dedos médios',
              'Mantenha a pressão e sorria mais intensamente'
            ]
          },
          {
            name: 'Definição Mandibular',
            duration: '2 minutos',
            steps: [
              'Incline a cabeça levemente para trás',
              'Pressione a mandíbula com os dedos',
              'Abra e feche a boca lentamente contra a resistência',
              'Repita 15 vezes'
            ]
          },
          {
            name: 'Lifting Natural de Sobrancelhas',
            duration: '3 séries',
            steps: [
              'Coloque os dedos indicadores acima das sobrancelhas',
              'Tente levantar as sobrancelhas contra a resistência',
              'Mantenha por 5 segundos e relaxe'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 2',
          treatment: 'Rotina de lifting natural',
          steps: [
            {
              name: 'Esfoliação Suave',
              instructions: 'Misture aveia em pó com água de rosas',
              application: 'Massageie gentilmente por 1 minuto'
            },
            {
              name: 'Máscara Firmadora',
              instructions: 'Banana amassada + 1 colher de chá de mel',
              application: 'Aplique por 15 minutos'
            },
            {
              name: 'Hidratação',
              instructions: 'Aplique óleo de rosa mosqueta com movimentos ascendentes'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '📸 Tire fotos do seu perfil direito e esquerdo. Compare a simetria e anote onde precisa focar mais.'
        }
      }
    },
    {
      title: 'Dia 10 - Suavizar e Harmonizar',
      duration: '30 min',
      content: {
        objective: 'Equilibrar tensões e criar harmonia facial',
        exercises: [
          {
            name: 'Relaxamento Frontal',
            duration: '2 minutos',
            steps: [
              'Passe os dedos suavemente da testa até as têmporas',
              'Faça movimentos lentos e rítmicos',
              'Repita 20 vezes'
            ]
          },
          {
            name: 'Harmonização do Sorriso',
            duration: '3 séries',
            steps: [
              'Sorria mostrando os dentes',
              'Pressione os cantos da boca com os dedos',
              'Alterne entre sorrir e relaxar',
              'Repita 10 vezes'
            ]
          },
          {
            name: 'Suavização Periocular',
            duration: '5 minutos',
            steps: [
              'Faça movimentos circulares suaves ao redor dos olhos',
              'Use o dedo anelar para menor pressão',
              'Trabalhe do canto interno ao externo'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 2',
          treatment: 'Rotina de lifting natural',
          steps: [
            {
              name: 'Vapor Facial',
              instructions: 'Faça um vapor com camomila e lavanda por 5 minutos'
            },
            {
              name: 'Máscara Calmante',
              instructions: 'Pepino batido + iogurte natural',
              application: 'Deixe agir por 20 minutos'
            },
            {
              name: 'Finalização',
              instructions: 'Aplique água termal ou chá de camomila gelado'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🧘‍♀️ Antes dos exercícios, faça 5 respirações profundas visualizando seu rosto relaxado e harmonioso.'
        }
      }
    },
    {
      title: 'Dia 11 - Fortalecer e Firmar',
      duration: '35 min',
      content: {
        objective: 'Intensificar o trabalho muscular para maior firmeza',
        exercises: [
          {
            name: 'Fortalecimento Completo',
            duration: '3 séries',
            steps: [
              'Sorria amplamente',
              'Pressione todo o contorno facial com as palmas',
              'Mantenha a pressão por 10 segundos',
              'Relaxe e repita'
            ]
          },
          {
            name: 'Resistência Orbital',
            duration: '2 minutos',
            steps: [
              'Coloque os dedos ao redor dos olhos',
              'Abra os olhos contra a resistência suave',
              'Mantenha por 5 segundos',
              'Repita 12 vezes'
            ]
          },
          {
            name: 'Firmeza Labial',
            duration: '3x 20 segundos',
            steps: [
              'Faça biquinho firme',
              'Tente abrir os lábios mantendo a forma',
              'Resista ao movimento por 20 segundos'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 2',
          treatment: 'Rotina de lifting natural',
          steps: [
            {
              name: 'Limpeza Profunda',
              instructions: 'Argila branca + água de rosas',
              application: 'Aplique por 10 minutos'
            },
            {
              name: 'Tonificação',
              instructions: 'Água de hamamelis gelada'
            },
            {
              name: 'Nutrição',
              instructions: 'Óleo de amêndoas com vitamina E'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '💪 Aumente a intensidade dos exercícios hoje. Sinta a diferença na força muscular.'
        }
      }
    },
    {
      title: 'Dia 12 - Revitalizar e Energizar',
      duration: '30 min',
      content: {
        objective: 'Estimular circulação e energia facial',
        exercises: [
          {
            name: 'Tapotagem Energética',
            duration: '3 minutos',
            steps: [
              'Faça leves batidinhas por todo o rosto',
              'Use as pontas dos dedos',
              'Mantenha um ritmo constante e suave'
            ]
          },
          {
            name: 'Círculos Revitalizantes',
            duration: '2 minutos por região',
            steps: [
              'Faça círculos com os dedos nas bochechas',
              'Mova para a testa e têmporas',
              'Finalize no contorno do maxilar'
            ]
          },
          {
            name: 'Estímulo Zigomático',
            duration: '3 séries',
            steps: [
              'Sorria alternando lados',
              'Pressione as maçãs do rosto',
              'Mantenha 10 segundos cada lado'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 2',
          treatment: 'Rotina de lifting natural',
          steps: [
            {
              name: 'Esfoliação Energizante',
              instructions: 'Café moído + mel',
              application: 'Massageie por 2 minutos'
            },
            {
              name: 'Máscara Vitaminada',
              instructions: 'Mamão papaia amassado + gotinhas de limão',
              application: 'Deixe agir por 15 minutos'
            },
            {
              name: 'Finalização',
              instructions: 'Aplique seu hidratante com movimentos circulares vigorosos'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '✨ Observe seu rosto pela manhã: note a diferença na vitalidade e brilho natural.'
        }
      }
    },
    {
      title: 'Dia 13 - Integrar e Equilibrar',
      duration: '35 min',
      content: {
        objective: 'Criar harmonia entre todas as áreas trabalhadas',
        exercises: [
          {
            name: 'Sequência Integrativa',
            duration: '5 minutos',
            steps: [
              'Comece com respirações profundas',
              'Trabalhe cada área por 30 segundos',
              'Conecte os movimentos suavemente',
              'Finalize com relaxamento consciente'
            ]
          },
          {
            name: 'Equilíbrio Facial',
            duration: '3 séries',
            steps: [
              'Alterne expressões entre lados',
              'Trabalhe simetria do sorriso',
              'Equilibre tensões musculares'
            ]
          },
          {
            name: 'Integração Completa',
            duration: '2 minutos por área',
            steps: [
              'Combine diferentes exercícios aprendidos',
              'Foque na conexão entre as áreas',
              'Mantenha respiração consciente'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 2',
          treatment: 'Rotina de lifting natural',
          steps: [
            {
              name: 'Limpeza Equilibrante',
              instructions: 'Água de rosas + gotinhas de tea tree',
              application: 'Aplique com movimentos suaves'
            },
            {
              name: 'Máscara Nutritiva',
              instructions: 'Abacate amassado + mel + azeite',
              application: 'Deixe agir por 20 minutos'
            },
            {
              name: 'Hidratação Profunda',
              instructions: 'Aplique óleo de jojoba com massagem integrativa'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🎭 Pratique expressões faciais no espelho, observando a simetria e harmonia dos movimentos.'
        }
      }
    },
    {
      title: 'Dia 14 - Avaliar e Progredir',
      duration: '45 min',
      content: {
        objective: 'Revisar progressos e preparar para próxima fase',
        exercises: [
          {
            name: 'Revisão Completa',
            duration: '30 minutos',
            steps: [
              'Pratique os exercícios favoritos da semana',
              'Aumente a intensidade gradualmente',
              'Observe as áreas que mais responderam',
              'Identifique pontos para melhorar'
            ]
          },
          {
            name: 'Sequência Personalizada',
            duration: '15 minutos',
            steps: [
              'Crie sua própria sequência com os exercícios que mais gostou',
              'Adapte os movimentos às suas necessidades',
              'Anote as combinações que funcionaram melhor'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 2',
          treatment: 'Rotina especial de finalização',
          steps: [
            {
              name: 'Limpeza Profunda',
              instructions: 'Escolha sua máscara favorita da semana',
              application: 'Aplique com atenção especial às áreas mais responsivas'
            },
            {
              name: 'Hidratação Intensiva',
              instructions: 'Combine seus produtos naturais preferidos',
              application: 'Massageie com movimentos firmes e precisos'
            },
            {
              name: 'Finalização',
              instructions: 'Aplique gelo facial envolto em gaze para selar os benefícios'
            }
          ],
          note: 'Registre os produtos e combinações que mais funcionaram para você'
        },
        challenge: {
          title: 'Mini Desafio - Avaliação Semanal',
          task: '📊 Compare suas fotos do início e fim da semana:\n- Quais mudanças você percebe?\n- Que áreas mais evoluíram?\n- O que ainda precisa de mais atenção?\n- Defina seus objetivos para a próxima semana'
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
        Semana 2 - Tonificar e Levantar
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