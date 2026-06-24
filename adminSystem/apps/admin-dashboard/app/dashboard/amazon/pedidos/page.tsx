"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

interface OrderStats {
  totalPedidos: number;
  totalIngresos: number;
  pendientes: number;
  confirmados: number;
  enviados: number;
  cancelados: number;
}

interface Order {
  id: number;
  external_order_id: string;
  estado: string;
  total: number;
  fecha_pedido: string;
  cliente: string;
  plataforma: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

const estadoColor: Record<string, string> = {
  pendiente:  "bg-amber-100 text-amber-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado:    "bg-purple-100 text-purple-700",
  entregado:  "bg-green-100 text-green-700",
  cancelado:  "bg-red-100 text-red-600",
};

const DAYS_OPTIONS = [
  { label: "7 días",  value: 7  },
  { label: "30 días", value: 30 },
  { label: "90 días", value: 90 },
];

const ESTADO_OPTIONS = ["todos", "pendiente", "confirmado", "enviado", "cancelado"];

export default function AmazonPedidosPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [stats,  setStats]    = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [days,    setDays]    = useState(30);
  const [estado,  setEstado]  = useState("todos");
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [error,   setError]   = useState<string | null>(null);
  const limit = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        days:   String(days),
        estado,
        page:   String(page),
        limit:  String(limit),
      });
      const res = await fetch(`/api/amazon/orders?${params}`);
      if (!res.ok) throw new Error("Error al cargar pedidos");
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [days, estado, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleSync() {
    setSyncing(true);
    try {
      await fetch("/api/amazon/sync?target=orders", { method: "POST" });
      await fetchOrders();
    } finally {
      setSyncing(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos Amazon</h1>
        <Button onClick={handleSync} disabled={syncing} variant="outline" size="sm">
          <RefreshCwIcon className={`size-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Sincronizando..." : "Sincronizar"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tarjetas de stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total pedidos",  value: stats.totalPedidos },
            { label: "Ingresos",       value: fmt(stats.totalIngresos) },
            { label: "Pendientes",     value: stats.pendientes  },
            { label: "Confirmados",    value: stats.confirmados },
            { label: "Enviados",       value: stats.enviados    },
            { label: "Cancelados",     value: stats.cancelados  },
          ].map(({ label, value }) => (
            <Card key={label} className="bg-white/80 shadow-sm">
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-xs text-muted-foreground font-medium">{label}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 text-xl font-bold">{value}</CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Período:</span>
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
        <span className="text-sm text-muted-foreground ml-4">Estado:</span>
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
      </div>

      {/* Tabla */}
      <Card className="bg-white/90 shadow-lg">
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No hay pedidos para los filtros seleccionados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Amazon</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-mono text-xs">{order.external_order_id}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{order.cliente}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${estadoColor[order.estado] ?? ""}`}>
                        {order.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{fmt(order.total)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.fecha_pedido).toLocaleDateString("es-ES")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Mostrando {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline" size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
