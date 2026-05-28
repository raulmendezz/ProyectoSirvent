// apps/admin-dashboard/src/app/dashboard/page.tsx

import DashboardLayout from "../../DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { MoreHorizontalIcon } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Ventas Hoy</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">$12,340</CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">1,254</CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Pedidos Pendientes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">23</CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">$84,560</CardContent>
        </Card>
      </div>

      {/* Recent orders table */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pedidos Recientes</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="flex items-center cursor-pointer"><MoreHorizontalIcon /></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Exportar CSV</DropdownMenuItem>
              <DropdownMenuItem>Ver Todos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                  <TableCell>#{1000 + i}</TableCell>
                  <TableCell>Cliente {i}</TableCell>
                  <TableCell>${(100 * i).toFixed(2)}</TableCell>
                  <TableCell>{i % 2 === 0 ? "Enviado" : "Pendiente"}</TableCell>
                  <TableCell>{"2023-01-01"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
