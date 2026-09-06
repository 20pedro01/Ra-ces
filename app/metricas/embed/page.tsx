"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Users, ShoppingCart, TrendingUp } from "lucide-react";

interface MetricasData {
  visitantes: number;
  intencion_compra: number;
  tasa_conversion: string;
  ultima_actualizacion?: string;
}

export default function MetricasEmbedPage() {
  const [data, setData] = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetricas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/metricas", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Error cargando métricas:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricas();
  }, []);

  return (
    <div className="w-full max-w-sm p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 font-sans shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-800">
        <div>
          <h4 className="text-sm font-bold text-neutral-100 leading-tight">Métricas MVP</h4>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">Validación de campo</span>
        </div>
        <button
          onClick={fetchMetricas}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs transition-all disabled:opacity-50 shadow"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Cargando..." : "Actualizar datos"}</span>
        </button>
      </div>

      {/* Grid de 2 Métricas */}
      <div className="grid grid-cols-2 gap-2.5 my-3">
        <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Visitantes</span>
          </div>
          <div className="mt-1 text-2xl font-extrabold text-sky-400 tracking-tight">
            {loading && !data ? "--" : data?.visitantes.toLocaleString() ?? 0}
          </div>
        </div>

        <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400">
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
            <span>Intención</span>
          </div>
          <div className="mt-1 text-2xl font-extrabold text-emerald-400 tracking-tight">
            {loading && !data ? "--" : data?.intencion_compra.toLocaleString() ?? 0}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-amber-400" />
          <span>Conversión: <strong className="text-amber-400 font-bold">{data?.tasa_conversion ?? "0%"}</strong></span>
        </div>
        <span className="text-[10px] text-neutral-500">Raíces</span>
      </div>
    </div>
  );
}
