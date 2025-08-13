'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, PlayCircle, Clock, CheckCircle, ChevronDown } from 'lucide-react'
import { WeekModule } from '@/app/components/WeekModule'
import { Week1 } from '@/app/components/weeks/Week1'
import { Week2 } from '@/app/components/weeks/Week2'
import { Week3 } from '@/app/components/weeks/Week3'
import { Week4 } from '@/app/components/weeks/Week4'

const PROGRAM_CONTENT = {
  'pilates-performance': {
    title: 'Pilates Performance',
    description: 'Advanced techniques for strength, flexibility and body control',
    modules: [
      {
        title: 'Foundation Week',
        lessons: [
          { title: 'Core Activation Mastery', duration: '45 min' },
          { title: 'Perfect Posture Sequence', duration: '40 min' },
          { title: 'Dynamic Flexibility Flow', duration: '35 min' }
        ]
      },
      {
        title: 'Strength Development',
        lessons: [
          { title: 'Upper Body Power', duration: '50 min' },
          { title: 'Lower Body Integration', duration: '45 min' },
          { title: 'Full Body Control', duration: '55 min' }
        ]
      }
    ]
  },
  'facekorean-protocol': {
    title: 'FaceKorean Protocol',
    description: 'Premium Korean skincare and facial exercise techniques',
    modules: [
      {
        title: 'Semana 1 - Drenar, Ativar e Descongestionar',
        lessons: [
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
      },
      {
        title: 'Semana 2 - Esculpir e Firmar',
        lessons: [
          {
            title: 'Dia 8 - Contorno Facial Ativado',
            duration: '30 min',
            content: {
              objective: 'Definir mandíbula, tonificar região inferior do rosto',
              exercises: [
                {
                  name: 'Pressão no Maxilar com Respiro',
                  duration: '3x 15 segundos',
                  steps: [
                    'Com os punhos sob o queixo, pressione levemente enquanto tenta abrir a boca',
                    'Ativa músculos do maxilar e pescoço'
                  ]
                },
                {
                  name: 'Mastigação Isométrica com Língua no Céu da Boca',
                  duration: '20 repetições',
                  steps: [
                    'Boca fechada, língua colada no céu da boca',
                    'Simule mastigação lenta e forte'
                  ]
                },
                {
                  name: '"X" Facial',
                  duration: '3 séries',
                  steps: [
                    'Sorria com os dentes cerrados em forma de "X", sem enrugar os olhos',
                    'Trabalha a linha da mandíbula e bochechas'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 2',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de hibisco gelado ou chá verde',
                    application: 'Ação antioxidante e firmadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de sopa de óleo de semente de uva'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (para o dia)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📸 Tire uma foto só da região inferior do rosto. Compare com o dia 1.'
              }
            }
          },
          {
            title: 'Dia 9 - Bochechas Esculpidas',
            duration: '30 min',
            content: {
              objective: 'Elevar zigomáticos e criar aparência mais angulosa',
              exercises: [
                {
                  name: 'Sorriso Sustentado com Dedos',
                  duration: '3x 30 segundos',
                  steps: [
                    'Sorria com a boca fechada',
                    'Coloque os dedos nas bochechas para "segurar" e aumentar a tensão'
                  ]
                },
                {
                  name: 'Soprar e Recolher',
                  duration: '3 séries',
                  steps: [
                    'Sopre ar dentro das bochechas e recolha',
                    'Faça 15 repetições',
                    'Intercale com batidinhas leves no rosto'
                  ]
                },
                {
                  name: 'Morder a Língua e Sorrir',
                  duration: '3x 10 segundos',
                  steps: [
                    'Morda a ponta da língua levemente com os dentes',
                    'Sorria o máximo que conseguir',
                    'Ativa músculos profundos da face'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 2',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de hibisco gelado ou chá verde',
                    application: 'Ação antioxidante e firmadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de sopa de óleo de semente de uva'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (para o dia)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🪞 Observe se uma bochecha é mais levantada que a outra. Perceba.'
              }
            }
          },
          {
            title: 'Dia 10 - Papada e Pescoço',
            duration: '30 min',
            content: {
              objective: 'Fortalecer o platisma, reduzir flacidez do pescoço',
              exercises: [
                {
                  name: 'Beijo para o Teto',
                  duration: '3x 15 segundos',
                  steps: [
                    'Olhe para cima, faça biquinho exagerado',
                    'Ativa pescoço e queixo'
                  ]
                },
                {
                  name: 'Puxada do Pescoço com Língua Estendida',
                  duration: '3 séries',
                  steps: [
                    'Olhe para frente, estique a língua e levante o queixo',
                    'Segure 10 segundos'
                  ]
                },
                {
                  name: '"Girar e Segurar" (pescoço)',
                  duration: '2 minutos',
                  steps: [
                    'Gire a cabeça lentamente para a direita e segure',
                    'Depois para a esquerda',
                    'Faça 3x para cada lado'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 2',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de hibisco gelado ou chá verde',
                    application: 'Ação antioxidante e firmadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de sopa de óleo de semente de uva'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (para o dia)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📝 Escreva uma frase de motivação para si mesma. Exemplo: "Estou me esculpindo com minhas mãos."'
              }
            }
          },
          {
            title: 'Dia 11 - Região Ocular e Sobrancelhas',
            duration: '30 min',
            content: {
              objective: 'Levantar o olhar e firmar a área dos olhos',
              exercises: [
                {
                  name: 'Olhos de Coruja Avançado',
                  duration: '3 séries',
                  steps: [
                    'Tente levantar apenas as sobrancelhas enquanto os dedos pressionam a pele levemente',
                    'Segure 5 segundos por repetição'
                  ]
                },
                {
                  name: 'Pestanejar com Força',
                  duration: '20 repetições',
                  steps: [
                    'Pisque firmemente mantendo os olhos voltados para cima'
                  ]
                },
                {
                  name: 'Dedilhado Circular nos Olhos',
                  duration: '2 minutos',
                  steps: [
                    'Com os dedos anelares, faça círculos suaves ao redor dos olhos'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 2',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de hibisco gelado ou chá verde',
                    application: 'Ação antioxidante e firmadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de sopa de óleo de semente de uva'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (para o dia)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🧘‍♀️ Medite por 3 minutos com foco na região dos olhos. Respiração leve.'
              }
            }
          },
          {
            title: 'Dia 12 - Zona da Testa e Elevação da Parte Superior',
            duration: '30 min',
            content: {
              objective: 'Suavizar linhas horizontais, fortalecer músculo frontal',
              exercises: [
                {
                  name: 'Resistência Testa + Elevação',
                  duration: '3 séries',
                  steps: [
                    'Coloque os dedos na testa e tente levantar as sobrancelhas enquanto resiste com os dedos',
                    '10 segundos por vez'
                  ]
                },
                {
                  name: 'Franzir e Relaxar',
                  duration: '10 repetições',
                  steps: [
                    'Franza a testa forte por 3 segundos e solte rapidamente'
                  ]
                },
                {
                  name: 'Rolamento da Testa',
                  duration: '2 minutos',
                  steps: [
                    'Com os dedos, role da linha central para as têmporas suavemente'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 2',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de hibisco gelado ou chá verde',
                    application: 'Ação antioxidante e firmadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de sopa de óleo de semente de uva'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (para o dia)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📓 Desenhe como você imagina seu rosto ao final dos 28 dias.'
              }
            }
          },
          {
            title: 'Dia 13 - Full Contorno Avançado',
            duration: '30 min',
            content: {
              objective: 'Integrar pescoço, mandíbula, bochechas e olhos num treino único',
              exercises: [
                {
                  name: 'Circuito Completo',
                  duration: '12 minutos',
                  steps: [
                    'Beijo para o teto – 1 min',
                    'Lifting zigomático – 1 min',
                    'Mastigação com língua no céu da boca – 1 min',
                    'Sorriso com pressão de dedos – 1 min',
                    'Olhos de coruja – 1 min',
                    'Rolamento da testa – 1 min',
                    '"X" facial – 1 min',
                    'Beijo com resistência (bochechas) – 1 min',
                    'Piscadas com força – 1 min',
                    'Drenagem manual leve – 2 min'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 2',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de hibisco gelado ou chá verde',
                    application: 'Ação antioxidante e firmadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de sopa de óleo de semente de uva'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (para o dia)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: 'Grave um vídeo de 10 segundos sorrindo com o rosto relaxado.'
              }
            }
          },
          {
            title: 'Dia 14 - Avaliação e Autoimagem',
            duration: '25 min',
            content: {
              objective: 'Reforçar conexão interna com os resultados + treinar expressão positiva',
              exercises: [
                {
                  name: 'Face Yoga Leve',
                  duration: '10 minutos',
                  steps: [
                    'Drenagem leve com dedos',
                    'Olhos de coruja',
                    'Beijo para o teto',
                    'Isometria do sorriso'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 2',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de hibisco gelado ou chá verde',
                    application: 'Ação antioxidante e firmadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de sopa de óleo de semente de uva'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (para o dia)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio - Avaliação Semanal',
                task: '📸 Tire uma nova selfie + escreva:\n\nOnde mais notei resultado?\nComo me sinto em relação ao meu rosto?\nO que estou mais animada para a semana 3?'
              }
            }
          }
        ]
      },
      {
        title: 'Semana 3 - Iluminar & Suavizar',
        lessons: [
          {
            title: 'Dia 15 - Clarear e Suavizar Região dos Olhos',
            duration: '30 min',
            content: {
              objective: 'Suavizar olheiras, ativar circulação ocular e rejuvenescer o olhar',
              exercises: [
                {
                  name: 'Toque Linfático com Dedos Anelares',
                  duration: '2 minutos',
                  steps: [
                    'Faça leves batidinhas ao redor dos olhos em formato de círculo',
                    'Comece no canto interno e vá até o externo'
                  ]
                },
                {
                  name: 'Piscadas Com Controle',
                  duration: '3x 10 repetições',
                  steps: [
                    'Com os olhos voltados para cima, pisque com força lentamente',
                    'Trabalha orbiculares dos olhos'
                  ]
                },
                {
                  name: 'Elevação Suave das Sobrancelhas',
                  duration: '3 séries',
                  steps: [
                    'Posicione os dedos sobre as sobrancelhas, pressione para baixo',
                    'Tente levantar as sobrancelhas contra a pressão por 10 segundos'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 3',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de camomila ou água de arroz fermentada',
                    application: 'Ação clareadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de mel puro'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🪞 Observe o olhar no espelho: o que transmite hoje?'
              }
            }
          },
          {
            title: 'Dia 16 - Suavizar Testa e Expressão',
            duration: '30 min',
            content: {
              objective: 'Liberar tensão da testa, diminuir linhas horizontais e evitar marcas novas',
              exercises: [
                {
                  name: 'Deslizamento Frontal',
                  duration: '2 minutos',
                  steps: [
                    'Com os dedos juntos, deslize do centro da testa até as têmporas com leve pressão',
                    'Faça 20 vezes lentamente'
                  ]
                },
                {
                  name: 'Pressão e Elevação',
                  duration: '3x 15 segundos',
                  steps: [
                    'Posicione os dedos na testa e tente levantar as sobrancelhas com resistência',
                    'Fortalece a musculatura frontal'
                  ]
                },
                {
                  name: 'Testa Neutra',
                  duration: '3 minutos',
                  steps: [
                    'Feche os olhos e relaxe completamente a testa',
                    'Mentalize: "solto a tensão do meu rosto"'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 3',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de camomila ou água de arroz fermentada',
                    application: 'Ação clareadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de mel puro'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🎧 Faça os exercícios ouvindo uma música calma. Foque na respiração.'
              }
            }
          },
          {
            title: 'Dia 17 - Lábios e Bigode Chinês',
            duration: '30 min',
            content: {
              objective: 'Preencher visualmente o lábio superior, evitar sulcos ao redor da boca',
              exercises: [
                {
                  name: 'Sorriso com Resistência',
                  duration: '3x 15 segundos',
                  steps: [
                    'Sorria com força e segure a tensão',
                    'Pressione levemente os cantos da boca com os dedos'
                  ]
                },
                {
                  name: 'Bico Resistente com Mãos',
                  duration: '3 séries',
                  steps: [
                    'Faça um biquinho e posicione os dedos ao redor',
                    'Tente empurrar os dedos enquanto eles oferecem leve resistência',
                    'Fortalece orbiculares da boca'
                  ]
                },
                {
                  name: 'Rolamento da Língua',
                  duration: '10x por lado',
                  steps: [
                    'Faça a língua contornar por dentro dos lábios, lentamente'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 3',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de camomila ou água de arroz fermentada',
                    application: 'Ação clareadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de mel puro'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📓 Escreva: o que representa um sorriso bonito para você?'
              }
            }
          },
          {
            title: 'Dia 18 - Iluminar as Bochechas',
            duration: '30 min',
            content: {
              objective: 'Aumentar viço e coloração natural das maçãs do rosto',
              exercises: [
                {
                  name: 'Tapotagem Vibracional',
                  duration: '1 minuto',
                  steps: [
                    'Com a ponta dos dedos, dê batidinhas rápidas e suaves nas bochechas'
                  ]
                },
                {
                  name: 'Sorriso Sustentado',
                  duration: '3x 20 segundos',
                  steps: [
                    'Sorria com os dentes escondidos',
                    'Pressione as bochechas para cima com os dedos'
                  ]
                },
                {
                  name: '"Inflar e Circular"',
                  duration: '3 séries',
                  steps: [
                    'Encha as bochechas com ar',
                    'Circule o ar lentamente de um lado para o outro'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 3',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de camomila ou água de arroz fermentada',
                    application: 'Ação clareadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de mel puro'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🧘‍♀️ Feche os olhos e sinta o calor natural do seu rosto após os exercícios.'
              }
            }
          },
          {
            title: 'Dia 19 - Região Central: Nariz e Zona T',
            duration: '30 min',
            content: {
              objective: 'Ativar fluxo da região nasal, suavizar rugas entre sobrancelhas e clarear a zona T',
              exercises: [
                {
                  name: 'Pressão com Dedos no Centro da Testa',
                  duration: '3x 20 segundos',
                  steps: [
                    'Pressione entre as sobrancelhas e tente franzir a testa ao mesmo tempo',
                    'Trabalha controle da glabela'
                  ]
                },
                {
                  name: 'Massagem no Dorso do Nariz',
                  duration: '2 minutos',
                  steps: [
                    'Com os dedos indicadores, deslize do topo do nariz para baixo suavemente'
                  ]
                },
                {
                  name: 'Tensão Nasal com Inspiração',
                  duration: '10 repetições',
                  steps: [
                    'Inspire fundo pelo nariz enquanto tenta "dilatar" as narinas',
                    'Solte pela boca'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 3',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de camomila ou água de arroz fermentada',
                    application: 'Ação clareadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de mel puro'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📝 Liste 3 emoções que você segura na face.'
              }
            }
          },
          {
            title: 'Dia 20 - Expressão Suave e Descanso Facial',
            duration: '30 min',
            content: {
              objective: 'Treinar repouso facial e microexpressão natural positiva',
              exercises: [
                {
                  name: 'Relaxamento de Maxilar',
                  duration: '3 repetições',
                  steps: [
                    'Com a boca levemente aberta, balance o maxilar suavemente para os lados'
                  ]
                },
                {
                  name: 'Sorriso Neutro',
                  duration: '3 séries',
                  steps: [
                    'Feche os olhos, inspire fundo',
                    'Esboce um leve sorriso por 20 segundos',
                    'Treina expressão natural positiva'
                  ]
                },
                {
                  name: 'Dedilhado de Relaxamento',
                  duration: '2 minutos',
                  steps: [
                    'Faça dedilhado leve no rosto inteiro como um "pianinho"'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 3',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de camomila ou água de arroz fermentada',
                    application: 'Ação clareadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de mel puro'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🪞 Passe 2 minutos olhando nos seus olhos no espelho, sem julgamento.'
              }
            }
          },
          {
            title: 'Dia 21 - Ritual de Consolidação e Regeneração',
            duration: '30 min',
            content: {
              objective: 'Repetir os melhores estímulos da semana e regenerar tecidos com toque suave',
              exercises: [
                {
                  name: 'Circuito Leve',
                  duration: '12 minutos',
                  steps: [
                    'Drenagem com dedos anelares – 2 min',
                    'Sorriso sustentado – 2 min',
                    'Deslize frontal da testa – 2 min',
                    'Língua interna – 2 min',
                    'Relaxamento maxilar – 2 min',
                    'Tapotagem leve no rosto – 2 min'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 3',
                treatment: 'Rotina diária com 3 etapas + tratamento especial',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de camomila ou água de arroz fermentada',
                    application: 'Ação clareadora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de gel de babosa + 1 colher de mel puro'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  },
                  {
                    name: 'Tratamento Especial',
                    instructions: 'Compressa de chá morno e hidratação profunda (babosa + mel)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📸 Tire uma nova selfie sorrindo. Escreva uma frase:\n"Minha beleza vem de dentro e está aparecendo por fora."'
              }
            }
          }
        ]
      },
      {
        title: 'Advanced Treatments',
        lessons: [
          { title: 'Gua Sha Mastery', duration: '35 min' },
          { title: 'Face Yoga Sequence', duration: '25 min' },
          { title: 'LED Therapy Guide', duration: '20 min' }
        ]
      }
    ]
  },
  'advanced-aesthetics': {
    title: 'Advanced Aesthetics',
    description: 'Comprehensive beauty and wellness transformation program',
    modules: [
      {
        title: 'Skin Transformation',
        lessons: [
          { title: 'Skin Analysis & Planning', duration: '40 min' },
          { title: 'Professional Treatment Guide', duration: '55 min' },
          { title: 'Home Care Protocol', duration: '35 min' }
        ]
      },
      {
        title: 'Body Aesthetics',
        lessons: [
          { title: 'Body Contouring Basics', duration: '45 min' },
          { title: 'Advanced Massage Techniques', duration: '50 min' },
          { title: 'Lymphatic Drainage', duration: '40 min' }
        ]
      }
    ]
  },
  '28days-transformation': {
    title: '28 Days Transformation',
    description: 'Lose 5kg through scientific approach and personalized guidance',
    modules: [
      {
        title: 'Week 1: Foundation',
        lessons: [
          { title: 'Metabolic Assessment', duration: '30 min' },
          { title: 'Nutrition Fundamentals', duration: '45 min' },
          { title: 'Workout Introduction', duration: '40 min' }
        ]
      },
      {
        title: 'Week 2: Acceleration',
        lessons: [
          { title: 'HIIT Fundamentals', duration: '35 min' },
          { title: 'Meal Prep Mastery', duration: '40 min' },
          { title: 'Progress Tracking', duration: '25 min' }
        ]
      },
      {
        title: 'Semana 4 - Lifting Natural & Sustentação',
        lessons: [
          {
            title: 'Dia 22 - Elevação Total da Parte Superior',
            duration: '30 min',
            content: {
              objective: 'Levantar sobrancelhas, abrir o olhar e projetar a parte superior do rosto',
              exercises: [
                {
                  name: '"Olhos de Coruja Intenso"',
                  duration: '3 séries',
                  steps: [
                    'Pressione suavemente as têmporas e tente abrir os olhos o máximo possível',
                    'Segure 10 segundos'
                  ]
                },
                {
                  name: 'Frontal Lift com Resistência',
                  duration: '3 séries',
                  steps: [
                    'Dedos pressionando a testa; tente levantar sobrancelhas com força',
                    'Segure 10 segundos'
                  ]
                },
                {
                  name: 'Rolo de massagem ou colher gelada nas pálpebras',
                  duration: '2 minutos',
                  steps: [
                    'Estimulação da circulação e firmeza da pele fina ao redor dos olhos'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 4',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de alecrim ou sálvia',
                    application: 'Ação estimulante e regeneradora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de babosa + 1 colher de óleo de rosa mosqueta',
                    application: 'Ação regeneradora'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📝 Escreva como está se sentindo com a evolução do seu olhar.'
              }
            }
          },
          {
            title: 'Dia 23 - Lifting do Meio do Rosto',
            duration: '30 min',
            content: {
              objective: 'Reposicionar as bochechas e levantar os zigomáticos',
              exercises: [
                {
                  name: 'Sorriso com Pressão',
                  duration: '3x 30 segundos',
                  steps: [
                    'Sorria com a boca fechada',
                    'Dedos nos ossos das bochechas empurrando para cima'
                  ]
                },
                {
                  name: 'Inflar uma bochecha por vez',
                  duration: '3 séries',
                  steps: [
                    'Encha só uma bochecha de ar por 10 segundos. Troque',
                    'Trabalha controle e simetria'
                  ]
                },
                {
                  name: 'Tapotagem Vibracional',
                  duration: '1 minuto por lado',
                  steps: [
                    'Batidinhas rápidas nas bochechas com pontas dos dedos'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 4',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de alecrim ou sálvia',
                    application: 'Ação estimulante e regeneradora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de babosa + 1 colher de óleo de rosa mosqueta',
                    application: 'Ação regeneradora'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🪞 Escolha uma música e sorria para o espelho durante 1 minuto.'
              }
            }
          },
          {
            title: 'Dia 24 - Linha da Mandíbula e Papada',
            duration: '30 min',
            content: {
              objective: 'Refinar contorno inferior do rosto e eliminar flacidez residual',
              exercises: [
                {
                  name: 'Beijo com Rotação',
                  duration: '3 séries',
                  steps: [
                    'Olhe para cima, faça biquinho e gire a cabeça lentamente para os lados',
                    'Segure o biquinho 10 segundos em cada posição'
                  ]
                },
                {
                  name: 'Resistência com os Punhos',
                  duration: '3 séries',
                  steps: [
                    'Pressione os punhos contra o queixo, tente abrir a boca',
                    'Músculo platisma + mandíbula'
                  ]
                },
                {
                  name: 'Mastigação Isométrica com Língua no Céu da Boca',
                  duration: '2 minutos',
                  steps: [
                    'Simule mastigação com boca fechada, forçando o maxilar'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 4',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de alecrim ou sálvia',
                    application: 'Ação estimulante e regeneradora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de babosa + 1 colher de óleo de rosa mosqueta',
                    application: 'Ação regeneradora'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📏 Meça a linha do queixo com a mesma referência do Dia 1. Note diferenças.'
              }
            }
          },
          {
            title: 'Dia 25 - Testa e Glabela',
            duration: '30 min',
            content: {
              objective: 'Manter firmeza da testa e suavizar rugas de expressão',
              exercises: [
                {
                  name: 'Deslizamento com Resistência',
                  duration: '2 minutos',
                  steps: [
                    'Faça movimentos circulares entre as sobrancelhas com os dedos',
                    'Ajuda a dissolver tensões'
                  ]
                },
                {
                  name: 'Franzir Suave e Relaxar',
                  duration: '3 séries',
                  steps: [
                    'Franza a testa por 3 segundos',
                    'Solte e deslize os dedos suavemente para os lados'
                  ]
                },
                {
                  name: '"Sobrancelha Alternada"',
                  duration: '2 minutos',
                  steps: [
                    'Treine levantar uma sobrancelha por vez'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 4',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de alecrim ou sálvia',
                    application: 'Ação estimulante e regeneradora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de babosa + 1 colher de óleo de rosa mosqueta',
                    application: 'Ação regeneradora'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📝 Escreva: o que está mais leve em você depois dessas semanas?'
              }
            }
          },
          {
            title: 'Dia 26 - Integração do Rosto Todo',
            duration: '30 min',
            content: {
              objective: 'Ativar músculos em sequência e gerar efeito lifting global',
              exercises: [
                {
                  name: 'Circuito Completo',
                  duration: '12 minutos',
                  steps: [
                    'Lifting zigomático',
                    'Beijo para o teto',
                    'Deslizamento da testa',
                    'Pressão no maxilar',
                    'Olhos de coruja',
                    'Língua giratória',
                    'Sorriso neutro e firme'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 4',
                treatment: 'Rotina diária com 3 etapas',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de alecrim ou sálvia',
                    application: 'Ação estimulante e regeneradora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de babosa + 1 colher de óleo de rosa mosqueta',
                    application: 'Ação regeneradora'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '📸 Foto de perfil sorrindo naturalmente (sem forçar). Guarde.'
              }
            }
          },
          {
            title: 'Dia 27 - Relaxamento Profundo e Microexpressão',
            duration: '30 min',
            content: {
              objective: 'Ensinar o rosto a "descansar bonito" e manter resultado mesmo em repouso',
              exercises: [
                {
                  name: 'Face Yoga Leve',
                  duration: '8 minutos',
                  steps: [
                    'Tapotagem em todo o rosto (2 min)',
                    'Sorriso neutro com olhos fechados (3x 30 seg)',
                    'Rolamento leve com dedos em todas as regiões'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 4',
                treatment: 'Rotina diária com 3 etapas + compressa',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de alecrim ou sálvia',
                    application: 'Ação estimulante e regeneradora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de babosa + 1 colher de óleo de rosa mosqueta',
                    application: 'Ação regeneradora'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  },
                  {
                    name: 'Tratamento Especial',
                    instructions: 'Compressa morna + hidratação completa'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio',
                task: '🧘‍♀️ Respire fundo por 2 min e visualize seu rosto calmo, elevado e suave.'
              }
            }
          },
          {
            title: 'Dia 28 - A Celebração da Transformação',
            duration: '45 min',
            content: {
              objective: 'Reconhecer o processo, comparar os resultados e criar sua nova rotina facial',
              exercises: [
                {
                  name: 'Ritual Final de Face Yoga',
                  duration: '15 minutos',
                  steps: [
                    'Drenagem',
                    'Sorriso sustentado',
                    'Beijo com rotação',
                    'Deslize frontal',
                    'Contorno com língua',
                    'Tapotagem + meditação guiada facial'
                  ]
                }
              ],
              skincare: {
                title: 'Skincare Natural da Semana 4',
                treatment: 'Rotina final completa',
                steps: [
                  {
                    name: 'Tônico',
                    instructions: 'Chá de alecrim ou sálvia',
                    application: 'Ação estimulante e regeneradora'
                  },
                  {
                    name: 'Hidratação',
                    instructions: '1 colher de sopa de babosa + 1 colher de óleo de rosa mosqueta',
                    application: 'Ação regeneradora'
                  },
                  {
                    name: 'Proteção',
                    instructions: 'Protetor solar físico (pela manhã)'
                  },
                  {
                    name: 'Tratamento Final',
                    instructions: 'Skincare completo + massagem final com óleo vegetal e babosa'
                  }
                ]
              },
              challenge: {
                title: 'Mini Desafio Final',
                task: '📸 Tire fotos comparativas (Dia 1 vs Dia 28):\n- Frontal\n- Lateral\n- Sorrindo\n\n📓 Escreva:\n"O que eu vejo no meu reflexo agora? Quem eu sou depois desses 28 dias?"'
              }
            }
          }
        ]
      },
      {
        title: 'Advanced Treatments',
        lessons: [
          { title: 'Gua Sha Mastery', duration: '35 min' },
          { title: 'Face Yoga Sequence', duration: '25 min' },
          { title: 'LED Therapy Guide', duration: '20 min' }
        ]
      }
    ]
  }
}

export default function ProgramPage() {
  const router = useRouter()
  const params = useParams()
  const programId = params?.programId as string
  const program = PROGRAM_CONTENT[programId as keyof typeof PROGRAM_CONTENT]
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})

  if (!program) {
    return null
  }

  const toggleLesson = (moduleIndex: number, lessonIndex: number) => {
    const key = `${moduleIndex}-${lessonIndex}`
    setExpandedLessons(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D6D2D3] to-[#F8FFFF] font-normal tracking-[-0.03em]">
      {/* Header */}
      <header className="fixed w-full top-0 bg-[#D6D2D3]/80 backdrop-blur-lg z-50 border-b border-gray-100/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1B2541]" />
              </button>
              <span className="text-[#1B2541] text-2xl font-light tracking-[-0.03em] uppercase">
                VUOM
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3 text-[#35426A]">
            {program.title}
          </h1>
          <p className="text-[#7286B2] mb-12 text-lg">
            {program.description}
          </p>

          {/* Modules */}
          <div className="space-y-8">
            <Week1 />
            <Week2 />
            <Week3 />
            <Week4 />
          </div>
        </div>
      </main>
    </div>
  )
} 