'use client';

import { useState, useTransition, useEffect } from 'react';
import { toggleProgress } from '@/app/actions/progress';

interface ExpandableHistoryProps {
  description: string;
  beltId: string;
  isCompleted: boolean;
}

export function ExpandableHistory({ description, beltId, isCompleted }: ExpandableHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted]);

  const handleToggle = () => {
    const nextState = !completed;
    setCompleted(nextState);

    startTransition(async () => {
      try {
        await toggleProgress(beltId, nextState, 'history');
      } catch (err) {
        setCompleted(!nextState);
        console.error(err);
      }
    });
  };

  return (
    <div className={`border-b-2 border-black transition-colors ${completed ? 'bg-green-50' : 'bg-white'}`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left p-6 font-black uppercase tracking-widest text-xl flex justify-between items-center transition-colors ${completed ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-black text-white hover:bg-neutral-800'}`}
      >
        <div className="flex items-center gap-3">
          <span>História e Princípios</span>
          {completed && (
            <span className="text-xs border-2 border-white px-2 py-1 leading-none bg-green-500 text-black">
              Concluído
            </span>
          )}
        </div>
        
        {/* Animated Chevron */}
        <svg 
          className={`w-6 h-6 transform transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {expanded && (
        <div className="p-6 bg-transparent border-t-2 border-black text-lg leading-relaxed font-medium">
          <p className="mb-6">{description}</p>
          
          <div className="flex justify-end">
            <button
               onClick={handleToggle}
               disabled={isPending}
               className={`flex items-center gap-2 font-black uppercase text-sm tracking-widest px-4 py-3 border-2 border-black transition-colors disabled:opacity-50 ${completed ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-white text-black hover:bg-neutral-200'}`}
            >
               {completed ? (
                 <>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M5 13l4 4L19 7" />
                   </svg>
                   Concluído
                 </>
               ) : (
                 <>Marcar como lido</>
               )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
