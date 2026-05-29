'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContacts } from '@/hooks/useContacts'

export function ContactosWidget() {
  const { contactos, cargando, crearContacto } = useContacts()

  const [creando,   setCreando]   = useState(false)
  const [nombre,    setNombre]    = useState('')
  const [marca,     setMarca]     = useState('')
  const [correo,    setCorreo]    = useState('')
  const [celular,   setCelular]   = useState('')
  const [guardando, setGuardando] = useState(false)

  async function guardar() {
    if (!nombre.trim()) return
    setGuardando(true)
    try {
      await crearContacto({ nombre, marca: marca || undefined, email: correo || undefined, telefono: celular || undefined })
      setNombre(''); setMarca(''); setCorreo(''); setCelular('')
      setCreando(false)
    } catch { /* silently fail */ }
    finally { setGuardando(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-black text-[14px] text-[#111] tracking-tight" style={{ fontFamily: 'var(--font-nunito)' }}>
            Contactos
          </span>
          <span className="ml-2 text-[11px] text-[#bbb]">{contactos.length}</span>
        </div>
        <button
          onClick={() => setCreando(v => !v)}
          className="text-[11px] font-bold text-[#E63B2E] hover:opacity-70 transition-opacity"
        >
          {creando ? '✕ Cancelar' : '+ Nuevo →'}
        </button>
      </div>

      {/* Formulario nuevo contacto */}
      <AnimatePresence>
        {creando && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 bg-[#FAFAF9] rounded-xl border border-[#EAEAE8] flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre *"
                  className="bg-white border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                />
                <input
                  value={marca}
                  onChange={e => setMarca(e.target.value)}
                  placeholder="Marca / Empresa"
                  className="bg-white border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                />
                <input
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  placeholder="Correo"
                  type="email"
                  className="bg-white border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                />
                <input
                  value={celular}
                  onChange={e => setCelular(e.target.value)}
                  placeholder="Celular"
                  type="tel"
                  className="bg-white border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                />
              </div>
              <button
                onClick={guardar}
                disabled={!nombre.trim() || guardando}
                className="w-full bg-[#111] text-white text-[11px] font-black py-2.5 rounded-lg disabled:opacity-40 transition-opacity"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                {guardando ? 'Guardando...' : 'Agregar contacto →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista */}
      {cargando ? (
        <p className="text-center text-[#ccc] text-[11px] py-8">Cargando...</p>
      ) : contactos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[#ccc] text-[12px]" style={{ fontFamily: 'var(--font-dm-sans)' }}>Sin contactos todavía</p>
          <p className="text-[#ddd] text-[11px] mt-1">Agrega el primero con el botón de arriba</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-0">
          {contactos.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 py-3 border-b border-[#F5F5F3] last:border-0"
            >
              {/* Avatar inicial */}
              <div className="w-8 h-8 rounded-full bg-[#F0F0EE] flex items-center justify-center flex-shrink-0">
                <span className="font-black text-[12px] text-[#555]" style={{ fontFamily: 'var(--font-nunito)' }}>
                  {c.nombre[0]?.toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-[#111] truncate">{c.nombre}</div>
                {c.marca && (
                  <div className="text-[10px] text-[#888] truncate">{c.marca}</div>
                )}
              </div>

              <div className="flex flex-col items-end gap-0.5 text-right">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="text-[10px] text-[#aaa] hover:text-[#111] transition-colors truncate max-w-[140px]">
                    {c.email}
                  </a>
                )}
                {c.telefono && (
                  <a href={`tel:${c.telefono}`} className="text-[10px] text-[#aaa] hover:text-[#111] transition-colors">
                    {c.telefono}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
