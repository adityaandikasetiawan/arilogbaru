import { useState } from 'react'
import { Toaster, toast } from 'sonner@2.0.3'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Eye, EyeOff, User, Lock } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const envAny = (import.meta as any)?.env || {}
  const API_BASE = (typeof envAny.VITE_API_BASE === 'string' && envAny.VITE_API_BASE.length > 0)
    ? envAny.VITE_API_BASE
    : '/api'

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Toaster position="top-right" richColors />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-100 blur-3xl opacity-40" />
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/80 backdrop-blur w-full max-w-md rounded-2xl shadow-xl border border-gray-100">
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-semibold">LX</div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">Admin Login</h1>
              <p className="text-sm text-gray-600">Masuk untuk mengelola sistem</p>
            </div>
          </div>
        </div>
        <div className="p-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (loading) return
            setLoading(true)
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const email = ((fd.get('email') as string) || '').trim()
            const password = ((fd.get('password') as string) || '').trim()
            if (!email) {
              toast.error('Username/Email wajib diisi')
              setLoading(false)
              return
            }
            if (!password) {
              toast.error('Password wajib diisi')
              setLoading(false)
              return
            }
            try {
              const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
              })
              if (res.ok) {
                const data = await res.json()
                localStorage.setItem('auth_token', data.token)
                localStorage.setItem('auth_user', JSON.stringify(data.user))
                toast.success('Login berhasil')
                navigate('/admin', { replace: true })
              } else {
                let msg = 'Login gagal'
                try {
                  const err = await res.json()
                  msg = err.error || err.detail || msg
                } catch {}
                toast.error(msg)
              }
            } catch (error) {
              toast.error('Gagal terhubung ke server')
            } finally {
              setLoading(false)
            }
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-gray-800 mb-2">Username atau Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-5 h-5" /></span>
              <input name="email" type="text" placeholder="admin atau email" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none placeholder:text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-gray-800 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-5 h-5" /></span>
              <input name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none placeholder:text-gray-400" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              Ingat saya
            </label>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all shadow-sm"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        </div>
      </motion.div>
    </div>
  )
}
