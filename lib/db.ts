// Simulando um banco de dados em memória
// Em produção, isso seria substituído por um banco de dados real

export interface Link {
  id: string
  title: string
  url: string
  editable: boolean
}

let links: Link[] = [
  {
    id: '1',
    title: 'Protocolo de Reanimação',
    url: 'https://www.example.com/protocolo-reanimacao',
    editable: true,
  },
  {
    id: '2',
    title: 'Guia de Emergências Cardíacas',
    url: 'https://www.example.com/emergencias-cardiacas',
    editable: false,
  },
  {
    id: '3',
    title: 'Dosagens de Medicamentos',
    url: 'https://www.example.com/dosagens',
    editable: true,
  },
]

export function getAllLinks(): Link[] {
  return links
}

export function getLinkById(id: string): Link | undefined {
  return links.find((link) => link.id === id)
}

export function createLink(link: Omit<Link, 'id'>): Link {
  const newLink: Link = {
    id: Date.now().toString(),
    ...link,
  }
  links.push(newLink)
  return newLink
}

export function updateLink(id: string, updates: Partial<Omit<Link, 'id'>>): Link | null {
  const linkIndex = links.findIndex((link) => link.id === id)
  if (linkIndex === -1) {
    return null
  }
  links[linkIndex] = { ...links[linkIndex], ...updates }
  return links[linkIndex]
}

export function deleteLink(id: string): boolean {
  const linkIndex = links.findIndex((link) => link.id === id)
  if (linkIndex === -1) {
    return false
  }
  links.splice(linkIndex, 1)
  return true
}

