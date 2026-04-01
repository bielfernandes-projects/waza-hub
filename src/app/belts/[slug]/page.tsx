import { notFound } from 'next/navigation';
import { getBeltData } from '@/lib/data';
import { ExpandableHistory } from '@/components/ExpandableHistory';
import { TechniqueRow } from '@/components/TechniqueRow';
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

  let completedIds = new Set<string>();

  if (user) {
    const { data: progressData } = await supabase
      .from('progress')
      .select('technique_id')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (progressData) {
      completedIds = new Set(progressData.map(p => p.technique_id));
    }
  }

  const techniques = belt.allTechniques;
  const completedCount = techniques.filter(t => completedIds.has(t.id)).length;
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
          <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-sm tracking-widest bg-black text-white px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>

          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 text-black mix-blend-multiply">
            Faixa {belt.name}
          </h1>

          <div className="flex items-center justify-between border-4 border-black p-4 bg-white mt-8">
            <div className="font-black text-xl uppercase tracking-widest">
              Progresso
            </div>
            <div className="text-4xl font-black animate-pulse-once">
              {progressPercentage}%
            </div>
          </div>
        </div>
      </div>

      {belt.history.length > 0 && (
        <ExpandableHistory description={belt.history.join(' ')} />
      )}

      <div className="p-6 bg-black text-white py-8 border-b-2 border-black">
        <h2 className="text-3xl font-black uppercase tracking-widest text-center">Técnicas Requeridas</h2>
        <p className="text-center mt-2 opacity-70 font-bold max-w-md mx-auto">
          Técnicas cumulativas de todas as faixas progressivas aplicáveis.
        </p>
      </div>

      <div className="flex flex-col">
        {groupedTechniques.map((group, i) => (
          <div key={group.category} className="border-b-4 border-black last:border-b-0">
            <h3 className="text-2xl font-black p-4 bg-neutral-200 uppercase tracking-tight border-b-2 border-black">
              {group.category}
            </h3>
            <div className="flex flex-col">
              {group.techniques.map((t) => (
                <TechniqueRow 
                  key={t.id} 
                  technique={t} 
                  isCompleted={completedIds.has(t.id)} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
