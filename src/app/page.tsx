// src/app/page.tsx
import { PanelHeader } from '@/components/layout/PanelHeader'

export default function PaginaPanel() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#EFEFED]">
      <PanelHeader />
      <main className="flex-1 overflow-y-auto px-9 py-5">
        <p style={{ fontFamily: 'var(--font-nunito)' }} className="font-black text-2xl text-[#111]">
          Widgets cargando...
        </p>
      </main>
    </div>
  )
}
