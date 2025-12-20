import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const envAny = (import.meta as any)?.env || {}
  const API_BASE = (typeof envAny.VITE_API_BASE === 'string' && envAny.VITE_API_BASE.length > 0)
    ? envAny.VITE_API_BASE
    : '/api'

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          localStorage.setItem('auth_user', JSON.stringify(data.user))
          setAuthorized(true)
        } else {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          navigate('/login', { replace: true })
        }
      } catch {
        navigate('/login', { replace: true })
      }
    }
    verify()
  }, [navigate])

  if (authorized) return <>{children}</>
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Checking authentication...</div>
    </div>
  )
}
