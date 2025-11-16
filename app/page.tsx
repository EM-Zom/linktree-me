'use client'

import { useState, useEffect } from 'react'
import { FiLink, FiSettings } from 'react-icons/fi'
import LinkCard from '@/components/LinkCard'
import LinkForm from '@/components/LinkForm'
import AdminPanel from '@/components/AdminPanel'

interface Link {
  id: string
  title: string
  url: string
  editable: boolean
}

export default function Home() {
  const [links, setLinks] = useState<Link[]>([])
  const [activeTab, setActiveTab] = useState<'links' | 'edit' | 'admin'>('links')
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    // Verificar se é admin (em produção, isso viria de uma API de autenticação)
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setIsAdmin(adminStatus)
    
    // Carregar links
    loadLinks()
  }, [])

  const loadLinks = async () => {
    try {
      const response = await fetch('/api/links')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      console.error('Erro ao carregar links:', error)
    }
  }

  const handleAddLink = async (link: Omit<Link, 'id'>) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      })
      if (response.ok) {
        loadLinks()
        setActiveTab('links')
        setEditingLink(null)
      }
    } catch (error) {
      console.error('Erro ao adicionar link:', error)
    }
  }

  const handleUpdateLink = async (id: string, link: Omit<Link, 'id'>) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      })
      if (response.ok) {
        loadLinks()
        setActiveTab('links')
        setEditingLink(null)
      }
    } catch (error) {
      console.error('Erro ao atualizar link:', error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        loadLinks()
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error)
    }
  }

  const handleEditClick = (link: Link) => {
    if (link.editable || isAdmin) {
      setEditingLink(link)
      setActiveTab('edit')
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-emergency-red to-emergency-orange text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <FiLink className="text-2xl" />
              </div>
              <h1 className="text-xl font-bold">Links Emergência</h1>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                aria-label="Painel Administrativo"
              >
                <FiSettings className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-md">
          <button
            onClick={() => {
              setActiveTab('links')
              setEditingLink(null)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'links'
                ? 'bg-emergency-red text-white shadow-md'
                : 'text-gray-700 hover:bg-red-50'
            }`}
          >
            Links
          </button>
          <button
            onClick={() => {
              setActiveTab('edit')
              setEditingLink(null)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'edit'
                ? 'bg-emergency-red text-white shadow-md'
                : 'text-gray-700 hover:bg-red-50'
            }`}
          >
            {editingLink ? 'Editar' : 'Adicionar'}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'links' && (
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-lg shadow-md">
                <FiLink className="text-5xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum link disponível</p>
                <p className="text-sm text-gray-500 mt-2">
                  Adicione links na aba "Adicionar"
                </p>
              </div>
            ) : (
              links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onEdit={() => handleEditClick(link)}
                  onDelete={() => handleDeleteLink(link.id)}
                  canEdit={link.editable || isAdmin}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
            <LinkForm
              link={editingLink}
              onSubmit={editingLink ? 
                (link) => handleUpdateLink(editingLink.id, link) :
                handleAddLink
              }
              onCancel={() => {
                setEditingLink(null)
                setActiveTab('links')
              }}
            />
          </div>
        )}
      </main>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel
          links={links}
          onClose={() => setShowAdminPanel(false)}
          onUpdate={loadLinks}
        />
      )}
    </div>
  )
}

