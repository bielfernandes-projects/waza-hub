'use client'

import { useState } from 'react'
import { QuizQuestion, QuizAttemptAnswer } from '@/types/quiz'
import { QuizResult } from './QuizResult'
import { useRouter } from 'next/navigation'

interface QuizFlowProps {
  questions: QuizQuestion[];
  beltId: string;
}

export function QuizFlow({ questions, beltId }: QuizFlowProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<QuizAttemptAnswer[]>([])
  const [finished, setFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[60vh] text-center">
         <h2 className="text-2xl font-black mb-4">Nenhuma Questão</h2>
         <p className="text-gray-500 mb-8 max-w-md">Não há questões disponíveis para este nível no momento.</p>
         <button onClick={() => router.push('/quiz')} className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest shadow-md">Voltar</button>
      </div>
    )
  }

  if (finished) {
    return <QuizResult questions={questions} answers={answers} beltId={beltId} />
  }

  const currentQ = questions[currentIndex]
  const total = questions.length

  const handleNext = () => {
    if (!selectedOption) return

    setAnswers(prev => [...prev, {
      question_id: currentQ.id,
      selected: selectedOption,
      correct: currentQ.correct_answer
    }])

    if (currentIndex < total - 1) {
      setCurrentIndex(curr => curr + 1)
      setSelectedOption(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setFinished(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-2xl mx-auto px-6 py-8 pb-32">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-8">
        <div className="font-mono font-bold text-sm tracking-widest text-gray-500">
          QUESTÃO {currentIndex + 1}/{total}
        </div>
        <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
           <div 
             className="h-full bg-black transition-all duration-300" 
             style={{ width: `${((currentIndex + 1)/total)*100}%`}}>
           </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-10">
        <span className="mb-3 inline-block px-3 py-1 bg-gray-100 text-xs font-bold font-mono tracking-widest text-gray-600 rounded">
          {currentQ.type.toUpperCase()}
        </span>
        <h2 className="text-3xl font-black leading-tight text-gray-900">{currentQ.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption === opt
          return (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`w-full text-left p-5 border-4 transition-all duration-200 rounded-xl font-bold bg-white
                ${isSelected ? 'border-black transform scale-[1.02] shadow-lg' : 'border-gray-200 text-gray-600 hover:border-gray-300'}
              `}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Footer Nav */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t-2">
        <div className="max-w-2xl mx-auto flex justify-end">
           <button 
             onClick={handleNext}
             disabled={!selectedOption}
             className={`h-14 px-8 font-bold tracking-widest uppercase transition-colors flex-1 md:flex-none
               ${!selectedOption ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
           >
             {currentIndex === total - 1 ? 'Finalizar' : 'Próxima'}
           </button>
        </div>
      </div>
    </div>
  )
}
