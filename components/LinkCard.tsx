'use client'

import { FiExternalLink, FiEdit2, FiTrash2, FiLock, FiArrowRight } from 'react-icons/fi'

interface Link {
  id: string
  title: string
  url: string
  editable: boolean
  category?: string
}

interface LinkCardProps {
  link: Link
  onEdit: () => void
  onDelete: () => void
  canEdit: boolean
}

export default function LinkCard({ link, onEdit, onDelete, canEdit }: LinkCardProps) {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  const getDisplayUrl = (url: string, category?: string) => {
    try {
      // Para Instagram, extrair o handle
      if (category === 'insta' || url.includes('instagram.com/')) {
        const match = url.match(/instagram\.com\/([^\/\?]+)/)
        if (match && match[1]) {
          return `@${match[1]}`
        }
      }
      
      // Para outros, mostrar domínio
      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace('www.', '')
      return domain.length > 30 ? domain.substring(0, 30) + '...' : domain
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url
    }
  }

  return (
    <div className="group glass-strong rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-emergency-red/20 hover-lift relative red-glow hover:red-glow-strong">
      {/* Borda gradiente animada vermelha */}
      <div className="absolute inset-0 bg-gradient-to-r from-emergency-red via-emergency-red-dark to-emergency-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
      
      {/* Barra lateral vermelha */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emergency-red via-emergency-red-dark to-emergency-black group-hover:from-emergency-red-glow transition-all duration-300"></div>
      
      <button
        onClick={handleClick}
        className="w-full text-left p-5 hover:bg-emergency-red/5 transition-all duration-300 relative z-10"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg mb-1.5 truncate group-hover:text-emergency-red transition-colors">
              {link.title}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400 truncate font-medium group-hover:text-gray-300 transition-colors">
                {getDisplayUrl(link.url, link.category)}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emergency-red/20 to-emergency-red/10 flex items-center justify-center group-hover:from-emergency-red/30 group-hover:to-emergency-red/20 transition-all duration-300 group-hover:scale-110 border border-emergency-red/20 group-hover:border-emergency-red/40">
              <FiArrowRight className="text-emergency-red text-xl group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </button>
      
      {canEdit && (
        <div className="flex items-center justify-end gap-2 px-5 pb-4 border-t border-emergency-red/10 pt-3 bg-emergency-black/30">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-2.5 text-emergency-red hover:bg-emergency-red/10 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md border border-emergency-red/20 hover:border-emergency-red/40"
            aria-label="Editar link"
          >
            <FiEdit2 className="text-lg" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2.5 text-emergency-red hover:bg-emergency-red/10 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md border border-emergency-red/20 hover:border-emergency-red/40"
            aria-label="Deletar link"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      )}
      
      {!link.editable && !canEdit && (
        <div className="flex items-center justify-end gap-2 px-5 pb-4 border-t border-emergency-red/10 pt-3 bg-emergency-black/30">
          <div className="flex items-center gap-2 text-gray-500">
            <FiLock className="text-sm" />
            <span className="text-xs font-medium">Bloqueado para edição</span>
          </div>
        </div>
      )}
    </div>
  )
}

