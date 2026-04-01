'use client';

import { useState } from 'react';
import { type Technique } from '@/data/mockData';

interface TechniqueRowProps {
  technique: Technique;
}

export function TechniqueRow({ technique }: TechniqueRowProps) {
  const [completed, setCompleted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border-b-2 border-black transition-colors ${completed ? 'bg-neutral-100' : 'bg-white'}`}>
      <div className="flex items-center p-4 gap-4">
        {/* Completion Checkbox */}
        <button 
          onClick={() => setCompleted(!completed)}
          className={`w-8 h-8 shrink-0 border-2 border-black flex items-center justify-center transition-colors ${completed ? 'bg-green-500' : 'bg-white'}`}
          aria-label={completed ? `Mark ${technique.name} as incomplete` : `Mark ${technique.name} as complete`}
        >
          {completed && (
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Info */}
        <div className="flex-1" onClick={() => setExpanded(!expanded)} role="button">
          <h3 className={`font-bold text-xl uppercase ${completed ? 'line-through opacity-50' : ''}`}>
            {technique.name}
          </h3>
          <span className="text-xs font-black uppercase tracking-widest border border-black px-1 mt-1 inline-block">
            {technique.category}
          </span>
        </div>

        {/* Video Toggle */}
        {technique.videoId && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-10 h-10 border-2 border-black flex items-center justify-center shrink-0 hover:bg-black hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
        )}
      </div>

      {/* Expanded Video Embed */}
      {expanded && technique.videoId && (
        <div className="p-4 border-t-2 border-black bg-neutral-50 overflow-hidden">
          {/* Note: In MVP we use 'example' so we just show a placeholder iframe */}
          <div className="relative w-full aspect-video border-2 border-black bg-neutral-200 flex items-center justify-center">
            {technique.videoId === "example" ? (
              <span className="font-bold uppercase tracking-widest text-neutral-400">Vídeo Placeholder</span>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${technique.videoId}`}
                title={`YouTube video player for ${technique.name}`}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
