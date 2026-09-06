"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingCart, Globe, RefreshCw } from "lucide-react";

interface MetricasData {
  visitantes: number;
  intencion_compra: number;
  tasa_conversion: string;
  ultima_actualizacion?: string;
}

export default function MetricasPage() {
  const [data, setData] = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncTime, setSyncTime] = useState<string>("");

  const fetchMetricas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/metricas", { cache: "no-store" });
      if (res.ok) {
        const json: MetricasData = await res.json();
        setData(json);
        const now = new Date();
        const horaFormateada = now.toLocaleString("es-MX", {
          timeZone: "America/Merida",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setSyncTime(`${horaFormateada} (Hora Mérida)`);
      }
    } catch (e) {
      console.error("Error al cargar métricas:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricas();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#272320] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-[#bae6fd]">
      {/* Contenedor Principal Centrado */}
      <main className="w-full max-w-[820px] flex flex-col items-center text-center gap-6 mx-auto">
        {/* Encabezado Centrado */}
        <header className="w-full bg-white border border-[#e6e0d8] rounded-[20px] p-6 sm:p-8 shadow-[0_10px_25px_-4px_rgba(62,39,25,0.07)] relative overflow-hidden flex flex-col items-center text-center">
          {/* Acento superior tricolor */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c4629] via-[#0284c7] to-[#15803d]" />

          {/* Badge de validación */}
          <div className="inline-flex items-center gap-2 bg-[#faf5ee] text-[#3e2719] border border-[#ebd9c8] px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#15803d] shadow-[0_0_0_3px_rgba(21,128,61,0.25)] animate-pulse" />
            <span>Validación del MVP</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3e2719] tracking-tight leading-tight">
            Visitas y demanda
          </h1>

          <p className="mt-1.5 text-sm sm:text-base text-[#6b635b]">
            Seguimiento en tiempo real de visitantes e intención de compra de{" "}
            <strong className="text-[#3e2719] font-bold">Raíces</strong>.
          </p>

          {/* Barra de Acciones y Estado */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 w-full pt-5 border-t border-[#e6e0d8]">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b635b] bg-[#faf5ee] px-3 py-1.5 rounded-full border border-[#ebd9c8]">
              <span className="w-2 h-2 rounded-full bg-[#15803d]" />
              <span>En línea · Datos al día</span>
            </div>

            <button
              onClick={fetchMetricas}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#075985] active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              title="Recargar métricas ahora"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Actualizando…" : "Actualizar datos"}</span>
            </button>
          </div>
        </header>

        {/* Cuadrícula de Métricas Clave (2 columnas fijas lado a lado) */}
        <section className="grid grid-cols-2 gap-3 sm:gap-5 w-full">
          {/* Tarjeta 1: Visitantes (Azul Cenote) */}
          <article className="bg-white rounded-[20px] p-4 sm:p-6 shadow-[0_10px_25px_-4px_rgba(62,39,25,0.07)] border border-[#bae6fd] border-t-4 border-t-[#0284c7] flex flex-col items-center text-center relative overflow-hidden transition-all hover:-translate-y-1">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 w-full">
              <span className="text-xs sm:text-sm font-bold text-[#6b635b]">
                Total de visitantes
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="mb-4 w-full text-center">
              <div className="text-3xl sm:text-5xl font-extrabold text-[#0284c7] tracking-tight leading-none mb-2">
                {data ? data.visitantes.toLocaleString() : "…"}
              </div>
              <p className="text-xs sm:text-sm text-[#6b635b] leading-snug">
                Personas que abrieron el enlace.
              </p>
            </div>

            <div className="w-full flex items-center justify-center mt-auto">
              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]">
                Tráfico directo
              </span>
            </div>
          </article>

          {/* Tarjeta 2: Intención de Compra (Verde Selva) con Número y Porcentaje */}
          <article className="bg-white rounded-[20px] p-4 sm:p-6 shadow-[0_10px_25px_-4px_rgba(62,39,25,0.07)] border border-[#bbf7d0] border-t-4 border-t-[#15803d] flex flex-col items-center text-center relative overflow-hidden transition-all hover:-translate-y-1">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 w-full">
              <span className="text-xs sm:text-sm font-bold text-[#6b635b]">
                Intención de compra
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="mb-4 w-full text-center">
              <div className="flex flex-wrap items-baseline justify-center gap-1.5 sm:gap-2 mb-2">
                <span className="text-3xl sm:text-5xl font-extrabold text-[#15803d] tracking-tight leading-none">
                  {data ? data.intencion_compra.toLocaleString() : "…"}
                </span>
                <span className="text-lg sm:text-2xl font-bold text-[#15803d]/90">
                  ({data?.tasa_conversion ?? "0%"})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6b635b] leading-snug">
                Personas que llegaron a la etapa de cobro
              </p>
            </div>

            <div className="w-full flex items-center justify-center mt-auto">
              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]">
                Demanda real
              </span>
            </div>
          </article>
        </section>

        {/* Fuente de Datos y Última Sincronización (Centrado) */}
        <section className="bg-white border border-[#e6e0d8] rounded-xl py-3 px-5 sm:py-4 sm:px-6 shadow-xs flex flex-col items-center justify-center gap-1.5 text-center w-full max-w-[480px] mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#3e2719]">
            <Globe className="w-4 h-4 text-[#6c4629]" />
            <h3 className="text-xs sm:text-sm font-bold">
              Fuente de datos (API endpoint)
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-[#6b635b]">
            Última sincronización: {syncTime || "Cargando…"}
          </span>
        </section>
      </main>
    </div>
  );
}
