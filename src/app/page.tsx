import { BELTS } from '@/lib/data';
import { calculateMonthsToBlackBelt } from '@/lib/belt-progression';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/app/actions/profile';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Profile
  const profile = await getUserProfile();
  if (!profile) {
    redirect('/onboarding');
  }

  // User's current belt data
  const userBeltIndex = BELTS.findIndex(b => b.id === profile.belt_id);
  const userBelt = userBeltIndex !== -1 ? BELTS[userBeltIndex] : BELTS[0];

  // Fetch Progress
  let completedTechniqueIds = new Set<string>();
  let completedHistoryIds = new Set<string>();

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

  // --- Calculations ---

  // 1. Global Progress (unique techniques only)
  const allUniqueTechniques = new Set<string>();
  BELTS.forEach(belt => {
    belt.techniques.forEach(t => allUniqueTechniques.add(t.id));
  });
  
  const totalTechniques = allUniqueTechniques.size;
  const completedTechniquesCount = Array.from(allUniqueTechniques).filter(id => completedTechniqueIds.has(id)).length;
  const globalProgressPercentage = totalTechniques === 0 ? 0 : Math.min(100, Math.round((completedTechniquesCount / totalTechniques) * 100));

  // 2. Current Belt Progress (unique techniques from this belt only)
  const beltTechniques = new Set(userBelt.techniques.map(t => t.id));
  const totalBeltTechniques = beltTechniques.size;
  const completedBeltTechniques = Array.from(beltTechniques).filter(id => completedTechniqueIds.has(id)).length;
  const beltProgressPercentage = totalBeltTechniques === 0 ? 0 : Math.min(100, Math.round((completedBeltTechniques / totalBeltTechniques) * 100));

  // 3. Time Estimate (belt-specific month mapping)
  const allBeltIds = BELTS.map(b => b.id);
  const estimatedMonths = calculateMonthsToBlackBelt(userBelt.id, allBeltIds);

  // Extract first name
  const firstName = profile.full_name?.split(' ')[0] || 'Judoca';

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] bg-neutral-100 pb-12">
      {/* 1. HEADER */}
      <div className="bg-white p-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
          Olá, {firstName}
        </h1>
        <p className="font-bold text-neutral-600 uppercase text-xs tracking-widest">
          {profile.dojo_name ? `${profile.dojo_name}` : 'Meu Dashboard'}
        </p>
      </div>

      <div className="p-6 flex flex-col gap-8 max-w-3xl mx-auto w-full">
        {/* 2. CURRENT BELT CARD */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">
          {/* Belt Color Strip */}
          <div className="absolute top-0 left-0 w-full h-4 flex">
            {userBelt.colors.map((c, i) => (
               <div key={i} className={`flex-1 h-full ${c}`} />
            ))}
          </div>

          <div className="p-6 pt-10 border-b-2 border-neutral-200">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-1">
              Sua Faixa Atual
            </h2>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black uppercase tracking-tight">
                {userBelt.name}
              </h3>
              <span className="text-4xl font-black">{beltProgressPercentage}%</span>
            </div>
            
            {/* Belt Progress Bar */}
            <div className="h-4 bg-neutral-200 w-full border-2 border-black mt-4">
              <div 
                className="h-full bg-green-500 transition-all duration-700 border-r-2 border-black" 
                style={{ width: `${beltProgressPercentage}%` }}
              />
            </div>
            <p className="text-xs font-bold text-neutral-500 mt-2 uppercase tracking-widest text-right">
              {completedBeltTechniques} de {totalBeltTechniques} técnicas concluídas
            </p>
          </div>
          
          <div className="p-4 bg-neutral-50 flex justify-end">
            <Link 
              href={`/belts/${userBelt.id}`}
              className="bg-black text-white font-black uppercase tracking-widest text-sm px-6 py-3 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors"
            >
              Continuar Treino
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 3. GLOBAL PROGRESS */}
          <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4">
              Progresso até a Faixa Preta
            </h3>
            <div className="flex items-end justify-between mb-4">
              <span className="text-4xl font-black text-black">{globalProgressPercentage}%</span>
            </div>
            <div className="h-4 bg-neutral-200 w-full border-2 border-black">
              <div 
                className="h-full bg-black transition-all duration-700 border-r-2 border-black" 
                style={{ width: `${globalProgressPercentage}%` }}
              />
            </div>
          </div>

          {/* 4. TIME ESTIMATE */}
          <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">
              Estimativa para Faixa Preta
            </h3>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-3xl font-black tracking-tight flex-1 border-b-2 border-black pb-1">
                ~{estimatedMonths} meses
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold text-neutral-400 mt-3 tracking-widest">
              Baseado na progressao oficial de faixas
            </p>
          </div>
        </div>

        {/* TRILHA DE FAIXAS (BOTÃO) */}
        <div className="mt-8 flex justify-center">
          <Link 
            href="/progress"
            className="w-full bg-white border-4 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between group"
          >
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">Trilha Completa de Faixas</h3>
               <p className="font-bold text-neutral-500 uppercase tracking-widest text-xs">Acessar currículo e progressões individuais</p>
            </div>
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
