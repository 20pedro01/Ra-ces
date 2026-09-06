/**
 * Panel de Métricas MVP · Validación en Campo
 * Script para conectar con la API de Raíces y mostrar métricas en tiempo real.
 */

// Elementos del DOM
const elVisitantes = document.getElementById('val-visitantes');
const elCompras = document.getElementById('val-compras');
const elConversion = document.getElementById('val-conversion');
const elBtnActualizar = document.getElementById('btn-actualizar');
const elStatusWrap = document.getElementById('connection-status');
const elStatusText = document.getElementById('status-text');
const elSyncTime = document.getElementById('last-sync-time');
const elApiInput = document.getElementById('api-url-input');
const elBtnGuardarUrl = document.getElementById('btn-guardar-url');

// Clave para almacenar la URL en localStorage
const STORAGE_KEY = 'raices_metrics_api_url';

// URL por defecto (detecta si está en el mismo host o usa fallback)
const DEFAULT_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api/metricas'
  : 'https://viva-raices.vercel.app/api/metricas';

/**
 * Obtiene la URL de la API actualmente configurada
 */
function getApiUrl() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_URL;
}

/**
 * Actualiza el indicador visual de conexión
 */
function setStatus(type, message) {
  elStatusWrap.className = 'connection-status ' + type;
  elStatusText.textContent = message;
}

/**
 * Anima el cambio de un número en pantalla
 */
function animateValue(element, start, end, duration = 800) {
  if (isNaN(start) || isNaN(end)) {
    element.textContent = isNaN(end) ? end : end.toLocaleString();
    return;
  }
  if (start === end) {
    element.textContent = end.toLocaleString();
    return;
  }

  const range = end - start;
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / (range || 1)));
  const timer = setInterval(() => {
    current += increment;
    element.textContent = current.toLocaleString();
    if (current === end) {
      clearInterval(timer);
    }
  }, Math.max(stepTime, 20));
}

/**
 * Consulta la API y actualiza la interfaz
 */
async function cargarMetricas() {
  const url = getApiUrl();
  setStatus('loading', 'Cargando datos...');
  elBtnActualizar.classList.add('loading');
  elBtnActualizar.disabled = true;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    // Extraer valores previos para animación
    const prevVisitantes = parseInt(elVisitantes.textContent.replace(/,/g, '')) || 0;
    const prevCompras = parseInt(elCompras.textContent.replace(/,/g, '')) || 0;

    // Actualizar datos
    animateValue(elVisitantes, prevVisitantes, data.visitantes ?? 0);
    animateValue(elCompras, prevCompras, data.intencion_compra ?? 0);
    if (elConversion) {
      elConversion.textContent = `(${data.tasa_conversion || '0%'})`;
    }

    // Registrar hora
    const now = new Date();
    const horaFormateada = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    elSyncTime.textContent = `Última sincronización: ${horaFormateada}`;

    setStatus('online', 'En línea');
  } catch (error) {
    console.error('Error al consultar métricas:', error);
    setStatus('error', 'Error de conexión');
    elSyncTime.textContent = 'Fallo al conectar con la API';
    
    // Si falló y nunca se cargó nada, mostrar aviso
    if (elVisitantes && elVisitantes.textContent === '--') {
      elVisitantes.textContent = '0';
    }
    if (elCompras && elCompras.textContent === '--') {
      elCompras.textContent = '0';
    }
  } finally {
    if (elBtnActualizar) {
      elBtnActualizar.classList.remove('loading');
      elBtnActualizar.disabled = false;
    }
  }
}

/**
 * Inicialización al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
  if (elApiInput) {
    elApiInput.value = getApiUrl();
  }

  if (elBtnActualizar) {
    elBtnActualizar.addEventListener('click', () => {
      cargarMetricas();
    });
  }

  if (elBtnGuardarUrl && elApiInput) {
    elBtnGuardarUrl.addEventListener('click', () => {
      const nuevaUrl = elApiInput.value.trim();
      if (!nuevaUrl) {
        alert('Por favor ingresa una URL válida');
        return;
      }
      localStorage.setItem(STORAGE_KEY, nuevaUrl);
      alert('URL guardada correctamente. Actualizando métricas...');
      cargarMetricas();
    });
  }

  // Primera carga automática al abrir el dashboard
  cargarMetricas();
});
