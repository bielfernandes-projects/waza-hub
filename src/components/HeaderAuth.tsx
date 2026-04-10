'use client'

import { useAuth } from '@/components/AuthProvider'

export function HeaderAuth() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div className="h-8"></div> // Placeholder to prevent jump
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <button 
      onClick={handleLogout}
      className="w-full text-left border-l-4 border-black py-3 pl-4 text-2xl font-black uppercase tracking-tighter transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-600"
    >
      Sair
    </button>
  )
}

