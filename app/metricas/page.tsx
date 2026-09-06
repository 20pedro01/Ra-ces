"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  RefreshCw, 
  Code2, 
  CheckCircle2, 
  Copy, 
  Globe2, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";

interface MetricasData {
  visitantes: number;
  intencion_compra: number;
  tasa_conversion: string;
  ultima_actualizacion?: string;
  detalles_recientes?: Array<{
    tipo: string;
    fecha: string;
    metadata?: Record<string, unknown>;
  }>;
}

export default function MetricasPage() {
  const { lang } = useLanguage();
  const [data, setData] = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/metricas", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Error al cargar métricas:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      setEndpointUrl(`${window.location.origin}/api/metricas`);
    }
  }, []);

  const embedCodeSnippet = `<!-- Widget Métricas Raíces Viva -->
<div id="raices-metricas-widget" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 440px; padding: 24px; border-radius: 16px; background: #0f172a; color: #f8fafc; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em;">Métricas MVP Raíces</h3>
    <button id="btn-actualizar" onclick="actualizarMetricas()" style="cursor: pointer; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s;">
      🔄 Actualizar datos
    </button>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
    <div style="background: #1e293b; padding: 16px; border-radius: 12px; border: 1px solid #334155;">
      <div style="font-size: 0.78rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Visitantes</div>
      <div id="metricas-visitantes" style="font-size: 2rem; font-weight: 800; color: #38bdf8; margin-top: 6px;">--</div>
    </div>
    
    <div style="background: #1e293b; padding: 16px; border-radius: 12px; border: 1px solid #334155;">
      <div style="font-size: 0.78rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Intención Compra</div>
      <div id="metricas-compras" style="font-size: 2rem; font-weight: 800; color: #4ade80; margin-top: 6px;">--</div>
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: #94a3b8; border-top: 1px solid #334155; padding-top: 12px;">
    <span>Tasa de conversión: <b id="metricas-conversion" style="color: #facc15;">--%</b></span>
    <span id="metricas-hora" style="font-size: 0.75rem;">Pendiente</span>
  </div>
</div>

<script>
  async function actualizarMetricas() {
    const btn = document.getElementById('btn-actualizar');
    const origText = btn.innerHTML;
    btn.innerHTML = '⏳ Cargando...';
    btn.disabled = true;

    try {
      const res = await fetch('${endpointUrl || "https://tu-dominio.com/api/metricas"}', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Error de conexión');
      const data = await res.json();
      
      document.getElementById('metricas-visitantes').innerText = data.visitantes.toLocaleString();
      document.getElementById('metricas-compras').innerText = data.intencion_compra.toLocaleString();
      document.getElementById('metricas-conversion').innerText = data.tasa_conversion || '0%';
      document.getElementById('metricas-hora').innerText = 'Actualizado: ' + new Date().toLocaleTimeString();
    } catch (err) {
      alert('Error al conectar con la API de Raíces: ' + err.message);
    } finally {
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  }

  // Carga automática inicial al abrir el sitio
  actualizarMetricas();
</script>`;

  const [copiedIframe, setCopiedIframe] = useState(false);

  const iframeEmbedCode = `<iframe 
  src="${endpointUrl ? endpointUrl.replace('/api/metricas', '/metricas/embed') : 'https://tu-dominio.com/metricas/embed'}" 
  width="360" 
  height="210" 
  style="border: none; border-radius: 16px; overflow: hidden;"
  title="Métricas de Validación Viva Raíces">
</iframe>`;

  const copyIframeToClipboard = () => {
    navigator.clipboard.writeText(iframeEmbedCode);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === "en" ? "MVP Field Validation Dashboard" : "Panel de Validación de Campo MVP"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-50 tracking-tight">
              {lang === "en" ? "Visitor & Purchase Intent Tracking" : "Seguimiento de Visitantes e Intención de Compra"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
              {lang === "en" 
                ? "Live real-time metrics designed for your external website integration, measuring true market demand with 0% scam risk." 
                : "Métricas en tiempo real diseñadas para ser consumidas desde tu otro sitio web, midiendo demanda real de mercado sin cobros reales."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-900/30 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {lang === "en" ? "Refresh Data" : "Actualizar datos"}
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Visitantes */}
          <div className="relative overflow-hidden bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {lang === "en" ? "Total Visitors" : "Total Visitantes"}
              </span>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-sky-400 tracking-tight">
                {loading && !data ? "--" : data?.visitantes.toLocaleString() ?? 0}
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              {lang === "en" ? "People who opened the link (no login required)" : "Personas que abrieron el enlace (sin requerir iniciar sesión)"}
            </p>
          </div>

          {/* Card 2: Intención de Compra */}
          <div className="relative overflow-hidden bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {lang === "en" ? "Purchase Intent" : "Intención de Compra"}
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight">
                {loading && !data ? "--" : data?.intencion_compra.toLocaleString() ?? 0}
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              {lang === "en" ? "People who reached the checkout / payment stage" : "Personas que llegaron a la etapa de cobro"}
            </p>
          </div>

          {/* Card 3: Tasa de Conversión */}
          <div className="relative overflow-hidden bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {lang === "en" ? "Conversion Rate" : "Tasa de Conversión"}
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 tracking-tight">
                {loading && !data ? "--" : data?.tasa_conversion ?? "0%"}
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              {lang === "en" ? "Percentage of visitors showing clear intent" : "Porcentaje de visitantes con intención clara de pago"}
            </p>
          </div>
        </div>

        {/* API Endpoint & Integration Section */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-100">
                {lang === "en" ? "API Endpoint for External Site" : "Endpoint de API para tu Otro Sitio Web"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                {lang === "en" 
                  ? "CORS enabled (Access-Control-Allow-Origin: *). You can fetch this directly from any external webpage." 
                  : "CORS habilitado (Access-Control-Allow-Origin: *). Puedes consultarlo directamente desde cualquier sitio web externo con fetch()."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs sm:text-sm overflow-x-auto text-sky-400">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-xs">GET</span>
            <span className="select-all">{endpointUrl || "/api/metricas"}</span>
          </div>

          {/* JSON Response Preview */}
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
              {lang === "en" ? "JSON Response Structure:" : "Estructura de respuesta JSON:"}
            </span>
            <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm font-mono text-neutral-300 overflow-x-auto">
{`{
  "visitantes": ${data?.visitantes ?? 0},
  "intencion_compra": ${data?.intencion_compra ?? 0},
  "tasa_conversion": "${data?.tasa_conversion ?? "0%"}",
  "ultima_actualizacion": "${data?.ultima_actualizacion ?? new Date().toISOString()}"
}`}
            </pre>
          </div>
        </div>

        {/* Pure HTML Embed (iframe) */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-[11px] font-bold uppercase mb-1">
                  100% HTML Simple (Sin JavaScript)
                </div>
                <h2 className="text-xl font-bold text-neutral-100">
                  {lang === "en" ? "Simple HTML Code (iFrame)" : "Incrustación en HTML Simple (iFrame)"}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {lang === "en" 
                    ? "Just a single <iframe> tag. No JavaScript required in your other site; works in WordPress, Wix, HTML, Notion, etc." 
                    : "Una sola etiqueta <iframe>. No requiere JavaScript en tu otro sitio; funciona en cualquier HTML, WordPress, Wix, etc."}
                </p>
              </div>
            </div>

            <button
              onClick={copyIframeToClipboard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow"
            >
              {copiedIframe ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{lang === "en" ? "Copied!" : "¡Copiado!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-200" />
                  <span>{lang === "en" ? "Copy HTML Code" : "Copiar HTML Simple"}</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto">
              {iframeEmbedCode}
            </pre>
          </div>

          {/* Vista previa en vivo del widget dentro del dashboard */}
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
              {lang === "en" ? "Live preview:" : "Vista previa en vivo:"}
            </span>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-center sm:justify-start">
              <iframe
                src="/metricas/embed"
                width="360"
                height="210"
                style={{ border: "none", borderRadius: "16px", overflow: "hidden" }}
                title="Vista previa widget métricas"
              />
            </div>
          </div>
        </div>

        {/* Copy-Paste Widget / Script for External Website */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-100">
                  {lang === "en" ? "Copy-Paste Widget for External Site" : "Código Listo para Copiar y Pegar en tu Otro Sitio"}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {lang === "en" 
                    ? "Contains the UI, 'Refresh data' button, and JavaScript ready to display the 2 metrics." 
                    : "Incluye la tarjeta visual, botón de 'Actualizar datos' y JavaScript listo para mostrar las 2 métricas."}
                </p>
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs sm:text-sm transition-all border border-neutral-700 active:scale-95"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">{lang === "en" ? "Copied!" : "¡Copiado!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-400" />
                  <span>{lang === "en" ? "Copy Code Snippet" : "Copiar código HTML/JS"}</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
              {embedCodeSnippet}
            </pre>
          </div>
        </div>

        {/* Explanation of Field Validation */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-sky-950/40 border border-emerald-800/40 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>{lang === "en" ? "Why is this method ethical and safe?" : "¿Por qué este método es seguro y ético?"}</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {lang === "en" 
              ? "In lean startup validation, testing purchase intent directly at the payment button guarantees that recorded interest is genuine, without needing to process real bank charges. The immediate transparent modal informs the user that the platform is in community field testing, guaranteeing $0 MXN charged and offering direct human contact."
              : "En metodologías Lean Startup, medir la intención de compra directamente en el botón de pago garantiza que el interés registrado es genuino, sin necesidad de procesar cargos bancarios reales. El aviso transparente inmediato le garantiza al usuario $0 MXN cobrados y le ofrece contacto directo."}
          </p>
          <div className="pt-2">
            <a
              href="/trip"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>{lang === "en" ? "Test booking flow yourself" : "Probar el flujo de reserva tú mismo"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
