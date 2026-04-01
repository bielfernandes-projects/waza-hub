import { notFound } from 'next/navigation';
import { getBeltWithCumulativeTechniques } from '@/data/mockData';
import { ExpandableHistory } from '@/components/ExpandableHistory';
import { TechniqueRow } from '@/components/TechniqueRow';
import Link from 'next/link';
import { TechniqueCategory } from '@/data/mockData';

export default async function BeltPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const belt = getBeltWithCumulativeTechniques(slug);

  if (!belt) {
    notFound();
  }

  // Calculate completion statically for now. MVP goal is just UI structure + toggle state per row.
  const completedCount = 0; 
  const totalCount = belt.techniques.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Group techniques by category
  const categories: TechniqueCategory[] = ["Ukemi", "Nage-waza", "Katame-waza", "Kumi-kata"];
  
  const groupedTechniques = categories.map(category => ({
    category,
    techniques: belt.techniques.filter(t => t.category === category)
  })).filter(g => g.techniques.length > 0);

  return (
    <article className="flex flex-col bg-white">
      {/* Header with back button */}
      <div className="border-b-2 border-black relative">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundColor: belt.colorVar }}
        />
        <div className="p-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-sm tracking-widest bg-black text-white px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>

          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4" style={{ color: belt.colorVar !== 'var(--color-belt-branca)' ? belt.colorVar : 'black' }}>
            Faixa {belt.name}
          </h1>

          <div className="flex items-center justify-between border-4 border-black p-4 bg-white mt-8">
            <div className="font-black text-xl uppercase tracking-widest">
              Progresso
            </div>
            <div className="text-4xl font-black">
              {progressPercentage}%
            </div>
          </div>
        </div>
      </div>

      <ExpandableHistory description={belt.description} />

      <div className="p-6 bg-black text-white py-8 border-b-2 border-black">
        <h2 className="text-3xl font-black uppercase tracking-widest text-center">Técnicas Requeridas</h2>
        <p className="text-center mt-2 opacity-70 font-bold max-w-md mx-auto">
          Técnicas cumulativas de todas as faixas progressivas até chegar a meta.
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
                <TechniqueRow key={t.id} technique={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
