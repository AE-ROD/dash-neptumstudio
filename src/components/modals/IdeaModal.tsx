'use client'
import { usePanelContext } from '@/context/PanelContext'
import { ModalBase } from './ModalBase'

export function IdeaModal() {
  const { modalAbierto, cerrarOverlay } = usePanelContext()
  const estaAbierto = modalAbierto === 'idea'

  return (
    <ModalBase estaAbierto={estaAbierto}>
      <div className="bg-[#111] px-6 py-4 flex items-center justify-between">
        <span className="font-black text-[15px] text-white"
          style={{ fontFamily: 'var(--font-nunito)' }}>
          Desarrollar idea
        </span>
        <button
          onClick={cerrarOverlay}
          aria-label="Cerrar"
          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors text-[13px]"
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-5">
        <p className="text-[13px] text-[#bbb]">Próximamente — ideas desde "Suéltalo"</p>
      </div>
    </ModalBase>
  )
}
