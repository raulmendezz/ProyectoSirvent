import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("target") ?? "all";

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const apiPort = process.env.API_PORT ?? "4000";
    const baseApi = `http://localhost:${apiPort}/api`;

    if (target === "orders" || target === "all") {
      await fetch(`${baseApi}/amazon/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    if (target === "inventory" || target === "all") {
      await fetch(`${baseApi}/amazon/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    return NextResponse.json({ synced: true, target });
  } catch (error) {
    console.error("Error en /api/amazon/sync:", error);
    return NextResponse.json({ error: "Error al sincronizar" }, { status: 500 });
  }
}
