import { week1Data } from './week1'
import { week4Data } from './week4'

export const PROGRAM_CONTENT = {
  'facekorean-protocol': {
    title: 'FaceKorean Protocol',
    description: 'Premium Korean skincare and facial exercise techniques',
    modules: [
      week1Data,
      {
        title: 'Semana 2 - Esculpir e Firmar',
        lessons: [
          // Week 2 content will be moved to its own file
        ]
      },
      {
        title: 'Semana 3 - Iluminar & Suavizar',
        lessons: [
          // Week 3 content will be moved to its own file
        ]
      },
      week4Data,
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