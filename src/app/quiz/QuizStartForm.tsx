'use client'

import { useState } from 'react'
import { BELTS } from '@/lib/data'
import Link from 'next/link'

const COUNT_RULES: Record<string, number> = {
  'branca-cinza': 10,
  'cinza': 10,
  'cinza-azul': 10,
  'azul': 15,
  'azul-amarela': 15,
  'amarela': 15,
  'amarela-laranja': 15,
  'laranja': 20,
  'verde': 20,
  'roxa': 25,
  'marrom': 30,
  'preta': 30
};

export function QuizStartForm() {
  const [selectedBelt, setSelectedBelt] = useState(BELTS[0].id)
  
  const questionCount = COUNT_RULES[selectedBelt] || 10;

  return (
    <div className="space-y-6">
      <div>
        <label className="block font-bold text-sm text-gray-500 uppercase tracking-widest mb-2">Sua Faixa Atual</label>
        <select 
          value={selectedBelt} 
          onChange={e => setSelectedBelt(e.target.value)} 
          className="w-full border-4 border-black p-4 text-xl font-bold uppercase tracking-widest bg-white appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-green-400"
        >
          {BELTS.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-gray-100 border-l-4 border-black font-medium">
         Regras: <span className="font-bold">{questionCount} questões</span> abordando todas as faixas acumuladas até {BELTS.find(b=>b.id===selectedBelt)?.name}.
      </div>

      <Link 
        href={`/quiz/flow/${selectedBelt}`} 
        className="block w-full bg-black text-white text-center py-5 font-black uppercase tracking-widest text-xl hover:bg-green-500 hover:text-black transition-colors"
      >
        Iniciar Quiz
      </Link>
    </div>
  )
}
