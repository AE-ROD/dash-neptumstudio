'use client'
import { useState, useEffect } from 'react'
import { usePanelContext } from '@/context/PanelContext'
import { useCotizaciones } from '@/hooks/useCotizaciones'
import { useContacts } from '@/hooks/useContacts'
import { ModalBase } from './ModalBase'
import type { CotizacionEstado, CotizacionItem } from '@/types/panel'

const ESTADOS: CotizacionEstado[] = ['BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA']
const LABEL_ESTADO: Record<CotizacionEstado, string> = {
  BORRADOR: 'Borrador', ENVIADA: 'Enviada', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada',
}

const itemVacio = (): CotizacionItem => ({ descripcion: '', cantidad: 1, precioUnit: 0 })

export function CotizacionModal() {
  const { modalAbierto, idSeleccionado, cerrarOverlay } = usePanelContext()
  const { cotizaciones, crearCotizacion, actualizarCotizacion } = useCotizaciones()
  const { contactos } = useContacts()

  const estaAbierto  = modalAbierto === 'cotizacion'
  const esEdicion    = !!idSeleccionado
  const cotizacion   = cotizaciones.find(c => c.id === idSeleccionado)

  const [nombreCliente, setNombreCliente] = useState('')
  const [clienteId,     setClienteId]     = useState<string>('')
  const [estado,        setEstado]         = useState<CotizacionEstado>('BORRADOR')
  const [items,         setItems]          = useState<CotizacionItem[]>([itemVacio()])
  const [notas,         setNotas]          = useState('')
  const [guardando,     setGuardando]      = useState(false)

  // Rellenar al abrir en modo edición
  useEffect(() => {
    if (estaAbierto && cotizacion) {
      setNombreCliente(cotizacion.nombreCliente)
      setClienteId(cotizacion.clienteId ?? '')
      setEstado(cotizacion.estado)
      setItems(cotizacion.items.length > 0 ? cotizacion.items : [itemVacio()])
      setNotas(cotizacion.notas ?? '')
    } else if (estaAbierto && !cotizacion) {
      setNombreCliente(''); setClienteId(''); setEstado('BORRADOR')
      setItems([itemVacio()]); setNotas('')
    }
  }, [estaAbierto, idSeleccionado]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cuando selecciona un contacto, autocompletamos el nombre
  function seleccionarContacto(id: string) {
    setClienteId(id)
    const c = contactos.find(c => c.id === id)
    if (c) setNombreCliente(c.nombre)
  }

  function actualizarItem(idx: number, campo: keyof CotizacionItem, valor: string | number) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [campo]: valor } : item))
  }

  function agregarItem() {
    setItems(prev => [...prev, itemVacio()])
  }

  function eliminarItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const total = items.reduce((sum, item) => sum + (Number(item.cantidad) * Number(item.precioUnit)), 0)

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
      if (esEdicion && cotizacion) {
        await actualizarCotizacion(cotizacion.id, datos)
      } else {
        await crearCotizacion(datos)
      }
      cerrarOverlay()
    } catch { /* silently fail */ }
    finally { setGuardando(false) }
  }

  return (
    <ModalBase estaAbierto={estaAbierto}>
      {/* Header */}
      <div className="bg-[#111] px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-[#E63B2E] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[16px]">$</span>
        </div>
        <div className="flex-1">
          <div className="font-black text-[15px] text-white tracking-tight" style={{ fontFamily: 'var(--font-nunito)' }}>
            {esEdicion ? 'Editar cotización' : 'Nueva cotización'}
          </div>
          {total > 0 && (
            <div className="text-[12px] text-[#aaa]">Total: ${total.toLocaleString('es-CL')}</div>
          )}
        </div>
        <button onClick={cerrarOverlay} aria-label="Cerrar"
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-[13px]">
          ✕
        </button>
      </div>

      {/* Cuerpo */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

        {/* Cliente */}
        <div>
          <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-2">Cliente</span>
          <select
            value={clienteId}
            onChange={e => seleccionarContacto(e.target.value)}
            className="w-full bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] outline-none focus:border-[#111] mb-2"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            <option value="">Seleccionar contacto existente...</option>
            {contactos.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}{c.marca ? ` · ${c.marca}` : ''}</option>
            ))}
          </select>
          <input
            value={nombreCliente}
            onChange={e => setNombreCliente(e.target.value)}
            placeholder="O escribe el nombre del cliente *"
            className="w-full bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          />
        </div>

        {/* Estado */}
        <div>
          <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-2">Estado</span>
          <div className="flex gap-2 flex-wrap">
            {ESTADOS.map(e => (
              <button key={e} onClick={() => setEstado(e)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all
                  ${estado === e ? 'bg-[#111] text-white border-[#111]' : 'border-[#ddd] text-[#888] hover:border-[#111]'}`}>
                {LABEL_ESTADO[e]}
              </button>
            ))}
          </div>
        </div>

        {/* Servicios / Líneas */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest">Servicios</span>
            <button onClick={agregarItem}
              className="text-[10px] font-bold text-[#E63B2E] hover:opacity-70 transition-opacity">
              + Agregar línea
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  value={item.descripcion}
                  onChange={e => actualizarItem(idx, 'descripcion', e.target.value)}
                  placeholder="Descripción del servicio"
                  className="flex-1 bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                />
                <input
                  value={item.cantidad}
                  onChange={e => actualizarItem(idx, 'cantidad', parseInt(e.target.value) || 1)}
                  type="number" min="1"
                  className="w-12 bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-2 py-2 text-[12px] text-[#111] text-center outline-none focus:border-[#111] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                />
                <input
                  value={item.precioUnit || ''}
                  onChange={e => actualizarItem(idx, 'precioUnit', parseFloat(e.target.value) || 0)}
                  placeholder="$"
                  type="number" min="0"
                  className="w-24 bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2 text-[12px] text-[#111] placeholder-[#ccc] outline-none focus:border-[#111] transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                />
                {items.length > 1 && (
                  <button onClick={() => eliminarItem(idx)}
                    className="w-7 h-7 rounded-full bg-[#F5F5F3] text-[#bbb] hover:bg-[#FFEBEE] hover:text-[#E63B2E] transition-colors text-[12px] flex items-center justify-center flex-shrink-0">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          {total > 0 && (
            <div className="flex justify-end mt-3 pt-3 border-t border-[#F5F5F3]">
              <span className="text-[11px] text-[#888] mr-2">Total:</span>
              <span className="font-black text-[14px] text-[#111]" style={{ fontFamily: 'var(--font-nunito)' }}>
                ${total.toLocaleString('es-CL')}
              </span>
            </div>
          )}
        </div>

        {/* Notas */}
        <div>
          <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest block mb-2">Notas</span>
          <textarea
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Condiciones, descuentos, detalles adicionales..."
            className="w-full bg-[#FAFAF9] border border-[#EAEAE8] rounded-lg px-3 py-2.5 text-[12px] text-[#111] placeholder-[#ccc] resize-none outline-none focus:border-[#111] transition-colors h-20"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#F5F5F3] flex justify-end gap-2 flex-shrink-0">
        <button onClick={cerrarOverlay}
          className="border border-[#ddd] text-[#888] text-[11px] font-bold px-4 py-2 rounded-full hover:border-[#111] transition-colors">
          Cancelar
        </button>
        <button onClick={guardar} disabled={!nombreCliente.trim() || guardando}
          className="bg-[#111] text-white text-[11px] font-black px-5 py-2 rounded-full disabled:opacity-40 transition-opacity"
          style={{ fontFamily: 'var(--font-nunito)' }}>
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios →' : 'Crear cotización →'}
        </button>
      </div>
    </ModalBase>
  )
}
