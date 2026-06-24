"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCwIcon, AlertTriangleIcon } from "lucide-react";

interface InventoryStats {
  totalSkus: number;
  lowStockCount: number;
  linkedToAmazon: number;
  valorTotal: number;
}

interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  asin: string | null;
  stock: number;
  minStock: number;
  price: number;
  stockStatus: "ok" | "low";
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export default function AmazonInventarioPage() {
  const [items,   setItems]   = useState<InventoryItem[]>([]);
  const [stats,   setStats]   = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search,  setSearch]  = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search)  params.set("q", search);
      if (lowOnly) params.set("lowStock", "true");
      const res = await fetch(`/api/amazon/inventory?${params}`);
      if (!res.ok) throw new Error("Error al cargar inventario");
      const data = await res.json();
      setItems(data.items ?? []);
      setStats(data.stats ?? null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, lowOnly]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  async function handleSync() {
    setSyncing(true);
    try {
      await fetch("/api/amazon/sync?target=inventory", { method: "POST" });
      await fetchInventory();
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario FBA</h1>
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

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total SKUs",       value: stats.totalSkus                        },
            { label: "Stock bajo",       value: stats.lowStockCount, warn: stats.lowStockCount > 0 },
            { label: "Con ASIN Amazon",  value: stats.linkedToAmazon                   },
            { label: "Valor en stock",   value: fmt(stats.valorTotal)                  },
          ].map(({ label, value, warn }) => (
            <Card key={label} className={`shadow-sm ${warn ? "border-amber-300 bg-amber-50" : "bg-white/80"}`}>
              <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center gap-2">
                {warn && <AlertTriangleIcon className="size-4 text-amber-500" />}
                <CardTitle className="text-xs text-muted-foreground font-medium">{label}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 text-xl font-bold">{value}</CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Buscar SKU o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 h-8 text-sm"
        />
        <button
          onClick={() => setLowOnly(!lowOnly)}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors flex items-center gap-1 ${
            lowOnly
              ? "bg-amber-100 text-amber-700 border-amber-300"
              : "bg-white border-border hover:bg-muted"
          }`}
        >
          <AlertTriangleIcon className="size-3" />
          Solo stock bajo
        </button>
      </div>

      {/* Tabla */}
      <Card className="bg-white/90 shadow-lg">
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Cargando inventario...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No hay productos para los filtros seleccionados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>ASIN</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Mín.</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-muted/20 transition-colors ${item.stockStatus === "low" ? "bg-amber-50/60" : ""}`}
                  >
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="max-w-[220px] truncate font-medium">{item.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{item.asin ?? "—"}</TableCell>
                    <TableCell className={`text-right font-bold ${item.stockStatus === "low" ? "text-amber-600" : ""}`}>
                      {item.stock}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.minStock}</TableCell>
                    <TableCell className="text-right">{fmt(item.price)}</TableCell>
                    <TableCell>
                      {item.stockStatus === "low" ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                          <AlertTriangleIcon className="size-3" /> Stock bajo
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-green-600">OK</span>
                      )}
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
