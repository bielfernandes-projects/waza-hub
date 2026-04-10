'use client'

import { useState, useEffect } from 'react'
import { submitProfile, getUserProfile } from '@/app/actions/profile'
import { BELTS } from '@/lib/data'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile()
        if (data) {
          setProfile(data)
        } else {
          router.replace('/onboarding')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsFetching(false)
      }
    }
    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      await submitProfile(formData)
      setSuccess('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
         <div className="font-black uppercase tracking-widest animate-pulse">Carregando Perfil...</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center bg-white min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-lg bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Meu Perfil</h2>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-600 text-red-900 px-4 py-3 font-bold mb-4 uppercase text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-2 border-green-600 text-green-900 px-4 py-3 font-bold mb-4 uppercase text-sm">
            {success}
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
              defaultValue={profile?.full_name}
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="birthDate">Data de Nascimento</label>
            <input 
              id="birthDate" 
              name="birthDate" 
              type="date" 
              required 
              defaultValue={profile?.birth_date}
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black uppercase text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="dojoName">Dojo Principal</label>
            <input 
              id="dojoName" 
              name="dojoName" 
              type="text" 
              required 
              defaultValue={profile?.dojo_name}
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="beltId">Faixa Atual</label>
            <select 
              id="beltId" 
              name="beltId" 
              required 
              defaultValue={profile?.belt_id || ''}
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black uppercase text-sm bg-white"
            >
              <option value="" disabled>Selecione sua faixa</option>
              {BELTS.map(belt => (
                <option key={belt.id} value={belt.id}>Faixa {belt.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="graduationDate">Graduou em (Mês/Ano)</label>
            <input 
              id="graduationDate" 
              name="graduationDate" 
              type="month" 
              defaultValue={profile?.belt_graduation_date?.slice(0, 7) || ''}
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black uppercase text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 border-4 border-black bg-black text-white font-black uppercase py-4 hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
