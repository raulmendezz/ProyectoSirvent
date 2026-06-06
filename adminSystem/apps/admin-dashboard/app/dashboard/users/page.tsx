"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PlusIcon, TrashIcon, PencilIcon, XIcon, CheckIcon } from "lucide-react";

type Role = "ADMIN" | "MANAGER" | "VIEWER";

interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
}

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  VIEWER: "Lector",
};

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: "bg-red-100 text-red-700",
  MANAGER: "bg-blue-100 text-blue-700",
  VIEWER: "bg-gray-100 text-gray-600",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New user form
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Role>("VIEWER");
  const [saving, setSaving] = useState(false);

  // Edit role inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<Role>("VIEWER");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Error al cargar usuarios");
      setUsers(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Error al crear usuario");
      setNewEmail(""); setNewPassword(""); setNewRole("VIEWER");
      setShowForm(false);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function updateRole(id: number) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setEditingId(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  async function deleteUser(id: number) {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <PlusIcon className="mr-2 size-4" />
          Nuevo usuario
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Crear nuevo usuario</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={createUser} className="flex flex-wrap gap-3 items-end">
              <div className="space-y-1 flex-1 min-w-48">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="usuario@ejemplo.com" />
              </div>
              <div className="space-y-1 flex-1 min-w-40">
                <label className="text-sm font-medium">Contraseña</label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Rol</label>
                <select
                  className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as Role)}
                >
                  {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Crear"}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No hay usuarios registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            className="flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                            value={editRole}
                            onChange={e => setEditRole(e.target.value as Role)}
                          >
                            {(Object.keys(ROLE_LABELS) as Role[]).map(r => (
                              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                            ))}
                          </select>
                          <button onClick={() => updateRole(user.id)} className="text-green-600 hover:text-green-800">
                            <CheckIcon className="size-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                            <XIcon className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingId(user.id); setEditRole(user.role); }}
                          className="p-1 text-muted-foreground hover:text-foreground"
                          title="Editar rol"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1 text-muted-foreground hover:text-red-600"
                          title="Eliminar"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
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
