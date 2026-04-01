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
      className="text-sm font-bold uppercase tracking-wider border-2 border-black px-3 py-1 bg-white hover:bg-black hover:text-white transition-colors"
    >
      Sair
    </button>
  )
}

