'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center bg-neutral-100 min-h-screen">
      <div className="mb-8 relative h-20 w-48">
        <Image src="/logo.png" alt="WazaHub Logo" fill className="object-contain" priority />
      </div>

      <div className="w-full max-w-sm bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Nova Senha</h2>
        <p className="font-bold opacity-60 mb-6 text-sm">Defina sua nova senha de acesso.</p>

        {error && (
          <div className="bg-red-100 border-2 border-red-600 text-red-900 px-4 py-3 font-bold mb-4 uppercase text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="password">Nova Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-sm uppercase mb-1" htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 border-4 border-black bg-black text-white font-black uppercase py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
