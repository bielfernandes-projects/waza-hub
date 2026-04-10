'use client'

import { useState } from 'react'
import { resetPasswordForEmail } from '@/app/actions/auth'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await resetPasswordForEmail(formData, window.location.origin)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center bg-neutral-100 min-h-screen">
      <div className="mb-8 relative h-20 w-48">
        <Image src="/logo.png" alt="WazaHub Logo" fill className="object-contain" priority />
      </div>

      <div className="w-full max-w-sm bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {success ? (
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">E-mail Enviado</h2>
            <div className="bg-green-100 border-2 border-green-600 text-green-900 px-4 py-4 font-bold mb-6 text-sm">
              Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
            </div>
            <Link href="/login" className="font-black uppercase tracking-widest text-sm underline hover:no-underline">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Recuperar Senha</h2>
            <p className="font-bold opacity-60 mb-6 text-sm">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </p>

            {error && (
              <div className="bg-red-100 border-2 border-red-600 text-red-900 px-4 py-3 font-bold mb-4 uppercase text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="font-bold text-sm uppercase mb-1" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 border-4 border-black bg-black text-white font-black uppercase py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperacao'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-bold opacity-70">
              <Link href="/login" className="underline hover:no-underline">
                Voltar ao login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
