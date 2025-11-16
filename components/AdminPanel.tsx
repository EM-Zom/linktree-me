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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="glass-strong rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-white/50 animate-slide-in">
        {/* Header */}
        <div className="gradient-animated text-white p-5 flex items-center justify-between border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold mb-1">Painel Administrativo</h2>
            <p className="text-xs text-white/80 font-medium">Gerenciar permissões de links</p>
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
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Defina quais links podem ser editados por usuários não-administradores. Clique no ícone de cadeado para alternar.
          </p>

          {localLinks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiLock className="text-5xl mx-auto mb-4 text-emergency-red/50" />
              <p className="font-medium text-gray-400">Nenhum link disponível</p>
            </div>
          ) : (
            <div className="space-y-3">
              {localLinks.map((link) => (
                <div
                  key={link.id}
                  className="border-2 border-emergency-red/20 rounded-xl p-4 hover:border-emergency-red/50 hover:bg-emergency-red/5 transition-all duration-300 hover-lift bg-emergency-black-dark/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate mb-1.5">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate font-medium">
                        {link.url}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleEditable(link.id)}
                      className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-110 shadow-md hover:shadow-lg border ${
                        link.editable
                          ? 'bg-emergency-red/20 text-emergency-red hover:bg-emergency-red/30 border-emergency-red/30'
                          : 'bg-emergency-black-light text-emergency-red hover:bg-emergency-black-lighter border-emergency-red/20'
                      }`}
                      aria-label={link.editable ? 'Tornar não editável' : 'Tornar editável'}
                    >
                      {link.editable ? (
                        <FiUnlock className="text-xl" />
                      ) : (
                        <FiLock className="text-xl" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        link.editable
                          ? 'bg-emergency-red/20 text-emergency-red border border-emergency-red/30'
                          : 'bg-emergency-black-light text-emergency-red/70 border border-emergency-red/20'
                      }`}
                    >
                      {link.editable ? '✓ Editável' : '🔒 Bloqueado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-emergency-red/10 p-5 bg-emergency-black-dark/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-emergency-black-light hover:bg-emergency-black-lighter text-gray-300 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-emergency-red/10"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              hasChanges
                ? 'bg-gradient-to-r from-emergency-red to-emergency-red-dark hover:from-emergency-red-glow hover:to-emergency-red text-white shadow-lg hover:shadow-xl hover:scale-105 red-glow hover:red-glow-strong border border-emergency-red/30'
                : 'bg-emergency-black-light text-gray-500 cursor-not-allowed border border-emergency-red/10'
            }`}
          >
            <FiSave className="text-lg" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}

