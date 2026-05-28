// src/DashboardLayout.tsx
// Central layout component that provides the sidebar and main content area.
// This component is used by the root app/layout.tsx.

import type { Metadata } from "next";
// import "./globals.css"  // removed: globals.css is imported at root layout
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
import { HomeIcon, UsersIcon, SettingsIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard – Sirvent Admin",
  description: "Panel de administración modernizado",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="p-4 text-xl font-bold">Sirvent</SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                  <a href="/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                    <HomeIcon className="size-4" />
                    <span>Inicio</span>
                  </a>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <a href="/dashboard/users" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                    <UsersIcon className="size-4" />
                    <span>Usuarios</span>
                  </a>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <a href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                    <SettingsIcon className="size-4" />
                    <span>Configuración</span>
                  </a>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarTrigger />
          </SidebarFooter>
        </Sidebar>
        {/* Main content area */}
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
