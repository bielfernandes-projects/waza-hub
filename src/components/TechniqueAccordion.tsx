'use client';

import { useState } from 'react';
import { type Technique } from '@/lib/data';
import { TechniqueRow } from './TechniqueRow';

interface TechniqueAccordionProps {
  techniques: Technique[];
  completedIds: Set<string>;
}

export function TechniqueAccordion({ techniques, completedIds }: TechniqueAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col">
      {techniques.map((t) => (
        <TechniqueRow 
          key={t.id} 
          technique={t} 
          isCompleted={completedIds.has(t.id)} 
          isOpen={openId === t.id}
          onToggleOpen={() => handleToggleOpen(t.id)}
        />
      ))}
    </div>
  );
}
