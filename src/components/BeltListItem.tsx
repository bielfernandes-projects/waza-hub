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
    <Link href={`/belts/${belt.slug}`} className="group flex w-full border-4 border-black bg-white hover:bg-neutral-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-none overflow-hidden min-h-[96px]">
      
      {/* Heavy Visual Color indicator (Left side) */}
      <div className="w-12 sm:w-16 flex flex-col border-r-4 border-black shrink-0" aria-hidden="true">
         {belt.colors.map((colorClass: string, idx: number) => (
           <div key={idx} className={`flex-1 w-full ${colorClass}`} />
         ))}
      </div>

      <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4 min-w-0">
        
        {/* Name and Text */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter break-words leading-tight">
             {belt.name.replace('/', '/\u200B')}
          </h2>
           <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1 opacity-60 truncate">
            {aggregatedTechniques.length} Técnicas {hasHistory ? '+ Conteúdo Teórico' : ''}
          </div>
        </div>

        {/* Progress Bar and Status */}
        <div className="flex flex-col w-full sm:w-48 shrink-0 mt-2 sm:mt-0">
          <div className="flex justify-between items-end mb-1">
            <span className={`text-[10px] font-black uppercase tracking-widest ${progressPercentage === 100 ? 'text-green-600' : 'text-neutral-500'}`}>
               {completedCount} de {totalCount} concluídos
            </span>
            <span className={`text-sm font-black ${progressPercentage === 100 ? 'text-green-600' : 'text-black'}`}>
              {progressPercentage}%
            </span>
          </div>
          
          {/* Micro Progress Bar */}
          <div className="h-2 w-full bg-neutral-200 border-2 border-black">
            <div 
              className="h-full bg-green-500 transition-all border-r-2 border-black" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

      </div>
      
      {/* Right navigation arrow */}
      <div className="w-12 sm:w-16 border-l-4 border-black bg-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shrink-0">
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </div>

    </Link>
  );
}

