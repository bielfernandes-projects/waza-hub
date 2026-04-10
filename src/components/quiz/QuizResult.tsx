'use client'

import { useEffect, useState } from 'react'
import { QuizQuestion, QuizAttemptAnswer } from '@/types/quiz'
import { saveQuizAttempt } from '@/app/actions/quiz'
import Link from 'next/link'

interface QuizResultProps {
  questions: QuizQuestion[];
  answers: QuizAttemptAnswer[];
  beltId: string;
}

export function QuizResult({ questions, answers, beltId }: QuizResultProps) {
  const [isSaving, setIsSaving] = useState(true)
  const [saveError, setSaveError] = useState(false)
  
  const scoreRaw = answers.filter(a => a.correct === a.selected).length;
  const total = questions.length;
  const percentage = Math.round((scoreRaw / total) * 100);
  const isApproved = percentage >= 70;

  useEffect(() => {
    const save = async () => {
      try {
        await saveQuizAttempt({
          belt_id: beltId,
          score: percentage,
          total_questions: total,
          answers
        });
      } catch (e) {
        console.error(e);
        setSaveError(true);
      } finally {
        setIsSaving(false);
      }
    };
    save();
  }, [answers, beltId, percentage, total]);

  return (
    <div className="flex flex-col flex-1 w-full max-w-2xl mx-auto pb-20">
      <div className={`p-8 pt-12 text-center rounded-b-3xl text-white ${isApproved ? 'bg-green-600' : 'bg-red-600'}`}>
        <h1 className="text-4xl font-black mb-2">{isApproved ? 'APROVADO' : 'REPROVADO'}</h1>
        <p className="text-6xl font-black">{percentage}%</p>
        <p className="opacity-80 mt-2 font-medium">{scoreRaw} de {total} corretas</p>
      </div>

      <div className="px-6 py-8 space-y-6">
        {isSaving && <p className="text-center animate-pulse font-medium">Salvando resultado...</p>}
        {saveError && <p className="text-center text-red-500 font-medium font-mono">Erro ao salvar no histórico.</p>}

        {questions.map((q, idx) => {
          const ans = answers.find(a => a.question_id === q.id);
          const isCorrect = ans?.selected === ans?.correct;

          return (
            <div key={q.id} className="p-5 border-2 rounded-xl bg-white space-y-3 shadow-sm">
              <span className={`inline-block px-2 text-xs font-bold font-mono tracking-widest text-white rounded ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {idx + 1}/{total}
              </span>
              <p className="font-bold text-lg leading-tight">{q.question}</p>
              
              <div className="space-y-2 mt-4">
                {q.options.map(opt => {
                  const isSelected = ans?.selected === opt;
                  const isActualCorrect = ans?.correct === opt;
                  
                  let optStyle = "border-gray-200 text-gray-400";
                  if (isActualCorrect) {
                    optStyle = "bg-green-100 border-green-500 text-green-800 font-bold";
                  } else if (isSelected && !isActualCorrect) {
                     optStyle = "bg-red-100 border-red-500 text-red-800 font-bold line-through";
                  }

                  return (
                    <div key={opt} className={`p-3 border-2 rounded-lg text-sm ${optStyle}`}>
                      {opt}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {!isApproved && (
            <div className="bg-red-50 border-2 border-red-200 px-4 py-3 text-center">
              <p className="text-sm font-bold text-red-800">
                Voce ainda nao atingiu a pontuacao minima. Revise o conteudo e tente novamente.
              </p>
            </div>
          )}
          <div className="flex gap-3">
            {!isApproved && (
              <Link
                href={`/quiz/flow/${beltId}`}
                className="flex items-center justify-center flex-1 h-14 bg-yellow-400 text-black font-bold tracking-widest uppercase border-2 border-black hover:bg-yellow-300 transition-colors"
              >
                Refazer Quiz
              </Link>
            )}
            <Link 
              href="/quiz" 
              className={`flex items-center justify-center h-14 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors ${isApproved ? 'flex-1' : 'flex-1'}`}
            >
              {isApproved ? 'Voltar ao Inicio' : 'Voltar'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
