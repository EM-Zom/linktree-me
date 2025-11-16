'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiX, FiLink2, FiGlobe } from 'react-icons/fi'

interface Link {
  id?: string
  title: string
  url: string
  editable: boolean
}

interface LinkFormProps {
  link: Link | null
  onSubmit: (link: Omit<Link, 'id'>) => void
  onCancel: () => void
}

export default function LinkForm({ link, onSubmit, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({})

  useEffect(() => {
    if (link) {
      setTitle(link.title)
      setUrl(link.url)
    } else {
      setTitle('')
      setUrl('')
    }
    setErrors({})
  }, [link])

  const validateUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { title?: string; url?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!url.trim()) {
      newErrors.url = 'URL é obrigatória'
    } else if (!validateUrl(url)) {
      newErrors.url = 'URL inválida'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    onSubmit({
      title: title.trim(),
      url: formattedUrl,
      editable: link?.editable ?? true,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emergency-red/30 to-emergency-red/10 rounded-2xl mb-4 border border-emergency-red/30 red-glow">
          {link ? (
            <FiLink2 className="text-3xl text-emergency-red" />
          ) : (
            <FiGlobe className="text-3xl text-emergency-red" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {link ? 'Editar Link' : 'Adicionar Novo Link'}
        </h2>
        <p className="text-sm text-gray-400">
          {link ? 'Atualize as informações do link' : 'Preencha os dados abaixo'}
        </p>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
          <span className="flex items-center gap-2">
            <FiLink2 className="text-emergency-red" />
            Título do Link
          </span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3.5 bg-emergency-black-dark border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-500 ${
            errors.title
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-emergency-red/20 focus:ring-emergency-red/50 focus:border-emergency-red'
          }`}
          placeholder="Ex: Protocolo de Reanimação Cardiopulmonar"
        />
        {errors.title && (
          <p className="text-emergency-red text-sm mt-2 font-medium flex items-center gap-1">
            <span>⚠️</span> {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-semibold text-gray-300 mb-2">
          <span className="flex items-center gap-2">
            <FiGlobe className="text-emergency-red" />
            URL do Link
          </span>
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`w-full px-4 py-3.5 bg-emergency-black-dark border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-gray-500 ${
            errors.url
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-emergency-red/20 focus:ring-emergency-red/50 focus:border-emergency-red'
          }`}
          placeholder="exemplo.com ou https://exemplo.com"
        />
        {errors.url && (
          <p className="text-emergency-red text-sm mt-2 font-medium flex items-center gap-1">
            <span>⚠️</span> {errors.url}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-emergency-red to-emergency-red-dark hover:from-emergency-red-glow hover:to-emergency-red text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 red-glow hover:red-glow-strong border border-emergency-red/30"
        >
          <FiSave className="text-lg" />
          {link ? 'Salvar Alterações' : 'Adicionar Link'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-emergency-black-light hover:bg-emergency-black-lighter text-gray-300 hover:text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md border border-emergency-red/10"
        >
          <FiX className="text-lg" />
          Cancelar
        </button>
      </div>
    </form>
  )
}

