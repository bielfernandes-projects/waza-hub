import { notFound } from 'next/navigation';
import { getBeltWithCumulativeData, type Technique } from '@/lib/data';
import { ExpandableHistory } from '@/components/ExpandableHistory';
import { TechniqueAccordion } from '@/components/TechniqueAccordion';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function BeltPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const belt = getBeltWithCumulativeData(slug);

  if (!belt) {
    notFound();
  }

  // Fetch progress from Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let completedTechniqueIds = new Set<string>();
  let isHistoryCompleted = false;

  if (user) {
    const { data: progressData } = await supabase
      .from('progress')
      .select('reference_id, type')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (progressData) {
      completedTechniqueIds = new Set(
        progressData
          .filter(p => p.type === 'technique')
          .map(p => p.reference_id)
      );
      
      isHistoryCompleted = progressData.some(
        p => p.type === 'history' && p.reference_id === belt.id
      );
    }
  }

  const techniques = belt.techniques;
  const hasHistory = belt.history.length > 0;
  
  // Real Math Mapping
  const completedTechsCount = techniques.filter((t: Technique) => completedTechniqueIds.has(t.id)).length;
  const totalCount = techniques.length + (hasHistory ? 1 : 0);
  const completedCount = completedTechsCount + (hasHistory && isHistoryCompleted ? 1 : 0);
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Group techniques by category dynamically from current techniques
  const categories = Array.from(new Set(techniques.map((t: Technique) => t.category)));
  
  const groupedTechniques = categories.map((category: string) => ({
    category,
    techniques: techniques.filter((t: Technique) => t.category === category)
  })).filter(g => g.techniques.length > 0);

  return (
    <article className="flex flex-col bg-white">
      {/* Header Profile with Back Button */}
      <div className="border-b-4 border-black relative overflow-hidden">
        {/* Dual Colors Strip via absolute backgrounds */}
        <div className="absolute inset-0 z-0 flex opacity-30 pointer-events-none" aria-hidden="true">
          {belt.colors.map((c, i) => (
             <div key={i} className={`flex-1 h-full ${c}`} />
          ))}
        </div>
        
        <div className="p-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-sm tracking-widest bg-black text-white px-4 py-2 border-2 border-black hover:bg-neutral-800 transition-colors mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>

          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 text-black mix-blend-multiply drop-shadow-sm">
            Faixa {belt.name}
          </h1>

          <div className="flex flex-col border-4 border-black bg-white mt-8 overflow-hidden relative shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between p-4 relative z-10 w-full">
              <div className="font-black text-xl uppercase tracking-widest text-black">
                Progresso Geral
              </div>
              <div className="text-4xl font-black text-black">
                {progressPercentage}%
              </div>
            </div>
            
            {/* Embedded Progress Bar */}
            <div className="h-6 bg-neutral-200 w-full border-t-4 border-black">
               <div 
                 className="h-full bg-green-500 transition-all duration-700 ease-out border-r-4 border-black" 
                 style={{ width: `${progressPercentage}%` }}
               />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: HISTÓRIA E VOCABULÁRIO */}
      {hasHistory && (
        <section className="flex flex-col border-b-4 border-black">
          <div className="bg-black text-white px-6 py-4">
            <h2 className="text-2xl font-black uppercase tracking-widest">1. História e Vocabulário</h2>
          </div>
          <ExpandableHistory 
            description={belt.history.join(' ')} 
            beltId={belt.id}
            isCompleted={isHistoryCompleted}
          />
        </section>
      )}

      {/* SECTION 2: TÉCNICAS REQUERIDAS */}
      <section className="flex flex-col border-b-4 border-black">
        <div className="bg-black text-white px-6 py-4">
          <h2 className="text-2xl font-black uppercase tracking-widest flex items-center justify-between">
            <span>2. Técnicas Acumuladas</span>
            <span className="text-sm border-2 border-white px-2 py-1">{completedTechsCount}/{techniques.length}</span>
          </h2>
        </div>
        
        <div className="flex flex-col bg-white">
          {groupedTechniques.length === 0 ? (
             <div className="p-12 text-center text-neutral-500 font-bold uppercase tracking-widest">
                Nenhuma técnica cadastrada
             </div>
          ) : (
            groupedTechniques.map((group) => (
              <div key={group.category} className="border-b-4 border-black last:border-b-0">
                <h3 className="text-xl font-black p-4 bg-neutral-200 uppercase tracking-widest border-b-2 border-black sticky top-[64px] z-20">
                  {group.category}
                </h3>
                <TechniqueAccordion 
                  techniques={group.techniques} 
                  completedIds={completedTechniqueIds} 
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION 3: QUIZ SIMULADO */}
      <section className="flex flex-col bg-yellow-50 min-h-[300px]">
        <div className="bg-yellow-400 text-black px-6 py-4 border-b-4 border-black border-t-4 md:border-t-0 font-black flex items-center justify-between">
          <h2 className="text-2xl uppercase tracking-widest flex items-center gap-3">
            <span>3. Simulado (Quiz)</span>
          </h2>
          <span className="text-[10px] bg-black text-white px-2 py-0.5 whitespace-nowrap">DISPONÍVEL</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:20px_20px]">
           <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-lg w-full">
             <div className="w-20 h-20 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto mb-6 transform -rotate-3">
               <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
             
             <h3 className="font-black text-4xl uppercase tracking-tight mb-4 drop-shadow-sm">
               Pronto para o Teste?
             </h3>
             <p className="font-bold text-lg mb-8 text-neutral-600">
               Avalie seus conhecimentos teóricos de História, Vocabulário e Técnicas exigidos para a <span className="text-black">Faixa {belt.name}</span>.
             </p>
             
             <Link 
               href={`/quiz/flow/${belt.id}`}
               className="block w-full font-black uppercase tracking-widest bg-black text-white px-8 py-5 border-4 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2"
             >
               Iniciar Simulado Agora
             </Link>
             
             <p className="mt-6 text-[10px] uppercase font-black tracking-widest opacity-40">
               O simulado inclui questões acumuladas de todas as faixas anteriores.
             </p>
           </div>
        </div>
      </section>

    </article>
  );
}
