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

const itemVacio = (): CotizacionItem => ({ descripcion: '', cantidad: 1, precioUnit: 0 })

// Trident SVG inline
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
      setItems([itemVacio()]); setNotas('')
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

  // Número de cotización formateado
  const numeroCot = cotizacion
    ? `NS-${String(cotizaciones.indexOf(cotizacion) + 1).padStart(3, '0')}`
    : `NS-${String(cotizaciones.length + 1).padStart(3, '0')}`

  const contactoData = contactos.find(c => c.id === clienteId)
  const fechaHoy = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <ModalBase estaAbierto={estaAbierto}>
      {/* Header */}
      <div className="bg-[#0D1B2A] px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <TridentIcon size={22} color="#F6F4F0" />
        <div className="flex-1">
          <div className="font-semibold text-[13px] text-white tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.1em' }}>
            {esEdicion ? 'Editar cotización' : 'Nueva cotización'}
          </div>
          {total > 0 && (
            <div className="text-[12px]" style={{ color: '#A7ADBA', fontFamily: 'var(--font-cormorant)' }}>
              Total: ${total.toLocaleString('es-CL')}
            </div>
          )}
        </div>

        {/* Toggle form / preview */}
        <div className="flex bg-white/10 rounded-full p-0.5 gap-0.5">
          {(['form', 'preview'] as Vista[]).map(v => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                background: vista === v ? '#F6F4F0' : 'transparent',
                color: vista === v ? '#0D1B2A' : '#A7ADBA',
              }}
            >
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

              {/* Estado */}
              <div>
                <label className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest block mb-2"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Estado
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ESTADOS.map(e => (
                    <button key={e} onClick={() => setEstado(e)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all"
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

                {/* Cabecera columnas */}
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

                {/* Total */}
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
                  Notas
                </label>
                <textarea value={notas} onChange={e => setNotas(e.target.value)}
                  placeholder="Condiciones de pago, validez de la cotización, aclaraciones..."
                  className="w-full bg-[#F8F9FB] border border-[#E4E8EE] rounded-xl px-3 py-2.5 text-[12px] text-[#0D1B2A] placeholder-[#C5CBD6] resize-none outline-none focus:border-[#0D1B2A] transition-colors h-20"
                  style={{ fontFamily: 'var(--font-dm-sans)' }} />
              </div>
            </motion.div>
          )}

          {/* ── VISTA PREVIA DEL DOCUMENTO ── */}
          {vista === 'preview' && (
            <motion.div key="preview"
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="bg-[#F6F4F0]"
            >
              {/* Documento */}
              <div className="mx-4 my-4 bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E6E0]">

                {/* Cabecera del documento */}
                <div className="bg-[#0D1B2A] px-8 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <TridentIcon size={32} color="#F6F4F0" />
                      <div>
                        <div className="text-white tracking-[0.2em] text-[14px] font-medium uppercase"
                          style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          neptumstudio
                        </div>
                        <div className="text-[#A7ADBA] text-[9px] tracking-widest uppercase mt-0.5"
                          style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          Desarrollamos soluciones digitales
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#F6F4F0] text-[22px] font-light"
                        style={{ fontFamily: 'var(--font-cormorant)' }}>
                        Cotización
                      </div>
                      <div className="text-[#A7ADBA] text-[11px] font-mono mt-0.5">
                        {numeroCot}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info cliente + fecha */}
                <div className="px-8 py-5 grid grid-cols-2 gap-6 border-b border-[#F0EDE8]">
                  <div>
                    <div className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest mb-2"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Para
                    </div>
                    <div className="text-[16px] font-medium text-[#0D1B2A]"
                      style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {nombreCliente || '—'}
                    </div>
                    {contactoData?.marca && (
                      <div className="text-[11px] text-[#415466] mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {contactoData.marca}
                      </div>
                    )}
                    {contactoData?.email && (
                      <div className="text-[10px] text-[#A7ADBA] mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {contactoData.email}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest mb-2"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Fecha
                    </div>
                    <div className="text-[13px] text-[#0D1B2A]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {fechaHoy}
                    </div>
                    <div className="mt-2">
                      <span className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest block"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Estado
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: COLOR_ESTADO[estado], fontFamily: 'var(--font-dm-sans)' }}>
                        {LABEL_ESTADO[estado]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabla de servicios */}
                <div className="px-8 py-5">
                  <div className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest mb-3"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    Servicios
                  </div>

                  {/* Cabecera tabla */}
                  <div className="grid grid-cols-[1fr_60px_80px_80px] gap-2 pb-2 border-b border-[#0D1B2A]">
                    {['Descripción', 'Cant.', 'Precio unit.', 'Subtotal'].map(h => (
                      <span key={h} className="text-[9px] font-bold text-[#0D1B2A] uppercase tracking-wider"
                        style={{ fontFamily: 'var(--font-dm-sans)', textAlign: h !== 'Descripción' ? 'right' : 'left' }}>
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Filas */}
                  {items.filter(i => i.descripcion.trim()).map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_60px_80px_80px] gap-2 py-2.5 border-b border-[#F0EDE8]">
                      <span className="text-[12px] text-[#0D1B2A]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {item.descripcion}
                      </span>
                      <span className="text-[12px] text-[#415466] text-right" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {item.cantidad}
                      </span>
                      <span className="text-[12px] text-[#415466] text-right" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        ${Number(item.precioUnit).toLocaleString('es-CL')}
                      </span>
                      <span className="text-[12px] font-semibold text-[#0D1B2A] text-right" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        ${(Number(item.cantidad) * Number(item.precioUnit)).toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}

                  {items.filter(i => i.descripcion.trim()).length === 0 && (
                    <div className="py-4 text-center text-[11px] text-[#C5CBD6]"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Sin servicios agregados
                    </div>
                  )}

                  {/* Total final */}
                  <div className="flex justify-between items-center pt-3 mt-1">
                    <span className="text-[10px] font-bold text-[#A7ADBA] uppercase tracking-widest"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Total
                    </span>
                    <span className="text-[24px] font-medium text-[#0D1B2A]"
                      style={{ fontFamily: 'var(--font-cormorant)' }}>
                      ${total.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>

                {/* Notas */}
                {notas && (
                  <div className="px-8 pb-5">
                    <div className="bg-[#F8F7F4] rounded-xl px-4 py-3 border-l-2 border-[#A7ADBA]">
                      <div className="text-[9px] font-bold text-[#A7ADBA] uppercase tracking-widest mb-1"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        Notas
                      </div>
                      <p className="text-[11px] text-[#415466] leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {notas}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer del documento */}
                <div className="bg-[#F8F7F4] px-8 py-4 flex items-center justify-between border-t border-[#E8E6E0]">
                  <div className="flex items-center gap-2">
                    <TridentIcon size={14} color="#A7ADBA" />
                    <span className="text-[9px] text-[#A7ADBA] tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      neptumstudio · Desarrollamos soluciones digitales
                    </span>
                  </div>
                  <span className="text-[9px] text-[#C5CBD6] font-mono">{numeroCot}</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer acciones */}
      <div className="px-6 py-4 border-t border-[#F0F2F5] flex justify-between items-center flex-shrink-0">
        <div className="text-[10px] text-[#A7ADBA]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {numeroCot}
        </div>
        <div className="flex gap-2">
          <button onClick={cerrarOverlay}
            className="border border-[#E4E8EE] text-[#415466] text-[11px] font-semibold px-4 py-2 rounded-full hover:border-[#0D1B2A] transition-colors"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Cancelar
          </button>
          <button onClick={guardar} disabled={!nombreCliente.trim() || guardando}
            className="text-[11px] font-semibold px-5 py-2 rounded-full disabled:opacity-40 transition-all"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              background: '#0D1B2A',
              color: '#F6F4F0',
            }}>
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios →' : 'Crear cotización →'}
          </button>
        </div>
      </div>
    </ModalBase>
  )
}
