import { BELTS } from '@/lib/data'
import { fetchQuizHistory } from '@/app/actions/quiz'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QuizStartForm } from './QuizStartForm'

export default async function QuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const history = await fetchQuizHistory();

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] p-6 md:p-12 gap-12 max-w-4xl mx-auto w-full">
      
      {/* Start Quiz Section */}
      <section className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8">
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter">Avaliação Teórica</h1>
        <p className="text-gray-600 font-medium mb-8">
          Teste seus conhecimentos sobre técnicas, vocabulário e história acumulados até a sua faixa atual.
        </p>
        <QuizStartForm />
      </section>

      {/* History Section */}
      <section>
        <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Histórico de Sessões</h2>
        
        {history.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-gray-300 text-center text-gray-400 font-medium rounded-xl">
            Nenhuma tentativa registrada ainda.
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((attempt) => {
              const belt = BELTS.find(b => b.id === attempt.belt_id)
              const date = new Date(attempt.created_at || '').toLocaleDateString('pt-BR')
              const isApproved = attempt.score >= 70
              
              return (
                <div key={attempt.id} className="flex flex-wrap items-center justify-between p-5 bg-white border-2 border-black rounded-xl">
                  <div className="flex flex-col">
                     <span className="font-bold text-lg uppercase">{belt?.name || attempt.belt_id}</span>
                     <span className="text-sm font-mono text-gray-500">{date}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                     <span className="font-mono text-gray-500">{attempt.total_questions} questões</span>
                     <span className={`px-3 py-1 font-black text-white ${isApproved ? 'bg-green-600' : 'bg-red-600'}`}>
                        {attempt.score}%
                     </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
