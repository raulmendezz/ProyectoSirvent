"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, ShieldIcon } from "lucide-react";

interface WhitelistEntry {
  id: number;
  ip: string;
  label: string | null;
  createdAt: string;
}

export default function SettingsPage() {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIp, setNewIp] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/whitelist");
      if (!res.ok) throw new Error("Error al cargar la lista blanca");
      setEntries(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addEntry(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: newIp, label: newLabel || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Error al añadir IP");
      setNewIp(""); setNewLabel("");
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function removeEntry(id: number) {
    if (!confirm("¿Eliminar esta IP de la lista?")) return;
    try {
      const res = await fetch(`/api/whitelist/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldIcon className="size-5 text-muted-foreground" />
            <CardTitle>Lista Blanca de IPs</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Solo las IPs de esta lista pueden acceder al panel. Los cambios se aplican en máximo 30 segundos.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={addEntry} className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1 flex-1 min-w-40">
              <label className="text-sm font-medium">Dirección IP</label>
              <Input
                value={newIp}
                onChange={e => setNewIp(e.target.value)}
                placeholder="192.168.1.100"
                required
              />
            </div>
            <div className="space-y-1 flex-1 min-w-40">
              <label className="text-sm font-medium">Etiqueta (opcional)</label>
              <Input
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Oficina principal"
              />
            </div>
            <Button type="submit" disabled={saving} size="sm">
              <PlusIcon className="mr-2 size-4" />
              {saving ? "Añadiendo..." : "Añadir IP"}
            </Button>
          </form>

          {loading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Cargando...</p>
          ) : entries.length === 0 ? (
            <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
              No hay IPs en la base de datos. La lista de acceso usa la variable de entorno <code>ALLOWED_IPS</code>.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP</TableHead>
                  <TableHead>Etiqueta</TableHead>
                  <TableHead>Añadida</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">{entry.ip}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.label ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="p-1 text-muted-foreground hover:text-red-600"
                        title="Eliminar"
                      >
                        <TrashIcon className="size-4" />
                      </button>
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
