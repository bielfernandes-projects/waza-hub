'use client';

import { useState, useTransition, useEffect } from 'react';
import { toggleProgress } from '@/app/actions/progress';

interface ExpandableHistoryProps {
  items: string[];
  beltId: string;
  isCompleted: boolean;
}

export function ExpandableHistory({ items, beltId, isCompleted }: ExpandableHistoryProps) {
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

  const getOrder = (item: string) => {
    const isVocabulario = item.startsWith('Vocabulário:') || item.startsWith('Saudações:');
    const isHistorico = item.startsWith('Histórico:');
    const isPrincipio = item.toLowerCase().includes('princípio');

    if (isVocabulario) return 1;
    if (isHistorico) return 2;
    if (isPrincipio) return 4;
    return 3; // Informação
  };

  const sortedItems = [...items].sort((a, b) => getOrder(a) - getOrder(b));

  const renderContentBlock = (item: string, index: number) => {
    const isVocabulario = item.startsWith('Vocabulário:') || item.startsWith('Saudações:');
    const isHistorico = item.startsWith('Histórico:');
    const isPrincipio = item.toLowerCase().includes('princípio');

    let category = 'Geral';
    let content = item;
    let className = "bg-white border-2 border-black p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]";

    if (isHistorico) {
      category = 'Histórico';
      content = item.replace('Histórico:', '').trim();
      className = "bg-blue-50 border-l-8 border-blue-600 border-y-2 border-r-2 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]";
    } else if (isVocabulario) {
      category = 'Vocabulário';
      content = item.startsWith('Vocabulário:') ? item.replace('Vocabulário:', '').trim() : item;
      className = "bg-neutral-50 border-2 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]";
    } else if (isPrincipio) {
      category = 'Princípio';
      content = item.replace(/Princípio(s)? do Judô:/i, '').trim();
      className = "bg-yellow-50 italic border-l-8 border-yellow-400 border-y-2 border-r-2 border-black p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-xl italic font-bold";
    }

    return (
      <div key={index} className={`${className} mb-6 last:mb-0 transition-all hover:translate-x-1`}>
        <div className="flex items-center gap-2 mb-3">
          {isVocabulario && (
            <span className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
              Vocabulário
            </span>
          )}
          {isHistorico && (
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
              Linha do Tempo
            </span>
          )}
          {!isHistorico && !isVocabulario && !isPrincipio && (
            <span className="bg-neutral-200 text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
              Informação
            </span>
          )}
          {isPrincipio && (
            <span className="bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
              Princípios
            </span>
          )}
        </div>
        
        {isHistorico && <h4 className="font-black text-blue-900 uppercase tracking-tight text-sm mb-2 opacity-50">CONTEXTO HISTÓRICO</h4>}
        
        <p className={`text-black leading-relaxed ${isPrincipio ? 'text-2xl tracking-tight' : 'text-lg font-medium'}`}>
          {content}
        </p>
      </div>
    );
  };

  return (
    <div className={`transition-colors border-b-4 border-black ${completed ? 'bg-green-50' : 'bg-neutral-100'}`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left p-6 font-black uppercase tracking-widest text-xl flex justify-between items-center transition-colors group ${completed ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-black hover:bg-neutral-50'}`}
      >
        <div className="flex items-center gap-3">
          <span className="group-hover:translate-x-1 transition-transform">Ensinamentos Teóricos</span>
          {completed && (
            <span className="text-[10px] border-2 border-white px-2 py-0.5 bg-black text-white shadow-[2px_2px_0px_white]">
              CONCLUÍDO
            </span>
          )}
        </div>
        
        <svg 
          className={`w-8 h-8 transform transition-transform duration-500 ease-in-out ${expanded ? 'rotate-180' : 'rotate-0'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {expanded && (
        <div className="p-6 sm:p-8 bg-neutral-100 border-t-4 border-black">
          <div className="max-w-3xl mx-auto flex flex-col">
            {sortedItems.map((item, idx) => renderContentBlock(item, idx))}
            
            <div className="flex justify-center mt-12 mb-4">
              <button
                 onClick={handleToggle}
                 disabled={isPending}
                 className={`flex items-center gap-3 font-black uppercase text-base tracking-widest px-8 py-4 border-4 border-black transition-all shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none bg-white text-black hover:bg-green-500 hover:text-black hover:scale-105 disabled:opacity-50`}
              >
                 {completed ? (
                   <>
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M5 13l4 4L19 7" />
                     </svg>
                     Conhecimento Adquirido
                   </>
                 ) : (
                   <>Marcar como estudado</>
                 )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

