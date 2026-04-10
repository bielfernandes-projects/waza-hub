'use client'

import { useState } from 'react'
import { submitProfile } from '@/app/actions/profile'
import { BELTS } from '@/lib/data'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { DateInput } from '@/components/DateInput'

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      await submitProfile(formData)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar perfil')
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center bg-neutral-100 min-h-screen">
      <div className="mb-8 relative h-20 w-48">
        <Image 
          src="/logo.png" 
          alt="WazaHub Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="w-full max-w-sm bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center">Seja Bem-vindo</h2>
        <p className="text-center font-bold opacity-70 mb-6 text-sm">Complete seu perfil de Judoca</p>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-600 text-red-900 px-4 py-3 font-bold mb-4 uppercase text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="fullName">Nome Completo</label>
            <input 
              id="fullName" 
              name="fullName" 
              type="text" 
              required 
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          
          <DateInput
            id="birthDate"
            name="birthDate"
            label="Data de Nascimento"
            type="date"
            required
          />

          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="dojoName">Dojo Principal</label>
            <input 
              id="dojoName" 
              name="dojoName" 
              type="text" 
              required 
              placeholder="Ex: Associação de Judô, Clube..."
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="beltId">Faixa Atual</label>
            <select 
              id="beltId" 
              name="beltId" 
              required 
              defaultValue=""
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black uppercase text-sm bg-white"
            >
              <option value="" disabled>Selecione sua faixa</option>
              {BELTS.map(belt => (
                <option key={belt.id} value={belt.id}>Faixa {belt.name}</option>
              ))}
            </select>
          </div>

          <DateInput
            id="graduationDate"
            name="graduationDate"
            label="Graduou em (Mês/Ano)"
            type="month"
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 border-4 border-black bg-black text-white font-black uppercase py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Entrar no Tatame'}
          </button>
        </form>
      </div>
    </div>
  )
}
