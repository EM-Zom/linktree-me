'use client'

import { useState, useEffect, useMemo } from 'react'
import { FiLink, FiSettings, FiHeart, FiZap, FiSearch, FiX } from 'react-icons/fi'
import LinkCard from '@/components/LinkCard'
import LinkForm from '@/components/LinkForm'
import AdminPanel from '@/components/AdminPanel'
import LoginModal from '@/components/LoginModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

interface Link {
  id: string
  title: string
  url: string
  editable: boolean
  category?: string
}

export default function Home() {
  const [links, setLinks] = useState<Link[]>([])
  const [activeTab, setActiveTab] = useState<'links' | 'insta' | 'livro' | 'spotify' | 'edit'>('links')
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [linkToDelete, setLinkToDelete] = useState<Link | null>(null)
  const [previousTab, setPreviousTab] = useState<'links' | 'insta' | 'livro' | 'spotify'>('links')

  useEffect(() => {
    // Verificar se está autenticado
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setIsAdmin(user.is_admin === true)
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('isAdmin')
      }
    } else {
      const adminStatus = localStorage.getItem('isAdmin') === 'true'
      setIsAdmin(adminStatus)
    }
    
    // Carregar links iniciais (normais)
    loadLinks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadLinks = async (category?: string) => {
    try {
      const url = category ? `/api/links?category=${category}` : '/api/links'
      const response = await fetch(url)
      const data = await response.json()
      // Ordenar alfabeticamente
      const sorted = data.sort((a: Link, b: Link) => 
        a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' })
      )
      setLinks(sorted)
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
        const category = link.category || 'normal'
        const tabMap: Record<string, 'links' | 'insta' | 'livro' | 'spotify'> = {
          'insta': 'insta',
          'livro': 'livro',
          'spotify': 'spotify',
          'normal': 'links'
        }
        loadLinks(category === 'normal' ? undefined : category)
        setActiveTab(tabMap[category] || 'links')
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

  const handleDeleteClick = (link: Link) => {
    setLinkToDelete(link)
  }

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return
    
    try {
      const response = await fetch(`/api/links/${linkToDelete.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        const categoryMap: Record<string, string | undefined> = {
          'insta': 'insta',
          'livro': 'livro',
          'spotify': 'spotify',
          'links': undefined
        }
        loadLinks(categoryMap[activeTab] || undefined)
        setLinkToDelete(null)
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error)
    }
  }

  const handleEditClick = (link: Link) => {
    if (link.editable || isAdmin) {
      setEditingLink(link)
      // Atualizar previousTab baseado na categoria do link
      if (link.category === 'insta') {
        setPreviousTab('insta')
      } else if (link.category === 'livro') {
        setPreviousTab('livro')
      } else if (link.category === 'spotify') {
        setPreviousTab('spotify')
      } else {
        setPreviousTab('links')
      }
      setActiveTab('edit')
    }
  }

  // Filtrar links baseado no termo de busca e categoria
  const filteredLinks = useMemo(() => {
    let filtered = links
    
    // Filtrar por categoria
    if (activeTab === 'insta') {
      filtered = links.filter(link => (link.category || 'normal') === 'insta')
    } else if (activeTab === 'livro') {
      filtered = links.filter(link => (link.category || 'normal') === 'livro')
    } else if (activeTab === 'spotify') {
      filtered = links.filter(link => (link.category || 'normal') === 'spotify')
    } else if (activeTab === 'links') {
      filtered = links.filter(link => (link.category || 'normal') === 'normal')
    }
    
    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (link) =>
          link.title.toLowerCase().includes(term) ||
          link.url.toLowerCase().includes(term)
      )
    }
    
    return filtered
  }, [links, searchTerm, activeTab])
  
  // Carregar links quando mudar de aba
  useEffect(() => {
    if (activeTab === 'links' || activeTab === 'insta' || activeTab === 'livro' || activeTab === 'spotify') {
      const categoryMap: Record<string, string | undefined> = {
        'insta': 'insta',
        'livro': 'livro',
        'spotify': 'spotify',
        'links': undefined
      }
      loadLinks(categoryMap[activeTab])
    }
  }, [activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Background decorativo vermelho/preto */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emergency-red/20 rounded-full blur-3xl animate-pulse red-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emergency-red/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emergency-red/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-emergency-black via-emergency-black-dark to-emergency-black text-white shadow-2xl sticky top-0 z-50 border-b-2 border-emergency-red/40 relative overflow-hidden">
        {/* Overlay com gradiente vermelho sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 via-transparent to-emergency-red/10"></div>
        {/* Brilho vermelho no topo */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emergency-red to-transparent"></div>
        
        <div className="container mx-auto px-4 py-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in">
              <div className="bg-emergency-red/30 backdrop-blur-md p-2.5 rounded-xl shadow-lg hover:bg-emergency-red/40 transition-all duration-300 hover:scale-105 border-2 border-emergency-red/50 red-glow">
                <FiZap className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(239, 68, 68, 0.5)' }}>
                  Links Emergência
                </h1>
                <p className="text-xs text-emergency-red font-semibold tracking-wide">Médicos Emergencistas</p>
              </div>
            </div>
            <button
              onClick={() => isAdmin ? setShowAdminPanel(true) : setShowLoginModal(true)}
              className="bg-emergency-red/30 backdrop-blur-md hover:bg-emergency-red/40 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg animate-fade-in-up border-2 border-emergency-red/50 red-glow hover:red-glow-strong"
              aria-label={isAdmin ? "Painel Administrativo" : "Login"}
            >
              <FiSettings className="text-lg text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-md animate-fade-in-up">
        {/* Tabs */}
        <div className="flex gap-1.5 mb-8 glass-strong rounded-2xl p-1 shadow-xl border border-emergency-red/20">
          <button
            onClick={() => {
              setPreviousTab('links')
              setActiveTab('links')
              setEditingLink(null)
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden text-sm ${
              activeTab === 'links'
                ? 'bg-gradient-to-r from-emergency-red to-emergency-red-dark text-white shadow-lg scale-105 red-glow'
                : 'text-gray-300 hover:bg-emergency-red/10 hover:text-white hover:scale-[1.02] border border-emergency-red/10'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <FiLink className="text-base" />
              Links
            </span>
          </button>
          <button
            onClick={() => {
              setPreviousTab('insta')
              setActiveTab('insta')
              setEditingLink(null)
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
              activeTab === 'insta'
                ? 'bg-gradient-to-r from-emergency-red to-emergency-red-dark text-white shadow-lg scale-105 red-glow'
                : 'text-gray-300 hover:bg-emergency-red/10 hover:text-white hover:scale-[1.02] border border-emergency-red/10'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center text-lg">
              📷
            </span>
          </button>
          <button
            onClick={() => {
              setPreviousTab('livro')
              setActiveTab('livro')
              setEditingLink(null)
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
              activeTab === 'livro'
                ? 'bg-gradient-to-r from-emergency-red to-emergency-red-dark text-white shadow-lg scale-105 red-glow'
                : 'text-gray-300 hover:bg-emergency-red/10 hover:text-white hover:scale-[1.02] border border-emergency-red/10'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center text-lg">
              📚
            </span>
          </button>
          <button
            onClick={() => {
              setPreviousTab('spotify')
              setActiveTab('spotify')
              setEditingLink(null)
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
              activeTab === 'spotify'
                ? 'bg-gradient-to-r from-emergency-red to-emergency-red-dark text-white shadow-lg scale-105 red-glow'
                : 'text-gray-300 hover:bg-emergency-red/10 hover:text-white hover:scale-[1.02] border border-emergency-red/10'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center text-lg">
              🎵
            </span>
          </button>
          <button
            onClick={() => {
              setEditingLink(null)
              setActiveTab('edit')
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden text-sm ${
              activeTab === 'edit'
                ? 'bg-gradient-to-r from-emergency-red to-emergency-red-dark text-white shadow-lg scale-105 red-glow'
                : 'text-gray-300 hover:bg-emergency-red/10 hover:text-white hover:scale-[1.02] border border-emergency-red/10'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <FiHeart className="text-base" />
              {editingLink ? 'Editar' : 'Adicionar'}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {(activeTab === 'links' || activeTab === 'insta' || activeTab === 'livro' || activeTab === 'spotify') && (
          <div className="space-y-4">
            {/* Barra de Pesquisa */}
            {filteredLinks.length > 0 && (
              <div className="glass-strong rounded-2xl shadow-xl border border-emergency-red/20 animate-fade-in-up">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-emergency-red text-xl" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar links..."
                    className="w-full pl-12 pr-12 py-3.5 bg-emergency-black-dark border-2 border-emergency-red/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-red/50 focus:border-emergency-red text-white placeholder-gray-500 transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-emergency-red transition-colors"
                      aria-label="Limpar pesquisa"
                    >
                      <FiX className="text-gray-400 hover:text-emergency-red text-xl" />
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div className="px-4 pb-3 pt-2">
                    <p className="text-sm text-gray-400">
                      {filteredLinks.length === 0 ? (
                        <span>Nenhum resultado encontrado</span>
                      ) : (
                        <span>
                          {filteredLinks.length} {filteredLinks.length === 1 ? 'resultado' : 'resultados'} encontrado{filteredLinks.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Lista de Links */}
            {filteredLinks.length === 0 && !searchTerm ? (
              <div className="text-center py-16 glass-strong rounded-2xl shadow-xl border border-emergency-red/20 animate-fade-in-up red-glow">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emergency-red/30 to-emergency-red/10 rounded-2xl mb-6 border border-emergency-red/30">
                  <FiLink className="text-4xl text-emergency-red" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum link disponível</h3>
                <p className="text-gray-400 mb-4">Comece adicionando seus primeiros links</p>
                <button
                  onClick={() => {
                    setActiveTab('edit')
                    setEditingLink(null)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emergency-red to-emergency-red-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 red-glow hover:red-glow-strong border border-emergency-red/30"
                >
                  <FiHeart className="text-lg" />
                  Adicionar Primeiro Link
                </button>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-16 glass-strong rounded-2xl shadow-xl border border-emergency-red/20 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emergency-red/20 to-emergency-red/10 rounded-2xl mb-6 border border-emergency-red/30">
                  <FiSearch className="text-4xl text-emergency-red/70" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-400 mb-4">Tente pesquisar com outros termos</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emergency-black-light hover:bg-emergency-black-lighter text-gray-300 hover:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-emergency-red/20"
                >
                  <FiX className="text-lg" />
                  Limpar Pesquisa
                </button>
              </div>
            ) : (
              filteredLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <LinkCard
                    link={link}
                    onEdit={() => handleEditClick(link)}
                    onDelete={() => handleDeleteClick(link)}
                    canEdit={link.editable || isAdmin}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="glass-strong rounded-2xl shadow-xl p-6 border border-emergency-red/20 animate-fade-in-up red-glow">
            <LinkForm
              link={editingLink}
              defaultCategory={editingLink ? undefined : (previousTab === 'insta' ? 'insta' : previousTab === 'livro' ? 'livro' : previousTab === 'spotify' ? 'spotify' : 'normal')}
              onSubmit={async (link) => {
                if (editingLink) {
                  await handleUpdateLink(editingLink.id, link)
                } else {
                  await handleAddLink(link)
                }
                const category = link.category && link.category !== 'normal' ? link.category : undefined
                loadLinks(category)
              }}
              onCancel={() => {
                setEditingLink(null)
                setActiveTab(previousTab)
              }}
            />
          </div>
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(adminStatus) => {
            setIsAdmin(adminStatus)
            if (adminStatus) {
              setShowLoginModal(false)
              setShowAdminPanel(true)
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {linkToDelete && (
        <DeleteConfirmModal
          linkTitle={linkToDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setLinkToDelete(null)}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel
          links={links}
          onClose={() => setShowAdminPanel(false)}
          onUpdate={() => {
            const categoryMap: Record<string, string | undefined> = {
              'insta': 'insta',
              'livro': 'livro',
              'spotify': 'spotify',
              'links': undefined
            }
            loadLinks(categoryMap[activeTab] || undefined)
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 pb-6 text-center">
        <a
          href="https://LiveNotes.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emergency-black-dark/50 hover:bg-emergency-black-dark/70 border border-emergency-red/10 hover:border-emergency-red/20 rounded-lg text-gray-400 hover:text-gray-300 transition-all duration-300 text-xs font-medium opacity-60 hover:opacity-100 backdrop-blur-sm"
        >
          <span>Teste</span>
          <span className="text-emergency-red/60 hover:text-emergency-red/80 transition-colors">
            LiveNotes
          </span>
        </a>
      </footer>
    </div>
  )
}

