'use client'

import { useState, useEffect } from 'react'
import { FiSave, FiX } from 'react-icons/fi'

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {link ? 'Editar Link' : 'Adicionar Novo Link'}
        </h2>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-emergency-red'
          }`}
          placeholder="Ex: Protocolo de Emergência"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.url
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-emergency-red'
          }`}
          placeholder="Ex: exemplo.com ou https://exemplo.com"
        />
        {errors.url && (
          <p className="text-red-500 text-sm mt-1">{errors.url}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-emergency-red hover:bg-emergency-red-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <FiSave />
          {link ? 'Salvar Alterações' : 'Adicionar Link'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <FiX />
          Cancelar
        </button>
      </div>
    </form>
  )
}

