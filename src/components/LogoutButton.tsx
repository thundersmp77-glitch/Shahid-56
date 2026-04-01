'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { ReactNode } from 'react'

export function LogoutButton({ children, className }: { children: ReactNode, className?: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  )
}
