import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const apiPort = process.env.API_PORT ?? "4000";
    const res = await fetch(
      `http://localhost:${apiPort}/api/invoices/${id}/estado`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: body.estado }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message ?? "Error al actualizar factura" },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("Error en PATCH /api/facturas/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar factura" }, { status: 500 });
  }
}
