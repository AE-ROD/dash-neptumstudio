/**
 * sync-to-prod.ts — Copia toda la data local → producción
 * Uso: npx tsx scripts/sync-to-prod.ts
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { PrismaClient } from '../src/app/generated/client'

function parseEnvFile(path: string): Record<string, string> {
  try {
    return Object.fromEntries(
      readFileSync(path, 'utf8')
        .split('\n')
        .filter(l => l.includes('=') && !l.startsWith('#') && l.trim())
        .map(l => {
          const idx = l.indexOf('=')
          const key = l.slice(0, idx).trim()
          const val = l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
          return [key, val]
        })
    )
  } catch {
    return {}
  }
}

async function main() {
  const root     = resolve(process.cwd())
  const localEnv = parseEnvFile(resolve(root, '.env.local'))
  const prodEnv  = parseEnvFile(resolve(root, '.env.production'))

  const LOCAL_URL = localEnv['DATABASE_URL']
  const PROD_URL  = process.env.PROD_DB || prodEnv['DATABASE_URL']

  if (!LOCAL_URL) { console.error('❌ DATABASE_URL no encontrada en .env.local');                            process.exit(1) }
  if (!PROD_URL)  { console.error('❌ Pasa la URL de producción con: PROD_DB="..." npx tsx scripts/sync-to-prod.ts'); process.exit(1) }

  if (LOCAL_URL === PROD_URL) {
    console.log('⚠️  Local y producción apuntan a la MISMA base de datos.')
    console.log('   Tus datos ya deberían estar visibles en producción.')
    console.log('   Si no los ves, recarga la página de producción.')
    process.exit(0)
  }

  const localHost = LOCAL_URL.split('@')[1]?.split('/')[0] ?? 'local'
  const prodHost  = PROD_URL.split('@')[1]?.split('/')[0]  ?? 'prod'
  console.log(`🔗 Local → ${localHost}`)
  console.log(`🔗 Prod  → ${prodHost}`)

  const localDb = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } })
  const prodDb  = new PrismaClient({ datasources: { db: { url: PROD_URL  } } })

  try {
    console.log('\n📖 Leyendo datos locales…')

    const [pendientes, ideas, eventos, snapshots, proyectos, clientes] = await Promise.all([
      localDb.pending.findMany({ orderBy: { creadoEn: 'asc' } }),
      localDb.idea.findMany({ orderBy: { creadoEn: 'asc' } }),
      localDb.evento.findMany({ orderBy: { fecha: 'asc' } }),
      localDb.instagramSnapshot.findMany({ orderBy: { registradoEn: 'desc' }, take: 1 }),
      localDb.project.findMany({ orderBy: { creadoEn: 'asc' } }),
      localDb.client.findMany({ orderBy: { creadoEn: 'asc' } }),
    ])

    console.log(`  pendientes: ${pendientes.length}`)
    console.log(`  ideas:      ${ideas.length}`)
    console.log(`  eventos:    ${eventos.length}`)
    console.log(`  instagram:  ${snapshots.length}`)
    console.log(`  proyectos:  ${proyectos.length}`)
    console.log(`  clientes:   ${clientes.length}`)

    console.log('\n🚀 Escribiendo en producción…')

    for (const p of pendientes) {
      await prodDb.pending.upsert({
        where:  { id: p.id },
        update: { texto: p.texto, completado: p.completado, estaSemana: p.estaSemana },
        create: { id: p.id, texto: p.texto, completado: p.completado, estaSemana: p.estaSemana },
      })
    }
    console.log(`  ✓ ${pendientes.length} pendientes`)

    for (const i of ideas) {
      await prodDb.idea.upsert({
        where:  { id: i.id },
        update: { texto: i.texto, fuente: i.fuente, etiqueta: i.etiqueta, estado: i.estado, desarrollo: i.desarrollo, proximoPensamiento: i.proximoPensamiento },
        create: { id: i.id, texto: i.texto, fuente: i.fuente, etiqueta: i.etiqueta, estado: i.estado, desarrollo: i.desarrollo, proximoPensamiento: i.proximoPensamiento },
      })
    }
    console.log(`  ✓ ${ideas.length} ideas`)

    for (const e of eventos) {
      await prodDb.evento.upsert({
        where:  { id: e.id },
        update: { titulo: e.titulo, fecha: e.fecha, hora: e.hora, tipo: e.tipo, descripcion: e.descripcion },
        create: { id: e.id, titulo: e.titulo, fecha: e.fecha, hora: e.hora, tipo: e.tipo, descripcion: e.descripcion },
      })
    }
    console.log(`  ✓ ${eventos.length} eventos`)

    if (snapshots[0]) {
      const s = snapshots[0]
      await prodDb.instagramSnapshot.upsert({
        where:  { id: s.id },
        update: { seguidores: s.seguidores, publicaciones: s.publicaciones, alcancePromedio: s.alcancePromedio, crecimientoSemanal: s.crecimientoSemanal },
        create: { id: s.id, seguidores: s.seguidores, publicaciones: s.publicaciones, alcancePromedio: s.alcancePromedio, crecimientoSemanal: s.crecimientoSemanal },
      })
      console.log(`  ✓ Instagram (${s.seguidores} seguidores)`)
    }

    for (const p of proyectos) {
      await prodDb.project.upsert({
        where:  { id: p.id },
        update: { nombre: p.nombre, descripcion: p.descripcion, stack: p.stack, estado: p.estado, area: p.area, progreso: p.progreso, repoUrl: p.repoUrl, ultimaNota: p.ultimaNota, proximoPaso: p.proximoPaso },
        create: { id: p.id, nombre: p.nombre, descripcion: p.descripcion, stack: p.stack, estado: p.estado, area: p.area, progreso: p.progreso, repoUrl: p.repoUrl, ultimaNota: p.ultimaNota, proximoPaso: p.proximoPaso },
      })
    }
    if (proyectos.length) console.log(`  ✓ ${proyectos.length} proyectos`)

    for (const c of clientes) {
      await prodDb.client.upsert({
        where:  { id: c.id },
        update: { nombre: c.nombre, marca: c.marca, tipo: c.tipo, email: c.email, telefono: c.telefono, ciudad: c.ciudad },
        create: { id: c.id, nombre: c.nombre, marca: c.marca, tipo: c.tipo, email: c.email, telefono: c.telefono, ciudad: c.ciudad },
      })
    }
    if (clientes.length) console.log(`  ✓ ${clientes.length} clientes`)

    console.log('\n✅ Sync completado. Recarga neptum-dash.vercel.app')

  } finally {
    await localDb.$disconnect()
    await prodDb.$disconnect()
  }
}

main().catch(e => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
