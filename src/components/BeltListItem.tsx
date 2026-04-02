import Link from 'next/link';
import { type Belt, type Technique, getBeltWithCumulativeData } from '@/lib/data';

interface BeltListItemProps {
  belt: Belt;
  globalCompletedIds?: Set<string>;
  completedHistoryIds?: Set<string>;
}

export function BeltListItem({ belt, globalCompletedIds = new Set(), completedHistoryIds = new Set() }: BeltListItemProps) {
  const aggregatedData = getBeltWithCumulativeData(belt.id);
  const aggregatedTechniques = aggregatedData?.techniques || [];
  const aggregatedHistory = aggregatedData?.history || [];
  
  const hasHistory = belt.history.length > 0;
  const isHistoryCompleted = completedHistoryIds.has(belt.id);
  
  const totalCount = aggregatedTechniques.length + (hasHistory ? 1 : 0);
  const completedCount = 
    aggregatedTechniques.filter((t: Technique) => globalCompletedIds.has(t.id)).length + 
    (hasHistory && isHistoryCompleted ? 1 : 0);
    
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Link href={`/belts/${belt.slug}`} className="group flex flex-col h-full border-4 border-black bg-white hover:bg-neutral-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-none">
      
      {/* Dual Color Header Strip */}
      <div className="h-4 w-full flex border-b-4 border-black shrink-0" aria-hidden="true">
         {belt.colors.map((colorClass: string, idx: number) => (
           <div key={idx} className={`flex-1 h-full ${colorClass}`} />
         ))}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-auto">
          {belt.name}
        </h2>

        <div className="mt-8 mb-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
              Progresso
            </span>
            <span className={`text-2xl font-black ${progressPercentage === 100 ? 'text-green-600' : 'text-black'}`}>
              {progressPercentage}%
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="h-3 w-full bg-neutral-200 border-2 border-black">
            <div 
              className="h-full bg-green-500 transition-all border-r-2 border-black" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[10px] font-black uppercase tracking-widest">
          <span className={`px-2 py-1 border-2 border-black text-center ${progressPercentage === 100 && totalCount > 0 ? 'bg-green-500 text-black' : 'bg-white'}`}>
             {completedCount} de {totalCount} Concluídos
          </span>
          <span className="text-center opacity-60">
             {aggregatedTechniques.length} Técnicas {hasHistory ? '+ História' : ''}
          </span>
        </div>
      </div>
      
      {/* Dynamic Action Footer */}
      <div className="h-12 border-t-4 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
        <svg className="w-6 h-6 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

    </Link>
  );
}
