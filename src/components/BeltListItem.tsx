import Link from 'next/link';
import { type Belt, getTechniquesForBelt } from '@/lib/data';

interface BeltListItemProps {
  belt: Belt;
  globalCompletedIds?: Set<string>;
}

export function BeltListItem({ belt, globalCompletedIds = new Set() }: BeltListItemProps) {
  // Aggregate techniques to show correct total available
  const aggregatedTechniques = getTechniquesForBelt(belt.id);
  
  const totalCount = aggregatedTechniques.length;
  const completedCount = aggregatedTechniques.filter(t => globalCompletedIds.has(t.id)).length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Link href={`/belts/${belt.slug}`} className="block border-b-2 border-black last:border-b-0 hover:bg-neutral-100 transition-colors group">
      <div className="flex flex-col sm:flex-row items-stretch min-h-[100px]">
        {/* Color Band - Brutalist, edge-to-edge */}
        <div 
          className={`w-full sm:w-12 h-6 sm:h-auto shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-black ${belt.color}`} 
          aria-hidden="true"
        />
        
        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              {belt.name}
            </h2>
            <div className="hidden sm:flex items-center gap-2 font-black text-xl">
              <span className={progressPercentage === 100 ? 'text-green-600' : ''}>{progressPercentage}%</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest">
            <span className={`px-2 py-1 border border-black ${progressPercentage === 100 && totalCount > 0 ? 'bg-green-500 text-black' : 'bg-white'}`}>
              Progresso: {completedCount}/{totalCount}
            </span>
            <span className="opacity-60">{aggregatedTechniques.length} Técnicas Acumuladas</span>
          </div>

          {/* Micro Progress Bar */}
          <div className="h-2 w-full max-w-md bg-neutral-200 border-2 border-black mt-4 hidden sm:block">
            <div 
              className="h-full bg-green-500 transition-all border-r-2 border-black" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Arrow / Action Indicator */}
        <div className="w-full sm:w-16 h-12 sm:h-auto flex items-center justify-center border-t-2 sm:border-t-0 sm:border-l-2 border-black shrink-0 bg-neutral-50 group-hover:bg-black group-hover:text-white transition-colors">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
