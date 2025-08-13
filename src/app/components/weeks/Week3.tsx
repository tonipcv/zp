import { useState } from 'react'
import { PlayCircle, Clock, ChevronDown } from 'lucide-react'
import { week3Data } from '@/app/data/program-content/week3'

interface Exercise {
  name: string
  duration: string
  steps: string[]
}

interface SkincareStep {
  name: string
  instructions: string
  application?: string
}

interface Challenge {
  title: string
  task: string
}

export function Week3() {
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})

  const toggleLesson = (lessonIndex: number) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonIndex]: !prev[lessonIndex]
    }))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-[#35426A]">
        {week3Data.title}
      </h2>

      <div className="space-y-3">
        {week3Data.lessons.map((lesson, lessonIndex) => {
          const isExpanded = expandedLessons[lessonIndex]
          return (
            <div
              key={lessonIndex}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleLesson(lessonIndex)}
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

              {lesson.content && isExpanded && (
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
                  <div className="space-y-4">
                    {lesson.content.exercises.map((exercise, index) => (
                      <div key={index} className="bg-[#F8F9FB] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-[#35426A]">
                            {exercise.name}
                          </h4>
                          <span className="text-xs text-[#7286B2] px-2 py-1 bg-[#35426A]/5 rounded-full">
                            {exercise.duration}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {exercise.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2 text-sm text-[#7286B2]">
                              <span className="text-[#35426A] mt-1">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Skincare */}
                  {lesson.content.skincare && (
                    <div className="bg-[#F8F9FB] rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-[#35426A] mb-3">
                        {lesson.content.skincare.title}
                      </h4>
                      <div className="space-y-4 text-sm text-[#7286B2]">
                        <p className="font-medium text-[#35426A]">
                          {lesson.content.skincare.treatment}
                        </p>
                        
                        <div className="space-y-4">
                          {lesson.content.skincare.steps.map((step, index) => (
                            <div key={index} className="space-y-2">
                              <h5 className="font-medium text-[#35426A]">{step.name}:</h5>
                              <p>{step.instructions}</p>
                              {step.application && (
                                <p className="text-[#35426A]/80">{step.application}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Challenge */}
                  {lesson.content.challenge && (
                    <div className="bg-gradient-to-r from-[#35426A] to-[#7286B2] rounded-lg p-4 text-white">
                      <h4 className="text-sm font-semibold mb-2">
                        {lesson.content.challenge.title}
                      </h4>
                      <p className="text-sm opacity-90">
                        {lesson.content.challenge.task}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 