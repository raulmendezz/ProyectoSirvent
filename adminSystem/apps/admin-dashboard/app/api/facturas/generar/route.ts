import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const apiPort = process.env.API_PORT ?? "4000";
    const res = await fetch(
      `http://localhost:${apiPort}/api/invoices/generate-pending`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message ?? "Error al generar facturas" },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("Error en /api/facturas/generar:", error);
    return NextResponse.json({ error: "Error al generar facturas" }, { status: 500 });
  }
}
