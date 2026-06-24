"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileTextIcon, RefreshCwIcon, CheckCircleIcon } from "lucide-react";

interface Stats {
  totalFacturas: number;
  importePendiente: number;
  importeEmitida: number;
  importePagada: number;
  pendientes: number;
  emitidas: number;
  pagadas: number;
  anuladas: number;
}

interface Invoice {
  id: number;
  numero_factura: string;
  total: number;
  estado: "pendiente" | "emitida" | "pagada" | "anulada";
  fecha_emision: string;
  external_order_id: string;
  estado_pedido: string;
  cliente: string;
  plataforma: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  emitida:   "bg-blue-100 text-blue-700",
  pagada:    "bg-green-100 text-green-700",
  anulada:   "bg-red-100 text-red-600",
};

const NEXT_ESTADO: Record<string, { label: string; value: string } | null> = {
  pendiente: { label: "Marcar emitida", value: "emitida" },
  emitida:   { label: "Marcar pagada",  value: "pagada"  },
  pagada:    null,
  anulada:   null,
};

const ESTADO_OPTIONS = ["todas", "pendiente", "emitida", "pagada", "anulada"];
const DAYS_OPTIONS   = [{ label: "30 días", value: 30 }, { label: "90 días", value: 90 }, { label: "1 año", value: 365 }];

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [estado,   setEstado]   = useState("todas");
  const [days,     setDays]     = useState(90);
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const [error,    setError]    = useState<string | null>(null);
  const [toast,    setToast]    = useState<string | null>(null);
  const limit = 20;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        estado, days: String(days), page: String(page), limit: String(limit),
      });
      const res = await fetch(`/api/facturas?${params}`);
      if (!res.ok) throw new Error("Error al cargar facturas");
      const data = await res.json();
      setInvoices(data.invoices ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [estado, days, page]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/facturas/generar", { method: "POST" });
      const data = await res.json();
      if (data.generated > 0) {
        showToast(`✓ ${data.generated} factura(s) generada(s)`);
        await fetchInvoices();
      } else {
        showToast("No hay pedidos nuevos pendientes de facturar");
      }
    } catch {
      setError("Error al generar facturas");
    } finally {
      setGenerating(false);
    }
  }

  async function handleUpdateStatus(id: number, newEstado: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/facturas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newEstado }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      showToast(`Factura marcada como ${newEstado}`);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, estado: newEstado as any } : inv))
      );
    } catch {
      setError("Error al cambiar estado de la factura");
    } finally {
      setUpdating(null);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <CheckCircleIcon className="size-4" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileTextIcon className="size-6" /> Facturas
        </h1>
        <Button onClick={handleGenerate} disabled={generating} size="sm">
          <RefreshCwIcon className={`size-4 mr-2 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generando..." : "Generar facturas pendientes"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="bg-amber-50 border-amber-200 shadow-sm">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-xs text-amber-700 font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-xl font-bold text-amber-700">{stats.pendientes}</p>
              <p className="text-xs text-amber-600">{fmt(stats.importePendiente)}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200 shadow-sm">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-xs text-blue-700 font-medium">Emitidas</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-xl font-bold text-blue-700">{stats.emitidas}</p>
              <p className="text-xs text-blue-600">{fmt(stats.importeEmitida)}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-xs text-green-700 font-medium">Pagadas</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-xl font-bold text-green-700">{stats.pagadas}</p>
              <p className="text-xs text-green-600">{fmt(stats.importePagada)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 shadow-sm">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-xs text-muted-foreground font-medium">Total facturas</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-xl font-bold">{stats.totalFacturas}</p>
              <p className="text-xs text-muted-foreground">{stats.anuladas} anuladas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Estado:</span>
        {ESTADO_OPTIONS.map((e) => (
          <button
            key={e}
            onClick={() => { setEstado(e); setPage(1); }}
            className={`px-3 py-1 rounded-full text-sm font-medium border capitalize transition-colors ${
              estado === e
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white border-border hover:bg-muted"
            }`}
          >
            {e}
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-4">Período:</span>
        {DAYS_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => { setDays(value); setPage(1); }}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              days === value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white border-border hover:bg-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <Card className="bg-white/90 shadow-lg">
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Cargando facturas...</p>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No hay facturas para los filtros seleccionados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pedido Amazon</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => {
                  const next = NEXT_ESTADO[inv.estado];
                  return (
                    <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-mono text-sm font-semibold">{inv.numero_factura}</TableCell>
                      <TableCell className="max-w-[160px] truncate">{inv.cliente}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{inv.external_order_id}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(inv.total)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ESTADO_COLOR[inv.estado] ?? ""}`}>
                          {inv.estado}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inv.fecha_emision).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        {next ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updating === inv.id}
                            onClick={() => handleUpdateStatus(inv.id, next.value)}
                            className="text-xs h-7"
                          >
                            {updating === inv.id ? "..." : next.label}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
