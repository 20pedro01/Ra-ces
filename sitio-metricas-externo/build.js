#!/usr/bin/env node

/**
 * Script de Generación Estática (SSG) para el Panel de Métricas M-trics
 * Consulta la API de Raíces e inyecta los valores directamente en index.html
 */

const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'https://viva-raices.vercel.app/api/metricas';
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const OUTPUT_PATH = path.join(__dirname, 'index.html');

async function build() {
  console.log(`📡 Consultando API de métricas: ${API_URL}...`);

  let data;
  try {
    const response = await fetch(API_URL, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    data = await response.json();
    console.log('✅ Datos obtenidos exitosamente:', data);
  } catch (error) {
    console.error('❌ Error al consultar la API:', error.message);
    process.exit(1);
  }

  // Leer la plantilla
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`❌ No se encontró la plantilla en: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  // Formatear valores
  const visitantes = Number(data.visitantes || 0).toLocaleString('es-MX');
  const intencionCompra = Number(data.intencion_compra || 0).toLocaleString('es-MX');
  const conversion = data.tasa_conversion || '0.0%';

  // Fecha y hora local de Mérida / CDMX
  const ahora = new Date();
  const fechaFormateada = ahora.toLocaleString('es-MX', {
    timeZone: 'America/Merida',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const fechaTexto = `${fechaFormateada} (Hora Mérida)`;

  // Inyectar en el HTML
  const htmlCompilado = template
    .replace(/\{\{VISITANTES\}\}/g, visitantes)
    .replace(/\{\{INTENCION_COMPRA\}\}/g, intencionCompra)
    .replace(/\{\{CONVERSION\}\}/g, conversion)
    .replace(/\{\{FECHA_ACTUALIZACION\}\}/g, fechaTexto);

  // Escribir index.html
  fs.writeFileSync(OUTPUT_PATH, htmlCompilado, 'utf-8');
  console.log(`🎉 index.html generado con éxito con datos estáticos:`);
  console.log(`   - Visitantes: ${visitantes}`);
  console.log(`   - Intención de Compra: ${intencionCompra} (${conversion})`);
  console.log(`   - Fecha: ${fechaTexto}`);
}

build();
