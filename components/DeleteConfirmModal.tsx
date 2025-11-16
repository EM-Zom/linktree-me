'use client'

import { FiX, FiTrash2, FiAlertTriangle } from 'react-icons/fi'

interface DeleteConfirmModalProps {
  linkTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ linkTitle, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="glass-strong rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-emergency-red/50 animate-slide-in">
        {/* Header */}
        <div className="gradient-animated text-white p-5 flex items-center justify-between border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <FiAlertTriangle className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Confirmar Exclusão</h2>
              <p className="text-xs text-white/80 font-medium">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            aria-label="Fechar"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-gray-300 mb-4">
            Tem certeza que deseja excluir o link <span className="font-bold text-white">"{linkTitle}"</span>?
          </p>
          <p className="text-sm text-gray-400">
            Esta ação é permanente e não pode ser desfeita.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-emergency-red/10 p-5 bg-emergency-black-dark/50 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-emergency-black-light hover:bg-emergency-black-lighter text-gray-300 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-emergency-red/10"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-emergency-red to-emergency-red-dark hover:from-emergency-red-glow hover:to-emergency-red text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 red-glow hover:red-glow-strong border border-emergency-red/30"
          >
            <FiTrash2 className="text-lg" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

