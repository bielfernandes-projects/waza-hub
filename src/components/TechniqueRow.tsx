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

  const [sbMedia, setSbMedia] = useState<{ videoId?: string | null; images: string[] } | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalImage(null);
    };
    if (modalImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImage]);

  useEffect(() => {
    let mounted = true;
    
    const fetchSbMedia = async () => {
      // Lazy load supabase client
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      
      try {
        const [{ data: vData }, { data: iData }] = await Promise.all([
          supabase.from('technique_videos').select('youtube_id').eq('technique_id', technique.id).maybeSingle(),
          supabase.from('technique_images').select('image_path').eq('technique_id', technique.id).order('order_index', { ascending: true })
        ]);

        if (mounted && (vData || (iData && iData.length > 0))) {
          const imagesUrls = iData?.map((img: any) => supabase.storage.from('technique-media').getPublicUrl(img.image_path).data.publicUrl) || [];
          setSbMedia({
            videoId: vData?.youtube_id,
            images: imagesUrls
          });
        }
      } catch (err) {
        console.error("Failed to fetch media for", technique.id, err);
      }
    };
    
    fetchSbMedia();
    return () => { mounted = false; };
  }, [technique.id]);

  // Determine final display variables safely
  const displayVideoUrl = sbMedia?.videoId 
    ? `https://www.youtube.com/embed/${sbMedia.videoId}` 
    : technique.videoUrl;
    
  const displayImages = sbMedia && sbMedia.images.length > 0 
    ? sbMedia.images 
    : technique.images || [];

  const hasMedia = !!displayVideoUrl || displayImages.length > 0;

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
    <>
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
          <span className="text-[10px] font-black uppercase tracking-widest border border-black bg-yellow-300 px-1 mt-1 inline-block opacity-90 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            {technique.category === 'Kaeshi-waza' 
              ? 'Técnicas de contra ataque' 
              : technique.category === 'Renraku-henka-waza' 
                ? 'Técnicas de ataques combinados' 
                : (technique.translation || 'Solicitar tradução ao Professor')}
          </span>
        </div>

        {/* Video Toggle Chevron */}
        {hasMedia && (
          <button 
            onClick={onToggleOpen}
            className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'}`}
            aria-label="Expandir mídia"
          >
            <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expanded Media Area */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen && hasMedia ? 'max-h-[2000px] border-t-2 border-black' : 'max-h-0'}`}>
        {hasMedia && (
          <div className="p-4 bg-neutral-200 flex flex-col gap-6">
            {/* Video Rendering (Moved to TOP) */}
            {displayVideoUrl && (
              <div className="relative w-full aspect-video border-4 border-black bg-black flex items-center justify-center">
                {displayVideoUrl === "https://www.youtube.com/embed/example" ? (
                  <span className="font-bold uppercase tracking-widest text-neutral-400">Vídeo Placeholder</span>
                ) : (
                  <iframe
                    src={displayVideoUrl}
                    title={`YouTube video player for ${technique.name}`}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            )}
            
            {/* Images Rendering - Horizontal Carousel */}
            {displayImages.length > 0 && (
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar border-b-2 border-transparent hover:border-black/10 transition-colors">
                {displayImages.map((imageUrl, idx) => (
                  <div 
                    key={idx} 
                    className="flex-none w-64 h-64 border-4 border-black bg-neutral-100 snap-center relative overflow-hidden group cursor-pointer"
                    onClick={() => setModalImage(imageUrl)}
                  >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                       src={imageUrl} 
                       alt={`Passo ${idx + 1} de ${technique.name}`} 
                       className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                       loading="lazy"
                     />
                     <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-black border-2 border-white pointer-events-none">
                       {idx + 1}
                     </div>
                     
                     <div className="absolute bottom-2 right-2 bg-black text-white p-1.5 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                       </svg>
                     </div>
                  </div>
                ))}
              </div>
            )}
            
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
      
      {/* Modal / Image Popup */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white text-black font-black text-2xl border-4 border-black flex items-center justify-center hover:bg-neutral-200 transition-colors z-[110]"
            onClick={(e) => { e.stopPropagation(); setModalImage(null); }}
            aria-label="Fechar pop-up"
          >
            &times;
          </button>
          
          <div 
            className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={modalImage} 
              alt="Visualização expandida" 
              className="max-w-full max-h-full object-contain border-4 border-black bg-white" 
            />
          </div>
        </div>
      )}
    </>
  );
}

