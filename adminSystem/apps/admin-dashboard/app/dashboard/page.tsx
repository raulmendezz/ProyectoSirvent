// app/dashboard/page.tsx
// Dashboard con datos reales desde MySQL vía API Routes

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";

// --- Tipos ---
interface Stats {
  ventasHoy:         number;
  usuariosActivos:   number;
  pedidosPendientes: number;
  ingresosMes:       number;
}

interface Order {
  id:                number;
  external_order_id: string;
  estado:            string;
  total:             number;
  fecha_pedido:      string;
  cliente:           string;
  plataforma:        string;
}

// --- Helpers ---
const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

const estadoColor: Record<string, string> = {
  pendiente:  "text-amber-600",
  confirmado: "text-blue-600",
  enviado:    "text-purple-600",
  entregado:  "text-green-600",
  cancelado:  "text-red-500",
};

export default function DashboardPage() {
  const [stats,  setStats]  = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sRes, oRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/orders"),
        ]);

        if (!sRes.ok || !oRes.ok) throw new Error("Error al cargar datos");

        const [sData, oData] = await Promise.all([sRes.json(), oRes.json()]);
        setStats(sData);
        setOrders(oData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader><CardTitle>Ventas Hoy</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">
              {loading ? "—" : fmt(stats?.ventasHoy ?? 0)}
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader><CardTitle>Clientes</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">
              {loading ? "—" : stats?.usuariosActivos ?? 0}
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader><CardTitle>Pedidos Pendientes</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">
              {loading ? "—" : stats?.pedidosPendientes ?? 0}
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader><CardTitle>Ingresos del Mes</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">
              {loading ? "—" : fmt(stats?.ingresosMes ?? 0)}
            </CardContent>
          </Card>
        </div>

        {/* Tabla de pedidos recientes */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recientes</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Opciones" />}>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Exportar CSV</DropdownMenuItem>
                <DropdownMenuItem>Ver Todos</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Cargando pedidos...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No hay pedidos aún.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Externo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-mono text-xs">{order.external_order_id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>{order.plataforma}</TableCell>
                      <TableCell>{fmt(order.total)}</TableCell>
                      <TableCell>
                        <span className={`capitalize font-medium ${estadoColor[order.estado] ?? ""}`}>
                          {order.estado}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(order.fecha_pedido).toLocaleDateString("es-ES")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
  );
}
