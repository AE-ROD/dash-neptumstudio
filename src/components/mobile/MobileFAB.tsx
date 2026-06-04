'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SueltaloWidget } from '@/components/widgets/SueltaloWidget'

export function MobileFAB() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Capturar idea o tarea"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '20px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--acc)',
          color: '#fff',
          fontSize: '28px',
          fontWeight: 300,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(230,59,46,0.5)',
          zIndex: 50,
          lineHeight: 1,
        }}
      >
        +
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="fab-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <div
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{
                position: 'relative',
                background: 'var(--bg-2)',
                borderRadius: '20px 20px 0 0',
                padding: '8px 0 0',
                zIndex: 1,
              }}
            >
              <div style={{ width: '36px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 12px' }} />
              <SueltaloWidget />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
