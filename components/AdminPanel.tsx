'use client'

import { useState, useEffect } from 'react'
import { FiX, FiLock, FiUnlock, FiSave } from 'react-icons/fi'

interface Link {
  id: string
  title: string
  url: string
  editable: boolean
}

interface AdminPanelProps {
  links: Link[]
  onClose: () => void
  onUpdate: () => void
}

export default function AdminPanel({ links, onClose, onUpdate }: AdminPanelProps) {
  const [localLinks, setLocalLinks] = useState(links)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalLinks(links)
    setHasChanges(false)
  }, [links])

  const toggleEditable = (id: string) => {
    setLocalLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, editable: !link.editable } : link
      )
    )
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      // Atualizar cada link que foi modificado
      const updatePromises = localLinks.map((link) => {
        const originalLink = links.find((l) => l.id === link.id)
        if (originalLink && originalLink.editable !== link.editable) {
          return fetch(`/api/links/${link.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: link.title,
              url: link.url,
              editable: link.editable,
            }),
          })
        }
        return Promise.resolve()
      })

      await Promise.all(updatePromises)
      setHasChanges(false)
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
      alert('Erro ao salvar alterações. Tente novamente.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emergency-red to-emergency-orange text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Painel Administrativo</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-gray-600 mb-4">
            Defina quais links podem ser editados por usuários não-administradores.
          </p>

          {localLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum link disponível
            </div>
          ) : (
            <div className="space-y-3">
              {localLinks.map((link) => (
                <div
                  key={link.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {link.url}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleEditable(link.id)}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        link.editable
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                      aria-label={link.editable ? 'Tornar não editável' : 'Tornar editável'}
                    >
                      {link.editable ? (
                        <FiUnlock className="text-lg" />
                      ) : (
                        <FiLock className="text-lg" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        link.editable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {link.editable ? 'Editável' : 'Bloqueado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              hasChanges
                ? 'bg-emergency-red hover:bg-emergency-red-dark text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSave />
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

