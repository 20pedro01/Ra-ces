#!/usr/bin/env node

/**
 * Script de Generación Estática (SSG) para el Panel de Métricas M-trics
 * Consulta la API de Raíces e inyecta los valores en index.html, metricas-raices.svg y genera metricas-raices.png
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_URL = process.env.API_URL || 'https://viva-raices.vercel.app/api/metricas';
const TEMPLATE_HTML_PATH = path.join(__dirname, 'template.html');
const OUTPUT_HTML_PATH = path.join(__dirname, 'index.html');
const TEMPLATE_SVG_PATH = path.join(__dirname, 'template.svg');
const OUTPUT_SVG_PATH = path.join(__dirname, 'metricas-raices.svg');
const OUTPUT_PNG_PATH = path.join(__dirname, 'metricas-raices.png');

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

  // 1. Inyectar en HTML
  if (fs.existsSync(TEMPLATE_HTML_PATH)) {
    const templateHtml = fs.readFileSync(TEMPLATE_HTML_PATH, 'utf-8');
    const htmlCompilado = templateHtml
      .replace(/\{\{VISITANTES\}\}/g, visitantes)
      .replace(/\{\{INTENCION_COMPRA\}\}/g, intencionCompra)
      .replace(/\{\{CONVERSION\}\}/g, conversion)
      .replace(/\{\{FECHA_ACTUALIZACION\}\}/g, fechaTexto);

    fs.writeFileSync(OUTPUT_HTML_PATH, htmlCompilado, 'utf-8');
    console.log(`🎉 index.html generado con éxito: ${visitantes} visitantes, ${intencionCompra} (${conversion})`);
  }

  // 2. Inyectar en SVG
  if (fs.existsSync(TEMPLATE_SVG_PATH)) {
    const templateSvg = fs.readFileSync(TEMPLATE_SVG_PATH, 'utf-8');
    const svgCompilado = templateSvg
      .replace(/\{\{VISITANTES\}\}/g, visitantes)
      .replace(/\{\{INTENCION_COMPRA\}\}/g, intencionCompra)
      .replace(/\{\{CONVERSION\}\}/g, conversion)
      .replace(/\{\{FECHA_ACTUALIZACION\}\}/g, fechaTexto);

    fs.writeFileSync(OUTPUT_SVG_PATH, svgCompilado, 'utf-8');
    console.log(`🎉 metricas-raices.svg generado con éxito.`);
  }

  // 3. Generar PNG de alta resolución (2000px) para Canva
  try {
    console.log(`🖼️  Generando imagen PNG de alta definición para Canva...`);
    const tempThumb = path.join(__dirname, 'metricas-raices.svg.png');
    execSync(`qlmanage -t -s 2000 -o "${__dirname}" "${OUTPUT_SVG_PATH}"`, { stdio: 'pipe' });

    if (fs.existsSync(tempThumb)) {
      execSync(`python3 -c "
from PIL import Image, ImageChops
im = Image.open('${tempThumb}')
diff = ImageChops.difference(im.convert('RGB'), Image.new('RGB', im.size, (255, 255, 255)))
bbox = diff.getbbox()
if bbox:
    cropped = im.crop(bbox)
    cropped.save('${OUTPUT_PNG_PATH}', 'PNG')
"`);
      fs.unlinkSync(tempThumb);
      console.log(`✅ metricas-raices.png generado con éxito (2000px retina ready).`);
    }
  } catch (err) {
    console.warn(`⚠️ Nota: No se pudo generar el PNG automáticamente (${err.message}).`);
  }
}

build();
