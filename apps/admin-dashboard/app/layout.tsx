import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sirvent Admin",
  description: "Sistema de gestión Sirvent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
