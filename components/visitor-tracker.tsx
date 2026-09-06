'use client'

import { useEffect } from 'react'

export function VisitorTracker() {
  useEffect(() => {
    try {
      // Registrar 1 visita única por sesión de navegador
      const tracked = sessionStorage.getItem('vr_vtrack')
      if (!tracked) {
        sessionStorage.setItem('vr_vtrack', '1')
        fetch('/api/metricas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            evento: 'visita',
            metadata: {
              url: window.location.pathname,
              referrer: document.referrer || null,
              timestamp: new Date().toISOString(),
            },
          }),
        }).catch(() => {
          // Silencioso en caso de desconexión
        })
      }
    } catch {
      // Silencioso si sessionStorage no está disponible
    }
  }, [])

  return null
}
