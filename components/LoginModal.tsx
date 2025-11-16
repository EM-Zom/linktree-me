'use client'

import { useState } from 'react'
import { FiX, FiLock, FiUser } from 'react-icons/fi'

interface LoginModalProps {
  onClose: () => void
  onLogin: (isAdmin: boolean) => void
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login')
        setLoading(false)
        return
      }

      // Salvar token/sessão (simplificado - em produção use cookies ou JWT)
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('isAdmin', data.is_admin ? 'true' : 'false')
      
      onLogin(data.is_admin)
      onClose()
    } catch (error) {
      setError('Erro ao conectar com o servidor')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="glass-strong rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-emergency-red/50 animate-slide-in">
        {/* Header */}
        <div className="gradient-animated text-white p-5 flex items-center justify-between border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold mb-1">Login Administrativo</h2>
            <p className="text-xs text-white/80 font-medium">Acesse o painel de administração</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            aria-label="Fechar"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <FiUser className="text-emergency-red" />
                Usuário
              </span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 bg-emergency-black-dark border-2 border-emergency-red/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-red/50 focus:border-emergency-red text-white placeholder-gray-500 transition-all duration-300"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <FiLock className="text-emergency-red" />
                Senha
              </span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-emergency-black-dark border-2 border-emergency-red/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-red/50 focus:border-emergency-red text-white placeholder-gray-500 transition-all duration-300"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-emergency-black-light hover:bg-emergency-black-lighter text-gray-300 hover:text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-emergency-red/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emergency-red to-emergency-red-dark hover:from-emergency-red-glow hover:to-emergency-red text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 red-glow hover:red-glow-strong border border-emergency-red/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

