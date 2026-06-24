// src/DashboardLayout.tsx
// Fix #2: eliminado export metadata (no tiene efecto fuera de app/)
// Fix #3: usando SidebarMenuButton con render prop en lugar de <a> directo
// Fix #5: usando Link de Next.js en lugar de <a> para navegación client-side

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { HomeIcon, UsersIcon, SettingsIcon, LogOutIcon, ShoppingCartIcon, PackageIcon, FileTextIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard",                    label: "Inicio",          icon: HomeIcon         },
  { href: "/dashboard/amazon/pedidos",     label: "Pedidos Amazon",  icon: ShoppingCartIcon },
  { href: "/dashboard/amazon/inventario",  label: "Inventario FBA",  icon: PackageIcon      },
  { href: "/dashboard/facturas",           label: "Facturas",        icon: FileTextIcon     },
  { href: "/dashboard/users",              label: "Usuarios",        icon: UsersIcon        },
  { href: "/dashboard/settings",           label: "Configuración",   icon: SettingsIcon     },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="p-4 text-xl font-bold">Sirvent</SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  {/* Fix #3 y #5: SidebarMenuButton con Link para routing correcto y estilos activos */}
                  <SidebarMenuButton
                    isActive={pathname === href}
                    render={<Link href={href} />}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="gap-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOutIcon className="size-4" />
              <span>Cerrar sesión</span>
            </button>
            <SidebarTrigger />
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
