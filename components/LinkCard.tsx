'use client'

import { FiExternalLink, FiEdit2, FiTrash2, FiLock } from 'react-icons/fi'

interface Link {
  id: string
  title: string
  url: string
  editable: boolean
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-emergency-red">
      <button
        onClick={handleClick}
        className="w-full text-left p-4 hover:bg-red-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{link.title}</h3>
            <p className="text-sm text-gray-500 truncate mt-1">{link.url}</p>
          </div>
          <FiExternalLink className="text-emergency-red ml-2 flex-shrink-0" />
        </div>
      </button>
      
      {canEdit && (
        <div className="flex items-center justify-end gap-2 px-4 pb-3 border-t border-gray-100 pt-2">
          <button
            onClick={onEdit}
            className="p-2 text-emergency-orange hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="Editar link"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-emergency-red hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Deletar link"
          >
            <FiTrash2 />
          </button>
        </div>
      )}
      
      {!link.editable && !canEdit && (
        <div className="flex items-center justify-end gap-1 px-4 pb-3 border-t border-gray-100 pt-2">
          <FiLock className="text-gray-400 text-sm" />
          <span className="text-xs text-gray-500">Bloqueado</span>
        </div>
      )}
    </div>
  )
}

