'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePanelContext } from '@/context/PanelContext'
import { useCotizaciones } from '@/hooks/useCotizaciones'
import { useContacts } from '@/hooks/useContacts'
import { ModalBase } from './ModalBase'
import type { CotizacionEstado, CotizacionItem } from '@/types/panel'

const ESTADOS: CotizacionEstado[] = ['BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA']
const LABEL_ESTADO: Record<CotizacionEstado, string> = {
  BORRADOR: 'Borrador', ENVIADA: 'Enviada', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada',
}
const COLOR_ESTADO: Record<CotizacionEstado, string> = {
  BORRADOR: '#415466', ENVIADA: '#3B5BDB', APROBADA: '#1A7F4B', RECHAZADA: '#C92A2A',
}

// Info fija de NeptumStudio — actualizar cuando tengas datos reales
const NEPTUM = {
  email:    'hola@neptumstudio.com',
  web:      'www.neptumstudio.com',
  telefono: '+56 9 XXXX XXXX',
  pais:     'Santiago, Chile',
}

const itemVacio = (): CotizacionItem => ({ descripcion: '', cantidad: 1, precioUnit: 0 })

function TridentIcon({ size = 20, color = '#F6F4F0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 2 L20 30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 2 L14 10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 2 L26 10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M11 14 L11 28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M29 14 L29 28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M8 30 Q20 36 32 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

type Vista = 'form' | 'preview'

export function CotizacionModal() {
  const { modalAbierto, idSeleccionado, cerrarOverlay } = usePanelContext()
  const { cotizaciones, crearCotizacion, actualizarCotizacion } = useCotizaciones()
  const { contactos } = useContacts()

  const estaAbierto = modalAbierto === 'cotizacion'
  const esEdicion   = !!idSeleccionado
  const cotizacion  = cotizaciones.find(c => c.id === idSeleccionado)

  const [vista,         setVista]         = useState<Vista>('form')
  const [nombreCliente, setNombreCliente] = useState('')
  const [clienteId,     setClienteId]     = useState('')
  const [estado,        setEstado]        = useState<CotizacionEstado>('BORRADOR')
  const [items,         setItems]         = useState<CotizacionItem[]>([itemVacio()])
  const [notas,         setNotas]         = useState('')
  const [validez,       setValidez]       = useState(30)
  const [guardando,     setGuardando]     = useState(false)

  useEffect(() => {
    if (!estaAbierto) { setVista('form'); return }
    if (cotizacion) {
      setNombreCliente(cotizacion.nombreCliente)
      setClienteId(cotizacion.clienteId ?? '')
      setEstado(cotizacion.estado)
      setItems(cotizacion.items.length > 0 ? [...cotizacion.items] : [itemVacio()])
      setNotas(cotizacion.notas ?? '')
    } else {
      setNombreCliente(''); setClienteId(''); setEstado('BORRADOR')
      setItems([itemVacio()]); setNotas(''); setValidez(30)
    }
  }, [estaAbierto, idSeleccionado]) // eslint-disable-line react-hooks/exhaustive-deps

  function seleccionarContacto(id: string) {
    setClienteId(id)
    const c = contactos.find(c => c.id === id)
    if (c) setNombreCliente(c.nombre)
  }

  function actualizarItem(idx: number, campo: keyof CotizacionItem, valor: string | number) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [campo]: valor } : item))
  }

  const total = items.reduce((s, i) => s + Number(i.cantidad) * Number(i.precioUnit), 0)

  async function guardar() {
    if (!nombreCliente.trim()) return
    setGuardando(true)
    try {
      const datos = {
        nombreCliente: nombreCliente.trim(),
        clienteId: clienteId || null,
        estado,
        items: items.filter(i => i.descripcion.trim()),
        notas: notas.trim() || null,
      }
      if (esEdicion && cotizacion) await actualizarCotizacion(cotizacion.id, datos)
      else await crearCotizacion(datos)
      cerrarOverlay()
    } catch { /* silently fail */ }
    finally { setGuardando(false) }
  }

  const numeroCot = cotizacion
    ? `NS-${String(cotizaciones.indexOf(cotizacion) + 1).padStart(3, '0')}`
    : `NS-${String(cotizaciones.length + 1).padStart(3, '0')}`

  const contactoData = contactos.find(c => c.id === clienteId)

  const fechaEmision = new Date()
  const fechaValidez = new Date(fechaEmision)
  fechaValidez.setDate(fechaValidez.getDate() + validez)

  const fmtFecha = (d: Date) => d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

  const itemsFiltrados = items.filter(i => i.descripcion.trim())

  return (
    <ModalBase estaAbierto={estaAbierto}>
      {/* Header del modal */}
      <div className="bg-[#0D1B2A] px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <TridentIcon size={20} color="#F6F4F0" />
        <div className="flex-1">
          <div className="font-semibold text-[12px] text-white tracking-[0.12em] uppercase"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {esEdicion ? 'Editar cotización' : 'Nueva cotización'}
          </div>
          {total > 0 && (
            <div className="text-[12px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              ${total.toLocaleString('es-CL')}
            </div>
          )}
        </div>

        <div className="flex bg-white/10 rounded-full p-0.5">
          {(['form', 'preview'] as Vista[]).map(v => (
            <button key={v} onClick={() => setVista(v)}
              className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                background: vista === v ? '#F6F4F0' : 'transparent',
                color: vista === v ? '#0D1B2A' : '#A7ADBA',
              }}>
              {v === 'form' ? 'Formulario' : 'Vista previa'}
            </button>
          ))}
        </div>

        <button onClick={cerrarOverlay} aria-label="Cerrar"
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-[13px] ml-1">
          ✕
        </button>
      </div>

      {/* Cuerpo */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ── FORMULARIO ── */}
          {vista === 'form' && (
            <motion.div key="form"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="px-6 py-5 flex flex-col gap-5"
            >
              {/* Cliente */}
              <div>
                <label className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest block mb-2"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Cliente
                </label>
                {contactos.length > 0 && (
                  <select value={clienteId} onChange={e => seleccionarContacto(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] outline-none focus:border-[#0D1B2A] mb-2 transition-colors"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    <option value="">Seleccionar contacto...</option>
                    {contactos.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}{c.marca ? ` · ${c.marca}` : ''}</option>
                    ))}
                  </select>
                )}
                <input value={nombreCliente} onChange={e => setNombreCliente(e.target.value)}
                  placeholder="Nombre del cliente *"
                  className="w-full bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }} />
              </div>

              {/* Estado + Validez */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest block mb-2"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Estado
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {ESTADOS.map(e => (
                      <button key={e} onClick={() => setEstado(e)}
                        className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full border transition-all"
                        style={{
                          fontFamily: 'var(--font-dm-sans)',
                          borderColor: estado === e ? COLOR_ESTADO[e] : '#E4E8EE',
                          background:  estado === e ? COLOR_ESTADO[e] : 'transparent',
                          color:       estado === e ? 'white' : '#415466',
                        }}>
                        {LABEL_ESTADO[e]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest block mb-2"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Válido por (días)
                  </label>
                  <input value={validez} onChange={e => setValidez(parseInt(e.target.value) || 30)}
                    type="number" min="1" max="365"
                    className="w-full bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] outline-none focus:border-[#0D1B2A] transition-colors"
                    style={{ fontFamily: 'var(--font-dm-sans)' }} />
                </div>
              </div>

              {/* Servicios */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Servicios
                  </label>
                  <button onClick={() => setItems(p => [...p, itemVacio()])}
                    className="text-[10px] font-semibold text-[#0D1B2A] hover:opacity-60 transition-opacity"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    + Agregar línea
                  </button>
                </div>
                <div className="grid grid-cols-[1fr_48px_80px_28px] gap-2 px-1 mb-1">
                  {['Descripción', 'Cant.', 'Precio', ''].map(h => (
                    <span key={h} className="text-[9px] font-bold text-[#C5CBD6] uppercase tracking-widest"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>{h}</span>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_48px_80px_28px] gap-2 items-center">
                      <input value={item.descripcion} onChange={e => actualizarItem(idx, 'descripcion', e.target.value)}
                        placeholder="Ej: Desarrollo web corporativo"
                        className="bg-[#F8F9FB] border border-[#E4E8EE] rounded-lg px-3 py-2 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] outline-none focus:border-[#0D1B2A] transition-colors"
                        style={{ fontFamily: 'var(--font-dm-sans)' }} />
                      <input value={item.cantidad} onChange={e => actualizarItem(idx, 'cantidad', parseInt(e.target.value) || 1)}
                        type="number" min="1"
                        className="bg-[#F8F9FB] border border-[#E4E8EE] rounded-lg px-2 py-2 text-[12px] text-[#0D1B2A] text-center outline-none focus:border-[#0D1B2A] transition-colors"
                        style={{ fontFamily: 'var(--font-dm-sans)' }} />
                      <input value={item.precioUnit || ''} onChange={e => actualizarItem(idx, 'precioUnit', parseFloat(e.target.value) || 0)}
                        placeholder="0" type="number" min="0"
                        className="bg-[#F8F9FB] border border-[#E4E8EE] rounded-lg px-2 py-2 text-[12px] text-[#0D1B2A] outline-none focus:border-[#0D1B2A] transition-colors"
                        style={{ fontFamily: 'var(--font-dm-sans)' }} />
                      {items.length > 1 ? (
                        <button onClick={() => setItems(p => p.filter((_, i) => i !== idx))}
                          className="w-7 h-7 rounded-full bg-[#F0F2F5] hover:bg-[#FFE4E4] text-[#A7ADBA] hover:text-[#C92A2A] transition-colors text-[11px] flex items-center justify-center">
                          ✕
                        </button>
                      ) : <div />}
                    </div>
                  ))}
                </div>
                {total > 0 && (
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#F0F2F5]">
                    <span className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>Total</span>
                    <span className="font-semibold text-[20px] text-[#0D1B2A]"
                      style={{ fontFamily: 'var(--font-cormorant)' }}>
                      ${total.toLocaleString('es-CL')}
                    </span>
                  </div>
                )}
              </div>

              {/* Notas */}
              <div>
                <label className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest block mb-2"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Notas / Condiciones
                </label>
                <textarea value={notas} onChange={e => setNotas(e.target.value)}
                  placeholder="Condiciones de pago, forma de entrega, garantías..."
                  className="w-full bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] resize-none outline-none focus:border-[#0D1B2A] transition-colors h-20"
                  style={{ fontFamily: 'var(--font-dm-sans)' }} />
              </div>
            </motion.div>
          )}

          {/* ── VISTA PREVIA ── */}
          {vista === 'preview' && (
            <motion.div key="preview"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="bg-[#EDECEA] p-4"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#E0DDD8]"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>

                {/* ── CABECERA navy ── */}
                <div className="bg-[#0D1B2A] px-7 pt-5 pb-4 flex items-center justify-between">
                  {/* Logo + nombre */}
                  <div className="flex items-center gap-2.5">
                    <TridentIcon size={30} color="#F6F4F0" />
                    <div>
                      <div className="text-[#F6F4F0] text-[13px] tracking-[0.25em] font-medium uppercase"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        neptumstudio
                      </div>
                      <div className="text-[#A7ADBA] text-[8px] tracking-[0.16em] uppercase mt-0.5"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Soluciones digitales
                      </div>
                    </div>
                  </div>

                  {/* Título + número */}
                  <div className="text-right">
                    <div className="text-[#F6F4F0] font-light leading-none"
                      style={{ fontFamily: 'var(--font-cormorant)', fontSize: '40px', letterSpacing: '-0.01em' }}>
                      Cotización
                    </div>
                    <div className="text-[#A7ADBA] text-[10px] mt-1 tracking-widest"
                      style={{ fontFamily: 'var(--font-outfit)' }}>
                      {numeroCot}
                    </div>
                  </div>
                </div>

                {/* ── 3 COLUMNAS: Remitente · Para · Detalles ── */}
                <div className="grid grid-cols-3 divide-x divide-[#F0EDE8] border-b border-[#F0EDE8]">

                  {/* Col 1 — Remitente */}
                  <div className="px-5 py-4">
                    <div className="text-[8px] font-bold text-[#A7ADBA] uppercase tracking-[0.15em] mb-2.5"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Remitente
                    </div>
                    <div className="text-[14px] font-medium text-[#0D1B2A] mb-2"
                      style={{ fontFamily: 'var(--font-cormorant)', lineHeight: 1.1 }}>
                      NeptumStudio
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {[NEPTUM.email, NEPTUM.web, NEPTUM.telefono, NEPTUM.pais].map(val => (
                        <span key={val} className="text-[10px] text-[#415466]"
                          style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Col 2 — Para (cliente) */}
                  <div className="px-5 py-4">
                    <div className="text-[8px] font-bold text-[#A7ADBA] uppercase tracking-[0.15em] mb-2.5"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Para
                    </div>
                    <div className="text-[14px] font-medium text-[#0D1B2A] mb-2"
                      style={{ fontFamily: 'var(--font-cormorant)', lineHeight: 1.1 }}>
                      {nombreCliente || <span className="text-[#C5CBD6]">—</span>}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {contactoData?.marca && (
                        <span className="text-[10px] text-[#415466]">{contactoData.marca}</span>
                      )}
                      {contactoData?.email && (
                        <span className="text-[10px] text-[#415466]">{contactoData.email}</span>
                      )}
                      {contactoData?.telefono && (
                        <span className="text-[10px] text-[#415466]">{contactoData.telefono}</span>
                      )}
                    </div>
                  </div>

                  {/* Col 3 — Detalles */}
                  <div className="px-5 py-4">
                    <div className="text-[8px] font-bold text-[#A7ADBA] uppercase tracking-[0.15em] mb-2.5"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Detalles
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'N°',           value: numeroCot,               mono: true  },
                        { label: 'Emisión',      value: fmtFecha(fechaEmision),  mono: false },
                        { label: 'Válido hasta', value: fmtFecha(fechaValidez),  mono: false },
                        { label: 'Estado',       value: LABEL_ESTADO[estado],    mono: false, color: COLOR_ESTADO[estado] },
                      ].map(row => (
                        <div key={row.label}>
                          <div className="text-[7.5px] font-bold text-[#C5CBD6] uppercase tracking-widest"
                            style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            {row.label}
                          </div>
                          <div className="text-[10.5px] font-medium mt-0.5"
                            style={{
                              fontFamily: row.mono ? 'var(--font-outfit)' : 'var(--font-dm-sans)',
                              color: row.color ?? '#0D1B2A',
                            }}>
                            {row.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── TABLA DE SERVICIOS ── */}
                <div className="px-7 py-4">
                  {/* Cabecera tabla */}
                  <div className="grid grid-cols-[1fr_44px_80px_80px] gap-3 pb-2 border-b-2 border-[#0D1B2A]">
                    {[
                      { label: 'Descripción', align: 'left'   },
                      { label: 'Cant.',        align: 'center' },
                      { label: 'P. unitario',  align: 'right'  },
                      { label: 'Subtotal',     align: 'right'  },
                    ].map(h => (
                      <span key={h.label}
                        className="text-[8.5px] font-bold text-[#0D1B2A] uppercase tracking-wider"
                        style={{ fontFamily: 'var(--font-dm-sans)', textAlign: h.align as 'left' | 'center' | 'right' }}>
                        {h.label}
                      </span>
                    ))}
                  </div>

                  {/* Filas */}
                  {itemsFiltrados.length > 0 ? itemsFiltrados.map((item, idx) => (
                    <div key={idx}
                      className="grid grid-cols-[1fr_44px_80px_80px] gap-3 py-2 border-b border-[#F5F2EE] items-baseline"
                      style={{ background: idx % 2 === 0 ? 'white' : '#FAFAF8' }}>
                      <span className="text-[11.5px] text-[#0D1B2A]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {item.descripcion}
                      </span>
                      <span className="text-[11px] text-[#415466] text-center"
                        style={{ fontFamily: 'var(--font-outfit)' }}>
                        {item.cantidad}
                      </span>
                      <span className="text-[11px] text-[#415466] text-right"
                        style={{ fontFamily: 'var(--font-outfit)' }}>
                        ${Number(item.precioUnit).toLocaleString('es-CL')}
                      </span>
                      <span className="text-[11px] font-medium text-[#0D1B2A] text-right"
                        style={{ fontFamily: 'var(--font-outfit)' }}>
                        ${(Number(item.cantidad) * Number(item.precioUnit)).toLocaleString('es-CL')}
                      </span>
                    </div>
                  )) : (
                    <div className="py-4 text-center text-[11px] text-[#C5CBD6]"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Sin servicios agregados
                    </div>
                  )}

                  {/* Totales */}
                  <div className="mt-3 flex justify-end">
                    <div className="w-52">
                      {[
                        { label: 'Subtotal', value: `$${total.toLocaleString('es-CL')}`,                    muted: true  },
                        { label: 'IVA 19%',  value: `$${Math.round(total * 0.19).toLocaleString('es-CL')}`, muted: true  },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between py-1.5 border-b border-[#F0EDE8]">
                          <span className="text-[10px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            {row.label}
                          </span>
                          <span className="text-[10px] text-[#415466]" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2.5 items-baseline">
                        <span className="text-[9px] font-bold text-[#0D1B2A] uppercase tracking-widest"
                          style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          Total
                        </span>
                        <span className="text-[22px] font-light text-[#0D1B2A] leading-none"
                          style={{ fontFamily: 'var(--font-outfit)' }}>
                          ${Math.round(total * 1.19).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── NOTAS (sólo si hay) ── */}
                {notas && (
                  <div className="px-7 pb-4">
                    <div className="bg-[#F8F7F4] rounded-lg px-4 py-3 border-l-[3px] border-[#18263B]">
                      <div className="text-[8px] font-bold text-[#A7ADBA] uppercase tracking-[0.15em] mb-1"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Notas y condiciones
                      </div>
                      <p className="text-[10.5px] text-[#415466] leading-relaxed"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {notas}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── FOOTER ── */}
                <div className="bg-[#0D1B2A] px-7 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TridentIcon size={12} color="#415466" />
                    <span className="text-[8px] text-[#415466] tracking-[0.12em] uppercase"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {NEPTUM.email} · {NEPTUM.web}
                    </span>
                  </div>
                  <span className="text-[8.5px] text-[#415466]"
                    style={{ fontFamily: 'var(--font-outfit)' }}>
                    {numeroCot}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer del modal */}
      <div className="px-6 py-4 border-t border-[#F0F2F5] flex justify-between items-center flex-shrink-0">
        <div className="text-[10px] text-[#C5CBD6] font-mono">{numeroCot}</div>
        <div className="flex gap-2">
          <button onClick={cerrarOverlay}
            className="border border-[#E4E8EE] text-[#415466] text-[11px] font-semibold px-4 py-2 rounded-full hover:border-[#0D1B2A] transition-colors"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Cancelar
          </button>
          <button onClick={guardar} disabled={!nombreCliente.trim() || guardando}
            className="text-[11px] font-semibold px-5 py-2 rounded-full disabled:opacity-40 transition-all"
            style={{ fontFamily: 'var(--font-dm-sans)', background: '#0D1B2A', color: '#F6F4F0' }}>
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios →' : 'Crear cotización →'}
          </button>
        </div>
      </div>
    </ModalBase>
  )
}
