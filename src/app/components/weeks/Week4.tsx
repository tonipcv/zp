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

export function Week4() {
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})

  const lessons: Lesson[] = [
    {
      title: 'Dia 22 - Sustentação e Firmeza',
      duration: '40 min',
      content: {
        objective: 'Consolidar os resultados alcançados e aprimorar a sustentação muscular',
        exercises: [
          {
            name: 'Sustentação Profunda',
            duration: '3 séries de 20 seg',
            steps: [
              'Posicione os dedos nas têmporas e maçãs do rosto',
              'Faça um sorriso amplo e sustente',
              'Pressione levemente para cima e para fora',
              'Mantenha a posição respirando normalmente'
            ]
          },
          {
            name: 'Fortalecimento Orbital Avançado',
            duration: '4 minutos',
            steps: [
              'Posicione os dedos ao redor dos olhos',
              'Abra os olhos contra a resistência dos dedos',
              'Mantenha por 10 segundos',
              'Alterne com piscadas fortes',
              'Repita 12 vezes'
            ]
          },
          {
            name: 'Lifting Natural Intenso',
            duration: '3 séries',
            steps: [
              'Sorria mostrando os dentes superiores',
              'Pressione as maçãs do rosto para cima',
              'Mantenha por 15 segundos',
              'Relaxe por 5 segundos e repita'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 4',
          treatment: 'Rotina de firmeza e sustentação',
          steps: [
            {
              name: 'Limpeza Profunda',
              instructions: 'Argila verde + chá verde forte',
              application: 'Aplique por 15 minutos'
            },
            {
              name: 'Máscara Firmadora',
              instructions: 'Clara de ovo + colágeno em pó + mel',
              application: 'Deixe agir por 20 minutos'
            },
            {
              name: 'Finalização',
              instructions: 'Aplique seu sérum ou óleo favorito com movimentos firmes ascendentes'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '📸 Compare suas fotos do início do protocolo com as atuais. Observe a evolução da sustentação muscular.'
        }
      }
    },
    {
      title: 'Dia 23 - Definição e Contorno',
      duration: '35 min',
      content: {
        objective: 'Aperfeiçoar a definição facial e realçar os contornos naturais',
        exercises: [
          {
            name: 'Esculpir Zigomático',
            duration: '3x 30 segundos',
            steps: [
              'Sorria mantendo os lábios fechados',
              'Pressione as maçãs do rosto em diagonal',
              'Alterne entre pressão e relaxamento',
              'Mantenha a respiração constante'
            ]
          },
          {
            name: 'Definição Mandibular Avançada',
            duration: '4 minutos',
            steps: [
              'Posicione os dedos ao longo da mandíbula',
              'Pressione e deslize para cima e para fora',
              'Faça movimentos firmes e precisos',
              'Repita 20 vezes'
            ]
          },
          {
            name: 'Contorno Facial Completo',
            duration: '5 minutos',
            steps: [
              'Comece pelo queixo, subindo até as têmporas',
              'Use pressão moderada e movimentos ascendentes',
              'Trabalhe cada área por 30 segundos',
              'Finalize com movimentos de drenagem'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 4',
          treatment: 'Rotina de definição',
          steps: [
            {
              name: 'Esfoliação Suave',
              instructions: 'Misture café moído + iogurte natural + mel',
              application: 'Massageie por 2 minutos em movimentos circulares'
            },
            {
              name: 'Máscara Modeladora',
              instructions: 'Argila branca + água de rosas + colágeno em pó',
              application: 'Aplique por 20 minutos'
            },
            {
              name: 'Hidratação',
              instructions: 'Aplique seu creme com movimentos de lifting'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🎯 Identifique suas áreas de maior progresso e crie uma sequência personalizada focando nelas.'
        }
      }
    },
    {
      title: 'Dia 24 - Refinamento e Precisão',
      duration: '40 min',
      content: {
        objective: 'Aprimorar a técnica e precisão dos movimentos para resultados mais efetivos',
        exercises: [
          {
            name: 'Precisão Zigomática',
            duration: '4 séries',
            steps: [
              'Localize os pontos exatos do osso zigomático',
              'Pressione com os dedos médios',
              'Faça movimentos circulares precisos',
              'Alterne direções a cada 30 segundos'
            ]
          },
          {
            name: 'Refinamento Periocular',
            duration: '3 minutos por olho',
            steps: [
              'Use o dedo anelar para pressão suave',
              'Trabalhe em movimentos microscópicos',
              'Foque especialmente no canto externo',
              'Mantenha a precisão dos movimentos'
            ]
          },
          {
            name: 'Micro Movimentos Labiais',
            duration: '5 minutos',
            steps: [
              'Alterne entre sorrisos sutis e pronunciados',
              'Trabalhe o controle muscular fino',
              'Foque na simetria dos movimentos',
              'Mantenha a consciência da tensão muscular'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 4',
          treatment: 'Rotina de refinamento',
          steps: [
            {
              name: 'Limpeza Precisa',
              instructions: 'Use movimentos pequenos e controlados com seu cleanser natural',
              application: 'Foque em cada área por 30 segundos'
            },
            {
              name: 'Máscara de Precisão',
              instructions: 'Aplique diferentes máscaras para diferentes áreas do rosto',
              application: 'Argila rosa para área T, argila branca para bochechas'
            },
            {
              name: 'Finalização',
              instructions: 'Aplique seu hidratante com movimentos precisos e direcionados'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🔍 Grave um vídeo curto fazendo seus exercícios favoritos para avaliar a precisão da técnica.'
        }
      }
    },
    {
      title: 'Dia 25 - Integração e Fluidez',
      duration: '45 min',
      content: {
        objective: 'Criar uma sequência fluida e integrada de exercícios',
        exercises: [
          {
            name: 'Sequência Fluida Completa',
            duration: '15 minutos',
            steps: [
              'Comece com movimentos suaves de aquecimento',
              'Progrida para exercícios mais intensos',
              'Mantenha a respiração sincronizada',
              'Conecte um movimento ao outro sem pausas'
            ]
          },
          {
            name: 'Transições Suaves',
            duration: '10 minutos',
            steps: [
              'Pratique a transição entre diferentes exercícios',
              'Mantenha o fluxo constante de movimento',
              'Integre respiração com movimento',
              'Foque na suavidade das mudanças'
            ]
          },
          {
            name: 'Integração Final',
            duration: '5 minutos',
            steps: [
              'Combine seus exercícios favoritos',
              'Crie uma sequência personalizada',
              'Mantenha o ritmo constante',
              'Finalize com movimentos de relaxamento'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 4',
          treatment: 'Rotina de integração',
          steps: [
            {
              name: 'Ritual de Limpeza',
              instructions: 'Combine diferentes técnicas de limpeza aprendidas',
              application: 'Crie sua sequência personalizada'
            },
            {
              name: 'Máscara Multifuncional',
              instructions: 'Misture seus ingredientes favoritos das semanas anteriores',
              application: 'Aplique com movimentos integrados'
            },
            {
              name: 'Hidratação Completa',
              instructions: 'Finalize com camadas de hidratação',
              application: 'Aplique do mais leve ao mais denso'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '🌊 Crie sua própria sequência fluida de exercícios e pratique até memorizar.'
        }
      }
    },
    {
      title: 'Dia 26 - Potencialização e Resultados',
      duration: '40 min',
      content: {
        objective: 'Maximizar os resultados através de técnicas avançadas',
        exercises: [
          {
            name: 'Potencialização Muscular',
            duration: '5 séries',
            steps: [
              'Aumente gradualmente a intensidade',
              'Mantenha cada posição por mais tempo',
              'Adicione resistência extra quando possível',
              'Foque na qualidade da contração'
            ]
          },
          {
            name: 'Sequência Intensiva',
            duration: '15 minutos',
            steps: [
              'Combine exercícios de maior dificuldade',
              'Reduza os intervalos de descanso',
              'Mantenha a forma correta',
              'Aumente a velocidade gradualmente'
            ]
          },
          {
            name: 'Finalização Potente',
            duration: '10 minutos',
            steps: [
              'Realize uma série final com máxima intensidade',
              'Foque nas áreas mais responsivas',
              'Mantenha a respiração controlada',
              'Finalize com isometria facial'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 4',
          treatment: 'Rotina potencializada',
          steps: [
            {
              name: 'Limpeza Potencializada',
              instructions: 'Dupla limpeza com ingredientes ativos naturais',
              application: 'Massageie por tempo extra em cada etapa'
            },
            {
              name: 'Máscara Intensiva',
              instructions: 'Combine argila + vitamina C natural + própolis',
              application: 'Deixe agir por 30 minutos'
            },
            {
              name: 'Finalização Ativa',
              instructions: 'Aplique camadas de produtos mais potentes',
              application: 'Faça massagem facial durante a aplicação'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '💪 Aumente em 50% o tempo de sustentação dos exercícios hoje. Teste seus limites com segurança.'
        }
      }
    },
    {
      title: 'Dia 27 - Manutenção e Longevidade',
      duration: '35 min',
      content: {
        objective: 'Estabelecer uma rotina sustentável para manutenção dos resultados',
        exercises: [
          {
            name: 'Rotina de Manutenção',
            duration: '15 minutos',
            steps: [
              'Selecione os exercícios mais efetivos',
              'Crie uma sequência diária realista',
              'Adapte a intensidade conforme necessário',
              'Estabeleça horários fixos para prática'
            ]
          },
          {
            name: 'Exercícios Essenciais',
            duration: '10 minutos',
            steps: [
              'Identifique 5 exercícios fundamentais',
              'Pratique com atenção à técnica',
              'Mantenha a qualidade do movimento',
              'Foque nas áreas prioritárias'
            ]
          },
          {
            name: 'Sequência Express',
            duration: '5 minutos',
            steps: [
              'Desenvolva uma versão curta dos exercícios',
              'Mantenha os movimentos mais importantes',
              'Adapte para diferentes momentos do dia',
              'Pratique para memorizar'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 4',
          treatment: 'Rotina de manutenção',
          steps: [
            {
              name: 'Limpeza Diária',
              instructions: 'Estabeleça uma rotina simples e efetiva',
              application: 'Adapte conforme sua rotina'
            },
            {
              name: 'Cuidados Semanais',
              instructions: 'Programe máscaras e tratamentos especiais',
              application: 'Reserve um dia da semana para cuidados extras'
            },
            {
              name: 'Hidratação Estratégica',
              instructions: 'Escolha produtos que funcionam melhor para você',
              application: 'Mantenha a constância dos cuidados'
            }
          ]
        },
        challenge: {
          title: 'Mini Desafio',
          task: '📝 Crie seu plano personalizado de manutenção para os próximos 30 dias.'
        }
      }
    },
    {
      title: 'Dia 28 - Celebração e Próximos Passos',
      duration: '50 min',
      content: {
        objective: 'Avaliar a jornada completa e planejar a continuidade dos cuidados',
        exercises: [
          {
            name: 'Revisão Completa',
            duration: '30 minutos',
            steps: [
              'Pratique todos os exercícios favoritos',
              'Avalie sua evolução em cada movimento',
              'Observe as áreas de maior progresso',
              'Identifique pontos para continuar desenvolvendo'
            ]
          },
          {
            name: 'Sequência Personalizada Final',
            duration: '15 minutos',
            steps: [
              'Monte sua sequência ideal',
              'Inclua exercícios de todas as semanas',
              'Adapte conforme suas necessidades',
              'Documente sua rotina personalizada'
            ]
          }
        ],
        skincare: {
          title: 'Skincare Natural da Semana 4',
          treatment: 'Rotina de celebração',
          steps: [
            {
              name: 'Ritual Completo',
              instructions: 'Realize todos os passos aprendidos',
              application: 'Dedique tempo extra para cada etapa'
            },
            {
              name: 'Máscara de Celebração',
              instructions: 'Prepare sua máscara favorita do protocolo',
              application: 'Aplique com atenção e gratidão'
            },
            {
              name: 'Finalização Especial',
              instructions: 'Use seus produtos preferidos em camadas',
              application: 'Faça uma massagem facial completa'
            }
          ],
          note: 'Registre suas combinações favoritas de produtos e técnicas para referência futura'
        },
        challenge: {
          title: 'Mini Desafio - Avaliação Final',
          task: '🎉 Celebre sua jornada!\n\n📸 Compare todas suas fotos do antes e depois\n\n✍️ Responda:\n- Quais foram suas maiores conquistas?\n- O que aprendeu sobre seu rosto?\n- Como pretende manter os resultados?\n- Quais são seus próximos objetivos?'
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
        Semana 4 - Sustentar e Consolidar
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