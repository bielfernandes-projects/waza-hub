import Link from 'next/link';
import { type Belt } from '@/data/mockData';

interface BeltListItemProps {
  belt: Belt;
}

export function BeltListItem({ belt }: BeltListItemProps) {
  return (
    <Link href={`/belts/${belt.slug}`} className="block border-b-2 border-black last:border-b-0 hover:bg-neutral-100 transition-colors">
      <div className="flex items-stretch min-h-[100px]">
        {/* Color Band - Brutalist, edge-to-edge */}
        <div 
          className="w-8 shrink-0 border-r-2 border-black" 
          style={{ backgroundColor: belt.colorVar }}
          aria-hidden="true"
        />
        
        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {belt.name}
          </h2>
          <div className="mt-2 flex items-center gap-4 text-sm font-bold opacity-60 uppercase tracking-widest">
            <span>Progress: 0%</span>
            <span>{belt.techniques.length} Técnicas</span>
          </div>
        </div>

        {/* Arrow / Action Indicator */}
        <div className="w-16 flex items-center justify-center border-l-2 border-black shrink-0">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
