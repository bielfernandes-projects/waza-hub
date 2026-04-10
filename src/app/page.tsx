import { BELTS } from '@/lib/data';
import { BeltListItem } from '@/components/BeltListItem';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let completedTechniqueIds = new Set<string>();
  let completedHistoryIds = new Set<string>();

  if (user) {
    const { data: progressData } = await supabase
      .from('progress')
      .select('reference_id, type')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (progressData) {
      completedTechniqueIds = new Set(
        progressData.filter(p => p.type === 'technique').map(p => p.reference_id)
      );
      completedHistoryIds = new Set(
        progressData.filter(p => p.type === 'history').map(p => p.reference_id)
      );
    }
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)]">
      <div className="p-8 border-b-2 border-black bg-neutral-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">
            O Caminho <br/> Suave
          </h2>
          <p className="font-bold text-xl opacity-70">
            Acompanhe sua evolução e domine as técnicas do currículo.
          </p>
        </div>
        
        {user && (
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link href="/quiz" className="font-black uppercase tracking-widest bg-yellow-400 text-black border-4 border-black px-6 py-4 hover:bg-black hover:text-yellow-400 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none min-w-[200px] text-center">
              Fazer Simulado
            </Link>
            <Link href="/progress" className="font-black uppercase tracking-widest bg-green-500 text-black border-4 border-black px-6 py-4 hover:bg-black hover:text-green-500 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none min-w-[200px] text-center">
              Ver Meu Progresso
            </Link>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col p-6">
        <h3 id="faixas" className="text-2xl font-black uppercase tracking-widest mb-6">Trilha de Faixas</h3>
        <div className="flex flex-col gap-4 pb-8 w-full max-w-2xl mx-auto">
          {BELTS.map(belt => (
            <div key={belt.id} className="w-full">
               <BeltListItem 
                 belt={belt} 
                 globalCompletedIds={completedTechniqueIds} 
                 completedHistoryIds={completedHistoryIds} 
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
