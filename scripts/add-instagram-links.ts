import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://linktree:EnioMz1993@145.223.94.223:54322/linktree',
  ssl: false,
})

const instagramLinks = [
  { handle: 'emergency.talks', name: 'Emergency Talks' },
  { handle: 'patylopesg', name: 'Paty Lopes' },
  { handle: 'e.meme.rgencia', name: 'E.Meme.Rgência' },
  { handle: 'cenariosdeeletro', name: 'Cenários de Eletro' },
  { handle: 'eletro.agora', name: 'Eletro Agora' },
  { handle: 'via.aerea360', name: 'Via Aérea 360' },
  { handle: 'emergencia.omni', name: 'Emergência Omni' },
  { handle: 'the.prehospitalist', name: 'The Prehospitalist' },
  { handle: 'mover.educacao', name: 'Mover Educação' },
  { handle: 'usp.emergencia', name: 'USP Emergência' },
  { handle: 'emergencia101', name: 'Emergência 101' },
  { handle: 'ecmebrasil', name: 'ECME Brasil' },
  { handle: 'iemesp_oficial', name: 'IEMESP Oficial' },
  { handle: 'liviamed.brasil', name: 'LiviaMed Brasil' },
  { handle: 'santaemergencia', name: 'Santa Emergência' },
  { handle: 'toxico.logos', name: 'Tóxico Logos' },
  { handle: 'vireimedicaeagora', name: 'Virei Médica e Agora' },
  { handle: 'emergenciarules', name: 'Emergência Rules' },
  { handle: 'lucas_roddrigues', name: 'Lucas Rodrigues' },
  { handle: 'emergencia.on', name: 'Emergência ON' },
  { handle: 'dradeborahmaccari', name: 'Dra. Déborah Maccari' },
  { handle: 'emergencia.huop', name: 'Emergência HUOP' },
  { handle: 'emergencia.rcp', name: 'Emergência RCP' },
  { handle: 'pocusjedi', name: 'POCUS Jedi' },
  { handle: 'diadeplantao', name: 'Dia de Plantão' },
  { handle: 'emergensimples', name: 'Emergen Simples' },
  { handle: 'quintopilar.ultrassom', name: 'Quinto Pilar Ultrassom' },
  { handle: 'carioca.emergencia', name: 'Carioca Emergência' },
  { handle: 'eu_emergencista', name: 'Eu Emergencista' },
  { handle: 'ufsmerg', name: 'UFSM Emergência' },
  { handle: 'adrielpa94', name: 'Adriel PA' },
  { handle: 'corre_lucao', name: 'Corre Lucão' },
  { handle: 'mesantamarcelina', name: 'Me Santa Marcelina' },
  { handle: 'emergestao', name: 'EmergEstão' },
  { handle: 'medemergencia.hms', name: 'Med Emergência HMS' },
  { handle: 'aquilainstituto', name: 'Aquila Instituto' },
  { handle: 'bolusdeemergencia', name: 'Bolus de Emergência' },
  { handle: 'emergenciahps', name: 'Emergência HPS' },
  { handle: 'emergencia_hcpa', name: 'Emergência HCPA' },
  { handle: 'fullemergency', name: 'Full Emergency' },
  { handle: 'dramarianasarlo', name: 'Dra. Mariana Sarlo' },
  { handle: 'gpioneto', name: 'GP Ioneto' },
  { handle: 'emergenciahiae', name: 'Emergência HIAE' },
  { handle: 'emergencia.idorrj', name: 'Emergência IDOR RJ' },
  { handle: 'emergencia.hcufmg', name: 'Emergência HC UFMG' },
  { handle: 'medicinademergenciaghc', name: 'Medicina de Emergência GHC' },
  { handle: 'emergrajau', name: 'Emerg Rajau' },
  { handle: 'ritmoemergencia', name: 'Ritmo Emergência' },
  { handle: 'emergenciahrsj', name: 'Emergência HRSJ' },
  { handle: 'emergencia360graus', name: 'Emergência 360 Graus' },
  { handle: 'emergenciausprp', name: 'Emergência USP RP' },
  { handle: 'emergenciabarretos', name: 'Emergência Barretos' },
  { handle: 'freitaspriaerospace', name: 'Freitas Pri Aerospace' },
  { handle: 'emergenciahpsbh', name: 'Emergência HPS BH' },
  { handle: 'emergenciacuritiba', name: 'Emergência Curitiba' },
  { handle: 'emergenciahuc', name: 'Emergência HUC' },
  { handle: 'Victorleme1', name: 'Victor Leme' },
  { handle: 'emergenciaunesp', name: 'Emergência UNESP' },
  { handle: 'tsvtraining', name: 'TSV Training' },
  { handle: 'emergenciarisoleta', name: 'Emergência Risoleta' },
  { handle: 'em.flashcards', name: 'EM Flashcards' },
  { handle: 'codigovermelhocursos', name: 'Código Vermelho Cursos' },
  { handle: 'drlucasme', name: 'Dr. Lucas ME' },
  { handle: 'edrevisited', name: 'ED Revisited' },
  { handle: 'emergencia.famerp', name: 'Emergência FAMERP' },
  { handle: 'EM_NervUS', name: 'EM NervUS' },
  { handle: 'emergencia.franca', name: 'Emergência Franca' },
  { handle: 'bougiecast', name: 'Bougie Cast' },
  { handle: 'cafecomemergencia', name: 'Café com Emergência' },
  { handle: 'medicinadeemergenciamoc', name: 'Medicina de Emergência MOC' },
  { handle: 'medicina.emergencia_moc', name: 'Medicina Emergência MOC' },
  { handle: 'journalclubemergencia', name: 'Journal Club Emergência' },
  { handle: 'emergenciaoc', name: 'Emergência OC' },
]

async function addInstagramLinks() {
  const client = await pool.connect()
  
  try {
    console.log('📱 Adicionando links do Instagram...\n')
    
    let added = 0
    let skipped = 0
    
    for (const link of instagramLinks) {
      const url = `https://www.instagram.com/${link.handle}/`
      const title = link.name
      
      // Verificar se o link já existe
      const checkResult = await client.query(
        'SELECT id FROM links WHERE url = $1',
        [url]
      )
      
      if (checkResult.rows.length > 0) {
        console.log(`⏭️  Já existe: ${title}`)
        skipped++
        continue
      }
      
      // Inserir o link
      await client.query(
        'INSERT INTO links (title, url, editable, category) VALUES ($1, $2, $3, $4)',
        [title, url, true, 'insta']
      )
      
      console.log(`✅ Adicionado: ${title} (@${link.handle})`)
      added++
    }
    
    console.log(`\n📊 Resumo:`)
    console.log(`   ✅ Adicionados: ${added}`)
    console.log(`   ⏭️  Já existiam: ${skipped}`)
    console.log(`   📱 Total processados: ${instagramLinks.length}\n`)
    
  } catch (error) {
    console.error('❌ Erro ao adicionar links:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

addInstagramLinks()
  .then(() => {
    console.log('🎉 Processo concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })

