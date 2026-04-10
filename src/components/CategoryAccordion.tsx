'use client';

import { useState } from 'react';
import { TechniqueAccordion } from './TechniqueAccordion';
import { type Technique } from '@/lib/data';

interface CategoryAccordionProps {
  category: string;
  techniques: Technique[];
  completedIds: Set<string>;
}

export function CategoryAccordion({ category, techniques, completedIds }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b-4 border-black last:border-b-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-4 bg-neutral-200 border-b-2 border-black sticky top-[64px] z-20 hover:bg-neutral-300 transition-colors group"
      >
        <div className="flex items-center gap-3">
           <span className="text-xl font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
             {category}
           </span>
           <span className="text-[10px] font-black uppercase tracking-widest border-2 border-black px-2 py-0.5 bg-white text-black">
             {techniques.length} Técnicas
           </span>
        </div>
        <svg 
          className={`w-8 h-8 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="bg-white">
          <TechniqueAccordion 
            techniques={techniques} 
            completedIds={completedIds} 
          />
        </div>
      )}
    </div>
  );
}
