import { notFound } from 'next/navigation';
import { getBeltData } from '@/lib/data';
import { ExpandableHistory } from '@/components/ExpandableHistory';
import { TechniqueRow } from '@/components/TechniqueRow';
import { TechniqueAccordion } from '@/components/TechniqueAccordion';
import Link from 'next/link';
import { TechniqueCategory } from '@/lib/data';
import { createClient } from '@/utils/supabase/server';

export default async function BeltPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const belt = getBeltData(slug);

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

  const techniques = belt.allTechniques;
  const completedCount = techniques.filter(t => completedTechniqueIds.has(t.id)).length;
  const totalCount = techniques.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Group techniques by category
  const categories: TechniqueCategory[] = ["Ukemi", "Nage-waza", "Katame-waza"];
  
  const groupedTechniques = categories.map(category => ({
    category,
    techniques: techniques.filter(t => t.category === category)
  })).filter(g => g.techniques.length > 0);

  return (
    <article className="flex flex-col bg-white">
      {/* Header with back button */}
      <div className="border-b-2 border-black relative">
        <div 
          className={`absolute inset-0 z-0 opacity-20 ${belt.color}`}
        />
        <div className="p-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-sm tracking-widest bg-black text-white px-4 py-2 border-2 border-black hover:bg-neutral-800 transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>

          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 text-black mix-blend-multiply">
            Faixa {belt.name}
          </h1>

          <div className="flex flex-col border-4 border-black bg-white mt-8 overflow-hidden relative">
            <div className="flex items-center justify-between p-4 relative z-10 w-full">
              <div className="font-black text-xl uppercase tracking-widest">
                Progresso
              </div>
              <div className="text-4xl font-black animate-pulse-once">
                {progressPercentage}%
              </div>
            </div>
            
            {/* Embedded Progress Bar */}
            <div className="h-4 bg-neutral-200 w-full border-t-4 border-black">
               <div 
                 className="h-full bg-green-500 transition-all duration-500 ease-out border-r-4 border-black" 
                 style={{ width: `${progressPercentage}%` }}
               />
            </div>
          </div>
        </div>
      </div>

      {belt.history.length > 0 && (
        <ExpandableHistory 
          description={belt.history.join(' ')} 
          beltId={belt.id}
          isCompleted={isHistoryCompleted}
        />
      )}

      <div className="p-6 bg-black text-white py-8 border-b-2 border-black">
        <h2 className="text-3xl font-black uppercase tracking-widest text-center">Técnicas Requeridas</h2>
        <p className="text-center mt-2 opacity-70 font-bold max-w-md mx-auto">
          Técnicas cumulativas de todas as faixas progressivas aplicáveis.
        </p>
      </div>

      <div className="flex flex-col">
        {groupedTechniques.length === 0 ? (
           <div className="p-12 text-center text-neutral-500 font-bold uppercase tracking-widest border-b-2 border-black">
              Nenhuma técnica cadastrada
           </div>
        ) : (
          groupedTechniques.map((group) => (
            <div key={group.category} className="border-b-4 border-black last:border-b-0">
              <h3 className="text-2xl font-black p-4 bg-neutral-200 uppercase tracking-tight border-b-2 border-black">
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
    </article>
  );
}
