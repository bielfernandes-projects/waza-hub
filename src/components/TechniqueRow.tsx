'use client';

import { useState, useTransition, useEffect } from 'react';
import { type Technique } from '@/lib/data';
import { toggleProgress } from '@/app/actions/progress';

interface TechniqueRowProps {
  technique: Technique;
  isCompleted: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export function TechniqueRow({ technique, isCompleted, isOpen = false, onToggleOpen }: TechniqueRowProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [isPending, startTransition] = useTransition();

  // Sync with server state if it changes unexpectedly due to revalidatePath
  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted]);

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // optimistic update
    const nextState = !completed;
    setCompleted(nextState);

    // Call server action
    startTransition(async () => {
      try {
        await toggleProgress(technique.id, nextState, 'technique');
      } catch (err) {
        // revert on failure
        setCompleted(!nextState);
        console.error(err);
      }
    });
  };

  return (
    <div className={`border-b-2 border-black transition-colors ${completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-center gap-4 p-4 pr-6">
        {/* Completion Checkbox */}
        <button 
          onClick={handleToggle}
          disabled={isPending}
          className={`w-8 h-8 flex-shrink-0 border-2 border-black flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-wait ${completed ? 'bg-green-500' : 'bg-white hover:bg-neutral-100'}`}
          aria-label={completed ? `Desmarcar ${technique.name}` : `Marcar ${technique.name}`}
        >
          {completed && (
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 cursor-pointer py-2" onClick={onToggleOpen} role="button">
          <div className="flex items-center gap-2">
            <h3 className={`font-black tracking-tight text-xl uppercase ${completed ? 'text-green-900 line-through opacity-70' : 'text-black'}`}>
              {technique.name}
            </h3>
            {completed && (
              <span className="text-[10px] bg-green-500 text-black border border-black font-black uppercase tracking-widest px-1 py-0.5 whitespace-nowrap hidden sm:inline-block">
                Concluído
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest border border-black px-1 mt-1 inline-block opacity-80">
            {technique.category}
          </span>
        </div>

        {/* Video Toggle Chevron */}
        {technique.videoUrl && (
          <button 
            onClick={onToggleOpen}
            className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'}`}
            aria-label="Expandir vídeo"
          >
            <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expanded Video Embed */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && technique.videoUrl ? 'max-h-[800px] border-t-2 border-black' : 'max-h-0'}`}>
        {technique.videoUrl && (
          <div className="p-4 bg-neutral-100 flex flex-col gap-4">
            <div className="relative w-full aspect-video border-4 border-black bg-black flex items-center justify-center">
              {technique.videoUrl === "https://www.youtube.com/embed/example" ? (
                <span className="font-bold uppercase tracking-widest text-neutral-400">Vídeo Placeholder</span>
              ) : (
                <iframe
                  src={technique.videoUrl}
                  title={`YouTube video player for ${technique.name}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            
            {/* Fallback marking explicitly available */}
            {!completed && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleToggle}
                  disabled={isPending}
                  className="flex items-center gap-2 font-black uppercase text-xs tracking-widest px-4 py-3 bg-white hover:bg-green-500 hover:text-black border-2 border-black transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Marcar como Assistido (Concluído)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

