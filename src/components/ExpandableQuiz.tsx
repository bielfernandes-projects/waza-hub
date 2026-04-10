'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ExpandableQuizProps {
  beltName: string;
  beltId: string;
}

export function ExpandableQuiz({ beltName, beltId }: ExpandableQuizProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="flex flex-col bg-yellow-50">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="bg-yellow-400 text-black px-6 py-5 border-b-4 border-black border-t-4 md:border-t-0 font-black flex items-center justify-between w-full text-left transition-colors hover:bg-yellow-500 group"
      >
        <h2 className="text-2xl uppercase tracking-widest flex items-center gap-3 group-hover:translate-x-1 transition-transform">
          <span>3. Simulado (Quiz)</span>
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-[10px] bg-black text-white px-2 py-0.5 whitespace-nowrap hidden sm:inline-block">DISPONÍVEL</span>
          <svg 
            className={`w-8 h-8 transform transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {expanded && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:20px_20px] border-b-4 border-black">
           <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-lg w-full animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="w-20 h-20 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto mb-6 transform -rotate-3">
               <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
             
             <h3 className="font-black text-4xl uppercase tracking-tight mb-4 drop-shadow-sm">
               Pronto para o Teste?
             </h3>
             <p className="font-bold text-lg mb-8 text-neutral-600">
               Avalie seus conhecimentos teóricos de Conteúdo Teórico, Vocabulário e Técnicas exigidos para a <span className="text-black">Faixa {beltName}</span>.
             </p>
             
             <Link 
               href={`/quiz/flow/${beltId}`}
               className="block w-full font-black uppercase tracking-widest bg-black text-white px-8 py-5 border-4 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2"
             >
               Iniciar Simulado Agora
             </Link>
             
             <p className="mt-6 text-[10px] uppercase font-black tracking-widest opacity-40">
               O simulado inclui questões acumuladas de todas as faixas anteriores.
             </p>
           </div>
        </div>
      )}
    </section>
  );
}
