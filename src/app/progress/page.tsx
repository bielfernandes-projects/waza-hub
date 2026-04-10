import { createClient } from '@/utils/supabase/server';
import { BELTS, getBeltWithCumulativeData, type Technique } from '@/lib/data';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/app/actions/profile';

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile();
  if (!profile) {
    redirect('/onboarding');
  }

  // Fetch all user progress
  const { data: progressData } = await supabase
    .from('progress')
    .select('reference_id, type')
    .eq('user_id', user.id)
    .eq('completed', true);

  const completedTechniqueIds = new Set(
    (progressData || []).filter(p => p.type === 'technique').map(p => p.reference_id)
  );

  const completedHistoryIds = new Set(
    (progressData || []).filter(p => p.type === 'history').map(p => p.reference_id)
  );

  // Calculate unique global points
  const allUniqueTechniques = new Set(BELTS.flatMap(b => b.techniques.map((t: Technique) => t.id)));
  const totalTechniques = allUniqueTechniques.size;
  const totalHistories = BELTS.filter(b => b.history.length > 0).length;
  const totalAvailablePoints = totalTechniques + totalHistories;
  
  const totalCompleted = completedTechniqueIds.size + completedHistoryIds.size;
  const globalPercentage = totalAvailablePoints === 0 ? 0 : Math.round((totalCompleted / totalAvailablePoints) * 100);

  return (
    <article className="h-full bg-neutral-100 flex flex-col p-6 overflow-y-auto">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 font-black uppercase text-sm tracking-widest px-4 py-2 border-2 border-black bg-black text-white hover:bg-neutral-800 transition-colors mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Painel de Progresso</h1>
        <p className="text-neutral-600 font-bold uppercase tracking-widest">Acompanhe seu desenvolvimento no caminho suave.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Global Progress Card */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">Maestria Global</h2>
            <span className="text-5xl font-black">{globalPercentage}%</span>
          </div>
          
          <div className="h-6 bg-neutral-200 w-full border-4 border-black relative">
             <div 
               className="h-full bg-green-500 transition-all duration-1000 ease-out border-r-4 border-black" 
               style={{ width: `${globalPercentage}%` }}
             />
          </div>
          <div className="flex justify-between mt-2 font-bold uppercase tracking-widest text-sm text-neutral-500">
            <span>{totalCompleted} concluídas</span>
            <span>{totalAvailablePoints} totais</span>
          </div>
        </div>

        {totalCompleted === 0 && (
          <div className="border-4 border-black bg-yellow-300 p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
             <h3 className="text-xl font-black uppercase tracking-tight mb-2">Nenhum Progresso Ainda</h3>
             <p className="font-bold">Comece assistindo e marcando as técnicas da sua faixa atual.</p>
          </div>
        )}

        <h2 className="text-3xl font-black uppercase tracking-tighter mt-8 mb-4">Progresso por Faixa</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {BELTS.map(belt => {
             const aggregatedData = getBeltWithCumulativeData(belt.id);
             if (!aggregatedData) return null;

             const beltTechs = aggregatedData.techniques;
             const hasHistory = aggregatedData.history.length > 0;
             const historyDone = completedHistoryIds.has(belt.id);
             
             const totalInBelt = beltTechs.length + (hasHistory ? 1 : 0);
             const completedInBelt = beltTechs.filter((t: Technique) => completedTechniqueIds.has(t.id)).length + (hasHistory && historyDone ? 1 : 0);

             const percentage = totalInBelt === 0 ? 0 : Math.round((completedInBelt / totalInBelt) * 100);

             return (
               <Link href={`/belts/${belt.slug}`} key={belt.id} className="block group">
                 <div className="border-4 border-black bg-white flex flex-col hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                   <div className="flex justify-between items-center p-4 gap-2">
                     <span className="font-black uppercase tracking-widest text-sm flex items-center gap-3 min-w-0">
                       <div className="w-5 h-5 rounded-full border-2 border-black flex overflow-hidden shrink-0">
                         {belt.colors.map((c, idx) => (
                           <div key={idx} className={`flex-1 h-full ${c}`} />
                         ))}
                       </div>
                       <span className="truncate">{belt.name}</span>
                     </span>
                     <span className="font-black text-2xl shrink-0">{percentage}%</span>
                   </div>
                   
                   <div className="mx-4 h-3 bg-neutral-200 border-2 border-black">
                     <div 
                       className="h-full bg-green-500 transition-all border-r-2 border-black" 
                       style={{ width: `${percentage}%` }}
                     />
                   </div>

                   <div className="p-4 mt-2 flex flex-wrap gap-2">
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 border border-black ${completedInBelt === totalInBelt && totalInBelt > 0 ? 'bg-green-500 text-black' : 'bg-neutral-100 text-neutral-500'}`}>
                        {completedInBelt}/{totalInBelt} Concluídos
                      </span>
                      {hasHistory && (
                        <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 border border-black ${historyDone ? 'bg-green-500 text-black' : 'bg-white text-black'}`}>
                          Teoria {historyDone ? 'Lida ✔' : 'Pendente'}
                        </span>
                      )}
                   </div>
                 </div>
               </Link>
             )
          })}
        </div>
      </div>
    </article>
  );
}
