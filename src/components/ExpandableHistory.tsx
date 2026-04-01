'use client';

import { useState } from 'react';

interface ExpandableHistoryProps {
  description: string;
}

export function ExpandableHistory({ description }: ExpandableHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b-2 border-black">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 font-black uppercase tracking-widest text-xl flex justify-between items-center bg-black text-white hover:bg-neutral-800 transition-colors"
      >
        <span>História e Princípios</span>
        <span className="text-3xl leading-none font-normal">{expanded ? '−' : '+'}</span>
      </button>
      
      {expanded && (
        <div className="p-6 bg-white border-t-2 border-black text-lg leading-relaxed font-medium">
          {description}
        </div>
      )}
    </div>
  );
}
